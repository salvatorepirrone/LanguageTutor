// Prova dell'adattatore Redis (usato su Vercel): le stesse prove del backend, ma con l'archivio su un Redis finto che si comporta come
// l'interfaccia REST di Upstash (GET, SET, DEL, SCAN e lo script di scrittura condizionale).
import { RedisBlobs } from '../lib/redis-blobs.mjs';
import { run as runBackend } from './backend.test.mjs';

const enc = new TextEncoder();
async function sha1Hex(text) {
  const h = await crypto.subtle.digest('SHA-1', enc.encode(text));
  return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function fakeRedisFetch(store, log = { n: 0 }) {
  return async (url, init) => {
    const args = JSON.parse(init.body);
    if (init.headers.authorization !== 'Bearer t') return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    log.n++;
    const [cmd, ...a] = args;
    let result = null;
    if (cmd === 'GET') result = store.has(a[0]) ? store.get(a[0]) : null;
    else if (cmd === 'SET') { store.set(a[0], a[1]); result = 'OK'; }
    else if (cmd === 'DEL') { result = store.delete(a[0]) ? 1 : 0; }
    else if (cmd === 'SCAN') {
      const m = a[a.indexOf('MATCH') + 1];
      result = ['0', [...store.keys()].filter((k) => k.startsWith(m.slice(0, -1)))];
    } else if (cmd === 'EVAL') {
      // stessa logica dello script Lua: ARGV[1] vuoto = solo se non esiste; altrimenti solo se l'impronta coincide
      const key = a[2], etag = a[3], raw = a[4], cur = store.has(key) ? store.get(key) : null;
      if (etag === '' ? cur !== null : (cur === null || (await sha1Hex(cur)) !== etag)) result = 0;
      else { store.set(key, raw); result = 1; }
    } else return new Response(JSON.stringify({ error: 'comando sconosciuto ' + cmd }), { status: 400 });
    return new Response(JSON.stringify({ result }), { status: 200 });
  };
}

export async function run({ iterations = 1000 } = {}) {
  const store = new Map();
  const log = { n: 0 };
  const blobs = new RedisBlobs({ url: 'https://redis.esempio', token: 't', prefix: 'tutor:', fetch: fakeRedisFetch(store, log) });
  const r = await runBackend({ iterations, blobs });
  const keys = [...store.keys()];
  const ok = keys.length > 10 && keys.every((k) => k.startsWith('tutor:')) && keys.some((k) => k === 'tutor:users') && log.n > 100;
  r.results.push((ok ? 'OK   ' : 'FAIL ') + 'redis: chiavi con il prefisso, utenti salvati e comandi eseguiti (' + keys.length + ' chiavi, ' + log.n + ' comandi)');
  r.total += 1;
  if (!ok) r.failures += 1;
  return r;
}
