# Riassunto del progetto (da dare a una nuova chat con Claude)

Ultimo aggiornamento: 10 novembre 2026. Scritto per riprendere il lavoro senza la cronologia delle chat precedenti.

## Cos'è

**Language Tutor**: tutor di lingue per un utente italiano (livello iniziale appena sotto il B1): **inglese** britannico, **spagnolo** della Spagna, **portoghese** del Brasile, **francese** di Francia, più le versioni **per medici** (inglese e francese, cardiologia).
Un solo sito, un solo accesso (inviti, ruoli admin/user/guest), un solo progetto Netlify, sei app (`/en/`, `/es/`, `/pt/`, `/fr/`, `/enmed/`, `/frmed/`). Repository: `https://github.com/salvatorepirrone/Languagetutor`,
cartella locale `C:\Users\salva\LanguageTutor`, ramo `main`.

I repository precedenti, **`SpanishTutor`** (`C:\Users\salva\SpanishTutor`) e **`PortugueseTutor`** (`C:\Users\salva\PortugueseTutor`), sono la storia dei due progetti separati: restano come archivio
e non si sviluppano più. Anche il repository vuoto `speakenglish` non è usato (l'inglese è dentro Language Tutor).

## Regole di lavoro stabilite dall'utente

- **Nessun deploy su Netlify** finché l'utente non lo decide. Il piano gratuito ha 300 crediti e ogni deploy ne costa 15; le build automatiche sono fermate. Un solo deploy manuale dalla console (vedi `ELENCO-DEPLOY.md`).
- L'utente chiede quasi sempre commit e push dopo ogni modifica, su `main`. Messaggi di commit in italiano, con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` in fondo.
- Si risponde in italiano; l'utente è sbrigativo e preferisce risultati verificati e un riepilogo onesto di limiti e cose non provate.
- Non creo account né password per conto dell'utente.
- **Le modifiche vanno sempre fatte su tutte le lingue** (spagnolo, portoghese, inglese), salvo diversa indicazione.
- Il nuovo utente di una lingua comincia con il test di livello e tutta l'esperienza (grammatica, esercizi, conversazione) si basa sul suo livello.
- Il pulsante **💬 Feedback** è in ogni pagina dopo l'accesso: le segnalazioni stanno in `feedback/log` (archivio comune) e l'amministratore le legge in `/admin.html` («Copia quelli da leggere» per incollarle in una chat). Claude non può leggere il registro online da solo.

## Architettura

- **Frontend** `public/`: sito statico senza framework. `app/*.js` sono script comuni a tutte le lingue; ogni lingua ha `public/<lingua>/{index.html, lang.js, coniugatore.js}`.
  `lang.js` definisce `window.TUTOR` (nome, voce, verbi, testi) letto dagli script comuni. Stile con un tema per lingua (`html[data-lang=…]`).
- **Backend** `netlify/`: `functions/api.mjs` (entrata), `lib/router.mjs`, `lib/auth.mjs`, `lib/feedback.mjs`, `lib/util.mjs`, e una cartella per lingua in `lib/langs/<lingua>/` (`core.mjs`, `actions.mjs`, `data.mjs`).
  Indirizzi: `/api/auth/*`, `/api/admin/*`, `/api/feedback`, `/api/<lingua>`.
- **Archivio**: Netlify Blobs. I dati di ogni lingua hanno un prefisso (`pt/`, `en/`, `fr/`, `enmed/`, `frmed/`); lo spagnolo è senza prefisso per restare compatibile con il vecchio sito (store `spagnolo`, impostabile con `BLOBS_STORE`).
- **Claude**: chiamato solo dal server, modello `claude-sonnet-5-5`, prompt JSON. Il limite giornaliero di richieste per persona è unico (150, guest 30).
- **Variabili d'ambiente**: `ANTHROPIC_API_KEY`, `SESSION_SECRET`, `SETUP_TOKEN`, `PUBLIC_URL`, `BLOBS_STORE`.

## Come provare senza deploy

- **Demo**: `py tools/demo.py`, poi `http://127.0.0.1:18080/`. Backend vero nel browser, Claude **simulato** (risposte di prova, in spagnolo anche per le altre lingue), utente `demo` già dentro.
- **Prove**: dalla demo, `const m = await import('/netlify/test/backend.test.mjs?x='+Date.now()); await m.run()` (spagnolo, 93 prove); `pt.test.mjs` (97); `en.test.mjs` (103); `fr.test.mjs` (103); `enmed.test.mjs` e `frmed.test.mjs` (111 ciascuna). Dopo modifiche ricaricare la pagina.
- **Con il vero Claude**: servono Node.js 22+ e `npx netlify-cli dev`. **Mai provato**: sul computer non c'è Node.
- Su Windows con Git Bash: per modifiche lunghe usare uno script Python (`py -I`), le heredoc sono fragili; controllare `git diff --stat` per i fine riga.

## Cosa c'è

- Spagnolo e portoghese migrati dai vecchi repository, con le stesse funzioni (il portoghese ha ora anche il test di vocabolario, che prima mancava).
- Inglese: catalogo di grammatica (6 sezioni), temi di vocabolario, piano di 8 settimane per livello, motore dei verbi con circa 160 irregolari, prove.
- Verbi: allenamento con la forma italiana chiesta al tutor (`verb_italian`), controllo con il tutor per i verbi non in elenco (`verb_check`), contrazioni accettate in inglese.
- Esercizi: punteggio da 0 a 1 a passi di 0,25 per le traduzioni; se dopo i filtri ne mancano rispetto al numero scelto, un secondo giro li integra.

## Limiti noti (da dire onestamente)

- Il vero Claude non è stato provato in locale: non so quanto siano naturali le traduzioni italiane delle forme verbali, i punteggi parziali, i controlli dei verbi e l'inglese generato.
- I livelli vanno da A2 a C1 per tutte le lingue (nessun A1); B2 e C1 hanno piano di 8 settimane, grammatica avanzata e liste di vocabolario più impegnative.
- Un verbo non in elenco può non esistere o essere irregolare: lo decide Claude e può sbagliare su verbi rari.
- Il filtro sulle glosse tra parentesi (`suspiciousHint`) nell'inglese è più debole (accetta qualunque parola singola in lettere latine minuscole).
- Il motore dei verbi inglese non copre i verbi modali (can, must…): sono trattati nella grammatica, non nelle tabelle.
- Gli account dell'app portoghese (store `portugues`, progetto Netlify diverso) non si trasferiscono: vanno reinvitati.

## Prossimi passi possibili

- Collegare il repository al progetto Netlify dello spagnolo con `BLOBS_STORE=spagnolo` e fare un solo deploy (vedi README e `ELENCO-DEPLOY.md`).
- Provare tutto con il vero Claude, quando Node sarà disponibile.
- Rendere il Claude simulato della demo consapevole della lingua (oggi risponde sempre in spagnolo di prova).

- **Vercel**: lo stesso codice gira anche su Vercel (`api/[...path].js`, `vercel.json`) con Redis di Upstash al posto dei Blobs (`netlify/lib/redis-blobs.mjs`, prova `redis.test.mjs`). Mai pubblicato né provato su Vercel vero: le prove usano un Redis finto.
- **Conversazione**: all'inizio il tutor crea un personaggio (generico per la chiacchierata libera, su misura per le situazioni: cameriere, concierge, medico…), si presenta e presenta la situazione; il browser rimanda il personaggio a ogni turno (campo `persona`).
- **Tutor a scelta**: per la chiacchierata libera ogni lingua ha 4 tutor (nome, età, città, mestiere, carattere, interessi; catalogo `tutors` in `data.mjs`). Ogni utente sceglie il suo dal pulsante nella barra della Conversazione (azione `tutor_set`, salvato nel profilo della lingua, di partenza il primo). Nelle situazioni (ristorante, medico…) il personaggio resta creato su misura.
- **Francese** (aggiunto a novembre 2026): stesse funzioni delle altre lingue. Catalogo di grammatica (7 sezioni con «Avanzato»), piani A2-C1, quattro tutor (Camille, Antoine, Marguerite, Lucas), motore dei verbi con i tre gruppi, particolarità ortografiche (ç, ge, y→i, è, raddoppio) e circa 80 irregolari; il participio dei verbi con être è mostrato come allé(e)(s) e si accetta anche senza (e). Accordo del participio con il complemento oggetto non modellato.
- **Versioni per medici** (`enmed`, `frmed`, novembre 2026): inglese e francese per cardiologi, obiettivo terminologia tecnica. Livelli B1-C1, 28 temi di vocabolario clinico, 8 scenari clinici, tutor colleghi, grammatica del linguaggio medico, verbi clinici aggiunti al motore (`public/<lingua>med/verbs.js`). Prompt dedicati in `netlify/lib/langs/enmed|frmed/actions.mjs` (generati dalle versioni normali con sostituzioni: se si cambia un prompt nelle versioni normali, ricordare le versioni per medici). Contenuti non rivisti da un medico.
- Francese: ora modella anche le quattro forme del participio passato con la regola di accordo (nota nella pagina Verbi); pouvoir, devoir e valoir non hanno imperativo («—»). La demo locale risponde nella lingua della pagina (tutor simulato localizzato).
- **Letteratura (versioni per medici)**: sezione 📰 con articoli reali da PubMed (E-utilities, `netlify/lib/literature.mjs`; azioni `lit_search`, `lit_read`, `lit_deck_add`), scheda di studio generata da Claude dall'abstract (terminologia, strutture, domande; in cache per articolo) e scenario «Journal club» in conversazione (`pmid` rimandato dal browser). 6 temi di vocabolario in più sul linguaggio degli articoli (disegni di studio, statistica, endpoint, linee guida, collocazioni, trial noti). Le prove usano un PubMed finto; la demo usa il PubMed vero (con ripiego sul finto). Mai provato con il vero Claude.
- **Prove superate**: un argomento di grammatica diventa verde (e «✓ Superato») con almeno 4 risposte e il 70% di giuste (`SP.passed` in `public/app/common.js`); gli argomenti solo tentati hanno un bordo giallo. Alla fine di una serie con almeno il 70% di giuste (esercizi, test di vocabolario, allenamento sui verbi) compare un messaggio di complimenti (`SP.celebrate`), con un avviso in più quando l'argomento diventa verde la prima volta.
