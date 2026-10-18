// TITLE: The Castle Siege
// Episode 3 — A medieval castle under siege. The enemy is digging a secret tunnel under the walls.

// ---------- Episode 3 props ----------
const STONE3 = 0x8d8a82, STONE3D = 0x6a675f;
function createCastleWall(len = 30, h = 10, t = 3) {
    const g = group(box(len, h, t, STONE3, 0, h / 2, 0), box(len + 0.1, 0.3, t + 0.2, STONE3D, 0, h, 0));
    for (let i = 0; i < len / 2; i++) g.add(box(1.1, 1.2, 0.6, STONE3, -len / 2 + 1 + i * 2, h + 0.75, t / 2 - 0.3));
    for (let row = 1.5; row < h; row += 1.5) g.add(box(len + 0.02, 0.06, 0.02, STONE3D, 0, row, t / 2 + 0.01));
    return g;
}
function createRoundTower(h = 15, r = 3.6, roof = 0x3a4f7a) {
    const g = group(cyl(r, r + 0.3, h, STONE3, 0, h / 2, 0, 14), cyl(r + 0.4, r + 0.4, 0.5, STONE3D, 0, h, 0, 14), cone(r + 0.8, 5, mat(roof, { flatShading: true }), 0, h + 2.7, 0, 14));
    g.add(cyl(0.06, 0.06, 3, 0x4a3020, 0, h + 6, 0, 5), box(0.05, 1, 1.6, mat(0xd4af37, { side: THREE.DoubleSide }), 0, h + 7, 0.8));
    for (let i = 0; i < 3; i++) g.add(box(0.5, 1.2, 0.3, 0x1a1410, Math.sin(i * 2.1) * (r + 0.05), h * 0.4 + i * 3, Math.cos(i * 2.1) * (r + 0.05)));
    return g;
}
// Full castle, centred on the origin, 44 wide. Gate faces +z.
function createCastle({ moat = true } = {}) {
    const g = group(); const S = 22;
    const front = createCastleWall(2 * S, 10, 3); front.position.set(0, 0, S); g.add(front);
    const back = createCastleWall(2 * S, 10, 3); back.position.set(0, 0, -S); g.add(back);
    const l = createCastleWall(2 * S, 10, 3); l.position.set(-S, 0, 0); l.rotation.y = Math.PI / 2; g.add(l);
    const r = createCastleWall(2 * S, 10, 3); r.position.set(S, 0, 0); r.rotation.y = -Math.PI / 2; g.add(r);
    [[-S, -S], [S, -S], [-S, S], [S, S]].forEach(([x, z]) => g.add(at(createRoundTower(15), x, 0, z)));
    // gatehouse
    g.add(box(10, 13, 6, STONE3, 0, 6.5, S), box(5, 7, 0.4, 0x1a1410, 0, 3.5, S + 3.05));
    const port = group(); for (let i = 0; i < 5; i++) port.add(box(0.25, 7, 0.25, 0x333333, -2 + i, 3.5, 0)); for (let i = 0; i < 4; i++) port.add(box(5, 0.25, 0.25, 0x333333, 0, 1 + i * 1.7, 0)); port.position.z = S + 3.2; g.add(port);
    for (let i = 0; i < 5; i++) g.add(box(1.1, 1.2, 0.6, STONE3, -4 + i * 2, 13.7, S + 2.7));
    [-3, 3].forEach(x => g.add(box(1.6, 3.4, 0.1, mat(0x2f6b3a, { side: THREE.DoubleSide }), x, 9, S + 3.06), box(0.6, 0.6, 0.12, glowMat(0xd4af37), x, 9.6, S + 3.08)));
    // keep in the middle
    g.add(box(14, 18, 12, STONE3, 0, 9, -6));
    for (let i = 0; i < 7; i++) g.add(box(1.1, 1.2, 0.6, STONE3, -6 + i * 2, 18.7, 0));
    g.add(at(createRoundTower(24, 2.6, 0x7a1f2b), 6, 0, -11));
    if (moat) {
        const m = new THREE.Mesh(new THREE.RingGeometry(34, 40, 4, 1), mat(0x2f5f7a, { roughness: 0.3 })); m.rotation.x = -Math.PI / 2; m.rotation.z = Math.PI / 4; m.position.y = 0.06; m.scale.set(1, 1, 1); g.add(m);
        const bridge = box(5, 0.4, 9, 0x6a4a2a, 0, 0.3, S + 8); g.add(bridge);
    }
    return g;
}
function createTent(x, z, s = 1, color = 0x8b1e2b, stripe = 0xe8dcc0) {
    const g = group(cone(2.8 * s, 4.5 * s, mat(color, { flatShading: true }), 0, 2.25 * s, 0, 10));
    g.add(cyl(0.06, 0.06, 2, 0x4a3020, 0, 5.3 * s, 0, 5), box(0.05, 0.7, 1.2, mat(stripe, { side: THREE.DoubleSide }), 0, 5.9 * s, 0.6));
    g.add(box(1.2 * s, 2 * s, 0.1, 0x2a1410, 0, 1 * s, 2.25 * s));
    g.position.set(x, 0, z); return g;
}
function createTrebuchet(x, z) {
    const g = group(box(6, 0.6, 4, 0x5a3a22, 0, 0.6, 0));
    [-1.6, 1.6].forEach(zz => { const a = box(0.5, 7, 0.5, 0x6a4a2a, -1.2, 3.5, zz); a.rotation.z = -0.3; const b = box(0.5, 7, 0.5, 0x6a4a2a, 1.2, 3.5, zz); b.rotation.z = 0.3; g.add(a, b); });
    const arm = group(box(11, 0.4, 0.4, 0x7a5a3a, 2, 0, 0), box(1.6, 1.6, 1.6, 0x4a4a4a, -3.2, -0.8, 0)); arm.position.set(0, 6.6, 0); arm.rotation.z = -0.5; g.add(arm);
    g.position.set(x, 0, z); return g;
}
// Underground view: earth around a tunnel, open towards the camera.
function createTunnelCutaway(len = 30) {
    const g = group();
    const earth = mat(0x8a6a4a, { roughness: 1 });
    g.add(box(len, 3.5, 2, earth, 0, 8.25, 0), box(len, 3, 2, earth, 0, -1.5, 0), box(len, 10, 1, mat(0x5a4330), 0, 4, -6));
    g.add(box(len, 6.5, 0.3, mat(0x3a2a1e), 0, 3.25, -5.5));
    const warm = new THREE.PointLight(0xffb060, 1.4, 40, 1.5); warm.position.set(0, 4, -3); g.add(warm);
    for (let i = 0; i < len / 4; i++) { const x = -len / 2 + 2 + i * 4; g.add(box(0.35, 6.5, 0.35, 0x8a6a42, x, 3.25, -1.2), box(0.35, 6.5, 0.35, 0x8a6a42, x, 3.25, -4.8), box(0.4, 0.4, 4, 0x8a6a42, x, 6.4, -3)); }
    g.add(box(len + 2, 0.4, 8, 0x4f7a3a, 0, 10.1, -3)); // grass on top
    return g;
}
const soldier = (i, o = {}) => createPerson(Object.assign({ shirt: [0x2f6b3a, 0x2f6b3a, 0x3a5a8a][i % 3], vest: 0x9a9a9a, legs: 0x3a3a3a, skin: SKINS[i % 7], hat: i % 2 ? 'coif' : 'helmet', hatColor: 0x9a9a9a, belt: 0x3a2414 }, o));
const enemy = (i, o = {}) => createPerson(Object.assign({ shirt: 0x5a1a1a, vest: 0x777777, legs: 0x2a2a2a, skin: SKINS[(i + 3) % 7], hat: 'helmet', hatColor: 0x666666, belt: 0x2a1410 }, o));
const digger = (i) => createPerson({ shirt: [0x7a6a52, 0x6a5a4a][i % 2], legs: 0x3a3028, skin: SKINS[(i + 2) % 7], hat: 'cap', hatColor: 0x3a3028, belt: 0x2a1410 });
const alfie = () => createPerson({ child: true, shirt: 0x2b4a9a, legs: 0x5a4a3a, skin: 0xffdbac, hair: 0xc9862f, hairStyle: 'short', belt: 0xd4af37, sash: 0xf2c14e, shoes: 0x3a2a1a });
const ladyEleanor = () => createPerson({ shirt: 0x2f6b3a, coat: 0x2f6b3a, legs: 0x2f6b3a, skin: 0xf1c27d, hair: 0x5a3a22, hairStyle: 'long', belt: 0xd4af37, shoes: 0x2a1a10 });
const sirRoland = () => createPerson({ shirt: 0x2f6b3a, vest: 0xb0b0b0, legs: 0x3a3a3a, skin: 0xc68642, hair: 0x222222, beard: 0x222222, belt: 0x3a2414 });
const baron = () => createPerson({ shirt: 0x5a1a1a, coat: 0x2a1010, legs: 0x1a1a1a, skin: 0xe0ac69, hair: 0x3a2a1a, beard: 0x3a2a1a, hat: 'helmet', hatColor: 0x444444, belt: 0xc9a240 });
const cookMaud = () => createPerson({ shirt: 0x9a6a4a, legs: 0x5a4a3a, skin: 0xffdbac, hair: 0x9a3a1a, hairStyle: 'bun', apron: 0xf2efe6 });
function bowl(x, y, z) {
    const g = group(cyl(0.6, 0.45, 0.35, 0x7a5a3a, 0, 0.17, 0, 14));
    const w = cyl(0.52, 0.52, 0.04, new THREE.MeshStandardMaterial({ color: 0x6fa8c8, roughness: 0.1, metalness: 0.2 }), 0, 0.3, 0, 14); g.add(w);
    g.water = w; g.position.set(x, y, z); return g;
}

// ---------- Story ----------
const storyData = [
    {
        title: "1. On the Battlements",
        desc: "Mohamed lands with a bump on top of a high stone wall. Cold wind whips his hoodie. A guard in a metal helmet nearly drops his spear in surprise. Below, torches flicker in a valley full of tents. He has landed in the middle of a siege.",
        camPos: [8, 15, 14], camLookAt: [0, 11, 0], skyColor: 0x3a4466, mood: 'dusk', ground: 0x4f6a3a, sunPos: [-30, 15, -40],
        setup: () => {
            const w = add(createCastleWall(40, 10, 3));
            add(at(createRoundTower(15), 20, 0, 0));
            const kid = add(at(createKid(), 0, 12, 0.2, 0.3));
            const g = add(at(soldier(0), 4, 10.15, 0, -Math.PI / 2));
            const spear = add(group(cyl(0.06, 0.06, 5, 0x5c3d1e, 0, 0, 0, 5), cone(0.2, 0.7, 0xb0b0b0, 0, 2.8, 0, 4)));
            const portal = add(createPortal(2.5)); portal.position.set(0, 13, 0.2); portal.setPower(1);
            for (let i = 0; i < 8; i++) add(createTent(-24 + i * 7, 26 + (i % 2) * 6, 0.9, i % 2 ? 0x5a1a1a : 0x8b1e2b));
            for (let i = 0; i < 4; i++) add(createFire(-18 + i * 12, 22, 1.2));
            return { update: t => { portal.setPower(1 - ease(t, 0.3, 2)); kid.position.y = Math.max(10.15, 12 - t * t * 3); if (t > 2) { if (t < 5) shock(kid); else idle(kid, t); } const hp = new THREE.Vector3(); g.rig.rightArmGroup.children[1].getWorldPosition(hp); spear.position.copy(hp); spear.position.y += 1.5; if (t > 1.5) { shock(g); spear.rotation.z = ease(t, 1.5, 2.5) * 0.8; } else pose(g, { ra: -0.3 }); } };
        }
    },
    {
        title: "2. Castle Stonemere",
        desc: "From the tower he sees it all. Castle Stonemere stands on a green hill, surrounded by a moat. Its gate is shut tight. Outside, an army in dark red has camped for weeks, waiting. Nobody can get in, and nobody can get out.",
        camPos: [60, 40, 75], camLookAt: [0, 6, 0], skyColor: 0xa8b8c8, mood: 'day', ground: 0x5f7f45, fog: 0.004,
        setup: () => {
            add(createCastle());
            const r = makeRand(5); for (let i = 0; i < 14; i++) add(createTent(-40 + i * 6, 54 + r() * 10, 1, [0x5a1a1a, 0x8b1e2b, 0x6a2a2a][i % 3]));
            add(createTrebuchet(20, 48)); add(createTrebuchet(-22, 50));
            for (let i = 0; i < 16; i++) add(createTree(-80 + r() * 160, -60 - r() * 40, 1.3 + r()));
            add(createClouds(8, 45, 260, 2));
            return {};
        }
    },
    {
        title: "3. The Red Army",
        desc: "The enemy is led by Baron Grimwald, who wants the castle and its rich farmland for himself. His soldiers have tried ladders and battering rams, but the walls are too strong. Now they just wait and watch, and that worries everyone inside.",
        camPos: [10, 9, 22], camLookAt: [0, 4, 0], skyColor: 0xa8b8c8, mood: 'day', ground: 0x5f7f45,
        setup: () => {
            [[-12, -4], [0, -8], [12, -5], [-6, -16], [8, -18]].forEach(([x, z], i) => add(createTent(x, z, 1.3, i % 2 ? 0x5a1a1a : 0x8b1e2b)));
            add(createTrebuchet(-14, 6)); add(createFire(2, 2, 1.2));
            const b = add(at(baron(), 4, 0, 6, Math.PI * 0.85));
            const es = [[-4, 4], [-1, 6], [8, 3], [10, 8]].map(([x, z], i) => add(at(enemy(i), x, 0, z, Math.PI)));
            const castle = add(createCastle({ moat: false })); castle.scale.setScalar(0.5); castle.position.set(0, 0, -70);
            return { update: t => { pose(b, { la: -0.4, laz: 0.4, ra: -0.4, raz: -0.4 }); b.rig.head.rotation.y = Math.sin(t * 0.4) * 0.5; es.forEach((e, i) => idle(e, t, i)); } };
        }
    },
    {
        title: "4. Alfie the Squire",
        desc: "A boy with copper hair and a blue tunic runs up the steps. I am Alfie, squire to Sir Roland, he says proudly. You must be a messenger from far away. He shakes Mohamed's hand and leads him down into the busy castle courtyard.",
        camPos: [0, 7, 18], camLookAt: [0, 3, 0], skyColor: 0xa8b8c8, mood: 'day', ground: 0x7a6a4a,
        setup: () => {
            const w = add(createCastleWall(40, 10, 3)); w.position.z = -10;
            add(createHut(-12, -4, 6, 5, 4, 0xc9b48a, 0x5a3a22)); add(box(2.2, 1.6, 2.2, STONE3, 8, 0.8, -3));
            for (let i = 0; i < 6; i++) add(box(6, 0.5 + i * 1, 1.6, STONE3D, 14, 0.25 + i * 0.5, -2 - i * 1.6));
            const kid = add(at(createKid(), 2, 0, 3, -Math.PI / 2));
            const al = add(at(alfie(), 9, 0, 2, -Math.PI / 2));
            const chick = []; for (let i = 0; i < 4; i++) chick.push(add(group(box(0.5, 0.5, 0.7, 0xf2efe6, 0, 0.4, 0), box(0.3, 0.3, 0.3, 0xf2efe6, 0, 0.8, 0.35), box(0.12, 0.12, 0.2, glowMat(0xf2a541), 0, 0.75, 0.55))));
            return { update: t => { if (!walkTo(al, 3.8, 3, 0.07)) { face(al, kid.position.x, kid.position.z); if (t > 5) { shake(al, t); shake(kid, t); } else idle(al, t); } face(kid, al.position.x, al.position.z); if (t < 5) idle(kid, t); chick.forEach((c, i) => { c.position.set(-6 + i * 2 + Math.sin(t + i) * 1.5, 0, 6 + Math.cos(t * 0.7 + i) * 1.5); c.rotation.y = t + i; c.children[1].position.y = 0.8 + Math.abs(Math.sin(t * 6 + i)) * -0.15; }); } };
        }
    },
    {
        title: "5. Lady Eleanor",
        desc: "In the great hall, Lady Eleanor, who rules Stonemere, studies a map by candlelight. We have food for one more month, she says. These walls have never been broken. Mohamed puts his hand on his heart in greeting, and she smiles kindly. Any friend of Alfie's is welcome here.",
        camPos: [0, 8, 16], camLookAt: [0, 3.5, -2], skyColor: 0x2a2018, mood: 'indoor', ground: false,
        setup: () => {
            add(createRoom({ w: 30, d: 20, h: 14, wall: 0x7a7a72, floor: 0x5a4a3a, trim: 0x4a4a42 }));
            add(createTable(0, -3, 10, 4, 2.2, 0x6a4a2a)); add(box(6, 0.05, 3, 0xe8dcc0, 0, 2.33, -3));
            [-8, 8].forEach(x => add(box(3, 7, 0.2, mat(0x2f6b3a), x, 8, -9.6), box(1.2, 1.2, 0.25, glowMat(0xd4af37), x, 9, -9.5)));
            [-12, 12].forEach(x => add(createTorch(x, 6, -9.3)));
            for (let i = 0; i < 3; i++) add(createLantern(-3 + i * 3, 2.9, -3.8, 0xffd27a, 0.4));
            const lady = add(at(ladyEleanor(), 0, 0, -6.5, 0));
            const rol = add(at(sirRoland(), -6, 0, -4, 0.6));
            const kid = add(at(createKid(), 2.5, 0, 2, Math.PI)); const al = add(at(alfie(), -2.5, 0, 2.2, Math.PI));
            return { update: t => { if (t < 6) pose(lady, { la: -1.2, ra: -1.2, nod: 0.3 }); else { pose(lady, { nod: 0 }); if (t > 9) heart(lady); } if (t > 7) heart(kid); else idle(kid, t); idle(al, t, 2); idle(rol, t, 1); } };
        }
    },
    {
        title: "6. A Visitor in the Enemy Camp",
        desc: "Far across the field, inside Baron Grimwald's tent, a tall man in a long grey coat unrolls a map of the castle. Your ladders failed, he says softly. So go under the walls instead. Dig a tunnel, and Stonemere will fall. The baron's eyes light up.",
        camPos: [0, 6.5, 13], camLookAt: [0, 3, 0], skyColor: 0x2a1410, mood: 'indoor', ground: false,
        setup: () => {
            const tent = add(cone(14, 14, mat(0x6a1a1a, { side: THREE.BackSide, flatShading: true }), 0, 7, 0, 12));
            add(box(30, 0.2, 30, 0x5a4a32, 0, 0, 0));
            add(createTable(0, -1, 6, 3.4, 2.2, 0x5a3a22)); const map = add(box(4, 0.05, 2.6, 0xe8dcc0, 0, 2.33, -1));
            add(createLantern(0, 6, -1, 0xffb84a, 1));
            const col = add(at(createCollector(), 2.6, 0, -2.4, -0.9));
            const b = add(at(baron(), -2.6, 0, -2.0, 0.9));
            return { update: t => { if (t < 9) point(col, t); else pose(col, { la: -0.3, ra: -0.3, raz: -0.2, laz: 0.2 }); col.watch.pulse(); if (t > 8) cheer(b, t); else pose(b, { la: -1.1, ra: -1.1, nod: 0.4 }); } };
        }
    },
    {
        title: "7. Too Quiet",
        desc: "Days pass. The enemy stops shouting and stops attacking. Some soldiers in the castle start to relax. But from the top of the north tower, Mohamed spots something odd: carts of fresh brown earth being wheeled out from behind the baron's tents, and dumped in the woods.",
        camPos: [0, 18, 8], camLookAt: [0, 2, 40], skyColor: 0xa8b8c8, mood: 'day', ground: 0x5f7f45,
        setup: () => {
            add(createCastleWall(40, 10, 3)); add(at(createRoundTower(15), 6, 0, 2));
            const kid = add(at(createKid(), 6, 15.25, 3.5, 0)); kid.position.y = 15.25;
            const r = makeRand(9);
            [[-10, 40], [0, 44], [10, 40], [-4, 52]].forEach(([x, z], i) => add(createTent(x, z, 1.3, i % 2 ? 0x5a1a1a : 0x8b1e2b)));
            for (let i = 0; i < 10; i++) add(createTree(18 + r() * 20, 50 + r() * 30, 1.4));
            add(cone(5, 3, mat(0x6a4a2a, { flatShading: true }), 22, 1.5, 54, 8));
            const carts = [0, 1].map(i => add(createCart(0, 0, false)));
            const dirt = carts.map(c => { const d = cone(1.4, 1.2, 0x6a4a2a, 0, 2.3, 0, 7); c.add(d); return d; });
            const ws = carts.map((c, i) => add(digger(i)));
            return { update: t => { carts.forEach((c, i) => { const k = ((t * 0.06 + i * 0.5) % 1); c.position.set(4 + k * 16, 0, 48 + k * 4); c.rotation.y = -0.2; ws[i].position.set(c.position.x - 4, 0, c.position.z - 0.5); ws[i].rotation.y = Math.PI / 2; walkTo(ws[i], ws[i].position.x + 1, ws[i].position.z, 0.0001); ws[i].walkCycleTime += 0.15; const s = Math.sin(ws[i].walkCycleTime) * 0.6; pose(ws[i], { la: -1.2, ra: -1.2, ll: -s, rl: s }); }); if (t > 6) point(kid, t); else idle(kid, t); } };
        }
    },
    {
        title: "8. Ripples in the Cellar",
        desc: "That evening Mohamed helps Maud the cook fetch flour from the cellar, deep beneath the north wall. A bowl of water sits on the stone floor. As he walks past, he notices tiny ripples on its surface. Tap. Tap. Tap. Nobody is touching it.",
        camPos: [0, 3.4, 6.5], camLookAt: [0, 1, 0], skyColor: 0x14100c, mood: 'cellar', ground: false,
        setup: () => {
            add(createRoom({ w: 20, d: 14, h: 8, wall: 0x5a5650, floor: 0x4a4640, trim: 0x3a3630 }));
            for (let i = 0; i < 4; i++) add(createBarrel(-7 + i * 2, -5));
            for (let i = 0; i < 3; i++) add(createSack(5 + i * 1.6, -5.2, 0.9));
            add(createTorch(-6, 4, -6.4)); add(createTorch(6, 4, -6.4));
            const b = add(bowl(0, 0, 0));
            const ring = add(new THREE.Mesh(new THREE.RingGeometry(0.1, 0.16, 20), glowMat(0xffffff, 0.6))); ring.rotation.x = -Math.PI / 2;
            const kid = add(at(createKid(), 2.2, 0, 0.6, -Math.PI / 2 - 0.2));
            const maud = add(at(cookMaud(), -4, 0, -2, 0.6));
            const sack = add(createSack(0, 0, 0.6));
            return {
                update: t => {
                    const tap = (t * 1.6) % 1; ring.position.set(0, 0.33, 0); ring.scale.setScalar(1 + tap * 2.8); ring.material.opacity = 0.7 * (1 - tap);
                    b.water.position.y = 0.3 + Math.sin(t * 10) * 0.01;
                    if (t > 4) { kid.inner.position.y = -1.0 * ease(t, 4, 5.5); pose(kid, { ll: -1.4 * ease(t, 4, 5.5), rl: -0.3, la: -0.4, ra: -0.4, nod: 0.5 }); } else { carry(kid); }
                    const hp = new THREE.Vector3(); kid.rig.rightArmGroup.children[1].getWorldPosition(hp); sack.position.set(hp.x - 0.5, t > 4 ? 0 : hp.y - 0.6, hp.z); idle(maud, t);
                }
            };
        }
    },
    {
        title: "9. Listening to the Ground",
        desc: "Mohamed remembers a story from his history book: castle defenders used bowls of water to hear enemies digging below. He and Alfie set bowls all along the cellar walls. Then they wait, and watch, and hardly breathe.",
        camPos: [0, 7, 11], camLookAt: [0, 0.5, -2], skyColor: 0x14100c, mood: 'cellar', ground: false,
        setup: () => {
            add(createRoom({ w: 24, d: 14, h: 8, wall: 0x5a5650, floor: 0x4a4640, trim: 0x3a3630 }));
            add(createTorch(-8, 4, -6.4)); add(createTorch(0, 4, -6.4)); add(createTorch(8, 4, -6.4));
            const bowls = []; for (let i = 0; i < 6; i++) bowls.push(add(bowl(-8.5 + i * 3.4, 0, -4.5)));
            const kid = add(at(createKid(), -3, 0, 1, Math.PI)); const al = add(at(alfie(), 3, 0, 1.2, Math.PI));
            const lamp = add(createLantern(0, 0, 0, 0xffc36b, 0.5));
            return {
                update: t => {
                    bowls.forEach((b, i) => { const s = i === 4 ? 1 : (i === 3 || i === 5 ? 0.35 : 0.05); b.water.position.y = 0.3 + Math.sin(t * 12 + i) * 0.015 * s; b.water.rotation.z = Math.sin(t * 9 + i) * 0.03 * s; });
                    walkTo(kid, -3 + Math.sin(t * 0.3) * 5, 0, 0.04) || idle(kid, t); kid.inner.position.y = -0.5; pose(kid, { ll: -0.8, rl: -0.8, ra: -1, la: -0.4 });
                    al.inner.position.y = -0.5; pose(al, { ll: -0.8, rl: -0.8, la: -0.5, ra: -0.5 });
                    const hp = new THREE.Vector3(); kid.rig.rightArmGroup.children[1].getWorldPosition(hp); lamp.position.copy(hp);
                }
            };
        }
    },
    {
        title: "10. Right Here",
        desc: "One bowl shivers more than all the others, the one beside the north tower. Mohamed presses his ear to the cold stone floor. Scrape. Thud. Scrape. Somewhere beneath their feet, men are digging, and they are getting closer every hour.",
        camPos: [10, 3.6, 22], camLookAt: [0, 4.6, -2], skyColor: 0x0a0806, mood: 'cellar', ground: false,
        setup: () => {
            add(createTunnelCutaway(36));
            add(box(36, 0.3, 4, 0x4a4640, 0, 10.4, 0));
            const kid = add(at(createKid(), -4, 10.55, 0.5, Math.PI)); kid.rotation.z = 0;
            const b = add(bowl(-2.6, 10.55, 0.5));
            const ds = [0, 1, 2].map(i => add(at(digger(i), 2 + i * 4, 0.15, -3, -Math.PI / 2)));
            const lamps = [add(createLantern(6, 3.2, -3.5, 0xffb84a, 0.6)), add(createLantern(-6, 3.2, -3.5, 0xffb84a, 0.6))];
            const picks = ds.map(() => add(group(box(0.12, 2.2, 0.12, 0x6a4a2a, 0, 0, 0), box(1.4, 0.2, 0.2, 0x777777, 0, 1.1, 0))));
            return {
                update: t => {
                    kid.inner.position.y = -1; pose(kid, { ll: -1.5, rl: -1.5, la: -1.2, ra: -0.6, nod: 0.6 });
                    b.water.position.y = 0.3 + Math.sin(t * 14) * 0.02;
                    ds.forEach((d, i) => { const s = Math.sin(t * 4 + i * 2); pose(d, { la: -2.2 + s * 0.9, ra: -2.2 + s * 0.9 }); const hp = new THREE.Vector3(); d.rig.rightArmGroup.children[1].getWorldPosition(hp); picks[i].position.copy(hp); picks[i].rotation.z = -1.2 + s * 0.9; picks[i].rotation.y = Math.PI / 2; });
                }
            };
        }
    },
    {
        title: "11. A Plan Without Harm",
        desc: "Mohamed and Alfie race to Lady Eleanor. This time someone listens. We could flood their tunnel, says Sir Roland. Mohamed raises his hand. But warn them first, he says. Nobody needs to get hurt. Lady Eleanor nods slowly. A wise plan. We will do it your way.",
        camPos: [0, 8, 16], camLookAt: [0, 3.5, -2], skyColor: 0x2a2018, mood: 'indoor', ground: false,
        setup: () => {
            add(createRoom({ w: 30, d: 20, h: 14, wall: 0x7a7a72, floor: 0x5a4a3a, trim: 0x4a4a42 }));
            add(createTable(0, -3, 10, 4, 2.2, 0x6a4a2a)); add(box(6, 0.05, 3, 0xe8dcc0, 0, 2.33, -3));
            [-12, 12].forEach(x => add(createTorch(x, 6, -9.3)));
            const lady = add(at(ladyEleanor(), 0, 0, -6.5, 0)); const rol = add(at(sirRoland(), -5, 0, -5, 0.5));
            const kid = add(at(createKid(), 1.5, 0, 1, Math.PI)); const al = add(at(alfie(), -1.5, 0, 1.4, Math.PI));
            return { update: t => { if (t < 6) point(rol, t); else idle(rol, t); if (t > 6 && t < 10) pose(kid, { ra: -2.8, raz: 0.1 }); else idle(kid, t); if (t > 11) { pose(lady, { nod: 0.15 + Math.sin(t * 3) * 0.1 }); heart(lady); } else idle(lady, t); idle(al, t, 1); } };
        }
    },
    {
        title: "12. The Shadow Below",
        desc: "That night Mohamed creeps down with a lantern to check on the digging. Through a crack in the cellar floor he sees a purple glow deep in the enemy tunnel. The man in the grey coat is down there, guiding the diggers with his glowing watch. For a moment, his eyes meet Mohamed's.",
        camPos: [9, 3.6, 21], camLookAt: [0, 4.6, -2], skyColor: 0x050403, mood: 'cellar', ground: false,
        setup: () => {
            add(createTunnelCutaway(36)); add(box(36, 0.3, 4, 0x4a4640, 0, 10.4, 0));
            const col = add(at(createCollector(), 2, 0.15, -3, -0.2));
            const kid = add(at(createKid(), -1, 10.55, 0.5, 0)); kid.inner.position.y = -1;
            const purple = add(createGlow(0xa04cff, 9, 0.5)); purple.position.set(2, 3, -3);
            const ds = [0, 1].map(i => add(at(digger(i), 8 + i * 4, 0.15, -3, -Math.PI / 2)));
            const lamp = add(createLantern(-0.4, 11.2, 1.4, 0xffc36b, 0.5));
            return { update: t => { pose(kid, { ll: -1.5, rl: -1.5, la: -0.6, ra: -0.6, nod: 0.7 }); col.watch.pulse(); purple.material.opacity = 0.35 + Math.sin(t * 2) * 0.15; if (t > 7) { col.rotation.y = lerpAngle(col.rotation.y, Math.PI * 0.85, 0.05); col.rig.head.rotation.x = -0.5 * ease(t, 7, 8); } else point(col, t); ds.forEach((d, i) => work(d, t, i)); } };
        }
    },
    {
        title: "13. A Fair Warning",
        desc: "At dawn the defenders bang drums against the cellar floor and shout down through the stones: Leave the tunnel! The water is coming! Below, the startled diggers drop their tools and scramble back towards their camp as fast as they can run.",
        camPos: [10, 3.6, 22], camLookAt: [0, 4.6, -2], skyColor: 0x0a0806, mood: 'cellar', ground: false,
        setup: () => {
            add(createTunnelCutaway(36)); add(box(36, 0.3, 4, 0x4a4640, 0, 10.4, 0));
            const drums = [-6, -2, 2].map(x => add(cyl(1, 1, 1.4, 0x9a3a2a, x, 11.25, 0.5, 14)));
            const ss = [-6, -2, 2].map((x, i) => add(at(soldier(i), x, 10.55, 2.2, Math.PI)));
            const ds = [0, 1, 2].map(i => add(at(digger(i), -4 + i * 4, 0.15, -3, Math.PI / 2)));
            const tools = [-3, 1, 5].map(x => add(box(1.4, 0.2, 0.2, 0x777777, x, 0.3, -2.5)));
            add(createLantern(0, 3.2, -3.5, 0xffb84a, 0.6));
            return { update: t => { ss.forEach((s, i) => { const k = Math.abs(Math.sin(t * 8 + i)); pose(s, { la: -1.4 + k * 0.5, ra: -1.4 + k * 0.5 }); }); drums.forEach((d, i) => d.scale.y = 1 + Math.abs(Math.sin(t * 8 + i)) * 0.05); ds.forEach((d, i) => { if (t > 3) { walkTo(d, 30, -3, 0.18); } else shock(d); }); } };
        }
    },
    {
        title: "14. The Bucket Line",
        desc: "Everyone in the castle helps. A long line stretches from the castle well to the cellar, and buckets of water pass from hand to hand. Maud the cook, Alfie, Sir Roland, even Lady Eleanor herself. Splash after splash, the water pours down into the empty tunnel.",
        camPos: [16, 9, 18], camLookAt: [0, 2, -2], skyColor: 0xc8d4dc, mood: 'day', ground: 0x7a6a4a,
        setup: () => {
            const w = add(createCastleWall(40, 10, 3)); w.position.z = -10;
            const well = add(group(cyl(1.6, 1.6, 1.4, STONE3, 0, 0.7, 0, 14), box(0.2, 3, 0.2, 0x5a3a22, -1.3, 2.2, 0), box(0.2, 3, 0.2, 0x5a3a22, 1.3, 2.2, 0), box(3, 0.25, 0.25, 0x5a3a22, 0, 3.7, 0))); well.position.set(-14, 0, 2);
            add(box(4, 0.2, 3, 0x2a1a10, 12, 0.1, -4));
            const line = []; const who = [cookMaud, alfie, sirRoland, ladyEleanor, () => soldier(1), () => soldier(2), createKid];
            for (let i = 0; i < who.length; i++) line.push(add(at(who[i](), -11 + i * 3.6, 0, 1 - i * 0.6, Math.PI / 2)));
            const buckets = line.map(() => add(cyl(0.45, 0.35, 0.7, 0x7a5a3a, 0, 0, 0, 10)));
            return { update: t => { line.forEach((w, i) => { const s = Math.sin(t * 2.5 - i * 0.6); pose(w, { la: -1.2, ra: -1.2, laz: s * 0.4, raz: s * 0.4 }); w.rotation.y = Math.PI / 2 - s * 0.7; const hp = new THREE.Vector3(); w.rig.rightArmGroup.children[1].getWorldPosition(hp); buckets[i].position.set(hp.x, hp.y - 0.4, hp.z); }); } };
        }
    },
    {
        title: "15. The Tunnel Floods",
        desc: "Down below, a rushing river of water fills the tunnel from end to end. The wooden props creak, wobble and give way. With a deep, wet rumble, the whole tunnel caves in. And because of the warning, not a single person is inside.",
        camPos: [10, 3.6, 22], camLookAt: [0, 4.6, -2], skyColor: 0x0a0806, mood: 'cellar', ground: false,
        setup: () => {
            const tun = add(createTunnelCutaway(36));
            const water = add(box(36, 0.1, 4, new THREE.MeshStandardMaterial({ color: 0x3f7fa8, roughness: 0.2, transparent: true, opacity: 0.85 }), 0, 0.2, -3));
            const ceiling = tun.children[0];
            const props = tun.children.filter((c, i) => i >= 4 && c.geometry && c.geometry.parameters.height === 6.5);
            add(createLantern(0, 3.2, -3.5, 0x6fa8c8, 0.6));
            return { update: t => { water.scale.y = 1 + ease(t, 0, 6) * 50; water.position.y = 0.2 + ease(t, 0, 6) * 2.5; props.forEach((p, i) => { p.rotation.z = ease(t, 6 + i * 0.2, 8 + i * 0.2) * (i % 2 ? 1.2 : -1.2); }); ceiling.position.y = 8.25 - ease(t, 8, 10) * 4; if (t > 8 && !tun.shook) { tun.shook = 1; flashScreen('#6b5a40', 900); } } };
        }
    },
    {
        title: "16. The Baron's Surprise",
        desc: "Outside the walls, the ground sags into a long muddy ditch. Baron Grimwald stares at it in disbelief. His secret tunnel is gone, along with weeks of work. His soldiers grumble. Some of them are already packing up their tents.",
        camPos: [14, 9, 20], camLookAt: [0, 2, 0], skyColor: 0xa8b8c8, mood: 'day', ground: 0x5f7f45,
        setup: () => {
            const castle = add(createCastle({ moat: false })); castle.position.set(0, 0, -40);
            const ditch = add(box(6, 0.4, 30, 0x5a4330, 0, 0.05, -6)); ditch.rotation.y = 0;
            for (let i = 0; i < 6; i++) add(createRock(-2 + (i % 2) * 4, 0.3, -18 + i * 5, 0.8, 0x5a4330));
            const b = add(at(baron(), 4, 0, 8, Math.PI + 0.3));
            const es = [[8, 10], [10, 6], [-6, 10]].map(([x, z], i) => add(at(enemy(i), x, 0, z, Math.PI)));
            add(createTent(16, 16, 1.2, 0x5a1a1a));
            return { update: t => { if (t > 4) pose(b, { la: -0.4, ra: -0.4, laz: -0.5, raz: 0.5, nod: 0.3 }); else shock(b); es.forEach((e, i) => { if (i === 2 && t > 6) walkTo(e, -6, 30, 0.05); else pose(e, { la: -1.6, laz: 0.4, nod: 0.2 }); }); } };
        }
    },
    {
        title: "17. Talks at the Gate",
        desc: "At noon the drawbridge comes down. Lady Eleanor walks out to meet Baron Grimwald face to face. They talk for a long time. At last the baron sighs and holds out his hand. No more fighting. They shake on a fair peace, and the red army begins to march home.",
        camPos: [2, 9, 46], camLookAt: [0, 4, 26], skyColor: 0xbcd0e0, mood: 'bright', ground: 0x5f7f45,
        setup: () => {
            add(createCastle());
            const lady = add(at(ladyEleanor(), -1.2, 0.5, 30, Math.PI / 2)); const b = add(at(baron(), 1.2, 0.5, 30, -Math.PI / 2));
            const rol = add(at(sirRoland(), -4, 0.5, 27, Math.PI / 2)); const kid = add(at(createKid(), -3.2, 0.5, 24, Math.PI * 0.8)); const al = add(at(alfie(), -5, 0.5, 24.4, Math.PI * 0.7));
            const es = [[5, 33], [6, 28]].map(([x, z], i) => add(at(enemy(i), x, 0, z, -Math.PI / 2)));
            return { update: t => { if (t > 8) { shake(lady, t); shake(b, t); } else { idle(lady, t); pose(b, { la: -0.3, ra: -0.3, nod: Math.sin(t) * 0.1 }); } idle(rol, t); if (t > 10) { cheer(kid, t); cheer(al, t, 1); } else { idle(kid, t); idle(al, t, 2); } es.forEach((e, i) => idle(e, t, i)); } };
        }
    },
    {
        title: "18. The Feast",
        desc: "That evening, the courtyard glows with lanterns. Long tables are piled with bread, soup and apples. Musicians play, and everyone claps along. Lady Eleanor raises her cup to the boy from far away who listened to the ground.",
        camPos: [0, 9, 20], camLookAt: [0, 3, 0], skyColor: 0x2a2a4a, mood: 'dusk', ground: 0x6a5a40, sunPos: [-30, 15, 30],
        setup: () => {
            const w = add(createCastleWall(40, 10, 3)); w.position.z = -12;
            add(createTable(0, -2, 16, 3, 2, 0x6a4a2a));
            for (let i = 0; i < 6; i++) { add(sph(0.35, 0xc8102e, -6 + i * 2.4, 2.4, -2, 8)); add(box(1.2, 0.5, 0.8, 0xc9934a, -5 + i * 2.4, 2.35, -1.5)); }
            for (let i = 0; i < 8; i++) add(createLantern(-14 + i * 4, 7 + Math.sin(i) * 0.5, -6, [0xffc36b, 0xff9f6b, 0xffe08a][i % 3], 0.6));
            const lady = add(at(ladyEleanor(), 0, 0, -4.5, 0));
            const people = [createKid, alfie, sirRoland, cookMaud, () => soldier(0), () => soldier(2)].map((f, i) => add(at(f(), -9 + i * 3.6, 0, 2.5, Math.PI + (i - 2.5) * 0.15)));
            return { update: t => { pose(lady, { ra: -2.5, raz: 0.1 }); people.forEach((p, i) => clap(p, t, i)); people.forEach(p => p.rotation.y = lerpAngle(p.rotation.y, Math.atan2(-p.position.x, -4.5 - p.position.z), 0.05)); } };
        }
    },
    {
        title: "19. The Third Gem",
        desc: "As the music plays, the watch grows warm against Mohamed's chest, and a yellow gem shines out like a tiny sun. Three, says Alfie in wonder. What happens when you have all seven? I go home, Mohamed says, I think.",
        camPos: [0, 4.6, 7.5], camLookAt: [0, 3, 0], skyColor: 0x2a2a4a, mood: 'dusk', ground: 0x6a5a40, gems: 3, gemMoment: true,
        setup: () => {
            const w = add(createCastleWall(40, 10, 3)); w.position.z = -10;
            for (let i = 0; i < 6; i++) add(createLantern(-10 + i * 4, 6, -7, 0xffc36b, 0.6));
            const kid = add(at(createKid(), -0.7, 0, 0, 0.25)); const al = add(at(alfie(), 1.6, 0, 0.2, -0.6));
            let lit = false;
            return { update: t => { if (t > 3 && !lit) { lit = true; lightGem(kid, 3); } if (t > 3) { pose(kid, { la: -1.1, laz: 0.4, nod: 0.3 }); shock(al); } else { idle(kid, t); idle(al, t, 1); } } };
        }
    },
    {
        title: "20. A Crack in the Dark",
        desc: "In a dark forest far from the castle, the man in the grey coat stares at his own watch. A tiny crack has appeared across its purple face. Three gems, he hisses. Every gem he wins, my watch grows weaker. He closes his fist. Then I must reach him before the end.",
        camPos: [0, 5.5, 10], camLookAt: [0, 4, 0], skyColor: 0x0f1420, mood: 'night', ground: 0x24301e, fog: 0.03,
        setup: () => {
            const r = makeRand(12); for (let i = 0; i < 26; i++) add(createPine((r() - 0.5) * 50, -4 - r() * 30, 1.4 + r(), 0x1f3a2a));
            add(createStars(400));
            const col = add(at(createCollector(), 0, 0, 0, 0));
            const purple = add(createGlow(0xa04cff, 4, 0.5));
            return { update: t => { pose(col, { ra: -1.6, raz: -0.6, nod: 0.4 }); const wp = new THREE.Vector3(); col.watch.getWorldPosition(wp); purple.position.copy(wp); col.watch.pulse(); col.watch.setPower(0.4 + Math.abs(Math.sin(t * 3)) * 0.4); if (t > 10) pose(col, { ra: -0.4, la: -0.4, nod: 0 }); } };
        }
    },
    {
        title: "21. Farewell, Alfie",
        desc: "The watch ticks faster and faster. Alfie gives Mohamed a small wooden shield he carved himself. So you remember Stonemere, he says. They shake hands one last time. In the glowing ring of light, Mohamed glimpses spinning brass gears, and the shape of a great elephant.",
        camPos: [2, 5, 13], camLookAt: [0, 3, 0], skyColor: 0xf2b880, mood: 'golden', ground: 0x7a6a4a, sunPos: [-40, 20, 20],
        setup: () => {
            const w = add(createCastleWall(40, 10, 3)); w.position.z = -10;
            const kid = add(at(createKid(), 0, 0, 0, Math.PI / 2)); const al = add(at(alfie(), 2.2, 0, 0, -Math.PI / 2));
            const shield = add(group(box(0.9, 1.1, 0.12, 0x8a5a32, 0, 0, 0), box(0.12, 1.0, 0.14, 0xd4af37, 0, 0, 0), box(0.8, 0.12, 0.14, 0xd4af37, 0, 0.1, 0)));
            const portal = add(createPortal(3.2)); portal.position.set(-4, 3.6, 0); portal.rotation.y = Math.PI / 2; portal.setPower(0);
            const glimpse = add(group(new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.12, 6, 10), glowMat(0xd4af37)), box(1.4, 0.9, 0.1, glowMat(0x8a8a9a), 0.6, -1, 0))); glimpse.position.set(-4.2, 3.6, 0); glimpse.rotation.y = Math.PI / 2; glimpse.visible = false;
            return {
                update: t => {
                    kid.watch.setPower(1 + ease(t, 1, 8) * 10); kid.watch.pulse();
                    const hp = new THREE.Vector3();
                    if (t < 4) { pose(al, { ra: -1.3 }); al.rig.rightArmGroup.children[1].getWorldPosition(hp); idle(kid, t); }
                    else { pose(kid, { la: -1.3 }); kid.rig.leftArmGroup.children[1].getWorldPosition(hp); if (t < 7) { shake(al, t); pose(kid, { la: -1.3, ra: -1.05 + Math.sin(t * 9) * 0.1 }); } else wave(al, t); }
                    shield.position.copy(hp); shield.rotation.y = kid.rotation.y;
                    portal.setPower(ease(t, 6, 9)); glimpse.visible = t > 8 && t < 11; glimpse.children[0].rotation.z = t * 2;
                    if (t > 9) walkTo(kid, -3.6, 0, 0.05);
                    if (t > 10.5) { kid.scale.setScalar(Math.max(0.01, 1 - (t - 10.5) * 0.8)); shield.visible = false; }
                }
            };
        }
    }
];

window.TRAILER = {
    open: "A castle that has never fallen...",
    shots: [
        [2, 3, 3.6, "Surrounded."],
        [3, 6, 3.2, "Waiting."],
        [4, 6, 3.2, "A new friend."],
        [7, 7, 3.4, "Too quiet."],
        [8, 6, 3.8, "Something is moving under the ground."]
    ]
};
