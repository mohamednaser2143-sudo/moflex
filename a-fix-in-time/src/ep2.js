// TITLE: The Great Wall
// Episode 2 — Ming China. A new part of the Great Wall keeps falling down, and the rice has gone missing.

// ---------- Episode 2 props ----------
const WALL_STONE = 0x9a8f7e, WALL_DARK = 0x6f6658;
// A straight piece of the wall with a walkway and battlements, centred on the origin, running along x.
function createWallPiece(len = 12, h = 7, w = 5, broken = false) {
    const g = group(box(len, h, w, WALL_STONE, 0, h / 2, 0), box(len + 0.1, 0.3, w + 0.2, WALL_DARK, 0, h, 0));
    const r = makeRand(len * 7 + h);
    for (let i = 0; i < len / 1.5; i++) {
        const x = -len / 2 + 0.6 + i * 1.5;
        if (broken && r() < 0.5) continue;
        g.add(box(0.9, 1.1, 0.5, WALL_STONE, x, h + 0.7, w / 2 - 0.25), box(0.9, 0.7, 0.5, WALL_STONE, x, h + 0.5, -w / 2 + 0.25));
    }
    // brick lines on the front face
    for (let row = 1; row < h; row += 1.2) g.add(box(len + 0.02, 0.06, 0.02, WALL_DARK, 0, row, w / 2 + 0.01));
    return g;
}
function createWatchtower(h = 11) {
    const g = group(box(7, h, 7, WALL_STONE, 0, h / 2, 0), box(7.2, 0.4, 7.2, WALL_DARK, 0, h, 0));
    for (let i = 0; i < 4; i++) for (let k = 0; k < 4; k++) { const a = i * Math.PI / 2; const off = -2.6 + k * 1.75; g.add(at(box(0.9, 1.1, 0.5, WALL_STONE, 0, 0, 0), Math.cos(a) * 3.3 - Math.sin(a) * off, h + 0.7, Math.sin(a) * 3.3 + Math.cos(a) * off, a)); }
    g.add(box(1.6, 2.6, 0.2, 0x2a1d14, 0, 1.3, 3.51), box(1, 1.3, 0.2, 0x2a1d14, -2, h - 3, 3.51), box(1, 1.3, 0.2, 0x2a1d14, 2, h - 3, 3.51));
    g.add(cyl(0.08, 0.08, 4, 0x4a3020, 2.6, h + 2, 2.6, 6), box(0.05, 1.2, 1.8, mat(0xc8102e, { side: THREE.DoubleSide }), 2.6, h + 3.3, 1.7));
    return g;
}
// The wall winding over the ridge into the distance.
function createGreatWallVista(seed = 1) {
    const g = group(); const r = makeRand(seed);
    const pts = []; for (let i = 0; i <= 26; i++) { const x = -130 + i * 10; pts.push([x, Math.sin(i * 0.55) * 18 - 40 - i * 1.2, 6 + Math.sin(i * 0.9) * 7 + Math.abs(Math.sin(i * 0.35)) * 10]); }
    for (let i = 0; i < pts.length - 1; i++) {
        const [x1, z1, y1] = pts[i], [x2, z2, y2] = pts[i + 1];
        const len = Math.hypot(x2 - x1, z2 - z1);
        const hill = createMountain((x1 + x2) / 2, (z1 + z2) / 2, Math.max(y1, y2) + 3, 14 + r() * 6, 0x5f7f4a, false, i); hill.children[0].position.y = (Math.max(y1, y2) + 3) / 2 - 3; g.add(hill);
        const piece = createWallPiece(len + 0.6, 4, 3.4); piece.position.set((x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2);
        piece.rotation.y = -Math.atan2(z2 - z1, x2 - x1); piece.rotation.z = Math.atan2(y2 - y1, len); g.add(piece);
        if (i % 4 === 0) { const tw = createWatchtower(7); tw.scale.setScalar(0.8); tw.position.set(x1, y1 - 1, z1); g.add(tw); }
    }
    for (let i = 0; i < 9; i++) g.add(createMountain(-150 + i * 38, -150 - r() * 40, 40 + r() * 30, 30, 0x6a7f7a, i % 2 === 0, i));
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
// Bricks that tumble down when a wall section fails. Call .fall() to start.
function createCollapse(x, z, len = 10, h = 6) {
    const g = group(); const bricks = []; const r = makeRand(x * 3 + z);
    for (let row = 0; row < 5; row++) for (let i = 0; i < len / 1.4; i++) {
        const b = box(1.3, 0.65, 1.0, WALL_STONE, -len / 2 + i * 1.4 + (row % 2) * 0.6, h - row * 0.7, 0); g.add(b);
        bricks.push({ m: b, v: new THREE.Vector3((r() - 0.5) * 0.1, r() * 0.05, 0.05 + r() * 0.12), spin: (r() - 0.5) * 0.2, delay: r() * 50 + row * 6 });
    }
    let falling = false, tick = 0;
    g.fall = () => { falling = true; };
    addFx(() => {
        if (!falling) return; tick++;
        bricks.forEach(b => {
            if (tick < b.delay) return;
            if (b.m.position.y > 0.35) { b.v.y -= 0.012; b.m.position.add(b.v); b.m.rotation.x += b.spin; b.m.rotation.z += b.spin * 0.5; }
            else { b.m.position.y = 0.35; b.v.multiplyScalar(0.8); b.m.position.x += b.v.x; b.m.position.z += b.v.z; }
        });
    });
    g.position.set(x, 0, z); return g;
}
function createBrickPile(x, z, n = 18, seed = 3) {
    const g = group(); const r = makeRand(seed);
    for (let i = 0; i < n; i++) { const b = box(1.3, 0.65, 1.0, WALL_STONE, (r() - 0.5) * 6, 0.33 + Math.floor(i / 7) * 0.6, (r() - 0.5) * 3); b.rotation.y = r() * 3; b.rotation.z = (r() - 0.5) * 0.4; g.add(b); }
    g.position.set(x, 0, z); return g;
}
function createCave(x, z) {
    const g = group(); const r = makeRand(31);
    for (let i = 0; i < 18; i++) { const a = Math.PI * (i / 17); g.add(createRock(Math.cos(a) * 9, Math.sin(a) * 8 + 0.5, (r() - 0.5) * 2, 2.2 + r() * 0.8, 0x6f675c)); }
    for (let i = 0; i < 10; i++) g.add(createRock((r() - 0.5) * 26, 10 + r() * 3, -3 - r() * 4, 4 + r() * 2, 0x6a6258));
    g.add(box(16, 11, 2, 0x0e0b09, 0, 5, -8));
    g.position.set(x, 0, z); return g;
}
const worker = (i, o = {}) => createPerson(Object.assign({ shirt: [0x3d5a80, 0x6b705c, 0x8a6a4a, 0x50606b, 0x7a4a3a][i % 5], legs: [0x2b2d42, 0x4a4033, 0x3a3a3a][i % 3], skin: [0xe9c08f, 0xd9a86c, 0xc89664, 0xf0c99a][i % 4], hair: 0x111111, hairStyle: 'short', hat: i % 3 === 2 ? null : 'straw', hatColor: 0xd4b06a, belt: 0x2a1a10, shoes: 0x2a2018 }, o));
const mei = () => createPerson({ child: true, shirt: 0xd1495b, legs: 0x3a2a4a, skin: 0xf0c99a, hair: 0x111111, hairStyle: 'bun', belt: 0xf2c14e, shoes: 0x2a1a10 });
const masterLi = () => createPerson({ shirt: 0x1d3557, coat: 0x1d3557, legs: 0x1a1a2a, skin: 0xe9c08f, hair: 0x222222, hat: 'cap', hatColor: 0x111111, beard: 0x444444, belt: 0xc9a240 });
const grandmaWen = () => createPerson({ shirt: 0x6a4c93, coat: 0x6a4c93, legs: 0x3a2a4a, skin: 0xe0b48a, hair: 0xd8d8d8, hairStyle: 'bun', shoes: 0x2a1a10 });
const general = () => createPerson({ shirt: 0x8b1e2b, legs: 0x2a2a2a, skin: 0xd9a86c, hat: 'helmet', hatColor: 0xb8902f, beard: 0x222222, belt: 0xc9a240, vest: 0x5a4a3a });
// Shared ground scene by the building site.
function siteSet(opts = {}) {
    const wall = add(createWallPiece(opts.len || 40, 7, 5, false)); wall.position.set(opts.wx || 0, 0, opts.wz || -10);
    if (opts.tower !== false) add(at(createWatchtower(11), (opts.wx || 0) + 22, 0, opts.wz || -10));
    add(createMountain(-60, -90, 50, 36, 0x5f7f4a, false, 2)); add(createMountain(50, -110, 60, 40, 0x6a7f7a, true, 4)); add(createMountain(0, -140, 70, 50, 0x6a7f7a, true, 1));
    for (let i = 0; i < 6; i++) add(createPine(-34 + i * 13, -24 - (i % 2) * 6, 1.4));
    return { wall };
}

// ---------- Story ----------
const storyData = [
    {
        title: "1. A Ridge in the Clouds",
        desc: "The blue light spits Mohamed out onto soft mountain grass. Cold mist curls around him. He sits up, rubs his eyes, and gasps. Across the peaks, as far as he can see, runs a giant stone wall, rising and falling over the mountains like a sleeping dragon.",
        camPos: [0, 12, 30], camLookAt: [0, 8, -40], skyColor: 0xc7d3dd, mood: 'day', ground: 0x5f7f4a, fog: 0.004,
        setup: () => {
            add(createGreatWallVista(2)); add(createClouds(10, 30, 260, 4));
            const kid = add(at(createKid(), 0, 0, 14, Math.PI));
            const portal = add(createPortal(3)); portal.position.set(0, 4, 16); portal.setPower(1);
            return { update: t => { portal.setPower(1 - ease(t, 0.5, 3)); if (t < 3) { kid.inner.position.y = -1.6; pose(kid, { ll: -1.5, rl: -1.5, la: -0.4, ra: -0.4 }); } else { kid.inner.position.y = -1.6 * (1 - ease(t, 3, 4.5)); if (t > 5) shock(kid); else pose(kid, {}); } } };
        }
    },
    {
        title: "2. The Builders of the Wall",
        desc: "This is China, more than four hundred years ago. Hundreds of builders are making the wall longer and stronger, to protect the land from raiders in the north. They carry baskets of bricks on poles across their shoulders, and their songs echo off the hills.",
        camPos: [24, 10, 22], camLookAt: [0, 5, -8], skyColor: 0xc7d3dd, mood: 'day', ground: 0x6b8a52,
        setup: () => {
            siteSet();
            const ws = []; for (let i = 0; i < 7; i++) ws.push(add(at(worker(i), -20 + i * 6, 0, 0 + (i % 2) * 3)));
            const poles = ws.map(w => { const p = group(box(0.15, 0.15, 4, 0x6a4a2a, 0, 0, 0), at(createCrate(0, 0, 0.45, 0x9a8f7e), 0, -1.4, 1.8), at(createCrate(0, 0, 0.45, 0x9a8f7e), 0, -1.4, -1.8)); p.rotation.y = Math.PI / 2; add(p); return p; });
            return { update: t => { ws.forEach((w, i) => { const x = -26 + ((t * 1.8 + i * 7) % 52); w.position.x = x; w.rotation.y = Math.PI / 2; walkTo(w, x + 1, w.position.z, 0.03); w.position.x = x; poles[i].position.set(x, 4.1, w.position.z); poles[i].rotation.y = 0; poles[i].children.forEach(c => { }); }); } };
        }
    },
    {
        title: "3. A Wall That Will Not Stand",
        desc: "Suddenly there is a terrible crack. A brand new section of the wall shivers, and bricks begin to tumble like falling dominoes. Builders leap out of the way. When the dust clears, the section they finished only yesterday is nothing but a pile of rubble.",
        camPos: [0, 9, 26], camLookAt: [0, 4, -6], skyColor: 0xc7d3dd, mood: 'day', ground: 0x6b8a52,
        setup: () => {
            const left = add(createWallPiece(14, 7, 5)); left.position.set(-14, 0, -8);
            const right = add(createWallPiece(14, 7, 5)); right.position.set(14, 0, -8);
            const col = add(createCollapse(0, -6.5, 12, 6.3));
            const dust = add(createGlow(0xd8cbb0, 0.1, 0.35)); dust.position.set(0, 3, -5);
            const ws = [[-6, 2], [5, 3], [0, 5]].map(([x, z], i) => add(at(worker(i + 1), x, 0, z, Math.PI)));
            const kid = add(at(createKid(), 9, 0, 9, Math.PI + 0.4));
            add(createMountain(0, -120, 60, 40, 0x6a7f7a, true, 1));
            return { update: t => { if (t > 2.5 && !col.started) { col.started = true; col.fall(); } const d = ease(t, 3, 6) * (1 - ease(t, 9, 14)); dust.scale.setScalar(0.1 + d * 26); dust.material.opacity = 0.35 * d; ws.forEach((w, i) => { if (t > 3) { w.rotation.y = 0; walkTo(w, w.position.x + (i - 1) * 0.5, 9, 0.12); if (w.position.z > 8.5) shock(w); } }); if (t > 3) shock(kid); else idle(kid, t); } };
        }
    },
    {
        title: "4. A Girl Named Mei",
        desc: "A girl about Mohamed's age is carrying two buckets of water on a pole. She stares at his red hoodie and white shoes and bursts out laughing. You dress very strangely, she says. I am Mei. You look hungry. And she hands him a warm steamed bun.",
        camPos: [3, 5.5, 13], camLookAt: [0, 2.6, 0], skyColor: 0xc7d3dd, mood: 'day', ground: 0x6b8a52,
        setup: () => {
            siteSet({ wz: -14 });
            const kid = add(at(createKid(), -2.2, 0, 0, Math.PI / 2));
            const m = add(at(mei(), 6, 0, 0, -Math.PI / 2));
            const pole = add(group(box(0.12, 0.12, 4, 0x6a4a2a, 0, 0, 0), cyl(0.5, 0.4, 0.8, 0x7a5a3a, 0, -0.9, 1.8, 10), cyl(0.5, 0.4, 0.8, 0x7a5a3a, 0, -0.9, -1.8, 10)));
            const bun = add(sph(0.3, 0xf6efe0, 0, 0, 0, 10));
            return {
                update: t => {
                    if (walkTo(m, 2.2, 0, 0.05)) { pole.visible = true; } else { face(m, kid.position.x, kid.position.z); if (t > 7) { pose(m, { ra: -1.3 }); } else pose(m, { la: -0.2, ra: -0.5, nod: Math.sin(t * 8) * 0.06 * (t > 4 ? 1 : 0) }); }
                    pole.position.set(m.position.x, 3.65, m.position.z); pole.rotation.y = m.rotation.y + Math.PI / 2;
                    if (t > 6) { pole.position.set(m.position.x + 0.6, 0.9, m.position.z - 1.8); pole.rotation.y = 0; }
                    const hp = new THREE.Vector3(); m.rig.rightArmGroup.children[1].getWorldPosition(hp); bun.visible = t > 7; bun.position.copy(hp);
                    if (t > 9) { kid.rig.rightArmGroup.children[1].getWorldPosition(hp); bun.position.copy(hp); pose(kid, { ra: -1.3 }); } else idle(kid, t);
                    if (t > 11) { pose(kid, { ra: -2.6, raz: -0.3, nod: 0 }); bun.position.y += 0.4; }
                }
            };
        }
    },
    {
        title: "5. Master Li's Worry",
        desc: "Master Li, the chief builder, paces back and forth in his dark blue robe. Three times this wall has fallen, he says. In three days the general comes to inspect our work. If it falls again, every builder here will be sent home in shame.",
        camPos: [-4, 6, 15], camLookAt: [0, 3, 0], skyColor: 0xb9c6d0, mood: 'day', ground: 0x6b8a52,
        setup: () => {
            siteSet({ wz: -14 }); add(createBrickPile(-4, -6, 22, 5)); add(createBrickPile(5, -7, 16, 7));
            const li = add(at(masterLi(), -3, 0, 0, Math.PI / 2));
            const kid = add(at(createKid(), 4, 0, 3, -Math.PI / 2 - 0.4));
            const m = add(at(mei(), 6, 0, 1, -Math.PI / 2 - 0.2));
            return { update: t => { const x = Math.sin(t * 0.5) * 3; walkTo(li, x * 1.3, Math.cos(t * 0.5) * 0.4, 0.05); if (t > 10) { face(li, kid.position.x, kid.position.z); pose(li, { la: -0.9, ra: -0.9, laz: 0.5, raz: -0.5 }); } idle(kid, t); kid.rig.head.rotation.y = 0; face(kid, li.position.x, li.position.z, 0.05); idle(m, t, 1); } };
        }
    },
    {
        title: "6. Brick by Brick",
        desc: "Mohamed wants to help. He rolls up his sleeves and carries bricks with the builders. They mix lime powder with water to make mortar, spread it between the bricks, and slowly the wall grows again. By sunset the new section stands tall and proud.",
        camPos: [14, 8, 18], camLookAt: [0, 3.5, -6], skyColor: 0xf2b880, mood: 'golden', ground: 0x6b8a52, sunPos: [-50, 25, 20],
        setup: () => {
            siteSet({ wz: -10, len: 50 });
            const newPart = add(createWallPiece(12, 7, 5)); newPart.position.set(0, -7, -4);
            const trough = add(box(4, 0.8, 2, 0x6a4a2a, 6, 0.4, 2)); add(box(3.6, 0.1, 1.6, 0xe8e4d8, 6, 0.82, 2));
            const kid = add(at(createKid(), -6, 0, 3));
            const ws = [[4, 0.5], [8, 3], [-2, 0.5]].map(([x, z], i) => add(at(worker(i + 2), x, 0, z)));
            const brick = add(box(1.0, 0.5, 0.8, WALL_STONE));
            return {
                update: t => {
                    newPart.position.y = -7 + Math.min(7, t * 0.45);
                    const k = (t * 0.25) % 2; const tx = k < 1 ? -1 : -6;
                    walkTo(kid, tx, k < 1 ? -0.5 : 3, 0.06) || (k < 1 ? work(kid, t) : carry(kid));
                    if (k >= 1 || kid.position.z > 0.5) carry(kid);
                    const hp = new THREE.Vector3(); kid.rig.rightArmGroup.children[1].getWorldPosition(hp); brick.position.set(kid.position.x, hp.y, kid.position.z); brick.visible = true;
                    ws.forEach((w, i) => { w.rotation.y = Math.PI; work(w, t, i * 1.4); });
                }
            };
        }
    },
    {
        title: "7. Rain in the Night",
        desc: "That night, rain hammers on the builders' tents. Mohamed lies awake, listening. Then, through the storm, comes a deep rumbling sound. He runs outside with a lantern just in time to see the brand new wall slide down into the mud once more.",
        camPos: [6, 8, 20], camLookAt: [0, 4, -6], skyColor: 0x1b2433, mood: 'night', ground: 0x3e4f3a, fog: 0.012,
        setup: () => {
            const left = add(createWallPiece(14, 7, 5)); left.position.set(-14, 0, -8);
            const right = add(createWallPiece(14, 7, 5)); right.position.set(14, 0, -8);
            const col = add(createCollapse(0, -6.5, 12, 6.3));
            add(createRain(1200, 90, 40)); add(createHut(-10, 10, 6, 5, 3.5, 0x9a8a6a, 0x2a2a2a));
            const kid = add(at(createKid(), -6, 0, 12, Math.PI - 0.3));
            const lamp = add(createLantern(0, 0, 0, 0xffc36b, 0.6));
            let flash = 0;
            return { update: t => { if (t > 5 && !col.started) { col.started = true; col.fall(); } walkTo(kid, -2, 6, 0.08) || shock(kid); const hp = new THREE.Vector3(); kid.rig.rightArmGroup.children[1].getWorldPosition(hp); lamp.position.copy(hp); lamp.position.y -= 0.4; if (t > 4.6 && flash < 1) { flash = 1; flashScreen('#cfe3ff', 600); } } };
        }
    },
    {
        title: "8. A Morning of Rubble",
        desc: "In the grey morning, the builders sit among the broken bricks with their heads in their hands. Nobody speaks. Master Li stares at the mud. Mohamed picks up a lump of old mortar, and it crumbles between his fingers like dry sand.",
        camPos: [10, 6, 14], camLookAt: [0, 2, -2], skyColor: 0xa9b4bd, mood: 'storm', ground: 0x56664a, fog: 0.01,
        setup: () => {
            add(createBrickPile(0, -4, 40, 9)); add(createBrickPile(-7, -2, 20, 4));
            const left = add(createWallPiece(14, 7, 5)); left.position.set(-16, 0, -9);
            const ws = [[-5, 2], [-2, 3.5], [4, 3], [7, 0.5]].map(([x, z], i) => add(at(worker(i), x, 0, z, Math.PI * 0.9 + i * 0.3)));
            ws.forEach(w => { w.inner.position.y = -1.0; pose(w, { ll: -1.5, rl: -1.5, la: -1.9, ra: -1.9, nod: 0.5 }); });
            const li = add(at(masterLi(), 1, 0, -0.5, 0.3));
            const kid = add(at(createKid(), 3, 0, 5.5, -0.6));
            const lump = add(box(0.4, 0.3, 0.4, 0xd8d0bf));
            const crumbs = add(createBurst(0xd8d0bf, 50, 0.04));
            return { update: t => { pose(li, { nod: 0.45, la: -0.2, ra: -0.2 }); pose(kid, { ra: -1.4, nod: 0.4 }); const hp = new THREE.Vector3(); kid.rig.rightArmGroup.children[1].getWorldPosition(hp); lump.position.copy(hp); lump.position.y += 0.3; if (t > 6 && !lump.done) { lump.done = 1; crumbs.position.copy(lump.position); crumbs.fire(); } lump.scale.setScalar(t > 6 ? Math.max(0.01, 1 - (t - 6)) : 1); } };
        }
    },
    {
        title: "9. Grandmother's Secret",
        desc: "Mei sits beside him. My grandmother says the old builders had a secret, she whispers. They cooked rice until it was sticky like glue, and mixed it into the mortar. But we have had no rice for weeks. Mohamed's eyes go wide. He learned about sticky rice mortar in school.",
        camPos: [0, 4.6, 9], camLookAt: [0, 2.2, 0], skyColor: 0xa9b4bd, mood: 'storm', ground: 0x56664a, fog: 0.01,
        setup: () => {
            add(createBrickPile(0, -6, 30, 9));
            const kid = add(at(createKid(), -1.2, 0, 0, 0.5)); kid.inner.position.y = -0.7;
            const m = add(at(mei(), 1.2, 0, 0, -0.5)); m.inner.position.y = -0.7;
            add(box(5, 0.8, 1.2, WALL_STONE, 0, 0.4, -1.2));
            return { update: t => { pose(kid, { ll: -1.5, rl: -1.5, la: -0.5, ra: -0.5 }); pose(m, { ll: -1.5, rl: -1.5, la: -0.6, ra: t > 3 && t < 10 ? -1.2 + Math.sin(t * 5) * 0.2 : -0.5 }); kid.rig.head.rotation.y = 0.5; m.rig.head.rotation.y = -0.5; if (t > 11) { pose(kid, { ll: -1.5, rl: -1.5, ra: -2.6, raz: 0.2 }); kid.rig.head.rotation.y = 0; } } };
        }
    },
    {
        title: "10. The Empty Storehouse",
        desc: "Mei leads him to the village storehouse. The shelves are bare, and the big rice jars are empty. But on the dusty floor something glints. Mohamed picks it up. It is a strange silver coin, the very same kind that the man in the grey coat gave to Gristle on the ship.",
        camPos: [0, 7, 15], camLookAt: [0, 3, 0], skyColor: 0x2a2018, mood: 'indoor', ground: false,
        setup: () => {
            add(createRoom({ w: 22, d: 16, h: 9, wall: 0x9a8562, floor: 0x6a543a, trim: 0x4a3020 }));
            for (let i = 0; i < 3; i++) add(box(16, 0.3, 2, 0x6a4a2a, 0, 2.5 + i * 2.2, -7));
            for (let i = 0; i < 5; i++) add(group(cyl(1.0, 0.8, 2.2, 0x8a5a3a, -7 + i * 3.5, 1.1, -4.5, 12), cyl(0.7, 0.7, 0.3, 0x6a3a22, -7 + i * 3.5, 2.3, -4.5, 12)));
            const beam = add(createGlow(0xfff2c8, 9, 0.18)); beam.position.set(-4, 6, -6);
            const kid = add(at(createKid(), 3, 0, 4, Math.PI));
            const m = add(at(mei(), -2, 0, 3, Math.PI * 0.8));
            const coin = add(cyl(0.3, 0.3, 0.07, mat(0xd8d8e0, { metalness: 0.9, roughness: 0.15 }), 1, 0.08, -0.5, 16));
            const sparkle = add(createGlow(0xffffff, 0.8, 0.8)); sparkle.position.set(1, 0.2, -0.5);
            return {
                update: t => {
                    sparkle.material.opacity = t < 6 ? 0.4 + Math.abs(Math.sin(t * 4)) * 0.6 : 0; idle(m, t);
                    if (t < 6) { walkTo(kid, 1.4, 0.8, 0.05) || (kid.inner.position.y = -0.6 * ease(t, 4, 5.5), pose(kid, { ll: -1, ra: -1.4, nod: 0.5 })); }
                    else { kid.inner.position.y = 0; face(kid, 0, 10); holdUp(kid); const hp = new THREE.Vector3(); kid.rig.rightArmGroup.children[1].getWorldPosition(hp); coin.position.copy(hp); coin.position.y += 0.4; coin.rotation.x = Math.PI / 2; coin.rotation.z = t * 2; }
                }
            };
        }
    },
    {
        title: "11. The Man Who Bought the Rice",
        desc: "Mei remembers. A tall stranger in a grey coat came to the village a month ago, she says. He paid with shining silver and bought every sack of rice we had. He loaded them onto a cart and drove up the mountain path in the dark. Nobody ever saw him come down.",
        camPos: [12, 8, 18], camLookAt: [0, 3, -2], skyColor: 0x4a3f5f, mood: 'dusk', ground: 0x4f5f42, sunPos: [-40, 12, -20],
        setup: () => {
            add(createHut(-10, -8, 7, 6, 4, 0xb8a47a, 0x2a2a2a)); add(createHut(2, -12, 8, 6, 4, 0xb8a47a, 0x2a2a2a)); add(createHut(14, -6, 6, 5, 3.6, 0xb8a47a, 0x2a2a2a));
            add(createMountain(-30, -60, 40, 30, 0x4f5f52, false, 3));
            const cart = add(createCart(0, 0)); cart.rotation.y = 0.3;
            const col = add(at(createCollector(), -3, 0, 2.5, 0.3));
            const sack = add(createSack(0, 0, 0.7));
            add(createLantern(-6, 4, -4.5, 0xffc36b, 0.8));
            return {
                update: t => {
                    if (t < 6) { carry(col); const hp = new THREE.Vector3(); col.rig.rightArmGroup.children[1].getWorldPosition(hp); sack.position.set(hp.x - 0.6, hp.y - 0.7, hp.z + 0.6); }
                    else { sack.position.set(-0.2, 2.6, 0.3); col.rotation.y = lerpAngle(col.rotation.y, 0.3 + Math.PI / 2, 0.05); pose(col, {}); }
                    if (t > 9) { const k = (t - 9) * 0.08; cart.position.x = k * 10; cart.position.z = -k * 6; sack.position.x = cart.position.x - 0.2; sack.position.z = cart.position.z + 0.3; walkTo(col, cart.position.x + 3, cart.position.z, 0.09); }
                    col.watch.pulse();
                }
            };
        }
    },
    {
        title: "12. Up the Mountain Path",
        desc: "Mohamed and Mei follow the old cart tracks up the mountain. The path winds between pine trees and grey boulders. The higher they climb, the more Mohamed's watch flickers, as if it can feel that something here does not belong.",
        camPos: [10, 9, 18], camLookAt: [0, 4, -4], skyColor: 0xb9c6d0, mood: 'day', ground: 0x5a7046, fog: 0.012,
        setup: () => {
            const r = makeRand(4);
            for (let i = 0; i < 20; i++) add(createPine((r() - 0.5) * 60, -r() * 40 + (r() < 0.5 ? 6 : -4) - 6, 1 + r() * 0.8));
            for (let i = 0; i < 8; i++) add(createRock((r() - 0.5) * 40, 0.8, (r() - 0.5) * 20, 1 + r() * 1.5));
            for (let i = 0; i < 18; i++) { add(box(0.4, 0.05, 1.2, 0x3e3426, -14 + i * 1.6, 0.04, -1 + Math.sin(i * 0.3) * 2 + 0.9)); add(box(0.4, 0.05, 1.2, 0x3e3426, -14 + i * 1.6, 0.04, -1 + Math.sin(i * 0.3) * 2 - 0.9)); }
            const kid = add(at(createKid(), -12, 0, 1));
            const m = add(at(mei(), -14.5, 0, 0));
            return { update: t => { walkTo(kid, 14, -2, 0.05); walkTo(m, 11.5, -3, 0.05); kid.watch.setPower(1 + Math.abs(Math.sin(t * 6)) * 2); if (t > 9) { kid.rig.head.rotation.x = 0.4; } } };
        }
    },
    {
        title: "13. The Hidden Cave",
        desc: "Behind a curtain of hanging vines they find the mouth of a cave. Inside, faint purple light flickers on the walls. And stacked right to the roof are sacks and sacks of rice. The Collector hid it all, so the wall would never stand.",
        camPos: [0, 6, 18], camLookAt: [0, 4, -3], skyColor: 0x9aa8b2, mood: 'day', ground: 0x5a6a46,
        setup: () => {
            add(createCave(0, -6));
            for (let i = 0; i < 16; i++) add(at(createSack(0, 0, 0.9, 0xd8c79a), -4 + (i % 5) * 2, Math.floor(i / 5) * 1.3, -10 - (i % 2)));
            const purple = add(createGlow(0xa04cff, 10, 0.35)); purple.position.set(0, 4, -9);
            for (let i = 0; i < 6; i++) add(createRope([-6 + i * 0.8, 9.5, -6], [-6 + i * 0.8 + Math.sin(i) * 0.3, 5 + (i % 3), -6], 0x3f6b35, 0.08));
            const kid = add(at(createKid(), 2, 0, 8, Math.PI));
            const m = add(at(mei(), -2, 0, 8.5, Math.PI));
            return { update: t => { purple.material.opacity = 0.25 + Math.sin(t * 2) * 0.1; walkTo(kid, 1.4, 1.5, 0.04) || shock(kid); walkTo(m, -1.4, 2, 0.04) || shock(m); } };
        }
    },
    {
        title: "14. A Line of Helpers",
        desc: "Mei runs down to the village shouting the news. Soon every builder and every neighbour is climbing the path. They form a long line, passing the heavy rice sacks from hand to hand, all the way down the mountain. Even Master Li carries a sack on his back.",
        camPos: [18, 10, 20], camLookAt: [0, 3, -2], skyColor: 0xc7d3dd, mood: 'day', ground: 0x5a7046,
        setup: () => {
            const r = makeRand(8); for (let i = 0; i < 12; i++) add(createPine(-30 + r() * 60, -14 - r() * 20, 1.2));
            add(createCave(-22, -16));
            const line = []; for (let i = 0; i < 9; i++) { const w = add(at(i === 4 ? masterLi() : (i === 7 ? mei() : worker(i)), -16 + i * 4, 0, -6 + i * 1.6, Math.PI / 2)); line.push(w); }
            const kid = add(at(createKid(), 18, 0, 8.4, -Math.PI / 2));
            const sacks = line.map(() => add(createSack(0, 0, 0.6)));
            return {
                update: t => {
                    line.forEach((w, i) => { const s = Math.sin(t * 2.5 + i * 0.7); pose(w, { la: -1.2, ra: -1.2, laz: s * 0.4, raz: s * 0.4 }); w.rotation.y = Math.PI / 2 + 0.4 - s * 0.6; const hp = new THREE.Vector3(); w.rig.rightArmGroup.children[1].getWorldPosition(hp); sacks[i].position.set(hp.x, hp.y - 0.9, hp.z); });
                    work(kid, t);
                }
            };
        }
    },
    {
        title: "15. The Sticky Rice Soup",
        desc: "Mei's grandmother takes charge. Giant iron pots bubble over crackling fires. The rice is boiled for hours, stirred and stirred, until it turns into a thick, sticky soup. It smells wonderful, says Mohamed. It is not for eating today, Grandmother Wen laughs. Today the wall eats first.",
        camPos: [8, 7, 15], camLookAt: [0, 2.5, 0], skyColor: 0xd9c8a8, mood: 'golden', ground: 0x6b8a52, sunPos: [-40, 30, 30],
        setup: () => {
            siteSet({ wz: -16 });
            const pots = [[-6, -2], [0, -2], [6, -2]].map(([x, z]) => add(createPot(x, z, 1)));
            const gw = add(at(grandmaWen(), 0, 0, 1.6, Math.PI));
            const paddle = add(group(box(0.15, 4, 0.15, 0x6a4a2a, 0, 0, 0))); paddle.position.set(0, 2.6, -1.4);
            const kid = add(at(createKid(), 3.2, 0, 3, -2.5));
            const m = add(at(mei(), -3.2, 0, 3, 2.5));
            const ws = [[-6, 1.2], [6, 1.2]].map(([x, z], i) => add(at(worker(i), x, 0, z, Math.PI)));
            return { update: t => { pose(gw, { la: -1.6 + Math.sin(t * 2) * 0.2, ra: -1.6 - Math.sin(t * 2) * 0.2 }); paddle.rotation.z = Math.sin(t * 2) * 0.35; paddle.rotation.x = Math.cos(t * 2) * 0.3; ws.forEach((w, i) => work(w, t, i)); idle(kid, t); idle(m, t, 1); if (t > 9) { gw.rig.head.rotation.y = 0.6; } } };
        }
    },
    {
        title: "16. Mixing the Mortar",
        desc: "The builders pour the rice soup into troughs of lime and stir with long paddles. The grey powder turns smooth and creamy. Mohamed squeezes a handful. It does not crumble at all. It sticks like glue. This is it, he grins. This is the secret.",
        camPos: [0, 7, 13], camLookAt: [0, 1.5, 0], skyColor: 0xd9c8a8, mood: 'golden', ground: 0x6b8a52, sunPos: [-40, 30, 30],
        setup: () => {
            siteSet({ wz: -16 });
            const tr = add(group(box(8, 1, 3, 0x6a4a2a, 0, 0.5, 0), box(7.6, 0.1, 2.6, 0xe8e4d8, 0, 1.0, 0)));
            const mix = tr.children[1]; mix.material = new THREE.MeshStandardMaterial({ color: 0xbdb6a6 });
            const ws = [[-2.5, -2.2], [2.5, -2.2]].map(([x, z], i) => add(at(worker(i + 3), x, 0, z, 0)));
            const paddles = ws.map(() => add(box(0.15, 4, 0.15, 0x6a4a2a)));
            const kid = add(at(createKid(), 0, 0, 2.6, Math.PI));
            const bucket = add(cyl(0.5, 0.4, 0.8, 0x2a2a2a, 0, 0, 0, 10));
            return {
                update: t => {
                    mix.material.color.lerpColors(new THREE.Color(0xbdb6a6), new THREE.Color(0xf2ece0), ease(t, 2, 10));
                    ws.forEach((w, i) => { work(w, t, i * 2); const hp = new THREE.Vector3(); w.rig.rightArmGroup.children[1].getWorldPosition(hp); paddles[i].position.set(hp.x, 1.8, hp.z + 0.8); paddles[i].rotation.x = Math.sin(t * 5 + i * 2) * 0.4; });
                    if (t < 4) { pose(kid, { la: -1.4, ra: -1.4, laz: 0.3, raz: -0.3 }); const hp = new THREE.Vector3(); kid.rig.rightArmGroup.children[1].getWorldPosition(hp); bucket.position.set(hp.x - 0.6, hp.y, hp.z - 0.4); bucket.rotation.x = -ease(t, 1, 3) * 1.2; }
                    else { bucket.position.set(1.6, 0.4, 2.2); bucket.rotation.x = 0; if (t > 8) cheer(kid, t); else pose(kid, { ra: -1.3, nod: 0.4 }); }
                }
            };
        }
    },
    {
        title: "17. Building It Right",
        desc: "For two days and two nights the builders work without rest. Every brick is laid in the new sticky mortar. Mohamed carries water, Mei carries bricks, and Master Li checks every row himself. On the second evening, the new section stands, solid as the mountain.",
        camPos: [16, 9, 20], camLookAt: [0, 4, -6], skyColor: 0xf2b880, mood: 'golden', ground: 0x6b8a52, sunPos: [-50, 20, 10],
        setup: () => {
            siteSet({ wz: -8, len: 54 });
            const ws = []; for (let i = 0; i < 5; i++) ws.push(add(at(worker(i), -10 + i * 5, 7.15, -8, 0)));
            const li = add(at(masterLi(), 4, 0, 1, Math.PI));
            const kid = add(at(createKid(), -6, 0, 3));
            const m = add(at(mei(), 8, 0, 4));
            const scaff = add(group()); for (let i = 0; i < 6; i++) scaff.add(box(0.2, 8, 0.2, 0x7a5a3a, -12 + i * 5, 4, -4.8)); scaff.add(box(28, 0.2, 0.2, 0x7a5a3a, 0, 6, -4.8), box(28, 0.2, 0.2, 0x7a5a3a, 0, 3, -4.8));
            return { update: t => { ws.forEach((w, i) => work(w, t, i)); pose(li, { la: -0.4, ra: -1.2, nod: -0.2 }); li.rig.head.rotation.y = Math.sin(t * 0.6) * 0.8; walkTo(kid, -6 + Math.sin(t * 0.4) * 6, 3, 0.05); walkTo(m, 8 - Math.sin(t * 0.4) * 5, 4, 0.05); } };
        }
    },
    {
        title: "18. The Storm Test",
        desc: "On the last night before the general comes, a fierce storm rolls over the mountains. Thunder booms, lightning cracks, and rain pours down the stones in rivers. Everyone holds their breath. Mohamed watches the new wall all night long. It does not move, not even one brick.",
        camPos: [10, 8, 22], camLookAt: [0, 5, -8], skyColor: 0x141c28, mood: 'night', ground: 0x3e4f3a, fog: 0.01,
        setup: () => {
            siteSet({ wz: -10, tower: true });
            add(createRain(1400, 100, 40)); add(createClouds(8, 30, 200, 6, 0x2a3240));
            const kid = add(at(createKid(), -2, 0, 6, Math.PI)); const m = add(at(mei(), 1, 0, 6.5, Math.PI));
            const lamp = add(createLantern(-0.5, 3.4, 6.4, 0xffc36b, 0.6));
            const bolt = add(box(0.3, 40, 0.3, glowMat(0xdfefff), 18, 20, -60)); bolt.visible = false;
            return { update: t => { const f = (t % 5) > 4.7; bolt.visible = f; if (f && !bolt.on) { flashScreen('#dfefff', 500); } bolt.on = f; sun.intensity = f ? 2.5 : 0.45; idle(kid, t); pose(m, { la: -1.0, laz: 0.6, ra: -0.2 }); } };
        }
    },
    {
        title: "19. The General's Visit",
        desc: "In the bright morning the general rides up the valley with his soldiers. He climbs the new wall, pushes a stone, and stamps his boot. It does not shift. The general smiles and begins to clap. Master Li places his hand on his heart, and the builders cheer.",
        camPos: [6, 9, 22], camLookAt: [0, 4, -4], skyColor: 0xbcd7ea, mood: 'bright', ground: 0x6b8a52,
        setup: () => {
            siteSet({ wz: -10 });
            const gen = add(at(general(), 0, 7.15, -9, 0));
            const horse = add(at(createHorse(0xf2efe6, 0x8a8a8a), -6, 0, 0, Math.PI / 2));
            const soldiers = [[-10, 2], [-12, -1], [8, 2]].map(([x, z]) => add(at(createPerson({ shirt: 0x8b1e2b, legs: 0x2a2a2a, skin: 0xd9a86c, hat: 'helmet', hatColor: 0x777777, belt: 0x2a1a10 }), x, 0, z, 0.2)));
            const li = add(at(masterLi(), 3, 0, 1, Math.PI));
            const kid = add(at(createKid(), 6, 0, 3.5, Math.PI)); const m = add(at(mei(), 8, 0, 4, Math.PI));
            const ws = [[-3, 4], [0, 5], [11, 4]].map(([x, z], i) => add(at(worker(i), x, 0, z, Math.PI)));
            return {
                update: t => {
                    if (t < 5) { pose(gen, { ll: Math.sin(t * 6) * 0.6 * (t < 2 ? 0 : 0), ra: -0.3 }); gen.rotation.y = 0; }
                    else if (t < 8) { gen.rig.rightLegGroup.rotation.x = -Math.abs(Math.sin(t * 4)) * 0.8; }
                    else { gen.rotation.y = lerpAngle(gen.rotation.y, 0, 0.1); clap(gen, t); }
                    if (t > 9) heart(li); else idle(li, t);
                    [kid, m, ...ws].forEach((a, i) => t > 10 ? cheer(a, t, i) : idle(a, t, i));
                    soldiers.forEach((s, i) => t > 10 ? clap(s, t, i) : idle(s, t, i));
                }
            };
        }
    },
    {
        title: "20. The Second Gem",
        desc: "As the cheering echoes off the mountains, the watch grows warm once more. An orange gem, bright as a lantern, appears beside the red one. Two gems, Mohamed whispers. Two fixes. Mei leans in to look and her mouth falls open.",
        camPos: [0, 4.6, 7.5], camLookAt: [0, 3, 0], skyColor: 0xbcd7ea, mood: 'bright', ground: 0x6b8a52, gems: 2, gemMoment: true,
        setup: () => {
            siteSet({ wz: -14 });
            const kid = add(at(createKid(), -0.7, 0, 0, 0.25)); const m = add(at(mei(), 1.6, 0, 0.2, -0.6));
            let lit = false;
            return { update: t => { if (t > 3 && !lit) { lit = true; lightGem(kid, 2); } if (t > 3) { pose(kid, { la: -1.1, laz: 0.4, nod: 0.3 }); shock(m); } else { idle(kid, t); idle(m, t, 1); } } };
        }
    },
    {
        title: "21. The Collector's Frown",
        desc: "High on a distant watchtower, a figure in a long grey coat lowers his spyglass and frowns. Two gems, he says coldly. The boy learns quickly. But I am patient. His dark watch glows, and he steps backwards into a swirl of purple light.",
        camPos: [10, 15, 20], camLookAt: [0, 11, 0], skyColor: 0xbcd7ea, mood: 'day', ground: 0x6b8a52,
        setup: () => {
            add(createWatchtower(11)); add(at(createGreatWallVista(5), 0, -2, -40));
            const col = add(at(createCollector(), 0, 11.2, 1.5, 0.6));
            const portal = add(createPortal(3, [0x7a2bd6, 0xb05cff, 0x3a0a6a, 0xe0b0ff])); portal.position.set(-1, 14.5, -2); portal.rotation.y = 0.6; portal.setPower(0);
            return { update: t => { if (t < 5) pose(col, { ra: -2.4, raz: -0.4 }); else pose(col, { la: -0.3, laz: 0.3 }); col.watch.pulse(); portal.setPower(ease(t, 8, 10)); if (t > 10) { col.position.x -= 0.02; col.position.z -= 0.04; col.visible = t < 12.5; } } };
        }
    },
    {
        title: "22. A Gift From Mei",
        desc: "The watch begins to tick faster. Mohamed knows what that means. Mei presses a little cloth bundle into his hands: rice buns, for the journey. Don't forget us, she says. Never, he promises. Through the opening ring of light he sees castle towers and fluttering banners.",
        camPos: [2, 5, 13], camLookAt: [0, 3, 0], skyColor: 0xf2b880, mood: 'golden', ground: 0x6b8a52, sunPos: [-40, 20, 20],
        setup: () => {
            siteSet({ wz: -14 });
            const kid = add(at(createKid(), 0, 0, 0, Math.PI / 2)); const m = add(at(mei(), 2.2, 0, 0, -Math.PI / 2));
            const bundle = add(box(0.6, 0.5, 0.6, 0xd1495b));
            const portal = add(createPortal(3.2)); portal.position.set(-4, 3.6, 0); portal.rotation.y = Math.PI / 2; portal.setPower(0);
            const towers = add(group(box(0.6, 1.6, 0.1, glowMat(0x8a8a9a), -0.9, 0, 0), box(0.6, 2.2, 0.1, glowMat(0x8a8a9a), 0.3, 0.3, 0), box(0.4, 0.7, 0.1, glowMat(0xc8102e), 0.3, 1.8, 0))); towers.position.set(-4.2, 3, 0); towers.rotation.y = Math.PI / 2; towers.visible = false;
            return {
                update: t => {
                    kid.watch.setPower(1 + ease(t, 1, 8) * 10); kid.watch.pulse();
                    const hp = new THREE.Vector3();
                    if (t < 5) { pose(m, { ra: -1.3, la: -1.3 }); m.rig.rightArmGroup.children[1].getWorldPosition(hp); idle(kid, t); }
                    else { pose(kid, { ra: -1.3 }); kid.rig.rightArmGroup.children[1].getWorldPosition(hp); if (t > 7) wave(m, t); else heart(m); }
                    bundle.position.copy(hp);
                    portal.setPower(ease(t, 6, 9)); towers.visible = t > 8 && t < 11;
                    if (t > 9) walkTo(kid, -3.6, 0, 0.05);
                    if (t > 10.5) { kid.scale.setScalar(Math.max(0.01, 1 - (t - 10.5) * 0.8)); bundle.visible = false; }
                }
            };
        }
    }
];

window.TRAILER = {
    open: "Across the mountains of China...",
    shots: [
        [1, 6, 3.6, "A wall like a sleeping dragon."],
        [3, 4, 3.4, "But it will not stand."],
        [4, 4, 3.2, "A new friend."],
        [7, 6, 3.4, "Something is missing."],
        [10, 7, 3.8, "And someone wants it that way."]
    ]
};
