// Funzione Netlify: tutta l'API del tutor passa da qui (/api e /api/*). La logica sta in netlify/lib/.
import { getStore } from '@netlify/blobs';
import { handle } from '../lib/router.mjs';
import { FileBlobs } from '../lib/file-blobs.mjs';

// Le variabili si impostano nelle impostazioni del sito su Netlify (mai nel repository).
const VARS = ['ANTHROPIC_API_KEY', 'SESSION_SECRET', 'SETUP_TOKEN', 'PUBLIC_URL'];
const env = (k) => Netlify.env.get(k) || '';
const readEnv = () => Object.fromEntries(VARS.map((k) => [k, Netlify.env.get(k) || '']));

export default async (req, context) => {
  // Archivio dei dati (utenti, progressi, lezioni in cache). Su Netlify si configura da solo.
  // In locale (`netlify dev`) si può usare un archivio su file: LOCAL_DATA_DIR nel file .env (mai impostata su Netlify).
  const local = env('LOCAL_DATA_DIR');
  const blobs = local ? (globalThis.__fileBlobs ||= new FileBlobs(local + '/dati.json')) : getStore({ name: env('BLOBS_STORE') || 'tutor', consistency: 'strong' });
  return handle(req, { blobs, env: readEnv(), ip: context.ip });
};

export const config = { path: ['/api', '/api/*'] };
