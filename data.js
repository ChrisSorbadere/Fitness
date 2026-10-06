/* Fitness 57 — données (exercices, séances, nutrition, citations, pictogrammes) */

/* ---------- Pictogrammes SVG originaux ---------- */
const A = 'var(--accent)';
function pic(inner){
  return `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}
const head = (x, y, r = 5.5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" stroke="none"/>`;
const ground = (y = 60) => `<line x1="4" y1="${y}" x2="60" y2="${y}" stroke="var(--line-strong)" stroke-width="2"/>`;
const arrow = (d) => `<path d="${d}" stroke="${A}" stroke-width="3"/>`;

const POSES = {
  neck_a: pic(`${head(32,14,7)}<line x1="32" y1="21" x2="32" y2="44"/><line x1="18" y1="27" x2="46" y2="27"/><line x1="18" y1="27" x2="16" y2="46"/><line x1="46" y1="27" x2="48" y2="46"/>
    ${arrow('M22 6 Q12 10 16 20')}${arrow('M16 20 l-4.5 -2.5 M16 20 l1.2 -5')}`),
  neck_b: pic(`${head(32,14,7)}<line x1="32" y1="21" x2="32" y2="44"/><line x1="18" y1="27" x2="46" y2="27"/><line x1="18" y1="27" x2="16" y2="46"/><line x1="46" y1="27" x2="48" y2="46"/>
    ${arrow('M42 6 Q52 10 48 20')}${arrow('M48 20 l4.5 -2.5 M48 20 l-1.2 -5')}`),

  catcow_a: pic(`${head(10,26)}<path d="M15,29 Q32,13 49,29"/><line x1="18" y1="28" x2="18" y2="52"/><line x1="46" y1="29" x2="46" y2="52"/><line x1="46" y1="52" x2="58" y2="52"/>${ground(54)}
    ${arrow('M32 8 v-5 M32 3 l-3 3 M32 3 l3 3')}`),
  catcow_b: pic(`${head(10,24)}<path d="M15,29 Q32,40 49,29"/><line x1="18" y1="30" x2="18" y2="52"/><line x1="46" y1="30" x2="46" y2="52"/><line x1="46" y1="52" x2="58" y2="52"/>${ground(54)}
    ${arrow('M32 44 v5 M32 49 l-3 -3 M32 49 l3 -3')}`),

  shoulders_a: pic(`${head(32,11)}<line x1="32" y1="17" x2="32" y2="40"/><line x1="32" y1="22" x2="10" y2="22"/><line x1="32" y1="22" x2="54" y2="22"/><line x1="32" y1="40" x2="25" y2="59"/><line x1="32" y1="40" x2="39" y2="59"/>
    ${arrow('M6 15 A7 7 0 1 0 10 29')}${arrow('M58 15 A7 7 0 1 1 54 29')}`),
  shoulders_b: pic(`${head(32,11)}<line x1="32" y1="17" x2="32" y2="40"/><line x1="46" y1="24" x2="14" y2="25"/><line x1="22" y1="31" x2="18" y2="25"/><line x1="32" y1="40" x2="25" y2="59"/><line x1="32" y1="40" x2="39" y2="59"/>
    ${arrow('M50 24 h8')}`),

  hips_a: pic(`${head(32,10)}<line x1="32" y1="16" x2="32" y2="37"/><path d="M32 21 L21 25 L27 33"/><path d="M32 21 L43 25 L37 33"/><line x1="32" y1="37" x2="25" y2="59"/><line x1="32" y1="37" x2="39" y2="59"/>
    ${arrow('M18 40 Q32 50 46 40')}${arrow('M46 40 l-5 0.5 M46 40 l-1.5 4.5')}`),
  hips_b: pic(`${head(32,10)}<line x1="32" y1="16" x2="32" y2="37"/><path d="M32 21 L21 25 L27 33"/><path d="M32 21 L43 25 L37 33"/><line x1="32" y1="37" x2="25" y2="59"/><line x1="32" y1="37" x2="39" y2="59"/>
    ${arrow('M46 40 Q32 50 18 40')}${arrow('M18 40 l5 0.5 M18 40 l1.5 4.5')}`),

  ankle_a: pic(`<line x1="6" y1="40" x2="24" y2="40" stroke-width="3"/><line x1="8" y1="40" x2="8" y2="58" stroke-width="3"/><line x1="8" y1="40" x2="6" y2="20" stroke-width="3"/>
    ${head(14,14)}<line x1="15" y1="20" x2="18" y2="38"/><line x1="18" y1="38" x2="44" y2="36"/><line x1="44" y1="36" x2="50" y2="31"/><line x1="16" y1="25" x2="26" y2="34"/>
    ${arrow('M54 26 A6 6 0 1 1 50 40')}`),
  ankle_b: pic(`<line x1="54" y1="4" x2="54" y2="60" stroke-width="3"/>${ground()}
    ${head(36,12)}<line x1="36" y1="18" x2="30" y2="38"/><line x1="34" y1="22" x2="52" y2="24"/><line x1="30" y1="38" x2="44" y2="46"/><line x1="44" y1="46" x2="42" y2="59"/><line x1="30" y1="38" x2="18" y2="59"/>
    ${arrow('M46 52 l5 -3')}`),

  lunge_a: pic(`${head(30,14)}<line x1="30" y1="20" x2="30" y2="33"/><line x1="30" y1="33" x2="20" y2="46"/><line x1="20" y1="46" x2="15" y2="59"/><line x1="30" y1="33" x2="46" y2="50"/><line x1="46" y1="50" x2="56" y2="59"/>
    <line x1="30" y1="22" x2="20" y2="34"/><line x1="20" y1="34" x2="17" y2="44"/>${ground()}`),
  lunge_b: pic(`${head(30,12)}<line x1="30" y1="18" x2="30" y2="33"/><line x1="30" y1="33" x2="20" y2="46"/><line x1="20" y1="46" x2="15" y2="59"/><line x1="30" y1="33" x2="46" y2="50"/><line x1="46" y1="50" x2="56" y2="59"/>
    <line x1="30" y1="20" x2="20" y2="32"/><line x1="20" y1="32" x2="17" y2="44"/><line x1="30" y1="20" x2="42" y2="9"/><line x1="42" y1="9" x2="50" y2="3"/>${ground()}${arrow('M44 18 Q50 16 50 10')}`),

  shoulder_rotation_a: pic(`${head(32,11)}<line x1="32" y1="17" x2="32" y2="40"/><line x1="32" y1="21" x2="22" y2="30"/><line x1="22" y1="30" x2="33" y2="29"/><line x1="32" y1="21" x2="42" y2="36"/><line x1="32" y1="40" x2="25" y2="59"/><line x1="32" y1="40" x2="39" y2="59"/>
    <line x1="4" y1="30" x2="22" y2="30" stroke="${A}" stroke-width="2.5" stroke-dasharray="2 3"/>`),
  shoulder_rotation_b: pic(`${head(32,11)}<line x1="32" y1="17" x2="32" y2="40"/><line x1="32" y1="21" x2="22" y2="30"/><line x1="22" y1="30" x2="12" y2="26"/><line x1="32" y1="21" x2="42" y2="36"/><line x1="32" y1="40" x2="25" y2="59"/><line x1="32" y1="40" x2="39" y2="59"/>
    <line x1="4" y1="28" x2="12" y2="26" stroke="${A}" stroke-width="2.5" stroke-dasharray="2 3"/>${arrow('M16 18 Q9 18 8 23')}`),

  squat_a: pic(`${head(32,9)}<line x1="32" y1="15" x2="32" y2="38"/><line x1="32" y1="38" x2="26" y2="59"/><line x1="32" y1="38" x2="38" y2="59"/><path d="M32 20 L26 26 L32 27 M32 20 L38 26 L32 27"/>
    <circle cx="32" cy="28" r="4" fill="${A}" stroke="none"/>${ground()}`),
  squat_b: pic(`${head(32,17)}<line x1="32" y1="23" x2="30" y2="40"/><line x1="30" y1="40" x2="16" y2="45"/><line x1="16" y1="45" x2="16" y2="59"/><line x1="30" y1="40" x2="46" y2="45"/><line x1="46" y1="45" x2="46" y2="59"/>
    <path d="M32 27 L26 32 L32 34 M32 27 L38 32 L32 34"/><circle cx="32" cy="34" r="4" fill="${A}" stroke="none"/>${ground()}${arrow('M54 20 v10 M54 30 l-3 -3 M54 30 l3 -3')}`),

  rdl_a: pic(`${head(32,9)}<line x1="32" y1="15" x2="32" y2="38"/><line x1="32" y1="38" x2="28" y2="59"/><line x1="32" y1="38" x2="36" y2="59"/><line x1="32" y1="20" x2="30" y2="38"/>
    <circle cx="30" cy="41" r="4" fill="${A}" stroke="none"/>${ground()}`),
  rdl_b: pic(`${head(12,22)}<line x1="17" y1="25" x2="40" y2="36"/><line x1="40" y1="36" x2="38" y2="59"/><line x1="40" y1="36" x2="44" y2="59"/><line x1="22" y1="28" x2="22" y2="48"/>
    <circle cx="22" cy="51" r="4" fill="${A}" stroke="none"/>${ground()}${arrow('M44 26 Q50 22 48 16')}`),

  plank_a: pic(`${head(10,32)}<line x1="15" y1="34" x2="42" y2="46"/><line x1="15" y1="34" x2="15" y2="48"/><line x1="10" y1="48" x2="20" y2="48"/><line x1="42" y1="46" x2="42" y2="48"/><line x1="42" y1="48" x2="56" y2="48"/>${ground(50)}`),
  plank_b: pic(`${head(10,32)}<line x1="15" y1="34" x2="54" y2="40"/><line x1="15" y1="34" x2="15" y2="48"/><line x1="10" y1="48" x2="20" y2="48"/><line x1="54" y1="40" x2="56" y2="48"/>${ground(50)}
    <line x1="15" y1="28" x2="54" y2="34" stroke="${A}" stroke-width="2" stroke-dasharray="2 3"/>`),

  birddog_a: pic(`${head(10,26)}<line x1="15" y1="29" x2="46" y2="29"/><line x1="18" y1="29" x2="18" y2="52"/><line x1="46" y1="29" x2="46" y2="52"/><line x1="46" y1="52" x2="58" y2="52"/>${ground(54)}`),
  birddog_b: pic(`${head(12,24)}<line x1="17" y1="28" x2="44" y2="29"/><line x1="20" y1="29" x2="20" y2="52"/><line x1="44" y1="29" x2="44" y2="52"/><line x1="17" y1="26" x2="2" y2="18"/><line x1="44" y1="29" x2="62" y2="26"/>${ground(54)}
    ${arrow('M4 10 l-3 3 M58 18 l3 3')}`),

  balance_a: pic(`${head(32,10)}<line x1="32" y1="16" x2="32" y2="38"/><line x1="32" y1="21" x2="22" y2="32"/><line x1="32" y1="21" x2="42" y2="32"/><line x1="32" y1="38" x2="27" y2="59"/><line x1="32" y1="38" x2="37" y2="59"/>${ground()}`),
  balance_b: pic(`${head(32,10)}<line x1="32" y1="16" x2="32" y2="38"/><line x1="32" y1="21" x2="16" y2="18"/><line x1="32" y1="21" x2="48" y2="18"/><line x1="32" y1="38" x2="31" y2="59"/><line x1="32" y1="38" x2="42" y2="44"/><line x1="42" y1="44" x2="38" y2="52"/>${ground()}`),

  row_a: pic(`${head(46,11)}<line x1="46" y1="17" x2="44" y2="40"/><line x1="44" y1="40" x2="10" y2="44"/><line x1="45" y1="22" x2="14" y2="38"/>
    <line x1="14" y1="38" x2="8" y2="44" stroke="${A}" stroke-width="2.5"/>${ground(47)}`),
  row_b: pic(`${head(46,11)}<line x1="46" y1="17" x2="44" y2="40"/><line x1="44" y1="40" x2="10" y2="44"/><line x1="45" y1="22" x2="56" y2="28"/><line x1="56" y1="28" x2="42" y2="30"/>
    <line x1="42" y1="30" x2="8" y2="44" stroke="${A}" stroke-width="2.5" stroke-dasharray="2 3"/>${ground(47)}${arrow('M30 22 h-8 M22 22 l3 -3 M22 22 l3 3')}`),

  chair_squat_a: pic(`<line x1="8" y1="40" x2="30" y2="40" stroke-width="3"/><line x1="10" y1="40" x2="10" y2="59" stroke-width="3"/><line x1="28" y1="40" x2="28" y2="59" stroke-width="3"/><line x1="10" y1="40" x2="8" y2="16" stroke-width="3"/>
    ${head(22,14)}<line x1="21" y1="20" x2="20" y2="38"/><line x1="20" y1="38" x2="38" y2="38"/><line x1="38" y1="38" x2="38" y2="59"/><line x1="21" y1="24" x2="34" y2="30"/>${ground()}`),
  chair_squat_b: pic(`<line x1="8" y1="40" x2="30" y2="40" stroke-width="3"/><line x1="10" y1="40" x2="10" y2="59" stroke-width="3"/><line x1="28" y1="40" x2="28" y2="59" stroke-width="3"/><line x1="10" y1="40" x2="8" y2="16" stroke-width="3"/>
    ${head(40,8)}<line x1="40" y1="14" x2="40" y2="36"/><line x1="40" y1="36" x2="38" y2="59"/><line x1="40" y1="36" x2="42" y2="59"/><line x1="40" y1="19" x2="50" y2="27"/>${ground()}${arrow('M54 24 v-10 M54 14 l-3 3 M54 14 l3 3')}`),

  chair_legraise_a: pic(`<line x1="8" y1="40" x2="30" y2="40" stroke-width="3"/><line x1="10" y1="40" x2="10" y2="59" stroke-width="3"/><line x1="28" y1="40" x2="28" y2="59" stroke-width="3"/><line x1="10" y1="40" x2="8" y2="16" stroke-width="3"/>
    ${head(20,14)}<line x1="19" y1="20" x2="18" y2="38"/><line x1="18" y1="38" x2="36" y2="38"/><line x1="36" y1="38" x2="36" y2="59"/><line x1="19" y1="24" x2="28" y2="34"/>${ground()}`),
  chair_legraise_b: pic(`<line x1="8" y1="40" x2="30" y2="40" stroke-width="3"/><line x1="10" y1="40" x2="10" y2="59" stroke-width="3"/><line x1="28" y1="40" x2="28" y2="59" stroke-width="3"/><line x1="10" y1="40" x2="8" y2="16" stroke-width="3"/>
    ${head(22,13)}<line x1="21" y1="19" x2="18" y2="38"/><line x1="18" y1="38" x2="56" y2="34"/><line x1="18" y1="38" x2="30" y2="59"/><line x1="21" y1="23" x2="38" y2="40"/>${ground()}
    <path d="M40 44 l3 3 M44 42 l3 3" stroke="${A}" stroke-width="2.5"/>`),

  chair_dip_a: pic(`<line x1="4" y1="34" x2="22" y2="34" stroke-width="3"/><line x1="6" y1="34" x2="6" y2="59" stroke-width="3"/><line x1="20" y1="34" x2="20" y2="59" stroke-width="3"/>
    ${head(28,10)}<line x1="28" y1="16" x2="27" y2="32"/><line x1="27" y1="18" x2="20" y2="34"/><line x1="27" y1="32" x2="48" y2="38"/><line x1="48" y1="38" x2="56" y2="59"/>${ground()}`),
  chair_dip_b: pic(`<line x1="4" y1="34" x2="22" y2="34" stroke-width="3"/><line x1="6" y1="34" x2="6" y2="59" stroke-width="3"/><line x1="20" y1="34" x2="20" y2="59" stroke-width="3"/>
    ${head(28,20)}<line x1="28" y1="26" x2="27" y2="42"/><line x1="27" y1="28" x2="32" y2="34"/><line x1="32" y1="34" x2="20" y2="34"/><line x1="27" y1="42" x2="46" y2="44"/><line x1="46" y1="44" x2="56" y2="59"/>${ground()}${arrow('M40 20 v8 M40 28 l-3 -3 M40 28 l3 -3')}`),

  chair_balance_a: pic(`<line x1="8" y1="44" x2="24" y2="44" stroke-width="3"/><line x1="10" y1="44" x2="10" y2="59" stroke-width="3"/><line x1="22" y1="44" x2="22" y2="59" stroke-width="3"/><line x1="22" y1="44" x2="24" y2="16" stroke-width="3"/>
    ${head(40,11)}<line x1="40" y1="17" x2="40" y2="38"/><line x1="40" y1="21" x2="25" y2="20"/><line x1="40" y1="38" x2="37" y2="59"/><line x1="40" y1="38" x2="43" y2="59"/>${ground()}`),
  chair_balance_b: pic(`<line x1="8" y1="44" x2="24" y2="44" stroke-width="3"/><line x1="10" y1="44" x2="10" y2="59" stroke-width="3"/><line x1="22" y1="44" x2="22" y2="59" stroke-width="3"/><line x1="22" y1="44" x2="24" y2="16" stroke-width="3"/>
    ${head(40,6)}<line x1="40" y1="12" x2="40" y2="33"/><line x1="40" y1="16" x2="25" y2="16"/><line x1="40" y1="33" x2="38" y2="54"/><line x1="40" y1="33" x2="42" y2="54"/><path d="M36 54 l3 5 M42 54 l3 5"/>${ground()}${arrow('M52 30 v-8 M52 22 l-3 3 M52 22 l3 3')}`),

  wall_pushup_a: pic(`<line x1="56" y1="4" x2="56" y2="60" stroke-width="3"/>${ground()}
    ${head(38,15)}<line x1="36" y1="20" x2="18" y2="59"/><line x1="36" y1="22" x2="55" y2="22"/>`),
  wall_pushup_b: pic(`<line x1="56" y1="4" x2="56" y2="60" stroke-width="3"/>${ground()}
    ${head(46,16)}<line x1="43" y1="21" x2="18" y2="59"/><line x1="43" y1="23" x2="48" y2="32"/><line x1="48" y1="32" x2="55" y2="23"/>${arrow('M28 12 h8 M36 12 l-3 -3 M36 12 l-3 3')}`),

  bridge_a: pic(`${head(8,48)}<line x1="13" y1="50" x2="34" y2="52"/><line x1="34" y1="52" x2="44" y2="40"/><line x1="44" y1="40" x2="52" y2="55"/><line x1="16" y1="54" x2="28" y2="55"/>${ground(57)}`),
  bridge_b: pic(`${head(8,50)}<line x1="13" y1="50" x2="34" y2="38"/><line x1="34" y1="38" x2="46" y2="38"/><line x1="46" y1="38" x2="52" y2="55"/><line x1="16" y1="54" x2="28" y2="55"/>${ground(57)}${arrow('M30 30 v-8 M30 22 l-3 3 M30 22 l3 3')}`),

  walk_a: pic(`${head(30,9)}<line x1="30" y1="15" x2="31" y2="36"/><line x1="31" y1="36" x2="24" y2="47"/><line x1="24" y1="47" x2="20" y2="59"/><line x1="31" y1="36" x2="38" y2="47"/><line x1="38" y1="47" x2="44" y2="58"/><line x1="30" y1="20" x2="22" y2="31"/><line x1="30" y1="20" x2="38" y2="30"/>${ground()}`),
  walk_b: pic(`${head(32,9)}<line x1="32" y1="15" x2="32" y2="36"/><line x1="32" y1="36" x2="40" y2="47"/><line x1="40" y1="47" x2="42" y2="59"/><line x1="32" y1="36" x2="26" y2="47"/><line x1="26" y1="47" x2="18" y2="56"/><line x1="32" y1="20" x2="40" y2="30"/><line x1="32" y1="20" x2="24" y2="30"/>${ground()}`),
  run_b: pic(`${head(34,9)}<line x1="33" y1="15" x2="28" y2="34"/><line x1="28" y1="34" x2="40" y2="40"/><line x1="40" y1="40" x2="38" y2="52"/><line x1="28" y1="34" x2="18" y2="44"/><line x1="18" y1="44" x2="8" y2="42"/>
    <path d="M32 20 L40 26 L46 20 M32 20 L22 24 L18 30"/>${ground()}`),

  stairs_a: pic(`<path d="M2 60 H18 V50 H32 V40 H46 V30 H62" stroke="var(--line-strong)" stroke-width="3"/>
    ${head(14,16)}<line x1="14" y1="22" x2="15" y2="40"/><line x1="15" y1="40" x2="11" y2="59"/><line x1="15" y1="40" x2="22" y2="42"/><line x1="22" y1="42" x2="24" y2="49"/><line x1="14" y1="26" x2="8" y2="34"/><line x1="14" y1="26" x2="20" y2="33"/>`),
  stairs_b: pic(`<path d="M2 60 H18 V50 H32 V40 H46 V30 H62" stroke="var(--line-strong)" stroke-width="3"/>
    ${head(28,8)}<line x1="28" y1="14" x2="28" y2="31"/><line x1="28" y1="31" x2="25" y2="49"/><line x1="28" y1="31" x2="36" y2="32"/><line x1="36" y1="32" x2="38" y2="39"/><line x1="28" y1="18" x2="34" y2="25"/><line x1="28" y1="18" x2="22" y2="25"/>${arrow('M48 18 l6 -6 M54 12 h-4 M54 12 v4')}`),

  breathe_a: pic(`${head(32,22,6)}<path d="M18 50 Q18 32 32 32 Q46 32 46 50"/><circle cx="32" cy="22" r="14" stroke="${A}" stroke-width="2" stroke-dasharray="3 4"/>`),
  breathe_b: pic(`${head(32,22,6)}<path d="M18 50 Q18 32 32 32 Q46 32 46 50"/><circle cx="32" cy="22" r="20" stroke="${A}" stroke-width="2" stroke-dasharray="3 4"/>`)
};

/* ---------- Exercices ---------- */
// type: reps | time | free | breathe ; side: true = par côté
const EXERCISES = {
  neck: { name: 'Cervicales', cat: 'mobilite', poses: ['neck_a','neck_b'], type: 'reps', reps: 10, side: true,
    how: 'Debout ou assis, dos droit. Tourne lentement la tête d’un côté puis de l’autre, menton parallèle au sol.',
    cues: ['Mouvement lent, sans à-coup', 'Épaules basses et relâchées'], warn: 'Ne force jamais en fin d’amplitude : s’arrêter avant la gêne.', muscles: 'Cou, trapèzes' },
  catcow: { name: 'Chat-vache', cat: 'mobilite', poses: ['catcow_a','catcow_b'], type: 'reps', reps: 10,
    how: 'À quatre pattes, mains sous les épaules, genoux sous les hanches. Alterne dos rond (en expirant) et dos creux (en inspirant).',
    cues: ['Le mouvement part du bassin', 'Respiration ample et calée sur le geste'], warn: 'Dos creux sans excès si tu as le bas du dos sensible.', muscles: 'Toute la colonne' },
  shoulders: { name: 'Cercles d’épaules + étirement croisé', cat: 'mobilite', poses: ['shoulders_a','shoulders_b'], type: 'reps', reps: 10,
    how: 'Bras tendus sur les côtés, grands cercles vers l’avant puis vers l’arrière. Puis ramène un bras tendu devant la poitrine, tenu par l’autre bras, 20 s par côté.',
    cues: ['Cercles de plus en plus grands', 'Cou relâché'], warn: 'Si l’épaule pince, réduis la taille des cercles.', muscles: 'Épaules, haut du dos' },
  hips: { name: 'Cercles de hanches', cat: 'mobilite', poses: ['hips_a','hips_b'], type: 'reps', reps: 10, side: true,
    how: 'Debout, mains sur les hanches, pieds largeur d’épaules. Grands cercles du bassin, dans un sens puis dans l’autre.',
    cues: ['Genoux légèrement fléchis', 'Le haut du corps reste stable'], warn: '', muscles: 'Hanches, bas du dos' },
  ankle: { name: 'Chevilles', cat: 'mobilite', poses: ['ankle_a','ankle_b'], type: 'reps', reps: 10, side: true,
    how: 'Assis, jambe tendue : 10 cercles de cheville dans chaque sens. Puis debout face au mur, avance le genou vers le mur sans décoller le talon (30 s par côté).',
    cues: ['Talon collé au sol contre le mur', 'Genou dans l’axe du pied'], warn: '', muscles: 'Chevilles, mollets' },
  lunge: { name: 'Fente + rotation du buste', cat: 'mobilite', poses: ['lunge_a','lunge_b'], type: 'reps', reps: 5, side: true,
    how: 'Grande fente avant, main opposée au sol. Ouvre le bras du côté de la jambe avant vers le ciel en tournant le buste, regard qui suit la main.',
    cues: ['Genou arrière au sol possible', 'Expire en ouvrant'], warn: 'Pose le genou arrière sur un coussin si besoin.', muscles: 'Hanches, dos, épaules' },

  warmup: { name: 'Échauffement articulaire', cat: 'renfo', poses: ['shoulders_a','hips_a'], type: 'time', secs: 150,
    how: 'Enchaîne 10 rotations de chevilles, genoux, hanches, épaules et poignets. Prépare les articulations avant la charge.',
    cues: ['Rythme tranquille', 'Augmente l’amplitude progressivement'], warn: 'Ne saute jamais cette étape.', muscles: 'Toutes les articulations' },
  shoulder_rotation: { name: 'Rotation externe d’épaule (bande)', cat: 'renfo', poses: ['shoulder_rotation_a','shoulder_rotation_b'], type: 'reps', reps: 15, side: true, rest: 40,
    how: 'Bande fixée sur le côté à hauteur de taille. Coude collé au corps, plié à 90°. Tire vers l’extérieur sans décoller le coude, reviens lentement.',
    cues: ['Coude « vissé » contre les côtes', 'Retour lent en 2 secondes'], warn: 'Une bande légère suffit : c’est un exercice de précision.', muscles: 'Coiffe des rotateurs' },
  squat: { name: 'Squat gobelet', cat: 'renfo', poses: ['squat_a','squat_b'], type: 'reps', reps: 12, rest: 60,
    how: 'Haltère tenu à deux mains contre la poitrine, pieds un peu plus larges que les épaules. Descends comme pour t’asseoir, puis remonte en poussant dans les talons.',
    cues: ['Talons au sol', 'Poitrine haute', 'Genoux dans l’axe des pieds'], warn: 'Erreur fréquente : les genoux qui rentrent vers l’intérieur.', muscles: 'Cuisses, fessiers' },
  rdl: { name: 'Soulevé de terre jambes tendues', cat: 'renfo', poses: ['rdl_a','rdl_b'], type: 'reps', reps: 10, rest: 60,
    how: 'Un haltère par main, genoux légèrement fléchis. Pousse les fesses vers l’arrière et descends les haltères le long des jambes, dos plat, puis remonte en serrant les fessiers.',
    cues: ['Haltères frôlent les cuisses', 'Le mouvement part de la hanche'], warn: 'Erreur fréquente : arrondir le dos. Descends seulement jusqu’à mi-tibia.', muscles: 'Ischio-jambiers, fessiers, lombaires' },
  plank: { name: 'Gainage planche', cat: 'renfo', poses: ['plank_a','plank_b'], type: 'time', secs: 30, rest: 40,
    how: 'Appui sur les avant-bras et les pointes de pieds (ou les genoux pour débuter, image 1). Corps aligné de la tête aux talons, ventre rentré.',
    cues: ['Respire normalement', 'Serre les fessiers'], warn: 'Erreur fréquente : le bassin qui tombe ou qui monte trop haut.', muscles: 'Abdominaux, gainage' },
  birddog: { name: 'Bird-dog (oiseau-chien)', cat: 'renfo', poses: ['birddog_a','birddog_b'], type: 'reps', reps: 10, side: true, rest: 30,
    how: 'À quatre pattes. Tends en même temps le bras droit et la jambe gauche à l’horizontale, tiens 2 s, reviens, puis change de côté.',
    cues: ['Bassin immobile, comme un plateau', 'Regard vers le sol'], warn: 'Ne monte pas la jambe plus haut que le dos.', muscles: 'Lombaires, abdominaux, fessiers' },
  balance: { name: 'Équilibre sur une jambe', cat: 'renfo', poses: ['balance_a','balance_b'], type: 'time', secs: 30, side: true, rest: 20,
    how: 'Debout près d’un appui. Lève un pied et tiens. Quand c’est facile : yeux fermés, ou sur un coussin.',
    cues: ['Fixe un point devant toi', 'Genou d’appui légèrement souple'], warn: 'Toujours un mur ou une chaise à portée de main.', muscles: 'Chevilles, stabilisateurs' },
  row: { name: 'Tirage assis à la bande', cat: 'renfo', poses: ['row_a','row_b'], type: 'reps', reps: 15, rest: 45,
    how: 'Assis, jambes tendues, bande passée sous les pieds. Tire les poignées vers le nombril en serrant les omoplates, coudes près du corps.',
    cues: ['Dos droit, buste immobile', 'Serre les omoplates 1 s'], warn: 'Ne te penche pas en arrière pour tirer.', muscles: 'Haut du dos, posture' },

  chair_squat: { name: 'Lever de chaise', cat: 'maison', poses: ['chair_squat_a','chair_squat_b'], type: 'reps', reps: 12, rest: 45,
    how: 'Assis au bord d’une chaise stable, pieds à plat. Lève-toi sans les mains, puis rassieds-toi lentement en 3 secondes.',
    cues: ['Buste penché en avant pour se lever', 'Descente contrôlée'], warn: 'Chaise sans roulettes, calée contre un mur.', muscles: 'Cuisses, fessiers' },
  chair_legraise: { name: 'Extension de jambe + claquement', cat: 'maison', poses: ['chair_legraise_a','chair_legraise_b'], type: 'reps', reps: 10, side: true, rest: 30,
    how: 'Assis, dos droit. Tends une jambe à l’horizontale et claque des mains sous le genou levé, puis repose le pied.',
    cues: ['Dos décollé du dossier', 'Jambe bien tendue 1 s'], warn: '', muscles: 'Quadriceps, coordination' },
  wall_pushup: { name: 'Pompes contre le mur', cat: 'maison', poses: ['wall_pushup_a','wall_pushup_b'], type: 'reps', reps: 12, rest: 45,
    how: 'Face au mur, mains à hauteur d’épaules, pieds reculés. Plie les coudes pour approcher la poitrine du mur, puis repousse.',
    cues: ['Corps gainé, droit comme une planche', 'Plus les pieds sont loin, plus c’est dur'], warn: '', muscles: 'Pectoraux, bras, épaules' },
  chair_dip: { name: 'Dips sur chaise', cat: 'maison', poses: ['chair_dip_a','chair_dip_b'], type: 'reps', reps: 8, rest: 60,
    how: 'Mains sur le bord de la chaise, fesses juste devant l’assise, genoux pliés. Descends en pliant les coudes, puis remonte.',
    cues: ['Dos proche de la chaise', 'Coudes vers l’arrière, pas sur les côtés'], warn: 'Erreur fréquente : descendre trop bas. Coudes à 90° maximum.', muscles: 'Triceps, épaules' },
  bridge: { name: 'Pont fessier', cat: 'maison', poses: ['bridge_a','bridge_b'], type: 'reps', reps: 12, rest: 45,
    how: 'Allongé sur le dos, genoux pliés, pieds à plat. Monte le bassin en serrant les fessiers jusqu’à aligner épaules-hanches-genoux, tiens 2 s, redescends.',
    cues: ['Pousse dans les talons', 'Ne cambre pas le bas du dos'], warn: '', muscles: 'Fessiers, lombaires' },
  chair_balance: { name: 'Montées sur pointes', cat: 'maison', poses: ['chair_balance_a','chair_balance_b'], type: 'reps', reps: 15, rest: 30,
    how: 'Debout derrière une chaise, une main sur le dossier. Monte sur la pointe des pieds, tiens 1 s, redescends lentement.',
    cues: ['Monte bien haut', 'Lâche la main quand c’est facile'], warn: '', muscles: 'Mollets, chevilles' },

  walk: { name: 'Marche rapide', cat: 'cardio', poses: ['walk_a','walk_b'], type: 'free', secs: 1800,
    how: 'Allure soutenue : tu respires plus vite mais peux encore parler par phrases courtes.',
    cues: ['Bras qui balancent', 'Pas dynamiques, posture droite'], warn: 'Si tu ne peux plus finir une phrase, ralentis.', muscles: 'Cœur, jambes' },
  jog: { name: 'Trot léger', cat: 'cardio', poses: ['walk_a','run_b'], type: 'time', secs: 60,
    how: 'Course très lente, presque une marche rapide qui décolle.', cues: ['Petites foulées', 'Atterrissage souple'], warn: 'Arrête si douleur articulaire.', muscles: 'Cœur, jambes' },
  walk_easy: { name: 'Marche de récupération', cat: 'cardio', poses: ['walk_a','walk_b'], type: 'time', secs: 120,
    how: 'Marche tranquille pour faire redescendre le souffle.', cues: ['Respire profondément'], warn: '', muscles: 'Récupération' },
  stairs: { name: 'Montée d’escaliers', cat: 'cardio', poses: ['stairs_a','stairs_b'], type: 'time', secs: 60,
    how: 'Monte à allure modérée, redescends calmement en tenant la rampe.', cues: ['Pose tout le pied sur la marche'], warn: 'Tiens la rampe dans la descente.', muscles: 'Cœur, cuisses, fessiers' },

  breathe: { name: 'Respiration lente', cat: 'douce', poses: ['breathe_a','breathe_b'], type: 'breathe', secs: 180,
    how: 'Inspire 5 secondes en suivant le cercle qui grandit, expire 5 secondes quand il rétrécit. Principe de la cohérence cardiaque.',
    cues: ['Inspire par le nez', 'Ventre qui se gonfle'], warn: '', muscles: 'Système nerveux, récupération' }
};

/* ---------- Séances ---------- */
const SESSIONS = {
  mobilite: { name: 'Réveil articulaire', cat: 'mobilite', emoji: '🌅', min: 10, color: 'teal',
    desc: 'Tous les jours. Garde tes articulations souples.',
    items: [['neck',1],['catcow',1],['shoulders',1],['hips',1],['ankle',1],['lunge',1]], rest: 10 },
  renfo: { name: 'Renfort haltères & bandes', cat: 'renfo', emoji: '💪', min: 25, color: 'green',
    desc: '2 à 3 fois par semaine. Solidité des articulations.',
    items: [['warmup',1],['shoulder_rotation','S'],['squat','S'],['rdl','S'],['plank','S'],['birddog','S'],['balance','S'],['row','S']] },
  maison: { name: 'Renfort maison (chaise)', cat: 'renfo', emoji: '🪑', min: 20, color: 'orange',
    desc: 'Sans matériel : une chaise et un mur suffisent.',
    items: [['warmup',1],['chair_squat','S'],['chair_legraise','S'],['wall_pushup','S'],['chair_dip','S'],['bridge','S'],['chair_balance','S']] },
  marche: { name: 'Marche rapide', cat: 'cardio', emoji: '🚶', min: 30, color: 'blue',
    desc: 'La base la plus sûre pour le cœur.', items: [['walk',1]] },
  fractionne: { name: 'Marche / trot fractionné', cat: 'cardio', emoji: '🏃', min: 34, color: 'blue',
    desc: '8 × (1 min de trot + 2 min de marche).', intervals: true,
    items: [['walk_easy',1,300],...Array.from({length:8}, () => [['jog',1],['walk_easy',1]]).flat(),['walk_easy',1,300]] },
  escaliers: { name: 'Escaliers', cat: 'cardio', emoji: '🪜', min: 12, color: 'blue',
    desc: '6 × (1 min de montée + 1 min de récupération).', intervals: true,
    items: Array.from({length:6}, () => [['stairs',1],['walk_easy',1,60]]).flat() },
  douce: { name: 'Séance douce', cat: 'mobilite', emoji: '🍃', min: 12, color: 'purple',
    desc: 'Les jours de raideur ou de fatigue.',
    items: [['neck',1],['catcow',1],['hips',1],['ankle',1],['breathe',1]], rest: 10 }
};

/* ---------- Programme 12 semaines ---------- */
const PHASES = [
  { n: 1, from: 1, to: 4, label: 'Fondations', renfo: 2, cardio: 3,
    tip: 'Apprends le geste juste avec des charges légères. 2 séances de renfort par semaine.' },
  { n: 2, from: 5, to: 8, label: 'Consolidation', renfo: 3, cardio: 3,
    tip: 'Passe à 3 séances de renfort. Augmente un peu si ton ressenti (RPE) reste sous 6.' },
  { n: 3, from: 9, to: 12, label: 'Autonomie', renfo: 3, cardio: 4,
    tip: 'La routine devient un réflexe. Refais tes tests de repère et compare.' },
  { n: 4, from: 13, to: 999, label: 'Entretien', renfo: 3, cardio: 4,
    tip: 'Nouveau cycle ou stabilisation : la régularité compte plus que l’escalade.' }
];

/* ---------- Nutrition ---------- */
const NUTRI_DAILY = [
  { id: 'p1', label: 'Protéines au petit-déjeuner', hint: 'œufs, yaourt grec, fromage blanc' },
  { id: 'p2', label: 'Protéines au déjeuner', hint: 'viande, poisson, légumineuses' },
  { id: 'p3', label: 'Protéines au dîner', hint: '≈ 30 g par repas' },
  { id: 'leg', label: 'Légumes midi ET soir', hint: '2 mains en coupe par repas' },
  { id: 'fru', label: '2 fruits', hint: 'avec la peau si possible' },
  { id: 'lai', label: '2-3 produits laitiers', hint: 'calcium pour les os' },
  { id: 'eau', label: '1,5 L d’eau', hint: '6 verres cochés = validé', auto: true },
  { id: 'cpl', label: 'Féculents complets', hint: 'pain, riz, pâtes complets' }
];
const NUTRI_WEEKLY = [
  { id: 'poisson', label: 'Poisson gras', target: 2, hint: 'sardine, maquereau, saumon' },
  { id: 'legum', label: 'Légumineuses', target: 3, hint: 'lentilles, pois chiches, haricots' },
  { id: 'alcool0', label: 'Jours sans alcool', target: 4, hint: 'au moins 4 par semaine' }
];
const NUTRI_GUIDE = [
  { t: 'Protéines : 100-120 g / jour', b: 'Après 50 ans, c’est le levier n°1 contre la fonte musculaire. Répartis-les sur 3 repas (≈ 30-35 g chacun).',
    pills: ['2 œufs ≈ 13 g','150 g poulet ≈ 35 g','150 g poisson ≈ 30 g','150 g yaourt grec ≈ 15 g','200 g lentilles cuites ≈ 18 g','30 g fromage ≈ 7 g','100 g tofu ≈ 12 g','250 ml lait ≈ 8 g'] },
  { t: 'Fibres : 30 g / jour', b: 'Légumes à chaque repas, fruits avec la peau, légumineuses 3-4×/semaine, céréales complètes.',
    pills: ['150 g légumineuses ≈ 7 g','40 g flocons d’avoine ≈ 4 g','1 pomme ≈ 4 g','100 g brocoli ≈ 3 g','30 g amandes ≈ 3 g'] },
  { t: 'Oméga-3', b: 'Bons pour les articulations et le cœur.', pills: ['Poisson gras 2×/semaine (150 g)','1 c. à soupe d’huile de colza ou de noix/jour','30 g de noix, 3×/semaine'] },
  { t: 'Calcium & vitamine D', b: 'Solidité des os. La vitamine D vient surtout du soleil : marcher dehors y contribue.',
    pills: ['2-3 laitages/jour','Eau minérale calcique','15-20 min de soleil/jour'] },
  { t: 'Hydratation', b: 'Bois régulièrement plutôt que beaucoup d’un coup.', pills: ['1,5 à 2 L/jour','+ 500 ml si marche > 1 h ou séance'] },
  { t: 'À limiter (sans interdire)', b: 'Garder occasionnel plutôt que quotidien.', pills: ['Sucre ajouté < 25 g/j','Alcool : max 2 verres/j, jours sans','Sel < 5 g/j'] },
  { t: 'Portions sans balance', b: 'Ta main est ta mesure.', pills: ['Protéine = paume','Féculent = poing','Légumes = 2 mains en coupe','Matière grasse = pouce','Fruits secs = petite poignée'] },
  { t: 'Après la séance de renfort', b: 'Dans les 2 h : une source de protéines + un féculent. Pas nécessaire après une simple marche.', pills: [] },
  { t: 'Compléments ?', b: 'Pas nécessaires avec une alimentation variée. La vitamine D en hiver peut se discuter avec ton médecin. Pas besoin de protéines en poudre.', pills: [] }
];
const WEEK_MENU = [
  { d: 'Lundi', m: '2 œufs brouillés, pain complet, kiwi', mi: 'Poulet rôti, haricots verts, riz complet', s: 'Soupe de légumes, omelette, fromage' },
  { d: 'Mardi', m: 'Yaourt grec, flocons d’avoine, myrtilles, noix', mi: 'Lentilles corail au curry, carottes, féta', s: 'Sardines, salade composée, pain complet' },
  { d: 'Mercredi', m: 'Fromage blanc, banane, amandes', mi: 'Saumon, brocoli, quinoa', s: 'Tofu sauté aux légumes, riz' },
  { d: 'Jeudi', m: '2 œufs, pain complet, orange', mi: 'Dinde, courgettes, pâtes complètes', s: 'Salade de pois chiches, thon, crudités' },
  { d: 'Vendredi', m: 'Yaourt grec, muesli, pomme', mi: 'Maquereau, pommes de terre, salade verte', s: 'Velouté de potiron, jambon, fromage' },
  { d: 'Samedi', m: 'Pain complet, fromage frais, fruit', mi: 'Bœuf maigre, poêlée de légumes, boulgour', s: 'Œufs cocotte aux épinards, pain complet' },
  { d: 'Dimanche', m: 'Omelette, fruits rouges', mi: 'Poulet basquaise, riz', s: 'Soupe, yaourt, poignée de noix' }
];
const SHOPPING = [
  { r: 'Protéines', items: ['Œufs (18)','Poulet (600 g)','Dinde (300 g)','Bœuf maigre (300 g)','Saumon (2 pavés)','Sardines en boîte','Maquereau','Thon en boîte','Jambon','Tofu (200 g)'] },
  { r: 'Produits laitiers', items: ['Yaourts grecs (6)','Fromage blanc (500 g)','Fromage','Féta','Lait'] },
  { r: 'Féculents', items: ['Pain complet','Riz complet','Quinoa','Pâtes complètes','Boulgour','Flocons d’avoine / muesli','Pommes de terre'] },
  { r: 'Légumineuses', items: ['Lentilles corail','Pois chiches'] },
  { r: 'Légumes', items: ['Haricots verts','Carottes','Brocoli','Courgettes','Salade','Épinards','Potiron','Poivrons','Tomates','Légumes pour soupe'] },
  { r: 'Fruits', items: ['Kiwis','Bananes','Pommes','Oranges','Myrtilles / fruits rouges'] },
  { r: 'Divers', items: ['Noix','Amandes','Huile de colza','Huile d’olive','Curry & épices','Chocolat noir'] }
];

/* ---------- Tests de repère ---------- */
const TESTS = [
  { id: 'planche', name: 'Gainage planche', unit: 's', mode: 'chrono', how: 'Tiens la planche le plus longtemps possible avec une bonne posture. Arrête dès que le bassin tombe.' },
  { id: 'eq_g', name: 'Équilibre yeux fermés — gauche', unit: 's', mode: 'chrono', how: 'Sur le pied gauche, yeux fermés, près d’un appui. Arrête dès que tu poses le pied ou rouvres les yeux.' },
  { id: 'eq_d', name: 'Équilibre yeux fermés — droit', unit: 's', mode: 'chrono', how: 'Même test sur le pied droit.' },
  { id: 'chaise30', name: 'Levers de chaise en 30 s', unit: 'rép.', mode: 'count30', how: 'Bras croisés, compte combien de fois tu te lèves complètement en 30 secondes.' },
  { id: 'souplesse', name: 'Souplesse (toucher les orteils)', unit: '', mode: 'choice', how: 'Assis jambes tendues, penche-toi vers l’avant sans à-coup. Où arrivent tes mains ?',
    choices: ['Genoux','Mi-tibia','Chevilles','Orteils','Au-delà'] }
];

/* ---------- Motivation ---------- */
const QUOTES = [
  'Dix minutes aujourd’hui valent mieux qu’une heure qu’on ne fera jamais.',
  'La régularité bat l’intensité, à tout âge.',
  'Le corps s’adapte à ce qu’on lui demande, à 57 ans comme à 30.',
  'Chaque série d’équilibre d’aujourd’hui est une chute évitée demain.',
  'Pas besoin de performance, juste de présence.',
  'Ton corps de demain se construit avec tes choix d’aujourd’hui.',
  'Une routine simple et tenue vaut mieux qu’un programme parfait abandonné.',
  'Bouger un peu tous les jours change plus qu’un gros effort une fois par mois.',
  'La force, c’est de l’autonomie mise de côté pour plus tard.',
  'Un jour manqué n’efface rien. Reprendre, c’est déjà gagner.',
  'Les articulations aiment le mouvement : elles se nourrissent en bougeant.',
  'Marcher, c’est le sport le plus sous-estimé du monde.'
];
const CHEERS = ['Bien joué 💪', 'C’est noté ✓', 'Un pas de plus 👣', 'Bravo, continue !', 'Excellent 🔥', 'Régulier comme une horloge ⏱️'];

const BADGES = [
  { id: 'first', icon: '🌱', name: 'Premier pas', test: s => s.totalSessions >= 1 },
  { id: 'st3', icon: '🔥', name: '3 jours de suite', test: s => s.maxStreak >= 3 },
  { id: 'st7', icon: '🥉', name: '7 jours de suite', test: s => s.maxStreak >= 7 },
  { id: 'st14', icon: '🥈', name: '14 jours de suite', test: s => s.maxStreak >= 14 },
  { id: 'st30', icon: '🥇', name: '30 jours de suite', test: s => s.maxStreak >= 30 },
  { id: 'st100', icon: '💎', name: '100 jours de suite', test: s => s.maxStreak >= 100 },
  { id: 'r10', icon: '🏋️', name: '10 séances renfort', test: s => s.totalRenfo >= 10 },
  { id: 'r50', icon: '🏆', name: '50 séances renfort', test: s => s.totalRenfo >= 50 },
  { id: 'c10', icon: '👟', name: '10 séances cardio', test: s => s.totalCardio >= 10 },
  { id: 'c50', icon: '🥾', name: '50 séances cardio', test: s => s.totalCardio >= 50 },
  { id: 'test', icon: '📏', name: 'Premier test de repère', test: s => s.tests >= 1 },
  { id: 'month', icon: '📅', name: 'Mois régulier (80 %)', test: s => s.bestMonthPct >= 80 }
];
