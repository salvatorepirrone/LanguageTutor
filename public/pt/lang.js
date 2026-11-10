// Impostazioni della lingua: lette dagli script comuni in /app/ (testi, voce, verbi). Le prime righe sono quelle da cambiare per una nuova lingua.
window.TUTOR = {
  lang: 'pt', name: 'portoghese', longName: 'portoghese brasiliano', api: '/api/pt',
  speech: 'pt-BR', voiceLang: 'pt',
  deadlineLabel: null,   // se c'è una data obiettivo, la home conta i giorni; altrimenti conta i giorni di pratica
  levelHints: { 'B1-': "Mi faccio capire ma sbaglio spesso tempi del passato, ser/estar e pronomi.", 'B1': "Me la cavo nelle situazioni comuni; voglio consolidare subjuntivo e frasi complesse." },   // frasi mostrate nella scelta manuale del livello
  subjects: 'eu|tu|você|voce|ele|ela|nós|nos|vocês|voces|eles|elas|a gente',   // pronomi soggetto che si possono omettere o aggiungere nelle risposte
  articles: 'o|a|os|as|um|uma|uns|umas',   // articoli che nel test di vocabolario si possono omettere
  verbs: {
    tenseIt: { presente: 'presente', perfeito: 'passato remoto / passato prossimo', imperfeito: 'imperfetto', futuro: 'futuro semplice', condicional: 'condizionale',
      perfeitoComposto: 'azione ripetuta fino ad ora', maisQuePerfeito: 'trapassato prossimo', subjPresente: 'congiuntivo presente',
      subjImperfeito: 'congiuntivo imperfetto', subjFuturo: 'congiuntivo futuro (in italiano non esiste)', impAfirmativo: 'imperativo affermativo', impNegativo: 'imperativo negativo' },
    example: 'ter', models: ['falar', 'comer', 'partir'], modelTenses: ['presente', 'perfeito', 'imperfeito', 'futuro', 'condicional', 'subjPresente'], modelsTitle: 'I tre modelli regolari',
    practiceTenses: ['presente', 'perfeito', 'imperfeito', 'futuro', 'condicional', 'perfeitoComposto', 'subjPresente', 'subjFuturo', 'impAfirmativo'], defaultTenses: ['presente', 'perfeito'],
    gerundLabel: 'Gerúndio', participleLabel: 'Particípio',
    reflexiveNote: function (inf) { return 'È un verbo riflessivo (' + inf + '-se): si coniuga come ' + inf + ' aggiungendo il pronome me, te, se, nos, se prima del verbo (eu me lavo, você se lava, nós nos lavamos).'; }
  }
};
