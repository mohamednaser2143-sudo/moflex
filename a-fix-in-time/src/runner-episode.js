// Episode wrapper: "Play episode" screen, title card, then the scenes, then credits.
(function () {
    const E = window.SHOW_INFO;
    autoPlay = false; narratorEnabled = false; if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const ui = document.getElementById('story-ui'); if (ui) ui.style.visibility = 'hidden';
    const hud = document.getElementById('gem-hud'); if (hud) hud.style.visibility = 'hidden';
    const css = document.createElement('style');
    css.textContent = `
      #ep-start,#ep-card,#ep-credits{position:fixed;inset:0;z-index:40;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#f3eee4;font-family:Georgia,serif}
      #ep-start{background:radial-gradient(ellipse at 50% 120%,#123a52 0%,#000 65%);cursor:pointer;gap:2.6vh}
      #ep-start .series{color:#e8b54a;font-size:clamp(14px,1.8vw,22px);letter-spacing:.35em;text-transform:uppercase}
      #ep-start .name{font-size:clamp(28px,5vw,64px);font-weight:700;padding:0 5vw}
      #ep-start .play{margin-top:2vh;background:#e8b54a;color:#1a1408;font:800 clamp(16px,2vw,24px) Arial,sans-serif;padding:1.4vh 3.2vw;border-radius:999px;border:0;cursor:pointer;text-transform:none}
      #ep-card{opacity:0;transition:opacity .9s;pointer-events:none;gap:2vh}
      #ep-card .num{color:#e8b54a;font-size:clamp(18px,2.6vw,34px);letter-spacing:.4em}
      #ep-card .title{font-size:clamp(36px,7vw,96px);font-weight:700;line-height:1.05;padding:0 6vw}
      #ep-card .rule{width:min(320px,40vw);height:1px;background:#4fc3ff;opacity:.7}
      #ep-credits{display:none;overflow:hidden;justify-content:flex-start}
      #ep-roll{position:absolute;left:0;right:0;top:100%;display:flex;flex-direction:column;align-items:center;gap:5vh;padding-bottom:10vh}
      #ep-roll .head{color:#e8b54a;font-size:clamp(28px,5vw,60px);font-weight:700;letter-spacing:.08em}
      #ep-roll .sub{font-size:clamp(16px,2.2vw,28px);opacity:.85}
      #ep-roll .role{font:600 clamp(12px,1.5vw,18px) Arial,sans-serif;letter-spacing:.3em;color:#bfb6a4;text-transform:uppercase}
      #ep-roll .who{font-size:clamp(22px,3vw,40px);margin-top:.6vh}
      #ep-thanks{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4vh;opacity:0;transition:opacity 1.6s}
      #ep-thanks .t{color:#e8b54a;font-size:clamp(34px,6.5vw,90px);font-weight:700}
      #ep-thanks .btns{display:flex;gap:2vw;opacity:0;transition:opacity 1s;flex-wrap:wrap;justify-content:center}
      #ep-thanks button{background:transparent;color:#f3eee4;border:1px solid #e8b54a;font:700 clamp(14px,1.6vw,20px) Arial,sans-serif;padding:1.2vh 2.4vw;border-radius:999px;cursor:pointer;text-transform:none}
      #ep-thanks button.primary{background:#e8b54a;color:#1a1408}`;
    document.head.appendChild(css);
    const div = (id, html) => { const d = document.createElement('div'); d.id = id; d.innerHTML = html; document.body.appendChild(d); return d; };
    const start = div('ep-start', `<div class="series">${E.series}</div><div class="name">Episode ${E.num}: ${E.title}</div><button class="play">▶ Play episode</button>`);
    const card = div('ep-card', `<div class="num">EPISODE ${E.num}</div><div class="rule"></div><div class="title">${E.title}</div>`);
    const credits = div('ep-credits', `<div id="ep-roll"></div><div id="ep-thanks"><div class="t">Thanks For Watching</div><div class="btns"><button class="primary" id="ep-again">↻ Watch again</button><button id="ep-back">Back to MoFlex</button></div></div>`);
    const roles = [['Created by', 'Mohamed'], ['Directed by', 'Mohamed'], ['Written by', 'Mohamed'], ['Story by', 'Mohamed'], ['Produced by', 'Mohamed'], ['Animation by', 'Mohamed'], ['Characters designed by', 'Mohamed'], ['Edited by', 'Mohamed'], ['Narration script by', 'Mohamed'], ['Made by', 'Mohamed']];
    document.getElementById('ep-roll').innerHTML = `<div class="head">${E.series}</div><div class="sub">Episode ${E.num}: ${E.title}</div>` + roles.map(([r, w]) => `<div><div class="role">${r}</div><div class="who">${w}</div></div>`).join('') + `<div class="sub" style="margin-top:4vh">A MoFlex original</div>`;
    function say(text) { if (!('speechSynthesis' in window)) return; window.speechSynthesis.cancel(); try { loadNarratorVoice(); } catch (e) { } const u = new SpeechSynthesisUtterance(text); if (narratorVoice) u.voice = narratorVoice; u.rate = 0.9; u.pitch = 0.9; window.speechSynthesis.speak(u); }
    const wait = ms => new Promise(r => setTimeout(r, ms));
    let rolling = false;
    async function begin() {
        start.style.display = 'none'; credits.style.display = 'none'; rolling = false;
        card.style.opacity = '1'; await wait(900); say(`Episode ${E.num}. ${E.title}.`); await wait(4200); card.style.opacity = '0';
        fadeEl.style.opacity = '1'; loadScene(0, false); if (ui) ui.style.visibility = 'visible'; if (hud) hud.style.visibility = 'visible';
        narratorEnabled = true; autoPlay = true; document.getElementById('narrator-btn').innerText = 'Narrator: ON'; document.getElementById('autoplay-btn').innerText = 'Autoplay: ON';
        narratorUnlocked = true; speakScene(storyData[0]); sceneStartTime = Date.now(); setTimeout(() => fadeEl.style.opacity = '0', 200);
    }
    async function rollCredits() {
        if (rolling) return; rolling = true; autoPlay = false; narratorEnabled = false; if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        fadeEl.style.opacity = '1'; await wait(700); if (ui) ui.style.visibility = 'hidden'; if (hud) hud.style.visibility = 'hidden';
        credits.style.display = 'flex'; const roll = document.getElementById('ep-roll'); const thanks = document.getElementById('ep-thanks'); thanks.style.opacity = '0'; thanks.querySelector('.btns').style.opacity = '0';
        roll.style.transition = 'none'; roll.style.transform = 'translateY(0)'; void roll.offsetHeight;
        const dist = roll.scrollHeight + window.innerHeight; const secs = Math.max(22, dist / 60);
        roll.style.transition = `transform ${secs}s linear`; roll.style.transform = `translateY(-${dist}px)`;
        await wait(secs * 1000); thanks.style.opacity = '1'; say('Thanks for watching.'); await wait(1800); thanks.querySelector('.btns').style.opacity = '1';
    }
    const baseNext = nextScene;
    nextScene = function () { if (rolling) return; if (currentSceneIndex >= storyData.length - 1) rollCredits(); else baseNext(); };
    window.rollCredits = rollCredits;
    start.addEventListener('click', begin);
    document.getElementById('ep-again').addEventListener('click', () => { credits.style.display = 'none'; fadeEl.style.opacity = '1'; begin(); });
    document.getElementById('ep-back').addEventListener('click', () => { if (window.parent !== window) window.parent.postMessage('moflex-back', '*'); else history.back(); });

    loadScene(0, false);
    animate();
})();
