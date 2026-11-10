# Language Tutor

Tutor di lingue per italiani: **inglese** (britannico), **spagnolo** (Spagna) e **portoghese** (Brasile). Un solo sito, un solo accesso, tre app.
Il tutor è Claude, chiamato solo dal server: nessuna chiave nel browser né in questo repository.

Ogni lingua ha le stesse sezioni, tutte basate sul livello della persona:

| Sezione | Cosa fa |
| --- | --- |
| Home | Descrizione, numeri del giorno, piano della settimana, accesso rapido alle funzioni |
| Conversazione | Dialogo con il tutor (testo e voce), correzione dopo ogni frase, suggerimenti nella lingua studiata (💡) |
| Esercizi | Serie generate per argomento: scelta multipla, completa, traduci (punteggio da 0 a 1 a passi di 0,25) |
| Grammatica | Argomenti in sezioni, lezioni generate una volta e conservate |
| Vocabolario | Temi con liste di parole e test di scrittura nei due versi (i sinonimi valgono), mazzo con ripasso a intervalli |
| Verbi | Coniugazione con le forme irregolari evidenziate (motore a regole) e allenamento con la forma italiana |
| Test | 20 domande + testo scritto, stima del livello e progressi |

**Primo accesso in una lingua:** test di ingresso (o scelta del livello) e piano di 8 settimane. Il livello, il piano, i progressi e il mazzo di parole
sono separati per lingua; gli account sono uno solo per tutte.

In ogni pagina dopo l'accesso c'è il pulsante **💬 Feedback**: le segnalazioni finiscono in un registro che l'amministratore legge in fondo a `/admin.html`.

## Struttura

```
public/                sito statico
  index.html, hub.js     pagina delle lingue (dopo l'accesso)
  es/ pt/ en/            una cartella per lingua: index.html, lang.js (impostazioni), coniugatore.js (motore dei verbi)
  app/                   script comuni a tutte le lingue (home, conversazione, esercizi, grammatica, vocabolario, verbi, test…)
  login.html, invito.html, account.html, admin.html, setup.html, auth.js     accessi (uno solo per tutte le lingue)
  feedback.js, style.css                                                    pulsante feedback e stile (un tema per lingua)
netlify/functions/     funzione /api (entrata)
netlify/lib/           backend: accessi (auth), feedback, router, utilità
netlify/lib/langs/     una cartella per lingua: core (impostazioni e dati dello studente), actions (azioni e prompt per Claude), data (catalogo)
netlify/test/          prove della logica (archivio in memoria, Claude simulato): una per lingua
tools/demo.py          demo locale
```

Indirizzi dell'API: `/api/auth/*` e `/api/admin/*` (accessi), `/api/feedback`, `/api/<lingua>` (`es`, `pt`, `en`: stato e azioni del tutor).
I dati di ogni lingua stanno nello stesso archivio con un prefisso: `pt/…` e `en/…`; lo spagnolo è senza prefisso, per restare compatibile con il primo sito
(un solo store chiamato `spagnolo`). Il limite giornaliero di richieste a Claude è unico per persona, su tutte le lingue.

## Provare in locale, senza deploy

**1. Demo immediata (serve solo Python):**

```sh
py tools/demo.py
```

Si apre `http://127.0.0.1:18080/` con il backend vero eseguito nel browser e un **Claude simulato**: le risposte, gli esercizi e le liste sono di prova
(e sono scritte in spagnolo anche nelle altre lingue). Si entra già come utente `demo`; i dati restano nella sessione del browser.

**2. Prova con il vero Claude (`netlify dev`).** Serve Node.js 22 o più recente (`winget install OpenJS.NodeJS.LTS`). Copia `.env.example` in `.env`,
compila le variabili (il file è ignorato da git), poi:

```sh
npm install
npx netlify-cli dev
```

Il sito gira su `http://localhost:8888`. Per il primo accesso apri `/setup.html` con il tuo `SETUP_TOKEN`.

## Pubblicare su Netlify (da GitHub)

Un solo progetto Netlify per tutte le lingue: un deploy costa 15 crediti, non 45.

**Progetto nuovo.** *Add new project → Import an existing project → GitHub* e scegli questo repository (le impostazioni di build vengono da `netlify.toml`).
Prima del primo deploy, in *Project configuration → Environment variables* (ambito: Functions):

| Variabile | Valore |
| --- | --- |
| `ANTHROPIC_API_KEY` | la chiave API di Claude |
| `SESSION_SECRET` | stringa casuale di almeno 32 caratteri |
| `SETUP_TOKEN` | parola d'ordine per creare il primo amministratore |
| `PUBLIC_URL` | (facoltativa) indirizzo del sito, per i link di invito |
| `BLOBS_STORE` | (facoltativa) nome dell'archivio; se manca si usa `tutor` |

**Se si riusa il progetto Netlify dello spagnolo** (così restano utenti e progressi): in *Build & deploy → Continuous deployment* collega il progetto a questo
repository e imposta `BLOBS_STORE=spagnolo`. Le variabili esistenti restano valide. Le persone dovranno rifare l'accesso una volta (il cookie ha un altro nome);
gli utenti e i dati dello spagnolo si ritrovano al loro posto. Gli account dell'app portoghese, che aveva un archivio suo, non si trasferiscono: vanno reinvitati.

Poi apri `https://<sito>.netlify.app/setup.html` (solo se non esiste ancora un amministratore), accedi e invita le persone da `/admin.html`.
Il pulsante *Trigger deploy* è disattivato se le build sono fermate: riattivale in *Continuous deployment* e rifermale a deploy finito, per non consumare crediti a ogni push.

## Accessi

- Solo su invito (link a uso singolo, valido 7 giorni); un account vale per tutte le lingue.
- Ruoli `admin`, `user`, `guest` (limite di richieste più basso); limite giornaliero per persona (predefinito 150, guest 30), modificabile da `/admin.html`.
- Blocco dopo 5 password errate e tetto di tentativi per indirizzo IP; sessioni invalidate al cambio password.
- Cookie di sessione firmato (HttpOnly, Secure, SameSite=Lax); le richieste che modificano dati richiedono un'intestazione che un altro sito non può aggiungere.
- Eliminando un utente si cancellano anche i suoi dati in tutte le lingue.

## Importare utenti e dati dai vecchi siti

Per portare in Language Tutor gli utenti (con le loro password), i ruoli, i limiti e i progressi dei siti di spagnolo e portoghese c'è uno strumento
per l'amministratore in fondo a `/admin.html`. Non sovrascrive niente: chi esiste già e i dati già presenti restano come sono; gli inviti mai accettati
vanno rifatti. I dati di studio dello spagnolo diventano quelli dello spagnolo, quelli del portoghese quelli del portoghese; l'inglese parte da zero.

Per attivarlo servono queste variabili d'ambiente sul sito nuovo (ambito Functions) e un nuovo deploy; **non scriverle in chat né nel repository**:

| Variabile | Valore |
| --- | --- |
| `LEGACY_TOKEN` | un token personale di Netlify (*User settings → Applications → Personal access tokens → New access token*) |
| `LEGACY_ES_SITE_ID` | id del vecchio progetto dello spagnolo (`hablaespanol`): `4646ad19-77f5-4f73-a816-f4cecd3e159a` |
| `LEGACY_PT_SITE_ID` | id del vecchio progetto del portoghese (`hablaportoguese`): `a1e27e46-b1a7-400d-b997-eba86c30e25b` |
| `LEGACY_ES_STORE`, `LEGACY_PT_STORE` | (facoltative) nome dell'archivio vecchio; di solito `spagnolo` e `portugues` |

Poi, da `/admin.html`: **Anteprima** (mostra cosa verrebbe copiato, senza copiare) e **Copia**. Si può ripetere senza rischi. A import finito si possono togliere le variabili `LEGACY_*`
e il token.

## Prove

Le prove si eseguono nel browser servendo il repository (la demo lo fa), da una pagina qualsiasi:

```js
const m = await import('/netlify/test/backend.test.mjs');   // spagnolo; poi pt.test.mjs e en.test.mjs
console.log(await m.run());                                  // { failures: 0, total: 93, ... }
```

Spagnolo 93 prove, portoghese 87, inglese 93. Dopo aver modificato un file, ricarica la pagina (il browser tiene i moduli in cache).

## Aggiungere una lingua

1. `netlify/lib/langs/<id>/`: copiare una lingua esistente (`core.mjs`, `actions.mjs`, `data.mjs`) e adattare impostazioni, prompt e catalogo.
2. Registrarla in `netlify/lib/langs/index.mjs` e aggiungere il prefisso in `DATA_PREFIXES` di `netlify/lib/auth.mjs`.
3. `public/<id>/`: `index.html`, `lang.js` (nome, voce, verbi, testi) e `coniugatore.js` (stessa interfaccia degli altri: `PERSONS`, `TENSES`, `full`, `parse`…).
4. Un tema in `public/style.css` (`html[data-lang=<id>]`), la carta nella pagina delle lingue (`public/hub.js`), una prova in `netlify/test/`.

## Limiti da conoscere

- Le funzioni sincrone di Netlify durano al massimo 60 secondi; le chiamate più lente (test, liste, lezioni) ne usano 15-50 alla prima generazione, poi il risultato resta in cache.
- Lezioni, liste di vocabolario ed esercizi sono generati da Claude e non sono riletti da un insegnante.
- Il microfono richiede Chrome, Edge o Safari e una connessione a internet.
- Il motore dei verbi inglese coniuga con regole e con circa 160 verbi irregolari; un verbo non in elenco viene verificato dal tutor.
- I livelli vanno da A2 a C1 per tutte le lingue (B2 è l'upper-intermediate, puntando al C1); gli argomenti avanzati stanno nella sezione «Avanzato (B2-C1)» della grammatica.
