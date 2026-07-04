// ---------- Illustrations (SVG originales, style pictogramme) ----------
const STROKE = '#103E45';
const ACCENT = '#FD9C29';
function svg(inner){
  return `<svg viewBox="0 0 64 64" width="70%" height="70%" fill="none" stroke="${STROKE}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}
const POSES = {
  neck: svg(`
    <circle cx="32" cy="13" r="6"/>
    <line x1="32" y1="19" x2="32" y2="40"/>
    <line x1="32" y1="23" x2="21" y2="35"/>
    <line x1="32" y1="23" x2="43" y2="35"/>
    <line x1="32" y1="40" x2="24" y2="58"/>
    <line x1="32" y1="40" x2="40" y2="58"/>
    <path d="M18 9 Q10 13 14 21" stroke="${ACCENT}" stroke-width="3"/>
    <path d="M14 21 l-4 -2 l1.5 4" stroke="${ACCENT}" stroke-width="3"/>
    <path d="M46 9 Q54 13 50 21" stroke="${ACCENT}" stroke-width="3"/>
    <path d="M50 21 l4 -2 l-1.5 4" stroke="${ACCENT}" stroke-width="3"/>
  `),
  catcow: svg(`
    <circle cx="12" cy="24" r="5"/>
    <path d="M17,27 Q32,13 47,27"/>
    <line x1="19" y1="28" x2="19" y2="52"/>
    <line x1="45" y1="28" x2="45" y2="52"/>
    <line x1="27" y1="24" x2="27" y2="52"/>
    <line x1="37" y1="24" x2="37" y2="52"/>
  `),
  shoulders: svg(`
    <circle cx="32" cy="12" r="6"/>
    <line x1="32" y1="18" x2="32" y2="40"/>
    <line x1="32" y1="22" x2="12" y2="22"/>
    <line x1="32" y1="22" x2="52" y2="22"/>
    <line x1="32" y1="40" x2="25" y2="58"/>
    <line x1="32" y1="40" x2="39" y2="58"/>
    <path d="M6 16 A8 8 0 1 0 6 28" stroke="${ACCENT}" stroke-width="3"/>
    <path d="M58 16 A8 8 0 1 1 58 28" stroke="${ACCENT}" stroke-width="3"/>
  `),
  hips: svg(`
    <circle cx="32" cy="12" r="6"/>
    <line x1="32" y1="18" x2="32" y2="38"/>
    <line x1="32" y1="20" x2="20" y2="24"/><line x1="20" y1="24" x2="27" y2="33"/>
    <line x1="32" y1="20" x2="44" y2="24"/><line x1="44" y1="24" x2="37" y2="33"/>
    <line x1="32" y1="38" x2="25" y2="58"/>
    <line x1="32" y1="38" x2="39" y2="58"/>
    <ellipse cx="32" cy="42" rx="13" ry="6" stroke="${ACCENT}" stroke-width="3" stroke-dasharray="3 4"/>
  `),
  ankle: svg(`
    <circle cx="14" cy="12" r="6"/>
    <line x1="14" y1="18" x2="14" y2="38"/>
    <line x1="14" y1="21" x2="6" y2="33"/>
    <line x1="14" y1="21" x2="22" y2="33"/>
    <line x1="14" y1="38" x2="10" y2="58"/>
    <line x1="14" y1="38" x2="26" y2="46"/><line x1="26" y1="46" x2="36" y2="53"/>
    <line x1="50" y1="6" x2="50" y2="60" stroke-width="3"/>
    <path d="M40 50 A6 6 0 1 0 40 58" stroke="${ACCENT}" stroke-width="3"/>
  `),
  lunge_twist: svg(`
    <circle cx="30" cy="11" r="6"/>
    <line x1="30" y1="17" x2="30" y2="34"/>
    <line x1="30" y1="34" x2="20" y2="46"/><line x1="20" y1="46" x2="16" y2="58"/>
    <line x1="30" y1="34" x2="46" y2="50"/><line x1="46" y1="50" x2="54" y2="58"/>
    <line x1="30" y1="18" x2="18" y2="30"/><line x1="18" y1="30" x2="15" y2="42"/>
    <line x1="30" y1="18" x2="42" y2="8"/><line x1="42" y1="8" x2="50" y2="2"/>
  `),
  shoulder_rotation: svg(`
    <circle cx="32" cy="12" r="6"/>
    <line x1="32" y1="18" x2="32" y2="40"/>
    <line x1="32" y1="22" x2="20" y2="30"/>
    <line x1="20" y1="30" x2="34" y2="34"/>
    <line x1="32" y1="22" x2="44" y2="36"/>
    <line x1="32" y1="40" x2="25" y2="58"/>
    <line x1="32" y1="40" x2="39" y2="58"/>
    <line x1="6" y1="34" x2="20" y2="30" stroke="${ACCENT}" stroke-width="3" stroke-dasharray="2 4"/>
    <path d="M34 34 l5 -2 l-2 5" stroke="${ACCENT}" stroke-width="3"/>
  `),
  squat: svg(`
    <circle cx="32" cy="10" r="6"/>
    <line x1="32" y1="16" x2="32" y2="32"/>
    <line x1="32" y1="32" x2="18" y2="40"/><line x1="18" y1="40" x2="15" y2="58"/>
    <line x1="32" y1="32" x2="46" y2="40"/><line x1="46" y1="40" x2="49" y2="58"/>
    <line x1="32" y1="20" x2="26" y2="26"/>
    <line x1="32" y1="20" x2="38" y2="26"/>
    <circle cx="32" cy="27" r="4" fill="${ACCENT}" stroke="none"/>
  `),
  rdl: svg(`
    <circle cx="15" cy="17" r="6"/>
    <line x1="17" y1="22" x2="40" y2="42"/>
    <line x1="40" y1="42" x2="36" y2="58"/>
    <line x1="40" y1="42" x2="46" y2="58"/>
    <line x1="20" y1="27" x2="18" y2="48"/>
    <line x1="24" y1="29" x2="22" y2="48"/>
    <circle cx="18" cy="50" r="4" fill="${ACCENT}" stroke="none"/>
    <circle cx="22" cy="50" r="4" fill="${ACCENT}" stroke="none"/>
  `),
  plank: svg(`
    <circle cx="10" cy="32" r="5"/>
    <line x1="15" y1="32" x2="48" y2="32"/>
    <line x1="15" y1="32" x2="15" y2="46"/>
    <line x1="10" y1="46" x2="20" y2="46"/>
    <line x1="48" y1="32" x2="55" y2="42"/>
    <line x1="6" y1="48" x2="58" y2="48" stroke="#B9D4CF" stroke-width="2" stroke-dasharray="2 3"/>
  `),
  birddog: svg(`
    <circle cx="12" cy="28" r="5"/>
    <line x1="17" y1="30" x2="40" y2="30"/>
    <line x1="20" y1="30" x2="20" y2="50"/>
    <line x1="38" y1="30" x2="38" y2="50"/>
    <line x1="17" y1="30" x2="6" y2="18"/>
    <line x1="40" y1="30" x2="54" y2="42"/>
  `),
  balance: svg(`
    <circle cx="32" cy="12" r="6"/>
    <line x1="32" y1="18" x2="32" y2="38"/>
    <line x1="32" y1="22" x2="18" y2="17"/>
    <line x1="32" y1="22" x2="46" y2="17"/>
    <line x1="32" y1="38" x2="30" y2="58"/>
    <line x1="32" y1="38" x2="40" y2="46"/><line x1="40" y1="46" x2="36" y2="54"/>
  `),
  row: svg(`
    <circle cx="46" cy="11" r="6"/>
    <line x1="46" y1="17" x2="46" y2="38"/>
    <line x1="46" y1="38" x2="28" y2="41"/><line x1="28" y1="41" x2="14" y2="43"/>
    <line x1="46" y1="21" x2="32" y2="29"/><line x1="32" y1="29" x2="17" y2="40"/>
    <circle cx="14" cy="43" r="3.5" stroke="${ACCENT}" stroke-width="3"/>
  `),
  sleep: svg(`<path d="M40 14 A18 18 0 1 0 46 46 A13 13 0 0 1 40 14 Z" fill="${STROKE}" stroke="none"/>`),
  breathe: svg(`<circle cx="32" cy="32" r="14" stroke-dasharray="4 5"/><circle cx="32" cy="32" r="4" fill="${ACCENT}" stroke="none"/>`),
  check: svg(`<rect x="14" y="14" width="36" height="36" rx="6"/><path d="M22 32 l8 8 l14 -16" stroke="${ACCENT}" stroke-width="5"/>`),
  medical: svg(`<rect x="26" y="10" width="12" height="44" rx="3"/><rect x="10" y="26" width="44" height="12" rx="3"/>`),
  walk: svg(`
    <circle cx="20" cy="10" r="6"/>
    <line x1="20" y1="16" x2="25" y2="33"/>
    <line x1="25" y1="33" x2="16" y2="41"/><line x1="16" y1="41" x2="13" y2="55"/>
    <line x1="25" y1="33" x2="35" y2="41"/><line x1="35" y1="41" x2="41" y2="53"/>
    <line x1="22" y1="20" x2="30" y2="27"/>
    <line x1="22" y1="20" x2="14" y2="27"/>
  `),
  run: svg(`
    <circle cx="20" cy="10" r="6"/>
    <line x1="20" y1="16" x2="30" y2="32"/>
    <line x1="30" y1="32" x2="40" y2="28"/><line x1="40" y1="28" x2="46" y2="18"/>
    <line x1="30" y1="32" x2="22" y2="42"/><line x1="22" y1="42" x2="28" y2="55"/>
    <line x1="24" y1="20" x2="14" y2="14"/><line x1="14" y1="14" x2="8" y2="20"/>
    <line x1="26" y1="22" x2="34" y2="18"/><line x1="34" y1="18" x2="40" y2="22"/>
  `),
  stairs: svg(`
    <path d="M6 56 L6 46 L18 46 L18 36 L30 36 L30 26 L46 26"/>
    <path d="M40 20 L46 26 L40 32" />
  `),
  chair_squat: svg(`
    <line x1="14" y1="40" x2="38" y2="40" stroke-width="3.5"/>
    <line x1="14" y1="40" x2="14" y2="56" stroke-width="3.5"/>
    <line x1="14" y1="40" x2="14" y2="20" stroke-width="3.5"/>
    <circle cx="42" cy="10" r="6"/>
    <line x1="42" y1="16" x2="42" y2="30"/>
    <line x1="42" y1="20" x2="52" y2="17"/>
    <line x1="42" y1="30" x2="30" y2="35"/><line x1="30" y1="35" x2="32" y2="52"/>
  `),
  chair_legraise: svg(`
    <line x1="8" y1="38" x2="32" y2="38" stroke-width="3.5"/>
    <line x1="8" y1="38" x2="8" y2="56" stroke-width="3.5"/>
    <line x1="8" y1="38" x2="8" y2="18" stroke-width="3.5"/>
    <circle cx="24" cy="13" r="6"/>
    <line x1="23" y1="19" x2="21" y2="38"/>
    <line x1="21" y1="38" x2="20" y2="54"/>
    <line x1="21" y1="38" x2="40" y2="30"/><line x1="40" y1="30" x2="52" y2="34"/>
    <line x1="23" y1="21" x2="34" y2="33"/>
    <path d="M34 33 l4 2 l-1 -4.5" stroke-width="3"/>
  `),
  chair_dip: svg(`
    <line x1="4" y1="30" x2="18" y2="30" stroke-width="3.5"/>
    <line x1="4" y1="30" x2="4" y2="46" stroke-width="3.5"/>
    <circle cx="30" cy="14" r="6"/>
    <line x1="29" y1="20" x2="34" y2="34"/>
    <line x1="16" y1="30" x2="29" y2="24"/>
    <line x1="34" y1="34" x2="54" y2="40"/><line x1="54" y1="40" x2="60" y2="50"/>
  `),
  chair_balance: svg(`
    <line x1="14" y1="50" x2="30" y2="50" stroke-width="3.5"/>
    <line x1="30" y1="50" x2="30" y2="60" stroke-width="3.5"/>
    <line x1="14" y1="50" x2="14" y2="14" stroke-width="3.5"/>
    <circle cx="42" cy="12" r="6"/>
    <line x1="42" y1="18" x2="42" y2="38"/>
    <line x1="42" y1="22" x2="20" y2="27"/>
    <line x1="42" y1="38" x2="37" y2="52"/><path d="M34 55 q3 -3 6 0"/>
    <line x1="42" y1="38" x2="47" y2="52"/><path d="M44 55 q3 -3 6 0"/>
  `),
};
document.querySelectorAll('.pose[data-pose]').forEach(el => {
  const key = el.dataset.pose;
  if (POSES[key]) el.innerHTML = POSES[key];
});

// ---------- Tabs ----------
const tabBtns = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.panel');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
  });
});

// ---------- Storage helpers ----------
const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch { return d; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

const pad = n => String(n).padStart(2, '0');
const toKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayKey = () => toKey(new Date());
function mondayOfThisWeek(){
  const d = new Date();
  const day = d.getDay() === 0 ? 7 : d.getDay();
  d.setDate(d.getDate() - (day - 1));
  d.setHours(0,0,0,0);
  return d;
}
function weekDates(){
  const mon = mondayOfThisWeek();
  return Array.from({length:7}, (_,i) => { const d = new Date(mon); d.setDate(mon.getDate()+i); return d; });
}

// log = { 'YYYY-MM-DD': { mobilite:bool, renfo:bool } }
let LOG = load('carnet57_log', {});
const DAY_LABELS = ['L','M','M','J','V','S','D'];

function buildWeekGrid(containerId, field){
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  const dates = weekDates();
  const tKey = todayKey();
  dates.forEach((d, i) => {
    const key = toKey(d);
    const on = !!(LOG[key] && LOG[key][field]);
    const el = document.createElement('div');
    el.className = 'd' + (on ? ' on' : '') + (key === tKey ? ' today' : '');
    el.textContent = DAY_LABELS[i];
    el.addEventListener('click', () => {
      LOG[key] = LOG[key] || {};
      LOG[key][field] = !LOG[key][field];
      save('carnet57_log', LOG);
      buildWeekGrid(containerId, field);
      updateStats();
    });
    container.appendChild(el);
  });
}

function updateStats(){
  const dates = weekDates().map(toKey);
  const countField = f => dates.filter(k => LOG[k] && LOG[k][f]).length;
  document.getElementById('stat-mobilite').textContent = countField('mobilite');
  document.getElementById('stat-renfo').textContent = countField('renfo');
  document.getElementById('stat-water').textContent = (load('carnet57_water', {})[todayKey()] || 0);

  // streak (mobilite), consecutive days ending today
  let streak = 0;
  let d = new Date();
  while (true) {
    const k = toKey(d);
    if (LOG[k] && LOG[k].mobilite) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }
  const streakEl = document.getElementById('streak-text');
  streakEl.textContent = streak === 0
    ? 'Coche ta mobilité du jour pour démarrer une série'
    : streak + (streak > 1 ? ' jours de suite en mobilité' : ' jour de suite en mobilité');
}

buildWeekGrid('week-mobilite', 'mobilite');
buildWeekGrid('week-renfo', 'renfo');

// ---------- Poids + graphique ----------
const poidsInput = document.getElementById('poids-input');
const poidsNote = document.getElementById('poids-note');
let poidsHistory = load('carnet57_poids', []);
poidsInput.value = poidsHistory.length ? poidsHistory[poidsHistory.length - 1].v : '';

function drawChart(){
  const svgEl = document.getElementById('poids-chart');
  svgEl.innerHTML = '';
  const data = poidsHistory.slice(-10);
  if (data.length < 2) {
    svgEl.innerHTML = '<text x="10" y="45" font-size="11" fill="#8AA5A2">Ajoute au moins 2 mesures pour voir la courbe</text>';
    return;
  }
  const vals = data.map(p => p.v);
  const min = Math.min(...vals) - 0.5, max = Math.max(...vals) + 0.5;
  const w = 300, h = 90, pad = 8;
  const pts = data.map((p, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad*2);
    const y = h - pad - ((p.v - min) / (max - min)) * (h - pad*2);
    return [x, y];
  });
  const path = pts.map((p,i) => (i===0?'M':'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  svgEl.innerHTML = `<path d="${path}" fill="none" stroke="#0FA2B6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>` +
    pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#FD9C29"/>`).join('');
}
drawChart();

if (poidsHistory.length) poidsNote.textContent = 'Dernière saisie : ' + poidsHistory[poidsHistory.length - 1].d;
poidsInput.addEventListener('change', () => {
  const v = parseFloat(poidsInput.value);
  if (!isNaN(v)) {
    poidsHistory.push({ v, d: new Date().toLocaleDateString('fr-FR') });
    save('carnet57_poids', poidsHistory);
    poidsNote.textContent = 'Enregistré le ' + new Date().toLocaleDateString('fr-FR');
    drawChart();
  }
});

// ---------- Notes ----------
const notesInput = document.getElementById('notes-input');
notesInput.value = load('carnet57_notes', '');
notesInput.addEventListener('input', () => save('carnet57_notes', notesInput.value));

updateStats();

// ---------- Citations du jour ----------
const QUOTES = [
  "Un jour sans mobilité, ce sont des articulations qui rouillent un peu plus vite.",
  "10 minutes aujourd'hui valent mieux qu'une heure qu'on ne fera jamais.",
  "La régularité bat l'intensité, à tout âge.",
  "Le corps s'adapte à ce qu'on lui demande — même à 57 ans.",
  "Pas besoin de performance, juste de présence.",
  "Chaque série d'équilibre d'aujourd'hui est une chute évitée demain.",
  "La meilleure séance est celle qu'on fait vraiment, pas celle qu'on imagine parfaite.",
  "Bouger un peu tous les jours change plus de choses que s'épuiser une fois par mois.",
  "Ton corps de demain se construit avec les choix d'aujourd'hui.",
  "Une routine simple et tenue vaut mieux qu'un programme parfait abandonné."
];
function dayOfYear(d){ const start = new Date(d.getFullYear(),0,0); return Math.floor((d - start) / 86400000); }
document.getElementById('quote-banner').textContent = QUOTES[dayOfYear(new Date()) % QUOTES.length];

// ---------- Toast ----------
const ENCOURAGEMENTS = ['Bien joué 💪', 'C\'est noté !', 'Un pas de plus 👣', 'Bravo, continue comme ça', 'Enregistré ✓'];
let toastTimer;
function showToast(msg){
  let el = document.getElementById('toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1600);
}
function randomEncouragement(){ return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]; }

// ---------- Dashboard "Aujourd'hui" ----------
const todayMobiliteCb = document.getElementById('today-mobilite');
const todayRenfoCb = document.getElementById('today-renfo');
function syncTodayCheckboxes(){
  const t = LOG[todayKey()] || {};
  todayMobiliteCb.checked = !!t.mobilite;
  todayRenfoCb.checked = !!t.renfo;
}
syncTodayCheckboxes();
todayMobiliteCb.addEventListener('change', () => {
  LOG[todayKey()] = LOG[todayKey()] || {};
  LOG[todayKey()].mobilite = todayMobiliteCb.checked;
  save('carnet57_log', LOG);
  buildWeekGrid('week-mobilite', 'mobilite');
  updateStats();
  if (todayMobiliteCb.checked) showToast(randomEncouragement());
});
todayRenfoCb.addEventListener('change', () => {
  LOG[todayKey()] = LOG[todayKey()] || {};
  LOG[todayKey()].renfo = todayRenfoCb.checked;
  save('carnet57_log', LOG);
  buildWeekGrid('week-renfo', 'renfo');
  updateStats();
  if (todayRenfoCb.checked) showToast(randomEncouragement());
});

function buildWater(containerId){
  const row = document.getElementById(containerId);
  if (!row) return;
  row.innerHTML = '';
  const water = load('carnet57_water', {});
  const n = water[todayKey()] || 0;
  for (let i = 1; i <= 8; i++) {
    const cup = document.createElement('div');
    cup.className = 'water-cup' + (i <= n ? ' on' : '');
    cup.textContent = '💧';
    cup.addEventListener('click', () => {
      const w = load('carnet57_water', {});
      w[todayKey()] = (w[todayKey()] === i) ? i - 1 : i;
      save('carnet57_water', w);
      buildWater('water-row');
      buildWater('water-row-today');
      updateStats();
    });
    row.appendChild(cup);
  }
}
buildWater('water-row');
buildWater('water-row-today');

// ---------- Records & badges ----------
const BADGES_STREAK = [
  { n: 3, label: '🔥 3 jours' },
  { n: 7, label: '🥉 7 jours' },
  { n: 14, label: '🥈 14 jours' },
  { n: 30, label: '🥇 30 jours' },
  { n: 60, label: '🏆 60 jours' },
  { n: 100, label: '💎 100 jours' }
];
const BADGES_RENFO = [
  { n: 10, label: '🏋️ 10 séances' },
  { n: 25, label: '🏋️ 25 séances' },
  { n: 50, label: '🏋️ 50 séances' },
  { n: 100, label: '🏋️ 100 séances' }
];

function computeLifetime(){
  const mobKeys = Object.keys(LOG).filter(k => LOG[k] && LOG[k].mobilite).sort();
  const totalMobilite = mobKeys.length;
  const totalRenfo = Object.keys(LOG).filter(k => LOG[k] && LOG[k].renfo).length;
  let maxStreak = 0, cur = 0, prev = null;
  mobKeys.forEach(k => {
    if (prev) {
      const diff = Math.round((new Date(k) - new Date(prev)) / 86400000);
      cur = diff === 1 ? cur + 1 : 1;
    } else cur = 1;
    if (cur > maxStreak) maxStreak = cur;
    prev = k;
  });
  return { totalMobilite, totalRenfo, maxStreak };
}

function updateRecordsAndBadges(){
  const { totalMobilite, totalRenfo, maxStreak } = computeLifetime();
  document.getElementById('stat-totalmobilite').textContent = totalMobilite;
  document.getElementById('stat-totalrenfo').textContent = totalRenfo;
  document.getElementById('stat-maxstreak').textContent = maxStreak;

  const row = document.getElementById('badges-row');
  row.innerHTML = '';
  BADGES_STREAK.forEach(b => {
    const span = document.createElement('span');
    span.className = 'pill' + (maxStreak >= b.n ? ' strong' : '');
    span.textContent = b.label;
    row.appendChild(span);
  });
  BADGES_RENFO.forEach(b => {
    const span = document.createElement('span');
    span.className = 'pill' + (totalRenfo >= b.n ? ' strong' : '');
    span.textContent = b.label;
    row.appendChild(span);
  });
}
updateRecordsAndBadges();

// hook streak-text-today alongside existing streak-text
const _origUpdateStats = updateStats;
updateStats = function(){
  _origUpdateStats();
  const streakEl2 = document.getElementById('streak-text-today');
  if (streakEl2) streakEl2.textContent = document.getElementById('streak-text').textContent;
  updateRecordsAndBadges();
};
updateStats();

// ---------- Export / import ----------
document.getElementById('btn-export').addEventListener('click', () => {
  const data = {};
  Object.keys(localStorage).filter(k => k.startsWith('carnet57_')).forEach(k => data[k] = localStorage.getItem(k));
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'fitness57-sauvegarde-' + todayKey() + '.json';
  a.click();
});
document.getElementById('import-file').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      Object.keys(data).forEach(k => localStorage.setItem(k, data[k]));
      document.getElementById('import-note').textContent = 'Import réussi. Rechargement...';
      setTimeout(() => location.reload(), 800);
    } catch {
      document.getElementById('import-note').textContent = 'Fichier invalide.';
    }
  };
  reader.readAsText(file);
});

// ---------- PWA service worker ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
