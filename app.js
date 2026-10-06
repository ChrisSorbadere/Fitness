/* Fitness 57 — v2.2 — logique de l'application */
'use strict';

/* =========================================================
   Outils
   ========================================================= */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const P = 'carnet57_';
const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(P + k)); return v === null ? d : v; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(P + k, JSON.stringify(v)); } catch {} }
};
const pad = n => String(n).padStart(2, '0');
const keyOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseKey = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const today0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const todayKey = () => keyOf(new Date());
const dow = d => (d.getDay() + 6) % 7; // lundi = 0
const DAY_SHORT = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const DAY_ICS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const fmtTime = s => { s = Math.max(0, Math.ceil(s)); const m = Math.floor(s / 60); return m ? `${m}:${pad(s % 60)}` : String(s); };
const rand = a => a[Math.floor(Math.random() * a.length)];

/* =========================================================
   État persistant
   ========================================================= */
const DEFAULT_SETTINGS = {
  name: '', start: '', theme: 'auto', size: 'normal', sound: true, vibrate: true,
  remind: true, renfoPref: 'alterne', bonus: 0,
  cal: { on: false, mobTime: '08:30', renfoDays: [0, 2, 4], renfoTime: '18:00', cardioDays: [1, 3, 5], cardioTime: '10:00' }
};
let SET = Object.assign({}, DEFAULT_SETTINGS, store.get('settings', {}));
SET.cal = Object.assign({}, DEFAULT_SETTINGS.cal, SET.cal || {});
let LOG = store.get('log', {});
const saveSet = () => store.set('settings', SET);
const saveLog = () => store.set('log', LOG);
const day = k => (LOG[k] = LOG[k] || {});

// Migration depuis la v1 (sélecteur de semaine manuel)
(function migrate() {
  if (!SET.start) {
    const w = store.get('week', null);
    if (w) { SET.start = keyOf(addDays(today0(), -(w - 1) * 7)); saveSet(); }
  }
})();

/* =========================================================
   Thème & taille de texte
   ========================================================= */
function applyDisplay() {
  const r = document.documentElement;
  if (SET.theme === 'auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', SET.theme);
  r.setAttribute('data-size', SET.size);
}
applyDisplay();

/* =========================================================
   Calculs
   ========================================================= */
function weekNum() {
  if (!SET.start) return 1;
  const diff = Math.floor((today0() - parseKey(SET.start)) / 864e5);
  return Math.max(1, Math.floor(diff / 7) + 1);
}
const phaseOf = w => PHASES.find(p => w >= p.from && w <= p.to) || PHASES[3];
const weekKeys = () => { const mon = addDays(today0(), -dow(today0())); return Array.from({ length: 7 }, (_, i) => keyOf(addDays(mon, i))); };
const countWeek = f => weekKeys().filter(k => LOG[k] && LOG[k][f]).length;

function currentStreak() {
  let d = today0();
  if (!(LOG[keyOf(d)] && LOG[keyOf(d)].mobilite)) d = addDays(d, -1);
  let n = 0;
  while (LOG[keyOf(d)] && LOG[keyOf(d)].mobilite) { n++; d = addDays(d, -1); }
  return n;
}
function monthPct() {
  const t = today0(); let done = 0;
  for (let i = 1; i <= t.getDate(); i++) { const k = keyOf(new Date(t.getFullYear(), t.getMonth(), i)); if (LOG[k] && LOG[k].mobilite) done++; }
  return Math.round(done / t.getDate() * 100);
}
function lifetime() {
  const keys = Object.keys(LOG).sort();
  const mob = keys.filter(k => LOG[k].mobilite);
  let maxStreak = 0, cur = 0, prev = null;
  mob.forEach(k => { cur = prev && Math.round((parseKey(k) - parseKey(prev)) / 864e5) === 1 ? cur + 1 : 1; maxStreak = Math.max(maxStreak, cur); prev = k; });
  const totalRenfo = keys.filter(k => LOG[k].renfo).length;
  const totalCardio = keys.filter(k => LOG[k].cardio).length;
  const months = {};
  mob.forEach(k => { const m = k.slice(0, 7); months[m] = (months[m] || 0) + 1; });
  let bestMonthPct = 0;
  const t = today0();
  Object.keys(months).forEach(m => {
    const [y, mo] = m.split('-').map(Number);
    const isCur = y === t.getFullYear() && mo === t.getMonth() + 1;
    const len = isCur ? t.getDate() : new Date(y, mo, 0).getDate();
    if (len >= 10) bestMonthPct = Math.max(bestMonthPct, Math.round(months[m] / len * 100));
  });
  const tests = Object.values(store.get('tests', {})).reduce((a, l) => a + l.length, 0);
  return { maxStreak, totalMob: mob.length, totalRenfo, totalCardio, totalSessions: mob.length + totalRenfo + totalCardio, bestMonthPct, tests };
}

function lastRenfoRpes(n) {
  return Object.keys(LOG).sort().filter(k => LOG[k].renfo && LOG[k].rpe).slice(-n).map(k => LOG[k].rpe);
}

function recommend() {
  const tk = todayKey(), t = LOG[tk] || {}, y = LOG[keyOf(addDays(today0(), -1))] || {};
  const ph = phaseOf(weekNum()), feel = t.douleur ?? -1;
  if (feel >= 3 && !t.mobilite) return { key: 'douce', why: 'Tu signales de la gêne : on reste en douceur aujourd’hui.' };
  if (!t.mobilite) return { key: 'mobilite', why: 'Ta routine quotidienne, avant tout le reste.' };
  if (!t.renfo && !y.renfo && feel < 3 && countWeek('renfo') < ph.renfo) {
    let key = SET.renfoPref === 'maison' ? 'maison' : SET.renfoPref === 'renfo' ? 'renfo' : null;
    if (!key) {
      const last = Object.keys(LOG).sort().reverse().map(k => (LOG[k].sessions || []).filter(s => s.s === 'renfo' || s.s === 'maison').pop()).find(Boolean);
      key = last && last.s === 'renfo' ? 'maison' : 'renfo';
    }
    return { key, why: `Séance ${countWeek('renfo') + 1} sur ${ph.renfo} cette semaine.` };
  }
  if (!t.cardio && countWeek('cardio') < ph.cardio) {
    const key = ph.n >= 2 && countWeek('cardio') === 1 ? 'fractionne' : 'marche';
    return { key, why: `Cardio ${countWeek('cardio') + 1} sur ${ph.cardio} cette semaine.` };
  }
  return { key: null, why: '' };
}

/* =========================================================
   Retours (son, vibration, toast, confettis)
   ========================================================= */
let audioCtx = null;
function ensureAudio() { try { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); } catch {} }
function beep(freq = 880, dur = 0.12, vol = 0.25) {
  if (!SET.sound || !audioCtx) return;
  try {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'sine'; o.frequency.value = freq; o.connect(g); g.connect(audioCtx.destination);
    const t = audioCtx.currentTime; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.start(t); o.stop(t + dur + 0.02);
  } catch {}
}
const buzz = p => { if (SET.vibrate && navigator.vibrate) try { navigator.vibrate(p); } catch {} };
let toastT;
function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2200);
}
function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = $('#confetti'), ctx = c.getContext('2d');
  c.width = innerWidth * devicePixelRatio; c.height = innerHeight * devicePixelRatio; ctx.scale(devicePixelRatio, devicePixelRatio);
  const cols = ['#0FA2B6', '#4FB58A', '#F4C24B', '#FD9C29', '#8A6FD1'];
  const parts = Array.from({ length: 120 }, () => ({ x: innerWidth / 2, y: innerHeight * 0.35, vx: (Math.random() - .5) * 12, vy: Math.random() * -12 - 3, s: Math.random() * 6 + 4, r: Math.random() * 6, c: rand(cols) }));
  let f = 0;
  (function frame() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.35; p.r += 0.15; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore(); });
    if (++f < 110) requestAnimationFrame(frame); else ctx.clearRect(0, 0, innerWidth, innerHeight);
  })();
}
function checkBadges(silent) {
  const st = lifetime(), earned = store.get('badges', []);
  const fresh = BADGES.filter(b => b.test(st) && !earned.includes(b.id));
  if (fresh.length) {
    store.set('badges', earned.concat(fresh.map(b => b.id)));
    if (!silent) setTimeout(() => { toast(`Badge débloqué : ${fresh[0].icon} ${fresh[0].name}`); confetti(); }, 900);
  }
}

/* =========================================================
   Navigation
   ========================================================= */
let VIEW = 'home';
let libFilter = 'all';
function go(v) {
  VIEW = v;
  document.querySelectorAll('#bottom-nav button').forEach(b => b.classList.toggle('active', b.dataset.view === v));
  render(); scrollTo({ top: 0 });
}
function render() {
  const d = new Date();
  $('#hdr-date').textContent = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const v = $('#view');
  v.innerHTML = `<div class="view">${({ home: viewHome, seances: viewSeances, nutrition: viewNutrition, progres: viewProgres })[VIEW]()}</div>`;
  if (VIEW === 'progres') { const n = $('#notes'); if (n) n.addEventListener('input', () => store.set('notes', n.value)); }
}

/* =========================================================
   Vue : Accueil
   ========================================================= */
const FEELS = [['😀', 'Top'], ['🙂', 'Bien'], ['😐', 'Raide'], ['🙁', 'Gêne'], ['😣', 'Douleur']];
function ringsSvg(vals) {
  const cfg = [[50, '#0FA2B6'], [37, '#FD9C29'], [24, '#4FAF6A']];
  return `<svg class="rings" viewBox="0 0 120 120">${cfg.map(([r, c], i) => {
    const C = 2 * Math.PI * r, v = Math.min(1, vals[i]);
    return `<circle cx="60" cy="60" r="${r}" stroke="${c}" stroke-width="10" opacity=".16"/>
      <circle cx="60" cy="60" r="${r}" stroke="${c}" stroke-width="10" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - v)}" transform="rotate(-90 60 60)"/>`;
  }).join('')}</svg>`;
}
function viewHome() {
  const tk = todayKey(), t = LOG[tk] || {}, w = weekNum(), ph = phaseOf(w);
  const h = new Date().getHours();
  const hello = (h < 13 ? 'Bonjour' : h < 19 ? 'Bon après-midi' : 'Bonsoir') + (SET.name ? ` ${esc(SET.name)}` : '') + ' 👋';
  const quote = QUOTES[Math.floor(today0() / 864e5) % QUOTES.length];
  const rec = recommend();
  const mobW = countWeek('mobilite'), renW = countWeek('renfo'), carW = countWeek('cardio');

  // Alertes de rattrapage et de progression
  let alerts = '';
  const dismissed = store.get('dismiss', {});
  const hasHistory = Object.keys(LOG).some(k => k < tk);
  if (SET.remind && hasHistory && dismissed.catch !== tk) {
    const y = LOG[keyOf(addDays(today0(), -1))] || {};
    const recentRenfo = [1, 2, 3, 4, 5].some(i => (LOG[keyOf(addDays(today0(), -i))] || {}).renfo) || t.renfo;
    let msg = '';
    if (!y.mobilite && !t.mobilite) msg = 'Hier, pas de mobilité. 10 minutes aujourd’hui suffisent pour relancer la machine.';
    else if (!recentRenfo && ph.renfo > 0) msg = 'Pas de renfort depuis 5 jours : une petite séance aujourd’hui ?';
    if (msg) alerts += `<div class="alert"><span>⏰</span><span>${msg}</span><button class="x" data-act="dismiss" data-k="catch" aria-label="Fermer">✕</button></div>`;
  }
  const rp = lastRenfoRpes(2);
  if (dismissed.prog !== rp.join(',') && rp.length === 2) {
    if (rp.every(x => x <= 5)) alerts += `<div class="alert soft"><span>📈</span><span>Tes 2 dernières séances de renfort étaient faciles (RPE ≤ 5). On ajoute <b>2 répétitions</b> par série ?<br><button class="btn sm teal" style="margin-top:8px" data-act="bonus" data-v="2">Oui, augmenter</button></span><button class="x" data-act="dismiss" data-k="prog" data-v="${rp.join(',')}">✕</button></div>`;
    else if (rp[1] >= 9) alerts += `<div class="alert soft"><span>🛑</span><span>Dernière séance très dure (RPE ${rp[1]}). Pour protéger tes articulations, on retire <b>2 répétitions</b> ?<br><button class="btn sm teal" style="margin-top:8px" data-act="bonus" data-v="-2">Oui, alléger</button></span><button class="x" data-act="dismiss" data-k="prog" data-v="${rp.join(',')}">✕</button></div>`;
  }

  let hero;
  if (rec.key) {
    const s = SESSIONS[rec.key];
    hero = `<div class="hero c-${s.color === 'teal' ? 'x' : s.color}">
      <span class="bigemoji">${s.emoji}</span>
      <div class="k">Ta séance du jour</div>
      <h2>${s.name}</h2>
      <p>${rec.why}</p>
      <div class="meta"><span>⏱ ${s.min} min</span><span>• ${countEx(s)} exercices</span></div>
      <button class="go" data-act="start" data-s="${rec.key}">▶ Démarrer</button><button class="alt" data-act="preview" data-s="${rec.key}">Voir</button>
    </div>`;
  } else {
    hero = `<div class="hero done"><span class="bigemoji">🎉</span><div class="k">Journée validée</div><h2>Objectifs du jour atteints</h2>
      <p>Récupération active : une marche tranquille ou rien du tout. Le repos fait partie du programme.</p>
      <button class="go" data-act="go" data-v="seances">Autres séances</button></div>`;
  }

  const water = store.get('water', {})[tk] || 0;
  return `
    <div class="hello">${hello}</div>
    <div class="phase-badge">📅 Semaine ${Math.min(w, 12)}${w > 12 ? '+' : ''}/12 · ${ph.label}</div>
    <p class="quote">« ${quote} »</p>
    ${alerts}
    ${hero}

    <div class="sec-title">Ta semaine <small>${weekLabel()}</small></div>
    <div class="card rings-card">
      ${ringsSvg([mobW / 7, renW / ph.renfo, carW / ph.cardio])}
      <div class="ring-legend">
        <div class="rl"><span class="dot" style="background:#0FA2B6"></span>Mobilité<b>${mobW}/7</b></div>
        <div class="rl"><span class="dot" style="background:#FD9C29"></span>Renfort<b>${renW}/${ph.renfo}</b></div>
        <div class="rl"><span class="dot" style="background:#4FAF6A"></span>Cardio<b>${carW}/${ph.cardio}</b></div>
      </div>
    </div>
    <div class="stat-row">
      <div class="stat"><div class="n">🔥${currentStreak()}</div><div class="l">jours de suite</div></div>
      <div class="stat"><div class="n">${monthPct()}%</div><div class="l">ce mois-ci</div></div>
      <div class="stat"><div class="n">${lifetime().totalSessions}</div><div class="l">séances</div></div>
    </div>

    <div class="sec-title">Comment vont tes articulations ?</div>
    <div class="feel">${FEELS.map(([e, l], i) => `<button class="${t.douleur === i ? 'on' : ''}" data-act="feel" data-v="${i}">${e}<span>${l}</span></button>`).join('')}</div>

    <div class="sec-title">Fait sans l’appli ? <small>coche ici</small></div>
    <div class="quick">
      <button class="qbtn ${t.mobilite ? 'on' : ''}" data-act="toggle" data-f="mobilite"><span class="e">🧘</span>Mobilité</button>
      <button class="qbtn ${t.renfo ? 'on' : ''}" data-act="toggle" data-f="renfo"><span class="e">💪</span>Renfort</button>
      <button class="qbtn ${t.cardio ? 'on' : ''}" data-act="toggle" data-f="cardio"><span class="e">🚶</span>Cardio</button>
    </div>

    <div class="sec-title">Hydratation <small>${water}/8 verres · ${(water * 0.25).toFixed(2).replace('.', ',')} L</small></div>
    <div class="card"><div class="water">${Array.from({ length: 8 }, (_, i) => `<button class="cup ${i < water ? 'on' : ''}" data-act="water" data-v="${i + 1}" aria-label="Verre ${i + 1}"></button>`).join('')}</div></div>
  `;
}
function weekLabel() { const k = weekKeys(); const a = parseKey(k[0]), b = parseKey(k[6]); return `${a.getDate()}–${b.getDate()} ${b.toLocaleDateString('fr-FR', { month: 'short' })}`; }
function countEx(s) { return new Set(s.items.map(i => i[0])).size; }

/* =========================================================
   Vue : Séances
   ========================================================= */
function sessCard(key) {
  const s = SESSIONS[key];
  return `<div class="sess"><div class="ic ${s.color}">${s.emoji}</div>
    <div class="grow" data-act="preview" data-s="${key}"><h3>${s.name}</h3><div class="d">${s.desc}</div><div class="m">⏱ ${s.min} min · ${countEx(s)} exercice${countEx(s) > 1 ? 's' : ''}</div></div>
    <button class="play" data-act="start" data-s="${key}" aria-label="Démarrer">▶</button></div>`;
}
function exLine(id, extra = '') {
  const e = EXERCISES[id];
  return `<button class="ex" data-act="exo" data-id="${id}">
    <div class="thumbs"><div class="thumb">${fig(e.poses[0])}</div><div class="thumb">${fig(e.poses[1])}</div></div>
    <div class="grow"><h4>${e.name}</h4><div class="t">${extra || dose(id)}</div></div><span class="chev">›</span></button>`;
}
function dose(id, sets) {
  const e = EXERCISES[id];
  const side = e.side ? ' par côté' : '';
  const S = sets ? `${sets} × ` : '';
  if (e.type === 'reps') return `${S}${repsOf(id)} rép.${side}`;
  if (e.type === 'free') return `${Math.round(e.secs / 60)} min`;
  const sec = secsOf(id);
  return `${S}${fmtTime(sec)}${sec >= 60 ? ' min' : ' s'}${side}`;
}
function repsOf(id) { const e = EXERCISES[id]; return ['renfo', 'maison'].includes(e.cat) && e.reps ? Math.max(4, e.reps + (SET.bonus || 0)) : e.reps; }
function secsOf(id, override) {
  if (override) return override;
  const e = EXERCISES[id], ph = phaseOf(weekNum()).n;
  if (id === 'plank') return [25, 35, 45, 45][ph - 1] + Math.max(0, SET.bonus || 0) * 2;
  if (id === 'balance') return ph === 1 ? 20 : 30;
  return e.secs;
}
function viewSeances() {
  const cats = [['all', 'Tous'], ['mobilite', 'Mobilité'], ['renfo', 'Renfort'], ['maison', 'Maison'], ['cardio', 'Cardio']];
  const lib = Object.keys(EXERCISES).filter(id => !['walk_easy'].includes(id) && (libFilter === 'all' || EXERCISES[id].cat === libFilter));
  return `
    <div class="sec-title">Au quotidien</div>
    ${sessCard('mobilite')}${sessCard('douce')}
    <div class="sec-title">Renforcement <small>${phaseOf(weekNum()).renfo}×/semaine</small></div>
    ${sessCard('renfo')}${sessCard('maison')}
    <div class="sec-title">Cardio <small>${phaseOf(weekNum()).cardio}×/semaine</small></div>
    ${sessCard('marche')}${sessCard('fractionne')}${sessCard('escaliers')}
    <div class="sec-title">Bibliothèque d’exercices</div>
    <div class="chips">${cats.map(([k, l]) => `<button class="chip ${libFilter === k ? 'on' : ''}" data-act="filter" data-v="${k}">${l}</button>`).join('')}</div>
    ${lib.map(id => exLine(id)).join('')}
    <div class="sec-title">Échelle de ressenti (RPE)</div>
    <div class="card">
      <div class="test-row"><b class="fred" style="min-width:58px">1-4</b><span class="muted">Très facile, tu pourrais continuer longtemps.</span></div>
      <div class="test-row"><b class="fred" style="min-width:58px">5-6</b><span class="muted">Effort modéré, essoufflement léger.</span></div>
      <div class="test-row"><b class="fred" style="min-width:58px;color:var(--orange)">7-8</b><span class="muted"><b>Cible renfort.</b> Les 2 dernières répétitions sont dures, la technique reste propre.</span></div>
      <div class="test-row"><b class="fred" style="min-width:58px;color:var(--red)">9-10</b><span class="muted">La technique se dégrade : à éviter en prévention.</span></div>
    </div>`;
}

/* =========================================================
   Feuilles modales
   ========================================================= */
function openSheet(html, keep) {
  const prev = keep && !$('#sheet').hidden ? $('#sheet').scrollTop : 0;
  $('#sheet').innerHTML = `<div class="grab"></div><button class="close" data-act="close" aria-label="Fermer">✕</button>${html}`;
  $('#sheet').hidden = false; $('#sheet-backdrop').hidden = false; $('#sheet').scrollTop = prev;
  document.body.style.overflow = 'hidden';
}
function closeSheet() {
  $('#sheet').hidden = true; $('#sheet-backdrop').hidden = true; document.body.style.overflow = '';
  clearInterval(testTimer);
}
function sheetExo(id) {
  const e = EXERCISES[id];
  openSheet(`<h2>${e.name}</h2><div class="tiny">${e.muscles}</div>
    <div class="anim-pose"><div class="f"><span class="s">1</span>${fig(e.poses[0])}</div><div class="f"><span class="s">2</span>${fig(e.poses[1])}</div></div>
    <div class="pill-row" style="margin-top:0"><span class="pill">🎯 ${dose(id)}</span>${e.rest ? `<span class="pill">⏸ repos ${e.rest} s</span>` : ''}</div>
    <p class="muted" style="margin-top:12px">${e.how}</p>
    <ul class="cues">${e.cues.map(c => `<li>${c}</li>`).join('')}</ul>
    ${e.warn ? `<div class="warn">⚠️ ${e.warn}</div>` : ''}`);
}
function sheetSession(key) {
  const s = SESSIONS[key];
  const seen = [];
  const items = s.items.filter(([id]) => !seen.includes(id) && seen.push(id));
  openSheet(`<h2>${s.emoji} ${s.name}</h2><div class="muted">${s.desc} · ⏱ ${s.min} min</div>
    <div style="margin:14px 0">${items.map(([id, sets]) => exLine(id, dose(id, sets === 'S' ? (phaseOf(weekNum()).n === 1 ? 2 : 3) : (sets > 1 ? sets : 0)))).join('')}</div>
    <button class="btn primary block" data-act="start" data-s="${key}">▶ Démarrer la séance</button>`);
}

/* =========================================================
   Lecteur de séance guidée
   ========================================================= */
let PL = null, plTick = null, poseTick = null, wakeLock = null;

function buildSteps(key) {
  const s = SESSIONS[key], ph = phaseOf(weekNum()).n, steps = [];
  s.items.forEach(([id, setsSpec, over], idx) => {
    const e = EXERCISES[id];
    const sets = setsSpec === 'S' ? (ph === 1 ? 2 : 3) : setsSpec;
    for (let n = 1; n <= sets; n++) {
      let secs = e.type === 'reps' ? 0 : secsOf(id, over);
      if (e.type === 'time' && e.side) secs *= 2;
      steps.push({ kind: 'work', id, set: n, sets, secs, reps: repsOf(id) });
      if (n < sets) steps.push({ kind: 'rest', secs: e.rest || 30, label: 'Récupération' });
    }
    const last = idx === s.items.length - 1;
    if (!last && !s.intervals) steps.push({ kind: 'rest', secs: s.rest || 20, label: 'Prépare-toi', prep: true });
  });
  return steps;
}
async function keepAwake(on) {
  try {
    if (on && 'wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen');
    else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch {}
}
document.addEventListener('visibilitychange', () => { if (PL && !PL.finished && document.visibilityState === 'visible') keepAwake(true); });

function startSession(key) {
  ensureAudio(); closeSheet();
  PL = { key, steps: buildSteps(key), i: 0, t0: Date.now(), paused: false, remaining: 0, endAt: 0, finished: false };
  $('#player').hidden = false; document.body.style.overflow = 'hidden';
  keepAwake(true); enterStep(0);
  clearInterval(plTick); plTick = setInterval(tickPlayer, 200);
}
function enterStep(i) {
  PL.i = i; const st = PL.steps[i];
  PL.paused = false; PL.half = false; PL.lastBeep = null;
  PL.remaining = st.secs; PL.endAt = st.secs ? Date.now() + st.secs * 1000 : 0;
  PL.breathIn = true; PL.breathAt = Date.now();
  buzz(st.kind === 'work' ? [60, 60, 60] : 40);
  beep(st.kind === 'work' ? 988 : 660, 0.15);
  drawPlayer();
}
function nextStep() { if (PL.i < PL.steps.length - 1) enterStep(PL.i + 1); else finishSession(); }
function prevStep() { if (PL.i > 0) enterStep(PL.i - 1); }
function tickPlayer() {
  if (!PL || PL.finished) return;
  const st = PL.steps[PL.i];
  if (!st.secs || PL.paused) return;
  const left = (PL.endAt - Date.now()) / 1000;
  const sec = Math.ceil(left);
  const el = $('#p-time'); if (el) el.textContent = fmtTime(left);
  if (sec <= 3 && sec > 0 && PL.lastBeep !== sec) { PL.lastBeep = sec; beep(740, 0.09, 0.2); }
  const e = st.id && EXERCISES[st.id];
  if (e && e.side && e.type === 'time' && !PL.half && left <= st.secs / 2) {
    PL.half = true; beep(880, 0.25); buzz(200);
    const c = $('#p-cue'); if (c) c.textContent = '↔ Change de côté';
  }
  if (e && e.type === 'breathe') {
    if (Date.now() - PL.breathAt >= 5000) { PL.breathAt = Date.now(); PL.breathIn = !PL.breathIn; const b = $('#breath'); if (b) { b.classList.toggle('in', PL.breathIn); b.textContent = PL.breathIn ? 'Inspire' : 'Expire'; } }
  }
  if (left <= 0) { beep(1046, 0.3); if (st.id && EXERCISES[st.id].type === 'free') { toast('Objectif atteint 🎯'); nextStep(); } else nextStep(); }
}
function togglePause() {
  const st = PL.steps[PL.i]; if (!st.secs) return;
  if (PL.paused) { PL.endAt = Date.now() + PL.remaining * 1000; PL.paused = false; }
  else { PL.remaining = Math.max(0, (PL.endAt - Date.now()) / 1000); PL.paused = true; }
  drawPlayer();
}
function addRest(n) { PL.endAt += n * 1000; tickPlayer(); }

function drawPlayer() {
  const st = PL.steps[PL.i], s = SESSIONS[PL.key];
  const pct = Math.round(PL.i / PL.steps.length * 100);
  const nextWork = PL.steps.slice(PL.i + 1).find(x => x.kind === 'work' && (st.kind === 'rest' || x.id !== st.id));
  let body = '', ctrl = '';
  clearInterval(poseTick);

  if (st.kind === 'rest') {
    const ne = nextWork && EXERCISES[nextWork.id];
    body = `<div class="p-kind rest">${st.label}</div>
      <div class="p-name">${st.prep && ne ? 'Ensuite : ' + ne.name : 'Souffle un peu'}</div>
      <div class="p-big" id="p-time">${fmtTime(PL.paused ? PL.remaining : (PL.endAt - Date.now()) / 1000)}</div>
      ${ne ? `<div class="p-fig" id="p-fig" style="width:min(44vw,170px)"><div class="a">${fig(ne.poses[0])}</div><div class="b">${fig(ne.poses[1])}</div></div>` : ''}
      <div class="p-cue">${st.prep && ne ? ne.cues[0] : 'Respire calmement, relâche les épaules.'}</div>`;
    ctrl = `<button class="btn round" data-act="pl-prev" aria-label="Précédent">⏮</button>
      <button class="btn ghost" data-act="pl-add">+15 s</button>
      <button class="btn teal" data-act="pl-next">Passer ⏭</button>`;
  } else {
    const e = EXERCISES[st.id];
    const setTxt = st.sets > 1 ? `Série ${st.set}/${st.sets}` : (s.intervals ? 'Intervalle' : 'Exercice');
    let big;
    if (e.type === 'reps') big = `<div class="p-big">${st.reps}<small>rép.${e.side ? ' / côté' : ''}</small></div>`;
    else if (e.type === 'breathe') big = `<div class="breath" id="breath">${PL.breathIn ? 'Inspire' : 'Expire'}</div><div class="p-big" id="p-time" style="font-size:2rem;margin-top:10px">${fmtTime(st.secs)}</div>`;
    else big = `<div class="p-big" id="p-time">${fmtTime(PL.paused ? PL.remaining : (PL.endAt - Date.now()) / 1000)}</div>${e.side ? '<div class="tiny">moitié du temps par côté</div>' : ''}`;
    body = `<div class="p-kind">${setTxt}</div>
      <div class="p-name">${e.name}</div>
      ${e.type !== 'breathe' ? `<div class="p-fig" id="p-fig"><div class="a">${fig(e.poses[0])}</div><div class="b">${fig(e.poses[1])}</div></div>` : ''}
      ${big}
      <div class="p-cue" id="p-cue">${e.cues[0]}</div>`;
    if (e.type === 'reps') {
      ctrl = `<button class="btn round" data-act="pl-prev" aria-label="Précédent">⏮</button>
        <button class="btn primary" data-act="pl-next">${st.set < st.sets ? 'Série terminée ✓' : 'Terminé ✓'}</button>
        <button class="btn round" data-act="pl-info" aria-label="Aide">?</button>`;
    } else {
      ctrl = `<button class="btn round" data-act="pl-prev" aria-label="Précédent">⏮</button>
        <button class="btn ${PL.paused ? 'primary' : 'ghost'}" data-act="pl-pause">${PL.paused ? '▶ Reprendre' : '⏸ Pause'}</button>
        <button class="btn round" data-act="pl-next" aria-label="Suivant">${e.type === 'free' ? '✓' : '⏭'}</button>`;
    }
    let ci = 0;
    poseTick = setInterval(() => {
      const f = $('#p-fig'); if (f) f.classList.toggle('flip');
      if (++ci % 3 === 0 && !PL.half) { const c = $('#p-cue'); if (c && e.cues.length > 1) c.textContent = e.cues[(ci / 3) % e.cues.length]; }
    }, 1600);
  }
  if (st.kind === 'rest') { let f = 0; poseTick = setInterval(() => { const x = $('#p-fig'); if (x) x.classList.toggle('flip'); f++; }, 1600); }

  const nxt = nextWork && st.kind === 'work' ? `<div class="p-next"><div class="thumb">${fig(EXERCISES[nextWork.id].poses[0])}</div><div class="grow"><div class="tiny">Ensuite</div><b>${EXERCISES[nextWork.id].name}</b></div></div>` : '';
  $('#player').innerHTML = `
    <div class="p-top"><button class="p-x" data-act="pl-quit" aria-label="Quitter">✕</button><div class="grow">${s.emoji} ${s.name}</div><span class="tiny">${pct}%</span></div>
    <div class="p-bar"><i style="width:${pct}%"></i></div>
    <div class="p-body">${body}</div>${nxt}<div class="p-ctrl">${ctrl}</div>`;
  const br = $('#breath');
  if (br && PL.breathIn) { PL.breathAt = Date.now(); setTimeout(() => br.classList.add('in'), 60); }
}

function finishSession(partial) {
  PL.finished = true; clearInterval(plTick); clearInterval(poseTick); keepAwake(false);
  const s = SESSIONS[PL.key], min = Math.max(1, Math.round((Date.now() - PL.t0) / 60000));
  const isRenfo = s.cat === 'renfo', t = LOG[todayKey()] || {};
  beep(784, .15); setTimeout(() => beep(988, .15), 160); setTimeout(() => beep(1318, .3), 320);
  $('#player').innerHTML = `
    <div class="p-top"><div class="grow"></div><button class="p-x" data-act="pl-close" aria-label="Fermer">✕</button></div>
    <div class="p-body" style="justify-content:flex-start;overflow-y:auto">
      <div class="p-done">
        <div class="trophy">${partial ? '👍' : '🏆'}</div>
        <div class="p-name">${partial ? 'Séance écourtée, c’est déjà ça !' : 'Séance terminée !'}</div>
        <div class="p-sub">${s.name} · ${min} min</div>
      </div>
      <div class="card" style="width:100%;text-align:left">
        ${isRenfo ? `<div class="fred" style="font-weight:600;margin-bottom:6px">Effort ressenti (RPE) : <span id="rpe-v" style="color:var(--orange)">7</span>/10</div>
          <input type="range" class="rpe" id="rpe" min="1" max="10" value="7">
          <div class="rpe-scale"><span>1 facile</span><span>cible 7-8</span><span>10 max</span></div>
          <div class="rpe-txt" id="rpe-t"></div>` : ''}
        <div class="fred" style="font-weight:600;margin:10px 0 8px">Tes articulations après la séance ?</div>
        <div class="feel" id="end-feel">${FEELS.map(([e, l], i) => `<button class="${(t.douleur ?? 1) === i ? 'on' : ''}" data-act="end-feel" data-v="${i}">${e}<span>${l}</span></button>`).join('')}</div>
      </div>
    </div>
    <div class="p-ctrl"><button class="btn primary" data-act="pl-save">Enregistrer ✓</button></div>`;
  PL.feel = t.douleur ?? 1;
  const r = $('#rpe');
  if (r) {
    const upd = () => { $('#rpe-v').textContent = r.value; $('#rpe-t').textContent = rpeText(+r.value); };
    r.addEventListener('input', upd); upd();
  }
  PL.min = min; PL.partial = !!partial;
}
function rpeText(v) {
  if (v <= 4) return 'Trop facile : tu peux augmenter les répétitions ou la charge.';
  if (v <= 6) return 'Effort modéré. Bien pour débuter, tu pourras monter un peu.';
  if (v <= 8) return 'Parfait : dans la zone cible, technique propre.';
  return 'Trop dur : allège la prochaine fois pour protéger tes articulations.';
}
function saveSession() {
  const s = SESSIONS[PL.key], d = day(todayKey());
  const field = s.cat === 'cardio' ? 'cardio' : s.cat === 'renfo' ? 'renfo' : 'mobilite';
  d[field] = true;
  d.sessions = d.sessions || [];
  const rec = { s: PL.key, min: PL.min };
  const r = $('#rpe'); if (r) { rec.rpe = +r.value; d.rpe = +r.value; }
  d.douleur = PL.feel;
  d.sessions.push(rec);
  saveLog();
  closePlayer();
  confetti(); toast(rand(CHEERS));
  checkBadges();
  render();
}
function closePlayer() {
  clearInterval(plTick); clearInterval(poseTick); keepAwake(false);
  $('#player').hidden = true; $('#player').innerHTML = ''; document.body.style.overflow = ''; PL = null;
}

/* =========================================================
   Vue : Nutrition
   ========================================================= */
function nutriToday() {
  const all = store.get('nutri', {}), d = all[todayKey()] || {};
  const water = store.get('water', {})[todayKey()] || 0;
  d.eau = water >= 6;
  return d;
}
const isoWeek = () => weekKeys()[0];
function viewNutrition() {
  const d = nutriToday(), done = NUTRI_DAILY.filter(x => d[x.id]).length, tot = NUTRI_DAILY.length;
  const C = 2 * Math.PI * 34, pct = done / tot;
  const wk = (store.get('nutriw', {})[isoWeek()]) || {};
  const shop = store.get('shop', {});
  const msg = pct >= 1 ? 'Journée parfaite 🥇' : pct >= .75 ? 'Très bonne journée, presque tout y est.' : pct >= .4 ? 'Bien parti, continue au prochain repas.' : 'Coche au fil de la journée ce que tu as mangé.';
  const todayIdx = dow(new Date());
  return `
    <div class="card nut-head">
      <div class="score-ring"><svg viewBox="0 0 84 84"><circle cx="42" cy="42" r="34" stroke="var(--card-2)"/><circle cx="42" cy="42" r="34" stroke="#4FAF6A" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}"/></svg><div class="v">${done}/${tot}</div></div>
      <div><div class="fred" style="font-weight:600;font-size:1.1rem">Assiette du jour</div><div class="muted">${msg}</div></div>
    </div>
    <div class="card" style="padding:4px 14px">
      ${NUTRI_DAILY.map(x => `<button class="check ${d[x.id] ? 'on' : ''}" data-act="${x.auto ? 'go-water' : 'nut'}" data-id="${x.id}">
        <span class="box">${d[x.id] ? '✓' : ''}</span><span class="grow"><div class="lb">${x.label}</div><div class="hn">${x.hint}</div></span></button>`).join('')}
    </div>

    <div class="sec-title">Cette semaine</div>
    <div class="card" style="padding:4px 14px">
      ${NUTRI_WEEKLY.map(x => { const v = wk[x.id] || 0; return `<div class="wk"><span class="grow"><div class="lb fred" style="font-weight:600">${x.label} ${v >= x.target ? '✅' : ''}</div><div class="tiny">${x.hint} · objectif ${x.target}</div></span>
        <span class="stepper"><button data-act="nutw" data-id="${x.id}" data-v="-1" aria-label="Moins">−</button><b>${v}/${x.target}</b><button data-act="nutw" data-id="${x.id}" data-v="1" aria-label="Plus">+</button></span></div>`; }).join('')}
    </div>

    <div class="sec-title">Menu de la semaine</div>
    <details class="guide" open><summary>${WEEK_MENU[todayIdx].d} — aujourd’hui</summary><div class="gb">${menuDay(WEEK_MENU[todayIdx])}</div></details>
    <details class="guide"><summary>Toute la semaine</summary><div class="gb">${WEEK_MENU.map((m, i) => `<div class="menu-day ${i === todayIdx ? 'today' : ''}"><h4>${m.d}</h4>${menuDay(m)}</div>`).join('')}</div></details>
    <details class="guide"><summary>🛒 Liste de courses (${Object.values(shop).filter(Boolean).length} cochés)</summary><div class="gb">
      ${SHOPPING.map(g => `<div class="tiny" style="margin:10px 0 2px;font-weight:700;text-transform:uppercase;letter-spacing:.06em">${g.r}</div>
        ${g.items.map(it => `<button class="check ${shop[it] ? 'on' : ''}" data-act="shop" data-id="${esc(it)}"><span class="box">${shop[it] ? '✓' : ''}</span><span class="lb" style="${shop[it] ? 'text-decoration:line-through' : ''}">${it}</span></button>`).join('')}`).join('')}
      <button class="btn sm ghost" style="margin-top:12px" data-act="shop-reset">Tout décocher</button>
    </div></details>

    <div class="sec-title">Repères nutrition <small>pour 57 ans · 75 kg</small></div>
    ${NUTRI_GUIDE.map(g => `<details class="guide"><summary>${g.t}</summary><div class="gb"><div class="muted">${g.b}</div>${g.pills.length ? `<div class="pill-row">${g.pills.map(p => `<span class="pill">${p}</span>`).join('')}</div>` : ''}</div></details>`).join('')}
    <p class="tiny" style="margin-top:12px">Repères généraux, pas une prescription. À ajuster selon ton appétit, ton activité et l’avis de ton médecin.</p>`;
}
const menuDay = m => `<div><b>Matin :</b> ${m.m}</div><div><b>Midi :</b> ${m.mi}</div><div><b>Soir :</b> ${m.s}</div>`;

/* =========================================================
   Vue : Progrès
   ========================================================= */
function lineChart(pts, o) {
  if (pts.length < 2) return `<div class="tiny" style="padding:18px 4px">${o.empty}</div>`;
  const W = 320, H = 110, L = 28, R = 10, T = 10, B = 18;
  const ys = pts.map(p => p.y);
  const min = o.min ?? Math.floor(Math.min(...ys) - 1), max = o.max ?? Math.ceil(Math.max(...ys) + 1);
  const X = i => L + i / (pts.length - 1) * (W - L - R), Y = v => T + (1 - (v - min) / (max - min || 1)) * (H - T - B);
  const grid = [min, (min + max) / 2, max].map(v => `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)" stroke-width="1"/><text x="${L - 6}" y="${Y(v) + 4}" font-size="10" text-anchor="end" fill="var(--ink-3)">${Math.round(v * 10) / 10}</text>`).join('');
  const band = o.band ? `<rect x="${L}" width="${W - L - R}" y="${Y(o.band[1])}" height="${Y(o.band[0]) - Y(o.band[1])}" fill="${o.color}" opacity=".12"/>` : '';
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(p.y).toFixed(1)}`).join(' ');
  const last = pts[pts.length - 1];
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.label}">${band}${grid}
    <path d="${d}" fill="none" stroke="${o.color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${pts.map((p, i) => `<circle cx="${X(i)}" cy="${Y(p.y)}" r="${i === pts.length - 1 ? 4.5 : 2.5}" fill="${o.color}"/>`).join('')}
    <text x="${L}" y="${H - 3}" font-size="10" fill="var(--ink-3)">${pts[0].l}</text><text x="${W - R}" y="${H - 3}" font-size="10" text-anchor="end" fill="var(--ink-3)">${last.l}</text></svg>`;
}
const shortDate = k => { const d = parseKey(k); return `${d.getDate()}/${d.getMonth() + 1}`; };
function viewProgres() {
  const w = weekNum(), ph = phaseOf(w), st = lifetime(), earned = store.get('badges', []);
  // Calendrier d'activité (12 semaines)
  const mon = addDays(today0(), -dow(today0()) - 77);
  let heat = DAY_SHORT.map(x => `<div class="hd">${x}</div>`).join('');
  for (let i = 0; i < 84; i++) {
    const dd = addDays(mon, i), k = keyOf(dd), L = LOG[k] || {};
    const lv = (L.mobilite ? 1 : 0) + (L.renfo ? 1 : 0) + (L.cardio ? 1 : 0);
    heat += dd > today0() ? '<div></div>' : `<div class="h ${lv ? 'l' + lv : ''} ${k === todayKey() ? 'today' : ''}" title="${shortDate(k)}"></div>`;
  }
  const painPts = Object.keys(LOG).sort().filter(k => LOG[k].douleur !== undefined).slice(-21).map(k => ({ y: LOG[k].douleur, l: shortDate(k) }));
  const rpePts = Object.keys(LOG).sort().filter(k => LOG[k].rpe).slice(-12).map(k => ({ y: LOG[k].rpe, l: shortDate(k) }));
  const poids = store.get('poids', []);
  const poidsPts = poids.slice(-15).map(p => ({ y: p.v, l: p.d.slice(0, 5) }));
  const tests = store.get('tests', {});

  return `
    <div class="sec-title">Programme 12 semaines</div>
    <div class="card">
      <div class="row" style="margin-bottom:14px">
        <button class="btn sm ghost" data-act="week" data-v="-1" aria-label="Semaine précédente">‹</button>
        <div class="grow" style="text-align:center"><div class="fred" style="font-weight:700;font-size:1.15rem">Semaine ${w}${w > 12 ? '' : '/12'}</div><div class="tiny">Phase ${ph.n} · ${ph.label}</div></div>
        <button class="btn sm ghost" data-act="week" data-v="1" aria-label="Semaine suivante">›</button>
      </div>
      <div class="timeline">${PHASES.map(p => `<div class="tl ${p.n < ph.n ? 'past' : p.n === ph.n ? 'now' : ''}"><h4>${p.to < 99 ? `Semaines ${p.from}-${p.to}` : 'Après 12 semaines'} · ${p.label}</h4><p>${p.tip}</p></div>`).join('')}</div>
    </div>

    <div class="sec-title">Activité <small>12 dernières semaines</small></div>
    <div class="card"><div class="heat">${heat}</div>
      <div class="row tiny" style="margin-top:10px;gap:6px">Moins <span class="h" style="width:12px;height:12px;border-radius:3px;background:var(--card-2);display:inline-block"></span><span style="width:12px;height:12px;border-radius:3px;background:rgba(15,162,182,.35);display:inline-block"></span><span style="width:12px;height:12px;border-radius:3px;background:rgba(15,162,182,.65);display:inline-block"></span><span style="width:12px;height:12px;border-radius:3px;background:var(--teal);display:inline-block"></span> Plus</div></div>

    <div class="stat-row">
      <div class="stat"><div class="n">${st.maxStreak}</div><div class="l">record de suite</div></div>
      <div class="stat"><div class="n">${st.totalRenfo}</div><div class="l">séances renfort</div></div>
      <div class="stat"><div class="n">${st.totalCardio}</div><div class="l">séances cardio</div></div>
    </div>

    <div class="sec-title">Badges <small>${earned.length}/${BADGES.length}</small></div>
    <div class="badges">${BADGES.map(b => `<div class="badge ${earned.includes(b.id) ? 'on' : ''}"><span class="i">${b.icon}</span>${b.name}</div>`).join('')}</div>

    <div class="sec-title">Tests de repère <small>tous les 2-3 mois</small></div>
    <div class="card" style="padding:4px 14px">${TESTS.map(t => {
      const h = tests[t.id] || [], last = h[h.length - 1], first = h[0];
      const show = v => t.mode === 'choice' ? t.choices[v] : `${v} ${t.unit}`;
      const dlt = h.length > 1 ? last.v - first.v : 0;
      return `<div class="test-row"><div class="grow"><div class="fred" style="font-weight:600">${t.name}</div>
        <div class="tiny">${last ? `Dernier : <b>${show(last.v)}</b> (${shortDate(last.d)})` : 'Pas encore fait'} ${dlt ? `<span class="delta ${dlt > 0 ? 'up' : 'down'}">${dlt > 0 ? '▲' : '▼'} ${t.mode === 'choice' ? 'depuis le 1er test' : Math.abs(Math.round(dlt * 10) / 10) + ' ' + t.unit}</span>` : ''}</div></div>
        <button class="btn sm teal" data-act="test" data-id="${t.id}">Faire</button></div>`;
    }).join('')}</div>

    <div class="sec-title">Articulations <small>0 = top · 4 = douleur</small></div>
    <div class="card">${lineChart(painPts, { min: 0, max: 4, color: '#FD9C29', label: 'Évolution de la gêne articulaire', empty: 'Indique ton ressenti sur l’accueil quelques jours pour voir la tendance.' })}</div>

    <div class="sec-title">Effort ressenti (RPE) <small>zone cible 7-8</small></div>
    <div class="card">${lineChart(rpePts, { min: 1, max: 10, band: [7, 8], color: '#0FA2B6', label: 'Évolution du RPE', empty: 'Le RPE est enregistré à la fin de chaque séance de renfort.' })}</div>

    <div class="sec-title">Poids</div>
    <div class="card">
      <div class="row"><div class="field grow" style="margin:0"><input type="number" id="poids" inputmode="decimal" step="0.1" placeholder="${poids.length ? poids[poids.length - 1].v : 75} kg"></div><button class="btn teal" data-act="poids">Ajouter</button></div>
      ${lineChart(poidsPts, { color: '#8A6FD1', label: 'Évolution du poids', empty: 'Ajoute au moins 2 mesures (1 fois par semaine suffit).' })}
    </div>

    <div class="sec-title">Notes</div>
    <textarea id="notes" placeholder="Ressentis, douleurs, progrès observés…">${esc(store.get('notes', ''))}</textarea>`;
}

/* ---------- Tests de repère ---------- */
let testTimer = null;
function sheetTest(id) {
  const t = TESTS.find(x => x.id === id);
  let inner = '';
  if (t.mode === 'choice') inner = `<div style="display:grid;gap:8px;margin-top:14px">${t.choices.map((c, i) => `<button class="btn ghost block" data-act="test-save" data-id="${id}" data-v="${i}">${c}</button>`).join('')}</div>`;
  else if (t.mode === 'chrono') inner = `<div class="chrono" id="chrono">0,0 s</div><button class="btn primary block" id="chrono-btn" data-act="chrono" data-id="${id}">▶ Départ</button><div id="chrono-save"></div>`;
  else inner = `<div class="chrono" id="chrono">30</div><button class="btn primary block" id="chrono-btn" data-act="count30" data-id="${id}">▶ Départ (30 s)</button><div id="chrono-save"></div>`;
  openSheet(`<h2>${t.name}</h2><p class="muted">${t.how}</p>${inner}`);
}
function saveTest(id, v) {
  const all = store.get('tests', {}); (all[id] = all[id] || []).push({ d: todayKey(), v });
  store.set('tests', all); closeSheet(); toast('Test enregistré 📏'); checkBadges(); render();
}

/* =========================================================
   Réglages
   ========================================================= */
const sw = (act, on, label, hint = '') => `<div class="switch"><div><div class="lb">${label}</div>${hint ? `<div class="tiny">${hint}</div>` : ''}</div><label class="tog"><input type="checkbox" data-act="${act}" ${on ? 'checked' : ''}><span></span></label></div>`;
const seg = (act, cur, opts) => `<div class="seg">${opts.map(([v, l]) => `<button class="${cur === v ? 'on' : ''}" data-act="${act}" data-v="${v}">${l}</button>`).join('')}</div>`;
const daysPick = (act, sel) => `<div class="days">${DAY_SHORT.map((d, i) => `<button class="${sel.includes(i) ? 'on' : ''}" data-act="${act}" data-v="${i}">${d}</button>`).join('')}</div>`;
function sheetSettings() {
  const c = SET.cal;
  openSheet(`<h2>Réglages</h2>
    <div class="sec-title">Profil</div>
    <div class="card">
      <div class="field"><label>Prénom</label><input type="text" id="s-name" value="${esc(SET.name)}" placeholder="Ton prénom"></div>
      <div class="field" style="margin:0"><label>Début du programme</label><input type="date" id="s-start" value="${SET.start || todayKey()}"></div>
    </div>
    <div class="sec-title">Affichage</div>
    <div class="card">
      <div class="field"><label>Thème</label>${seg('s-theme', SET.theme, [['auto', 'Auto'], ['light', 'Clair'], ['dark', 'Sombre']])}</div>
      <div class="field" style="margin:0"><label>Taille du texte</label>${seg('s-size', SET.size, [['normal', 'Normale'], ['large', 'Grande']])}</div>
    </div>
    <div class="sec-title">Séances</div>
    <div class="card" style="padding:4px 16px">
      ${sw('s-sound', SET.sound, 'Sons', 'Bips de décompte et de fin')}
      ${sw('s-vibrate', SET.vibrate, 'Vibrations')}
      <div class="field" style="margin:12px 0"><label>Séance de renfort proposée</label>${seg('s-pref', SET.renfoPref, [['alterne', 'Alterner'], ['renfo', 'Haltères'], ['maison', 'Chaise']])}</div>
      <div class="switch"><div><div class="lb">Niveau de répétitions</div><div class="tiny">Ajusté selon ton RPE : ${SET.bonus > 0 ? '+' : ''}${SET.bonus || 0} rép.</div></div>
        <span class="stepper"><button data-act="bonus" data-v="-1">−</button><button data-act="bonus" data-v="1">+</button></span></div>
    </div>
    <div class="sec-title">Rappels</div>
    <div class="card" style="padding:4px 16px">
      ${sw('s-remind', SET.remind, 'Rappels dans l’appli', 'Message sur l’accueil si une séance a été manquée')}
      ${sw('s-cal', c.on, 'Rappels Google Agenda', 'Séances récurrentes ajoutées à ton agenda')}
      ${c.on ? `
        <div class="field" style="margin-top:12px"><label>Mobilité chaque jour à</label><input type="time" id="c-mob" value="${c.mobTime}"></div>
        <div class="field"><label>Renfort — jours</label>${daysPick('c-rd', c.renfoDays)}</div>
        <div class="field"><label>Renfort — heure</label><input type="time" id="c-rt" value="${c.renfoTime}"></div>
        <div class="field"><label>Cardio — jours</label>${daysPick('c-cd', c.cardioDays)}</div>
        <div class="field"><label>Cardio — heure</label><input type="time" id="c-ct" value="${c.cardioTime}"></div>
        <p class="tiny">Chaque bouton ouvre Google Agenda avec l’événement pré-rempli : il suffit d’appuyer sur « Enregistrer ».</p>
        <div style="display:grid;gap:8px;margin:10px 0">
          <button class="btn teal block" data-act="gcal" data-v="mob">🧘 Ajouter la mobilité quotidienne</button>
          <button class="btn teal block" data-act="gcal" data-v="renfo">💪 Ajouter les séances de renfort</button>
          <button class="btn teal block" data-act="gcal" data-v="cardio">🚶 Ajouter les séances de cardio</button>
          <button class="btn ghost block" data-act="ics">⬇ Ou télécharger un fichier agenda (.ics)</button>
        </div>` : `<p class="tiny" style="margin:8px 0 12px">Pour arrêter des rappels déjà ajoutés, supprime les événements « Fitness 57 » dans Google Agenda (option « Tous les événements »).</p>`}
    </div>
    <div class="sec-title">Données</div>
    <div class="card">
      <p class="tiny" style="margin-top:0">Tout est stocké uniquement sur ce téléphone. Exporte de temps en temps pour ne rien perdre.</p>
      <div style="display:grid;gap:8px">
        <button class="btn ghost block" data-act="export">⬇ Exporter mes données</button>
        <label class="btn ghost block">⬆ Importer une sauvegarde<input type="file" id="import" accept="application/json,.json" hidden></label>
        <button class="btn ghost block" style="color:var(--red)" data-act="reset">Tout effacer</button>
      </div>
    </div>
    <p class="tiny" style="text-align:center;margin-top:16px">Fitness 57 · v2.2 · conseils généraux, pas un avis médical</p>`, true);
  $('#s-name').addEventListener('change', e => { SET.name = e.target.value.trim(); saveSet(); render(); });
  $('#s-start').addEventListener('change', e => { if (e.target.value) { SET.start = e.target.value; saveSet(); render(); } });
  ['c-mob', 'c-rt', 'c-ct'].forEach(id => { const el = $('#' + id); if (el) el.addEventListener('change', () => { SET.cal[{ 'c-mob': 'mobTime', 'c-rt': 'renfoTime', 'c-ct': 'cardioTime' }[id]] = el.value; saveSet(); }); });
  $('#import').addEventListener('change', importData);
}

/* ---------- Agenda ---------- */
const APP_URL = () => location.href.split('#')[0].split('?')[0];
function nextDateFor(days) {
  const t = today0();
  for (let i = 0; i < 7; i++) { const d = addDays(t, i); if (!days.length || days.includes(dow(d))) return d; }
  return t;
}
const stamp = (d, time) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${time.replace(':', '')}00`;
function endTime(time, mins) { const [h, m] = time.split(':').map(Number); const t = h * 60 + m + mins; return `${pad(Math.floor(t / 60) % 24)}:${pad(t % 60)}`; }
function calEvents() {
  const c = SET.cal, ev = [];
  ev.push({ k: 'mob', title: 'Fitness 57 · Mobilité (10 min)', desc: 'Routine Réveil articulaire. Ouvre l’appli : ', time: c.mobTime, mins: 10, rrule: 'FREQ=DAILY', days: [] });
  if (c.renfoDays.length) ev.push({ k: 'renfo', title: 'Fitness 57 · Renforcement (25 min)', desc: 'Séance de renfort (haltères ou chaise). Ouvre l’appli : ', time: c.renfoTime, mins: 25, rrule: 'FREQ=WEEKLY;BYDAY=' + c.renfoDays.sort().map(i => DAY_ICS[i]).join(','), days: c.renfoDays });
  if (c.cardioDays.length) ev.push({ k: 'cardio', title: 'Fitness 57 · Cardio (30 min)', desc: 'Marche rapide ou fractionné. Ouvre l’appli : ', time: c.cardioTime, mins: 30, rrule: 'FREQ=WEEKLY;BYDAY=' + c.cardioDays.sort().map(i => DAY_ICS[i]).join(','), days: c.cardioDays });
  return ev;
}
function openGcal(k) {
  const e = calEvents().find(x => x.k === k);
  if (!e) { toast('Choisis au moins un jour'); return; }
  const d = nextDateFor(e.days);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Madrid';
  const url = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
    + '&text=' + encodeURIComponent(e.title)
    + '&dates=' + stamp(d, e.time) + '/' + stamp(d, endTime(e.time, e.mins))
    + '&ctz=' + encodeURIComponent(tz)
    + '&recur=' + encodeURIComponent('RRULE:' + e.rrule)
    + '&details=' + encodeURIComponent(e.desc + APP_URL());
  window.open(url, '_blank');
}
function downloadIcs() {
  const icsEsc = s => s.replace(/\\/g, '\\\\').replace(/[,;]/g, m => '\\' + m).replace(/\n/g, '\\n');
  const now = new Date(), dtstamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Fitness57//FR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Fitness 57'];
  calEvents().forEach(e => {
    const d = nextDateFor(e.days);
    lines.push('BEGIN:VEVENT', `UID:fitness57-${e.k}-${dtstamp}@fitness57`, `DTSTAMP:${dtstamp}`,
      `DTSTART:${stamp(d, e.time)}`, `DTEND:${stamp(d, endTime(e.time, e.mins))}`, `RRULE:${e.rrule}`,
      `SUMMARY:${icsEsc(e.title)}`, `DESCRIPTION:${icsEsc(e.desc + APP_URL())}`, `URL:${APP_URL()}`,
      'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsEsc(e.title)}`, 'TRIGGER:-PT10M', 'END:VALARM', 'END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  download(new Blob([lines.join('\r\n')], { type: 'text/calendar' }), 'fitness57-rappels.ics');
  toast('Fichier agenda téléchargé 📅');
}
function download(blob, name) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}

/* ---------- Sauvegarde ---------- */
function exportData() {
  const data = {};
  Object.keys(localStorage).filter(k => k.startsWith(P)).forEach(k => data[k] = localStorage.getItem(k));
  download(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), `fitness57-sauvegarde-${todayKey()}.json`);
}
function importData(e) {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const data = JSON.parse(r.result);
      const keys = Object.keys(data).filter(k => k.startsWith(P));
      if (!keys.length) throw 0;
      keys.forEach(k => localStorage.setItem(k, data[k]));
      toast('Import réussi ✓'); setTimeout(() => location.reload(), 700);
    } catch { toast('Fichier invalide'); }
  };
  r.readAsText(f);
}

/* ---------- Bienvenue ---------- */
function onboarding() {
  openSheet(`<div style="text-align:center;padding:6px 0 4px"><img src="icon-192.png" alt="" style="width:76px;height:76px;border-radius:20px"></div>
    <h2 style="text-align:center">Bienvenue dans Fitness 57</h2>
    <p class="muted" style="text-align:center">Ton coach mobilité, renforcement, cardio et nutrition. Chaque jour, l’appli te propose la bonne séance et te guide pas à pas.</p>
    <div class="card" style="margin-top:14px">
      <div class="field"><label>Ton prénom</label><input type="text" id="ob-name" placeholder="Prénom" value="${esc(SET.name)}"></div>
      <div class="field" style="margin:0"><label>Début du programme de 12 semaines</label><input type="date" id="ob-start" value="${todayKey()}"></div>
    </div>
    <button class="btn primary block" data-act="ob-go">C’est parti 🚀</button>
    <p class="tiny" style="text-align:center">Conseils généraux de prévention. En cas de douleur inhabituelle, arrête et demande l’avis d’un médecin.</p>`);
}

/* =========================================================
   Actions (délégation d'événements)
   ========================================================= */
const ACT = {
  go: t => go(t.dataset.v),
  close: () => closeSheet(),
  start: t => startSession(t.dataset.s),
  preview: t => sheetSession(t.dataset.s),
  exo: t => sheetExo(t.dataset.id),
  filter: t => { libFilter = t.dataset.v; render(); },
  dismiss: t => { const d = store.get('dismiss', {}); d[t.dataset.k] = t.dataset.v || todayKey(); store.set('dismiss', d); render(); },
  bonus: t => { SET.bonus = Math.max(-6, Math.min(10, (SET.bonus || 0) + Number(t.dataset.v))); saveSet(); toast(`Répétitions : ${SET.bonus > 0 ? '+' : ''}${SET.bonus}`);
    const d = store.get('dismiss', {}); d.prog = lastRenfoRpes(2).join(','); store.set('dismiss', d);
    if (!$('#sheet').hidden) sheetSettings(); render(); },
  feel: t => { const d = day(todayKey()), v = +t.dataset.v; d.douleur = d.douleur === v ? undefined : v; saveLog(); render(); if (v >= 3 && d.douleur === v) toast('Séance douce proposée 🍃'); },
  toggle: t => { const d = day(todayKey()), f = t.dataset.f; d[f] = !d[f]; saveLog(); if (d[f]) { toast(rand(CHEERS)); checkBadges(); } render(); },
  water: t => { const w = store.get('water', {}), k = todayKey(), v = +t.dataset.v; w[k] = w[k] === v ? v - 1 : v; store.set('water', w); if (w[k] === 6) toast('1,5 L atteint 💧'); render(); },
  'go-water': () => go('home'),
  nut: t => { const all = store.get('nutri', {}), k = todayKey(); all[k] = all[k] || {}; all[k][t.dataset.id] = !all[k][t.dataset.id]; store.set('nutri', all);
    const d = nutriToday(); if (NUTRI_DAILY.every(x => d[x.id])) { confetti(); toast('Assiette parfaite 🥇'); } render(); },
  nutw: t => { const all = store.get('nutriw', {}), w = isoWeek(); all[w] = all[w] || {}; all[w][t.dataset.id] = Math.max(0, (all[w][t.dataset.id] || 0) + Number(t.dataset.v)); store.set('nutriw', all); render(); },
  shop: t => { const s = store.get('shop', {}); s[t.dataset.id] = !s[t.dataset.id]; store.set('shop', s); const open = [...document.querySelectorAll('details.guide')].map(d => d.open); render(); document.querySelectorAll('details.guide').forEach((d, i) => d.open = open[i]); },
  'shop-reset': () => { store.set('shop', {}); render(); },
  week: t => { const w = Math.max(1, weekNum() + Number(t.dataset.v)); SET.start = keyOf(addDays(today0(), -(w - 1) * 7)); saveSet(); render(); },
  poids: () => { const v = parseFloat(($('#poids').value || '').replace(',', '.')); if (!(v > 30 && v < 250)) { toast('Poids invalide'); return; }
    const p = store.get('poids', []); p.push({ v, d: new Date().toLocaleDateString('fr-FR') }); store.set('poids', p); toast('Poids enregistré'); render(); },
  test: t => sheetTest(t.dataset.id),
  'test-save': t => saveTest(t.dataset.id, +t.dataset.v),
  chrono: t => {
    const btn = $('#chrono-btn');
    if (!testTimer) { ensureAudio(); beep(988, .15); const t0 = Date.now(); btn.textContent = '■ Stop'; $('#chrono-save').innerHTML = '';
      testTimer = setInterval(() => { $('#chrono').textContent = ((Date.now() - t0) / 1000).toFixed(1).replace('.', ',') + ' s'; }, 100); btn.dataset.t0 = t0; }
    else { clearInterval(testTimer); testTimer = null; beep(660, .2); const v = Math.round((Date.now() - +btn.dataset.t0) / 100) / 10; btn.textContent = '↺ Recommencer';
      $('#chrono-save').innerHTML = `<button class="btn teal block" style="margin-top:8px" data-act="test-save" data-id="${t.dataset.id}" data-v="${v}">Enregistrer ${String(v).replace('.', ',')} s</button>`; }
  },
  count30: t => {
    if (testTimer) return; ensureAudio(); beep(988, .15); const end = Date.now() + 30000; $('#chrono-btn').hidden = true;
    testTimer = setInterval(() => { const left = Math.ceil((end - Date.now()) / 1000); $('#chrono').textContent = Math.max(0, left);
      if (left <= 0) { clearInterval(testTimer); testTimer = null; beep(1046, .4); buzz(300);
        $('#chrono-save').innerHTML = `<div class="field" style="margin-top:8px"><label>Nombre de levers</label><input type="number" id="cnt" inputmode="numeric" min="0" max="60"></div><button class="btn teal block" data-act="count-save" data-id="${t.dataset.id}">Enregistrer</button>`; } }, 200);
  },
  'count-save': t => { const v = parseInt($('#cnt').value, 10); if (v >= 0) saveTest(t.dataset.id, v); },

  'pl-next': () => { const st = PL.steps[PL.i]; if (st.kind === 'work' && st.id && EXERCISES[st.id].type === 'free' && PL.endAt - Date.now() > 0 && !confirm('Terminer la marche maintenant ?')) return; nextStep(); },
  'pl-prev': () => prevStep(),
  'pl-pause': () => togglePause(),
  'pl-add': () => addRest(15),
  'pl-info': () => { const st = PL.steps[PL.i]; if (st.id) { const e = EXERCISES[st.id]; alert(`${e.name}\n\n${e.how}${e.warn ? '\n\n⚠️ ' + e.warn : ''}`); } },
  'pl-quit': () => { const done = PL.i / PL.steps.length;
    if (done >= 0.5 ? confirm('Tu as fait plus de la moitié. Arrêter et enregistrer la séance ?') : confirm('Quitter la séance ? Elle ne sera pas enregistrée.')) { if (done >= 0.5) finishSession(true); else closePlayer(); } },
  'pl-close': () => closePlayer(),
  'pl-save': () => saveSession(),
  'end-feel': t => { PL.feel = +t.dataset.v; document.querySelectorAll('#end-feel button').forEach(b => b.classList.toggle('on', b === t)); },

  's-theme': t => { SET.theme = t.dataset.v; saveSet(); applyDisplay(); sheetSettings(); },
  's-size': t => { SET.size = t.dataset.v; saveSet(); applyDisplay(); sheetSettings(); },
  's-pref': t => { SET.renfoPref = t.dataset.v; saveSet(); sheetSettings(); render(); },
  'c-rd': t => { const a = SET.cal.renfoDays, v = +t.dataset.v; SET.cal.renfoDays = a.includes(v) ? a.filter(x => x !== v) : a.concat(v); saveSet(); sheetSettings(); },
  'c-cd': t => { const a = SET.cal.cardioDays, v = +t.dataset.v; SET.cal.cardioDays = a.includes(v) ? a.filter(x => x !== v) : a.concat(v); saveSet(); sheetSettings(); },
  gcal: t => openGcal(t.dataset.v),
  ics: () => downloadIcs(),
  export: () => exportData(),
  reset: () => { if (confirm('Effacer toutes tes données ? Cette action est définitive.') && confirm('Vraiment tout effacer ?')) { Object.keys(localStorage).filter(k => k.startsWith(P)).forEach(k => localStorage.removeItem(k)); location.reload(); } },
  'ob-go': () => { SET.name = $('#ob-name').value.trim(); SET.start = $('#ob-start').value || todayKey(); saveSet(); closeSheet(); render(); toast('Bienvenue ' + (SET.name || '') + ' 👋'); }
};
// interrupteurs (checkbox)
const SWITCH = {
  's-sound': v => { SET.sound = v; if (v) { ensureAudio(); beep(); } },
  's-vibrate': v => { SET.vibrate = v; buzz(80); },
  's-remind': v => { SET.remind = v; },
  's-cal': v => { SET.cal.on = v; }
};

document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]');
  if (!t || t.tagName === 'INPUT') return;
  const f = ACT[t.dataset.act]; if (f) { e.preventDefault(); f(t, e); }
});
document.addEventListener('change', e => {
  const t = e.target; if (t.type === 'checkbox' && SWITCH[t.dataset.act]) { SWITCH[t.dataset.act](t.checked); saveSet(); if (t.dataset.act === 's-cal') sheetSettings(); render(); }
});
$('#sheet-backdrop').addEventListener('click', closeSheet);
$('#btn-settings').addEventListener('click', sheetSettings);
document.querySelectorAll('#bottom-nav button').forEach(b => b.addEventListener('click', () => go(b.dataset.view)));
// rafraîchir l'accueil quand on revient sur l'appli un autre jour
let lastDay = todayKey();
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && todayKey() !== lastDay && !PL) { lastDay = todayKey(); render(); } });

/* =========================================================
   Démarrage
   ========================================================= */
render();
checkBadges(true);
if (!SET.start) onboarding();

if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
