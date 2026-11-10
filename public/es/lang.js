// Impostazioni della lingua: lette dagli script comuni in /app/ (testi, voce, verbi). Le prime righe sono quelle da cambiare per una nuova lingua.
window.TUTOR = {
  lang: 'es', name: 'spagnolo', longName: 'spagnolo', api: '/api/es',
  speech: 'es-ES', voiceLang: 'es',
  deadlineLabel: '2 dicembre',   // se c'è una data obiettivo, la home conta i giorni; altrimenti conta i giorni di pratica
  levelHints: { 'B1-': "Mi faccio capire ma sbaglio spesso tempi del passato, ser/estar e pronomi.", 'B1': "Me la cavo nelle situazioni comuni; voglio consolidare subjuntivo e frasi complesse." },   // frasi mostrate nella scelta manuale del livello
  subjects: 'yo|tú|usted|nosotros|nosotras|vosotros|vosotras|ellos|ellas|ustedes|ella',   // pronomi soggetto che si possono omettere o aggiungere nelle risposte
  articles: 'el|la|los|las|un|una|unos|unas',   // articoli che nel test di vocabolario si possono omettere
  verbs: {
    tenseIt: { presente: 'presente', indefinido: 'passato remoto', imperfecto: 'imperfetto', futuro: 'futuro semplice', condicional: 'condizionale',
      perfecto: 'passato prossimo', pluscuamperfecto: 'trapassato prossimo', subjPresente: 'congiuntivo presente', subjImperfecto: 'congiuntivo imperfetto',
      impAfirmativo: 'imperativo affermativo', impNegativo: 'imperativo negativo' },
    example: 'tener', models: ['hablar', 'comer', 'vivir'], modelTenses: ['presente', 'indefinido', 'imperfecto', 'futuro', 'condicional', 'subjPresente'], modelsTitle: 'I tre modelli regolari',
    practiceTenses: ['presente', 'indefinido', 'imperfecto', 'futuro', 'condicional', 'perfecto', 'subjPresente', 'impAfirmativo'], defaultTenses: ['presente', 'indefinido'],
    gerundLabel: 'Gerundio', participleLabel: 'Participio',
    reflexiveNote: function (inf) { return 'È un verbo riflessivo (' + inf + 'se): si coniuga come ' + inf + ' aggiungendo il pronome me, te, se, nos, os, se davanti alla forma (me lavo, te lavas…).'; }
  }
};
