// Everything MoFlex knows about its shows. Availability comes from availability.json (set in the admin site).
window.MOFLEX_CATALOG = {
  shows: [{
    id: 'tales-of-the-legend',
    folder: '',
    art: 'castle', sky: ['#e8a06a', '#2a1d3f'],
    title: 'Tales Of The Legend',
    tagline: 'From the first fire of the Ooga to the glass towers of Ginga, one man\u2019s journey across every age of the world.',
    episodes: [
      { n: 1, title: 'Ancient Beginnings', mins: 11, art: 'fire', sky: ['#f2a65a', '#7a3b2e'], blurb: 'A boy alone in an ancient world is found by a people called the Ooga.' },
      { n: 2, title: 'The Island Journey', mins: 14, art: 'island', sky: ['#9fd3e0', '#2a6f97'], blurb: 'Across the open sea, an island hides a village that is running out of water.' },
      { n: 3, title: 'The Gift of the Nile', mins: 15, art: 'pyramids', sky: ['#f4c47a', '#b5683c'], blurb: 'The land of the pharaohs is full of wonders, and not everyone trusts a stranger.' },
      { n: 4, title: 'The Island of Islands', mins: 13, art: 'islands', sky: ['#a8d8c8', '#1f6b6a'], blurb: 'On an island no map has ever shown, Mohamed dreams of a city of his own.' },
      { n: 5, title: 'Between Two Rivers', mins: 13, art: 'ziggurat', sky: ['#e9c891', '#8a5a2b'], blurb: 'Behind the tallest walls he has ever seen, a king wants proof of his courage.' },
      { n: 6, title: 'Ancient Rome', mins: 14, art: 'arches', sky: ['#d8e3ee', '#5f7f9e'], blurb: 'In a city of marble and law, leaders must answer to the people.' },
      { n: 7, title: 'The Rise and Fall of Al-Hums', mins: 20, art: 'castle', sky: ['#e39a5f', '#4a1a1a'], blurb: 'Far from home, a forest of strange trees holds a secret he will never forget.' },
      { n: 8, title: 'Ginga', mins: 13, art: 'city', sky: ['#b9d6ea', '#2b3a5a'], blurb: 'A new world of machines without horses, towers of glass, and a new friend.' }
    ]
  }, {
    id: 'a-fix-in-time',
    title: 'A Fix In Time',
    folder: 'a-fix-in-time/',
    art: 'clockshop', sky: ['#4a6fa5', '#1d1838'],
    tagline: 'A boy, a brass pocket watch with seven empty gems, and a man in a grey coat who wants to break time itself.',
    episodes: [
      { n: 1, title: 'The Watch', mins: 9, art: 'ship', sky: ['#8ecae6', '#1f6a9a'], blurb: 'In Grandpa\u2019s attic, Mohamed finds a strange pocket watch, and lands on a pirate ship in trouble.' },
      { n: 2, title: 'The Great Wall', mins: 9, art: 'greatwall', sky: ['#c7d3dd', '#6b8a52'], blurb: 'In old China, a new part of the Great Wall keeps falling down. What is missing?' },
      { n: 3, title: 'The Castle Siege', mins: 9, art: 'siege', sky: ['#a8b8c8', '#4f6a3a'], blurb: 'A castle surrounded by an army, and a sound coming from under the ground.' },
      { n: 4, title: 'The Elephant Clock', mins: 9, art: 'elephant', sky: ['#f2c88a', '#b5683c'], blurb: 'Al-Jazari\u2019s famous clock must work for the sultan\u2019s festival, but someone has other plans.' },
      { n: 5, title: 'The Wild West', mins: 9, art: 'train', sky: ['#f6c890', '#b5603c'], blurb: 'The school gold of a little desert town is on the noon train, and trouble is riding close behind.' },
      { n: 6, title: 'The Moon Landing', mins: 9, art: 'moon', sky: ['#1a1a2e', '#000000'], blurb: 'July 1969. Two astronauts, a tiny lunar module, and one very important switch.' },
      { n: 7, title: 'The Final Fix', mins: 9, art: 'clockshop', sky: ['#4a6fa5', '#1d1838'], blurb: 'The watch is breaking. Back to the clock shop where it was made, for the very last gem.' }
    ]
  }]
};
// Small hand-drawn style scenes used as artwork for each episode card.
window.MOFLEX_ART = function (kind, sky) {
  const g = `<defs><linearGradient id="s${kind}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs><rect width="320" height="180" fill="url(#s${kind})"/>`;
  const ink = '#1a1208';
  const shapes = {
    fire: `<circle cx="250" cy="70" r="26" fill="#ffd27a" opacity=".85"/><path d="M0 140 Q80 100 160 130 T320 120 V180 H0Z" fill="${ink}" opacity=".55"/><path d="M0 155 Q100 135 200 150 T320 148 V180 H0Z" fill="${ink}"/><path d="M150 150 q10 -30 20 -2 q8 -18 12 4 z" fill="#ff8a3a"/><path d="M158 150 q6 -16 12 0 z" fill="#ffd166"/>`,
    island: `<circle cx="80" cy="60" r="24" fill="#fff3c4" opacity=".9"/><rect y="130" width="320" height="50" fill="#1f5f86"/><ellipse cx="200" cy="132" rx="70" ry="14" fill="${ink}"/><path d="M200 128 q4 -40 -4 -64" stroke="${ink}" stroke-width="5" fill="none"/><path d="M196 64 q-30 -6 -44 10 M196 64 q20 -14 42 -4 M196 64 q-10 -20 -30 -22 M196 64 q16 -4 30 14" stroke="${ink}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    pyramids: `<circle cx="240" cy="62" r="28" fill="#fff0c0" opacity=".9"/><path d="M40 150 L110 70 L180 150Z M150 150 L210 88 L270 150Z" fill="${ink}" opacity=".85"/><rect y="148" width="320" height="32" fill="${ink}"/>`,
    islands: `<rect y="125" width="320" height="55" fill="#175a59"/><ellipse cx="80" cy="128" rx="40" ry="10" fill="${ink}"/><ellipse cx="180" cy="126" rx="60" ry="14" fill="${ink}"/><ellipse cx="275" cy="129" rx="30" ry="8" fill="${ink}"/><path d="M180 112 q2 -30 -6 -46 M174 66 q-20 -2 -30 10 M174 66 q16 -10 30 -2" stroke="${ink}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    ziggurat: `<circle cx="70" cy="56" r="22" fill="#fff0c0" opacity=".85"/><path d="M90 150 h140 v-18 h-20 v-18 h-20 v-18 h-20 v-14 h-20 v14 h-20 v18 h-20 v18 h-20z" fill="${ink}"/><rect y="148" width="320" height="32" fill="${ink}"/>`,
    arches: `<rect x="20" y="80" width="280" height="14" fill="${ink}"/>${[0, 1, 2, 3, 4].map(i => `<path d="M${30 + i * 56} 180 V112 a22 22 0 0 1 44 0 V180 h12 V94 h-68 V180z" fill="${ink}"/>`).join('')}`,
    castle: `<path d="M0 180 V120 L60 110 L90 130 V180Z" fill="${ink}"/><path d="M90 130 h150 v50 H90z" fill="${ink}"/><path d="M110 130 v-40 h24 v40 M200 130 v-40 h24 v40 M150 130 v-60 h30 v60" fill="${ink}"/><path d="M106 90 l16 -18 l16 18z M196 90 l16 -18 l16 18z M146 70 l19 -22 l19 22z" fill="#8b263e"/><rect y="160" width="320" height="20" fill="#2a1010"/>`,
    ship: `<rect y="130" width="320" height="50" fill="#16507a"/><path d="M90 128 h140 l-18 22 h-104z" fill="${ink}"/><path d="M160 128 V40 M120 128 V60 M200 128 V62" stroke="${ink}" stroke-width="4"/><path d="M164 46 q30 20 0 44z M164 92 q36 16 0 34z M124 66 q24 18 0 40z M204 68 q22 16 0 38z" fill="#f3eee4" opacity=".92"/>`,
    greatwall: `<path d="M0 150 L50 110 L100 130 L160 90 L220 120 L270 85 L320 105 V180 H0Z" fill="${ink}" opacity=".5"/><path d="M0 160 L50 122 L100 140 L160 102 L220 132 L270 97 L320 116" stroke="#e8dcc0" stroke-width="7" fill="none"/><rect x="152" y="84" width="16" height="20" fill="#e8dcc0"/><rect x="262" y="78" width="16" height="20" fill="#e8dcc0"/><path d="M0 165 Q160 140 320 168 V180 H0Z" fill="${ink}"/>`,
    siege: `<rect x="80" y="90" width="160" height="70" fill="${ink}"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${82 + i * 20}" y="82" width="10" height="10" fill="${ink}"/>`).join('')}<rect x="60" y="70" width="34" height="90" fill="${ink}"/><rect x="226" y="70" width="34" height="90" fill="${ink}"/><path d="M56 70 l21 -26 l21 26z M222 70 l21 -26 l21 26z" fill="#3a4f7a"/><path d="M0 162 H320 V180 H0Z" fill="#3a4a2a"/><path d="M20 160 l12 -20 l12 20z M280 160 l12 -20 l12 20z" fill="#8b1e2b"/>`,
    elephant: `<rect y="150" width="320" height="30" fill="${ink}"/><rect x="110" y="96" width="90" height="46" rx="10" fill="#8a8a90"/><rect x="190" y="90" width="34" height="40" rx="8" fill="#8a8a90"/><path d="M220 120 q14 20 4 34" stroke="#8a8a90" stroke-width="9" fill="none"/>${[118, 138, 172, 190].map(x => `<rect x="${x}" y="138" width="12" height="14" fill="#8a8a90"/>`).join('')}<rect x="130" y="56" width="50" height="40" fill="#f2ead8"/><path d="M130 56 a25 25 0 0 1 50 0z" fill="#c9a240"/><circle cx="155" cy="28" r="5" fill="#2a9d8f"/>`,
    train: `<path d="M0 120 h70 v-30 h40 v30 h210 V150 H0Z" fill="#b5603c" opacity=".5"/><rect y="150" width="320" height="30" fill="${ink}" opacity=".7"/><rect x="40" y="110" width="60" height="32" fill="#2a5a3a"/><rect x="104" y="110" width="60" height="32" fill="#8a3a1f"/><rect x="170" y="104" width="70" height="38" fill="#1d1d1d"/><rect x="230" y="84" width="14" height="22" fill="#1d1d1d"/><circle cx="237" cy="72" r="10" fill="#888" opacity=".7"/><circle cx="252" cy="58" r="13" fill="#999" opacity=".5"/>${[56, 86, 120, 150, 186, 222].map(x => `<circle cx="${x}" cy="146" r="7" fill="#7a1f1f"/>`).join('')}`,
    moon: `${[[30, 20], [80, 40], [140, 15], [210, 30], [290, 22], [260, 60], [50, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#fff"/>`).join('')}<circle cx="250" cy="44" r="16" fill="#2f6fd0"/><path d="M240 38 q8 -6 16 0" stroke="#fff" stroke-width="3" fill="none"/><path d="M0 140 Q160 120 320 140 V180 H0Z" fill="#8e8c88"/><rect x="132" y="98" width="40" height="22" fill="#d4a017"/><rect x="138" y="80" width="28" height="18" fill="#b8b8b8"/><path d="M132 120 l-12 18 M172 120 l12 18" stroke="#ccc" stroke-width="3"/>`,
    clockshop: `<rect x="40" y="40" width="240" height="140" fill="${ink}" opacity=".55"/><circle cx="160" cy="100" r="44" fill="#c9a240"/><circle cx="160" cy="100" r="36" fill="#4fc3ff"/><path d="M160 100 V74 M160 100 L178 110" stroke="#10203a" stroke-width="4" stroke-linecap="round"/>${['#ff4d5e', '#ff9f1c', '#ffd60a', '#4cd964', '#2ec4f1', '#3a6bff', '#b05cff'].map((c, i) => { const a = -Math.PI / 2 + (i + 0.5) * Math.PI * 2 / 7; return `<rect x="${160 + Math.cos(a) * 40 - 4}" y="${100 + Math.sin(a) * 40 - 4}" width="8" height="8" transform="rotate(45 ${160 + Math.cos(a) * 40} ${100 + Math.sin(a) * 40})" fill="${c}"/>`; }).join('')}<rect x="60" y="60" width="22" height="100" fill="#5a2a14"/><rect x="238" y="60" width="22" height="100" fill="#5a2a14"/>`,
    city: `${[[20, 70], [60, 40], [100, 90], [140, 30], [185, 60], [225, 20], [270, 75]].map(([x, h]) => `<rect x="${x}" y="${h + 30}" width="34" height="${150 - h}" fill="${ink}"/>`).join('')}<rect y="165" width="320" height="15" fill="${ink}"/>`
  };
  return `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${g}${shapes[kind] || ''}</svg>`;
};
