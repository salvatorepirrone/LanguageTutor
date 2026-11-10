# Elenco di controllo prima di un deploy su Netlify

Ogni deploy costa 15 crediti (piano gratuito: 300 al mese). Language Tutor è **un solo progetto Netlify** per tutte e tre le lingue: un deploy basta per tutte.
Si lavora direttamente su `main`: commit e push non costano nulla perché le build automatiche sono fermate. Si pubblica solo a mano, dalla console Netlify.

## 1. Prima di decidere di pubblicare

- [ ] Ho raccolto tutte le modifiche che voglio mettere online? Meglio un deploy con molte cose che tre deploy con poche.
- [ ] Ho provato in locale con la demo (`py tools/demo.py`, poi `http://127.0.0.1:18080/`)?
- [ ] Le prove del backend passano, per tutte le lingue? Nel browser, sulla pagina della demo:
  `for (const f of ['backend', 'pt', 'en']) { const m = await import('/netlify/test/' + f + '.test.mjs?x=' + Date.now()); console.log(f, (await m.run()).failures); }` deve dare `0` tre volte.
- [ ] Se possibile, ho provato con il vero Claude (`npx netlify-cli dev`, serve Node.js 22+)? Finora non è mai stato fatto.
- [ ] I crediti rimasti bastano? (Netlify → Team → Usage).

## 2. Solo la prima volta con questo repository

- [ ] Variabili d'ambiente impostate **prima** del deploy: `ANTHROPIC_API_KEY`, `SESSION_SECRET` (almeno 32 caratteri), `SETUP_TOKEN`; facoltative `PUBLIC_URL` e `BLOBS_STORE`.
- [ ] Se riuso il progetto Netlify dello spagnolo: ho collegato il repository `Languagetutor` (Build & deploy → Continuous deployment) e impostato `BLOBS_STORE=spagnolo`, così restano utenti e progressi.
- [ ] Se è un progetto nuovo: dopo il deploy aprire `/setup.html` con il `SETUP_TOKEN` per creare l'amministratore, poi togliere il token.

## 3. Codice su GitHub

- [ ] Commit e push fatti su `main` (`git status` pulito, `git log origin/main -1` mostra l'ultima modifica).
- [ ] Il push su `main` **non** deve avviare un deploy (build ferme). Se su Netlify compare un deploy che non hai lanciato tu, ferma le build.

## 4. Il deploy

- [ ] Netlify → progetto giusto → *Continuous deployment*: se le build sono fermate, **Activate builds** (altrimenti *Trigger deploy* resta disattivato).
- [ ] **Deploys → Trigger deploy → Deploy site**, ramo `main`.
- [ ] Aspettare "Published". Se fallisce, leggere il log prima di riprovare: ogni tentativo costa crediti.
- [ ] Fermare di nuovo le build (**Stop builds**) a deploy finito.

## 5. Dopo il deploy

- [ ] Aprire il sito e fare l'accesso; dopo la migrazione dal vecchio sito si riaccede una volta.
- [ ] Nella pagina delle lingue compaiono inglese, spagnolo e portoghese.
- [ ] In una lingua: provare una conversazione e un esercizio (usano il vero Claude); in Verbi, un verbo in elenco e uno che non c'è.
- [ ] Inviare un feedback di prova e controllare che compaia in `/admin.html`.
- [ ] Controllare nella pagina Deploys che non ci siano deploy extra e annotare i crediti rimasti.
