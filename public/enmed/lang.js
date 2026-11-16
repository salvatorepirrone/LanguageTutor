// Impostazioni della lingua: lette dagli script comuni in /app/ (testi, voce, verbi). Inglese per medici (cardiologia): stessi verbi dell'inglese, più quelli clinici (verbs.js).
window.TUTOR = {
  lang: 'enmed', name: 'inglese', longName: 'inglese medico (cardiologia)', api: '/api/enmed',
  speech: 'en-GB', voiceLang: 'en',
  deadlineLabel: null,
  lessicoLabel: 'Terminologia medica',
  levelHints: { 'B1-': "Me la cavo con l'anamnesi e frasi cliniche semplici, ma il lessico tecnico è limitato.", 'B1': "Me la cavo con l'anamnesi e frasi cliniche semplici, ma il lessico tecnico è limitato e faccio fatica a presentare un caso." },
  levelCuts: [[0.35, 'B1'], [0.55, 'B1+'], [0.78, 'B2']],   // soglie del test per i livelli di questa lingua (sopra l'ultima: C1)
  subjects: 'i|you|he|she|it|we|they',
  articles: 'a|an|the|to',
  verbs: {
    tenseIt: { presente: 'presente', presenteContinuo: 'presente progressivo (stare + gerundio)', passato: 'passato remoto / imperfetto', passatoContinuo: 'imperfetto progressivo (stavo + gerundio)',
      perfetto: 'passato prossimo (con for/since: presente)', passatoPerfetto: 'trapassato prossimo', futuro: 'futuro semplice', futuroGoing: 'futuro prossimo (ho intenzione di)',
      condizionale: 'condizionale presente', impAfirmativo: 'imperativo affermativo', impNegativo: 'imperativo negativo' },
    example: 'prescribe', models: ['work', 'study', 'stop'], modelTenses: ['presente', 'passato', 'perfetto', 'futuro', 'condizionale', 'presenteContinuo'],
    modelsTitle: 'Tre modelli di verbi regolari (normale, in -y, con raddoppio)',
    practiceTenses: ['presente', 'presenteContinuo', 'passato', 'passatoContinuo', 'perfetto', 'futuro', 'condizionale', 'impAfirmativo'], defaultTenses: ['presente', 'passato'],
    gerundLabel: 'Forma in -ing', participleLabel: 'Participio passato',
    reflexiveNote: null
  }
};
