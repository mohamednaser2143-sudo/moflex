// TITLE: The Watch
// Episode 1 — Grandfather's attic, a strange pocket watch, and a pirate ship heading for a reef.

// ---------- Episode 1 props ----------
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
function createShip() {
    const s = group();
    const hullM = mat(0x6b4423), darkM = mat(0x462c17), deckM = mat(0xa57c4f), sailM = mat(0xf1e6c8, { side: THREE.DoubleSide, roughness: 1 });
    s.add(box(34, 5, 10, hullM, 0, -2.5, 0));
    const bow = box(7.07, 5, 7.07, hullM, 17, -2.5, 0); bow.rotation.y = Math.PI / 4; s.add(bow);
    s.add(box(34.2, 0.5, 10.2, 0xc9a240, 0, -1.6, 0));                                    // gold stripe
    s.add(box(34, 0.2, 9.4, deckM, 0, 0.05, 0));
    s.add(box(28, 0.9, 0.3, darkM, 3, 0.6, 4.85), box(28, 0.9, 0.3, darkM, 3, 0.6, -4.85));
    // quarterdeck at the back
    s.add(box(9, 2.6, 10, hullM, -12.5, 1.3, 0), box(9, 0.2, 9.4, deckM, -12.5, 2.65, 0));
    s.add(box(9, 0.8, 0.3, darkM, -12.5, 3.1, 4.85), box(9, 0.8, 0.3, darkM, -12.5, 3.1, -4.85), box(0.3, 0.8, 10, darkM, -16.9, 3.1, 0));
    s.add(box(0.1, 2.0, 1.6, darkM, -7.95, 1.0, 0), box(0.1, 0.6, 0.6, glowMat(0xffd27a), -7.94, 1.7, -2.2), box(0.1, 0.6, 0.6, glowMat(0xffd27a), -7.94, 1.7, 2.2));
    for (let i = 0; i < 4; i++) s.add(box(0.6, 0.3, 1.6, darkM, -7.6 + i * 0.6, 0.3 + i * 0.6, 3.6));
    for (let i = 0; i < 3; i++) s.add(box(0.1, 0.8, 1, glowMat(0xffd27a), -17.05, 0.6, -3 + i * 3));
    const sprit = cyl(0.25, 0.35, 12, darkM, 23, 1.6, 0, 8); sprit.rotation.z = Math.PI / 2 - 0.25; s.add(sprit);
    // masts, yards, sails
    const sails = [];
    [[8, 0, 20], [-2, 0, 23], [-13, 2.6, 14]].forEach(([x, base, h], mi) => {
        s.add(cyl(0.32, 0.45, h, darkM, x, base + h / 2, 0, 8));
        const lv = mi === 2 ? [[base + 7, 5, 7.5]] : [[base + 7.5, 6.5, 9.5], [base + 14.2, 5, 7.6]];
        lv.forEach(([y, hh, ww]) => {
            s.add(box(0.3, 0.3, ww + 1.4, darkM, x + 0.2, y + hh / 2 + 0.2, 0));
            const sail = box(0.12, hh, ww, sailM, x + 0.45, y, 0); sail.scale.x = 1; s.add(sail); sails.push(sail);
        });
        s.add(createRope([x, base + h - 0.5, 0], [x + 6, 0.8, 4.7]), createRope([x, base + h - 0.5, 0], [x + 6, 0.8, -4.7]), createRope([x, base + h - 0.5, 0], [x - 5, 0.8, 4.7]), createRope([x, base + h - 0.5, 0], [x - 5, 0.8, -4.7]));
    });
    s.add(createRope([-2, 22.5, 0], [8, 19.5, 0]), createRope([8, 19.5, 0], [26, 3.0, 0]));
    const flag = box(0.05, 1.6, 2.6, mat(0x111111, { side: THREE.DoubleSide }), -2, 23.6, 1.3); s.add(flag);
    s.add(box(0.06, 0.5, 0.5, glowMat(0xf2f2f2), -2.05, 23.7, 1.4));
    // wheel and binnacle on the quarterdeck
    const wheel = group(new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.1, 6, 18), darkM));
    for (let i = 0; i < 4; i++) { const sp = box(0.1, 2.8, 0.1, darkM, 0, 0, 0); sp.rotation.z = i * Math.PI / 4; wheel.add(sp); }
    wheel.position.set(-11.5, 4.4, 0); wheel.rotation.y = Math.PI / 2; s.add(wheel, box(0.4, 1.6, 0.4, darkM, -11.8, 3.4, 0));
    const bin = group(box(0.9, 1.3, 0.9, darkM, 0, 0.65, 0), cyl(0.55, 0.55, 0.35, mat(0xc9a240, { metalness: 0.8, roughness: 0.3 }), 0, 1.45, 0, 16), cyl(0.45, 0.45, 0.37, glowMat(0xdff2ff, 0.7), 0, 1.47, 0, 16));
    bin.position.set(-9.4, 2.75, 0); s.add(bin);
    // cannon ports, barrels, crates
    for (let i = 0; i < 5; i++) [-1, 1].forEach(sd => s.add(box(1.0, 0.8, 0.1, 0x1a120a, -4 + i * 4.5, -1.0, sd * 5.02)));
    [[12, 3], [13.2, 3.2], [12.6, 1.9]].forEach(([x, z]) => s.add(createBarrel(x, z, 0.8, 0x8a5a32, 0.15)));
    [[4, -3.4], [5.6, -3.4]].forEach(([x, z]) => s.add(createCrate(x, z, 0.8, 0x9a6a3a, 0.15)));
    s.sails = sails; s.wheel = wheel; s.binnacle = bin; s.flag = flag;
    return s;
}
// Ship gently rocking on the waves.
function rockShip(ship, t, strength = 1, baseY = 0) {
    ship.rotation.x = Math.sin(t * 0.9) * 0.025 * strength;
    ship.rotation.z = Math.sin(t * 0.6) * 0.012 * strength;
    ship.position.y = baseY + Math.sin(t * 1.1) * 0.18 * strength;
    ship.sails.forEach((sl, i) => { sl.scale.x = 2.5 + Math.sin(t * 1.4 + i) * 0.6; });
}
// Deck scenes: the ship at the origin, the sea a little below, no grass ground.
function deckSet(opts = {}) {
    const ship = add(createShip());
    const sea = add(createSea(opts.sea || 0x1f6a9a, 500, -2.3, opts.amp || 0.35));
    if (opts.stars) add(createStars());
    if (opts.clouds !== false) add(createClouds(7, 40, 260, 5, opts.cloud || 0xffffff));
    return { ship, sea };
}
function createCompassFace(r = 2) {
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
    g.fillStyle = '#f4ead2'; g.beginPath(); g.arc(128, 128, 126, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#5a4020'; g.lineWidth = 4; g.beginPath(); g.arc(128, 128, 118, 0, Math.PI * 2); g.stroke();
    for (let i = 0; i < 32; i++) { const a = i * Math.PI / 16; const l = i % 4 ? 8 : 18; g.beginPath(); g.moveTo(128 + Math.sin(a) * 116, 128 - Math.cos(a) * 116); g.lineTo(128 + Math.sin(a) * (116 - l), 128 - Math.cos(a) * (116 - l)); g.stroke(); }
    g.fillStyle = '#3a2a14'; g.font = 'bold 34px Georgia'; g.textAlign = 'center'; g.textBaseline = 'middle';
    [['N', 0], ['E', 1], ['S', 2], ['W', 3]].forEach(([l, i]) => { const a = i * Math.PI / 2; g.fillText(l, 128 + Math.sin(a) * 82, 128 - Math.cos(a) * 82); });
    const face = new THREE.Mesh(new THREE.CircleGeometry(r, 40), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) }));
    const g2 = group(face);
    const needle = group(cone(0.22 * r, r * 0.8, glowMat(0xc8102e), 0, r * 0.4, 0.05, 4), cone(0.22 * r, r * 0.8, glowMat(0xf2f2f2), 0, -r * 0.4, 0.05, 4));
    needle.children[1].rotation.z = Math.PI; g2.add(needle);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(r, r * 0.08, 8, 40), mat(0xc9a240, { metalness: 0.8, roughness: 0.3 })); g2.add(rim);
    g2.needle = needle; return g2;
}
function createLodestone() {
    const g = group(new THREE.Mesh(new THREE.DodecahedronGeometry(0.7, 0), mat(0x2a2a30, { flatShading: true, metalness: 0.5, roughness: 0.5 })));
    const gl = createGlow(0xa04cff, 1.4, 0.35); g.add(gl); return g;
}
function createReef(x, z, s = 1) {
    const g = group(); const r = makeRand(x + z);
    for (let i = 0; i < 16; i++) { const k = createRock((r() - 0.5) * 22 * s, 0.6, (r() - 0.5) * 8 * s, (1.2 + r() * 1.8) * s, 0x2e2a28); k.scale.y = 1.6 + r(); g.add(k); }
    for (let i = 0; i < 10; i++) { const f = new THREE.Mesh(new THREE.TorusGeometry((1.4 + r()) * s, 0.18, 4, 16), glowMat(0xffffff, 0.7)); f.rotation.x = Math.PI / 2; f.position.set((r() - 0.5) * 22 * s, 0.1, (r() - 0.5) * 8 * s); g.add(f); }
    g.position.set(x, 0, z); return g;
}
function createSailor(i, o = {}) {
    return createPerson(Object.assign({ shirt: [0xf2efe6, 0xb33a3a, 0x3a5a8a, 0xd9c9a3, 0x5a7a4a][i % 5], legs: [0x4a3a2a, 0x2b2d42, 0x6a5a4a][i % 3], skin: SKINS[i % 7], hair: 0x2a1a10, hat: ['bandana', null, 'cap', 'bandana'][i % 4], hatColor: [0xb33a3a, 0x2b4a7a, 0x333333][i % 3], beard: i % 4 === 1 ? 0x3a2a1a : null, belt: 0x3a2414 }, o));
}
const captain = () => createPerson({ shirt: 0xf2efe6, coat: 0x7a1f2b, legs: 0x2b2d42, hat: 'tricorn', hatColor: 0x1a1a1a, skin: 0xc68642, hair: 0x2a1a10, hairStyle: 'long', belt: 0xd4af37 });
const tomas = () => createPerson({ child: true, shirt: 0xe8dcc0, legs: 0x6a4a2a, skin: 0xe0ac69, hair: 0x3a2414, hat: 'bandana', hatColor: 0x2b6aa8, shoes: 0x3a2a1a });
const gristle = () => createPerson({ shirt: 0x7a7a70, legs: 0x3a3a34, skin: 0xd8b48a, hair: 0x555555, hat: 'cap', hatColor: 0x2a2a2a, beard: 0x555555, belt: 0x2a1a10 });

// ---------- Story ----------
const storyData = [
    {
        title: "1. A Rainy Saturday",
        desc: "Rain taps on the windows of Grandpa's old house. Mohamed, twelve years old, in his favourite red hoodie, is bored of waiting for the sun. Grandpa smiles over his newspaper and says the attic is full of treasures, if Mohamed is brave enough to climb up.",
        camPos: [2, 8, 22], camLookAt: [0, 4, -2], skyColor: 0x2a2a35, mood: 'indoor', ground: false,
        setup: () => {
            add(createLivingRoom());
            const kid = add(at(createKid(), -6, 2.5, -6.6)); kid.inner.position.y = -1.0;
            pose(kid, { ll: -1.4, rl: -1.4 });
            const gp = add(at(createGrandpa(), 8, 1.1, -5.3)); pose(gp, { ll: -1.4, rl: -1.4, la: -1.2, ra: -1.2 });
            const paper = add(box(2.6, 1.8, 0.05, 0xf2efe6, 8, 4.6, -3.6));
            const rain = add(createRain(200, 8, 6)); rain.position.set(0, 4, -11);
            return { update: t => { kid.rotation.y = Math.sin(t * 0.5) * 0.3; kid.rig.head.rotation.y = Math.sin(t * 0.8) * 0.4; if (t > 6) { paper.position.y = 4.6 - ease(t, 6, 7) * 1.2; gp.rig.head.rotation.y = -0.6 * ease(t, 6, 7); pose(gp, { ll: -1.4, rl: -1.4, la: -0.4, ra: -0.6, head: -0.6 * ease(t, 6, 7) }); } } };
        }
    },
    {
        title: "2. Up to the Attic",
        desc: "Mohamed climbs the creaky ladder and pushes open the hatch. The attic smells of dust and old wood. Boxes are stacked to the roof beams, a round window glows grey with rain, and every corner seems to hide a story.",
        camPos: [0, 7, 20], camLookAt: [-2, 4, 0], skyColor: 0x2a1f16, mood: 'attic', ground: false,
        setup: () => {
            add(createAttic()); add(createDust(200, 30, 14, 20));
            const kid = add(at(createKid(), -4, -3.5, 8));
            const beam = add(createGlow(0x9fb6d0, 14, 0.18)); beam.position.set(0, 7, -9);
            add(createLantern(4, 6, -6, 0xffc87a, 0.8));
            return { update: t => { kid.position.y = Math.min(0.1, -3.5 + t * 1.2); if (kid.position.y < 0.1) { const s = Math.sin(t * 6) * 0.6; pose(kid, { la: -2 + s, ra: -2 - s, ll: s * 0.5, rl: -s * 0.5 }); } else if (!walkTo(kid, -1, 2, 0.04)) { kid.rig.head.rotation.y = Math.sin(t) * 0.6; } } };
        }
    },
    {
        title: "3. The Old Trunk",
        desc: "Behind a pile of boxes, Mohamed finds a heavy wooden trunk with brass corners. The lock is old but not locked. When he lifts the lid, a soft blue light spills out across his face.",
        camPos: [5, 6, 12], camLookAt: [0, 2.5, -2], skyColor: 0x2a1f16, mood: 'attic', ground: false,
        setup: () => {
            add(createAttic()); add(createDust(120, 20, 10, 14));
            const trunk = add(at(createTrunk(), 0, 0, -3));
            const kid = add(at(createKid(), 3.2, 0, -1.6, -Math.PI / 2 - 0.25));
            return { update: t => { pose(kid, { la: -1.2, ra: -1.2 }); const k = ease(t, 3, 6); trunk.lid.rotation.x = -k * 1.6; trunk.glow.scale.setScalar(0.1 + k * 7); if (k > 0.9) shock(kid); } };
        }
    },
    {
        title: "4. The Pocket Watch",
        desc: "Inside, on a cushion of faded velvet, lies a brass pocket watch. Its face glows a gentle blue, and around the rim are seven empty little holes, like places waiting for jewels. Words are carved on the back: When time breaks, mend it.",
        camPos: [0, 4.6, 7], camLookAt: [0, 3.4, 0], skyColor: 0x2a1f16, mood: 'attic', ground: false,
        setup: () => {
            add(createAttic());
            const kid = add(at(createKid(), 0, 0, -1));
            kid.watch.visible = false;
            const w = add(createWatch()); w.scale.setScalar(1.6);
            const sp = add(createGlow(0x6fd3ff, 6, 0.25)); sp.position.set(0, 3.6, 1);
            return { update: t => { pose(kid, { ra: -1.45, la: -1.3, laz: 0.35 }); w.position.set(0.25, 3.6 + Math.sin(t * 2) * 0.05, 1.3); w.rotation.y = Math.sin(t * 0.7) * 0.4; kid.rig.head.rotation.x = 0.25; } };
        }
    },
    {
        title: "5. Tick... Tock...",
        desc: "Mohamed hangs the chain around his neck. The watch begins to tick, faster and faster. The hands spin, boxes rattle, and in the round window he sees a tall shadow in a long coat, watching him. Then the floor seems to melt into light.",
        camPos: [0, 6, 15], camLookAt: [0, 5, -4], skyColor: 0x2a1f16, mood: 'attic', ground: false,
        setup: () => {
            add(createAttic()); add(createDust(200, 30, 14, 20));
            const kid = add(at(createKid(), 0, 0, 0));
            const shadow = add(at(createCollector(), 0, 6.2, -12.2)); shadow.scale.setScalar(0.5); shadow.visible = false;
            const portal = add(createPortal(4)); portal.position.set(0, 3, 0.5); portal.setPower(0);
            const crates = [add(createCrate(-6, -2, 1, 0xa98a62)), add(createCrate(6, -1, 0.8, 0xa98a62))];
            return {
                update: t => {
                    const k = ease(t, 2, 12);
                    kid.watch.setPower(1 + k * 12); kid.watch.pulse();
                    crates.forEach((c, i) => { c.position.y = Math.max(0, Math.sin(t * 20 + i) * 0.15 * k + k * 3 * ease(t, 8, 12)); c.rotation.z = Math.sin(t * 13 + i) * 0.1 * k; });
                    shadow.visible = t > 5 && t < 9.5;
                    portal.setPower(ease(t, 9, 13));
                    if (t > 9) shock(kid); else pose(kid, { la: -0.3, ra: -0.3, head: Math.sin(t * 3) * 0.3 });
                    if (t > 12.5) { kid.scale.setScalar(Math.max(0.01, 1 - (t - 12.5))); kid.rotation.y += 0.2; }
                }
            };
        }
    },
    {
        title: "6. Through Time",
        desc: "Mohamed tumbles through a tunnel of light. Rings of blue and gold rush past him, and old clocks drift by, ticking backwards. His stomach flips. Somewhere far ahead, he hears the cry of seagulls and the crash of waves.",
        camPos: [0, 5, 12], camLookAt: [0, 4, -20], skyColor: 0x050a1e, mood: 'vortex', ground: false,
        setup: () => {
            const tunnel = add(createTimeTunnel()); tunnel.position.y = 4;
            add(createStars(500, 200));
            const kid = add(at(createKid(), 0, 2, 0));
            return { update: t => { kid.rotation.z = Math.sin(t * 0.8) * 0.6; kid.rotation.y = t * 0.6; kid.position.y = 2 + Math.sin(t * 1.3) * 0.6; pose(kid, { la: -2.4 + Math.sin(t * 3) * 0.3, ra: -2.4 - Math.sin(t * 3) * 0.3, ll: Math.sin(t * 2) * 0.4, rl: -Math.sin(t * 2) * 0.4 }); kid.watch.setPower(3); } };
        }
    },
    {
        title: "7. Splash Landing",
        desc: "With a flash, Mohamed lands on a pile of rope on the deck of a tall wooden ship. Sails snap in the wind, and the sea stretches in every direction. Sailors in striped shirts and bandanas stare at the strange boy in the red hoodie who fell out of the sky.",
        camPos: [10, 9, 20], camLookAt: [2, 3, 0], skyColor: 0x8ecae6, mood: 'bright', ground: false,
        setup: () => {
            const { ship } = deckSet();
            const kid = add(at(createKid(), 3, 6, 1));
            const flashP = add(createPortal(2.5)); flashP.position.set(3, 5, 1);
            const ropes = add(cyl(1.4, 1.6, 0.6, 0xb8955a, 3, 0.45, 1, 14));
            const sailors = [[-2, -2], [8, -2], [10, 2.5], [-3, 3]].map(([x, z], i) => add(at(createSailor(i), x, 0.15, z)));
            add(createBirds(4, 22, 30));
            return {
                update: t => {
                    rockShip(ship, t); ropes.position.y = ship.position.y + 0.45;
                    flashP.setPower(Math.max(0, 1 - t * 0.6));
                    kid.position.y = Math.max(ship.position.y + 0.75, 6 - t * t * 4);
                    if (t < 2) pose(kid, { la: -2.5, ra: -2.5 }); else idle(kid, t);
                    if (t > 4) kid.rig.head.rotation.y = Math.sin(t * 0.9) * 0.7;
                    sailors.forEach((s, i) => { s.position.y = ship.position.y + 0.15; face(s, kid.position.x, kid.position.z); if (t > 1.5) shock(s); if (t > 6) point(s, t); });
                }
            };
        }
    },
    {
        title: "8. Captain Hollis",
        desc: "The crowd of sailors parts as Captain Hollis strides down from the wheel, in a red coat and a three-cornered hat. A stowaway? she growls. But a cabin boy named Tomas steps forward and offers his hand. Mohamed shakes it, and the captain decides he may stay, if he works.",
        camPos: [2, 7, 15], camLookAt: [-2, 3, 0], skyColor: 0x8ecae6, mood: 'bright', ground: false,
        setup: () => {
            const { ship } = deckSet();
            const kid = add(at(createKid(), 0, 0.15, 2, -Math.PI / 2));
            const cap = add(at(captain(), -9, 2.75, 0, Math.PI / 2));
            const tom = add(at(tomas(), 2.4, 0.15, -0.5, -Math.PI / 2));
            const crew = [[4, 3], [5, -2.5], [-3, -3.2]].map(([x, z], i) => add(at(createSailor(i + 1), x, 0.15, z, -Math.PI / 2)));
            return {
                update: t => {
                    rockShip(ship, t);
                    const by = ship.position.y;
                    // the captain comes down the steps
                    if (t < 3) { cap.position.x = -9 + t * 0.5; cap.position.y = by + 2.75; walkTo(cap, -6, 0, 0.0); }
                    else if (cap.position.x < -3) { cap.position.y = by + Math.max(0.15, 2.75 - (t - 3) * 1.4); walkTo(cap, -3, 1, 0.06); }
                    else { cap.position.y = by + 0.15; face(cap, kid.position.x, kid.position.z); pose(cap, { la: -0.5, ra: -0.5, laz: -0.4, raz: 0.4 }); }
                    kid.position.y = by + 0.15; tom.position.y = by + 0.15; crew.forEach(c => { c.position.y = by + 0.15; face(c, kid.position.x, kid.position.z); idle(c, t, c.position.x); });
                    face(kid, t > 8 ? tom.position.x : cap.position.x, t > 8 ? tom.position.z : cap.position.z);
                    if (t > 8) { face(tom, kid.position.x, kid.position.z); walkTo(tom, 1.2, 0.6, 0.03) || (shake(tom, t), shake(kid, t)); } else { idle(kid, t); idle(tom, t, 1); }
                }
            };
        }
    },
    {
        title: "9. Life at Sea",
        desc: "Tomas shows Mohamed how to coil ropes, scrub the deck and keep out of the way of busy sailors. The ship is heading for a safe harbour on the far side of the islands. Mohamed laughs for the first time since he left the attic. Maybe time travel is not so bad.",
        camPos: [14, 8, 16], camLookAt: [4, 2, 0], skyColor: 0x9ad1e8, mood: 'bright', ground: false,
        setup: () => {
            const { ship } = deckSet();
            const kid = add(at(createKid(), 6, 0.15, 1.5));
            const tom = add(at(tomas(), 8.5, 0.15, 1));
            const bucket = add(cyl(0.45, 0.35, 0.7, 0x7a5a3a, 7.2, 0.5, 2.6, 10));
            const crew = [[0, -3], [-4, 2], [12, -2]].map(([x, z], i) => add(at(createSailor(i + 2), x, 0.15, z)));
            add(createBirds(5, 25, 35));
            return {
                update: t => {
                    rockShip(ship, t); const by = ship.position.y;
                    [kid, tom, ...crew].forEach(a => a.position.y = by + 0.15); bucket.position.y = by + 0.5;
                    kid.rotation.y = -0.4 + Math.sin(t * 0.3) * 0.2; tom.rotation.y = -0.8;
                    work(kid, t); work(tom, t, 1.3);
                    crew[0].rotation.y = Math.PI / 2; carry(crew[0]); crew[0].position.x = Math.sin(t * 0.4) * 4;
                    work(crew[1], t, 2); idle(crew[2], t);
                    if (t > 10) { kid.rig.head.rotation.y = 0.6; cheer(kid, t); }
                }
            };
        }
    },
    {
        title: "10. The Ship's Compass",
        desc: "At sunset, the navigator lets Mohamed look into the brass binnacle beside the wheel. Inside, a compass needle points north, and the ship follows it. Keep that needle steady, says the captain, and we will sail around the Jagged Teeth, the most dangerous reef in these waters.",
        camPos: [0.5, 6.2, 9], camLookAt: [0, 3, 0], skyColor: 0xf4a261, mood: 'golden', ground: false, sunPos: [-40, 20, 30],
        setup: () => {
            const { ship } = deckSet({ cloud: 0xffd2a6 }); ship.position.set(9.4, -2.6, 0); ship.rotation.y = 0;
            const comp = add(createCompassFace(1.1)); comp.position.set(0, 2.85, 0.2); comp.rotation.x = -Math.PI / 2 + 0.5;
            const kid = add(at(createKid(), -1.8, 0, 0.6, Math.PI / 2 + 0.4));
            const nav = add(at(createSailor(3, { hat: 'tricorn', hatColor: 0x2a2a2a }), 2, 0, -0.6, -Math.PI / 2 - 0.4));
            add(createSkyDisk(0xffc27a, 12, -80, 18, -160));
            return { update: t => { comp.needle.rotation.z = Math.sin(t * 0.8) * 0.06; ship.position.y = -2.6 + Math.sin(t * 1.1) * 0.05; point(nav, t); pose(kid, { la: -0.8, ra: -0.8, nod: 0.25 }); } };
        }
    },
    {
        title: "11. A Shadow in the Night",
        desc: "That night, Mohamed cannot sleep. He climbs on deck to look at the stars and freezes. A tall man in a long grey coat stands by the binnacle, his own watch glowing purple. He hands something dark to a sailor called Gristle, whispers, and steps into a swirl of purple light. Then he is gone.",
        camPos: [6, 7, 15], camLookAt: [-6, 3, 0], skyColor: 0x0b1330, mood: 'night', ground: false, sunPos: [20, 60, -40],
        setup: () => {
            const { ship } = deckSet({ stars: true, sea: 0x14305a, clouds: false });
            add(createSkyDisk(0xe8f0ff, 5, 40, 60, -150));
            const col = add(at(createCollector(), -10.5, 2.75, 1.4, Math.PI / 2));
            const gr = add(at(gristle(), -8.6, 2.75, 1.4, -Math.PI / 2));
            const kid = add(at(createKid(), 4, 0.15, 3.5, -Math.PI / 2 - 0.3));
            const stone = add(createLodestone()); stone.scale.setScalar(0.5);
            const portal = add(createPortal(2.6, [0x7a2bd6, 0xb05cff, 0x3a0a6a, 0xe0b0ff])); portal.position.set(-12, 5.6, 1.4); portal.rotation.y = Math.PI / 2; portal.setPower(0);
            add(createLantern(-8, 4.8, -4.6, 0xffc36b, 0.8));
            return {
                update: t => {
                    rockShip(ship, t, 0.7); const by = ship.position.y;
                    kid.position.y = by + 0.15; gr.position.y = col.position.y = by + 2.75;
                    stone.visible = t > 3 && t < 9;
                    stone.position.set(lerp(-9.9, -9.0, ease(t, 4, 6)), by + 5.4, 1.4);
                    if (t < 6) pose(col, { ra: -1.3 }); else idle(col, t);
                    if (t > 4 && t < 9) pose(gr, { la: -1.3 }); else idle(gr, t);
                    portal.setPower(ease(t, 9, 10) * (1 - ease(t, 13, 14)));
                    if (t > 10.5) { col.position.x -= 0.05; col.visible = t < 12.4; }
                    if (t > 2) shock(kid); else idle(kid, t);
                    kid.inner.position.y = t > 2 ? -0.6 * ease(t, 2, 3) : 0; // crouches behind the barrels
                }
            };
        }
    },
    {
        title: "12. The Sun Is in the Wrong Place",
        desc: "In the morning, the sun rises over the sea, but on the wrong side of the ship. Mohamed remembers his teacher's words: the sun rises in the east. If we are sailing south, it should be on our left, he thinks. But it is on our right. The ship is going the wrong way.",
        camPos: [-24, 10, 24], camLookAt: [0, 4, 0], skyColor: 0xf6c28b, mood: 'golden', ground: false, sunPos: [60, 15, -20],
        setup: () => {
            const { ship } = deckSet({ cloud: 0xffd9b0 });
            add(createSkyDisk(0xffd27a, 9, 120, 12, -40));
            const kid = add(at(createKid(), 8, 0.15, -3, Math.PI));
            return { update: t => { rockShip(ship, t); kid.position.y = ship.position.y + 0.15; if (t < 6) point(kid, t); else think(kid, t); kid.rotation.y = t < 6 ? Math.PI * 0.75 : Math.PI / 2; } };
        }
    },
    {
        title: "13. Nobody Believes Him",
        desc: "Mohamed runs to Captain Hollis. We are going the wrong way, he says, and I saw a man in a grey coat give Gristle something last night. The sailors laugh. The compass never lies, boy, says the captain. Only Tomas looks worried, and Gristle quietly slips away.",
        camPos: [-2, 9, 21], camLookAt: [-7, 3, 0], skyColor: 0xc9d6df, mood: 'day', ground: false,
        setup: () => {
            const { ship } = deckSet({ cloud: 0xd6dde2 });
            const cap = add(at(captain(), -11, 2.75, 0, Math.PI / 2));
            const kid = add(at(createKid(), -6.5, 0.15, 1.5, -Math.PI / 2));
            const tom = add(at(tomas(), -5, 0.15, 3.2, -Math.PI / 2));
            const gr = add(at(gristle(), -9, 2.75, -2.8, Math.PI / 2));
            const crew = [[-4, -2], [-2.5, 0.5]].map(([x, z], i) => add(at(createSailor(i), x, 0.15, z, -Math.PI / 2)));
            return {
                update: t => {
                    rockShip(ship, t); const by = ship.position.y;
                    [kid, tom, ...crew].forEach(a => a.position.y = by + 0.15); cap.position.y = by + 2.75; gr.position.y = by + 2.75;
                    if (t < 7) { pose(kid, { ra: -1.6 + Math.sin(t * 6) * 0.3, la: -1 }); } else { pose(kid, { la: -0.2, ra: -0.2, nod: 0.3 }); }
                    if (t > 6) { pose(cap, { la: -0.3, ra: -2.4, raz: Math.sin(t * 5) * 0.2 }); } else idle(cap, t);
                    crew.forEach((c, i) => { const s = Math.sin(t * 9 + i) * 0.1; if (t > 7) pose(c, { la: -0.6 + s, ra: -0.6 - s, laz: 0.3, raz: -0.3 }); else idle(c, t, i); });
                    face(tom, kid.position.x, kid.position.z); pose(tom, { la: -0.3, ra: -0.3 });
                    if (t > 9) { walkTo(gr, -15, -3, 0.035); } else idle(gr, t);
                }
            };
        }
    },
    {
        title: "14. White Water Ahead",
        desc: "By afternoon the wind grows strong and the waves turn grey. From high in the crow's nest the lookout shouts: White water ahead! Far in front of the ship, waves are crashing over sharp black rocks. The Jagged Teeth are right where the ship is heading.",
        camPos: [40, 14, 34], camLookAt: [0, 3, -10], skyColor: 0x5d6d7e, mood: 'storm', ground: false, fog: 0.007,
        setup: () => {
            const ship = add(createShip()); const sea = add(createSea(0x2c4a5e, 500, 0, 0.8));
            ship.rotation.y = Math.PI * 0.85; ship.position.set(10, 2, 8);
            add(createReef(-30, -14, 1.8)); add(createReef(-4, 8, 2.0)); add(createClouds(9, 30, 260, 8, 0x8a96a3)); add(createRain(700, 120, 40));
            return { update: t => { rockShip(ship, t, 2.5, 2); ship.position.x = 10 - t * 0.6; ship.position.z = 8 - t * 0.9; } };
        }
    },
    {
        title: "15. The Hidden Stone",
        desc: "While everyone stares at the rocks, Mohamed and Tomas creep to the binnacle. Mohamed's watch flickers as he kneels to look underneath. There, tucked into a gap in the wood, is a dark, heavy stone that tingles with a faint purple glow.",
        camPos: [7, 5.5, 9], camLookAt: [-0.8, 1.3, 0.6], skyColor: 0x5d6d7e, mood: 'storm', ground: false,
        setup: () => {
            add(box(14, 0.2, 10, 0xa57c4f, 0, 0.05, 0)); add(createSea(0x2c4a5e, 400, -3, 0.8));
            add(box(14, 0.9, 0.3, 0x462c17, 0, 0.6, -4.8));
            const bin = add(group(box(1.4, 2.2, 1.4, 0x46302a, 0, 1.1, 0), cyl(0.9, 0.9, 0.5, mat(0xc9a240, { metalness: 0.8, roughness: 0.3 }), 0, 2.45, 0, 16)));
            const stone = add(createLodestone()); stone.scale.setScalar(0.35); stone.position.set(0, 0.35, 0.72);
            const kid = add(at(createKid(), -0.9, 0, 2.2, Math.PI * 0.9));
            const tom = add(at(tomas(), -3.2, 0, 1.0, Math.PI * 0.6));
            add(createRain(400, 30, 20));
            return {
                update: t => {
                    const k = ease(t, 2, 4);
                    kid.inner.position.y = -0.9 * k; pose(kid, { ll: -1.2 * k, rl: -0.4 * k, ra: -1.2 * k, la: -0.3 });
                    kid.watch.setPower(1 + Math.abs(Math.sin(t * 9)) * 3 * k);
                    if (t > 6) { stone.position.z = 0.72 + ease(t, 6, 8) * 1; stone.position.y = 0.35 + ease(t, 6, 8) * 1.2; holdUp(kid); }
                    face(tom, kid.position.x, kid.position.z); if (t > 7) shock(tom); else idle(tom, t);
                }
            };
        }
    },
    {
        title: "16. The Proof",
        desc: "Mohamed calls the captain over. Watch the needle, he says, and moves the stone slowly around the compass. The needle swings after the stone like a puppy following a treat. This is a lodestone, a magnet. Someone hid it here to trick the compass.",
        camPos: [0, 7.5, 5], camLookAt: [0, 2.3, 0], skyColor: 0x5d6d7e, mood: 'storm', ground: false,
        setup: () => {
            add(box(14, 0.2, 10, 0xa57c4f, 0, 0.05, 0)); add(createSea(0x2c4a5e, 400, -3, 0.8));
            add(group(box(1.4, 2.2, 1.4, 0x46302a, 0, 1.1, 0)));
            const comp = add(createCompassFace(0.9)); comp.position.set(0, 2.3, 0); comp.rotation.x = -Math.PI / 2;
            const stone = add(createLodestone()); stone.scale.setScalar(0.35);
            const kid = add(at(createKid(), 2.0, 0, 1.0, -Math.PI / 2 - 0.5));
            const cap = add(at(captain(), -2.3, 0, 0.6, Math.PI / 2 + 0.3));
            return {
                update: t => {
                    const a = t * 0.9; stone.position.set(Math.sin(a) * 1.5, 2.6, Math.cos(a) * 1.5);
                    comp.needle.rotation.z = lerpAngle(comp.needle.rotation.z, Math.atan2(-stone.position.x, -stone.position.z) + Math.PI, 0.2);
                    pose(kid, { ra: -1.3 + Math.cos(a) * 0.2, raz: -0.3 - Math.sin(a) * 0.3 });
                    if (t > 6) shock(cap); else idle(cap, t);
                }
            };
        }
    },
    {
        title: "17. The Saboteur",
        desc: "Gristle tries to sneak to the side of the ship, but the crew stops him. With everyone watching, he admits the truth: a man in a grey coat paid him a strange silver coin to hide the stone. The captain shakes her head and sends him below deck. And now, she says, let us save this ship.",
        camPos: [6, 8, 16], camLookAt: [0, 3, 0], skyColor: 0x5d6d7e, mood: 'storm', ground: false,
        setup: () => {
            const { ship } = deckSet({ sea: 0x2c4a5e, amp: 0.8, cloud: 0x8a96a3 }); add(createRain(600, 80, 40));
            const gr = add(at(gristle(), 3, 0.15, 3.6, Math.PI / 2));
            const crew = [[6, 2.8], [6, -1], [1, 0]].map(([x, z], i) => add(at(createSailor(i + 1), x, 0.15, z, -Math.PI / 2)));
            const cap = add(at(captain(), -3, 0.15, 1.5, Math.PI / 2));
            const kid = add(at(createKid(), -2, 0.15, -1.5, Math.PI / 3));
            const coin = add(cyl(0.25, 0.25, 0.06, mat(0xd8d8e0, { metalness: 0.9, roughness: 0.2 }), 0, 0, 0, 16)); coin.rotation.x = Math.PI / 2;
            return {
                update: t => {
                    rockShip(ship, t, 2); const by = ship.position.y;
                    [gr, cap, kid, ...crew].forEach(a => a.position.y = by + 0.15);
                    if (t < 3) walkTo(gr, 8, 4, 0.06);
                    else { crew[0].position.x = lerp(6, 7.6, ease(t, 3, 4)); face(gr, cap.position.x, cap.position.z); pose(gr, { la: -0.3, ra: t > 6 ? -1.4 : -0.2, nod: 0.3 }); }
                    crew.forEach((c, i) => { face(c, gr.position.x, gr.position.z); if (t > 3) point(c, t + i); });
                    coin.visible = t > 6; const hp = new THREE.Vector3(); gr.rig.rightArmGroup.children[1].getWorldPosition(hp); coin.position.copy(hp); coin.rotation.y = t * 3;
                    face(cap, gr.position.x, gr.position.z); if (t > 11) point(cap, t); else idle(cap, t);
                    if (t > 13) { walkTo(gr, -6, 0.3, 0.04); } face(kid, gr.position.x, gr.position.z);
                }
            };
        }
    },
    {
        title: "18. Hard to Port!",
        desc: "With the stone thrown into the sea, the compass swings back to true north. Hard to port, cries Captain Hollis, and spins the great wheel. The ship groans and turns. Black rocks slide past so close that spray soaks the deck, but not a single plank touches them.",
        camPos: [36, 12, 26], camLookAt: [0, 2, -6], skyColor: 0x6b7a88, mood: 'storm', ground: false, fog: 0.007,
        setup: () => {
            const ship = add(createShip()); add(createSea(0x2c4a5e, 500, 0, 0.9));
            add(createReef(-14, 4, 1.3)); add(createReef(-30, -20, 1.2)); add(createClouds(9, 30, 260, 8, 0x8a96a3)); add(createRain(700, 120, 40));
            const splash = add(createBurst(0xffffff, 200, 0.3)); splash.position.set(-6, 1, -16);
            let fired = 0;
            return {
                update: t => {
                    const turn = ease(t, 1, 14);
                    ship.rotation.y = Math.PI * 0.85 - turn * 1.3;
                    ship.position.x = 14 - t * 1.1; ship.position.z = -4 - Math.sin(turn * 1.5) * 8;
                    rockShip(ship, t, 2.6, 2); ship.rotation.y = Math.PI * 0.85 - turn * 1.3;
                    ship.wheel.rotation.x = turn * 6;
                    if (t > 7 && fired < 1) { splash.fire(); fired++; }
                }
            };
        }
    },
    {
        title: "19. Safe Waters",
        desc: "The storm blows itself out, and golden evening light spills across calm water. The crew raise their hands and cheer. Captain Hollis takes off her hat and shakes Mohamed's hand. You saved my ship, she says. Tomas cannot stop grinning.",
        camPos: [3, 8, 18], camLookAt: [0, 3.5, 0], skyColor: 0xf7b267, mood: 'golden', ground: false, sunPos: [-50, 25, 30],
        setup: () => {
            const { ship } = deckSet({ cloud: 0xffd2a6 });
            add(createSkyDisk(0xffc27a, 12, -110, 22, -120));
            const kid = add(at(createKid(), 1.2, 0.15, 1, -Math.PI / 2));
            const cap = add(at(captain(), -1.2, 0.15, 1, Math.PI / 2));
            const tom = add(at(tomas(), 2.6, 0.15, 2.6, -Math.PI / 2 - 0.4));
            const crew = [[4, -1.5], [6, 1.5], [-4, -2], [-3.5, 3]].map(([x, z], i) => add(at(createSailor(i), x, 0.15, z, x > 0 ? -Math.PI / 2 - 0.3 : Math.PI / 2 + 0.3)));
            return {
                update: t => {
                    rockShip(ship, t, 0.5); const by = ship.position.y;
                    [kid, cap, tom, ...crew].forEach(a => a.position.y = by + 0.15);
                    crew.forEach((c, i) => cheer(c, t, i));
                    if (t > 4) { shake(cap, t); shake(kid, t); } else { idle(kid, t); pose(cap, { la: -2.6 }); }
                    clap(tom, t);
                }
            };
        }
    },
    {
        title: "20. The First Gem",
        desc: "Suddenly the pocket watch grows warm against Mohamed's chest. With a ring like a tiny bell, a bright red gem appears in the first empty slot. One gem, he whispers. One fix. The watch is counting. Six empty slots still wait around the rim.",
        camPos: [0, 4.4, 7], camLookAt: [0, 3.2, 0], skyColor: 0xf7b267, mood: 'golden', ground: false, sunPos: [-50, 25, 30], gems: 1, gemMoment: true,
        setup: () => {
            const { ship } = deckSet({ cloud: 0xffd2a6 }); ship.position.x = 4;
            const kid = add(at(createKid(), 0, 0.15, 0));
            let lit = false;
            return { update: t => { rockShip(ship, t, 0.3); kid.position.y = ship.position.y + 0.15; ship.position.x = 4; if (t > 3 && !lit) { lit = true; lightGem(kid, 1); } if (t > 3) pose(kid, { la: -1.1, laz: 0.4, ra: -0.1, nod: 0.3 }); else idle(kid, t); } };
        }
    },
    {
        title: "21. Watching From the Cliffs",
        desc: "On a rocky island far behind the ship, the man in the grey coat lowers his spyglass. His own watch glows a cold purple. So, the boy has found the watch, he mutters. One gem. Six to go. He will need all seven, and so will I. He turns and vanishes into the dark.",
        camPos: [8, 9, 16], camLookAt: [0, 6, -4], skyColor: 0x6d4c6f, mood: 'dusk', sunPos: [-40, 15, -30], ground: 0x4a4540,
        setup: () => {
            add(createSea(0x3a3f6a, 500, 0.4, 0.4));
            const cliff = add(group(cyl(9, 12, 6, mat(0x55504a, { flatShading: true }), 0, 3, -2, 7)));
            for (let i = 0; i < 6; i++) add(createRock(-8 + i * 3, 6, -6 + (i % 2) * 3, 1.5, 0x5f5a54));
            const col = add(at(createCollector(), 0, 6, 0, Math.PI));
            const tiny = add(createShip()); tiny.scale.setScalar(0.2); tiny.position.set(-30, 0.8, -90);
            const portal = add(createPortal(3, [0x7a2bd6, 0xb05cff, 0x3a0a6a, 0xe0b0ff])); portal.position.set(0, 9.5, -4); portal.setPower(0);
            const scope = add(cyl(0.12, 0.18, 1.6, mat(0xc9a240, { metalness: 0.8 }), 0, 0, 0, 8));
            return {
                update: t => {
                    const hp = new THREE.Vector3(); col.rig.rightArmGroup.children[1].getWorldPosition(hp);
                    if (t < 5) { pose(col, { ra: -2.4, raz: -0.4 }); scope.visible = true; scope.position.copy(hp); scope.rotation.x = Math.PI / 2; }
                    else { scope.visible = false; pose(col, {}); col.rotation.y = lerpAngle(col.rotation.y, 0, 0.05); }
                    col.watch.pulse(); portal.setPower(ease(t, 9, 10.5));
                    if (t > 11) { col.position.z -= 0.04; col.visible = t < 13.5; }
                }
            };
        }
    },
    {
        title: "22. Where To Next?",
        desc: "The watch begins to tick faster again. Mohamed hugs Tomas goodbye and waves to the crew. A ring of blue light opens on the deck. Through it he glimpses mountains, and a long stone wall snaking over them like a dragon. Then the light swallows him whole.",
        camPos: [2, 6, 14], camLookAt: [0, 4, 0], skyColor: 0x3d3560, mood: 'dusk', ground: false, sunPos: [-50, 15, 30],
        setup: () => {
            const { ship } = deckSet({ cloud: 0xc9a0dc, sea: 0x2a4a7a });
            const kid = add(at(createKid(), 0, 0.15, 1, Math.PI / 2));
            const tom = add(at(tomas(), 2.2, 0.15, 1, -Math.PI / 2));
            const crew = [[5, -2], [6.5, 1.5]].map(([x, z], i) => add(at(createSailor(i), x, 0.15, z, -Math.PI / 2)));
            const portal = add(createPortal(3.2)); portal.position.set(-4, 3.6, 1); portal.rotation.y = Math.PI / 2; portal.setPower(0);
            const wall = add(group()); wall.position.set(-4.2, 3, 1); wall.rotation.y = Math.PI / 2;
            for (let i = 0; i < 6; i++) wall.add(box(0.6, 0.4, 0.1, glowMat(0x8b7a5a), -1.5 + i * 0.6, Math.sin(i) * 0.4, 0));
            wall.visible = false;
            return {
                update: t => {
                    rockShip(ship, t, 0.6); const by = ship.position.y;
                    [kid, tom, ...crew].forEach(a => a.position.y = by + 0.15);
                    kid.watch.setPower(1 + ease(t, 2, 8) * 10); kid.watch.pulse();
                    if (t < 5) { pose(kid, { la: -1.2, ra: -1.2, laz: 0.5, raz: -0.5 }); pose(tom, { la: -1.2, ra: -1.2, laz: 0.5, raz: -0.5 }); }
                    else { idle(tom, t); wave(tom, t); if (t < 9) { face(kid, crew[0].position.x, crew[0].position.z); wave(kid, t); } }
                    crew.forEach((c, i) => wave(c, t + i));
                    portal.setPower(ease(t, 6, 9)); wall.visible = t > 8 && t < 11;
                    if (t > 9) { face(kid, -4, 1); walkTo(kid, -3.6, 1, 0.05); }
                    if (t > 10.5) { kid.scale.setScalar(Math.max(0.01, 1 - (t - 10.5) * 0.8)); }
                }
            };
        }
    }
];

window.TRAILER = {
    open: "Some clocks tell the time...",
    shots: [
        [2, 4, 3.4, "An old attic."],
        [3, 5, 3.4, "A forgotten trunk."],
        [5, 7, 3.6, "Someone is watching."],
        [6, 3, 3.2, "Time is breaking."],
        [7, 3, 3.6, "And only one boy can mend it."]
    ]
};
