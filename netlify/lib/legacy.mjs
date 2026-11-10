// Importazione dagli archivi dei vecchi siti (spagnolo e portoghese): utenti con le loro password, ruoli e limiti, dati di studio
// e lezioni già generate. Non sovrascrive mai niente: chi esiste già e i dati già presenti restano come sono.
// Lo strumento lo usa l'amministratore da /admin.html; gli archivi vecchi si leggono con un token Netlify (vedi README).
import { HttpError, makeStore } from './util.mjs';
import { LANGS } from './langs/index.mjs';

async function listKeys(blobs, prefix) {
  const r = await blobs.list({ prefix });
  return (r.blobs || []).map((b) => b.key);
}

// `rootStore`: archivio del nuovo sito; `srcBlobs`: archivio del vecchio sito (interfaccia di @netlify/blobs); `lang`: es o pt.
export async function importLegacy(rootStore, srcBlobs, lang, { dry = false } = {}) {
  const L = LANGS[lang];
  if (!L) throw new HttpError(400, 'Lingua sconosciuta');
  const src = makeStore(srcBlobs);
  const old = await src.read('users', {});
  const current = await rootStore.read('users', {});
  const report = { lang, dry, users: { copied: [], existing: [], pending: [] }, data: { copied: [], skipped: [] }, cache: { copied: 0, skipped: 0 } };

  // utenti: si copia il record intero (la password resta valida)
  const toAdd = {};
  for (const [name, rec] of Object.entries(old)) {
    if (!rec || typeof rec !== 'object') continue;
    if (current[name]) report.users.existing.push(name);
    else if (rec.pending || !rec.hash) report.users.pending.push(name);   // invito mai accettato: il link non si porta dietro, va rifatto
    else { report.users.copied.push(name); toAdd[name] = rec; }
  }
  if (!dry && Object.keys(toAdd).length) {
    await rootStore.update('users', {}, (u) => { for (const [n, r] of Object.entries(toAdd)) if (!u[n]) u[n] = r; return u; });
  }

  // dati di studio, sotto il prefisso della lingua; solo per gli utenti che esistono nel nuovo sito
  const known = new Set([...Object.keys(current), ...Object.keys(toAdd)]);
  for (const key of await listKeys(srcBlobs, 'data/')) {
    const name = key.slice('data/'.length);
    if (!known.has(name)) { report.data.skipped.push(name + ' (utente non copiato)'); continue; }
    const dest = L.prefix + key;
    if (await rootStore.read(dest, null)) { report.data.skipped.push(name + ' (ha già dati)'); continue; }
    const val = await src.read(key, null);
    if (val == null) continue;
    if (!dry) await rootStore.write(dest, val);
    report.data.copied.push(name);
  }

  // lezioni e liste di vocabolario già generate: risparmiano richieste a Claude
  for (const key of await listKeys(srcBlobs, 'cache/')) {
    const dest = L.prefix + key;
    if (await rootStore.read(dest, null)) { report.cache.skipped++; continue; }
    const val = await src.read(key, null);
    if (val == null) continue;
    if (!dry) await rootStore.write(dest, val);
    report.cache.copied++;
  }
  return report;
}
