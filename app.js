// --- Tabs ---
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

// --- Storage helpers ---
const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch { return d; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

const DAYS = ['L','M','M','J','V','S','D'];
const todayIdx = () => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; };
const weekKey = () => {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  return d.getFullYear() + '-w' + week;
};

function buildWeekGrid(containerId, storeKey) {
  const container = document.getElementById(containerId);
  const wk = weekKey();
  let data = load(storeKey, {});
  if (data.week !== wk) data = { week: wk, days: [false,false,false,false,false,false,false] };
  container.innerHTML = '';
  DAYS.forEach((label, i) => {
    const el = document.createElement('div');
    el.className = 'd' + (data.days[i] ? ' on' : '');
    el.textContent = label;
    if (i === todayIdx()) el.style.borderColor = '#D6572B';
    el.addEventListener('click', () => {
      data.days[i] = !data.days[i];
      save(storeKey, data);
      buildWeekGrid(containerId, storeKey);
      updateStats();
    });
    container.appendChild(el);
  });
  save(storeKey, data);
  return data;
}

function updateStats() {
  const m = load('carnet57_mobilite', { days: [] });
  const r = load('carnet57_renfo', { days: [] });
  document.getElementById('stat-mobilite').textContent = (m.days || []).filter(Boolean).length;
  document.getElementById('stat-renfo').textContent = (r.days || []).filter(Boolean).length;
}

buildWeekGrid('week-mobilite', 'carnet57_mobilite');
buildWeekGrid('week-renfo', 'carnet57_renfo');
updateStats();

// --- Poids ---
const poidsInput = document.getElementById('poids-input');
const poidsNote = document.getElementById('poids-note');
const poidsHistory = load('carnet57_poids', []);
poidsInput.value = poidsHistory.length ? poidsHistory[poidsHistory.length - 1].v : '';
if (poidsHistory.length) poidsNote.textContent = 'Dernière saisie : ' + poidsHistory[poidsHistory.length - 1].d;
poidsInput.addEventListener('change', () => {
  const v = parseFloat(poidsInput.value);
  if (!isNaN(v)) {
    poidsHistory.push({ v, d: new Date().toLocaleDateString('fr-FR') });
    save('carnet57_poids', poidsHistory);
    poidsNote.textContent = 'Enregistré le ' + new Date().toLocaleDateString('fr-FR');
  }
});

// --- Notes ---
const notesInput = document.getElementById('notes-input');
notesInput.value = load('carnet57_notes', '');
notesInput.addEventListener('input', () => save('carnet57_notes', notesInput.value));

// --- PWA service worker ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
