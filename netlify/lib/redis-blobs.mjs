// Archivio chiave/valore su Redis (Upstash, tramite l'interfaccia REST) con la stessa interfaccia di uno store di @netlify/blobs:
// così il backend gira anche su Vercel, dove non ci sono i Blobs di Netlify. Usa solo fetch e WebCrypto, nessuna dipendenza.
//
// Le scritture condizionali (onlyIfNew / onlyIfMatch) servono ad aggiornare i dati senza perdere modifiche concorrenti: si fanno con uno
// script Lua che confronta l'impronta SHA-1 del valore letto con quella del valore attuale e scrive solo se coincidono.
const CAS = [
  "local cur = redis.call('GET', KEYS[1])",
  "if ARGV[1] == '' then",
  "  if cur then return 0 end",
  "else",
  "  if (not cur) or redis.sha1hex(cur) ~= ARGV[1] then return 0 end",
  "end",
  "redis.call('SET', KEYS[1], ARGV[2])",
  "return 1",
].join('\n');

const enc = new TextEncoder();
async function sha1Hex(text) {
  const h = await crypto.subtle.digest('SHA-1', enc.encode(text));
  return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export class RedisBlobs {
  constructor({ url, token, prefix = '', fetch: f }) {
    this.url = url; this.token = token; this.prefix = prefix; this.f = f || globalThis.fetch.bind(globalThis);
  }

  async cmd(args) {
    const res = await this.f(this.url, {
      method: 'POST', headers: { authorization: 'Bearer ' + this.token, 'content-type': 'application/json' }, body: JSON.stringify(args),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok || j.error) throw new Error('Archivio Redis: ' + (j.error || ('errore ' + res.status)));
    return j.result;
  }

  async get(key) {
    const v = await this.cmd(['GET', this.prefix + key]);
    return v == null ? null : JSON.parse(v);
  }

  async getWithMetadata(key) {
    const v = await this.cmd(['GET', this.prefix + key]);
    return v == null ? null : { data: JSON.parse(v), etag: await sha1Hex(v), metadata: {} };
  }

  async setJSON(key, value, opts = {}) {
    const raw = JSON.stringify(value);
    if (opts.onlyIfNew || opts.onlyIfMatch) {
      const done = await this.cmd(['EVAL', CAS, '1', this.prefix + key, opts.onlyIfMatch || '', raw]);
      if (!Number(done)) return { modified: false };
    } else {
      await this.cmd(['SET', this.prefix + key, raw]);
    }
    return { modified: true, etag: await sha1Hex(raw) };
  }

  async delete(key) { await this.cmd(['DEL', this.prefix + key]); }

  async list({ prefix = '' } = {}) {
    const blobs = [];
    let cursor = '0';
    do {
      const [next, keys] = await this.cmd(['SCAN', cursor, 'MATCH', this.prefix + prefix + '*', 'COUNT', '200']);
      cursor = String(next);
      for (const k of keys) blobs.push({ key: k.slice(this.prefix.length) });
    } while (cursor !== '0');
    return { blobs, directories: [] };
  }
}
