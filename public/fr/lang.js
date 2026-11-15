// Impostazioni della lingua: lette dagli script comuni in /app/ (testi, voce, verbi).
window.TUTOR = {
  lang: 'fr', name: 'francese', longName: 'francese', api: '/api/fr',
  speech: 'fr-FR', voiceLang: 'fr',
  deadlineLabel: null,   // nessuna data obiettivo: la home conta i giorni di pratica
  levelHints: { 'B1-': "Mi faccio capire ma sbaglio spesso passé composé e imparfait, accordi e pronomi (y, en).", 'B1': "Me la cavo nelle situazioni comuni; voglio consolidare congiuntivo e frasi complesse." },   // frasi mostrate nella scelta manuale del livello
  subjects: 'je|tu|il|elle|on|nous|vous|ils|elles',   // pronomi soggetto che si possono omettere o aggiungere nelle risposte
  elision: "j(?=[aeiouyhéèêëàâîïôöùûüœ])",   // "j'ai" (l'apostrofo si toglie nel confronto): si accetta anche senza il j
  articles: 'le|la|les|un|une|des|du',   // articoli che nel test di vocabolario si possono omettere
  verbs: {
    tenseIt: { presente: 'presente', passeCompose: 'passato prossimo', imparfait: 'imperfetto', plusQueParfait: 'trapassato prossimo', futur: 'futuro semplice',
      conditionnel: 'condizionale presente', subjonctif: 'congiuntivo presente', impAfirmativo: 'imperativo affermativo', impNegativo: 'imperativo negativo' },
    example: 'avoir', models: ['parler', 'finir', 'vendre'], modelTenses: ['presente', 'passeCompose', 'imparfait', 'futur', 'conditionnel', 'subjonctif'],
    modelsTitle: 'I tre modelli regolari',
    practiceTenses: ['presente', 'passeCompose', 'imparfait', 'futur', 'conditionnel', 'subjonctif', 'plusQueParfait', 'impAfirmativo'], defaultTenses: ['presente', 'passeCompose'],
    gerundLabel: 'Participe présent', participleLabel: 'Participe passé',
    reflexiveNote: function (inf) { return 'È un verbo pronominale (se ' + inf + '): si coniuga con i pronomi me, te, se, nous, vous, se davanti al verbo (je me lave, tu te laves…) e forma il passé composé con être.'; }
  }
};
