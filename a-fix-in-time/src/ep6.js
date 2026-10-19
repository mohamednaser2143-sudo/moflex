// TITLE: The Moon Landing
// Episode 6 — Apollo 11, July 1969. A broken switch inside the lunar module, and a felt-tip pen.

// ---------- Episode 6 props ----------
const MOON = 0x8e8c88;
function createEarth(r = 6) {
    const g = group(sph(r, glowMat(0x2f6fd0), 0, 0, 0, 24));
    const rr = makeRand(3);
    for (let i = 0; i < 9; i++) { const c = sph(r * (0.2 + rr() * 0.2), glowMat(0xf4f8ff, 0.85), 0, 0, 0, 10); const a = rr() * 6.28, b = (rr() - 0.5) * 2.4; c.position.set(Math.cos(a) * Math.cos(b) * r * 0.86, Math.sin(b) * r * 0.86, Math.sin(a) * Math.cos(b) * r * 0.86); c.scale.set(1, 0.35, 1); g.add(c); }
    for (let i = 0; i < 4; i++) { const l = sph(r * 0.35, glowMat(0x4f9a4a), 0, 0, 0, 10); const a = i * 1.6, b = (i - 1.5) * 0.4; l.position.set(Math.cos(a) * Math.cos(b) * r * 0.75, Math.sin(b) * r * 0.75, Math.sin(a) * Math.cos(b) * r * 0.75); g.add(l); }
    const gl = createGlow(0x6fb0ff, r * 3.2, 0.35); gl.material.fog = false; g.add(gl);
    g.traverse(o => { if (o.material) o.material.fog = false; });
    return g;
}
function createCrater(x, z, r = 3) {
    const g = group(); const ring = new THREE.Mesh(new THREE.TorusGeometry(r, r * 0.22, 6, 20), mat(0x9a9894, { flatShading: true })); ring.rotation.x = Math.PI / 2; ring.scale.z = 0.5; g.add(ring);
    const floor = new THREE.Mesh(new THREE.CircleGeometry(r, 20), mat(0x7a7874)); floor.rotation.x = -Math.PI / 2; floor.position.y = 0.02; g.add(floor);
    g.position.set(x, 0, z); return g;
}
function moonSet(opts = {}) {
    add(createStars(900, 300, 1.1));
    const earth = add(createEarth(opts.earthSize || 7)); earth.position.set(...(opts.earthPos || [-60, 50, -160]));
    const r = makeRand(opts.seed || 5);
    for (let i = 0; i < 12; i++) add(createCrater((r() - 0.5) * 120, -10 - r() * 80, 2 + r() * 6));
    for (let i = 0; i < 16; i++) add(createRock((r() - 0.5) * 80, 0.3, (r() - 0.5) * 60, 0.3 + r() * 0.9, 0x7f7d79));
    return { earth };
}
// The lunar module "Eagle": gold descent stage with four legs, grey ascent stage on top.
function createLM() {
    const g = group(); const gold = mat(0xd4a017, { metalness: 0.7, roughness: 0.35 }), silver = mat(0xb8b8b8, { metalness: 0.6, roughness: 0.4 }), dark = mat(0x2a2a2a);
    const ds = cyl(3.2, 3.2, 3, gold, 0, 4, 0, 8); ds.rotation.y = Math.PI / 8; g.add(ds);
    [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(([a, b]) => {
        g.add(createRope([a * 2.4, 4.5, b * 2.4], [a * 4.6, 0.6, b * 4.6], 0xc0c0c0, 0.14), createRope([a * 2.4, 3, b * 2.4], [a * 4.6, 0.6, b * 4.6], 0xc0c0c0, 0.1));
        g.add(cyl(0.9, 0.9, 0.2, silver, a * 4.6, 0.4, b * 4.6, 12));
    });
    for (let i = 0; i < 7; i++) g.add(box(1.2, 0.12, 0.12, silver, 3.9, 0.9 + i * 0.5, 2.9));
    g.add(box(2.6, 0.2, 1.6, silver, 3.3, 3.9, 1.8));
    const as = group(box(4.2, 3.4, 4.0, silver, 0, 0, 0), box(3.4, 2.4, 1.2, silver, 0, 0.3, 2.4), box(2.6, 1.2, 0.2, dark, 0, 1.8, 0), cyl(0.9, 0.9, 1.2, silver, 0, 2.2, -0.6, 10));
    const w1 = box(0.9, 0.7, 0.1, glowMat(0x1a2a3a), -0.8, 0.9, 3.01), w2 = box(0.9, 0.7, 0.1, glowMat(0x1a2a3a), 0.8, 0.9, 3.01); as.add(w1, w2);
    as.add(box(1.2, 1.4, 0.2, dark, 0, -0.6, 3.0));
    const dish = cyl(0.9, 0.1, 0.5, silver, 2.2, 2.6, -1.2, 12); dish.rotation.z = 0.6; as.add(dish, box(0.1, 1.4, 0.1, silver, 1.9, 1.9, -1.2));
    as.position.set(0, 7.2, 0); g.add(as);
    g.ascent = as; return g;
}
function createAstronaut(o = {}) {
    const a = createPerson(Object.assign({ shirt: 0xf2f2f2, legs: 0xf2f2f2, sleeves: 0xf2f2f2, skin: 0xe0e0e0, hat: 'space', shoes: 0xdcdcdc }, o));
    a.inner.add(box(1.9, 2.2, 1.0, 0xe8e8e8, 0, 3.1, -1.0), box(1.4, 0.4, 0.8, 0xc0c0c0, 0, 4.4, -1.0));
    a.inner.add(box(0.6, 0.5, 0.15, mat(0x2b4a9a), 0.5, 3.4, 0.55));
    a.rig.leftArmGroup.children[1].material = mat(0xdcdcdc); a.rig.rightArmGroup.children[1].material = mat(0xdcdcdc);
    return a;
}
// Inside the suits the astronauts move slowly and bounce.
function moonHop(a, t, x0, z0, dx, dz, ph = 0) { const k = t * 0.3 + ph; a.position.set(x0 + Math.sin(k) * dx, Math.abs(Math.sin(t * 2.2 + ph)) * 0.9, z0 + Math.cos(k) * dz); a.rotation.y = Math.atan2(Math.cos(k) * dx, -Math.sin(k) * dz); pose(a, { la: -0.3, ra: -0.3, ll: -0.3, rl: 0.3 }); }
function createFlag() {
    const c = document.createElement('canvas'); c.width = 380; c.height = 200; const g = c.getContext('2d');
    for (let i = 0; i < 13; i++) { g.fillStyle = i % 2 ? '#ffffff' : '#b22234'; g.fillRect(0, i * 200 / 13, 380, 200 / 13 + 1); }
    g.fillStyle = '#3c3b6e'; g.fillRect(0, 0, 152, 108); g.fillStyle = '#ffffff';
    for (let r = 0; r < 5; r++) for (let k = 0; k < 6; k++) g.fillRect(10 + k * 24, 10 + r * 20, 6, 6);
    const f = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.6), new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(c), side: THREE.DoubleSide }));
    f.position.set(1.5, 4.2, 0);
    return group(cyl(0.05, 0.05, 5, 0xdddddd, 0, 2.5, 0, 6), box(3, 0.06, 0.06, 0xdddddd, 1.5, 5, 0), f);
}
// The watch's bubble of air and warmth around Mohamed.
function createBubble(r = 3.2) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), new THREE.MeshBasicMaterial({ color: 0x6fd3ff, transparent: true, opacity: 0.16, depthWrite: false }));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.04, 6, 48), glowMat(0x9be7ff, 0.5)); b.add(ring);
    let t = 0; addFx(() => { t += 1 / 60; ring.rotation.x = t * 0.7; ring.rotation.y = t * 0.4; b.material.opacity = 0.13 + Math.sin(t * 2) * 0.04; });
    return b;
}
function panelTexture(seed = 1) {
    const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d'); const r = makeRand(seed);
    g.fillStyle = '#4a4e52'; g.fillRect(0, 0, 512, 256);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 16; x++) { g.fillStyle = '#222'; g.beginPath(); g.arc(18 + x * 31, 18 + y * 30, 7, 0, 6.3); g.fill(); g.fillStyle = r() < 0.15 ? '#e8b54a' : '#cfd2d6'; g.fillRect(16 + x * 31, 8 + y * 30, 4, 10); }
    g.fillStyle = '#e8e8e8'; g.font = 'bold 14px monospace'; for (let i = 0; i < 6; i++) g.fillText(['ENG ARM', 'ABORT', 'RCS', 'PRPLNT', 'S-BAND', 'DSKY'][i], 10 + i * 84, 250);
    return new THREE.CanvasTexture(c);
}
// Cramped cabin of the lunar module, open towards the camera.
function createCabin() {
    const g = group(box(10, 0.3, 7, 0x6a6a6a, 0, -0.1, 0));
    const pm = new THREE.MeshStandardMaterial({ map: panelTexture(2), roughness: 0.7 });
    const back = new THREE.Mesh(new THREE.BoxGeometry(10, 4.5, 0.4), [mat(0x555555), mat(0x555555), mat(0x555555), mat(0x555555), pm, mat(0x555555)]); back.position.set(0, 4.5, -3.3); g.add(back);
    g.add(box(10, 2.3, 0.4, 0x5a5e62, 0, 1.15, -3.3), box(0.4, 9, 7, 0x5a5e62, -5, 4.5, 0), box(0.4, 9, 7, 0x5a5e62, 5, 4.5, 0), box(10, 0.4, 7, 0x4a4e52, 0, 9, 0));
    const sideM = new THREE.MeshStandardMaterial({ map: panelTexture(7), roughness: 0.7 });
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 4), sideM); side.position.set(4.75, 5, -0.8); g.add(side);
    [-2.6, 2.6].forEach(x => { const w = new THREE.Mesh(new THREE.CircleGeometry(0.9, 3), glowMat(0x05070d)); w.position.set(x, 7.6, -3.08); g.add(w); });
    for (let i = 0; i < 5; i++) g.add(box(1.4, 0.8, 0.8, [0xd8d8d8, 0xb0b0b0, 0x8a8a8a][i % 3], -4 + i * 0.3, 0.4 + (i % 2) * 0.8, 2.4));
    const lamp = new THREE.PointLight(0xfff2dc, 0.9, 30, 1.5); lamp.position.set(0, 7, 1); g.add(lamp);
    return g;
}
const neil = () => createAstronaut();
const buzz = () => createAstronaut();

// ---------- Story ----------
const storyData = [
    {
        title: "1. Silence",
        desc: "No wind. No birds. No sound at all. Mohamed opens his eyes on a grey, dusty plain under a pitch black sky full of stars. He gasps, but there is air. A bubble of soft blue light surrounds him, glowing from his pocket watch. He is standing on the Moon.",
        camPos: [0, 5, 16], camLookAt: [0, 3, 0], skyColor: 0x000000, mood: 'space', ground: MOON, sunPos: [60, 30, 20],
        setup: () => {
            moonSet();
            const kid = add(at(createKid(), 0, 0, 0, Math.PI)); const bub = add(createBubble(3)); bub.position.set(0, 2, 0);
            const portal = add(createPortal(2.5)); portal.position.set(0, 3, 0); portal.setPower(1);
            return { update: t => { portal.setPower(1 - ease(t, 0.3, 2)); bub.scale.setScalar(ease(t, 0.5, 2.5) + 0.01); if (t < 3) { kid.inner.position.y = -1.3; pose(kid, { ll: -1.5, rl: -1.5 }); } else { kid.inner.position.y = -1.3 * (1 - ease(t, 3, 4)); if (t > 5) shock(kid); else pose(kid, {}); kid.rotation.y = lerpAngle(kid.rotation.y, Math.PI + Math.sin(t * 0.4), 0.02); } kid.watch.setPower(3); } };
        }
    },
    {
        title: "2. One Bouncy Step",
        desc: "Mohamed takes a careful step, and floats up, up and slowly down again. Here he weighs much less than on Earth. He laughs out loud and tries a jump. He sails higher than a basketball hoop. The bubble moves with him, and his sneakers leave little prints in the soft grey dust.",
        camPos: [10, 6, 16], camLookAt: [0, 4, 0], skyColor: 0x000000, mood: 'space', ground: MOON, sunPos: [60, 30, 20],
        setup: () => {
            moonSet();
            const kid = add(at(createKid(), -8, 0, 0, Math.PI / 2)); const bub = add(createBubble(3)); const look = new THREE.Vector3();
            const prints = []; for (let i = 0; i < 10; i++) { const p = add(box(0.4, 0.03, 0.7, 0x5a5854, 0, 0.02, 0)); p.visible = false; prints.push(p); }
            return { update: t => { const x = -8 + t * 0.6; const h = Math.abs(Math.sin(t * 1.3)) * (t > 6 ? 5 : 1.6); kid.position.set(x, h, 0); bub.position.set(x, h + 2, 0); pose(kid, h > 0.6 ? { la: -2.6, ra: -2.6, ll: -0.5, rl: 0.3 } : { la: -0.3, ra: -0.3 }); const i = Math.floor(t * 1.3 / Math.PI * 2) % 10; if (h < 0.15) { prints[i].visible = true; prints[i].position.set(x, 0.02, (i % 2 ? 0.4 : -0.4)); } }, cameraUpdate: () => { look.set(kid.position.x, 3 + kid.position.y * 0.5, 0); camera.position.set(kid.position.x + 7, 5, 15); camera.lookAt(look); return true; } };
        }
    },
    {
        title: "3. Earth in the Sky",
        desc: "Then Mohamed looks up. Hanging in the black sky is a beautiful blue and white ball, small enough to cover with his thumb. Oceans, clouds, a hint of green. That is Earth. Everyone he has ever known is on that little marble. Home has never looked so far away.",
        camPos: [5.4, 3.4, 45.5], camLookAt: [-6, 9, 0], skyColor: 0x000000, mood: 'space', ground: MOON, sunPos: [60, 30, 20],
        setup: () => {
            moonSet({ earthPos: [-24, 30, -90], earthSize: 7 });
            const kid = add(at(createKid(), 2.6, 0, 39, Math.PI + 0.3)); const bub = add(createBubble(3)); bub.position.set(2.6, 2, 39);
            return { update: t => { pose(kid, { nod: -0.5, la: 0.1, ra: t > 7 ? -2.4 : 0, raz: t > 7 ? 0.3 : 0 }); } };
        }
    },
    {
        title: "4. The Eagle Has Landed",
        desc: "Not far away, standing on four spidery legs wrapped in shining gold foil, is a strange spacecraft. Mohamed knows it from his school books. It is the Eagle, the lunar module of Apollo 11. The date is the twentieth of July, nineteen sixty nine. Humans have just landed on the Moon for the very first time.",
        camPos: [18, 7, 22], camLookAt: [0, 5, 0], skyColor: 0x000000, mood: 'space', ground: MOON, sunPos: [60, 30, 20],
        setup: () => {
            moonSet();
            add(createLM());
            const kid = add(at(createKid(), 12, 0, 12, -2.4)); const bub = add(createBubble(3)); bub.position.set(12, 2, 12);
            return { update: t => { if (t > 5) point(kid, t); else idle(kid, t); } };
        }
    },
    {
        title: "5. Two Men on the Moon",
        desc: "Two astronauts in bulky white suits bounce slowly across the dust: Neil Armstrong and Buzz Aldrin. They plant a flag, set up science experiments and collect moon rocks in bags. Mohamed ducks behind a crater rim. He must not change history. He must only watch.",
        camPos: [16, 6, 24], camLookAt: [0, 3, 0], skyColor: 0x000000, mood: 'space', ground: MOON, sunPos: [60, 30, 20],
        setup: () => {
            moonSet();
            const lm = add(createLM()); lm.position.set(-10, 0, -8);
            const flag = add(createFlag()); flag.position.set(2, 0, -2);
            const a1 = add(neil()); const a2 = add(buzz());
            add(createCrater(10, 12, 3.5));
            const kid = add(at(createKid(), 10, 0, 14, -2.6)); kid.inner.position.y = -0.8; const bub = add(createBubble(2.6)); bub.position.set(10, 1.4, 14);
            return { update: t => { moonHop(a1, t, -2, 2, 5, 3, 0); moonHop(a2, t, 4, -4, 3, 3, 2); if (Math.floor(t) % 6 < 2) pose(a2, { ra: -1.2, la: -0.3 }); pose(kid, { ll: -1, rl: -1, la: -0.4, ra: -0.4 }); } };
        }
    },
    {
        title: "6. Alone Above the Moon",
        desc: "High above, a third astronaut, Michael Collins, circles the Moon alone in the command module, Columbia. Every two hours he passes behind the Moon, where no radio can reach him, and he is more alone than any person has ever been. He is waiting to carry his friends home.",
        camPos: [0, 2, 26], camLookAt: [0, 0, 0], skyColor: 0x000000, mood: 'space', ground: false, sunPos: [60, 30, 40],
        setup: () => {
            add(createStars(1200, 260, 1.1));
            const moon = add(sph(60, mat(0x8e8c88, { flatShading: true }), 0, -70, -40, 24)); moon.castShadow = false;
            const cm = add(group(cone(1.8, 2.6, mat(0xd8d8d8, { metalness: 0.7, roughness: 0.3 }), 0, 0, 0, 16), cyl(1.8, 1.8, 5, mat(0xc8c8c8, { metalness: 0.6, roughness: 0.4 }), 0, -3.8, 0, 16), cone(1.2, 1.6, 0x444444, 0, -7, 0, 12)));
            cm.rotation.z = Math.PI / 2; cm.children[2].rotation.x = Math.PI;
            return { update: t => { cm.position.set(-6 + t * 0.4, 2, 0); cm.rotation.x = t * 0.05; moon.rotation.y = t * 0.01; } };
        }
    },
    {
        title: "7. A Purple Shimmer",
        desc: "While the astronauts work far from the Eagle, Mohamed sees something that makes his blood run cold. A swirl of purple light opens beside the lunar module, and the man in the grey coat steps out, wrapped in a bubble of his own. He climbs the ladder and slips inside the Eagle.",
        camPos: [16, 7, 20], camLookAt: [0, 5, 0], skyColor: 0x000000, mood: 'space', ground: MOON, sunPos: [60, 30, 20],
        setup: () => {
            moonSet();
            add(createLM());
            const portal = add(createPortal(2.6, [0x7a2bd6, 0xb05cff, 0x3a0a6a, 0xe0b0ff])); portal.position.set(6, 3, 6); portal.rotation.y = 0.8; portal.setPower(0);
            const col = add(at(createCollector(), 6, 0, 6, -0.8)); const cb = add(new THREE.Mesh(new THREE.SphereGeometry(3.4, 20, 14), new THREE.MeshBasicMaterial({ color: 0xa04cff, transparent: true, opacity: 0.15, depthWrite: false })));
            const kid = add(at(createKid(), 14, 0, 12, -2.4)); kid.inner.position.y = -0.7; const bub = add(createBubble(2.6)); bub.position.set(14, 1.4, 12);
            return { update: t => { portal.setPower(ease(t, 0, 2) * (1 - ease(t, 4, 5))); col.visible = t > 1.5 && t < 11; if (t > 3 && t < 7) walkTo(col, 3.9, 4, 0.04); if (t >= 7) { col.position.set(3.9, Math.min(4.2, (t - 7) * 1.2), 3.2); pose(col, { la: -2.6 + Math.sin(t * 5) * 0.3, ra: -2.6 - Math.sin(t * 5) * 0.3 }); col.rotation.y = Math.PI; } cb.position.set(col.position.x, col.position.y + 3, col.position.z); cb.visible = col.visible; col.watch.pulse(); if (t > 3) shock(kid); else idle(kid, t); pose(kid, { ll: -0.8, rl: -0.8, la: -0.7, ra: -0.7, laz: -0.5, raz: 0.5 }); } };
        }
    },
    {
        title: "8. Inside the Eagle",
        desc: "Mohamed bounces across the dust as fast as he can and follows him up the ladder. Inside, the Eagle is tiny, no bigger than a cupboard, and covered from floor to ceiling in switches, dials and little round buttons. In the corner, bent over a panel, is the man in grey.",
        camPos: [0, 5, 10], camLookAt: [0, 4.5, -1], skyColor: 0x111111, mood: 'indoor', ground: false,
        setup: () => {
            add(createCabin());
            const col = add(at(createCollector(), 3, 0, -1.2, 1.2));
            const kid = add(at(createKid(), -2.6, 0, 1.8, 2.6)); const bub = add(createBubble(2.4)); bub.position.set(-2.6, 2, 1.8);
            return { update: t => { pose(col, { ra: -1.5, la: -1.2, nod: 0.2 }); col.watch.pulse(); if (t > 5) shock(kid); else idle(kid, t); } };
        }
    },
    {
        title: "9. Snap",
        desc: "Before Mohamed can shout, the Collector pushes his elbow hard against the panel. There is a small, sharp snap. A tiny plastic switch breaks off and drops to the floor. Without this, he says softly, their engine will never start. They will never leave the Moon. And the watch will have nothing left to fix. Then he is gone in a purple flash.",
        camPos: [2, 5.5, 7], camLookAt: [3, 4.8, -1], skyColor: 0x111111, mood: 'indoor', ground: false,
        setup: () => {
            add(createCabin());
            const col = add(at(createCollector(), 3, 0, -0.6, 1.4));
            const tip = add(box(0.12, 0.35, 0.12, 0xe8e8e8, 4.6, 5.2, -0.6));
            const portal = add(createPortal(2.2, [0x7a2bd6, 0xb05cff, 0x3a0a6a, 0xe0b0ff])); portal.position.set(2.4, 3.4, -0.8); portal.setPower(0);
            const kid = add(at(createKid(), -1.4, 0, 1.8, 2.2));
            return { update: t => { if (t < 3) pose(col, { la: -0.8, laz: -0.6 }); else pose(col, { la: -0.3 }); if (t > 2.6) { tip.position.y = Math.max(0.1, 5.2 - (t - 2.6) * 1.0); tip.position.x = 4.6 - Math.min(1.2, (t - 2.6) * 0.3); tip.rotation.z += 0.02; } col.watch.pulse(); portal.setPower(ease(t, 10, 11) * (1 - ease(t, 13, 14))); col.visible = t < 12; if (t > 3) shock(kid); else idle(kid, t); } };
        }
    },
    {
        title: "10. Hiding in Plain Sight",
        desc: "Clang, clang. The astronauts are climbing back up the ladder. Mohamed squeezes into the corner behind a stack of equipment and holds his breath. His bubble makes him shimmer like heat over a summer road. Buzz and Neil are tired, hot and very busy. They do not notice the little shimmer in the corner.",
        camPos: [0, 5, 10], camLookAt: [0, 4, -1], skyColor: 0x111111, mood: 'indoor', ground: false,
        setup: () => {
            add(createCabin());
            const a1 = add(at(neil(), -1.4, 0, -0.6, 0)); const a2 = add(at(buzz(), 1.6, 0, -0.6, 0));
            const kid = add(at(createKid(), -3.9, 0, 2.2, 0.8)); kid.inner.position.y = -0.8; kid.scale.setScalar(0.95);
            const bub = add(createBubble(1.8)); bub.position.set(-3.9, 1.5, 2.2);
            const tip = add(box(0.12, 0.35, 0.12, 0xe8e8e8, 3.4, 0.1, 0.4)); tip.rotation.z = 1.4;
            return { update: t => { pose(kid, { ll: -1.2, rl: -1.2, la: -1.6, ra: -1.6, laz: 0.4, raz: -0.4 }); kid.position.x = -3.9 + Math.sin(t * 9) * 0.02; work(a1, t * 0.5); work(a2, t * 0.5, 2); a1.position.y = Math.max(0, 3 - t * 1.2); a2.position.y = Math.max(0, 4 - t * 1.2); } };
        }
    },
    {
        title: "11. Time to Go Home",
        desc: "The astronauts take off their helmets, eat a little, and try to rest. Soon it will be time to fire the engine and fly back up to Columbia. Buzz runs through the long checklist. Every switch, every dial must be just right. Mohamed watches from his corner, his heart thumping.",
        camPos: [0, 5, 10], camLookAt: [0, 4, -1], skyColor: 0x111111, mood: 'indoor', ground: false,
        setup: () => {
            add(createCabin());
            const a1 = add(at(createAstronaut({ hat: null, hair: 0x7a5a3a, skin: 0xf1c27d }), -1.4, 0, -0.6, 0)); const a2 = add(at(createAstronaut({ hat: null, hair: 0x5a4a3a, skin: 0xe0ac69 }), 1.6, 0, -0.6, 0));
            const kid = add(at(createKid(), -3.9, 0, 2.2, 0.8)); kid.inner.position.y = -0.8; const bub = add(createBubble(1.8)); bub.position.set(-3.9, 1.5, 2.2);
            const list = add(box(0.9, 1.2, 0.05, 0xf2f2f2));
            return { update: t => { pose(kid, { ll: -1.2, rl: -1.2, la: -1.6, ra: -1.6, laz: 0.4, raz: -0.4 }); pose(a2, { la: -1.3, ra: -1.6 + Math.sin(t * 2) * 0.1 }); const hp = new THREE.Vector3(); a2.rig.leftArmGroup.children[1].getWorldPosition(hp); list.position.copy(hp); list.position.y += 0.4; idle(a1, t); a1.rig.head.rotation.y = Math.sin(t * 0.5) * 0.4; } };
        }
    },
    {
        title: "12. Something on the Floor",
        desc: "Then Buzz Aldrin stops. Something small and white is lying on the floor. He picks it up and turns it over in his glove. Then he looks at the panel, and his face goes pale. It is the tip of a circuit breaker switch, the one that arms the engine. Without it, the engine cannot start.",
        camPos: [3, 5, 6], camLookAt: [2, 3.5, -1], skyColor: 0x111111, mood: 'indoor', ground: false,
        setup: () => {
            add(createCabin());
            const a2 = add(at(createAstronaut({ hat: null, hair: 0x5a4a3a, skin: 0xe0ac69 }), 1.6, 0, -0.6, 0.6));
            const tip = add(box(0.12, 0.35, 0.12, 0xe8e8e8, 3.4, 0.1, 0.4)); tip.rotation.z = 1.4;
            return { update: t => { if (t < 3) { a2.inner.position.y = -1.2 * ease(t, 0, 2); pose(a2, { ra: -1.3 * ease(t, 0, 2), ll: -1, rl: -0.4, nod: 0.6 }); } else { a2.inner.position.y = -1.2 * (1 - ease(t, 3, 4.5)); pose(a2, { ra: -1.6, raz: -0.3, nod: -0.1 }); const hp = new THREE.Vector3(); a2.rig.rightArmGroup.children[1].getWorldPosition(hp); tip.position.copy(hp); tip.position.y += 0.3; tip.rotation.z = 0; } if (t > 8) { a2.rotation.y = lerpAngle(a2.rotation.y, 1.4, 0.05); shock(a2); } } };
        }
    },
    {
        title: "13. A Tiny Hole",
        desc: "Where the switch used to be, there is just a tiny hole. Something has to push the breaker in. But a metal tool might cause a spark, and a spark among all those wires could be dangerous. Neil and Buzz look at each other. Far away in Houston, Mission Control is already thinking hard.",
        camPos: [3.4, 5.2, 2.6], camLookAt: [4.75, 5, -0.8], skyColor: 0x111111, mood: 'indoor', ground: false,
        setup: () => {
            add(createCabin());
            const hole = add(createGlow(0xffd166, 0.5, 0.9)); hole.position.set(4.62, 5.2, -0.6);
            const a2 = add(at(createAstronaut({ hat: null, hair: 0x5a4a3a, skin: 0xe0ac69 }), 2.4, 0, 0.4, 1.2));
            return { update: t => { hole.material.opacity = 0.4 + Math.abs(Math.sin(t * 3)) * 0.6; think(a2, t); } };
        }
    },
    {
        title: "14. Mohamed's Pen",
        desc: "Mohamed's hand goes to his backpack. Inside, between his maths book and a squashed sandwich, is a felt-tip pen. Plastic, not metal. Very quietly, he slides it across the floor until it bumps against Buzz's boot. Buzz looks down, blinks, and picks it up.",
        camPos: [0, 3.4, 7], camLookAt: [0, 1.6, 0], skyColor: 0x111111, mood: 'indoor', ground: false,
        setup: () => {
            add(createCabin());
            const kid = add(at(createKid(), -3.6, 0, 2, 1.2)); kid.inner.position.y = -0.8;
            const a2 = add(at(createAstronaut({ hat: null, hair: 0x5a4a3a, skin: 0xe0ac69 }), 2.2, 0, 0.2, -0.3));
            const pen = add(group(cyl(0.07, 0.07, 0.9, 0x2a2a2a, 0, 0, 0, 8), cone(0.07, 0.15, 0x111111, 0, 0.52, 0, 8))); pen.rotation.z = Math.PI / 2;
            return { update: t => { pose(kid, { ll: -1.2, rl: -1.2, ra: -1.2, la: -0.6 }); const hp = new THREE.Vector3(); if (t < 4) { kid.rig.rightArmGroup.children[1].getWorldPosition(hp); pen.position.copy(hp); } else if (t < 8) { const k = ease(t, 4, 7.5); pen.position.set(lerp(-2.4, 1.8, k), 0.1, lerp(1.8, 0.6, k)); pen.rotation.y = t * 2; } else { a2.inner.position.y = -1 * ease(t, 8, 9) * (1 - ease(t, 11, 12)); pose(a2, { ra: -1.2, nod: 0.5 }); a2.rig.rightArmGroup.children[1].getWorldPosition(hp); if (t > 9.5) pen.position.copy(hp); } } };
        }
    },
    {
        title: "15. Click",
        desc: "Buzz Aldrin pulls the cap off the felt-tip pen, slides it into the tiny hole, and pushes. Click. The circuit breaker goes in, and it stays in. Neil grins. Down in Houston, a voice crackles over the radio: Eagle, you are go for lift off.",
        camPos: [3.6, 5.4, 2.4], camLookAt: [4.75, 5.1, -0.8], skyColor: 0x111111, mood: 'indoor', ground: false,
        setup: () => {
            add(createCabin());
            const pen = add(group(cyl(0.07, 0.07, 0.9, 0x2a2a2a, 0, 0, 0, 8), cone(0.07, 0.15, 0x111111, 0, 0.52, 0, 8))); pen.rotation.z = -Math.PI / 2;
            const glove = add(box(0.5, 0.5, 0.5, 0xdcdcdc));
            const light = add(createGlow(0x6fff8a, 0.1, 0.9)); light.position.set(4.6, 5.8, -1.6);
            return { update: t => { const k = ease(t, 2, 6); pen.position.set(lerp(3.2, 4.1, k), 5.2, -0.6); glove.position.set(pen.position.x - 0.7, 5.2, -0.6); if (t > 6) { light.scale.setScalar(1.2); } } };
        }
    },
    {
        title: "16. Back Outside",
        desc: "Mohamed's watch tugs at him, and in a soft blue flash he is outside again on the dust, a safe distance away. He must not be inside when the engine fires. He crouches behind a rock, crosses his fingers, and waits.",
        camPos: [20, 5, 22], camLookAt: [0, 5, 0], skyColor: 0x000000, mood: 'space', ground: MOON, sunPos: [60, 30, 20],
        setup: () => {
            moonSet(); add(createLM()); add(createFlag()).position.set(6, 0, 4);
            const kid = add(at(createKid(), 16, 0, 16, -2.4)); kid.inner.position.y = -0.7; const bub = add(createBubble(2.6)); bub.position.set(16, 1.4, 16);
            const p = add(createPortal(1.8)); p.position.set(16, 2.5, 16); p.setPower(1);
            add(createRock(14.4, 0.6, 14.6, 1.2, 0x7f7d79));
            return { update: t => { p.setPower(1 - ease(t, 0, 2)); pose(kid, { ll: -1, rl: -1, la: -1.5, ra: -1.5, laz: 0.4, raz: -0.4 }); } };
        }
    },
    {
        title: "17. Lift Off",
        desc: "With a silent burst of fire and a spray of moon dust, the top half of the Eagle leaps off its golden base and climbs into the black sky. Mohamed jumps up and cheers, bouncing higher than ever. They are going home. History is safe.",
        camPos: [24, 9, 30], camLookAt: [0, 14, 0], skyColor: 0x000000, mood: 'space', ground: MOON, sunPos: [60, 30, 20],
        setup: () => {
            moonSet(); const lm = add(createLM());
            const fire = add(cone(1.2, 3, glowMat(0xffb84a), 0, 0, 0, 10)); fire.rotation.x = Math.PI;
            const glow = add(createGlow(0xffd27a, 6, 0.7));
            const dust = add(createBurst(0xbdbab4, 220, 0.35)); dust.position.set(0, 1, 0); let fired = false;
            const kid = add(at(createKid(), 16, 0, 16, -2.4)); const bub = add(createBubble(2.6));
            return { update: t => { const k = Math.max(0, t - 2); lm.ascent.position.y = 7.2 + k * k * 0.04; fire.visible = t > 2; glow.visible = t > 2; fire.position.set(0, lm.ascent.position.y - 3.4, 0); glow.position.copy(fire.position); fire.scale.y = 1 + Math.sin(t * 30) * 0.15; if (t > 2 && !fired) { fired = true; dust.fire(); flashScreen('#ffe0a0', 700); } const h = t > 3 ? Math.abs(Math.sin(t * 1.5)) * 4 : 0; kid.position.y = h; bub.position.set(16, h + 1.8, 16); if (t > 3) cheer(kid, t); else idle(kid, t); } };
        }
    },
    {
        title: "18. Home Together",
        desc: "High above the Moon, the little ascent stage meets Columbia. The two spacecraft dock with a gentle bump. Michael Collins opens the hatch and welcomes his friends back. Soon all three will be heading home to Earth, to a planet waiting to cheer for them.",
        camPos: [0, 3, 22], camLookAt: [0, 0, 0], skyColor: 0x000000, mood: 'space', ground: false, sunPos: [60, 30, 40],
        setup: () => {
            add(createStars(1200, 260, 1.1)); const moon = add(sph(60, mat(0x8e8c88, { flatShading: true }), 0, -72, -40, 24)); moon.castShadow = false;
            const earth = add(createEarth(5)); earth.position.set(30, 20, -100);
            const cm = add(group(cone(1.8, 2.6, mat(0xd8d8d8, { metalness: 0.7, roughness: 0.3 }), 0, 0, 0, 16), cyl(1.8, 1.8, 5, mat(0xc8c8c8, { metalness: 0.6, roughness: 0.4 }), 0, -3.8, 0, 16))); cm.rotation.z = -Math.PI / 2; cm.position.set(4, 1, 0);
            const as = add(createLM().ascent); as.scale.setScalar(0.7);
            return { update: t => { const k = ease(t, 0, 9); as.position.set(lerp(-14, -0.4, k), 1 + Math.sin(t) * 0.2 * (1 - k), 0); as.rotation.y = Math.PI / 2; if (t > 9 && !as.docked) { as.docked = 1; flashScreen('#ffffff', 400); } } };
        }
    },
    {
        title: "19. The Sixth Gem",
        desc: "Alone on the quiet grey plain, Mohamed feels the watch grow warm. A deep blue gem, the colour of Earth's oceans, glows into place. Six. Only one empty slot left now. In real life, Buzz Aldrin truly did fix that broken switch with a felt-tip pen.",
        camPos: [0, 4.4, 7.5], camLookAt: [0, 3, 0], skyColor: 0x000000, mood: 'space', ground: MOON, sunPos: [60, 30, 20], gems: 6, gemMoment: true,
        setup: () => {
            moonSet({ earthPos: [-30, 40, -120] });
            const kid = add(at(createKid(), 0, 0, 0, 0.2)); const bub = add(createBubble(3)); bub.position.set(0, 2, 0);
            let lit = false;
            return { update: t => { if (t > 3 && !lit) { lit = true; lightGem(kid, 6); } if (t > 3) pose(kid, { la: -1.1, laz: 0.4, nod: 0.3 }); else idle(kid, t); } };
        }
    },
    {
        title: "20. The Dark Side",
        desc: "On the far side of the Moon, where the sun never reaches, the Collector stands in the cold dark. His watch is nothing but cracks now, flickering weakly. One gem left, he says, and his voice is shaking. Then I will go back to the very beginning. Back to the day that watch was made. And I will make sure it is never finished.",
        camPos: [0, 4.5, 10], camLookAt: [0, 4, 0], skyColor: 0x000000, mood: 'night', ground: 0x3a3a3a, sunPos: [-20, 40, -40],
        setup: () => {
            add(createStars(1200, 260, 1.1));
            for (let i = 0; i < 6; i++) add(createRock(-8 + i * 3, 0.4, -4 - (i % 2) * 3, 0.8, 0x4a4a4a));
            const col = add(at(createCollector(), 0, 0, 0, 0)); const cb = add(new THREE.Mesh(new THREE.SphereGeometry(3.6, 20, 14), new THREE.MeshBasicMaterial({ color: 0xa04cff, transparent: true, opacity: 0.12, depthWrite: false }))); cb.position.y = 3;
            const purple = add(createGlow(0xa04cff, 2.5, 0.5));
            return { update: t => { pose(col, { ra: -1.6, raz: -0.6, nod: 0.4 }); const wp = new THREE.Vector3(); col.watch.getWorldPosition(wp); purple.position.copy(wp); col.watch.setPower(0.1 + Math.abs(Math.sin(t * 7)) * 0.3); if (t > 9) { pose(col, { la: -0.5, ra: -0.5, laz: -0.4, raz: 0.4 }); } } };
        }
    },
    {
        title: "21. Crack",
        desc: "Mohamed is smiling at the Earth when he hears a sound like breaking ice. He looks down. A crack has appeared right across the glowing face of his watch. The hands spin backwards, faster and faster. The bubble flickers. A ring of light rips open around him, and through it he sees an old wooden shop sign: Yusuf Clocks, eighteen ninety nine.",
        camPos: [2, 5, 13], camLookAt: [0, 3, 0], skyColor: 0x000000, mood: 'space', ground: MOON, sunPos: [60, 30, 20],
        setup: () => {
            moonSet({ earthPos: [-30, 40, -120] });
            const kid = add(at(createKid(), 0, 0, 0, 0)); const bub = add(createBubble(3)); bub.position.set(0, 2, 0);
            const crack = add(box(0.7, 0.05, 0.03, glowMat(0xffffff))); crack.visible = false;
            const portal = add(createPortal(3.4, [0x4fc3ff, 0xb05cff, 0xffd166, 0x3a6bff])); portal.position.set(-4, 3.6, 0); portal.rotation.y = Math.PI / 2; portal.setPower(0);
            const sign = add(createSign('YUSUF CLOCKS 1899', 3, 0.8, { w: 512, h: 128, bg: '#3a2414', fg: '#e8b54a', border: '#e8b54a', font: '900 52px Georgia' })); sign.position.set(-4.2, 3.6, 0); sign.rotation.y = Math.PI / 2; sign.visible = false;
            return {
                update: t => {
                    const wp = new THREE.Vector3(); kid.watch.getWorldPosition(wp); crack.position.set(wp.x, wp.y, wp.z + 0.06); crack.rotation.z = 0.6; crack.visible = t > 3;
                    if (t > 3) { kid.watch.setPower(-6 - t); kid.watch.pulse(); pose(kid, { la: -1.1, laz: 0.4, nod: 0.3 }); } else idle(kid, t);
                    bub.material.opacity = t > 5 && Math.sin(t * 20) > 0.3 ? 0.03 : 0.15;
                    portal.setPower(ease(t, 6, 9)); sign.visible = t > 8 && t < 11.5;
                    if (t > 9) shock(kid);
                    if (t > 10.5) { kid.position.x -= 0.05; kid.rotation.z += 0.08; kid.scale.setScalar(Math.max(0.01, 1 - (t - 10.5) * 0.8)); bub.visible = false; }
                }
            };
        }
    }
];

window.TRAILER = {
    open: "No air. No sound. No way home...",
    shots: [
        [1, 6, 3.6, "A place no child has ever stood."],
        [3, 5, 3.4, "So far from home."],
        [4, 5, 3.4, "The twentieth of July, 1969."],
        [5, 6, 3.2, "History is being made."],
        [7, 3, 3.8, "And someone wants to break it."]
    ]
};
