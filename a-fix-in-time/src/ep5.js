// TITLE: The Wild West
// Episode 5 — Copper Creek, 1870s. The town's school gold is stolen from the train.

// ---------- Episode 5 props ----------
const DESERT = 0xd9a86c;
function createWesternBuilding(x, z, name, w = 8, h = 6, color = 0x9a6a42, ry = 0) {
    const g = group(box(w, h, 7, color, 0, h / 2, 0), box(w, 2.6, 0.4, color, 0, h + 1.1, 3.3));
    const sign = createSign(name, w * 0.8, 1.4, { w: 512, h: 96, bg: '#f2e2c0', fg: '#3a2414', border: '#3a2414', font: '900 58px Georgia' }); sign.position.set(0, h + 1.1, 3.55); g.add(sign);
    g.add(box(w + 1, 0.3, 3, 0x7a5232, 0, h - 0.6, 5)); [-w / 2, w / 2].forEach(xx => g.add(box(0.3, h - 0.6, 0.3, 0x6a4424, xx, (h - 0.6) / 2, 6.3)));
    g.add(box(w + 1, 0.4, 3, 0x8a6a42, 0, 0.2, 5));
    g.add(box(1.8, 3.2, 0.1, 0x3a2414, 0, 1.8, 3.52), box(1.6, 1.4, 0.1, glowMat(0xf2d29a), -w / 2 + 1.6, 3, 3.52), box(1.6, 1.4, 0.1, glowMat(0xf2d29a), w / 2 - 1.6, 3, 3.52));
    g.position.set(x, 0, z); g.rotation.y = ry; return g;
}
function createWaterTower(x, z) {
    const g = group(cyl(3, 3, 4, 0x8a5a32, 0, 9, 0, 14), cone(3.4, 1.6, 0x6a4424, 0, 11.8, 0, 14));
    [[-2, -2], [2, -2], [-2, 2], [2, 2]].forEach(([a, b]) => g.add(box(0.4, 7, 0.4, 0x6a4424, a, 3.5, b)));
    g.position.set(x, 0, z); return g;
}
function createTrack(len = 200, z = 0) {
    const g = group(box(len, 0.3, 0.3, 0x777777, 0, 0.35, z - 1.2), box(len, 0.3, 0.3, 0x777777, 0, 0.35, z + 1.2));
    for (let i = 0; i < len / 1.6; i++) g.add(box(0.6, 0.2, 3.6, 0x5a3a22, -len / 2 + i * 1.6, 0.12, z));
    return g;
}
function createSmoke(color = 0x8a8a8a) {
    const g = group(); const puffs = [];
    for (let i = 0; i < 12; i++) { const p = sph(0.8, new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.7, roughness: 1 }), 0, 0, 0, 8); p.castShadow = false; g.add(p); puffs.push(p); }
    let t = 0; g.drift = -0.15;
    addFx(() => { t += 1 / 60; puffs.forEach((p, i) => { const k = (t * 0.5 + i / 12) % 1; p.position.set(k * 10 * g.drift * 10, k * 7, Math.sin(i) * k); p.scale.setScalar(0.5 + k * 2.5); p.material.opacity = 0.7 * (1 - k); }); });
    return g;
}
function createLocomotive() {
    const g = group();
    g.add(box(10, 1, 3.4, 0x222222, 0, 1.4, 0));
    const boiler = cyl(1.5, 1.5, 7, 0x1d1d1d, 1.5, 3.4, 0, 16); boiler.rotation.z = Math.PI / 2; g.add(boiler);
    g.add(cyl(1.52, 1.52, 0.3, 0xc9a240, 3.2, 3.4, 0, 16)); g.children[g.children.length - 1].rotation.z = Math.PI / 2;
    g.add(cyl(0.5, 0.8, 2.4, 0x1d1d1d, 4, 5.8, 0, 10), cyl(0.9, 0.5, 0.6, 0x1d1d1d, 4, 7.2, 0, 10));
    g.add(box(3.6, 4, 3.6, 0x7a1f1f, -3.4, 3.8, 0), box(4, 0.3, 4, 0x1d1d1d, -3.4, 5.9, 0), box(1.6, 1.2, 0.1, glowMat(0xf2d29a), -3.4, 4.6, 1.81));
    const cc = cone(1.8, 2, mat(0x7a1f1f, { flatShading: true }), 5.8, 1.1, 0, 4); cc.rotation.z = -Math.PI / 2; g.add(cc);
    g.add(box(0.8, 0.8, 0.8, glowMat(0xffe8a0), 5.2, 4.6, 0));
    const wheels = [];
    [[-3.5, 1.0], [-1, 1.4], [1.8, 1.4], [4.2, 0.9]].forEach(([x, r]) => [-1.75, 1.75].forEach(z => { const w = cyl(r, r, 0.3, 0x7a1f1f, x, r, z, 14); w.rotation.x = Math.PI / 2; g.add(w); wheels.push(w); }));
    const smoke = createSmoke(); smoke.position.set(4, 7.6, 0); g.add(smoke);
    g.wheels = wheels; g.smoke = smoke; return g;
}
function createRailCar(color = 0x8a3a1f, label = '', open = false) {
    const g = group(box(11, 1, 3.4, 0x222222, 0, 1.4, 0), box(11, 4, 3.4, color, 0, 3.9, 0), box(11.4, 0.4, 3.8, 0x3a2414, 0, 6.1, 0));
    for (let i = 0; i < 4; i++) g.add(box(1.2, 1.2, 0.1, glowMat(0xf2d29a), -3.6 + i * 2.4, 4.4, 1.71));
    if (label) { const s = createSign(label, 5, 0.9, { w: 512, h: 90, bg: '#2a1a10', fg: '#f2c14e', border: '#f2c14e', font: '900 54px Georgia' }); s.position.set(0, 2.6, 1.78); g.add(s); }
    if (open) g.add(box(2.6, 3, 0.1, 0x1a120a, 0, 3.6, 1.72));
    const wheels = []; [-3.6, 3.6].forEach(x => [-1.75, 1.75].forEach(z => { const w = cyl(0.8, 0.8, 0.3, 0x333333, x, 0.8, z, 12); w.rotation.x = Math.PI / 2; g.add(w); wheels.push(w); }));
    g.wheels = wheels; return g;
}
// A train of engine + cars running along x (pointing +x).
function createTrain(cars = [['PASSENGERS', 0x2a5a3a], ['MAIL', 0x8a3a1f]]) {
    const g = group(); const loco = createLocomotive(); g.add(loco);
    const all = [loco];
    cars.forEach(([label, color], i) => { const c = createRailCar(color, label, label === 'MAIL'); c.position.x = -12 - i * 12; g.add(c); all.push(c); });
    g.cars = all; g.loco = loco;
    g.roll = (t, speed = 1) => all.forEach(c => c.wheels.forEach(w => w.rotation.y = -t * 4 * speed));
    return g;
}
function createMesa(x, z, w = 30, h = 14, d = 18, color = 0xb5603c) {
    const g = group(box(w, h, d, mat(color, { flatShading: true }), 0, h / 2, 0), box(w * 1.1, h * 0.35, d * 1.1, mat(0xa05030, { flatShading: true }), 0, h * 0.17, 0));
    g.add(box(w * 0.98, 0.6, d * 0.98, 0x8a4a2a, 0, h * 0.6, 0));
    g.position.set(x, 0, z); return g;
}
// Desert things sliding past to make a moving train look fast.
function createScrollingDesert(speed = 0.6) {
    const g = group(); const items = []; const r = makeRand(41);
    for (let i = 0; i < 22; i++) { const far = i % 3 === 0; const it = far ? createMesa(0, 0, 18 + r() * 14, 8 + r() * 10, 12, [0xb5603c, 0xc0704a][i % 2]) : (i % 2 ? createCactus(0, 0, 0.9 + r() * 0.5) : createRock(0, 0.6, 0, 1 + r(), 0xa07050)); it.position.set(-120 + r() * 240, it.position.y, far ? -60 - r() * 40 : (r() < 0.5 ? -8 - r() * 20 : 8 + r() * 14)); g.add(it); items.push([it, far ? 0.25 : 1]); }
    addFx(() => items.forEach(([it, k]) => { it.position.x -= speed * k; if (it.position.x < -120) it.position.x += 240; }));
    return g;
}
function createTumbleweed() {
    const g = group(); const m = mat(0x8a6a3a, { wireframe: true });
    g.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.8, 1), m), new THREE.Mesh(new THREE.IcosahedronGeometry(0.6, 0), m)); return g;
}
const sheriffClay = () => createPerson({ shirt: 0xd9c9a3, vest: 0x5a3a22, legs: 0x3a3a4a, skin: 0x8d5524, hair: 0x222222, hat: 'cowboy', hatColor: 0x6a4a2a, beard: 0x222222, belt: 0x3a2414, star: true });
const missHart = () => createPerson({ shirt: 0x7a3b6a, coat: 0x7a3b6a, legs: 0x7a3b6a, skin: 0xffdbac, hair: 0x9a5a2a, hairStyle: 'bun', belt: 0x2a1a10 });
const rosa = () => createPerson({ child: true, shirt: 0xf2c14e, legs: 0x2b4a9a, skin: 0xc68642, hair: 0x2a1a10, hairStyle: 'long', shoes: 0x5a3a22 });
const bandit = (i) => createPerson({ shirt: [0x6a5a4a, 0x4a3a3a, 0x5a5a6a][i % 3], vest: 0x2a2a2a, legs: 0x3a3028, skin: SKINS[(i + 1) % 7], hat: 'cowboy', hatColor: [0x2a2a2a, 0x3a2414, 0x4a4a4a][i % 3], belt: 0x2a1a10 });
function mask(a, color = 0xb33a3a) { a.rig.head.add(box(1.24, 0.5, 0.2, color, 0, -0.32, 0.58)); return a; }
const townKid = (i) => createPerson({ child: true, shirt: [0x2b6aa8, 0xc8461a, 0x6a8a2a, 0xf2ead8][i % 4], legs: [0x5a4a3a, 0x2a2a3a][i % 2], skin: SKINS[(i + 2) % 7], hair: [0x2a1a10, 0xc9862f, 0x111111][i % 3], hairStyle: i % 2 ? 'long' : 'short', hat: i % 3 === 0 ? 'cap' : null, hatColor: 0x6a4a2a });
const townsperson = (i) => createPerson({ shirt: [0xf2ead8, 0x8a6a4a, 0x2b4a7a, 0xa04a3a][i % 4], vest: i % 2 ? 0x3a2414 : null, legs: 0x3a3a4a, skin: SKINS[i % 7], hat: i % 2 ? 'cowboy' : 'cap', hatColor: [0x8a6a3a, 0x3a2414][i % 2], hair: 0x2a1a10, beard: i % 3 === 0 ? 0x3a2414 : null });
function townSet() {
    add(createWesternBuilding(-20, -10, 'GENERAL STORE', 9, 6, 0x9a6a42));
    add(createWesternBuilding(-9, -10, 'BANK', 8, 7, 0x8a8a7a));
    add(createWesternBuilding(2, -10, 'SHERIFF', 7, 5.5, 0x7a5232));
    add(createWesternBuilding(13, -10, 'HOTEL', 9, 8, 0xa05a3a));
    add(createWaterTower(26, -8));
    add(createMesa(-40, -90, 50, 22, 30)); add(createMesa(50, -110, 60, 28, 30, 0xc0704a));
}

// ---------- Story ----------
const storyData = [
    {
        title: "1. Dust and Tumbleweeds",
        desc: "Hot wind and bright sunshine. Mohamed lands on a dusty road between wooden buildings with tall painted fronts. A tumbleweed rolls past his sneakers. A horse snorts. Somewhere, a piano is playing. He looks down at his watch. Four gems. And now, the Wild West.",
        camPos: [0, 5, 18], camLookAt: [0, 3, -4], skyColor: 0xf2d3a0, mood: 'golden', ground: DESERT, sunPos: [-40, 40, 30],
        setup: () => {
            townSet();
            const kid = add(at(createKid(), 0, 0, 3, Math.PI));
            const tw = add(createTumbleweed()); const portal = add(createPortal(2.5)); portal.position.set(0, 3, 3); portal.setPower(1);
            const horse = add(at(createHorse(0x8a5a32), -10, 0, 0, Math.PI / 2));
            return { update: t => { portal.setPower(1 - ease(t, 0.3, 2)); tw.position.set(-18 + t * 2.2, 0.8 + Math.abs(Math.sin(t * 4)) * 0.6, 6); tw.rotation.z = -t * 3; horse.rig = null; if (t < 2) shock(kid); else { idle(kid, t); kid.rig.head.rotation.y = Math.sin(t * 0.8) * 0.7; } if (t > 7) pose(kid, { la: -1.1, laz: 0.4, nod: 0.3 }); } };
        }
    },
    {
        title: "2. Copper Creek",
        desc: "This is Copper Creek, a little town in the American West, about one hundred and fifty years ago. There is a general store, a bank, a sheriff's office, a hotel, and a railway line that runs right through the middle of town. Beyond it, red rocky mesas glow in the sun.",
        camPos: [30, 18, 34], camLookAt: [0, 4, -6], skyColor: 0xf2d3a0, mood: 'golden', ground: DESERT, sunPos: [-40, 40, 30],
        setup: () => {
            townSet(); add(createTrack(200, 14));
            const ps = [0, 1, 2, 3].map(i => add(at(townsperson(i), -16 + i * 9, 0, 0, i % 2 ? Math.PI / 2 : -Math.PI / 2)));
            for (let i = 0; i < 6; i++) add(createCactus(-30 + i * 12, 26 + (i % 2) * 6, 1));
            return { update: t => ps.forEach((p, i) => { walkTo(p, p.position.x + (i % 2 ? 1 : -1), 0, 0.03); if (Math.abs(p.position.x) > 26) p.position.x *= -0.95; }) };
        }
    },
    {
        title: "3. The Leaky Schoolhouse",
        desc: "At the end of the street is a tiny wooden schoolhouse. Its roof has holes, and rain buckets sit between the desks. A teacher named Miss Hart waves Mohamed inside. A girl called Rosa makes room for him on her bench. We are getting a brand new school soon, she whispers proudly.",
        camPos: [0, 7, 14], camLookAt: [0, 2.5, -2], skyColor: 0x2a2018, mood: 'indoor', ground: false,
        setup: () => {
            add(createRoom({ w: 22, d: 16, h: 9, wall: 0xa07a52, floor: 0x7a5a3a, trim: 0x5a3a22 }));
            add(box(8, 4, 0.2, 0x1f2a22, 0, 4.5, -7.6));
            const chalk = add(createSign('A B C  1 2 3', 7, 1.2, { w: 512, h: 90, bg: '#1f2a22', fg: '#f2f2f2', border: null, font: '700 52px Georgia' })); chalk.position.set(0, 5, -7.45);
            for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) add(createTable(-5 + c * 5, -1 + r * 4, 3.6, 1.4, 1.8, 0x7a5232));
            const buckets = [[-2.5, 1], [3, -2.6]].map(([x, z]) => add(cyl(0.45, 0.35, 0.7, 0x777777, x, 0.35, z, 10)));
            const drips = buckets.map(b => add(box(0.08, 0.3, 0.08, glowMat(0x9fdcff), b.position.x, 8, b.position.z)));
            const teacher = add(at(missHart(), 0, 0, -5.5, 0));
            const kid = add(at(createKid(), 1.4, 0, 4.2, Math.PI)); const ro = add(at(rosa(), -0.6, 0, 4.2, Math.PI));
            const others = [[-5, 0.4], [5, 0.4], [-5, 4.4]].map(([x, z], i) => add(at(townKid(i), x, 0, z + 0.8, Math.PI)));
            return { update: t => { drips.forEach((d, i) => { d.position.y = 8 - ((t * 6 + i * 3) % 7.6); }); if (t < 5) wave(teacher, t); else idle(teacher, t); ro.rig.head.rotation.y = t > 6 ? -0.7 : 0; idle(kid, t); kid.rig.head.rotation.y = t > 6 ? 0.6 : 0; idle(ro, t, 1); others.forEach((o, i) => idle(o, t, i)); } };
        }
    },
    {
        title: "4. The School Gold",
        desc: "For years the whole town has saved for a new school, a few coins at a time. Today the strongbox of gold goes on the noon train to the city, to buy timber, bricks and books. Miss Hart lifts the lid to show the children. The coins glitter like sunshine. Rosa's eyes shine even brighter.",
        camPos: [0, 5, 8], camLookAt: [0, 2.4, 0], skyColor: 0x2a2018, mood: 'indoor', ground: false,
        setup: () => {
            add(createRoom({ w: 22, d: 16, h: 9, wall: 0xa07a52, floor: 0x7a5a3a, trim: 0x5a3a22 }));
            add(createTable(0, 0, 4, 2, 1.8, 0x7a5232));
            const sb = add(group(box(1.8, 1, 1.2, 0x3a2414, 0, 0.5, 0), box(1.9, 0.12, 1.25, 0x777777, 0, 0.9, 0))); sb.position.set(0, 1.9, 0);
            const lid = add(box(1.8, 0.3, 1.2, 0x3a2414, 0, 0, 0));
            const coins = []; for (let i = 0; i < 14; i++) coins.push(add(cyl(0.16, 0.16, 0.05, mat(0xffd34d, { metalness: 0.9, roughness: 0.2, emissive: 0x3a2a00 }), (i % 5 - 2) * 0.3, 2.95 + Math.floor(i / 5) * 0.06, ((i * 7) % 3 - 1) * 0.3, 12)));
            const shine = add(createGlow(0xffd34d, 0.1, 0.6)); shine.position.set(0, 3.2, 0);
            const teacher = add(at(missHart(), 0, 0, -2, 0)); const kid = add(at(createKid(), 1.6, 0, 2.2, Math.PI - 0.4)); const ro = add(at(rosa(), -1.6, 0, 2.2, Math.PI + 0.4));
            return { update: t => { const k = ease(t, 2, 4); lid.position.set(0, 2.95 + k * 0.6, -0.6 * k); lid.rotation.x = -k * 1.4; shine.scale.setScalar(0.1 + k * 4); pose(teacher, { la: -1.2, ra: -1.2 }); if (t > 4) { shock(ro); pose(kid, { nod: 0.3 }); } else { idle(ro, t); idle(kid, t); } } };
        }
    },
    {
        title: "5. Sheriff Clay",
        desc: "Sheriff Amos Clay, with a silver star on his vest, carries the strongbox to the station himself and locks it in the mail car. Mohamed asks if he can ride along. The sheriff looks at his strange hoodie and raises an eyebrow. All right, son. But keep your eyes open. Trains attract trouble.",
        camPos: [6, 6, 18], camLookAt: [0, 3, 6], skyColor: 0xf2d3a0, mood: 'golden', ground: DESERT, sunPos: [-40, 40, 30],
        setup: () => {
            add(createTrack(200, 0)); const tr = add(createTrain()); tr.position.x = 10;
            add(box(30, 1, 5, 0x7a5232, 0, 0.5, 5)); add(createWesternBuilding(-2, -12, 'STATION', 10, 5, 0x8a6a42, 0));
            const sh = add(at(sheriffClay(), -6, 1, 5, Math.PI / 2)); const kid = add(at(createKid(), -3, 1, 6.8, -Math.PI / 2 + 0.3)); const ro = add(at(rosa(), -1.4, 1, 7.4, -Math.PI / 2));
            const sb = add(box(1.8, 1, 1.2, 0x3a2414));
            return { update: t => { tr.roll(0); if (t < 5) { walkTo(sh, -14, 4, 0.04); sh.rotation.y = Math.PI * 1.5; carry(sh); } else { face(sh, kid.position.x, kid.position.z); idle(sh, t); } const hp = new THREE.Vector3(); sh.rig.rightArmGroup.children[1].getWorldPosition(hp); sb.position.set(t < 5 ? hp.x - 0.3 : -15.5, t < 5 ? hp.y : 3, t < 5 ? hp.z + 0.4 : 1.6); if (t > 7) pose(kid, { ra: -2.7 }); else idle(kid, t); idle(ro, t, 1); } };
        }
    },
    {
        title: "6. Behind the Water Tower",
        desc: "While the train takes on water, Mohamed spots three men in dusty coats and bandanas whispering behind the water tower. And with them, in a grey coat and a dark hat, is a man he knows too well. Silver coins clink from one hand to another. Then the three men slip away to their horses.",
        camPos: [14, 6, 14], camLookAt: [26, 4, -8], skyColor: 0xf2d3a0, mood: 'golden', ground: DESERT, sunPos: [-40, 40, 30],
        setup: () => {
            townSet();
            const col = add(at(createCollector({ hat: 'cowboy', hatColor: 0x2b2d31 }), 27, 0, -13, 0.2));
            const bs = [0, 1, 2].map(i => add(at(bandit(i), 24 + i * 2.2, 0, -10.6, Math.PI - 0.3 + i * 0.3)));
            const kid = add(at(createKid(), 18, 0, -3, 2.6)); kid.inner.position.y = -0.6;
            const coins = add(createBurst(0xd8d8e0, 20, 0.02)); coins.position.set(26, 3, -12);
            return { update: t => { col.watch.pulse(); if (t < 6) pose(col, { ra: -1.3 }); else idle(col, t); if (t > 4 && !coins.f) { coins.f = 1; coins.fire(); } bs.forEach((b, i) => { if (t > 9) walkTo(b, 40, -14 + i, 0.07); else pose(b, { la: -0.3, ra: i === 1 ? -1.2 : -0.3 }); }); pose(kid, { ll: -0.8, rl: -0.8 }); kid.rig.head.rotation.y = 0.2; } };
        }
    },
    {
        title: "7. All Aboard",
        desc: "The whistle screams. With a hiss of steam and a great clank, the train pulls out of Copper Creek. Mohamed sits beside Sheriff Clay in the carriage, and tells him what he saw. The sheriff's face goes serious. He checks his hat, and pulls the window open to watch the desert.",
        camPos: [24, 9, 30], camLookAt: [4, 4, 0], skyColor: 0xf2d3a0, mood: 'golden', ground: DESERT, sunPos: [-40, 40, 30],
        setup: () => {
            add(createTrack(300, 0)); const tr = add(createTrain());
            add(box(30, 1, 5, 0x7a5232, -30, 0.5, 5));
            const ps = [0, 1, 2].map(i => add(at(i === 2 ? missHart() : (i === 1 ? rosa() : townsperson(i)), -30 + i * 3, 1, 5.5, 0)));
            const steam = add(createGlow(0xffffff, 6, 0.5)); steam.position.set(4, 1.5, 2.5);
            return { update: t => { const x = Math.pow(Math.max(0, t - 1), 1.5) * 0.15; tr.position.x = x; tr.roll(x / 2); steam.material.opacity = Math.max(0, 0.5 - t * 0.05); ps.forEach((p, i) => wave(p, t + i)); } };
        }
    },
    {
        title: "8. Across the Desert",
        desc: "The train races across the open desert. Cactus and red rocks flash past the windows, and the engine's smoke streams back like a long grey scarf. Mohamed presses his face to the glass. It is the most beautiful place he has ever seen. But his watch has started ticking faster.",
        camPos: [16, 7, 24], camLookAt: [-4, 4, 0], skyColor: 0xf6c890, mood: 'golden', ground: DESERT, sunPos: [-40, 30, 30],
        setup: () => {
            add(createScrollingDesert(0.7)); const tracks = add(createTrack(300, 0));
            const tr = add(createTrain());
            const face1 = add(at(createKid(), -14.3, 1.3, 1.1, 0)); face1.scale.setScalar(0.7);
            return { update: t => { tr.roll(t, 2); tracks.position.x = -((t * 42) % 1.6); face1.position.y = 1.3 + Math.sin(t * 9) * 0.05; tr.position.y = Math.abs(Math.sin(t * 9)) * 0.04; } };
        }
    },
    {
        title: "9. Riders on the Ridge",
        desc: "Three riders appear on the ridge, bandanas pulled up over their faces. They kick their horses into a gallop and charge down the slope towards the train. The sheriff shouts: Everybody down! The riders pull alongside the mail car, and one leaps right onto the roof.",
        camPos: [18, 8, 24], camLookAt: [-8, 4, 0], skyColor: 0xf6c890, mood: 'golden', ground: DESERT, sunPos: [-40, 30, 30],
        setup: () => {
            add(createScrollingDesert(0.7)); const tracks = add(createTrack(300, 0)); const tr = add(createTrain());
            const riders = [0, 1, 2].map(i => { const b = mask(bandit(i)); const h = createHorse([0x4a3020, 0x8a5a32, 0x2a2a2a][i]); const g = add(mount(b, h)); g.rotation.y = Math.PI / 2; g.rider = b; g.horse = h; return g; });
            return { update: t => { tr.roll(t, 2); tracks.position.x = -((t * 42) % 1.6); riders.forEach((r, i) => { const k = ease(t, 0, 8); r.position.set(-30 + i * 4 + k * 8, 0, 24 - k * 18 + i * 2.5); r.horse.gallop(t, 1.3); }); if (t > 9) { const r = riders[0]; r.rider.position.set(0, 2.4 + ease(t, 9, 10) * 4, -ease(t, 9, 10) * 3.4); } } };
        }
    },
    {
        title: "10. The Strongbox Is Gone",
        desc: "It happens in a flash. The robbers break open the mail car, heave out the strongbox, and drop it onto a waiting horse. Nobody is hurt, but by the time the sheriff reaches the back of the train, the three riders are galloping away across the desert, with the school's gold.",
        camPos: [10, 6, 20], camLookAt: [-20, 3, 4], skyColor: 0xf6c890, mood: 'golden', ground: DESERT, sunPos: [-40, 30, 30],
        setup: () => {
            add(createScrollingDesert(0.2)); add(createTrack(300, 0)); const tr = add(createTrain());
            const sh = add(at(sheriffClay(), -16, 1.5, 2.6, -Math.PI / 2 + 0.6)); const kid = add(at(createKid(), -13.8, 1.5, 2.6, -Math.PI / 2 + 0.4));
            const riders = [0, 1, 2].map(i => { const b = mask(bandit(i)); const h = createHorse([0x4a3020, 0x8a5a32, 0x2a2a2a][i]); const g = add(mount(b, h)); g.rotation.y = -Math.PI / 2 - 0.7; g.horse = h; return g; });
            const box1 = add(box(1.8, 1, 1.2, 0x3a2414));
            return { update: t => { tr.roll(t, 0.3 * (1 - ease(t, 0, 5))); riders.forEach((r, i) => { r.position.set(-26 - t * 2 - i * 3, 0, 6 + t * 1.6 + i * 2); r.horse.gallop(t); }); box1.position.set(riders[1].position.x + 0.5, 4.2, riders[1].position.z); point(sh, t); if (t > 3) shock(kid); else idle(kid, t); } };
        }
    },
    {
        title: "11. The Chase Begins",
        desc: "The sheriff pulls the emergency brake. The train screeches to a stop. He throws open the stock car, leads out his tall black horse, and swings into the saddle. Then he looks down at Mohamed. Well? You coming? Mohamed grabs his hand, and up he goes. Hold on tight!",
        camPos: [10, 6, 16], camLookAt: [0, 3, 2], skyColor: 0xf6c890, mood: 'golden', ground: DESERT, sunPos: [-40, 30, 30],
        setup: () => {
            add(createTrack(300, 0)); const tr = add(createTrain([['PASSENGERS', 0x2a5a3a], ['MAIL', 0x8a3a1f], ['HORSES', 0x6a5a3a]])); tr.position.x = 30;
            add(createMesa(-30, -60, 50, 20, 30));
            const h = add(at(createHorse(0x1d1d1d, 0x111111), -4, 0, 5, Math.PI / 2));
            const sh = add(at(sheriffClay(), -6, 0, 6.5, Math.PI / 2)); const kid = add(at(createKid(), -3, 0, 8, Math.PI));
            return { update: t => { if (t < 5) { idle(sh, t); } else { sh.position.set(h.position.x, 2.4, h.position.z); sh.rotation.y = Math.PI / 2; pose(sh, { ll: -1.2, rl: -1.2, ra: t < 8 ? -1.2 : -0.6 }); } if (t > 8) { kid.position.set(h.position.x - 1.4, 2.4, h.position.z); kid.rotation.y = Math.PI / 2; pose(kid, { ll: -1.2, rl: -1.2, la: -1.1, ra: -1.1 }); } else if (t > 6) pose(kid, { ra: -2.2 }); else idle(kid, t); if (t > 10) { h.position.x += 0.08; h.gallop(t); sh.position.x = h.position.x; kid.position.x = h.position.x - 1.4; } } };
        }
    },
    {
        title: "12. Hoofprints in the Sand",
        desc: "They follow the hoofprints across the sand. The tracks lead towards Snake Canyon, a winding maze of red rock. Then Mohamed sees it, far ahead on the canyon wall: a faint purple flicker. The Collector is waiting for the gold at the end of the canyon. If the robbers get there first, it will be gone forever.",
        camPos: [12, 7, 20], camLookAt: [0, 4, -10], skyColor: 0xf6b880, mood: 'golden', ground: DESERT, sunPos: [-40, 30, 30],
        setup: () => {
            add(createMesa(-24, -40, 30, 20, 24)); add(createMesa(24, -44, 30, 22, 24, 0xc0704a));
            for (let i = 0; i < 14; i++) add(box(0.5, 0.05, 0.7, 0x8a6a42, Math.sin(i * 0.6) * 2, 0.03, 10 - i * 3));
            const purple = add(createGlow(0xa04cff, 6, 0.6)); purple.position.set(0, 8, -60);
            const h = add(createHorse(0x1d1d1d, 0x111111)); const sh = sheriffClay(); const kid = createKid();
            const rider = add(group(h, sh, kid)); rider.position.set(4, 0, 14); rider.rotation.y = Math.PI;
            sh.position.set(0, 2.4, 0); kid.position.set(0, 2.4, -1.4); pose(sh, { ll: -1.2, rl: -1.2, la: -0.6, ra: -0.6 });
            return { update: t => { h.gallop(t, 0.6); rider.position.z = 14 - t * 0.5; purple.material.opacity = 0.4 + Math.sin(t * 3) * 0.3; if (t > 6) point(kid, t); else pose(kid, { ll: -1.2, rl: -1.2, la: -1.1, ra: -1.1 }); } };
        }
    },
    {
        title: "13. Mohamed's Shortcut",
        desc: "Mohamed notices something. The canyon bends in a giant loop, like a horseshoe. If we ride over that ridge, he says, we can get to the far end before them. The sheriff grins. Son, you would make a fine scout. He turns the horse up the steep, rocky slope.",
        camPos: [0, 30, 40], camLookAt: [0, 0, 0], skyColor: 0xf6b880, mood: 'golden', ground: 0xb5603c, sunPos: [-40, 30, 30],
        setup: () => {
            add(createMesa(0, 0, 26, 12, 20, 0xc0704a));
            const path = []; for (let i = 0; i <= 40; i++) { const a = Math.PI * (i / 40); path.push([Math.cos(a) * 22, -Math.sin(a) * 18 + 10]); }
            path.forEach(([x, z]) => add(box(2.4, 0.06, 2.4, 0xe0b080, x, 0.04, z)));
            const dots = [0, 1, 2].map(i => add(sph(0.6, 0x2a2a2a, 0, 1, 0, 8)));
            const us = add(sph(0.7, 0xc8102e, 0, 1, 0, 8)); const marker = add(createGlow(0xffffff, 3, 0.6));
            return { update: t => { dots.forEach((d, i) => { const k = Math.min(40, Math.floor(t * 1.6) + i); const p = path[k] || path[40]; d.position.set(p[0], 1, p[1]); }); const k = ease(t, 3, 14); us.position.set(lerp(-22, 22, k), 1 + Math.sin(k * Math.PI) * 12, lerp(10, 10, k) - Math.sin(k * Math.PI) * 4); marker.position.copy(us.position); } };
        }
    },
    {
        title: "14. Over the Ridge",
        desc: "The black horse scrambles up the slope, stones clattering away beneath its hooves. Mohamed clings to the sheriff's vest with his eyes squeezed shut. At the top they see the whole canyon below, and the three robbers still winding through it, slow and heavy with their stolen box.",
        camPos: [16, 18, 24], camLookAt: [0, 10, 0], skyColor: 0xf6b880, mood: 'golden', ground: 0xb5603c, sunPos: [-40, 30, 30],
        setup: () => {
            const slope = add(box(30, 2, 30, mat(0xc0704a, { flatShading: true }), 0, 5, 0)); slope.rotation.z = 0.35;
            add(createMesa(-30, -30, 30, 18, 24)); for (let i = 0; i < 6; i++) add(createRock(-8 + i * 3, 6 + i * 1.1, 6, 0.8, 0xa05030));
            const h = createHorse(0x1d1d1d, 0x111111); const sh = sheriffClay(); const kid = createKid();
            const rider = add(group(h, sh, kid)); rider.rotation.y = -Math.PI / 2; sh.position.set(0, 2.4, 0); kid.position.set(0, 2.4, -1.4);
            pose(sh, { ll: -1.2, rl: -1.2, la: -0.6, ra: -0.6 }); pose(kid, { ll: -1.2, rl: -1.2, la: -1.1, ra: -1.1, nod: 0.3 });
            const pebbles = add(createBurst(0x8a5030, 40, 0.06));
            return { update: t => { const k = ease(t, 0, 12); rider.position.set(lerp(12, -8, k), 4 + 4.2 + lerp(4, -3.2, k) * 0 + (lerp(12, -8, k)) * -0.36, 6); rider.rotation.z = -0.35; h.gallop(t, 0.7); if ((t % 2) < 0.02) { pebbles.position.copy(rider.position); pebbles.fire(); } } };
        }
    },
    {
        title: "15. The Rope Across the Canyon",
        desc: "At the canyon's narrow end they jump down and stretch a rope low across the path, from rock to rock. Not to hurt anyone, Mohamed says. Just to stop the horses. They hide behind a boulder. Hoofbeats echo off the walls. Here they come.",
        camPos: [3, 8, 26], camLookAt: [0, 2, 3], skyColor: 0xf6b880, mood: 'golden', ground: 0xb5603c, sunPos: [-40, 30, 30],
        setup: () => {
            add(createMesa(-16, -6, 18, 16, 30)); add(createMesa(16, -6, 18, 16, 30, 0xc0704a));
            const rope = add(createRope([-7, 1.4, 4], [7, 1.4, 4], 0x8a6a3a, 0.08)); rope.scale.set(1, 0.01, 1);
            add(createRock(-7, 0.8, 4, 1, 0xa05030)); add(createRock(7, 0.8, 4, 1, 0xa05030)); add(createRock(4, 1.5, 7, 2, 0xa05030));
            const sh = add(at(sheriffClay(), -6, 0, 5, Math.PI / 2)); const kid = add(at(createKid(), 6, 0, 5, -Math.PI / 2));
            return { update: t => { rope.scale.y = Math.max(0.01, ease(t, 1, 6)); rope.position.x = -7 + 7 * ease(t, 1, 6); if (t < 6) { carry(sh); idle(kid, t); } else { walkTo(sh, 3, 8, 0.06); walkTo(kid, 5, 8.5, 0.06) || (kid.inner.position.y = -0.8, pose(kid, { ll: -1, rl: -1 })); if (sh.position.distanceTo(new THREE.Vector3(3, 0, 8)) < 0.5) { sh.inner.position.y = -0.8; pose(sh, { ll: -1, rl: -1 }); } } } };
        }
    },
    {
        title: "16. Caught!",
        desc: "The robbers' horses see the rope and skid to a stop. The three men tumble out of their saddles into a soft bank of sand, coughing and spluttering. Before they can stand up, Sheriff Clay is there. Hands where I can see them, boys. The school gold is going home.",
        camPos: [3, 8, 26], camLookAt: [0, 2, 3], skyColor: 0xf6b880, mood: 'golden', ground: 0xb5603c, sunPos: [-40, 30, 30],
        setup: () => {
            add(createMesa(-16, -6, 18, 16, 30)); add(createMesa(16, -6, 18, 16, 30, 0xc0704a));
            add(createRope([-7, 1.4, 4], [7, 1.4, 4], 0x8a6a3a, 0.08));
            const sand = add(sph(4, mat(0xe0b080, { flatShading: true }), 0, -1.6, 7.5, 8)); sand.scale.y = 0.6;
            const horses = [0, 1, 2].map(i => add(at(createHorse([0x4a3020, 0x8a5a32, 0x2a2a2a][i]), -3 + i * 3, 0, -2, 0)));
            const bs = [0, 1, 2].map(i => add(at(mask(bandit(i)), -2.4 + i * 2.4, 0.4, 8, Math.PI)));
            const sh = add(at(sheriffClay(), 6, 0, 12, -2.4)); const kid = add(at(createKid(), 8, 0, 10, -2));
            const sb = add(box(1.8, 1, 1.2, 0x3a2414, 0, 0.5, 2.5));
            return { update: t => { horses.forEach((h, i) => { if (t < 2) { h.position.z = -10 + t * 4; h.gallop(t); } else { h.stand(); h.rotation.x = -Math.min(0.3, (t - 2) * 0.6) * (t < 3 ? 1 : 0); } }); bs.forEach((b, i) => { if (t < 3) { b.visible = t > 2; b.rotation.x = -1.2; b.position.y = 1.4 - (t - 2) * 1.2; } else { b.rotation.x = lerp(-1.2, 0, ease(t, 6, 8)); b.position.y = 0.4; if (t > 8) pose(b, { la: -2.9, ra: -2.9 }); } }); if (t > 4) { walkTo(sh, 3, 11, 0.06) || point(sh, t); } else idle(sh, t); if (t > 9) { walkTo(kid, 0.6, 3.6, 0.05) || carry(kid); } else idle(kid, t); } };
        }
    },
    {
        title: "17. A Purple Flash",
        desc: "At the very end of the canyon, a swirl of purple light opens, and the man in the grey coat steps out, expecting gold. Instead, he sees his robbers sitting in the sand and Mohamed holding the strongbox. His face twists. Five, he whispers. You are making this very hard, boy. The light swallows him again.",
        camPos: [3, 10, 25], camLookAt: [0, 3, -4], skyColor: 0xf6a870, mood: 'dusk', ground: 0xb5603c, sunPos: [-40, 20, 30],
        setup: () => {
            add(createMesa(-16, -10, 18, 16, 30)); add(createMesa(16, -10, 18, 16, 30, 0xc0704a));
            const portal = add(createPortal(3, [0x7a2bd6, 0xb05cff, 0x3a0a6a, 0xe0b0ff])); portal.position.set(0, 4, -6); portal.setPower(0);
            const col = add(at(createCollector({ hat: 'cowboy', hatColor: 0x2b2d31 }), 0, 0, -6, 0));
            const kid = add(at(createKid(), 1.4, 0, 6, Math.PI)); const sb = add(box(1.8, 1, 1.2, 0x3a2414));
            const sh = add(at(sheriffClay(), -2.4, 0, 6.6, Math.PI));
            return { update: t => { portal.setPower(ease(t, 0, 2) * (1 - ease(t, 12, 14))); col.visible = t > 1.5 && t < 12.5; if (t < 3) col.position.z = -6 + t; col.watch.pulse(); if (t > 5) pose(col, { la: -0.6, ra: -0.6, laz: -0.3, raz: 0.3 }); if (t > 10) col.position.z -= 0.05; carry(kid); const hp = new THREE.Vector3(); kid.rig.rightArmGroup.children[1].getWorldPosition(hp); sb.position.set(kid.position.x, hp.y + 0.2, kid.position.z + 0.6); idle(sh, t); } };
        }
    },
    {
        title: "18. Back to Copper Creek",
        desc: "As the sun sets, the sheriff rides back into town with three sorry-looking robbers behind him and the strongbox safe in front. The whole town pours into the street. Rosa runs to meet Mohamed, and Miss Hart cries happy tears. Everyone claps and cheers.",
        camPos: [0, 8, 24], camLookAt: [0, 3, -2], skyColor: 0xe88a5a, mood: 'dusk', ground: DESERT, sunPos: [-40, 15, 30],
        setup: () => {
            townSet();
            const h = add(createHorse(0x1d1d1d, 0x111111)); const sh = sheriffClay(); const rider = add(group(h, sh)); sh.position.set(0, 2.4, 0); pose(sh, { ll: -1.2, rl: -1.2, ra: -2.6 }); rider.position.set(-6, 0, 2); rider.rotation.y = Math.PI / 2;
            const bs = [0, 1, 2].map(i => add(at(bandit(i), -12 - i * 2, 0, 2.2, Math.PI / 2)));
            const kid = add(at(createKid(), -2, 0, 4, Math.PI / 2)); const ro = add(at(rosa(), 6, 0, 4, -Math.PI / 2)); const hart = add(at(missHart(), 8, 0, 1, -Math.PI / 2));
            const crowd = [0, 1, 2, 3].map(i => add(at(townsperson(i), -10 + i * 6, 0, -2.5, 0)));
            return { update: t => { h.gallop(t, 0.2); rider.position.x = -6 + Math.min(t, 6) * 0.6; bs.forEach((b, i) => { b.position.x = -12 - i * 2 + Math.min(t, 6) * 0.6; pose(b, { nod: 0.4 }); }); walkTo(ro, -0.4, 4, 0.08) || shake(ro, t); if (ro.position.x < 0) shake(kid, t); else idle(kid, t); crowd.forEach((c, i) => i % 2 ? clap(c, t, i) : cheer(c, t, i)); clap(hart, t); } };
        }
    },
    {
        title: "19. Raising the New School",
        desc: "Next morning the whole town gets to work. The timber arrives, and frame by frame a brand new schoolhouse rises. Mohamed holds boards while the sheriff hammers. Rosa paints the sign. By evening the bell is hanging in its little tower, ready to ring.",
        camPos: [12, 9, 22], camLookAt: [0, 4, 0], skyColor: 0xf2d3a0, mood: 'golden', ground: DESERT, sunPos: [-40, 40, 30],
        setup: () => {
            const frame = add(group()); for (let i = 0; i < 6; i++) { frame.add(box(0.4, 7, 0.4, 0xc0904a, -6 + i * 2.4, 3.5, -4), box(0.4, 7, 0.4, 0xc0904a, -6 + i * 2.4, 3.5, 4)); }
            frame.add(box(12.4, 0.4, 0.4, 0xc0904a, 0, 7, -4), box(12.4, 0.4, 0.4, 0xc0904a, 0, 7, 4));
            const walls = add(group(box(12.4, 7, 8, 0xd8b88a, 0, 3.5, 0), cone(7.6, 3.4, mat(0xa04a3a, { flatShading: true }), 0, 8.7, 0, 4), box(1.6, 2.2, 1.6, 0xf2ead8, 0, 11, 0), cyl(0.5, 0.7, 0.8, mat(0xc9a240, { metalness: 0.8 }), 0, 11, 0, 10))); walls.children[1].rotation.y = Math.PI / 4;
            const sign = add(createSign('COPPER CREEK SCHOOL', 9, 1.2, { w: 1024, h: 120, bg: '#f2ead8', fg: '#7a1f2b', border: '#3a2414', font: '900 70px Georgia' })); sign.position.set(0, 5.6, 4.2);
            const sh = add(at(sheriffClay(), -4, 0, 6.5, Math.PI)); const kid = add(at(createKid(), -2, 0, 6.5, Math.PI)); const ro = add(at(rosa(), 3, 0, 6.8, Math.PI));
            const helpers = [0, 1].map(i => add(at(townsperson(i), 8 + i * 2, 0, 3, -Math.PI / 2)));
            return { update: t => { const k = ease(t, 2, 12); walls.scale.y = Math.max(0.01, k); walls.visible = k > 0.01; sign.visible = k > 0.95; work(sh, t); carry(kid); pose(ro, { ra: -2 + Math.sin(t * 5) * 0.4 }); helpers.forEach((h, i) => work(h, t, i)); if (t > 14) { cheer(kid, t); cheer(ro, t, 1); } } };
        }
    },
    {
        title: "20. The Fifth Gem",
        desc: "When the school bell rings for the very first time, Mohamed's watch answers it with a ring of its own. A gem the colour of the summer sky lights up beside the others. Five, he says. Only two to go. Rosa whistles. That is better than a sheriff's star.",
        camPos: [0, 4.6, 7.5], camLookAt: [0, 3, 0], skyColor: 0xf2d3a0, mood: 'golden', ground: DESERT, sunPos: [-40, 40, 30], gems: 5, gemMoment: true,
        setup: () => {
            townSet();
            const kid = add(at(createKid(), -0.7, 0, 0, 0.25)); const ro = add(at(rosa(), 1.6, 0, 0.2, -0.6));
            let lit = false;
            return { update: t => { if (t > 3 && !lit) { lit = true; lightGem(kid, 5); } if (t > 3) { pose(kid, { la: -1.1, laz: 0.4, nod: 0.3 }); shock(ro); } else { idle(kid, t); idle(ro, t, 1); } } };
        }
    },
    {
        title: "21. Under the Stars",
        desc: "Far out in the desert night, the man in grey sits alone beside a cold, dark rock. His purple watch is covered in cracks now, and it flickers like a dying candle. Up above, the moon shines bright and silver. He looks up at it, and slowly, he smiles. The moon, he whispers. Nobody can fix anything on the moon.",
        camPos: [6, 4.5, 11], camLookAt: [0, 4, 0], skyColor: 0x0a1028, mood: 'night', ground: 0x6a4a3a, sunPos: [20, 40, -30],
        setup: () => {
            add(createStars(900)); add(createSkyDisk(0xf2f2ff, 8, 30, 60, -150)); add(createMesa(-30, -50, 40, 16, 24, 0x5a3a3a));
            add(createRock(-1.6, 0.8, -0.6, 1.6, 0x5a4a4a));
            const col = add(at(createCollector({ hat: 'cowboy', hatColor: 0x2b2d31 }), 0, 0, 0, 0.3)); col.inner.position.y = -1.0;
            const purple = add(createGlow(0xa04cff, 2.5, 0.5));
            return { update: t => { pose(col, { ll: -1.5, rl: -1.5, ra: -1.6, raz: -0.6, nod: 0.4 }); const wp = new THREE.Vector3(); col.watch.getWorldPosition(wp); purple.position.copy(wp); col.watch.setPower(0.2 + Math.abs(Math.sin(t * 5)) * 0.3); purple.material.opacity = 0.2 + Math.abs(Math.sin(t * 5)) * 0.4; if (t > 8) { pose(col, { ll: -1.5, rl: -1.5, nod: -0.6 }); } } };
        }
    },
    {
        title: "22. A Star From Rosa",
        desc: "The watch ticks faster and faster. Rosa pins a little star, cut from a tin can, onto Mohamed's hoodie. Now you are an honorary deputy, she says. The sheriff tips his hat. Through the ring of light, Mohamed sees a black sky full of stars, and a great grey moon.",
        camPos: [2, 5, 13], camLookAt: [0, 3, 0], skyColor: 0xe88a5a, mood: 'dusk', ground: DESERT, sunPos: [-40, 15, 30],
        setup: () => {
            townSet();
            const kid = add(at(createKid(), 0, 0, 0, Math.PI / 2)); const ro = add(at(rosa(), 2.2, 0, 0, -Math.PI / 2)); const sh = add(at(sheriffClay(), 4.5, 0, -2, -Math.PI / 2 + 0.4));
            const star = cyl(0.22, 0.22, 0.06, mat(0xd8d8e0, { metalness: 0.9, roughness: 0.2 }), -0.5, 3.4, 0.55, 5); star.rotation.x = Math.PI / 2; star.visible = false; kid.inner.add(star);
            const portal = add(createPortal(3.2)); portal.position.set(-4, 3.6, 0); portal.rotation.y = Math.PI / 2; portal.setPower(0);
            const moon = add(group(new THREE.Mesh(new THREE.CircleGeometry(0.9, 24), glowMat(0xd8d8d8)))); moon.position.set(-4.2, 3.6, 0); moon.rotation.y = Math.PI / 2; moon.visible = false;
            return {
                update: t => {
                    kid.watch.setPower(1 + ease(t, 1, 8) * 10); kid.watch.pulse();
                    if (t < 4) { pose(ro, { ra: -1.4, raz: 0.3 }); idle(kid, t); } else { star.visible = true; if (t > 6) wave(ro, t); else clap(ro, t); }
                    if (t > 5) pose(sh, { ra: -2.7, raz: -0.3 }); else idle(sh, t);
                    portal.setPower(ease(t, 6, 9)); moon.visible = t > 8 && t < 11;
                    if (t > 9) walkTo(kid, -3.6, 0, 0.05);
                    if (t > 10.5) kid.scale.setScalar(Math.max(0.01, 1 - (t - 10.5) * 0.8));
                }
            };
        }
    }
];

window.TRAILER = {
    open: "Out where the desert meets the sky...",
    shots: [
        [1, 4, 3.4, "A dusty little town."],
        [3, 5, 3.2, "A dream worth saving."],
        [6, 6, 3.4, "Whispers behind the water tower."],
        [8, 4, 3.4, "A train across the desert."],
        [9, 5, 3.8, "Hold on tight."]
    ]
};
