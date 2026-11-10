// Funzione Vercel: tutta l'API del tutor passa da qui (/api/*). La logica è la stessa del sito su Netlify e sta in netlify/lib/.
// Archivio: Redis di Upstash (si collega dal Marketplace di Vercel e imposta da solo KV_REST_API_URL e KV_REST_API_TOKEN).
import { handle } from '../netlify/lib/router.mjs';
import { RedisBlobs } from '../netlify/lib/redis-blobs.mjs';

// Le variabili si impostano nelle impostazioni del progetto su Vercel (mai nel repository).
const VARS = ['ANTHROPIC_API_KEY', 'SESSION_SECRET', 'SETUP_TOKEN', 'PUBLIC_URL'];

function reply(status, error) {
  return new Response(JSON.stringify({ error }), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}

async function run(request) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return reply(500, 'Archivio non configurato: collega Upstash Redis al progetto Vercel (variabili KV_REST_API_URL e KV_REST_API_TOKEN).');
  const blobs = new RedisBlobs({ url, token, prefix: (process.env.STORE_PREFIX || 'tutor') + ':' });
  const env = Object.fromEntries(VARS.map((k) => [k, process.env[k] || '']));
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || request.headers.get('x-real-ip') || '?';
  return handle(request, { blobs, env, ip });
}

export default { fetch: run };
export const GET = run;
export const POST = run;
