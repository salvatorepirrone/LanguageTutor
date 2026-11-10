// Utilità condivise da tutto il backend: errori, date, casualità, crittografia (WebCrypto) e archivio chiave/valore.
// Nessuna dipendenza da Node: usa solo API web, così la logica si può provare anche nel browser.

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

// ---------------------------------------------------------------- testo, date, casualità

export function str(v, max) {
  return (typeof v === 'string' || typeof v === 'number') ? String(v).slice(0, max).trim() : '';
}

export function today(now = new Date()) {
  return now.toLocaleDateString('sv-SE', { timeZone: 'Europe/Rome' });   // AAAA-MM-GG
}

export function addDays(date, n) {
  const d = new Date(date + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(a, b) {
  return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86400000);
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export const pickN = (arr, n) => shuffle(arr).slice(0, n);
export const pickOne = (arr) => (arr.length ? arr[Math.floor(Math.random() * arr.length)] : '');

// ---------------------------------------------------------------- crittografia (WebCrypto)

const enc = new TextEncoder();
const toB64 = (buf) => { let s = ''; for (const b of new Uint8Array(buf)) s += String.fromCharCode(b); return btoa(s); };
const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
export const b64url = (buf) => toB64(buf).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
export const unb64url = (s) => fromB64(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4));

export function randomHex(bytes) {
  return [...crypto.getRandomValues(new Uint8Array(bytes))].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function sha256Hex(text) {
  const h = await crypto.subtle.digest('SHA-256', enc.encode(text));
  return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function constantTimeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

let iterOverride = 0;
export function setIterations(n) { iterOverride = n; }   // solo per le prove: abbassa il costo della derivazione

function iterations() {
  if (iterOverride > 0) return iterOverride;
  const e = typeof process !== 'undefined' && process.env ? Number(process.env.PBKDF2_ITER) : 0;
  return e > 0 ? e : 600000;
}

async function pbkdf2(pw, salt, iter) {
  const key = await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveBits']);
  return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: iter }, key, 256);
}

export async function hashPassword(pw, iter = iterations()) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${iter}$${toB64(salt)}$${toB64(await pbkdf2(pw, salt, iter))}`;
}

export async function verifyPassword(pw, stored) {
  const p = String(stored || '').split('$');
  if (p.length !== 4 || p[0] !== 'pbkdf2') return false;
  const bits = toB64(await pbkdf2(pw, fromB64(p[2]), Number(p[1])));
  return constantTimeEqual(bits, p[3]);
}

export async function hmac(secret, data) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}

// ---------------------------------------------------------------- archivio (Netlify Blobs o equivalente)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clone = (v) => JSON.parse(JSON.stringify(v));

// `blobs` è un oggetto con la stessa interfaccia di uno store di @netlify/blobs.
export function makeStore(blobs) {
  return {
    async read(key, fallback) {
      const v = await blobs.get(key, { type: 'json', consistency: 'strong' });
      return v == null ? clone(fallback) : v;
    },
    async write(key, value) { await blobs.setJSON(key, value); },
    async remove(key) { await blobs.delete(key); },
    // Legge, modifica e salva con scrittura condizionale: se qualcun altro ha scritto nel frattempo, si riprova.
    async update(key, fallback, fn) {
      for (let i = 0; i < 8; i++) {
        const r = await blobs.getWithMetadata(key, { type: 'json', consistency: 'strong' });
        const cur = r && r.data != null ? r.data : clone(fallback);
        const next = await fn(cur);
        const res = await blobs.setJSON(key, next, r && r.etag ? { onlyIfMatch: r.etag } : { onlyIfNew: true });
        if (res && res.modified !== false) return next;
        await sleep(20 + Math.random() * 80);
      }
      throw new HttpError(503, 'Archivio occupato, riprova.');
    },
  };
}

// Archivio con un prefisso davanti a ogni chiave: ogni lingua tiene i propri dati sotto il suo prefisso, gli accessi stanno senza prefisso.
export function prefixStore(store, prefix) {
  if (!prefix) return store;
  return {
    read: (key, fallback) => store.read(prefix + key, fallback),
    write: (key, value) => store.write(prefix + key, value),
    remove: (key) => store.remove(prefix + key),
    update: (key, fallback, fn) => store.update(prefix + key, fallback, fn),
  };
}
