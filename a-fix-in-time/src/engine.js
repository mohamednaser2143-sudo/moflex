// A Fix In Time — shared scene engine. build.py copies this into every episode and trailer,
// so each HTML file stays self-contained like the Series 1 files.

// ===================== Timing =====================
const SCENE_DURATION_MS = 20000;
function getSceneDurationMs(index) {
    const data = storyData[index];
    if (!data) return SCENE_DURATION_MS;
    const words = `${data.title} ${data.desc}`.trim().split(/\s+/).length;
    const byWords = 2500 + words * 430;
    return Math.max(SCENE_DURATION_MS, Math.min(45000, byWords));
}

// ===================== Renderer, camera, lights =====================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1830);
scene.fog = new THREE.FogExp2(0x1a1830, 0.006);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1200);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const sun = new THREE.DirectionalLight(0xffffff, 1.4);
sun.position.set(40, 80, 40);
sun.castShadow = true;
sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;
sun.shadow.camera.left = -60; sun.shadow.camera.right = 60;
sun.shadow.camera.top = 60; sun.shadow.camera.bottom = -60;
sun.shadow.camera.far = 300;
scene.add(sun);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const hemiLight = new THREE.HemisphereLight(0xcfe3ff, 0x4a3a2a, 0.35);
scene.add(hemiLight);

const worldGround = new THREE.Mesh(
    new THREE.BoxGeometry(600, 2, 600),
    new THREE.MeshStandardMaterial({ color: 0x5ca988, roughness: 0.95 })
);
worldGround.position.y = -1;
worldGround.receiveShadow = true;
scene.add(worldGround);

const KEEP = new Set([worldGround, sun, ambientLight, hemiLight]);

// ===================== Small helpers =====================
let ambientFx = [];
function addFx(fn) { ambientFx.push(fn); }
function makeRand(seed) { let s = seed * 9301 + 49297; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
function lerp(a, b, k) { return a + (b - a) * k; }
function clamp01(v) { return Math.max(0, Math.min(1, v)); }
// 0 before time a, 1 after time b, smooth in between.
function ease(t, a, b) { const k = clamp01((t - a) / (b - a)); return k * k * (3 - 2 * k); }
function lerpAngle(a, b, k) {
    let d = b - a;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return a + d * k;
}

const _mats = {};
function mat(color, o = {}) {
    const k = color + '|' + JSON.stringify(o);
    return _mats[k] || (_mats[k] = new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.8 }, o)));
}
const _glowMats = {};
function glowMat(color, opacity = 1) {
    const k = color + '|' + opacity;
    return _glowMats[k] || (_glowMats[k] = new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity }));
}
function asMat(c, o) { return (typeof c === 'object') ? c : mat(c, o); }
function box(w, h, d, color, x = 0, y = 0, z = 0, o) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), asMat(color, o));
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; return m;
}
function cyl(rt, rb, h, color, x = 0, y = 0, z = 0, seg = 12, o) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), asMat(color, o));
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; return m;
}
function sph(r, color, x = 0, y = 0, z = 0, seg = 12, o) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(6, seg * 0.7 | 0)), asMat(color, o));
    m.position.set(x, y, z); m.castShadow = true; return m;
}
function cone(r, h, color, x = 0, y = 0, z = 0, seg = 8, o) {
    const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), asMat(color, o));
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; return m;
}
function group(...kids) { const g = new THREE.Group(); kids.forEach(k => k && g.add(k)); return g; }
function at(obj, x = 0, y = 0, z = 0, ry = 0, s = 1) { obj.position.set(x, y, z); obj.rotation.y = ry; if (s !== 1) obj.scale.setScalar(s); return obj; }
function add(...objs) { objs.forEach(o => o && scene.add(o)); return objs[0]; }

// Soft round glow used for lamps, gems, portals and stars.
let _glowTex = null;
function glowTexture() {
    if (_glowTex) return _glowTex;
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d'); const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.25, 'rgba(255,255,255,0.6)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
    _glowTex = new THREE.CanvasTexture(c); return _glowTex;
}
function createGlow(color, size = 2, opacity = 0.9) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }));
    s.scale.set(size, size, 1); return s;
}

function textTexture(text, { w = 512, h = 128, bg = '#e5a93b', fg = '#222', border = '#3d2314', font = '900 48px sans-serif' } = {}) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d');
    if (bg) { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
    if (border) { g.strokeStyle = border; g.lineWidth = 12; g.strokeRect(6, 6, w - 12, h - 12); }
    g.fillStyle = fg; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
    String(text).split('\n').forEach((line, i, arr) => g.fillText(line, w / 2, h / 2 + (i - (arr.length - 1) / 2) * (h / (arr.length + 0.6))));
    return new THREE.CanvasTexture(c);
}
function createSign(text, w = 6, h = 1.5, opts = {}) {
    const front = new THREE.MeshStandardMaterial({ map: textTexture(text, opts), roughness: 0.8 });
    const side = mat(opts.side || 0x5a3a22);
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.15), [side, side, side, side, front, side]);
    m.castShadow = true; return m;
}

// ===================== Characters =====================
// Blocky R6 people, same proportions as Series 1. Options pick clothes, hair and hats.
function createPerson(o = {}) {
    const {
        shirt = 0x5b7fa6, legs = 0x2b2d42, skin = 0xe0ac69, sleeves = null,
        hair = null, hairStyle = 'short', hat = null, hatColor = null,
        beard = null, child = false, scale = 1, coat = null, shoes = 0x2a2018,
        belt = null, apron = null, glasses = false, star = false, sash = null, vest = null
    } = o;
    const avatar = new THREE.Group();
    const inner = new THREE.Group(); // scaled body, so avatar.scale stays free for scenes
    const s = (child ? 0.72 : 1) * scale;
    inner.scale.setScalar(s);
    avatar.add(inner);

    const torso = box(2, 2, 1, shirt, 0, 3, 0);
    inner.add(torso);
    if (vest) { inner.add(box(2.06, 1.9, 1.06, vest, 0, 3.02, 0)); inner.add(box(0.7, 1.9, 1.1, shirt, 0, 3.02, 0)); }
    if (belt) inner.add(box(2.06, 0.25, 1.06, belt, 0, 2.15, 0));
    if (apron) inner.add(box(1.6, 2.4, 0.08, apron, 0, 2.3, 0.54));
    if (sash) { const sh = box(0.35, 2.6, 1.08, sash, 0, 3, 0); sh.rotation.z = 0.7; inner.add(sh); }
    if (star) { const st = cyl(0.22, 0.22, 0.06, mat(0xffd34d, { metalness: 0.8, roughness: 0.25 }), -0.5, 3.4, 0.53, 5); st.rotation.x = Math.PI / 2; inner.add(st); }
    if (coat) {
        inner.add(box(2.12, 2.05, 1.12, coat, 0, 3, 0));
        const skirt = box(2.16, 1.5, 1.16, coat, 0, 1.3, 0); inner.add(skirt);
        inner.add(box(0.06, 3.3, 0.02, 0x1d1d1d, 0, 2.3, 0.59));
    }

    const headG = new THREE.Group(); headG.position.y = 4.6; inner.add(headG);
    headG.add(box(1.2, 1.2, 1.2, skin, 0, 0, 0));
    const eyeMat = glowMat(0x111111);
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.05), eyeMat); eyeL.position.set(-0.28, 0.1, 0.61);
    const eyeR = eyeL.clone(); eyeR.position.x = 0.28;
    const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.07, 0.05), glowMat(0x5a2a1a)); mouth.position.set(0, -0.28, 0.61);
    headG.add(eyeL, eyeR, mouth);
    if (glasses) {
        const gm = mat(0x222222);
        headG.add(box(0.36, 0.3, 0.04, gm, -0.28, 0.1, 0.64), box(0.36, 0.3, 0.04, gm, 0.28, 0.1, 0.64), box(0.24, 0.06, 0.04, gm, 0, 0.16, 0.64));
        headG.add(box(0.26, 0.2, 0.02, glowMat(0xbfe6ff, 0.35), -0.28, 0.1, 0.665), box(0.26, 0.2, 0.02, glowMat(0xbfe6ff, 0.35), 0.28, 0.1, 0.665));
    }
    if (beard !== null) { headG.add(box(1.0, 0.45, 0.25, beard, 0, -0.42, 0.55)); headG.add(box(1.22, 0.7, 0.2, beard, 0, -0.25, 0.5)); headG.children[headG.children.length - 1].scale.set(1, 0.6, 1); }

    if (hair !== null) {
        const hm = mat(hair, { roughness: 1 });
        if (hairStyle === 'short') { headG.add(box(1.28, 0.32, 1.28, hm, 0, 0.66, 0), box(1.28, 0.9, 0.2, hm, 0, 0.25, -0.58)); }
        else if (hairStyle === 'long') { headG.add(box(1.3, 0.34, 1.3, hm, 0, 0.66, 0), box(1.32, 1.6, 0.3, hm, 0, -0.1, -0.55)); }
        else if (hairStyle === 'bun') { headG.add(box(1.28, 0.32, 1.28, hm, 0, 0.66, 0), sph(0.35, hm, 0, 0.75, -0.55, 8)); }
        else if (hairStyle === 'queue') { headG.add(box(1.28, 0.26, 1.28, hm, 0, 0.66, 0), box(0.2, 1.8, 0.2, hm, 0, -0.5, -0.7)); }
        else if (hairStyle === 'curly') {
            const r = makeRand(7);
            for (let i = 0; i < 26; i++) {
                const a = r() * Math.PI * 2, top = i < 12;
                const x = top ? (r() - 0.5) * 1.15 : Math.cos(a) * 0.62, z = top ? (r() - 0.5) * 1.15 : Math.sin(a) * 0.62;
                const y = top ? 0.62 + r() * 0.2 : 0.2 + r() * 0.35;
                if (!top && z > 0.35) continue; // keep the face clear
                const c = new THREE.Mesh(new THREE.DodecahedronGeometry(0.24 + r() * 0.08, 0), hm);
                c.position.set(x, y, z); c.castShadow = true; headG.add(c);
            }
            headG.add(box(1.26, 0.28, 1.26, hm, 0, 0.6, -0.02));
        }
    }
    if (hat) {
        const hc = hatColor !== null ? hatColor : 0x222222;
        if (hat === 'tricorn') { const t = cyl(1.0, 1.0, 0.3, hc, 0, 0.75, 0, 3); t.rotation.y = Math.PI / 6; headG.add(t, cyl(0.62, 0.66, 0.45, hc, 0, 0.95, 0, 12)); headG.add(cyl(1.02, 1.02, 0.06, mat(0xd4af37, { metalness: 0.7 }), 0, 0.62, 0, 3)); headG.children[headG.children.length - 1].rotation.y = Math.PI / 6; }
        else if (hat === 'bandana') { headG.add(box(1.3, 0.42, 1.3, hc, 0, 0.55, 0), box(0.25, 0.5, 0.15, hc, 0.35, 0.2, -0.7)); }
        else if (hat === 'straw') { headG.add(cone(1.35, 0.65, hc, 0, 0.95, 0, 16)); }
        else if (hat === 'helmet') { headG.add(box(1.36, 0.7, 1.36, mat(hc, { metalness: 0.7, roughness: 0.3 }), 0, 0.5, 0), box(0.14, 0.55, 0.1, mat(hc, { metalness: 0.7, roughness: 0.3 }), 0, 0.05, 0.66)); }
        else if (hat === 'turban') { headG.add(cyl(0.78, 0.7, 0.62, hc, 0, 0.78, 0, 14), sph(0.55, hc, 0, 1.05, 0, 10), sph(0.13, mat(0x2a9d8f, { emissive: 0x0a4d45 }), 0, 0.85, 0.72, 6)); }
        else if (hat === 'cowboy') { headG.add(cyl(1.3, 1.3, 0.08, hc, 0, 0.66, 0, 18), cyl(0.58, 0.68, 0.62, hc, 0, 0.98, 0, 14), cyl(0.69, 0.69, 0.12, 0x3a2414, 0, 0.75, 0, 14)); }
        else if (hat === 'fedora') { headG.add(cyl(1.15, 1.15, 0.07, hc, 0, 0.64, 0, 20), cyl(0.6, 0.68, 0.62, hc, 0, 0.96, 0, 16), cyl(0.69, 0.69, 0.14, 0x111111, 0, 0.74, 0, 16)); }
        else if (hat === 'cap') { headG.add(box(1.3, 0.3, 1.3, hc, 0, 0.7, 0), box(1.0, 0.08, 0.5, hc, 0, 0.58, 0.8)); }
        else if (hat === 'tophat') { headG.add(cyl(1.0, 1.0, 0.07, hc, 0, 0.64, 0, 18), cyl(0.58, 0.58, 1.1, hc, 0, 1.2, 0, 16)); }
        else if (hat === 'hood') { headG.add(box(1.36, 1.36, 1.3, hc, 0, 0.12, -0.08)); headG.children[0].visible = true; }
        else if (hat === 'coif') { headG.add(box(1.32, 1.0, 1.32, mat(hc, { metalness: 0.5, roughness: 0.5 }), 0, 0.3, -0.05)); }
        else if (hat === 'space') {
            headG.add(sph(1.05, mat(0xf4f4f4, { roughness: 0.4 }), 0, 0.05, 0, 18));
            const visor = sph(0.92, mat(0xd4a017, { metalness: 0.9, roughness: 0.15 }), 0, 0.05, 0.22, 18); visor.scale.set(1, 0.85, 0.8); headG.add(visor);
        }
    }

    const armColor = sleeves !== null ? sleeves : (coat !== null ? coat : shirt);
    const mkLimb = (x, y, w, color, isLeg) => {
        const g = new THREE.Group(); g.position.set(x, y, 0);
        const m = box(isLeg ? 0.9 : 1, 2, 1, color, 0, -1, 0); g.add(m);
        if (!isLeg) g.add(box(0.9, 0.35, 0.9, skin, 0, -2.05, 0));
        else g.add(box(0.95, 0.36, 1.12, shoes, 0, -1.84, 0.08));
        inner.add(g); return g;
    };
    const leftArmGroup = mkLimb(-1.5, 4, 1, armColor, false);
    const rightArmGroup = mkLimb(1.5, 4, 1, armColor, false);
    const leftLegGroup = mkLimb(-0.55, 2, 0.9, legs, true);
    const rightLegGroup = mkLimb(0.55, 2, 0.9, legs, true);

    avatar.inner = inner;
    avatar.rig = { leftArmGroup, rightArmGroup, leftLegGroup, rightLegGroup, torso, head: headG };
    avatar.walkCycleTime = Math.random() * 10;
    return avatar;
}

const GEM_COLORS = [0xff4d5e, 0xff9f1c, 0xffd60a, 0x4cd964, 0x2ec4f1, 0x3a6bff, 0xb05cff];
const GEM_CSS = ['#ff4d5e', '#ff9f1c', '#ffd60a', '#4cd964', '#2ec4f1', '#3a6bff', '#b05cff'];

// The brass pocket watch: glowing face, moving hands, 7 gem slots around the rim.
function createWatch({ dark = false, size = 1 } = {}) {
    const w = new THREE.Group();
    const brass = mat(dark ? 0x3a3340 : 0xc9a240, { metalness: 0.85, roughness: 0.28 });
    const rim = cyl(0.46, 0.46, 0.12, brass, 0, 0, 0, 28); rim.rotation.x = Math.PI / 2; w.add(rim);
    const faceMat = new THREE.MeshBasicMaterial({ color: dark ? 0x7a2bd6 : 0x4fc3ff });
    const face = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.13, 28), faceMat); face.rotation.x = Math.PI / 2; w.add(face);
    const hand1 = box(0.05, 0.28, 0.02, glowMat(0x10203a), 0, 0.12, 0.075); const hand2 = box(0.04, 0.2, 0.02, glowMat(0x10203a), 0, 0.08, 0.075);
    const h1 = group(hand1), h2 = group(hand2); h1.position.z = 0; h2.position.z = 0; w.add(h1, h2);
    w.add(cyl(0.08, 0.08, 0.14, brass, 0, 0.52, 0, 8), cyl(0.12, 0.12, 0.05, brass, 0, 0.62, 0, 10));
    const glow = createGlow(dark ? 0xa04cff : 0x6fd3ff, 1.6, 0.55); glow.position.z = 0.1; w.add(glow);
    const gems = [];
    for (let i = 0; i < 7; i++) {
        const a = Math.PI / 2 - (i + 0.5) * (Math.PI * 2 / 8) - Math.PI / 8;
        const g = new THREE.Mesh(new THREE.OctahedronGeometry(0.075, 0), new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.4 }));
        g.position.set(Math.cos(a) * 0.41, Math.sin(a) * 0.41, 0.08); w.add(g); gems.push(g);
    }
    let pulse = 0, power = 1;
    w.setGems = n => {
        gems.forEach((g, i) => {
            const on = !dark && i < n;
            g.material.color.setHex(on ? GEM_COLORS[i] : (dark ? 0x221a2a : 0x2e2e2e));
            g.material.emissive.setHex(on ? GEM_COLORS[i] : 0x000000);
            g.material.emissiveIntensity = on ? 0.9 : 0;
            g.scale.setScalar(on ? 1.35 : 1);
        });
    };
    w.pulse = () => { pulse = 1; };
    w.setPower = p => { power = p; };
    let tt = Math.random() * 10;
    addFx(() => {
        tt += 1 / 60;
        h1.rotation.z = -tt * 0.9 * power; h2.rotation.z = -tt * 0.08 * power;
        pulse = Math.max(0, pulse - 0.012);
        const pw = Math.min(Math.abs(power), 12); const s = (1.4 + Math.sin(tt * 3) * 0.15) * (0.4 + pw * 0.6) + pulse * 5;
        glow.scale.set(s, s, 1);
        glow.material.opacity = Math.min(1, 0.35 + 0.25 * pw + pulse * 0.4);
    });
    w.scale.setScalar(size);
    w.face = face; w.gems = gems;
    w.setGems(0);
    return w;
}

let currentGems = 0;
// Mohamed: a 12-year-old in a red hoodie, jeans, white sneakers, backpack and the watch.
function createKid(o = {}) {
    const k = createPerson(Object.assign({ shirt: 0xc8102e, legs: 0x3d6aa8, skin: 0xc98b5a, hair: 0x111111, hairStyle: 'curly', child: true, shoes: 0xf6f6f6 }, o));
    const b = k.inner;
    b.add(box(1.8, 0.45, 0.55, 0xa50d24, 0, 4.0, -0.42));              // folded hood
    b.add(box(1.3, 0.5, 0.06, 0xa80c25, 0, 2.45, 0.53));               // front pocket
    b.add(box(0.06, 0.6, 0.04, 0xffffff, -0.25, 3.6, 0.53), box(0.06, 0.6, 0.04, 0xffffff, 0.25, 3.6, 0.53));
    b.add(box(1.5, 1.6, 0.62, 0x1f7a70, 0, 3.0, -0.82));               // backpack
    b.add(box(1.2, 0.6, 0.2, 0x26968a, 0, 2.6, -1.18));
    b.add(box(0.22, 0.18, 1.3, 0x1b1b1b, -0.6, 3.95, -0.1), box(0.22, 0.18, 1.3, 0x1b1b1b, 0.6, 3.95, -0.1));
    // Hood edge on the shoulders hides the strap overlap.
    const chainMat = mat(0xd9b54a, { metalness: 0.9, roughness: 0.3 });
    const c1 = box(0.05, 0.85, 0.04, chainMat, -0.22, 3.75, 0.53); c1.rotation.z = -0.5;
    const c2 = box(0.05, 0.85, 0.04, chainMat, 0.22, 3.75, 0.53); c2.rotation.z = 0.5;
    b.add(c1, c2);
    const w = createWatch(); w.position.set(0, 3.05, 0.6); w.scale.setScalar(0.95); b.add(w);
    k.watch = w;
    k.setGems = n => w.setGems(n);
    k.setGems(o.gems !== undefined ? o.gems : currentGems);
    return k;
}

// The Collector: a tall man in a long grey coat with a dark watch of his own.
function createCollector(o = {}) {
    const c = createPerson(Object.assign({ shirt: 0x2f3035, legs: 0x2a2b2f, coat: 0x6b6f76, skin: 0xd1b394, hair: 0x2a2a2a, hairStyle: 'short', hat: 'fedora', hatColor: 0x2b2d31, shoes: 0x111111, scale: 1.08, beard: null }, o));
    const b = c.inner;
    b.add(box(2.3, 0.5, 1.25, 0x5a5e65, 0, 3.85, 0));                    // turned-up collar
    b.add(box(1.26, 0.18, 0.1, 0x111111, 0, 4.74, 0.6));                 // brim shadow over the eyes
    const lapel = box(0.5, 1.2, 0.05, 0x55595f, -0.35, 3.3, 0.62); lapel.rotation.z = 0.25;
    const lapel2 = box(0.5, 1.2, 0.05, 0x55595f, 0.35, 3.3, 0.62); lapel2.rotation.z = -0.25;
    b.add(lapel, lapel2);
    // grey gloves
    [c.rig.leftArmGroup, c.rig.rightArmGroup].forEach(g => g.children[1].material = mat(0x3d3f44));
    const w = createWatch({ dark: true }); w.position.set(0.55, 2.7, 0.62); w.scale.setScalar(0.8); b.add(w);
    const ch = box(0.04, 0.7, 0.04, mat(0x777777, { metalness: 0.8 }), 0.3, 3.05, 0.6); ch.rotation.z = 0.7; b.add(ch);
    c.watch = w;
    return c;
}

function createGrandpa(o = {}) {
    return createPerson(Object.assign({ shirt: 0x8a6a48, legs: 0x55575c, skin: 0xc98b5a, hair: 0xe6e6e6, hairStyle: 'short', beard: 0xe6e6e6, glasses: true, vest: 0x6b4f33 }, o));
}

// ---- Poses (all respectful: hand on heart, handshakes, waves, raised hands, applause) ----
function pose(a, p = {}) {
    const r = a.rig;
    r.leftArmGroup.rotation.set(p.la || 0, 0, p.laz || 0);
    r.rightArmGroup.rotation.set(p.ra || 0, 0, p.raz || 0);
    r.leftLegGroup.rotation.x = p.ll || 0;
    r.rightLegGroup.rotation.x = p.rl || 0;
    if (p.head !== undefined) r.head.rotation.y = p.head;
    if (p.nod !== undefined) r.head.rotation.x = p.nod;
}
function idle(a, t, ph = 0) { const s = Math.sin(t * 1.6 + ph); pose(a, { la: s * 0.05, ra: -s * 0.05, laz: 0.04, raz: -0.04 }); }
function heart(a) { pose(a, { ra: -1.25, raz: -0.75, la: 0.05 }); }
function wave(a, t) { pose(a, { ra: -2.7, raz: 0.25 + Math.sin(t * 9) * 0.3 }); }
function point(a, t = 0) { pose(a, { ra: -1.55 + Math.sin(t * 2) * 0.04 }); }
function cheer(a, t, ph = 0) { const s = Math.sin(t * 5 + ph) * 0.15; pose(a, { la: -2.85 + s, ra: -2.85 - s, laz: -0.2, raz: 0.2 }); }
function clap(a, t, ph = 0) { const s = Math.abs(Math.sin(t * 7 + ph)); pose(a, { la: -1.3, ra: -1.3, laz: 0.32 + 0.3 * s, raz: -0.32 - 0.3 * s }); }
function shake(a, t) { pose(a, { ra: -1.05 + Math.sin(t * 9) * 0.1, raz: -0.15 }); }
function think(a, t) { pose(a, { ra: -2.2, raz: -0.7, la: -0.9, laz: 0.6 }); }
function shock(a) { pose(a, { la: -0.7, ra: -0.7, laz: -0.5, raz: 0.5 }); }
function carry(a, t = 0) { pose(a, { la: -1.25, ra: -1.25, laz: 0.2, raz: -0.2 }); }
function work(a, t, ph = 0) { const s = Math.sin(t * 5 + ph); pose(a, { la: -1.2 + s * 0.5, ra: -1.2 - s * 0.5 }); }
function holdUp(a, t = 0) { pose(a, { ra: -2.5, raz: -0.1 }); }
function run(a, t, ph = 0) { const s = Math.sin(t * 13 + ph) * 0.9; pose(a, { la: s, ra: -s, ll: -s, rl: s }); }

// Walk toward a point each step. Returns true while still walking.
function walkTo(actor, tx, tz, speed = 0.08) {
    const dx = tx - actor.position.x, dz = tz - actor.position.z, dist = Math.hypot(dx, dz);
    if (dist > 0.3) {
        actor.rotation.y = lerpAngle(actor.rotation.y, Math.atan2(dx, dz), 0.15);
        actor.position.x += (dx / dist) * Math.min(speed, dist);
        actor.position.z += (dz / dist) * Math.min(speed, dist);
        actor.walkCycleTime += 0.15 * Math.min(2, speed / 0.06);
        const swing = Math.sin(actor.walkCycleTime) * 0.65;
        pose(actor, { la: swing, ra: -swing, ll: -swing, rl: swing });
        return true;
    }
    pose(actor, {});
    return false;
}
function face(actor, x, z, k = 0.12) { actor.rotation.y = lerpAngle(actor.rotation.y, Math.atan2(x - actor.position.x, z - actor.position.z), k); }

// ===================== Effects =====================
function createPortal(radius = 4, colors = [0x4fc3ff, 0x9be7ff, 0xffd166, 0x3a6bff], coreOpacity = 0.9) {
    const g = new THREE.Group();
    const rings = [];
    for (let i = 0; i < 6; i++) {
        const m = new THREE.MeshBasicMaterial({ color: colors[i % colors.length], transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
        const r = new THREE.Mesh(new THREE.TorusGeometry(radius * (1 - i * 0.13), 0.09 + i * 0.015, 8, 64), m);
        g.add(r); rings.push(r);
    }
    const core = createGlow(0x9be7ff, radius * 2.6, coreOpacity); g.add(core);
    const n = 260, pos = new Float32Array(n * 3), seeds = [];
    for (let i = 0; i < n; i++) seeds.push([Math.random() * Math.PI * 2, 0.2 + Math.random(), Math.random() * 2 - 1]);
    const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xcff4ff, size: 0.18, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
    g.add(pts);
    let t = 0, power = 1;
    g.setPower = p => { power = p; };
    addFx(() => {
        t += 1 / 60;
        rings.forEach((r, i) => { r.rotation.z = t * (0.6 + i * 0.35) * (i % 2 ? -1 : 1); r.rotation.x = Math.sin(t * 0.7 + i) * 0.25; r.material.opacity = 0.75 * power; r.scale.setScalar(Math.max(0.001, power) * (1 + Math.sin(t * 3 + i) * 0.03)); });
        core.material.opacity = coreOpacity * power; core.scale.set(radius * 2.6 * power, radius * 2.6 * power, 1);
        for (let i = 0; i < n; i++) {
            const [a0, sp, zz] = seeds[i]; const a = a0 + t * sp * 2; const rr = radius * (0.2 + ((t * sp * 0.4 + a0) % 1)) * power;
            pos[i * 3] = Math.cos(a) * rr; pos[i * 3 + 1] = Math.sin(a) * rr; pos[i * 3 + 2] = zz * 0.6;
        }
        pg.attributes.position.needsUpdate = true; pts.material.opacity = 0.9 * power;
    });
    return g;
}

// A burst of sparkles that flies outward and fades. Call burst.fire() to set it off.
function createBurst(color = 0xffffff, count = 120, speed = 0.25) {
    const pos = new Float32Array(count * 3), vel = [];
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const m = new THREE.PointsMaterial({ color, size: 0.3, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const p = new THREE.Points(g, m);
    let life = 0;
    p.fire = () => {
        life = 1;
        for (let i = 0; i < count; i++) {
            pos[i * 3] = pos[i * 3 + 1] = pos[i * 3 + 2] = 0;
            const a = Math.random() * Math.PI * 2, b = Math.acos(Math.random() * 2 - 1), v = speed * (0.4 + Math.random());
            vel[i] = [Math.sin(b) * Math.cos(a) * v, Math.cos(b) * v, Math.sin(b) * Math.sin(a) * v];
        }
    };
    addFx(() => {
        if (life <= 0) { m.opacity = 0; return; }
        life -= 0.012; m.opacity = Math.max(0, life);
        for (let i = 0; i < count; i++) { pos[i * 3] += vel[i][0]; pos[i * 3 + 1] += vel[i][1]; pos[i * 3 + 2] += vel[i][2]; vel[i][0] *= 0.97; vel[i][1] *= 0.97; vel[i][2] *= 0.97; }
        g.attributes.position.needsUpdate = true;
    });
    return p;
}

const flashEl = document.getElementById('flash');
function flashScreen(color = '#ffffff', ms = 900) {
    if (!flashEl) return;
    flashEl.style.transition = 'none'; flashEl.style.background = color; flashEl.style.opacity = '0.9';
    void flashEl.offsetHeight;
    flashEl.style.transition = `opacity ${ms}ms ease`; flashEl.style.opacity = '0';
}

// Light the next gem on the kid's watch with a flash, a sparkle burst and the corner meter.
function lightGem(kid, n) {
    kid.setGems(n); kid.watch.pulse();
    const b = createBurst(GEM_COLORS[n - 1], 160, 0.22);
    const wp = new THREE.Vector3(); kid.watch.getWorldPosition(wp); b.position.copy(wp); add(b); b.fire();
    setGemHud(n, true);
    flashScreen(GEM_CSS[n - 1], 1100);
}

const gemHud = document.getElementById('gem-hud');
function setGemHud(n, pop) {
    if (!gemHud) return;
    gemHud.querySelectorAll('i').forEach((el, i) => { el.style.background = i < n ? GEM_CSS[i] : 'transparent'; el.style.boxShadow = i < n ? `0 0 8px ${GEM_CSS[i]}` : 'none'; });
    if (pop) { gemHud.classList.remove('pop'); void gemHud.offsetWidth; gemHud.classList.add('pop'); }
}

// ===================== World pieces =====================
function createStars(count = 700, radius = 300, size = 0.9) {
    const pos = new Float32Array(count * 3); const r = makeRand(11);
    for (let i = 0; i < count; i++) {
        const a = r() * Math.PI * 2, b = r() * Math.PI * 0.48;
        pos[i * 3] = Math.cos(a) * Math.cos(b) * radius; pos[i * 3 + 1] = Math.sin(b) * radius + 5; pos[i * 3 + 2] = Math.sin(a) * Math.cos(b) * radius;
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size, sizeAttenuation: true, fog: false }));
}
function createSkyDisk(color = 0xfff1c4, size = 10, x = -60, y = 50, z = -160) {
    const g = group(); const d = new THREE.Mesh(new THREE.CircleGeometry(size, 32), new THREE.MeshBasicMaterial({ color, fog: false }));
    g.add(d); const gl = createGlow(color, size * 3.2, 0.35); gl.material.fog = false; g.add(gl);
    g.position.set(x, y, z); g.lookAt(0, 5, 30); return g;
}
function createClouds(n = 8, y = 40, spread = 200, seed = 3, color = 0xffffff) {
    const g = group(); const r = makeRand(seed); const m = mat(color, { roughness: 1 });
    for (let i = 0; i < n; i++) {
        const c = group();
        for (let k = 0; k < 4; k++) { const s = sph(3 + r() * 3, m, k * 4 - 6, r() * 1.5, r() * 2, 8); s.castShadow = false; s.scale.y = 0.6; c.add(s); }
        c.position.set((r() - 0.5) * spread, y + r() * 15, -40 - r() * spread * 0.6); g.add(c);
    }
    addFx(() => g.children.forEach((c, i) => { c.position.x += 0.01 + i * 0.002; if (c.position.x > spread / 2) c.position.x = -spread / 2; }));
    return g;
}
// Low-poly sea with rolling waves.
function createSea(color = 0x1f6a9a, size = 400, y = 0, amp = 0.35, segs = 70) {
    const geo = new THREE.PlaneGeometry(size, size, segs, segs);
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.1, flatShading: true }));
    m.rotation.x = -Math.PI / 2; m.position.y = y; m.receiveShadow = true;
    const p = geo.attributes.position; const base = Float32Array.from(p.array);
    let t = 0; m.amp = amp;
    addFx(() => {
        t += 1 / 60;
        for (let i = 0; i < p.count; i++) { const x = base[i * 3], yy = base[i * 3 + 1]; p.array[i * 3 + 2] = (Math.sin(x * 0.12 + t * 1.3) + Math.cos(yy * 0.15 + t * 1.1)) * m.amp; }
        p.needsUpdate = true;
    });
    return m;
}
function createMountain(x, z, h = 30, r = 20, color = 0x6b6f5a, snow = false, seed = 1) {
    const g = group(); const m = cone(r, h, mat(color, { flatShading: true, roughness: 1 }), 0, h / 2, 0, 7);
    m.rotation.y = seed; g.add(m);
    if (snow) { const s = cone(r * 0.32, h * 0.32, mat(0xf2f2f2, { flatShading: true }), 0, h * 0.84, 0, 7); s.rotation.y = seed; g.add(s); }
    g.position.set(x, 0, z); return g;
}
function createRock(x, y, z, s = 1, color = 0x7d7468) {
    const m = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), mat(color, { flatShading: true, roughness: 1 }));
    m.position.set(x, y, z); m.rotation.set(x, z, y); m.castShadow = true; m.receiveShadow = true; return m;
}
function createTree(x, z, s = 1, leaf = 0x3f7a3a, trunk = 0x5a3b26) {
    const g = group(cyl(0.35 * s, 0.55 * s, 5 * s, trunk, 0, 2.5 * s, 0, 7));
    const lm = mat(leaf, { flatShading: true, roughness: 1 });
    [[0, 6, 0, 2.4], [1.3, 5.2, 0.4, 1.7], [-1.3, 5.3, -0.3, 1.8], [0.2, 7.2, -0.3, 1.5]].forEach(([a, b, c, r]) => { const l = new THREE.Mesh(new THREE.DodecahedronGeometry(r * s, 0), lm); l.position.set(a * s, b * s, c * s); l.castShadow = true; g.add(l); });
    g.position.set(x, 0, z); return g;
}
function createPine(x, z, s = 1, leaf = 0x2f5a3a) {
    const g = group(cyl(0.3 * s, 0.4 * s, 2.5 * s, 0x4a3322, 0, 1.25 * s, 0, 6));
    const lm = mat(leaf, { flatShading: true });
    for (let i = 0; i < 3; i++) g.add(cone((2.6 - i * 0.6) * s, 3.2 * s, lm, 0, (3 + i * 1.8) * s, 0, 7));
    g.position.set(x, 0, z); return g;
}
function createPalm(x, z, s = 1) {
    const g = group(); const tm = mat(0x7a5a3a);
    for (let i = 0; i < 6; i++) { const seg = cyl(0.32 * s, 0.38 * s, 1.3 * s, tm, i * 0.12 * s, (0.65 + i * 1.2) * s, 0, 7); seg.rotation.z = -0.05 * i; g.add(seg); }
    const lm = mat(0x3f8a3a, { flatShading: true, side: THREE.DoubleSide });
    for (let i = 0; i < 7; i++) { const l = box(0.6 * s, 0.1 * s, 3.4 * s, lm, 0, 0, 1.6 * s); const p = group(l); p.position.set(0.7 * s, 7.4 * s, 0); p.rotation.y = i * Math.PI * 2 / 7; p.rotation.x = 0.35; g.add(p); }
    g.position.set(x, 0, z); return g;
}
function createCactus(x, z, s = 1) {
    const m = mat(0x4f8a4a, { flatShading: true });
    const g = group(cyl(0.45 * s, 0.5 * s, 5 * s, m, 0, 2.5 * s, 0, 8), cyl(0.3 * s, 0.3 * s, 1.8 * s, m, 1.0 * s, 3.3 * s, 0, 8), cyl(0.3 * s, 0.3 * s, 1.4 * s, m, -1.0 * s, 2.8 * s, 0, 8));
    const a1 = cyl(0.28 * s, 0.28 * s, 1 * s, m, 0.6 * s, 2.5 * s, 0, 8); a1.rotation.z = Math.PI / 2; const a2 = a1.clone(); a2.position.set(-0.6 * s, 2.1 * s, 0);
    g.add(a1, a2); g.position.set(x, 0, z); return g;
}
function createBush(x, z, s = 1, color = 0x3f6b35) { const m = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), mat(color, { flatShading: true })); m.position.set(x, s * 0.6, z); m.scale.y = 0.7; m.castShadow = true; return m; }
function createCrate(x, z, s = 1, color = 0x9a6a3a, y = 0) { const g = group(box(1.6 * s, 1.6 * s, 1.6 * s, color, 0, 0.8 * s, 0), box(1.65 * s, 0.2 * s, 1.65 * s, 0x6a4424, 0, 1.45 * s, 0), box(1.65 * s, 0.2 * s, 1.65 * s, 0x6a4424, 0, 0.15 * s, 0)); g.position.set(x, y, z); return g; }
function createBarrel(x, z, s = 1, color = 0x8a5a32, y = 0) { const g = group(cyl(0.7 * s, 0.7 * s, 1.8 * s, color, 0, 0.9 * s, 0, 12), cyl(0.74 * s, 0.74 * s, 0.12 * s, 0x333333, 0, 0.4 * s, 0, 12), cyl(0.74 * s, 0.74 * s, 0.12 * s, 0x333333, 0, 1.4 * s, 0, 12)); g.position.set(x, y, z); return g; }
function createSack(x, z, s = 1, color = 0xcdb68a) { const g = group(sph(0.7 * s, color, 0, 0.6 * s, 0, 8), cyl(0.2 * s, 0.35 * s, 0.4 * s, color, 0, 1.25 * s, 0, 8)); g.children[0].scale.y = 1.1; g.position.set(x, 0, z); return g; }
function createTable(x, z, w = 4, d = 2, h = 2, color = 0x7a5232) { const g = group(box(w, 0.2, d, color, 0, h, 0)); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => g.add(box(0.2, h, 0.2, color, a * (w / 2 - 0.2), h / 2, b * (d / 2 - 0.2)))); g.position.set(x, 0, z); return g; }
function createStool(x, z, color = 0x7a5232) { const g = group(cyl(0.6, 0.6, 0.2, color, 0, 1.3, 0, 10)); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => g.add(box(0.12, 1.3, 0.12, color, a * 0.35, 0.65, b * 0.35))); g.position.set(x, 0, z); return g; }
function createFire(x, z, s = 1) {
    const g = group(); const wood = mat(0x4a2e1a);
    for (let i = 0; i < 4; i++) { const l = cyl(0.15 * s, 0.15 * s, 1.8 * s, wood, 0, 0.15 * s, 0, 6); l.rotation.z = Math.PI / 2; l.rotation.y = i * Math.PI / 4; g.add(l); }
    const f1 = cone(0.6 * s, 1.6 * s, glowMat(0xff7a1a), 0, 0.9 * s, 0, 6), f2 = cone(0.35 * s, 1.1 * s, glowMat(0xffd166), 0, 0.75 * s, 0, 6);
    g.add(f1, f2); const gl = createGlow(0xff9a3a, 4 * s, 0.6); gl.position.y = 1 * s; g.add(gl);
    let t = Math.random() * 9; addFx(() => { t += 0.1; f1.scale.set(1, 1 + Math.sin(t * 1.7) * 0.15, 1); f2.scale.set(1, 1 + Math.sin(t * 2.3) * 0.2, 1); gl.material.opacity = 0.5 + Math.sin(t * 1.3) * 0.1; });
    g.position.set(x, 0, z); return g;
}
function createTorch(x, y, z, s = 1) {
    const g = group(cyl(0.1 * s, 0.12 * s, 1.6 * s, 0x4a2e1a, 0, 0, 0, 6));
    const f = cone(0.25 * s, 0.7 * s, glowMat(0xff8a2a), 0, 1.05 * s, 0, 6); g.add(f);
    const gl = createGlow(0xffa040, 3 * s, 0.6); gl.position.y = 1.1 * s; g.add(gl);
    let t = Math.random() * 9; addFx(() => { t += 0.12; f.scale.y = 1 + Math.sin(t) * 0.18; gl.material.opacity = 0.5 + Math.sin(t * 1.4) * 0.12; });
    g.position.set(x, y, z); return g;
}
function createLantern(x, y, z, color = 0xffc36b, s = 1) {
    const g = group(box(0.6 * s, 0.8 * s, 0.6 * s, glowMat(color), 0, 0, 0), box(0.7 * s, 0.1 * s, 0.7 * s, 0x2a2a2a, 0, 0.45 * s, 0), box(0.7 * s, 0.1 * s, 0.7 * s, 0x2a2a2a, 0, -0.45 * s, 0));
    const gl = createGlow(color, 3.2 * s, 0.55); g.add(gl); g.position.set(x, y, z); return g;
}
// A thin rope/pole between two points.
function createRope(a, b, color = 0x3a2a1a, r = 0.04) {
    const p1 = new THREE.Vector3(...a), p2 = new THREE.Vector3(...b);
    const d = new THREE.Vector3().subVectors(p2, p1); const len = d.length();
    const c = cyl(r, r, len, color, 0, 0, 0, 5); c.castShadow = false;
    c.position.copy(p1).add(p2).multiplyScalar(0.5);
    c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    return c;
}
const SKINS = [0xf1c27d, 0xe0ac69, 0xc68642, 0x8d5524, 0xffdbac, 0xa86b3c, 0x6b4226];
// Floating clocks for the time tunnel.
function createClockFace(r = 1, rim = 0xc9a240) {
    const g = group(); const c = cyl(r, r, 0.2, mat(rim, { metalness: 0.7, roughness: 0.3 }), 0, 0, 0, 24); c.rotation.x = Math.PI / 2; g.add(c);
    const f = cyl(r * 0.85, r * 0.85, 0.22, glowMat(0xf6f0dc), 0, 0, 0, 24); f.rotation.x = Math.PI / 2; g.add(f);
    const h1 = box(r * 0.08, r * 0.7, 0.05, glowMat(0x222222), 0, r * 0.3, 0.13), h2 = box(r * 0.08, r * 0.5, 0.05, glowMat(0x222222), 0, r * 0.2, 0.14);
    const a1 = group(h1), a2 = group(h2); g.add(a1, a2);
    let t = Math.random() * 10, sp = 0.5 + Math.random() * 2; addFx(() => { t += 1 / 60; a1.rotation.z = -t * sp * 3; a2.rotation.z = -t * sp * 0.4; });
    return g;
}
// The time tunnel: rings of light rushing past with clocks drifting by.
function createTimeTunnel(count = 9, spacing = 8, colors) {
    const g = group(); const portals = [];
    for (let i = 0; i < count; i++) { const p = createPortal(7 + (i % 3), colors, 0.08); p.position.z = -i * spacing; g.add(p); portals.push(p); }
    const clocks = []; const r = makeRand(21);
    for (let i = 0; i < 14; i++) { const c = createClockFace(0.6 + r() * 0.9); c.position.set((r() - 0.5) * 12, (r() - 0.5) * 8 + 4, -r() * count * spacing); c.userData.spin = (r() - 0.5) * 0.04; g.add(c); clocks.push(c); }
    addFx(() => {
        portals.forEach(p => { p.position.z += 0.35; if (p.position.z > 12) p.position.z -= count * spacing; });
        clocks.forEach(c => { c.position.z += 0.22; c.rotation.y += c.userData.spin; c.rotation.x += c.userData.spin * 0.5; if (c.position.z > 12) c.position.z -= count * spacing; });
    });
    return g;
}

function createHut(x, z, w = 7, d = 6, h = 4, wall = 0xc9b48a, roof = 0x3a3a3a) {
    const g = group(box(w, h, d, wall, 0, h / 2, 0), box(1.4, 2.6, 0.1, 0x4a2e1a, 0, 1.3, d / 2 + 0.01));
    const rf = cone(Math.max(w, d) * 0.85, 2.6, mat(roof, { flatShading: true }), 0, h + 1.3, 0, 4); rf.rotation.y = Math.PI / 4; rf.scale.z = d / w; g.add(rf);
    g.add(box(w + 1.6, 0.2, d + 1.6, roof, 0, h + 0.1, 0));
    g.position.set(x, 0, z); return g;
}
function createPot(x, z, s = 1, steam = true) {
    const g = group(cyl(1.4 * s, 1.0 * s, 1.6 * s, 0x2a2a2a, 0, 1.6 * s, 0, 14), cyl(1.25 * s, 1.25 * s, 0.1 * s, 0xf2ead8, 0, 2.35 * s, 0, 14));
    [0, 1, 2].forEach(i => { const st = box(0.25 * s, 1.0 * s, 0.25 * s, 0x5a5a5a, Math.cos(i * 2.1) * 1.1 * s, 0.5 * s, Math.sin(i * 2.1) * 1.1 * s); g.add(st); });
    g.add(createFire(0, 0, 0.8 * s));
    if (steam) { const puffs = []; for (let i = 0; i < 6; i++) { const p = createGlow(0xffffff, 1.4 * s, 0.25); g.add(p); puffs.push(p); } let t = Math.random() * 5; addFx(() => { t += 1 / 60; puffs.forEach((p, i) => { const k = (t * 0.4 + i / 6) % 1; p.position.set(Math.sin(i * 3 + t) * 0.4, 2.6 * s + k * 4 * s, Math.cos(i * 2) * 0.4); p.material.opacity = 0.3 * (1 - k); p.scale.setScalar((1 + k * 2) * s); }); }); }
    g.position.set(x, 0, z); return g;
}
function createCart(x, z, loaded = true) {
    const g = group(box(4, 0.3, 2.4, 0x7a5232, 0, 1.4, 0), box(4, 0.8, 0.15, 0x6a4424, 0, 1.9, 1.15), box(4, 0.8, 0.15, 0x6a4424, 0, 1.9, -1.15));
    [-1.4, 1.4].forEach(zz => { const w = cyl(1.0, 1.0, 0.2, 0x4a3020, 0, 1.0, zz, 12); w.rotation.x = Math.PI / 2; g.add(w); });
    g.add(box(3.5, 0.15, 0.15, 0x5a3a22, 3.6, 1.3, 0.5), box(3.5, 0.15, 0.15, 0x5a3a22, 3.6, 1.3, -0.5));
    if (loaded) for (let i = 0; i < 5; i++) g.add(at(createSack(0, 0, 0.7), -1.4 + (i % 3) * 1.3, 1.5 + Math.floor(i / 3) * 0.9, (i % 2) * 0.6 - 0.3));
    g.position.set(x, 0, z); return g;
}
function createLivingRoom() {
    const g = createRoom({ w: 34, d: 22, h: 13, wall: 0x9c7b5c, floor: 0x6e4c33, trim: 0x4a3020 });
    g.add(box(10, 0.05, 7, 0x8a2f2f, 2, 0.08, 1));                                   // rug
    g.add(box(9, 1.6, 3, 0x4f6b8a, -8, 1.3, -7), box(9, 2.6, 0.8, 0x4f6b8a, -8, 2.2, -8.4), box(0.8, 2.2, 3, 0x4f6b8a, -12.4, 1.9, -7), box(0.8, 2.2, 3, 0x4f6b8a, -3.6, 1.9, -7)); // sofa
    g.add(box(3.6, 1.6, 3.4, 0x7a4a2a, 8, 1.2, -5), box(3.6, 3.4, 0.7, 0x7a4a2a, 8, 2.6, -6.6)); // armchair
    // window with rain light
    g.add(box(6, 5, 0.3, 0x3a2a1a, 0, 7, -10.8), box(5.4, 4.4, 0.2, glowMat(0x7f97b3), 0, 7, -10.6), box(0.2, 4.4, 0.25, 0x3a2a1a, 0, 7, -10.5), box(5.4, 0.2, 0.25, 0x3a2a1a, 0, 7, -10.5));
    // bookshelf
    g.add(box(6, 9, 1.6, 0x5a3a22, -14, 4.5, -9.8));
    const r = makeRand(4); for (let s = 0; s < 4; s++) for (let i = 0; i < 9; i++) g.add(box(0.5, 1.4 + r() * 0.5, 1.1, [0x8a2f2f, 0x2f5a8a, 0x3a7a4a, 0xc9a240, 0x5a3a6a][(i + s) % 5], -16.4 + i * 0.6, 1.2 + s * 2.1, -9.6));
    // old photo of the family clock shop
    const photo = createSign('YUSUF CLOCKS\n1899', 4.4, 3, { w: 512, h: 350, bg: '#cdb58a', fg: '#4a3520', border: '#3a2a1a', font: '700 64px Georgia' });
    photo.position.set(9, 8, -10.6); g.add(photo);
    // grandfather clock
    g.add(box(2.2, 8, 1.4, 0x4a2a14, 14, 4, -9.6), cyl(0.8, 0.8, 0.2, glowMat(0xf2e8cc), 14, 6.8, -8.85, 20));
    g.children[g.children.length - 1].rotation.x = Math.PI / 2;
    g.add(createLantern(-8, 9.5, -10.4, 0xffd59a, 0.9));
    return g;
}
function createAttic() {
    const g = group(box(36, 0.3, 24, 0x6a4b30, 0, -0.1, 0));
    const wood = mat(0x5a3d26), beam = mat(0x3f2a18);
    // sloped roof halves
    const roofL = box(20, 0.4, 26, wood, -9, 9, -1); roofL.rotation.z = 0.62; roofL.castShadow = false; g.add(roofL);
    const roofR = box(20, 0.4, 26, wood, 9, 9, -1); roofR.rotation.z = -0.62; roofR.castShadow = false; g.add(roofR);
    g.add(box(36, 15, 0.4, 0x5f4229, 0, 7.5, -12));
    for (let i = -2; i <= 2; i++) { const b = box(0.6, 0.6, 24, beam, i * 6, 12.4 - Math.abs(i) * 3.6, -1); g.add(b); }
    g.add(box(0.6, 0.6, 24, beam, 0, 15.5, -1));
    // round window
    const w = cyl(2.2, 2.2, 0.3, mat(0x3f2a18), 0, 9, -11.7, 24); w.rotation.x = Math.PI / 2; g.add(w);
    const wg = cyl(1.9, 1.9, 0.32, glowMat(0x9fb6d0), 0, 9, -11.6, 24); wg.rotation.x = Math.PI / 2; g.add(wg);
    g.add(box(0.15, 3.8, 0.35, 0x3f2a18, 0, 9, -11.45), box(3.8, 0.15, 0.35, 0x3f2a18, 0, 9, -11.45));
    // boxes, a covered mirror, an old bicycle wheel, a rocking horse
    [[-10, -7, 1.2], [-12, -4, 1], [-9.5, -4.4, 0.8], [11, -8, 1.3], [12.5, -5, 0.9], [9, -6, 0.7]].forEach(([x, z, s]) => g.add(createCrate(x, z, s, 0xa98a62)));
    g.add(box(3, 5, 0.3, 0xe8e1d0, 13, 2.5, -2), box(3.2, 0.3, 0.4, 0x5a3d26, 13, 0.15, -2));
    const wh = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.08, 6, 20), mat(0x333333)); wh.position.set(-13, 1.6, 0); wh.rotation.y = 0.6; g.add(wh);
    // ladder hatch
    g.add(box(4, 0.35, 3, 0x2a1a0c, -4, 0.06, 8));
    return g;
}
function createTrunk() {
    const g = group(box(4.4, 2.2, 2.6, 0x6b3f1f, 0, 1.1, 0), box(4.5, 0.25, 2.7, 0xb08a3a, 0, 0.3, 0, { metalness: 0.6 }), box(4.5, 0.25, 2.7, 0xb08a3a, 0, 1.95, 0, { metalness: 0.6 }));
    const lid = group(box(4.4, 0.6, 2.6, 0x7a4a26, 0, 0.3, 1.3), box(4.5, 0.15, 2.7, 0xb08a3a, 0, 0.35, 1.3, { metalness: 0.6 }));
    lid.position.set(0, 2.2, -1.3); g.add(lid);
    g.add(box(0.5, 0.6, 0.1, 0xd4af37, 0, 1.8, 1.32, { metalness: 0.8 }));
    const glow = createGlow(0x6fd3ff, 0.1, 0.9); glow.position.set(0, 2.4, 0); g.add(glow);
    g.lid = lid; g.glow = glow; return g;
}
// Interior room: floor plus back and side walls, open at the front for the camera.
function createRoom({ w = 30, d = 22, h = 12, wall = 0x8a6a4a, floor = 0x6a4a32, trim = 0x4a3020, left = true, right = true, back = true } = {}) {
    const g = group(box(w, 0.3, d, floor, 0, -0.1, 0));
    if (back) g.add(box(w, h, 0.5, wall, 0, h / 2, -d / 2));
    if (left) g.add(box(0.5, h, d, wall, -w / 2, h / 2, 0));
    if (right) g.add(box(0.5, h, d, wall, w / 2, h / 2, 0));
    if (back) g.add(box(w, 0.4, 0.6, trim, 0, 0.2, -d / 2 + 0.3));
    return g;
}
function createDust(n = 160, w = 30, h = 12, d = 20, color = 0xfff2c8) {
    const pos = new Float32Array(n * 3); const r = makeRand(5);
    for (let i = 0; i < n; i++) { pos[i * 3] = (r() - 0.5) * w; pos[i * 3 + 1] = r() * h; pos[i * 3 + 2] = (r() - 0.5) * d; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const p = new THREE.Points(g, new THREE.PointsMaterial({ color, size: 0.12, transparent: true, opacity: 0.7, depthWrite: false }));
    let t = 0; addFx(() => { t += 1 / 60; for (let i = 0; i < n; i++) { pos[i * 3 + 1] += Math.sin(t + i) * 0.004 + 0.002; if (pos[i * 3 + 1] > h) pos[i * 3 + 1] = 0; } g.attributes.position.needsUpdate = true; });
    return p;
}
function createRain(n = 900, area = 80, h = 40) {
    const pos = new Float32Array(n * 6); const r = makeRand(9);
    for (let i = 0; i < n; i++) { const x = (r() - 0.5) * area, y = r() * h, z = (r() - 0.5) * area; pos.set([x, y, z, x + 0.1, y - 0.9, z], i * 6); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const l = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0xaac4dd, transparent: true, opacity: 0.55 }));
    addFx(() => { for (let i = 0; i < n; i++) { pos[i * 6 + 1] -= 0.9; pos[i * 6 + 4] -= 0.9; if (pos[i * 6 + 1] < 0) { pos[i * 6 + 1] += h; pos[i * 6 + 4] += h; } } g.attributes.position.needsUpdate = true; });
    return l;
}
function createBirds(n = 5, y = 25, r = 30) {
    const g = group(); const m = mat(0x222222, { side: THREE.DoubleSide });
    const birds = [];
    for (let i = 0; i < n; i++) { const b = group(); const w1 = box(1.2, 0.08, 0.4, m, -0.6, 0, 0), w2 = box(1.2, 0.08, 0.4, m, 0.6, 0, 0); b.add(w1, w2); b.w = [w1, w2]; g.add(b); birds.push(b); }
    let t = 0; addFx(() => { t += 1 / 60; birds.forEach((b, i) => { const a = t * 0.3 + i * 1.3; b.position.set(Math.cos(a) * (r - i * 2), y + Math.sin(t + i) * 2, Math.sin(a) * (r - i * 2) - 20); b.rotation.y = -a; const f = Math.sin(t * 8 + i) * 0.5; b.w[0].rotation.z = f; b.w[1].rotation.z = -f; }); });
    return g;
}
function createHorse(color = 0x6f4e37, mane = 0x2b1b12) {
    const h = group(); const bm = mat(color), mm = mat(mane);
    h.add(box(1.6, 1.6, 4, bm, 0, 3.2, 0));
    const neck = box(1.0, 2.2, 1.1, bm, 0, 4.3, 1.9); neck.rotation.x = -0.5; h.add(neck);
    const head = box(0.9, 0.9, 1.9, bm, 0, 5.2, 2.9); h.add(head);
    h.add(box(0.3, 2.2, 0.8, mm, 0, 4.6, 1.6), box(0.3, 1.6, 0.4, mm, 0, 3.1, -2.2));
    h.add(box(0.12, 0.12, 0.05, glowMat(0x111111), -0.46, 5.35, 3.4), box(0.12, 0.12, 0.05, glowMat(0x111111), 0.46, 5.35, 3.4));
    const legs = [];
    [[-0.55, 1.5], [0.55, 1.5], [-0.55, -1.5], [0.55, -1.5]].forEach(([x, z]) => { const lg = group(box(0.42, 2.5, 0.42, bm, 0, -1.25, 0), box(0.46, 0.3, 0.5, 0x222222, 0, -2.45, 0)); lg.position.set(x, 2.5, z); h.add(lg); legs.push(lg); });
    h.legs = legs; h.phase = Math.random() * 6;
    h.gallop = (t, speed = 1) => { legs.forEach((l, i) => { l.rotation.x = Math.sin(t * 10 * speed + h.phase + (i < 2 ? 0 : Math.PI)) * 0.6; }); h.children[0].position.y = 3.2 + Math.abs(Math.sin(t * 10 * speed)) * 0.15; };
    h.stand = () => legs.forEach(l => l.rotation.x = 0);
    return h;
}
// Seat a rider on a horse (both are added to one group).
function mount(rider, horse) { const g = group(horse, rider); rider.position.set(0, 2.4, -0.2); pose(rider, { ll: -1.2, rl: -1.2, la: -0.6, ra: -0.6 }); return g; }

// ===================== Moods =====================
const MOODS = {
    day: { sun: 1.35, sunColor: 0xfff4e0, amb: 0.62, ambColor: 0xffffff, hemi: 0.35, fog: 0.006 },
    bright: { sun: 1.5, sunColor: 0xffffff, amb: 0.7, ambColor: 0xffffff, hemi: 0.4, fog: 0.003 },
    golden: { sun: 1.25, sunColor: 0xffc27a, amb: 0.5, ambColor: 0xffe2c0, hemi: 0.3, fog: 0.007 },
    dusk: { sun: 0.85, sunColor: 0xff8a5c, amb: 0.42, ambColor: 0xc9a0dc, hemi: 0.3, fog: 0.01 },
    night: { sun: 0.45, sunColor: 0x9fb4ff, amb: 0.32, ambColor: 0x6f7fb8, hemi: 0.25, fog: 0.012 },
    storm: { sun: 0.55, sunColor: 0xb0c4d8, amb: 0.42, ambColor: 0x8899aa, hemi: 0.25, fog: 0.02 },
    indoor: { sun: 0.7, sunColor: 0xffd9a0, amb: 0.55, ambColor: 0xffe8cc, hemi: 0.3, fog: 0.0 },
    attic: { sun: 0.5, sunColor: 0xffd9a0, amb: 0.62, ambColor: 0xe0c8a8, hemi: 0.35, fog: 0.0 },
    cellar: { sun: 0.35, sunColor: 0xffc890, amb: 0.5, ambColor: 0xc8b090, hemi: 0.25, fog: 0.0 },
    dark: { sun: 0.3, sunColor: 0xffc890, amb: 0.28, ambColor: 0x8a7a9a, hemi: 0.15, fog: 0.008 },
    space: { sun: 1.7, sunColor: 0xffffff, amb: 0.2, ambColor: 0x8899cc, hemi: 0.08, fog: 0.0 },
    vortex: { sun: 0.6, sunColor: 0x88ccff, amb: 0.55, ambColor: 0x88aaff, hemi: 0.3, fog: 0.004 }
};
function applyMood(data) {
    const mood = MOODS[data.mood] || MOODS.day;
    scene.background = new THREE.Color(data.skyColor);
    scene.fog.color.setHex(data.skyColor);
    scene.fog.density = data.fog !== undefined ? data.fog : mood.fog;
    sun.intensity = mood.sun; sun.color.setHex(mood.sunColor);
    ambientLight.intensity = mood.amb; ambientLight.color.setHex(mood.ambColor);
    hemiLight.intensity = mood.hemi;
    const sp = data.sunPos || [40, 80, 40]; sun.position.set(sp[0], sp[1], sp[2]);
    worldGround.visible = data.ground !== false;
    if (typeof data.ground === 'number') worldGround.material.color.setHex(data.ground);
}
function gemsAt(index) {
    for (let i = index; i >= 0; i--) if (storyData[i] && storyData[i].gems !== undefined) return storyData[i].gems;
    return (window.SHOW_INFO && window.SHOW_INFO.startGems) || 0;
}

// ===================== Story player =====================
let currentSceneIndex = 0;
let activeSceneInstance = null;
let autoPlay = true;
let narratorEnabled = true;
let sceneStartTime = Date.now();
let sceneT = 0;
let narratorVoice = null;
let narratorUnlocked = false;

function loadNarratorVoice() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return;
    narratorVoice = voices.find(v => /^en(-|_)/i.test(v.lang) && /Natural|Google UK English Male|Google US English|Microsoft David|Microsoft Mark|Daniel|Alex/i.test(v.name))
        || voices.find(v => /^en(-|_)/i.test(v.lang) && /Google|Microsoft|Samantha|Daniel|Alex/i.test(v.name))
        || voices.find(v => /^en(-|_)/i.test(v.lang))
        || voices[0];
}

const NARRATOR_RATE = 0.92;
let narrationState = 'done';
let narrationEndedAt = 0;
let narrationToken = 0;

function finishNarration(token) {
    if (token !== narrationToken) return;
    narrationState = 'done';
    narrationEndedAt = Date.now();
}

function speakScene(data) {
    narrationToken++;
    const token = narrationToken;
    narrationState = 'done';
    narrationEndedAt = 0;
    if (!narratorEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    loadNarratorVoice();
    // Read one sentence at a time: some browsers cut off long speech after ~15 seconds.
    const text = `${data.title.replace(/^\d+\.\s*/, '')}. ${data.desc}`;
    const parts = (text.match(/[^.!?]+[.!?]+["')\]]*|[^.!?]+$/g) || [text]).map(p => p.trim()).filter(Boolean);
    narrationState = 'pending';
    let started = false;
    parts.forEach((part, i) => {
        const u = new SpeechSynthesisUtterance(part);
        if (narratorVoice) u.voice = narratorVoice;
        u.lang = narratorVoice?.lang || 'en-US';
        u.rate = NARRATOR_RATE;
        u.pitch = 1.0;
        u.volume = 1.0;
        u.onstart = () => { if (token !== narrationToken) return; started = true; narratorUnlocked = true; narrationState = 'speaking'; };
        if (i === parts.length - 1) {
            u.onend = () => finishNarration(token);
            u.onerror = () => finishNarration(token);
        }
        window.speechSynthesis.speak(u);
    });
    // If the browser blocks speech (no click yet), fall back to the normal timer.
    setTimeout(() => { if (token === narrationToken && !started && !window.speechSynthesis.speaking) { narrationState = 'done'; narrationEndedAt = 0; } }, 3000);
}

function narrationHoldsScene() {
    if (!narratorEnabled) return false;
    if (narrationState === 'pending' || narrationState === 'speaking') return true;
    // Short breath after the last sentence before moving on.
    return narrationEndedAt && Date.now() - narrationEndedAt < 1500;
}

function toggleNarrator() {
    narratorEnabled = !narratorEnabled;
    const btn = document.getElementById('narrator-btn');
    btn.innerText = `Narrator: ${narratorEnabled ? 'ON' : 'OFF'}`;
    if (narratorEnabled) {
        narratorUnlocked = true;
        speakScene(storyData[currentSceneIndex]);
    } else {
        narrationToken++;
        narrationState = 'done';
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
}

if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = loadNarratorVoice;
    loadNarratorVoice();
}

function clearCurrentScene() {
    for (let i = scene.children.length - 1; i >= 0; i--) {
        const child = scene.children[i];
        if (!KEEP.has(child)) scene.remove(child);
    }
}

const camBase = new THREE.Vector3(), camLook = new THREE.Vector3(), camTmp = new THREE.Vector3();
let transitioning = false;
const fadeEl = document.getElementById('fade-overlay');

function goToScene(index) {
    if (transitioning) return;
    transitioning = true;
    fadeEl.style.opacity = '1';
    setTimeout(() => {
        loadScene(index);
        fadeEl.style.opacity = '0';
        setTimeout(() => { transitioning = false; }, 600);
    }, 600);
}

function loadScene(index, speak = true) {
    clearCurrentScene();
    ambientFx = [];
    currentSceneIndex = index;
    sceneStartTime = Date.now();
    sceneT = 0;

    const data = storyData[index];
    applyMood(data);
    currentGems = index > 0 ? gemsAt(index - 1) : ((window.SHOW_INFO && window.SHOW_INFO.startGems) || 0);
    if (data.gems !== undefined && !data.gemMoment) currentGems = data.gems;
    setGemHud(currentGems, false);
    document.getElementById('scene-title').innerText = data.title;
    document.getElementById('scene-description').innerText = data.desc;
    document.getElementById('scene-counter').innerText = `SCENE ${index + 1} / ${storyData.length}`;

    camBase.set(...data.camPos); camLook.set(...data.camLookAt);
    camera.position.copy(camBase);
    camera.lookAt(camLook);

    try { activeSceneInstance = data.setup() || {}; }
    catch (err) { console.error('Scene setup error:', err); activeSceneInstance = {}; }
    if (speak) speakScene(data);
}

function nextScene() {
    goToScene((currentSceneIndex + 1) % storyData.length);
}

function prevScene() {
    goToScene((currentSceneIndex - 1 + storyData.length) % storyData.length);
}

function toggleAutoPlay() {
    autoPlay = !autoPlay;
    document.getElementById('autoplay-btn').innerText = `Autoplay: ${autoPlay ? 'ON' : 'OFF'}`;
    sceneStartTime = Date.now();
}

// One fixed simulation step (1/60 s).
function stepScene() {
    sceneT += 1 / 60;
    if (activeSceneInstance && activeSceneInstance.update) {
        try { activeSceneInstance.update(sceneT); } catch (err) { console.error('Scene update error:', err); }
    }
    for (let i = 0; i < ambientFx.length; i++) { try { ambientFx[i](); } catch (err) { } }
}

function placeCamera() {
    const elapsed = sceneT * 1000;
    const sceneP = Math.min(elapsed / getSceneDurationMs(currentSceneIndex), 1);
    let followed = false;
    if (activeSceneInstance && activeSceneInstance.cameraUpdate) {
        try { followed = activeSceneInstance.cameraUpdate(sceneT, sceneP); } catch (err) { console.error('Camera error:', err); }
    }
    if (!followed) {
        // Slow cinematic camera: gentle push-in with a soft side drift.
        const e = sceneP * sceneP * (3 - 2 * sceneP);
        camTmp.copy(camLook).sub(camBase).multiplyScalar(0.14 * e).add(camBase);
        camTmp.x += Math.sin(sceneP * Math.PI) * 1.8 * (currentSceneIndex % 2 ? 1 : -1);
        camTmp.y += Math.sin(sceneP * Math.PI) * 0.6;
        camera.position.copy(camTmp);
        camera.lookAt(camLook);
    }
}

const STEP_MS = 1000 / 60; let stepAcc = 0; let lastFrameTime = performance.now();
let paused = false;
function animate() {
    requestAnimationFrame(animate);
    const now = performance.now();
    const frame = Math.min(now - lastFrameTime, 250); lastFrameTime = now;
    if (paused) { renderer.render(scene, camera); return; }

    const elapsed = Date.now() - sceneStartTime;
    if (autoPlay) {
        const sceneDuration = getSceneDurationMs(currentSceneIndex);
        const holding = narrationHoldsScene();
        const progress = Math.min((elapsed / sceneDuration) * 100, holding ? 98 : 100);
        document.getElementById('progress-bar').style.width = `${progress}%`;

        // Move on only when the time is up AND the narrator has finished reading.
        const safetyCap = elapsed > sceneDuration * 2.5;
        if (elapsed >= sceneDuration && (!holding || safetyCap) && !transitioning) {
            nextScene();
        }
    } else {
        document.getElementById('progress-bar').style.width = `0%`;
    }

    // Fixed 60 steps per second, so speed is the same on every screen.
    stepAcc += frame;
    let steps = 0;
    while (stepAcc >= STEP_MS && steps < 5) { stepScene(); stepAcc -= STEP_MS; steps++; }
    if (steps === 5) stepAcc = 0;

    placeCamera();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
