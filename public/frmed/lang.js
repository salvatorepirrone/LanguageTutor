// Impostazioni della lingua: lette dagli script comuni in /app/ (testi, voce, verbi). Francese per medici (cardiologia): stessi verbi del francese, più quelli clinici (verbs.js).
window.TUTOR = {
  lang: 'frmed', name: 'francese', longName: 'francese medico (cardiologia)', api: '/api/frmed',
  speech: 'fr-FR', voiceLang: 'fr',
  deadlineLabel: null,
  lessicoLabel: 'Terminologia medica',
  levelHints: { 'B1-': "Me la cavo con l'anamnesi e frasi cliniche semplici, ma il lessico tecnico è limitato.", 'B1': "Me la cavo con l'anamnesi e frasi cliniche semplici, ma il lessico tecnico è limitato e faccio fatica a presentare un caso." },
  levelCuts: [[0.35, 'B1'], [0.55, 'B1+'], [0.78, 'B2']],   // soglie del test per i livelli di questa lingua (sopra l'ultima: C1)
  subjects: 'je|tu|il|elle|on|nous|vous|ils|elles',
  elision: "j(?=[aeiouyhéèêëàâîïôöùûüœ])",
  articles: 'le|la|les|un|une|des|du',
  verbs: {
    tenseIt: { presente: 'presente', passeCompose: 'passato prossimo', imparfait: 'imperfetto', plusQueParfait: 'trapassato prossimo', futur: 'futuro semplice',
      conditionnel: 'condizionale presente', subjonctif: 'congiuntivo presente', impAfirmativo: 'imperativo affermativo', impNegativo: 'imperativo negativo' },
    example: 'prescrire', models: ['parler', 'finir', 'vendre'], modelTenses: ['presente', 'passeCompose', 'imparfait', 'futur', 'conditionnel', 'subjonctif'],
    modelsTitle: 'I tre modelli regolari',
    practiceTenses: ['presente', 'passeCompose', 'imparfait', 'futur', 'conditionnel', 'subjonctif', 'plusQueParfait', 'impAfirmativo'], defaultTenses: ['presente', 'passeCompose'],
    gerundLabel: 'Participe présent', participleLabel: 'Participe passé',
    reflexiveNote: function (inf) { return 'È un verbo pronominale (se ' + inf + '): si coniuga con i pronomi me, te, se, nous, vous, se davanti al verbo e forma il passé composé con être.'; }
  }
};
