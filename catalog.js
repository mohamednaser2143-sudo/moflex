// Everything MoFlex knows about its shows. Availability comes from availability.json (set in the admin site).
window.MOFLEX_CATALOG = {
  shows: [{
    id: 'tales-of-the-legend',
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
    city: `${[[20, 70], [60, 40], [100, 90], [140, 30], [185, 60], [225, 20], [270, 75]].map(([x, h]) => `<rect x="${x}" y="${h + 30}" width="34" height="${150 - h}" fill="${ink}"/>`).join('')}<rect y="165" width="320" height="15" fill="${ink}"/>`
  };
  return `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${g}${shapes[kind] || ''}</svg>`;
};
