// Impostazioni della lingua: lette dagli script comuni in /app/ (testi, voce, verbi).
window.TUTOR = {
  lang: 'en', name: 'inglese', longName: 'inglese britannico', api: '/api/en',
  speech: 'en-GB', voiceLang: 'en',
  deadlineLabel: null,   // nessuna data obiettivo: la home conta i giorni di pratica
  levelHints: { 'B1-': "Mi faccio capire ma sbaglio spesso past simple e present perfect, articoli e preposizioni.", 'B1': "Me la cavo nelle situazioni comuni; voglio consolidare condizionali, passivo e frasi complesse." },   // frasi mostrate nella scelta manuale del livello
  subjects: 'i|you|he|she|it|we|they',   // pronomi soggetto che si possono omettere o aggiungere nelle risposte
  articles: 'a|an|the|to',   // articoli (e "to" dei verbi) che nel test di vocabolario si possono omettere
  verbs: {
    tenseIt: { presente: 'presente', presenteContinuo: 'presente progressivo (stare + gerundio)', passato: 'passato remoto / imperfetto', passatoContinuo: 'imperfetto progressivo (stavo + gerundio)',
      perfetto: 'passato prossimo (con for/since: presente)', passatoPerfetto: 'trapassato prossimo', futuro: 'futuro semplice', futuroGoing: 'futuro prossimo (ho intenzione di)',
      condizionale: 'condizionale presente', impAfirmativo: 'imperativo affermativo', impNegativo: 'imperativo negativo' },
    example: 'go', models: ['work', 'study', 'stop'], modelTenses: ['presente', 'passato', 'perfetto', 'futuro', 'condizionale', 'presenteContinuo'],
    modelsTitle: 'Tre modelli di verbi regolari (normale, in -y, con raddoppio)',
    practiceTenses: ['presente', 'presenteContinuo', 'passato', 'passatoContinuo', 'perfetto', 'futuro', 'condizionale', 'impAfirmativo'], defaultTenses: ['presente', 'passato'],
    gerundLabel: 'Forma in -ing', participleLabel: 'Participio passato',
    reflexiveNote: null
  }
};
