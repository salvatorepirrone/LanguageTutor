// Logica della lingua: impostazioni, catalogo, profilo, livello e statistiche dello studente. Le utilità comuni stanno in ../../util.mjs.
import DATA from './data.mjs';

export const CFG = {
  DEADLINE: null,   // nessuna scadenza fissa: il piano parte dal giorno in cui si sceglie il livello
  START: '2026-11-10',
  MODEL: 'claude-sonnet-5-5',
  MAX_MESSAGES: 24,
  MAX_CHARS: 800,
  SRS_DAYS: [1, 3, 7, 16, 35],
  BASE_RULES: 'Sei un insegnante di inglese (variante britannica) per studenti italiani adulti di livello A2-B2. Spiegazioni e consegne in italiano; frasi di esempio e contenuti da imparare in inglese britannico (lessico e ortografia del Regno Unito), naturali e corretti. Rispondi SOLO con un oggetto JSON valido, senza testo prima o dopo e senza blocchi di codice.',
};
export const LEVELS = DATA.levels;
export { DATA };

export * from '../../util.mjs';
import { HttpError, today, addDays, daysBetween, pickOne } from '../../util.mjs';

// ---------------------------------------------------------------- dati dello studente

export function defaults(d) {
  d = d && typeof d === 'object' ? d : {};
  return Object.assign({ days: {}, errors: [], vocab: [], deck: {}, ex: {}, tests: [], profile: null, recent: null }, d);
}

export async function loadData(store, user) { return defaults(await store.read('data/' + user, {})); }
export async function updateData(store, user, fn) { return store.update('data/' + user, {}, async (d) => fn(defaults(d))); }

export function logActivity(d, n = 1, now = new Date()) {
  const day = today(now);
  d.days[day] = (d.days[day] || 0) + n;
  return d;
}

export function addErrors(d, errors, now = new Date()) {
  const day = today(now);
  for (const e of errors) d.errors.push({ t: day, cat: e.cat, orig: e.orig, corr: e.corr, note: e.note || '' });
  d.errors = d.errors.slice(-300);
  return d;
}

export function deckAdd(d, es, it, ex, theme, now = new Date(), syn = []) {
  const key = es.toLowerCase();
  if (!key || !it || d.deck[key]) return d;
  d.deck[key] = { es, it, ex, theme, box: 0, due: today(now), seen: 0 };
  if (Array.isArray(syn) && syn.length) d.deck[key].syn = syn.slice(0, 4);
  const keys = Object.keys(d.deck);
  if (keys.length > 1500) delete d.deck[keys[0]];
  return d;
}

// ---------------------------------------------------------------- catalogo, livello e piano

export const scenarios = () => DATA.scenarios;
export const grammar = () => DATA.grammar;

export function topicById(id) {
  for (const s of DATA.grammar) for (const t of s.topics) if (t.id === id) return { ...t, section: s.title, sectionId: s.id };
  return null;
}
export const vocabThemeById = (id) => DATA.vocabThemes.find((t) => t.id === id) || null;
export const levelText = (l) => DATA.levelText[l] || DATA.levelText['B1-'];
export const levelLabel = (l) => DATA.levelLabel[l] || DATA.levelLabel['B1-'];

export function profileOf(d) {
  const p = d.profile && typeof d.profile === 'object' ? d.profile : {};
  return {
    level: LEVELS.includes(p.level) ? p.level : 'B1-',
    start: p.start || CFG.START,
    placed: !!p.placed,
    source: p.source || '',
  };
}
export const planOf = (profile) => DATA.tracks[profile.level];
export function weekIndex(profile, now = new Date()) {
  const days = daysBetween(profile.start, today(now));
  return Math.max(0, Math.min(7, Math.floor(Math.max(0, days) / 7)));
}
export const publicProfile = (p) => ({ level: p.level, label: levelLabel(p.level), start: p.start, source: p.source });

export function stats(d, now = new Date()) {
  const t = today(now);
  let streak = 0;
  let cur = t;
  if (!d.days[cur]) cur = addDays(cur, -1);
  while (d.days[cur]) { streak++; cur = addDays(cur, -1); }
  const counts = {};
  for (const e of d.errors.slice(-150)) { const c = e.cat || 'altro'; counts[c] = (counts[c] || 0) + 1; }
  const topErrors = {};
  Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6).forEach(([k, v]) => { topErrors[k] = v; });
  let deckDue = 0;
  for (const c of Object.values(d.deck)) if ((c.due || t) <= t) deckDue++;
  return {
    streak,
    todayTurns: d.days[t] || 0,
    totalDays: Object.keys(d.days).length,
    topErrors,
    recentErrors: d.errors.slice(-8).reverse(),
    vocabCount: Object.keys(d.deck).length,
    deckDue,
    recentVocab: d.vocab.slice(-12),
    exProgress: d.ex,
    tests: d.tests.slice(-10),
    daysLeft: CFG.DEADLINE ? Math.max(0, daysBetween(t, CFG.DEADLINE)) : null,
  };
}

// ---------------------------------------------------------------- varietà

export function normStem(s) {
  return String(s).toLowerCase().replace(/[^\p{L}\p{N} ]+/gu, ' ').replace(/\s+/g, ' ').trim();
}
const bagKey = (stem) => '~' + stem.split(' ').sort().join(' ');

export function recentOf(d) {
  const r = d.recent && typeof d.recent === 'object' ? d.recent : {};
  return { topics: r.topics || [], items: r.items || [] };
}

export function remember(d, topics = [], stems = []) {
  const r = recentOf(d);
  r.topics = r.topics.concat(topics).slice(-20);
  r.items = r.items.concat(stems.map(normStem)).slice(-150);
  d.recent = r;
  return d;
}

export function dropRepeats(items, recentStems) {
  const seen = new Set();
  for (const s of recentStems) { seen.add(s); seen.add(bagKey(s)); }
  const out = [];
  for (const it of items) {
    const k = normStem(it.q || '');
    if (seen.has(k) || seen.has(bagKey(k))) continue;
    seen.add(k); seen.add(bagKey(k));
    out.push(it);
  }
  return out;
}

export function pickTopic(d, mode, scenario) {
  const tw = DATA.twists;
  const pool = mode === 'conversazione' ? (tw[scenario] || DATA.topics) : DATA.contexts;
  const recent = recentOf(d).topics;
  const fresh = pool.filter((t) => !recent.includes(t));
  return pickOne(fresh.length ? fresh : pool);
}
