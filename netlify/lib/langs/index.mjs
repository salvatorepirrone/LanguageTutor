// Le lingue del tutor. Ognuna ha la sua cartella (impostazioni, catalogo, azioni) e i suoi dati sotto un prefisso dell'archivio.
// Lo spagnolo è senza prefisso: così il sito che c'era prima (un solo store "spagnolo") continua a funzionare con gli stessi dati.
// Se si aggiunge una lingua, aggiornare anche DATA_PREFIXES in auth.mjs.
import * as es from './es/actions.mjs';
import * as pt from './pt/actions.mjs';
import * as en from './en/actions.mjs';

export const LANGS = {
  es: { id: 'es', prefix: '', ACTIONS: es.ACTIONS, state: es.state },
  pt: { id: 'pt', prefix: 'pt/', ACTIONS: pt.ACTIONS, state: pt.state },
  en: { id: 'en', prefix: 'en/', ACTIONS: en.ACTIONS, state: en.state },
};
