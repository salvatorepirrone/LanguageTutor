// Archivio su un file JSON, con la stessa interfaccia di uno store di @netlify/blobs: serve per provare il sito sul proprio computer
// (`netlify dev`), dove l'archivio di prova di Netlify non supporta le scritture condizionali. Un solo processo, quindi niente concorrenza.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export class FileBlobs {
  constructor(file) {
    this.file = file; this.n = 0; this.m = new Map();
    try { for (const [k, v] of Object.entries(JSON.parse(readFileSync(file, 'utf8')))) this.m.set(k, { v, etag: '"' + (++this.n) + '"' }); } catch { /* primo avvio */ }
  }
  save() {
    mkdirSync(dirname(this.file), { recursive: true });
    writeFileSync(this.file, JSON.stringify(Object.fromEntries([...this.m].map(([k, e]) => [k, e.v]))));
  }
  async get(key) { const e = this.m.get(key); return e ? JSON.parse(e.v) : null; }
  async getWithMetadata(key) { const e = this.m.get(key); return e ? { data: JSON.parse(e.v), etag: e.etag, metadata: {} } : null; }
  async setJSON(key, value, opts = {}) {
    const cur = this.m.get(key);
    if (opts.onlyIfNew && cur) return { modified: false };
    if (opts.onlyIfMatch && (!cur || cur.etag !== opts.onlyIfMatch)) return { modified: false };
    const etag = '"' + (++this.n) + '"';
    this.m.set(key, { v: JSON.stringify(value), etag });
    this.save();
    return { modified: true, etag };
  }
  async delete(key) { this.m.delete(key); this.save(); }
  async list({ prefix = '' } = {}) { return { blobs: [...this.m.keys()].filter((k) => k.startsWith(prefix)).map((key) => ({ key })), directories: [] }; }
}
