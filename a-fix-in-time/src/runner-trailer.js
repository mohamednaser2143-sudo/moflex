// Trailer player: a few short shots from early scenes, black bars, booms, then "MOHAMED" and "Coming soon".
(function () {
    const T = window.TRAILER, E = window.SHOW_INFO;
    autoPlay = false; narratorEnabled = false; if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const ui = document.getElementById('story-ui'); if (ui) ui.style.display = 'none';
    const hud = document.getElementById('gem-hud'); if (hud) hud.style.display = 'none';
    const css = document.createElement('style');
    css.textContent = `
      .tr-bar{position:fixed;left:0;right:0;height:11vh;background:#000;z-index:20;transition:height .6s}
      #tr-top{top:0} #tr-bot{bottom:0}
      #tr-line{position:fixed;left:0;right:0;bottom:14vh;text-align:center;z-index:21;color:#fff;font:700 clamp(18px,3.4vw,40px)/1.2 Georgia,serif;letter-spacing:.04em;text-shadow:0 3px 18px #000,0 0 4px #000;opacity:0;transition:opacity .45s;padding:0 6vw}
      #tr-card{position:fixed;inset:0;background:#000;z-index:22;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;transition:opacity .5s;pointer-events:none;text-align:center;padding:0 6vw}
      #tr-card .big{color:#f2c12e;font:900 clamp(34px,8vw,110px)/1 Georgia,serif;letter-spacing:.12em;text-shadow:0 0 40px rgba(242,193,46,.45)}
      #tr-card .mid{color:#fff;font:700 clamp(16px,2.6vw,34px)/1.3 Georgia,serif;letter-spacing:.18em;margin-top:2.4vh;text-transform:uppercase}
      #tr-card .small{color:#bbb;font:600 clamp(13px,1.7vw,22px)/1.3 Arial,sans-serif;letter-spacing:.3em;margin-top:3vh;text-transform:uppercase}
      #tr-start{position:fixed;inset:0;z-index:30;background:rgba(0,0,0,.85);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2.5vh;cursor:pointer;text-align:center}
      #tr-start .s{color:#4fc3ff;font:700 clamp(12px,1.6vw,18px) Arial;letter-spacing:.35em;text-transform:uppercase}
      #tr-start .t{color:#f2c12e;font:900 clamp(26px,5vw,64px) Georgia,serif;letter-spacing:.1em;padding:0 5vw}
      #tr-start .b{color:#000;background:#f2c12e;font:800 clamp(16px,2.2vw,26px) Arial;padding:1.4vh 3vw;border-radius:999px;letter-spacing:.1em}`;
    document.head.appendChild(css);
    const mk = (id, cls) => { const d = document.createElement('div'); d.id = id; if (cls) d.className = cls; document.body.appendChild(d); return d; };
    mk('tr-top', 'tr-bar'); mk('tr-bot', 'tr-bar'); const line = mk('tr-line'); const card = mk('tr-card'); const start = mk('tr-start');
    const startHtml = btn => `<div class="s">${E.series} · Trailer</div><div class="t">Episode ${E.num}<br>${E.title}</div><div class="b">${btn}</div>`;
    start.innerHTML = startHtml('▶ PLAY TRAILER');
    fadeEl.style.transition = 'opacity 0.35s ease';
    // Sound: a low drone and a deep hit on every cut, made in the browser.
    let ac = null, drone = null;
    function audioStart() { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const g = ac.createGain(); g.gain.value = 0.0; g.connect(ac.destination); [55, 82.4, 110].forEach((f, i) => { const o = ac.createOscillator(); o.type = i === 2 ? 'triangle' : 'sine'; o.frequency.value = f; const og = ac.createGain(); og.gain.value = i === 2 ? 0.05 : 0.12; o.connect(og); og.connect(g); o.start(); o.stop(ac.currentTime + 40); }); g.gain.linearRampToValueAtTime(0.35, ac.currentTime + 3); drone = g; } catch (e) { } }
    function boom(strong = false) { if (!ac) return; const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(strong ? 90 : 70, ac.currentTime); o.frequency.exponentialRampToValueAtTime(30, ac.currentTime + 0.9); g.gain.setValueAtTime(strong ? 0.9 : 0.6, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 1.4); o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + 1.5); const n = ac.createBufferSource(); const buf = ac.createBuffer(1, ac.sampleRate * 0.4, ac.sampleRate); const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3); n.buffer = buf; const ng = ac.createGain(); ng.gain.value = strong ? 0.25 : 0.12; n.connect(ng); ng.connect(ac.destination); n.start(); }
    function audioEnd() { if (drone && ac) drone.gain.linearRampToValueAtTime(0.0, ac.currentTime + 2.5); }
    function say(text, rate = 0.88) { if (!('speechSynthesis' in window) || !text) return; window.speechSynthesis.cancel(); try { loadNarratorVoice(); } catch (e) { } const u = new SpeechSynthesisUtterance(text.replace(/\.\.\./g, ',')); if (narratorVoice) u.voice = narratorVoice; u.rate = rate; u.pitch = 0.82; window.speechSynthesis.speak(u); }
    const wait = ms => new Promise(r => setTimeout(r, ms));
    function ffwd(skip) { const steps = Math.round(skip * 60); for (let i = 0; i < steps; i++) stepScene(); }
    async function showCard(big, mid, small, ms, voice) { card.innerHTML = (big ? `<div class="big">${big}</div>` : '') + (mid ? `<div class="mid">${mid}</div>` : '') + (small ? `<div class="small">${small}</div>` : ''); card.style.opacity = '1'; boom(true); if (voice) say(voice); await wait(ms); card.style.opacity = '0'; await wait(450); }
    let running = false;
    async function runTrailer() {
        if (running) return; running = true;
        start.style.display = 'none'; audioStart(); card.style.opacity = '1'; card.innerHTML = ''; await wait(600);
        await showCard('', T.open, '', 2800, T.open);
        for (const [num, skip, hold, text] of T.shots) {
            fadeEl.style.opacity = '1'; await wait(350);
            loadScene(num - 1, false); ffwd(skip); fadeEl.style.opacity = '0'; boom(false);
            line.textContent = text; line.style.opacity = '1'; say(text); await wait(hold * 1000 - 500); line.style.opacity = '0'; await wait(500);
        }
        fadeEl.style.opacity = '1'; await wait(400);
        await showCard('MOHAMED', `Episode ${E.num} · ${E.title}`, E.series, 3800, `Mohamed. ${E.series}. Episode ${E.num}. ${E.title}.`);
        card.innerHTML = `<div class="big" style="font-size:clamp(28px,6vw,80px)">MOHAMED</div><div class="small">Coming soon</div>`; card.style.opacity = '1'; audioEnd(); await wait(2600);
        start.innerHTML = startHtml('↻ PLAY AGAIN'); start.style.display = 'flex'; card.style.opacity = '0'; fadeEl.style.opacity = '0'; running = false;
    }
    window.runTrailer = runTrailer;
    start.addEventListener('click', runTrailer);

    const first = T.shots[0];
    loadScene(first[0] - 1, false); ffwd(first[1]);
    setTimeout(() => { fadeEl.style.opacity = '0'; }, 100);
    animate();
})();
