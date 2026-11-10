// Funzione Netlify: tutta l'API del tutor passa da qui (/api e /api/*). La logica sta in netlify/lib/.
import { getStore } from '@netlify/blobs';
import { handle } from '../lib/router.mjs';

// Le variabili si impostano nelle impostazioni del sito su Netlify (mai nel repository).
const VARS = ['ANTHROPIC_API_KEY', 'SESSION_SECRET', 'SETUP_TOKEN', 'PUBLIC_URL'];
const env = (k) => Netlify.env.get(k) || '';
const readEnv = () => Object.fromEntries(VARS.map((k) => [k, Netlify.env.get(k) || '']));

export default async (req, context) => {
  // Archivio dei dati (utenti, progressi, lezioni in cache). Su Netlify si configura da solo.
  const blobs = getStore({ name: env('BLOBS_STORE') || 'tutor', consistency: 'strong' });
  // Archivi dei vecchi siti (spagnolo e portoghese), solo per lo strumento di importazione: servono un token Netlify e l'id di ogni sito.
  const legacy = {};
  const token = env('LEGACY_TOKEN');
  for (const [id, store] of [['es', 'spagnolo'], ['pt', 'portugues']]) {
    const siteID = env('LEGACY_' + id.toUpperCase() + '_SITE_ID');
    if (siteID && token) legacy[id] = () => getStore({ name: env('LEGACY_' + id.toUpperCase() + '_STORE') || store, siteID, token, consistency: 'strong' });
  }
  return handle(req, { blobs, env: readEnv(), ip: context.ip, legacy });
};

export const config = { path: ['/api', '/api/*'] };
