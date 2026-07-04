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

// log = { 'YYYY-MM-DD': { mobilite:bool, renfo:bool, cardio:bool, rpe:num, douleur:num } }
let LOG = load('carnet57_log', {});
const DAY_LABELS = ['L','M','M','J','V','S','D'];

function buildWeekGrid(containerId, field){
  const container = document.getElementById(containerId);
  if (!container) return;
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
  document.getElementById('stat-cardio').textContent = countField('cardio');
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

  // régularité du mois en cours (mobilité)
  const now = new Date();
  const daysSoFar = now.getDate();
  let doneThisMonth = 0;
  for (let i = 1; i <= daysSoFar; i++) {
    const dte = new Date(now.getFullYear(), now.getMonth(), i);
    const k = toKey(dte);
    if (LOG[k] && LOG[k].mobilite) doneThisMonth++;
  }
  const pct = Math.round((doneThisMonth / daysSoFar) * 100);
  const regEl = document.getElementById('stat-regularite');
  if (regEl) regEl.textContent = pct + '%';
}

buildWeekGrid('week-mobilite', 'mobilite');
buildWeekGrid('week-renfo', 'renfo');
buildWeekGrid('week-cardio', 'cardio');

// ---------- Poids + graphique ----------
const poidsInput = document.getElementById('poids-input');
const poidsNote = document.getElementById('poids-note');
let poidsHistory = load('carnet57_poids', []);
poidsInput.value = poidsHistory.length ? poidsHistory[poidsHistory.length - 1].v : '';

function drawChart(){
  const svgEl = document.getElementById('poids-chart');
  if (!svgEl) return;
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
const todayCardioCb = document.getElementById('today-cardio');
const rpeBlock = document.getElementById('rpe-block');
const rpeInput = document.getElementById('rpe-input');
const rpeValue = document.getElementById('rpe-value');

function syncTodayCheckboxes(){
  const t = LOG[todayKey()] || {};
  todayMobiliteCb.checked = !!t.mobilite;
  todayRenfoCb.checked = !!t.renfo;
  todayCardioCb.checked = !!t.cardio;
  rpeBlock.style.display = todayRenfoCb.checked ? 'block' : 'none';
  rpeInput.value = t.rpe || 7;
  rpeValue.textContent = t.rpe || '-';
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
  rpeBlock.style.display = todayRenfoCb.checked ? 'block' : 'none';
  if (todayRenfoCb.checked) showToast(randomEncouragement());
});
todayCardioCb.addEventListener('change', () => {
  LOG[todayKey()] = LOG[todayKey()] || {};
  LOG[todayKey()].cardio = todayCardioCb.checked;
  save('carnet57_log', LOG);
  buildWeekGrid('week-cardio', 'cardio');
  updateStats();
  if (todayCardioCb.checked) showToast(randomEncouragement());
});
rpeInput.addEventListener('input', () => {
  rpeValue.textContent = rpeInput.value;
  LOG[todayKey()] = LOG[todayKey()] || {};
  LOG[todayKey()].rpe = parseInt(rpeInput.value, 10);
  save('carnet57_log', LOG);
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
  if (!row) return;
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

// ---------- Douleur / raideur du jour ----------
const PAIN_EMOJIS = ['😀','🙂','😐','🙁','😣'];
function buildPainRow(){
  const row = document.getElementById('pain-row');
  if (!row) return;
  row.innerHTML = '';
  const val = LOG[todayKey()] ? LOG[todayKey()].douleur : undefined;
  PAIN_EMOJIS.forEach((emoji, i) => {
    const cell = document.createElement('div');
    cell.className = 'pain-cup' + (val === i ? ' on' : '');
    cell.textContent = emoji;
    cell.addEventListener('click', () => {
      LOG[todayKey()] = LOG[todayKey()] || {};
      LOG[todayKey()].douleur = i;
      save('carnet57_log', LOG);
      buildPainRow();
      drawPainChart();
    });
    row.appendChild(cell);
  });
}
function drawPainChart(){
  const svgEl = document.getElementById('pain-chart');
  if (!svgEl) return;
  svgEl.innerHTML = '';
  const dates = Object.keys(LOG).filter(k => LOG[k] && LOG[k].douleur !== undefined).sort().slice(-14);
  if (dates.length < 2) {
    svgEl.innerHTML = '<text x="10" y="45" font-size="11" fill="#8AA5A2">Coche ta douleur/raideur quelques jours pour voir la tendance</text>';
    return;
  }
  const w = 300, h = 90, pad = 8;
  const pts = dates.map((k, i) => {
    const x = pad + (i / (dates.length - 1)) * (w - pad*2);
    const y = h - pad - (1 - LOG[k].douleur / 4) * (h - pad*2);
    return [x, y];
  });
  const path = pts.map((p,i) => (i===0?'M':'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  svgEl.innerHTML = `<path d="${path}" fill="none" stroke="#FD9C29" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>` +
    pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#0FA2B6"/>`).join('');
}
buildPainRow();
drawPainChart();

// ---------- Semaine du programme (Progression dynamique) ----------
const PHASES = [
  { min: 1, max: 4, phase: 1, label: 'Fondations' },
  { min: 5, max: 8, phase: 2, label: 'Consolidation' },
  { min: 9, max: 12, phase: 3, label: 'Autonomie' },
  { min: 13, max: 99, phase: 4, label: 'Au-delà' }
];
function phaseForWeek(w){ return PHASES.find(p => w >= p.min && w <= p.max) || PHASES[3]; }
function buildWeekPicker(){
  const container = document.getElementById('week-picker');
  if (!container) return;
  container.innerHTML = '';
  const current = load('carnet57_week', 1);
  for (let i = 1; i <= 12; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === current) btn.classList.add('active');
    btn.addEventListener('click', () => {
      save('carnet57_week', i);
      buildWeekPicker();
      updatePhaseDisplay();
    });
    container.appendChild(btn);
  }
  const p = phaseForWeek(current);
  document.getElementById('week-picker-note').textContent = `Semaine ${current}/12 · Phase : ${p.label}`;
}
function updatePhaseDisplay(){
  const current = load('carnet57_week', 1);
  const p = phaseForWeek(current);
  document.querySelectorAll('.progress-step').forEach(el => {
    el.classList.toggle('current', parseInt(el.dataset.phase, 10) === p.phase);
  });
  const noteEl = document.getElementById('phase-note');
  if (noteEl) noteEl.textContent = `📅 Semaine ${current}/12 du programme · Phase ${p.phase} : ${p.label}`;
  const pickerNote = document.getElementById('week-picker-note');
  if (pickerNote) pickerNote.textContent = `Semaine ${current}/12 · Phase : ${p.label}`;
}
buildWeekPicker();
updatePhaseDisplay();

// ---------- PWA service worker ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
