// TITLE: The Final Fix
// Episode 7 — The watch breaks. Back to 1899, to the clock shop where it was made, to face The Collector.

// ---------- Episode 7 props ----------
const BRICK = 0x8a4a3a;
function createTownhouse(x, z, w = 9, h = 12, color = BRICK, shop = null) {
    const g = group(box(w, h, 6, color, 0, h / 2, 0), box(w + 0.4, 0.6, 6.4, 0x3a2a2a, 0, h + 0.3, 0));
    for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) g.add(box(1.6, 2.2, 0.1, glowMat(0xffd88a), -w / 4 + c * w / 2, h - 3 - r * 3.4, 3.02));
    if (shop) {
        g.add(box(w * 0.8, 3.4, 0.2, glowMat(0xffe0a0), 0, 2.2, 3.05), box(1.6, 3.6, 0.15, 0x2a4a3a, w * 0.35, 1.8, 3.12));
        const s = createSign(shop, w * 0.85, 1.3, { w: 768, h: 120, bg: '#1d3a2a', fg: '#e8b54a', border: '#e8b54a', font: '900 70px Georgia' }); s.position.set(0, 4.6, 3.2); g.add(s);
    } else g.add(box(1.6, 3.2, 0.15, 0x3a2414, 0, 1.6, 3.05));
    g.add(box(1.2, 2, 1.2, 0x5a3a3a, w / 3, h + 1.6, -1));
    g.position.set(x, 0, z); return g;
}
function createGasLamp(x, z) {
    const g = group(cyl(0.12, 0.18, 6, 0x1d1d1d, 0, 3, 0, 8), box(0.7, 0.9, 0.7, glowMat(0xffd27a), 0, 6.4, 0), cone(0.6, 0.5, 0x1d1d1d, 0, 7.1, 0, 4));
    const gl = createGlow(0xffc36b, 5, 0.6); gl.position.y = 6.4; g.add(gl);
    g.position.set(x, 0, z); return g;
}
function createSnow(n = 700, area = 60, h = 30) {
    const pos = new Float32Array(n * 3); const r = makeRand(17);
    for (let i = 0; i < n; i++) { pos[i * 3] = (r() - 0.5) * area; pos[i * 3 + 1] = r() * h; pos[i * 3 + 2] = (r() - 0.5) * area; }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const p = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.18, transparent: true, opacity: 0.9 }));
    p.frozen = false; let t = 0;
    addFx(() => { if (p.frozen) return; t += 1 / 60; for (let i = 0; i < n; i++) { pos[i * 3 + 1] -= 0.04; pos[i * 3] += Math.sin(t + i) * 0.01; if (pos[i * 3 + 1] < 0) pos[i * 3 + 1] = h; } geo.attributes.position.needsUpdate = true; });
    return p;
}
// A tall clock whose pendulum can be frozen.
function createTallClock(x, z, h = 8, color = 0x5a2a14) {
    const g = group(box(2, h, 1.2, color, 0, h / 2, 0), box(2.3, 0.4, 1.4, color, 0, h + 0.2, 0));
    const face = createClockFace(0.8); face.position.set(0, h - 1.4, 0.65); g.add(face);
    g.add(box(1.2, h * 0.45, 0.05, glowMat(0x2a1a10), 0, h * 0.35, 0.62));
    const pend = group(box(0.08, h * 0.35, 0.05, mat(0xc9a240, { metalness: 0.8 }), 0, -h * 0.17, 0), cyl(0.3, 0.3, 0.08, mat(0xc9a240, { metalness: 0.8 }), 0, -h * 0.35, 0, 14));
    pend.children[1].rotation.x = Math.PI / 2; pend.position.set(0, h * 0.55, 0.66); g.add(pend);
    g.pend = pend; g.frozen = false; let t = Math.random() * 3;
    addFx(() => { if (g.frozen) return; t += 1 / 60; pend.rotation.z = Math.sin(t * 3) * 0.25; });
    g.position.set(x, 0, z); return g;
}
function createClockShop() {
    const g = createRoom({ w: 34, d: 22, h: 13, wall: 0x6a4a32, floor: 0x5a3a26, trim: 0x3a2414 });
    const clocks = [];
    [[-14, -9.6, 9], [-11, -9.6, 8], [11, -9.6, 8.5], [14, -9.6, 9.5]].forEach(([x, z, h], i) => { const c = createTallClock(x, z, h, [0x5a2a14, 0x6a3a1a, 0x4a2414][i % 3]); g.add(c); clocks.push(c); });
    const r = makeRand(9);
    for (let i = 0; i < 14; i++) { const f = createClockFace(0.5 + r() * 0.5, [0xc9a240, 0x6a3a1a, 0x8a8a8a][i % 3]); f.position.set(-7 + (i % 7) * 2.3, 6 + Math.floor(i / 7) * 2.6, -10.6); g.add(f); }
    // workbench with tools and a magnifying lamp
    g.add(box(10, 0.3, 3.4, 0x7a5232, 0, 2.6, -6.5), box(0.4, 2.6, 3, 0x5a3a22, -4.6, 1.3, -6.5), box(0.4, 2.6, 3, 0x5a3a22, 4.6, 1.3, -6.5));
    for (let i = 0; i < 6; i++) g.add(box(0.08, 0.5, 0.08, 0x777777, -3 + i * 0.3, 2.95, -7.6));
    g.add(cyl(0.05, 0.05, 2.4, 0x333333, 3.4, 3.9, -7.4, 6), cyl(0.5, 0.3, 0.4, 0x2a4a3a, 3.4, 5.2, -7.0, 10), createGlow(0xffe0a0, 3, 0.5));
    g.children[g.children.length - 1].position.set(3.4, 4.6, -6.8);
    g.add(createLantern(-8, 9.5, -10.3, 0xffd27a, 0.8), createLantern(8, 9.5, -10.3, 0xffd27a, 0.8));
    // shop window with snow behind
    g.add(box(0.3, 5, 8, glowMat(0x3a4a6a), 16.8, 5, 2));
    g.clocks = clocks; return g;
}
function freezeShop(shop, on) { shop.clocks.forEach(c => c.frozen = on); }
const yusuf = () => createPerson({ shirt: 0xf2ead8, vest: 0x3a2a1a, legs: 0x3a3a3a, skin: 0xc98b5a, hair: 0x111111, hairStyle: 'curly', glasses: true, apron: 0x7a5232, beard: null });
const youngSilas = () => createPerson({ shirt: 0xe8e0d0, vest: 0x6b6f76, legs: 0x3a3c40, skin: 0xd1b394, hair: 0x2a2a2a, hairStyle: 'short' });
function withMustache(p) { p.rig.head.add(box(0.7, 0.14, 0.06, 0x111111, 0, -0.15, 0.62)); return p; }
// The unfinished watch on Yusuf's bench, open at the back.
function createOpenWatch() {
    const w = createWatch(); w.setGems(0); w.setPower(0.2); w.scale.setScalar(1.3);
    const back = cyl(0.46, 0.46, 0.04, mat(0xc9a240, { metalness: 0.85, roughness: 0.3 }), 0, -0.45, -0.3, 24); back.rotation.x = 0.3; w.add(back);
    return w;
}

// ---------- Story ----------
const storyData = [
    {
        title: "1. A Broken Tunnel",
        desc: "The tunnel of light is not smooth this time. It crackles and flickers, blue and purple, as if it might snap. Mohamed spins and tumbles. His cracked watch ticks backwards, tock, tick, tock, tick. Clocks fly past him, breaking apart. Then, with a thump, he lands in soft snow.",
        camPos: [0, 5, 12], camLookAt: [0, 4, -20], skyColor: 0x10051e, mood: 'vortex', ground: false,
        setup: () => {
            const tunnel = add(createTimeTunnel(9, 8, [0x4fc3ff, 0xb05cff, 0x7a2bd6, 0x3a6bff])); tunnel.position.y = 4;
            add(createStars(500, 200));
            const kid = add(at(createKid(), 0, 2, 0));
            return { update: t => { kid.rotation.z = Math.sin(t * 1.4) * 0.9; kid.rotation.y = t * 1.1; kid.position.y = 2 + Math.sin(t * 2.3) * 0.8; kid.position.x = Math.sin(t * 3.1) * 0.6; pose(kid, { la: -2.4 + Math.sin(t * 5) * 0.4, ra: -2.4 - Math.sin(t * 5) * 0.4, ll: Math.sin(t * 3) * 0.5, rl: -Math.sin(t * 3) * 0.5 }); kid.watch.setPower(-4); kid.watch.pulse(); if (Math.sin(t * 5) > 0.95) flashScreen('#b05cff', 300); } };
        }
    },
    {
        title: "2. A Snowy Street",
        desc: "Gas lamps glow along a cobbled street. A horse pulls a carriage past tall brick houses, and snowflakes drift down in the evening light. Mohamed brushes snow off his hoodie and looks up at a shop window full of ticking clocks. Above the door, in gold letters, it says: Yusuf Clocks.",
        camPos: [0, 7, 24], camLookAt: [0, 4, -4], skyColor: 0x2a3050, mood: 'night', ground: 0xd8dde4, sunPos: [-30, 30, 30],
        setup: () => {
            add(createTownhouse(-18, -8, 9, 12, 0x7a3a2a)); add(createTownhouse(-9, -8, 9, 13, BRICK)); add(createTownhouse(0.5, -8, 10, 12, 0x6a4a3a, 'YUSUF CLOCKS'));
            add(createTownhouse(10.5, -8, 9, 14, 0x8a5a3a)); add(createTownhouse(19.5, -8, 9, 12, 0x7a3a2a));
            for (let i = 0; i < 4; i++) add(createGasLamp(-15 + i * 10, -3.4));
            add(box(80, 0.1, 6, 0x6a6a6a, 0, 0.05, 4));
            add(createSnow(900, 70, 30));
            const h = add(createHorse(0x3a2a1a)); const cart = add(group(box(4, 2.4, 2.6, 0x1d1d1d, 0, 2.4, 0), box(4.2, 0.2, 2.8, 0x3a2a1a, 0, 3.7, 0))); [-1.2, 1.2].forEach(x => [-1.4, 1.4].forEach(z => { const w = cyl(0.9, 0.9, 0.15, 0x3a2a1a, x, 0.9, z, 12); w.rotation.x = Math.PI / 2; cart.add(w); }));
            const kid = add(at(createKid(), 1, 0, 3, Math.PI));
            return { update: t => { const x = -30 + t * 2.4; h.position.set(x + 5, 0, 4); h.rotation.y = Math.PI / 2; h.gallop(t, 0.35); cart.position.set(x, 0, 4); if (t < 3) { kid.inner.position.y = -1.3; pose(kid, { ll: -1.5, rl: -1.5 }); } else { kid.inner.position.y = 0; if (t > 7) pose(kid, { nod: -0.4, ra: -1.6 }); else idle(kid, t); } } };
        }
    },
    {
        title: "3. Hundreds of Clocks",
        desc: "The bell above the door jingles as Mohamed steps inside. The shop is warm and smells of oil and wood. Clocks cover every wall, big and small, round and tall, and all of them tick together like one great heartbeat. On the workbench, a lamp shines on something small and golden.",
        camPos: [6, 7, 18], camLookAt: [0, 5, -6], skyColor: 0x1a120a, mood: 'indoor', ground: false,
        setup: () => {
            add(createClockShop());
            const kid = add(at(createKid(), 10, 0, 6, -2.4));
            return { update: t => { walkTo(kid, 4, 0, 0.04) || idle(kid, t); kid.rig.head.rotation.y = Math.sin(t * 0.6) * 0.6; } };
        }
    },
    {
        title: "4. Master Yusuf",
        desc: "A man with curly black hair, round spectacles and a leather apron looks up from the bench. He has the kindest eyes, and a face that looks strangely like Mohamed's own. I am Yusuf, he says. Then he sees the cracked watch on Mohamed's chest, and his mouth falls open. Where did you get that? I am making that watch right now.",
        camPos: [3, 5.5, 8], camLookAt: [0, 3.6, -5], skyColor: 0x1a120a, mood: 'indoor', ground: false,
        setup: () => {
            add(createClockShop());
            const y = add(at(withMustache(yusuf()), -1, 0, -9.0, 0));
            const ow = add(createOpenWatch()); ow.position.set(-0.4, 3.0, -6.6); ow.rotation.x = -Math.PI / 2 + 0.3;
            const kid = add(at(createKid(), 1.8, 0, -2.6, Math.PI + 0.3));
            return { update: t => { if (t < 4) pose(y, { la: -1.2, ra: -1.2, nod: 0.5 }); else { pose(y, { nod: 0 }); if (t > 8) shock(y); } idle(kid, t); } };
        }
    },
    {
        title: "5. Two Watches",
        desc: "Yusuf holds the two watches side by side. One is shiny and new, its back still open, its seven slots empty. The other is old and scratched, cracked across the face, with six glowing gems. They are the same watch. A watch that mends time, Yusuf whispers. Each gem is one fix, one kindness to the world. And yours is nearly full.",
        camPos: [0, 4.4, 5], camLookAt: [0, 3.6, -1], skyColor: 0x1a120a, mood: 'indoor', ground: false,
        setup: () => {
            add(createClockShop());
            const y = add(at(withMustache(yusuf()), 0, 0, -2.4, 0));
            const ow = add(createOpenWatch()); const old = add(createWatch()); old.setGems(6); old.scale.setScalar(1.3);
            const crack = add(box(0.9, 0.05, 0.03, glowMat(0xffffff)));
            return { update: t => { pose(y, { la: -1.4, ra: -1.4, laz: 0.2, raz: -0.2, nod: 0.25 }); const a = new THREE.Vector3(), b = new THREE.Vector3(); y.rig.leftArmGroup.children[1].getWorldPosition(a); y.rig.rightArmGroup.children[1].getWorldPosition(b); ow.position.set(a.x, a.y + 0.5, a.z + 0.4); old.position.set(b.x, b.y + 0.5, b.z + 0.4); crack.position.set(b.x, b.y + 0.5, b.z + 0.5); crack.rotation.z = 0.6; old.setPower(-2); } };
        }
    },
    {
        title: "6. Silas the Apprentice",
        desc: "In the corner, a young man in a grey waistcoat is sweeping the floor. He keeps glancing at the new watch with hungry eyes. That is Silas, my apprentice, says Yusuf softly. He is clever, very clever. But he is in a hurry to be great, and he does not yet understand that a watch like this is for helping, not for owning.",
        camPos: [-4, 6, 12], camLookAt: [-6, 3.5, -2], skyColor: 0x1a120a, mood: 'indoor', ground: false,
        setup: () => {
            add(createClockShop());
            const s = add(at(youngSilas(), -9, 0, -2, 0.8));
            const broom = add(group(box(0.1, 3.4, 0.1, 0x7a5232, 0, 0, 0), box(0.9, 0.5, 0.3, 0xc9a24a, 0, -1.8, 0)));
            const y = add(at(withMustache(yusuf()), -2, 0, -4, -0.6)); const kid = add(at(createKid(), -3.5, 0, 0.5, -0.9));
            return { update: t => { const sw = Math.sin(t * 3); pose(s, { la: -0.9 + sw * 0.3, ra: -0.6 + sw * 0.3 }); const hp = new THREE.Vector3(); s.rig.rightArmGroup.children[1].getWorldPosition(hp); broom.position.set(hp.x, hp.y - 0.6, hp.z + 0.3); broom.rotation.z = sw * 0.3; s.rig.head.rotation.y = t > 4 ? 0.9 : 0; idle(y, t); idle(kid, t, 1); } };
        }
    },
    {
        title: "7. The Door Bursts Open",
        desc: "Suddenly the door flies open. A freezing wind howls in, full of purple sparks. Every clock in the shop chimes at once. In the doorway stands a tall man in a long grey coat, his cracked purple watch held high. Silas drops his broom. The man in grey looks exactly like Silas, only much, much older.",
        camPos: [0, 7, 16], camLookAt: [6, 4, -2], skyColor: 0x1a120a, mood: 'indoor', ground: false,
        setup: () => {
            add(createClockShop());
            const col = add(at(createCollector(), 15, 0, 2, -Math.PI / 2));
            const sparks = add(createBurst(0xb05cff, 200, 0.2)); sparks.position.set(15, 4, 2);
            const s = add(at(youngSilas(), 4, 0, -2, Math.PI / 2 - 0.3)); const y = add(at(withMustache(yusuf()), 0, 0, -4, 0.8)); const kid = add(at(createKid(), 2, 0, 2.4, 1.2));
            let fired = false;
            return { update: t => { if (t > 1 && !fired) { fired = true; sparks.fire(); flashScreen('#b05cff', 800); } if (t > 2) walkTo(col, 10, 1, 0.03) || holdUp(col); col.watch.pulse(); [s, y, kid].forEach((a, i) => t > 1.5 ? shock(a) : idle(a, t, i)); } };
        }
    },
    {
        title: "8. Time Stands Still",
        desc: "The man in grey twists his purple watch. Instantly, the world freezes. The pendulums stop mid swing. Snowflakes hang in the air outside the window. Yusuf and Silas stand as still as statues. Only two things in the whole world still move: the man in grey, and Mohamed, protected by the glow of his own watch.",
        camPos: [2, 7, 16], camLookAt: [4, 4, -3], skyColor: 0x0a0a1a, mood: 'dark', ground: false,
        setup: () => {
            const shop = add(createClockShop());
            const col = add(at(createCollector(), 10, 0, 1, -Math.PI / 2)); const s = add(at(youngSilas(), 4, 0, -2, Math.PI / 2 - 0.3)); const y = add(at(withMustache(yusuf()), 0, 0, -4, 0.8)); const kid = add(at(createKid(), 2, 0, 2.4, 1.2));
            const tint = add(createGlow(0x7a2bd6, 40, 0.0)); tint.position.set(4, 5, -2);
            const bub = add(new THREE.Mesh(new THREE.SphereGeometry(2.6, 20, 14), new THREE.MeshBasicMaterial({ color: 0x6fd3ff, transparent: true, opacity: 0.0, depthWrite: false }))); bub.position.set(2, 2, 2.4);
            return { update: t => { shock(s); shock(y); holdUp(col); col.watch.pulse(); if (t > 2) { freezeShop(shop, true); tint.material.opacity = 0.18 * ease(t, 2, 3); bub.material.opacity = 0.15 * ease(t, 2, 3); } if (t > 5) { kid.rig.head.rotation.y = Math.sin(t * 0.8) * 0.7; idle(kid, t); } else shock(kid); } };
        }
    },
    {
        title: "9. Silas Grey",
        desc: "The man in grey takes off his hat. Yes, he says. I was his apprentice once. Silas Grey. He would not let me use his watch to make myself rich and powerful. So I built my own watch, in secret. But mine never mended anything. It only ever broke things. And every time you lit a gem, my watch cracked a little more.",
        camPos: [5, 6, 14], camLookAt: [6, 4, 0], skyColor: 0x0a0a1a, mood: 'dark', ground: false,
        setup: () => {
            const shop = add(createClockShop()); freezeShop(shop, true);
            const col = add(at(createCollector({ hat: null }), 8.6, 0, 0, -Math.PI / 2 - 0.2));
            const hat = add(group(cyl(1.15, 1.15, 0.07, 0x2b2d31, 0, 0, 0, 20), cyl(0.6, 0.68, 0.62, 0x2b2d31, 0, 0.32, 0, 16)));
            const kid = add(at(createKid(), 3.6, 0, 0.4, Math.PI / 2 - 0.1));
            const tint = add(createGlow(0x7a2bd6, 40, 0.18)); tint.position.set(4, 5, -2);
            return { update: t => { pose(col, { la: -1.2, laz: 0.3, nod: t > 8 ? 0.4 : 0 }); const hp = new THREE.Vector3(); col.rig.leftArmGroup.children[1].getWorldPosition(hp); hat.position.copy(hp); hat.rotation.x = 1.2; col.watch.pulse(); col.watch.setPower(0.3); idle(kid, t); } };
        }
    },
    {
        title: "10. Never Finished",
        desc: "If that watch is never finished, says Silas Grey, pointing at the bench, then none of your fixes will ever have happened. No gems. No watch. No boy. He steps towards the bench where the new watch lies. Mohamed is closer. He dives, and his fingers close around it first.",
        camPos: [4, 6, 9], camLookAt: [0, 3, -5], skyColor: 0x0a0a1a, mood: 'dark', ground: false,
        setup: () => {
            const shop = add(createClockShop()); freezeShop(shop, true);
            const col = add(at(createCollector({ hat: null }), 6, 0, -3, -Math.PI / 2));
            const ow = add(createOpenWatch()); ow.position.set(-0.4, 3.0, -6.6); ow.rotation.x = -Math.PI / 2 + 0.3;
            const kid = add(at(createKid(), 2, 0, -1.6, Math.PI + 0.6));
            const tint = add(createGlow(0x7a2bd6, 40, 0.18)); tint.position.set(4, 5, -2);
            return { update: t => { if (t < 5) point(col, t); else walkTo(col, 2.4, -4.6, 0.03); col.watch.pulse(); if (t > 6) { const k = ease(t, 6, 7.5); kid.position.set(lerp(2, 0.4, k), Math.sin(k * Math.PI) * 0.8, lerp(-1.6, -4.8, k)); pose(kid, { la: -2.6, ra: -2.6 }); if (k >= 1) { kid.position.y = 0; holdUp(kid); const hp = new THREE.Vector3(); kid.rig.rightArmGroup.children[1].getWorldPosition(hp); ow.position.copy(hp); ow.position.y += 0.5; ow.rotation.x = 0; } } else idle(kid, t); } };
        }
    },
    {
        title: "11. Through the Frozen Clocks",
        desc: "Mohamed runs. He ducks between the tall clocks, around their frozen pendulums, past Silas the apprentice standing still as a statue with his mouth open. The man in grey follows, slow and steady, his coat brushing the floorboards. You cannot run from time, boy.",
        camPos: [0, 8, 16], camLookAt: [0, 3, -4], skyColor: 0x0a0a1a, mood: 'dark', ground: false,
        setup: () => {
            const shop = add(createClockShop()); freezeShop(shop, true);
            for (let i = 0; i < 5; i++) { const c = add(createTallClock(-10 + i * 5, -1 + (i % 2) * 3, 8)); c.frozen = true; c.pend.rotation.z = 0.2; }
            const s = add(at(youngSilas(), 6, 0, 4, 0.3)); shock(s);
            const kid = add(at(createKid(), -12, 0, 3)); const col = add(at(createCollector({ hat: null }), -16, 0, 2));
            const tint = add(createGlow(0x7a2bd6, 40, 0.18)); tint.position.set(0, 5, -2);
            return { update: t => { const x = -12 + t * 1.3; kid.position.set(x, 0, 3 + Math.sin(t * 1.5) * 2.5); kid.rotation.y = Math.PI / 2 + Math.cos(t * 1.5) * 0.6; run(kid, t); walkTo(col, kid.position.x - 5, kid.position.z, 0.05); col.watch.pulse(); } };
        }
    },
    {
        title: "12. The Crack Spreads",
        desc: "Mohamed's own watch gives a horrible crunch. The crack across its face spreads into three. Its blue light flickers and dims. Without your watch, says Silas Grey quietly, you will be stuck here forever, frozen like the rest. Mohamed backs against the workbench. He is out of places to run.",
        camPos: [-3, 5, 8], camLookAt: [0.5, 3.4, -3], skyColor: 0x0a0a1a, mood: 'dark', ground: false,
        setup: () => {
            const shop = add(createClockShop()); freezeShop(shop, true);
            const kid = add(at(createKid(), 0, 0, -4.2, 0)); const col = add(at(createCollector({ hat: null }), 2.6, 0, -0.6, Math.PI + 0.6));
            const cracks = [0.6, -0.5, 1.6].map(r => { const c = add(box(0.75, 0.04, 0.03, glowMat(0xffffff))); c.rotation.z = r; return c; });
            const tint = add(createGlow(0x7a2bd6, 40, 0.2)); tint.position.set(0, 5, -2);
            return { update: t => { const wp = new THREE.Vector3(); kid.watch.getWorldPosition(wp); cracks.forEach((c, i) => { c.position.set(wp.x, wp.y, wp.z + 0.07); c.visible = t > 1 + i * 2; }); kid.watch.setPower(Math.max(0.05, 1 - t * 0.1)); pose(kid, { la: -0.5, ra: -0.5, laz: -0.4, raz: 0.4 }); col.watch.pulse(); holdUp(col); } };
        }
    },
    {
        title: "13. Six Fixes",
        desc: "Mohamed closes his eyes. He thinks of everything the watch has taught him. A lodestone, found by noticing. Sticky rice, found by listening. A tunnel, stopped with a warning, not a fight. A tiny hole, measured with patience. A rope, not a weapon. A plastic pen, at just the right moment. Every fix began with paying attention.",
        camPos: [0, 4, 9], camLookAt: [0, 3.5, 0], skyColor: 0x05030a, mood: 'vortex', ground: false,
        setup: () => {
            add(createStars(600, 200));
            const kid = add(at(createKid(), 0, 0.6, 0, 0));
            const orbs = GEM_COLORS.slice(0, 6).map((c, i) => { const o = add(group(new THREE.Mesh(new THREE.OctahedronGeometry(0.5, 0), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.9 })), createGlow(c, 3, 0.6))); return o; });
            return { update: t => { pose(kid, { nod: 0.2, la: -0.2, ra: -0.2 }); orbs.forEach((o, i) => { const a = t * 0.6 + i * Math.PI / 3; o.position.set(Math.cos(a) * 4, 3.5 + Math.sin(t * 1.2 + i) * 0.6, Math.sin(a) * 4); o.rotation.y = t * 2; o.visible = t > i * 1.6; }); } };
        }
    },
    {
        title: "14. The Missing Piece",
        desc: "His eyes snap open. Inside his backpack is a small brass gear, the gift from al-Jazari. Mohamed flips his cracked watch open on the bench. One tiny gear inside is snapped in two. With Yusuf's tweezers he lifts it out, and fits in the gear from eight hundred years ago. It slips into place as if it was always meant to be there.",
        camPos: [0, 4.6, 3.6], camLookAt: [0, 2.9, -1], skyColor: 0x0a0a1a, mood: 'dark', ground: false,
        setup: () => {
            add(box(10, 0.3, 4, 0x7a5232, 0, 2.6, -1));
            const lamp = add(createGlow(0xffe0a0, 6, 0.4)); lamp.position.set(0, 5, -1);
            const w = add(createWatch()); w.setGems(6); w.scale.setScalar(2.4); w.position.set(-0.8, 2.9, -1); w.rotation.x = -Math.PI / 2;
            const inner = add(group()); inner.position.set(1.4, 2.82, -1);
            const big = createGear(0.45, 12); big.rotation.x = -Math.PI / 2; inner.add(big);
            const broken = createGear(0.22, 8, 0x8a7a4a); broken.rotation.x = -Math.PI / 2; broken.position.set(0.62, 0.02, 0.1); inner.add(broken);
            const good = createGear(0.22, 8); good.rotation.x = -Math.PI / 2; add(good);
            const tw = add(group(box(0.05, 0.05, 1.4, 0x9a9a9a, -0.04, 0, 0), box(0.05, 0.05, 1.4, 0x9a9a9a, 0.04, 0, 0)));
            return { update: t => { big.rotation.z = t > 9 ? t * 0.6 : 0; const kOut = ease(t, 2, 4); broken.position.set(0.62 + kOut * 1.4, 0.02 + kOut * 0.6, 0.1); broken.visible = t < 4.5; const kIn = ease(t, 6, 9); good.position.set(lerp(3.6, 2.02, kIn), lerp(3.6, 2.84, kIn), lerp(0, -0.9, kIn)); good.rotation.z = t > 9 ? -t * 1.1 : 0; tw.position.set(t < 5 ? broken.position.x + 1.4 : good.position.x, (t < 5 ? broken.position.y : good.position.y) + 0.4, -0.3); if (t > 9.5 && !w.done) { w.done = 1; flashScreen('#9be7ff', 700); } } };
        }
    },
    {
        title: "15. Mended",
        desc: "Mohamed snaps the back shut. A wave of blue light ripples out across the watch face, and one by one the cracks melt away like frost in the sun. The watch ticks forwards again, strong and steady. Around the shop, the frozen pendulums shiver, and slowly begin to swing.",
        camPos: [2, 6, 13], camLookAt: [0, 4, -3], skyColor: 0x1a120a, mood: 'indoor', ground: false,
        setup: () => {
            const shop = add(createClockShop()); freezeShop(shop, true);
            const kid = add(at(createKid(), 0, 0, -3.8, 0.2)); const col = add(at(createCollector({ hat: null }), 4, 0, -1, -2.2));
            const y = add(at(withMustache(yusuf()), -4, 0, -3, 0.9)); const s = add(at(youngSilas(), -6, 0, 0, 1.2));
            const wave1 = add(new THREE.Mesh(new THREE.TorusGeometry(1, 0.12, 6, 40), glowMat(0x9be7ff, 0.7))); wave1.rotation.x = Math.PI / 2;
            const tint = add(createGlow(0x7a2bd6, 40, 0.18)); tint.position.set(0, 5, -2);
            return { update: t => { pose(kid, { la: -1.1, laz: 0.4, nod: 0.3 }); kid.watch.setPower(1 + ease(t, 1, 3) * 3); kid.watch.pulse(); const k = ((t - 1) * 0.5) % 1; wave1.position.set(0, 2.2, -3.8); wave1.scale.setScalar(t > 1 ? 1 + k * 18 : 0.01); wave1.material.opacity = 0.7 * (1 - k); tint.material.opacity = 0.18 * (1 - ease(t, 3, 6)); if (t > 6) { freezeShop(shop, false); idle(y, t); idle(s, t, 1); } else { shock(y); shock(s); } if (t > 4) shock(col); else holdUp(col); } };
        }
    },
    {
        title: "16. An Open Hand",
        desc: "Silas Grey stares at Mohamed's watch, then at his own crumbling one. Mohamed does not run, and he does not fight. He holds out his hand. It is not too late, he says. You can mend things too. Beside the bench, Master Yusuf puts a gentle hand on young Silas's shoulder. Patience, Silas, he says. We will build great things together. The right way.",
        camPos: [0, 5.5, 12], camLookAt: [0, 3.8, -2], skyColor: 0x1a120a, mood: 'indoor', ground: false,
        setup: () => {
            const shop = add(createClockShop());
            const kid = add(at(createKid(), -1.4, 0, -1, Math.PI / 2)); const col = add(at(createCollector({ hat: null }), 2, 0, -1, -Math.PI / 2));
            const y = add(at(withMustache(yusuf()), -6.4, 0, -3.4, 0.5)); const s = add(at(youngSilas(), -4.6, 0, -2.6, -0.3));
            return { update: t => { shake(kid, 0); pose(kid, { ra: -1.1 }); if (t > 7) { pose(col, { nod: 0.35, la: -0.3, ra: -0.6 }); } else pose(col, { la: -1.3, laz: 0.2 }); col.watch.setPower(0.1); if (t > 9) { pose(y, { la: -2.3, laz: -0.9 }); pose(s, { nod: 0.2 }); s.rotation.y = lerpAngle(s.rotation.y, 2.2, 0.03); } else { idle(y, t); idle(s, t, 1); } } };
        }
    },
    {
        title: "17. The Seventh Gem",
        desc: "Young Silas looks up at his teacher, and slowly, he smiles. In that moment, Mohamed's watch rings like a bell. A violet gem, the very last one, glows into the seventh slot. All seven shine together: red, orange, yellow, green, sky blue, deep blue and violet. A rainbow of fixes. The watch is complete.",
        camPos: [0, 4.4, 7.5], camLookAt: [0, 3, 0], skyColor: 0x1a120a, mood: 'indoor', ground: false, gems: 7, gemMoment: true,
        setup: () => {
            add(createClockShop());
            const kid = add(at(createKid(), 0, 0, 0, 0.1));
            let lit = false;
            return { update: t => { if (t > 3 && !lit) { lit = true; lightGem(kid, 7); } if (t > 3) pose(kid, { la: -1.1, laz: 0.4, nod: 0.3 }); else idle(kid, t); if (t > 4) kid.watch.setPower(3 + Math.sin(t * 3)); } };
        }
    },
    {
        title: "18. Like Mist in the Morning",
        desc: "Silas Grey's dark watch crumbles into glittering purple dust. He looks down at his empty hands, and for the first time, he smiles. Thank you, boy, he says. I think I will remember differently now. Then, gently, like mist in the morning sun, the man in the grey coat fades away. His story has changed. Young Silas will grow up to be a mender, not a breaker.",
        camPos: [3, 5.5, 10], camLookAt: [2, 4, -1], skyColor: 0x1a120a, mood: 'indoor', ground: false,
        setup: () => {
            add(createClockShop());
            const col = add(at(createCollector({ hat: null }), 2, 0, -1, -0.4));
            const dust = add(createBurst(0xb05cff, 220, 0.08)); let fired = false;
            const mats = []; col.traverse(o => { if (o.isMesh) { o.material = o.material.clone(); o.material.transparent = true; mats.push(o.material); } });
            return { update: t => { const wp = new THREE.Vector3(); col.watch.getWorldPosition(wp); if (t > 2 && !fired) { fired = true; dust.position.copy(wp); dust.fire(); col.watch.visible = false; } if (t > 4) pose(col, { nod: 0.1, la: -1.2, ra: -1.2 }); else pose(col, { ra: -1.6, raz: -0.6, nod: 0.4 }); const f = 1 - ease(t, 9, 14); mats.forEach(m => m.opacity = f); col.position.y = (1 - f) * 2; col.visible = f > 0.02; } };
        }
    },
    {
        title: "19. When Time Breaks, Mend It",
        desc: "Master Yusuf picks up the brand new watch and carves words into its back with a tiny tool: When time breaks, mend it. He wraps it in faded velvet and lays it in a wooden trunk with brass corners. For whoever in our family needs it, he says, and winks at Mohamed. Mohamed's eyes go wide. It is the very same trunk from Grandpa's attic.",
        camPos: [3, 5.5, 9], camLookAt: [0, 2.6, -3], skyColor: 0x1a120a, mood: 'indoor', ground: false,
        setup: () => {
            add(createClockShop());
            const trunk = add(at(createTrunk(), 0, 0, -3)); trunk.lid.rotation.x = -1.6; trunk.glow.scale.setScalar(3);
            const y = add(at(withMustache(yusuf()), -2.6, 0, -2.6, 1.0)); const s = add(at(youngSilas(), -4.4, 0, -0.6, 1.2)); const kid = add(at(createKid(), 3, 0, -0.4, -1.4));
            const w = add(createOpenWatch());
            return { update: t => { if (t < 6) { pose(y, { ra: -1.4, la: -1.2 + Math.sin(t * 8) * 0.1, nod: 0.4 }); const hp = new THREE.Vector3(); y.rig.leftArmGroup.children[1].getWorldPosition(hp); w.position.set(hp.x + 0.4, hp.y + 0.4, hp.z + 0.4); } else { const k = ease(t, 6, 9); w.position.set(lerp(w.position.x, 0, 0.05), lerp(w.position.y, 1.8, 0.05), lerp(w.position.z, -3, 0.05)); pose(y, { ra: -1.3, la: -1.3 }); } if (t > 9) { trunk.lid.rotation.x = -1.6 * (1 - ease(t, 9, 11)); } if (t > 11) { pose(y, {}); y.rig.head.rotation.y = 0.8; } idle(s, t, 1); if (t > 11) shock(kid); else idle(kid, t); } };
        }
    },
    {
        title: "20. Home",
        desc: "The watch ticks, warm and steady, and a ring of clear blue light opens one last time. Mohamed hugs Yusuf goodbye and shakes young Silas's hand. Then he steps through, and lands with a soft bump in Grandpa's dusty attic. Rain is still tapping on the round window. Not a single minute has passed.",
        camPos: [0, 7, 18], camLookAt: [0, 4, 0], skyColor: 0x2a1f16, mood: 'attic', ground: false,
        setup: () => {
            add(createAttic()); add(createDust(200, 30, 14, 20));
            const portal = add(createPortal(3)); portal.position.set(0, 3.4, 0); portal.setPower(1);
            const kid = add(at(createKid(), 0, 0, 0, 0)); kid.scale.setScalar(0.01);
            const trunk = add(at(createTrunk(), -6, 0, -3)); trunk.glow.visible = false;
            return { update: t => { portal.setPower(1 - ease(t, 3, 6)); kid.scale.setScalar(Math.min(1, 0.01 + ease(t, 0.5, 2.5))); if (t > 6) { kid.rig.head.rotation.y = Math.sin(t * 0.7) * 0.6; idle(kid, t); } else pose(kid, { la: -0.3, ra: -0.3 }); if (t > 10) pose(kid, { la: -1.1, laz: 0.4, nod: 0.3 }); } };
        }
    },
    {
        title: "21. Grandpa's Smile",
        desc: "Mohamed climbs down the ladder. Grandpa looks up from his newspaper and sees the watch, glowing with all seven gems. He does not look surprised at all. He just smiles, slowly, the way he always does, as if he knew all along. Your great great grandfather used to say something, Grandpa says. When time breaks, mend it.",
        camPos: [6, 7, 18], camLookAt: [4, 4, -4], skyColor: 0x2a2a35, mood: 'indoor', ground: false,
        setup: () => {
            add(createLivingRoom());
            const gp = add(at(createGrandpa(), 8, 1.1, -5.3)); const paper = add(box(2.6, 1.8, 0.05, 0xf2efe6, 8, 3.4, -3.6));
            const kid = add(at(createKid(), 1, 0, 0, 0.8));
            return { update: t => { pose(gp, { ll: -1.4, rl: -1.4, la: -0.5, ra: -0.5 }); paper.position.y = 3.4; if (t < 3) walkTo(kid, 4.4, -2.4, 0.05); else { face(kid, 8, -5.3); pose(kid, { la: -1.1, laz: 0.4 }); } gp.rig.head.rotation.y = -0.4; if (t > 9) { gp.rig.head.rotation.x = Math.sin(t * 2) * 0.05 + 0.1; } } };
        }
    },
    {
        title: "22. The Sun Comes Out",
        desc: "Outside, the rain finally stops. A bright beam of sunshine spills through the window and lands on the old photograph on the wall: Yusuf Clocks, eighteen ninety nine. Mohamed looks closer. In the shop window of the photo, very small, there is a boy in a red hoodie, waving. He grins, tucks the watch safely under his hoodie, and runs outside to play. The end.",
        camPos: [6, 7, 14], camLookAt: [8, 6, -9], skyColor: 0x2a2a35, mood: 'indoor', ground: false,
        setup: () => {
            add(createLivingRoom());
            const beam = add(createGlow(0xfff2c8, 2, 0.0)); beam.position.set(9, 8, -10.2);
            const tinyKid = add(box(0.18, 0.35, 0.05, glowMat(0xc8102e), 9.9, 7.6, -10.5));
            const kid = add(at(createKid(), 7, 0, -4, Math.PI)); const gp = add(at(createGrandpa(), 3, 0, -2, 0.6));
            return { update: t => { beam.scale.setScalar(2 + ease(t, 1, 5) * 12); beam.material.opacity = 0.35 * ease(t, 1, 5); if (t < 10) { pose(kid, { nod: -0.2 }); } else { kid.rotation.y = lerpAngle(kid.rotation.y, 0.4, 0.05); wave(kid, t); } idle(gp, t); if (t > 11) wave(gp, t); } };
        }
    }
];

window.TRAILER = {
    open: "Six gems. One empty slot...",
    shots: [
        [1, 4, 3.4, "Something is breaking."],
        [2, 6, 3.6, "A snowy street. A familiar name."],
        [3, 5, 3.2, "Where it all began."],
        [4, 6, 3.4, "A face from the past."],
        [7, 3, 3.8, "And the final fix."]
    ]
};
