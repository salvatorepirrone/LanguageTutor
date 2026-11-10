// Feedback degli utenti, comune a tutte le lingue: un solo registro (al massimo 500 voci) che l'amministratore legge dalla pagina Accessi.
// Non chiama Claude e quindi non conta nel limite giornaliero; per evitare abusi ognuno può inviarne 20 al giorno.
import { HttpError, str, today } from './util.mjs';

const KEY = 'feedback/log';
const KINDS = ['errore', 'idea', 'contenuto', 'altro'];

export async function addFeedback(store, user, userRec, now, inp) {
  const text = str(inp.text, 2000).trim();
  if (text.length < 3) throw new HttpError(400, 'Scrivi qualche parola in più.');
  const day = today(now);
  const entry = {
    id: now.getTime().toString(36) + Math.random().toString(36).slice(2, 6), t: now.toISOString(), user,
    role: (userRec && userRec.role) || 'user', kind: KINDS.includes(inp.kind) ? inp.kind : 'altro',
    page: str(inp.page, 120), device: str(inp.device, 120), text, status: 'nuovo',
  };
  await store.update(KEY, { items: [] }, (cur) => {
    const items = Array.isArray(cur.items) ? cur.items : [];
    if (items.filter((x) => x.user === user && today(new Date(x.t)) === day).length >= 20) throw new HttpError(429, 'Hai già inviato molte segnalazioni oggi: riprova domani.');
    items.push(entry);
    return { items: items.slice(-500) };
  });
  return { ok: true };
}

export async function listFeedback(store) {
  const log = await store.read(KEY, { items: [] });
  return { items: (Array.isArray(log.items) ? log.items : []).slice().reverse() };
}

export async function setFeedback(store, id, status) {
  const st = status === 'fatto' ? 'fatto' : 'nuovo';
  await store.update(KEY, { items: [] }, (cur) => {
    const items = Array.isArray(cur.items) ? cur.items : [];
    for (const x of items) if (x.id === str(id, 40)) x.status = st;
    return { items };
  });
  return listFeedback(store);
}
