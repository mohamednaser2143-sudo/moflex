// TITLE: The Elephant Clock
// Episode 4 — Al-Jazari's workshop, 1206. The famous Elephant Clock breaks before the sultan's festival.

// ---------- Episode 4 props ----------
const BRASS = () => mat(0xc9a240, { metalness: 0.8, roughness: 0.3 });
const SAND4 = 0xe3c99a, ARCH4 = 0xd8b98a;
// Al-Jazari's Elephant Clock: an elephant carrying a tower, with a bird, two dragons, a driver and a scribe.
function createElephantClock() {
    const g = group(); const grey = mat(0x8a8a90, { roughness: 0.7 }), cloth = mat(0x9a1f2b), gold = BRASS(), white = mat(0xf2ead8);
    // elephant
    g.add(box(8, 5, 4.4, grey, 0, 6.5, 0));
    [[-2.8, -1.5], [2.8, -1.5], [-2.8, 1.5], [2.8, 1.5]].forEach(([x, z]) => g.add(cyl(0.9, 1.0, 4.2, grey, x, 2.1, z, 10)));
    g.add(box(3.2, 3.6, 3.6, grey, 5.2, 7.6, 0));
    [-1, 1].forEach(s => { const e = box(0.3, 3, 2.4, grey, 4.4, 7.8, s * 2.6); e.rotation.y = s * 0.3; g.add(e); const tk = cone(0.25, 2.2, white, 6.8, 5.6, s * 0.9, 6); tk.rotation.z = Math.PI / 2 + 0.6; g.add(tk); });
    for (let i = 0; i < 5; i++) g.add(box(0.9, 0.9, 0.9, grey, 7.0 + Math.sin(i * 0.4) * 0.6, 6.0 - i * 0.85, 0));
    g.add(box(0.2, 0.25, 0.05, glowMat(0x111111), 6.82, 8.2, 1.0), box(0.2, 0.25, 0.05, glowMat(0x111111), 6.82, 8.2, -1.0));
    g.add(box(6.6, 0.3, 5.0, cloth, -0.4, 9.1, 0), box(6.6, 2.4, 0.15, cloth, -0.4, 7.9, 2.55), box(6.6, 2.4, 0.15, cloth, -0.4, 7.9, -2.55));
    for (let i = 0; i < 6; i++) g.add(box(0.3, 0.3, 0.2, gold, -3.2 + i * 1.1, 7.2, 2.65));
    // tower
    g.add(box(6, 0.5, 4.4, gold, -0.4, 9.5, 0));
    [[-3, -1.8], [2.2, -1.8], [-3, 1.8], [2.2, 1.8]].forEach(([x, z]) => g.add(cyl(0.18, 0.18, 4.5, gold, x, 12, z, 8)));
    const room = box(5.6, 3, 4, mat(0xf2ead8), -0.4, 15.8, 0); g.add(room);
    g.add(box(5.8, 0.4, 4.2, gold, -0.4, 14.2, 0), box(5.8, 0.4, 4.2, gold, -0.4, 17.4, 0));
    for (let i = 0; i < 3; i++) g.add(box(1.0, 1.6, 0.1, mat(0x2b6aa8), -2.2 + i * 1.8, 15.8, 2.02));
    const dome = new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), gold); dome.position.set(-0.4, 17.6, 0); dome.castShadow = true; g.add(dome);
    // bird on the dome
    const bird = group(box(0.8, 0.7, 1.4, mat(0x2a9d8f), 0, 0, 0), box(0.5, 0.5, 0.5, mat(0x2a9d8f), 0, 0.5, 0.6), cone(0.15, 0.4, gold, 0, 0.5, 1.0, 5));
    bird.children[2].rotation.x = Math.PI / 2; const wing1 = box(1.2, 0.1, 0.7, mat(0x1f7a70), 0.8, 0.2, 0), wing2 = box(1.2, 0.1, 0.7, mat(0x1f7a70), -0.8, 0.2, 0); bird.add(wing1, wing2);
    bird.position.set(-0.4, 20.4, 0); g.add(bird, cyl(0.1, 0.1, 0.8, gold, -0.4, 19.9, 0, 6));
    // two dragons hanging from the tower, mouths open for the falling balls
    const dragons = [];
    [-1, 1].forEach(s => {
        const d = group();
        for (let i = 0; i < 8; i++) { const a = i / 7; d.add(box(0.55, 0.55, 0.55, mat(0x2f7a3a), Math.sin(a * Math.PI) * 1.2, -a * 4.5, 0)); }
        d.add(box(0.9, 0.7, 1.0, mat(0x2f7a3a), 0.1, -4.9, 0), box(0.2, 0.2, 0.05, glowMat(0xffd166), 0.3, -4.7, 0.52));
        d.position.set(-0.4 + s * 3.4, 14, 1.4); d.rotation.y = s > 0 ? Math.PI : 0; g.add(d); dragons.push(d);
    });
    // driver on the neck and scribe on the platform
    const driver = createPerson({ shirt: 0xf2c14e, legs: 0x2a2a2a, skin: 0xc68642, hat: 'turban', hatColor: 0xf2ead8, scale: 0.45 }); driver.position.set(4.2, 9.2, 0); driver.rotation.y = Math.PI / 2; pose(driver, { ll: -1.4, rl: -1.4 }); g.add(driver);
    const scribe = createPerson({ shirt: 0x2b6aa8, legs: 0x2a2a2a, skin: 0xe0ac69, hat: 'turban', hatColor: 0xf2ead8, scale: 0.45 }); scribe.position.set(-2.5, 9.7, 0.6); g.add(scribe);
    const pen = box(0.05, 0.6, 0.05, 0x222222); g.add(pen);
    // brass balls waiting in the bird's tray
    const balls = []; for (let i = 0; i < 3; i++) { const b = sph(0.28, gold, -0.4 + (i - 1) * 0.45, 19.6, 1.3, 10); g.add(b); balls.push(b); }
    const falling = sph(0.28, gold, 0, 0, 0, 10); falling.visible = false; g.add(falling);
    g.bird = bird; g.wings = [wing1, wing2]; g.dragons = dragons; g.driver = driver; g.scribe = scribe; g.balls = balls; g.falling = falling; g.pen = pen;
    // strike(t0): a ball drops from the bird into a dragon, the dragon dips, the driver drums
    g.animate = (t, strikeAt = -1, side = 1) => {
        bird.rotation.y = Math.sin(t * 0.6) * 0.3;
        const k = strikeAt >= 0 ? t - strikeAt : -1;
        wing1.rotation.z = k > 0 && k < 2 ? Math.sin(k * 20) * 0.5 : 0; wing2.rotation.z = -wing1.rotation.z;
        bird.rotation.y += k > 0 && k < 2 ? k * Math.PI : 0;
        const d = dragons[side > 0 ? 1 : 0];
        if (k > 0 && k < 1.6) { falling.visible = true; const p = ease(k, 0, 1.4); falling.position.set(-0.4 + side * 3.4 * p, 19.6 - p * 11, 1.4 + p * 0.4); } else falling.visible = false;
        dragons.forEach(dd => dd.rotation.z = 0);
        if (k > 1.2 && k < 3) d.rotation.z = Math.sin((k - 1.2) * Math.PI / 1.8) * 0.4 * side;
        if (k > 1.5 && k < 4) pose(driver, { ll: -1.4, rl: -1.4, ra: -1.8 + Math.abs(Math.sin(k * 10)) * 1.2 }); else pose(driver, { ll: -1.4, rl: -1.4 });
        pose(scribe, { ra: -1.2 + Math.sin(t * 1.5) * 0.15 }); const hp = new THREE.Vector3(); scribe.rig.rightArmGroup.children[1].getWorldPosition(hp); g.worldToLocal(hp); pen.position.copy(hp);
    };
    return g;
}
// Inside the elephant: a water tank with a floating bowl that slowly sinks.
function createTankCutaway() {
    const g = group(box(6, 0.3, 4, 0x8a6a42, 0, 0, 0), box(6, 5, 0.3, 0x6a5a4a, 0, 2.5, -2), box(0.3, 5, 4, 0x6a5a4a, -3, 2.5, 0), box(0.3, 5, 4, 0x6a5a4a, 3, 2.5, 0));
    const water = box(5.6, 3.6, 3.6, new THREE.MeshStandardMaterial({ color: 0x4f9fcf, transparent: true, opacity: 0.55, roughness: 0.1 }), 0, 1.95, 0); g.add(water);
    const bowl = group(cyl(1.4, 0.9, 1.0, BRASS(), 0, 0, 0, 16), cyl(1.3, 1.3, 0.05, 0x222222, 0, 0.5, 0, 16));
    bowl.position.set(0, 3.8, 0); g.add(bowl);
    const hole = createGlow(0x9fdcff, 0.6, 0.8); hole.position.set(0, 3.3, 0.6); g.add(hole);
    g.add(createRope([0, 4.3, 0], [0, 7.5, 0], 0x5a3a22, 0.05));
    g.bowl = bowl; g.hole = hole; return g;
}
function createArcade(w = 40, h = 10, n = 7, color = ARCH4) {
    const g = group(box(w, 2.2, 1.6, color, 0, h - 1.1, 0));
    for (let i = 0; i <= n; i++) g.add(box(1.2, h - 2, 1.4, color, -w / 2 + i * w / n, (h - 2) / 2, 0));
    for (let i = 0; i < n; i++) { const a = new THREE.Mesh(new THREE.TorusGeometry(w / n / 2 - 0.6, 0.35, 6, 16, Math.PI), mat(color)); a.position.set(-w / 2 + (i + 0.5) * w / n, h - 2.2, 0); g.add(a); }
    for (let i = 0; i < w / 1.6; i++) g.add(box(0.8, 0.6, 1.6, 0xb89a6a, -w / 2 + 0.4 + i * 1.6, h + 0.3, 0));
    return g;
}
function createWorkshop() {
    const g = group(box(44, 0.2, 34, 0xb89a6a, 0, -0.05, 0));
    const back = createArcade(44, 11, 8); back.position.z = -15; g.add(back);
    const left = createArcade(30, 11, 5); left.position.x = -22; left.rotation.y = Math.PI / 2; g.add(left);
    g.add(box(44, 11, 0.5, 0xb89a6a, 0, 5.5, -16.2));
    const t = createTable(-12, -8, 7, 3.4, 2.4, 0x7a5232); g.add(t);
    g.add(box(4, 0.05, 2.4, 0xf2e6c8, -12, 2.56, -8));
    [[-15, -12, 1.4], [-11, -12.5, 1], [-17, -9, 0.8], [14, -12, 1.6], [16, -9, 1]].forEach(([x, z, r], i) => { const gr = createGear(r, 10 + i * 2); gr.position.set(x, r + 0.1, z); gr.rotation.y = 0.4; g.add(gr); });
    for (let i = 0; i < 4; i++) g.add(createLantern(-15 + i * 10, 8.5, -14.2, 0xffd27a, 0.7));
    g.add(createPalm(18, -4, 1.2));
    return g;
}
function createStall(x, z, awning = 0xc8102e, goods = 'spice') {
    const g = group(box(5, 1.8, 2.4, 0x8a5a32, 0, 0.9, 0));
    [-2.3, 2.3].forEach(xx => g.add(box(0.2, 4.4, 0.2, 0x6a4424, xx, 2.2, -1.1), box(0.2, 4.4, 0.2, 0x6a4424, xx, 2.2, 1.1)));
    for (let i = 0; i < 5; i++) g.add(box(1, 0.15, 3.0, i % 2 ? 0xf2ead8 : awning, -2 + i, 4.5, 0.3));
    if (goods === 'spice') [0xc8461a, 0xf2a541, 0x6a8a2a, 0xa0302a].forEach((c, i) => g.add(cone(0.5, 0.7, mat(c, { flatShading: true }), -1.6 + i * 1.05, 2.15, 0.3, 8)));
    else if (goods === 'carpet') [0x9a1f2b, 0x2b4a9a, 0x2f6b3a].forEach((c, i) => g.add(box(1.4, 0.3, 2.0, c, -1.5 + i * 1.5, 1.95 + i * 0.05, 0)));
    else [0, 1, 2].forEach(i => g.add(cyl(0.35, 0.45, 0.8, BRASS(), -1.5 + i * 1.5, 2.2, 0.2, 10)));
    g.position.set(x, 0, z); return g;
}
function createFountain(x, z) {
    const g = group(cyl(3, 3.2, 1, 0xd8c8a8, 0, 0.5, 0, 16), cyl(2.7, 2.7, 0.1, mat(0x4f9fcf, { roughness: 0.1 }), 0, 1.0, 0, 16), cyl(0.4, 0.5, 2.4, 0xd8c8a8, 0, 1.6, 0, 10), cyl(1, 0.6, 0.4, 0xd8c8a8, 0, 2.8, 0, 12));
    const jet = cyl(0.12, 0.2, 1.2, glowMat(0xbfe6ff, 0.7), 0, 3.5, 0, 8); g.add(jet);
    let t = 0; addFx(() => { t += 0.1; jet.scale.y = 1 + Math.sin(t) * 0.15; });
    g.position.set(x, 0, z); return g;
}
const alJazari = () => createPerson({ shirt: 0xf2ead8, coat: 0x1d3a6a, legs: 0x1d3a6a, skin: 0xc68642, hat: 'turban', hatColor: 0xf2ead8, beard: 0x444444, belt: 0xc9a240 });
const layla = () => createPerson({ child: true, shirt: 0x2a9d8f, legs: 0x3a2a4a, skin: 0xc68642, hat: 'hood', hatColor: 0x7a3b6a, shoes: 0x3a2a1a, belt: 0xf2c14e });
const sultan = () => createPerson({ shirt: 0xf2ead8, coat: 0x1f6b4a, legs: 0x1f6b4a, skin: 0xd9a86c, hat: 'turban', hatColor: 0xffffff, beard: 0x222222, belt: 0xd4af37, sash: 0xd4af37 });
const townsfolk = (i) => createPerson({ shirt: [0xc8461a, 0x2b6aa8, 0xf2c14e, 0x6a8a2a, 0x7a3b6a, 0xf2ead8][i % 6], coat: i % 3 === 0 ? [0x5a3a22, 0x2a4a6a][i % 2] : null, legs: [0x3a2a1a, 0x2a2a3a][i % 2], skin: SKINS[i % 7], hat: ['turban', 'hood', null, 'turban'][i % 4], hatColor: [0xf2ead8, 0x9a1f2b, 0x2a4a6a, 0xd8c8a8][i % 4], hair: 0x1a1a1a, beard: i % 4 === 0 ? 0x2a2a2a : null });
const merchant = () => createCollector({ hat: 'turban', hatColor: 0x55595f });

// ---------- Story ----------
const storyData = [
    {
        title: "1. Gears in the Sunshine",
        desc: "Warm sunlight and the smell of hot metal greet Mohamed as he tumbles onto a courtyard floor. All around him are brass gears, pulleys, water pipes and half-built machines. Somewhere a hammer rings, tink, tink, tink. He is in a workshop, eight hundred years ago.",
        camPos: [10, 8, 20], camLookAt: [0, 4, -4], skyColor: 0x9fd0ee, mood: 'day', ground: 0xb89a6a,
        setup: () => {
            add(createWorkshop());
            const kid = add(at(createKid(), 0, 0, 2, Math.PI));
            const portal = add(createPortal(2.5)); portal.position.set(0, 3, 2); portal.setPower(1);
            const gears = [add(createGear(1.6, 14)), add(createGear(1.0, 10))]; gears[0].position.set(6, 3, -6); gears[1].position.set(8.55, 3, -6);
            return { update: t => { portal.setPower(1 - ease(t, 0.3, 2)); gears[0].rotation.z = t * 0.5; gears[1].rotation.z = -t * 0.8; if (t < 2) { kid.inner.position.y = -1.4; pose(kid, { ll: -1.5, rl: -1.5 }); } else { kid.inner.position.y = -1.4 * (1 - ease(t, 2, 3)); face(kid, 6, -6, 0.03); if (t > 4) pose(kid, { ra: -1.4 }); else pose(kid, {}); } } };
        }
    },
    {
        title: "2. The Master Engineer",
        desc: "An older man in a white turban and a deep blue robe looks up from a table covered in drawings. A traveller with strange shoes, he smiles. Welcome. I am Ismail al-Jazari. A curious mind is always welcome in my workshop. Mohamed's mouth drops open. He has read about this man in books.",
        camPos: [-6, 6.5, 6], camLookAt: [-12, 3, -8], skyColor: 0x9fd0ee, mood: 'day', ground: 0xb89a6a,
        setup: () => {
            add(createWorkshop());
            const aj = add(at(alJazari(), -12, 0, -10.6, 0));
            const kid = add(at(createKid(), -8.5, 0, -4.5, -2.4));
            return { update: t => { if (t < 4) pose(aj, { la: -1.2, ra: -1.2, nod: 0.4 }); else if (t < 8) { pose(aj, {}); aj.rotation.y = lerpAngle(aj.rotation.y, 0.6, 0.05); } else heart(aj); if (t > 9) heart(kid); else if (t > 6) shock(kid); else idle(kid, t); } };
        }
    },
    {
        title: "3. The Elephant Clock",
        desc: "Al-Jazari pulls a silk cloth from a giant shape. Underneath is the most amazing machine Mohamed has ever seen: a great elephant carrying a tower, with a turning bird on a golden dome, two dragons, a driver and a scribe. It is a clock, says al-Jazari, for the sultan's festival tomorrow night.",
        camPos: [16, 12, 26], camLookAt: [0, 10, 0], skyColor: 0x9fd0ee, mood: 'day', ground: 0xb89a6a,
        setup: () => {
            add(createWorkshop());
            const clock = add(createElephantClock()); clock.rotation.y = -0.4;
            const cloth = add(box(14, 22, 8, mat(0x9a1f2b, { roughness: 1 }), 0, 11, 0)); cloth.rotation.y = -0.4;
            const aj = add(at(alJazari(), 8, 0, 6, -0.9)); const kid = add(at(createKid(), 5, 0, 10, Math.PI - 0.5));
            return { update: t => { clock.animate(t); const k = ease(t, 2, 5); cloth.position.set(k * 12, 11 - k * 10.5, k * 4); cloth.scale.set(1, Math.max(0.03, 1 - k), 1); if (t < 5) pose(aj, { ra: -1.3, la: -1.3 }); else heart(aj); if (t > 5) shock(kid); else idle(kid, t); } };
        }
    },
    {
        title: "4. How It Works",
        desc: "Inside the elephant, al-Jazari explains, is a tank of water. A brass bowl floats in it, with one tiny hole in the bottom. Water trickles in slowly, and after exactly half an hour the bowl sinks. As it sinks, it pulls a cord, and a ball drops from the bird into a dragon's mouth.",
        camPos: [0, 5, 11], camLookAt: [0, 3, 0], skyColor: 0x2a2018, mood: 'indoor', ground: false,
        setup: () => {
            add(box(30, 0.2, 20, 0xcfb488, 0, -0.1, 0)); add(box(30, 12, 0.4, 0xb89a6a, 0, 6, -6));
            const tank = add(createTankCutaway());
            const gl = add(createGlow(0x9fdcff, 7, 0.15)); gl.position.set(0, 3, 0);
            const aj = add(at(alJazari(), -5, 0, 1.6, 0.8));
            const kid = add(at(createKid(), 4.6, 0, 2.2, -0.9));
            return { update: t => { const k = (t / 12) % 1; tank.bowl.position.y = 3.8 - ease(k, 0, 1) * 2.4; tank.hole.material.opacity = 0.5 + Math.sin(t * 6) * 0.3; point(aj, t); pose(kid, { nod: 0.2 }); } };
        }
    },
    {
        title: "5. Layla the Apprentice",
        desc: "A girl in a teal tunic and a purple headscarf is polishing a brass ball until it shines. I am Layla, she says. I am going to be an engineer like my teacher. She shows Mohamed the bag of seven brass balls that make the clock strike. Without these, she says, the clock is just a statue.",
        camPos: [3, 5, 12], camLookAt: [0, 2.6, 0], skyColor: 0x9fd0ee, mood: 'day', ground: 0xb89a6a,
        setup: () => {
            add(createWorkshop());
            const l = add(at(layla(), 1.4, 0, 0, -Math.PI / 2 + 0.2)); const kid = add(at(createKid(), -1.4, 0, 0.4, Math.PI / 2 - 0.2));
            add(createStool(3.0, -0.6));
            const bag = add(group(sph(0.6, 0x7a3b2a, 0, 0, 0, 10))); bag.position.set(0, 2.5, 0.2);
            const ball = add(sph(0.28, BRASS(), 0, 0, 0, 10));
            return { update: t => { pose(l, { ra: -1.3 + Math.sin(t * 6) * 0.15, la: -1.2 }); const hp = new THREE.Vector3(); l.rig.rightArmGroup.children[1].getWorldPosition(hp); ball.position.copy(hp); ball.position.y += 0.3; bag.visible = t > 8; if (t > 8) { pose(l, { la: -1.3, ra: -1.3 }); l.rig.leftArmGroup.children[1].getWorldPosition(hp); bag.position.set(hp.x + 0.5, hp.y + 0.2, hp.z + 0.4); } if (t > 4) heart(kid); else idle(kid, t); } };
        }
    },
    {
        title: "6. The Brass Merchant",
        desc: "That afternoon a tall merchant in a grey robe strolls into the workshop. I sell the finest brass bowls in the land, he says, and offers one to al-Jazari. The engineer politely says no. But Mohamed shivers. There is something about the merchant's long grey robe, and the faint purple glint at his chest.",
        camPos: [6, 7, 14], camLookAt: [0, 4, -2], skyColor: 0xf2c88a, mood: 'golden', ground: 0xcfb488, sunPos: [-40, 25, 30],
        setup: () => {
            add(createWorkshop());
            const m = add(at(merchant(), 8, 0, 0, -Math.PI / 2)); const aj = add(at(alJazari(), -3, 0, -1, Math.PI / 2));
            const kid = add(at(createKid(), -1, 0, 4, 2.4)); const l = add(at(layla(), -4, 0, 3.5, 2));
            const b = add(cyl(0.7, 0.45, 0.5, BRASS(), 0, 0, 0, 14));
            return { update: t => { walkTo(m, 2, -0.6, 0.05) || pose(m, { ra: -1.3, la: -1.3 }); const hp = new THREE.Vector3(); m.rig.rightArmGroup.children[1].getWorldPosition(hp); b.position.copy(hp); b.position.x -= 0.4; m.watch.pulse(); if (t > 7) pose(aj, { ra: -1.0, raz: 0.5 + Math.sin(t * 5) * 0.3 }); else idle(aj, t); face(kid, m.position.x, m.position.z); if (t > 9) shock(kid); else idle(kid, t); idle(l, t, 1); } };
        }
    },
    {
        title: "7. A Glow in the Night",
        desc: "That night Mohamed sleeps on a rug in the workshop. He half wakes to a soft purple glow. A tall shadow is bent over the elephant, swapping something deep inside it, and slipping a heavy bag under his robe. By the time Mohamed sits up, the shadow and the glow are gone.",
        camPos: [12, 8, 18], camLookAt: [0, 5, 0], skyColor: 0x0c1430, mood: 'night', ground: 0x8a7a5a, sunPos: [20, 50, -30],
        setup: () => {
            add(createWorkshop()); add(createStars(500));
            const clock = add(createElephantClock()); clock.rotation.y = -0.4;
            const m = add(at(merchant(), 2.5, 0, 3.4, Math.PI));
            const purple = add(createGlow(0xa04cff, 6, 0.5)); purple.position.set(2, 5, 2.6);
            const rug = add(box(3, 0.1, 5, 0x9a1f2b, 9, 0.06, 8));
            const kid = add(at(createKid(), 9, 0.6, 8.5, 0)); kid.rotation.x = -Math.PI / 2; kid.position.y = 0.7;
            const portal = add(createPortal(2.5, [0x7a2bd6, 0xb05cff, 0x3a0a6a, 0xe0b0ff])); portal.position.set(-2, 4, 5); portal.setPower(0);
            return { update: t => { clock.animate(t); if (t < 7) work(m, t); else { walkTo(m, -2, 5, 0.06); } m.visible = t < 10.5; purple.visible = t < 10; portal.setPower(ease(t, 8, 9) * (1 - ease(t, 11, 12))); m.watch.pulse(); if (t > 10.5) { kid.rotation.x = lerp(-Math.PI / 2, 0, ease(t, 10.5, 12)); kid.position.y = lerp(0.7, 0, ease(t, 10.5, 12)); shock(kid); } } };
        }
    },
    {
        title: "8. Too Fast, Then Nothing",
        desc: "In the morning, al-Jazari fills the tank for a test. But something is badly wrong. The bowl sinks in moments, and the bird spins wildly. Clack, clack, clack. Then the clock simply stops. Layla opens the bag of brass balls and gasps. It is full of plain grey pebbles.",
        camPos: [16, 11, 24], camLookAt: [0, 9, 0], skyColor: 0x9fd0ee, mood: 'day', ground: 0xb89a6a,
        setup: () => {
            add(createWorkshop());
            const clock = add(createElephantClock()); clock.rotation.y = -0.4;
            const aj = add(at(alJazari(), 8, 0, 4, -1.2)); const l = add(at(layla(), 4.5, 0, 9, Math.PI - 0.6)); const kid = add(at(createKid(), 8, 0, 9, Math.PI - 0.3));
            const pebbles = []; for (let i = 0; i < 6; i++) pebbles.push(add(createRock(0, 0, 0, 0.18, 0x777777)));
            return { update: t => { if (t < 6) { clock.bird.rotation.y = t * 8; clock.dragons.forEach((d, i) => d.rotation.z = Math.sin(t * 9 + i) * 0.3); pose(clock.driver, { ll: -1.4, rl: -1.4, ra: -1.8 + Math.abs(Math.sin(t * 14)) * 1.2 }); } else { clock.dragons.forEach(d => d.rotation.z = 0); } if (t < 6) shock(aj); else think(aj, t); const hp = new THREE.Vector3(); l.rig.rightArmGroup.children[1].getWorldPosition(hp); pebbles.forEach((p, i) => { p.visible = t > 8; p.position.set(hp.x + (i % 3 - 1) * 0.3, hp.y + 0.3 + Math.floor(i / 3) * 0.25, hp.z); }); if (t > 8) { pose(l, { ra: -1.4, la: -1.4 }); shock(kid); } else { idle(l, t); idle(kid, t); } } };
        }
    },
    {
        title: "9. Every Problem Has a Reason",
        desc: "The festival is tonight. Layla is almost in tears. But al-Jazari stays calm. A machine does not break for no reason, he says gently. We look, we measure, we think. Then we fix. Mohamed nods. That sounds just like something his grandfather would say.",
        camPos: [0, 5, 10], camLookAt: [0, 3, 0], skyColor: 0x9fd0ee, mood: 'day', ground: 0xb89a6a,
        setup: () => {
            add(createWorkshop());
            const aj = add(at(alJazari(), 0, 0, -1.4, 0)); const l = add(at(layla(), -2.2, 0, 1.4, 2.6)); const kid = add(at(createKid(), 2.2, 0, 1.4, -2.6));
            return { update: t => { pose(aj, { la: -1.6, laz: 0.5, ra: -0.6, nod: 0.1 }); if (t > 8) pose(aj, { ra: -2.3, raz: -0.3 }); pose(l, { la: -2.1, ra: -2.1, laz: 0.6, raz: -0.6, nod: 0.4 }); if (t > 6) pose(l, { nod: 0 }); if (t > 10) pose(kid, { nod: 0.25 + Math.sin(t * 4) * 0.1 }); else idle(kid, t); } };
        }
    },
    {
        title: "10. Counting the Seconds",
        desc: "Mohamed has an idea. He holds up his pocket watch and times the bowl as it fills. Half an hour, al-Jazari said. But the bowl sinks in under two minutes. The hole is far too big, says Mohamed. Al-Jazari turns the bowl over and frowns. This is not my bowl. Someone has swapped it.",
        camPos: [0, 5, 10], camLookAt: [0, 3, 0], skyColor: 0x2a2018, mood: 'indoor', ground: false,
        setup: () => {
            add(box(30, 0.2, 20, 0xcfb488, 0, -0.1, 0)); add(box(30, 12, 0.4, 0xb89a6a, 0, 6, -6));
            const tank = add(createTankCutaway()); tank.hole.scale.setScalar(3);
            const kid = add(at(createKid(), 4.4, 0, 2.2, -0.9)); const aj = add(at(alJazari(), -5, 0, 1.6, 0.8));
            return { update: t => { tank.bowl.position.y = 3.8 - ease(t, 1, 8) * 2.4; tank.hole.material.opacity = 0.6 + Math.sin(t * 10) * 0.3; pose(kid, { la: -1.7, laz: 0.4, nod: 0.2 }); kid.watch.setPower(2); if (t > 9) { think(aj, t); } else idle(aj, t); } };
        }
    },
    {
        title: "11. The Merchant's Trick",
        desc: "The merchant, gasps Layla. He wanted us to use his bowl, and when we said no, he swapped it in the night! And took the brass balls too. Mohamed's hand closes around his watch. A man in grey, he says quietly. I know him. He was at sea, and at the Great Wall. He is following me.",
        camPos: [3, 5, 12], camLookAt: [0, 2.6, 0], skyColor: 0x9fd0ee, mood: 'day', ground: 0xb89a6a,
        setup: () => {
            add(createWorkshop());
            const l = add(at(layla(), 1.4, 0, 0, -Math.PI / 2 + 0.2)); const kid = add(at(createKid(), -1.4, 0, 0.4, Math.PI / 2 - 0.2)); const aj = add(at(alJazari(), 0, 0, -3, 0));
            return { update: t => { if (t < 6) pose(l, { ra: -2.6, raz: 0.3 + Math.sin(t * 6) * 0.2 }); else idle(l, t); if (t > 6) pose(kid, { la: -1.1, laz: 0.4, nod: 0.3 }); else idle(kid, t); idle(aj, t); } };
        }
    },
    {
        title: "12. The Great Bazaar",
        desc: "Layla says the merchant was staying near the market. Mohamed and Layla run through the gate into the great bazaar. It is a maze of striped awnings, piles of spices, hanging lanterns, shining copper pots and carpets of every colour. And somewhere in the crowd is a man in grey.",
        camPos: [0, 9, 26], camLookAt: [0, 3, -4], skyColor: 0xa8d4ee, mood: 'day', ground: 0xc4a87a,
        setup: () => {
            const kinds = ['spice', 'carpet', 'brass'];
            for (let i = 0; i < 6; i++) { add(at(createStall(-14 + i * 5.6, -8, [0xc8102e, 0x2b6aa8, 0x2f6b3a][i % 3], kinds[i % 3]), -14 + i * 5.6, 0, -8)); add(at(createStall(0, 0, [0xf2a541, 0x7a3b6a, 0x2a9d8f][i % 3], kinds[(i + 1) % 3]), -14 + i * 5.6, 0, 6, Math.PI)); }
            add(createArcade(44, 11, 8)).position.z = -14;
            for (let i = 0; i < 8; i++) add(createLantern(-16 + i * 4.5, 6, -1 + (i % 2), [0xffc36b, 0xff8a5c, 0x8ad0ff][i % 3], 0.5));
            const crowd = []; for (let i = 0; i < 7; i++) crowd.push(add(at(townsfolk(i), -14 + i * 4.6, 0, -2 + (i % 2) * 3, i % 2 ? Math.PI / 2 : -Math.PI / 2)));
            const kid = add(at(createKid(), -18, 0, 2)); const l = add(at(layla(), -20, 0, 1));
            return { update: t => { crowd.forEach((c, i) => { const dir = i % 2 ? 1 : -1; walkTo(c, c.position.x + dir, c.position.z, 0.03); if (c.position.x > 20) c.position.x = -20; if (c.position.x < -20) c.position.x = 20; }); walkTo(kid, 14, 1.4, 0.08); walkTo(l, 12, 0.6, 0.08); } };
        }
    },
    {
        title: "13. The Chase",
        desc: "There! A grey robe disappears behind a carpet stall. Mohamed and Layla dash after it, ducking under awnings and leaping over baskets of dates. A spice seller shouts as a cloud of red pepper puffs into the air. The grey figure glides ahead of them, never quite running.",
        camPos: [18, 7, 14], camLookAt: [0, 3, -1], skyColor: 0xa8d4ee, mood: 'day', ground: 0xc4a87a,
        setup: () => {
            const kinds = ['spice', 'carpet', 'brass'];
            for (let i = 0; i < 7; i++) add(at(createStall(0, 0, [0xc8102e, 0x2b6aa8, 0x2f6b3a][i % 3], kinds[i % 3]), -18 + i * 6, 0, -6));
            for (let i = 0; i < 4; i++) add(createBarrel(-12 + i * 9, 1.4, 0.7, 0x8a5a32));
            const col = add(at(merchant(), -6, 0, -0.5, Math.PI / 2));
            const kid = add(at(createKid(), -16, 0, 0.4, Math.PI / 2)); const l = add(at(layla(), -18, 0, 1.2, Math.PI / 2));
            const puff = add(createBurst(0xc8461a, 140, 0.12)); puff.position.set(-6, 2.6, -5); let fired = false;
            return { update: t => { col.position.x = -6 + t * 0.9; walkTo(col, col.position.x + 1, -0.5, 0); col.walkCycleTime += 0.1; const s = Math.sin(col.walkCycleTime) * 0.4; pose(col, { la: s, ra: -s, ll: -s, rl: s }); col.rotation.y = Math.PI / 2; kid.position.x = -16 + t * 1.4; l.position.x = -18 + t * 1.35; [kid, l].forEach((a, i) => { a.rotation.y = Math.PI / 2; run(a, t, i); a.position.y = Math.abs(Math.sin(t * 6.5 + i)) * 0.3; }); if (t > 5 && !fired) { fired = true; puff.fire(); } } };
        }
    },
    {
        title: "14. A Bag of Brass",
        desc: "By the fountain at the end of the market the man in grey finally turns. You are clever, boy, he says, but you cannot keep me away forever. His watch flashes purple, and he steps backwards into a swirl of light. As he vanishes, the heavy bag slips from his robe and seven brass balls roll across the stones.",
        camPos: [0, 6, 16], camLookAt: [0, 3, 0], skyColor: 0xa8d4ee, mood: 'day', ground: 0xc4a87a,
        setup: () => {
            add(createFountain(0, -4)); add(createArcade(40, 11, 7)).position.z = -12;
            const col = add(at(merchant(), 0, 0, 0, 0)); const kid = add(at(createKid(), -2, 0, 6, Math.PI)); const l = add(at(layla(), 2.4, 0, 6.4, Math.PI));
            const portal = add(createPortal(2.6, [0x7a2bd6, 0xb05cff, 0x3a0a6a, 0xe0b0ff])); portal.position.set(0, 3.2, -1.4); portal.setPower(0);
            const balls = []; for (let i = 0; i < 7; i++) { const b = add(sph(0.28, BRASS(), 0, 0.28, 0, 10)); b.dir = [Math.cos(i * 0.9 + 0.3) * 0.05, Math.sin(i * 0.9 + 0.3) * 0.03 + 0.03]; balls.push(b); }
            return {
                update: t => {
                    col.watch.pulse(); if (t < 7) point(col, t); else pose(col, {});
                    portal.setPower(ease(t, 6, 8) * (1 - ease(t, 12, 13)));
                    if (t > 8) { col.position.z = -0.0 - (t - 8) * 0.5; col.visible = t < 10.5; }
                    balls.forEach((b, i) => { if (t < 9) { b.position.set(0.6, 2.5, 0.5); b.visible = false; } else { b.visible = true; const k = Math.min(t - 9, 4); b.position.set(0.6 + b.dir[0] * k * 60 * (1 - k / 8), 0.28, 0.5 + b.dir[1] * k * 60 * (1 - k / 8)); } });
                    if (t > 6) { shock(kid); shock(l); } else { idle(kid, t); idle(l, t, 1); }
                }
            };
        }
    },
    {
        title: "15. A New Bowl",
        desc: "Back at the workshop, there is no time to lose. Al-Jazari heats a sheet of brass and hammers it into a perfect round bowl. Layla holds it steady. Then, with a needle as thin as a hair, the master makes one tiny hole. Not too big, he says. Not too small. Just right.",
        camPos: [0, 5.5, 9], camLookAt: [0, 2.6, 0], skyColor: 0xf2c88a, mood: 'golden', ground: 0xcfb488, sunPos: [-40, 25, 30],
        setup: () => {
            add(createWorkshop());
            add(box(3, 2.2, 2, 0x444444, 0, 1.1, -1)); const b = add(cyl(1.1, 0.7, 0.7, BRASS(), 0, 2.6, -1, 16));
            const aj = add(at(alJazari(), 0, 0, -3.4, 0)); const l = add(at(layla(), -2.2, 0, -0.6, Math.PI / 2)); const kid = add(at(createKid(), 2.4, 0, 0.6, -Math.PI / 2 - 0.4));
            const hammer = add(group(box(0.12, 1.4, 0.12, 0x6a4a2a, 0, 0, 0), box(0.6, 0.35, 0.35, 0x555555, 0, 0.7, 0)));
            const spark = add(createBurst(0xffd166, 40, 0.08)); spark.position.set(0, 3, -1);
            return { update: t => { const s = Math.abs(Math.sin(t * 5)); pose(aj, { ra: -1.5 - s * 0.9, la: -1.0 }); const hp = new THREE.Vector3(); aj.rig.rightArmGroup.children[1].getWorldPosition(hp); hammer.position.copy(hp); hammer.rotation.x = -1.2 - s * 0.6; if (t < 9 && s < 0.08 && !spark.cool) { spark.fire(); spark.cool = 1; } if (s > 0.5) spark.cool = 0; if (t > 9) { pose(aj, { ra: -1.3, la: -1.3, nod: 0.5 }); hammer.visible = false; } pose(l, { la: -1.3, ra: -1.3 }); idle(kid, t); b.scale.y = 0.7 + ease(t, 0, 8) * 0.3; } };
        }
    },
    {
        title: "16. Exactly Half an Hour",
        desc: "They fill the tank and wait. Mohamed watches the hands of his pocket watch, and Layla watches the bowl. Ten minutes. Twenty. Twenty nine. At exactly half an hour the bowl sinks, the bird turns, and a brass ball rolls down into the dragon's mouth. Clang! The driver beats his drum. It works!",
        camPos: [16, 11, 24], camLookAt: [0, 9, 0], skyColor: 0xf2c88a, mood: 'golden', ground: 0xcfb488, sunPos: [-40, 25, 30],
        setup: () => {
            add(createWorkshop());
            const clock = add(createElephantClock()); clock.rotation.y = -0.4;
            const kid = add(at(createKid(), 8, 0, 9, Math.PI - 0.3)); const l = add(at(layla(), 4.5, 0, 9, Math.PI - 0.6)); const aj = add(at(alJazari(), 9, 0, 5, -1.2));
            return { update: t => { clock.animate(t, 7, 1); if (t < 7) { pose(kid, { la: -1.7, laz: 0.4, nod: 0.3 }); idle(l, t); idle(aj, t); } else if (t > 9) { cheer(kid, t); cheer(l, t, 1); heart(aj); } } };
        }
    },
    {
        title: "17. To the Palace",
        desc: "As the sun sets, a team of strong workers wheels the great clock on a wooden platform through the streets to the palace. Children run alongside, pointing and laughing. Lanterns are being lit in every window. The whole city is going to the festival.",
        camPos: [24, 13, 24], camLookAt: [0, 7, 0], skyColor: 0xe89a6a, mood: 'dusk', ground: 0xc8ae84, sunPos: [-40, 15, 20],
        setup: () => {
            for (let i = 0; i < 6; i++) { add(createHut(-24 + i * 9, -14, 7, 6, 6 + (i % 2) * 2, 0xe3c99a, 0xb89a6a)); add(createLantern(-24 + i * 9, 5, -10.8, 0xffc36b, 0.6)); }
            const plat = add(group(box(12, 1, 8, 0x7a5232, 0, 1.2, 0))); [-4, 4].forEach(x => [-4.2, 4.2].forEach(z => { const w = cyl(0.9, 0.9, 0.3, 0x4a3020, x, 0.9, z, 12); w.rotation.x = Math.PI / 2; plat.add(w); }));
            const clock = createElephantClock(); clock.scale.setScalar(0.55); clock.position.y = 1.7; plat.add(clock);
            const ws = [0, 1, 2, 3].map(i => add(at(townsfolk(i), 0, 0, 0, Math.PI / 2)));
            const kid = add(at(createKid(), 0, 0, 6, Math.PI / 2)); const l = add(at(layla(), 0, 0, 7, Math.PI / 2));
            const kids = [4, 5].map(i => add(createPerson({ child: true, shirt: [0xf2c14e, 0x2b6aa8][i % 2], legs: 0x3a2a1a, skin: SKINS[i], hair: 0x111111 })));
            return { update: t => { const x = -16 + t * 0.9; plat.position.x = x; clock.animate(t); ws.forEach((w, i) => { w.position.set(x - 7, 0, -3 + i * 2); w.rotation.y = Math.PI / 2; work(w, t, i); }); [kid, l, ...kids].forEach((a, i) => { a.position.set(x + (i - 1.5) * 2.5, 0, 7 + (i % 2)); a.rotation.y = Math.PI / 2; a.walkCycleTime += 0.15; const s = Math.sin(a.walkCycleTime) * 0.6; pose(a, { la: s, ra: -s, ll: -s, rl: s }); if (i >= 2) point(a, t); }); } };
        }
    },
    {
        title: "18. The Sultan's Festival",
        desc: "The palace courtyard glows with hundreds of lanterns. Musicians play, and the smell of sweet pastries fills the air. When the sultan arrives in his green robe, the people place their hands on their hearts in greeting, and he does the same back to them. Then everyone turns to look at the clock.",
        camPos: [0, 10, 30], camLookAt: [0, 6, 0], skyColor: 0x1a1a3a, mood: 'dusk', ground: 0xc8ae84, sunPos: [-30, 10, 30],
        setup: () => {
            add(createArcade(50, 12, 8)).position.z = -14;
            const dome = new THREE.Mesh(new THREE.SphereGeometry(8, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x2a9d8f)); dome.position.set(0, 12, -20); add(dome);
            add(box(18, 12, 10, 0xe3c99a, 0, 6, -20));
            for (let i = 0; i < 14; i++) add(createLantern(-24 + i * 3.7, 9 + Math.sin(i * 1.3) * 1.2, -12.5, [0xffc36b, 0xff8a5c, 0x8ad0ff, 0xb0ff8a][i % 4], 0.6));
            const clock = add(createElephantClock()); clock.scale.setScalar(0.6); clock.position.set(-10, 0, -6); clock.rotation.y = 0.3;
            const sul = add(at(sultan(), 5, 0, -4, -0.4)); const aj = add(at(alJazari(), -3, 0, -2, 0.5));
            const crowd = []; for (let i = 0; i < 10; i++) crowd.push(add(at(townsfolk(i), -14 + i * 3.2, 0, 8 + (i % 2) * 3, Math.PI)));
            const kid = add(at(createKid(), 2, 0, 5, Math.PI)); const l = add(at(layla(), 4, 0, 6, Math.PI));
            return { update: t => { clock.animate(t); heart(sul); [...crowd, kid, l].forEach((c, i) => { c.rotation.y = lerpAngle(c.rotation.y, Math.atan2(5 - c.position.x, -4 - c.position.z), 0.05); if (t > 3) heart(c); else idle(c, t, i); }); if (t > 3) heart(aj); else idle(aj, t); } };
        }
    },
    {
        title: "19. The Clock Strikes",
        desc: "The half hour arrives. The bird on the dome turns and whistles. A brass ball drops, rolls through the dragon's mouth, and lands with a ringing clang. The driver beats his drum and the scribe's pen moves. The courtyard bursts into applause, and the sultan claps loudest of all.",
        camPos: [14, 11, 22], camLookAt: [0, 9, 0], skyColor: 0x1a1a3a, mood: 'dusk', ground: 0xc8ae84, sunPos: [-30, 10, 30],
        setup: () => {
            add(createArcade(50, 12, 8)).position.z = -14;
            for (let i = 0; i < 14; i++) add(createLantern(-24 + i * 3.7, 9 + Math.sin(i * 1.3) * 1.2, -12.5, [0xffc36b, 0xff8a5c, 0x8ad0ff, 0xb0ff8a][i % 4], 0.6));
            const clock = add(createElephantClock()); clock.rotation.y = -0.4;
            const sul = add(at(sultan(), 9, 0, 6, -0.8)); const aj = add(at(alJazari(), 6, 0, 8, -0.6));
            const crowd = []; for (let i = 0; i < 6; i++) crowd.push(add(at(townsfolk(i), 2 + i * 2.4, 0, 11 + (i % 2) * 2, Math.PI - 0.5)));
            const kid = add(at(createKid(), 12, 0, 9, -0.9)); const l = add(at(layla(), 13.5, 0, 10.5, -0.9));
            return { update: t => { clock.animate(t, 3, -1); if (t > 6) { clap(sul, t); heart(aj); [...crowd, kid, l].forEach((c, i) => i % 2 ? clap(c, t, i) : cheer(c, t, i)); } else { [...crowd, kid, l, sul, aj].forEach((c, i) => idle(c, t, i)); } } };
        }
    },
    {
        title: "20. The Fourth Gem",
        desc: "In the middle of the cheering, Mohamed's watch grows warm. A green gem, the colour of a palm leaf, lights up beside the other three. Four, he whispers. More than halfway. Layla squeezes his arm and grins. I knew there was something special about you, she says.",
        camPos: [0, 4.6, 7.5], camLookAt: [0, 3, 0], skyColor: 0x1a1a3a, mood: 'dusk', ground: 0xc8ae84, gems: 4, gemMoment: true,
        setup: () => {
            add(createArcade(40, 12, 7)).position.z = -10;
            for (let i = 0; i < 10; i++) add(createLantern(-18 + i * 4, 8, -8.5, [0xffc36b, 0xff8a5c, 0x8ad0ff][i % 3], 0.6));
            const kid = add(at(createKid(), -0.7, 0, 0, 0.25)); const l = add(at(layla(), 1.6, 0, 0.2, -0.6));
            let lit = false;
            return { update: t => { if (t > 3 && !lit) { lit = true; lightGem(kid, 4); } if (t > 3) { pose(kid, { la: -1.1, laz: 0.4, nod: 0.3 }); cheer(l, t); } else { idle(kid, t); idle(l, t, 1); } } };
        }
    },
    {
        title: "21. On the Rooftops",
        desc: "On a dark rooftop above the festival, the man in grey watches the crowd and grips his cracked watch. Four, he says through his teeth. The cracks spread across its purple face. Three more, and his watch will be complete. And mine will be nothing. I must stop him before the last gem.",
        camPos: [6, 12, 14], camLookAt: [0, 9, 0], skyColor: 0x101030, mood: 'night', ground: 0x6a5a40, sunPos: [20, 40, -30],
        setup: () => {
            add(box(20, 8, 14, 0xb89a6a, 0, 4, -2)); add(createStars(500));
            const dome = new THREE.Mesh(new THREE.SphereGeometry(3, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x2a6a6a)); dome.position.set(-6, 8, -6); add(dome);
            for (let i = 0; i < 10; i++) add(createLantern(-20 + i * 4.5, 3, 12, [0xffc36b, 0xff8a5c][i % 2], 0.6));
            const col = add(at(merchant(), 1, 8, 2, 0.4));
            const purple = add(createGlow(0xa04cff, 3, 0.5));
            return { update: t => { pose(col, { ra: -1.6, raz: -0.6, nod: 0.4 }); const wp = new THREE.Vector3(); col.watch.getWorldPosition(wp); purple.position.copy(wp); col.watch.setPower(0.3 + Math.abs(Math.sin(t * 4)) * 0.4); col.watch.pulse(); if (t > 9) { pose(col, {}); col.rotation.y = lerpAngle(col.rotation.y, Math.PI, 0.03); } } };
        }
    },
    {
        title: "22. A Gift of Knowledge",
        desc: "Before dawn the watch begins to tick fast. Al-Jazari places a small brass gear in Mohamed's hand. Knowledge is a gift, he says. Use it well, and share it. Layla waves goodbye. In the ring of light, Mohamed sees a black steam train puffing across a dusty desert.",
        camPos: [2, 5, 13], camLookAt: [0, 3, 0], skyColor: 0x3a3a6a, mood: 'dusk', ground: 0xcfb488, sunPos: [40, 10, 30],
        setup: () => {
            add(createWorkshop());
            const kid = add(at(createKid(), 0, 0, 0, Math.PI / 2)); const aj = add(at(alJazari(), 2.4, 0, 0, -Math.PI / 2)); const l = add(at(layla(), 2.6, 0, 2.4, -Math.PI / 2 - 0.4));
            const gear = add(createGear(0.35, 10));
            const portal = add(createPortal(3.2)); portal.position.set(-4, 3.6, 0); portal.rotation.y = Math.PI / 2; portal.setPower(0);
            const train = add(group(box(1.6, 0.8, 0.1, glowMat(0x222222), 0, 0, 0), box(0.3, 0.6, 0.1, glowMat(0x222222), -0.4, 0.6, 0), box(0.8, 0.5, 0.1, glowMat(0xc8a070), 0.6, -0.8, 0))); train.position.set(-4.2, 3.6, 0); train.rotation.y = Math.PI / 2; train.visible = false;
            return {
                update: t => {
                    kid.watch.setPower(1 + ease(t, 1, 8) * 10); kid.watch.pulse();
                    const hp = new THREE.Vector3();
                    if (t < 4) { pose(aj, { ra: -1.3 }); aj.rig.rightArmGroup.children[1].getWorldPosition(hp); idle(kid, t); } else { pose(kid, { ra: -1.3 }); kid.rig.rightArmGroup.children[1].getWorldPosition(hp); heart(aj); }
                    gear.position.copy(hp); gear.rotation.z = t; if (t > 6) wave(l, t); else idle(l, t);
                    portal.setPower(ease(t, 6, 9)); train.visible = t > 8 && t < 11;
                    if (t > 9) walkTo(kid, -3.6, 0, 0.05);
                    if (t > 10.5) { kid.scale.setScalar(Math.max(0.01, 1 - (t - 10.5) * 0.8)); gear.visible = false; }
                }
            };
        }
    }
];

window.TRAILER = {
    open: "In a workshop full of wonders...",
    shots: [
        [1, 5, 3.4, "Brass, water and gears."],
        [3, 7, 3.6, "A machine like no other."],
        [5, 5, 3.2, "A promise to a sultan."],
        [6, 7, 3.4, "A stranger in grey."],
        [7, 4, 3.8, "Time is running out."]
    ]
};
