// Catalogo del tutor di inglese per medici (cardiologia): terminologia, scenari clinici, piani per livello, tutor.
export default {
 "scenarios": {
  "libero": {
   "label": "Chiacchierata tra colleghi",
   "desc": "Conversazione informale tra colleghi medici: lavoro in reparto, novità cliniche, congressi e vita professionale; usa la terminologia tecnica quando è naturale."
  },
  "anamnesi": {
   "label": "Anamnesi con un paziente",
   "desc": "Gioco di ruolo: tu sei un paziente con un sintomo cardiologico (per esempio dolore toracico o palpitazioni) e rispondi alle domande dello studente, che è il medico e raccoglie l'anamnesi."
  },
  "visita": {
   "label": "Visita di controllo",
   "desc": "Gioco di ruolo: tu sei un paziente cardiopatico a una visita di controllo; lo studente, medico, rivede gli esami, spiega la terapia e risponde ai tuoi dubbi."
  },
  "reparto": {
   "label": "Giro visite e consegne",
   "desc": "Gioco di ruolo: tu sei un collega (primario o infermiere) durante il giro visite o le consegne; lo studente presenta un paziente in modo strutturato (SOAP o SBAR) e risponde alle tue domande."
  },
  "consulto": {
   "label": "Consulto tra specialisti",
   "desc": "Gioco di ruolo: tu sei un collega di un altro reparto o un medico di base che chiede un consulto cardiologico; lo studente discute il caso, il ragionamento diagnostico e le opzioni."
  },
  "consenso": {
   "label": "Consenso informato",
   "desc": "Gioco di ruolo: tu sei un paziente che deve decidere su una procedura (coronarografia, ablazione, impianto di pacemaker); lo studente spiega procedura, rischi e alternative in modo comprensibile e raccoglie il consenso."
  },
  "emergenza": {
   "label": "Emergenza in pronto soccorso",
   "desc": "Gioco di ruolo: tu sei un infermiere o un paramedico che porta un paziente con sospetta sindrome coronarica acuta; lo studente, medico, dà istruzioni rapide e chiare e chiede le informazioni essenziali."
  },
  "congresso": {
   "label": "Presentazione a un congresso",
   "desc": "Gioco di ruolo: tu sei il presidente di sessione o un uditore a un congresso di cardiologia; lo studente presenta un caso o uno studio e risponde alle domande."
  }
 },
 "grammar": [
  {
   "id": "clinica",
   "title": "Linguaggio clinico",
   "topics": [
    {
     "id": "anamnesi-domande",
     "title": "Fare l'anamnesi: forme interrogative e domande indirette (Have you ever…? Can you tell me…?)"
    },
    {
     "id": "descrivere-sintomi",
     "title": "Descrivere sintomi e dolore (sharp, dull, crushing, radiating; sequenza OPQRST)"
    },
    {
     "id": "tempi-clinici",
     "title": "Tempi verbali nella storia clinica (past simple, present perfect, past perfect)"
    },
    {
     "id": "istruzioni-terapia",
     "title": "Istruzioni e terapia: imperativo, should e must, \"make sure you…\""
    },
    {
     "id": "spiegare-paziente",
     "title": "Spiegare al paziente: linguaggio semplice, analogie e equivalenti colloquiali"
    },
    {
     "id": "rischi-probabilita",
     "title": "Rischi e probabilità (may, might, likely, in X% of cases)"
    },
    {
     "id": "cattive-notizie",
     "title": "Comunicare cattive notizie con empatia (SPIKES)"
    }
   ]
  },
  {
   "id": "scritto",
   "title": "Scrittura medica",
   "topics": [
    {
     "id": "case-report",
     "title": "Case report e storia clinica: passato e passivo"
    },
    {
     "id": "lettera-dimissione",
     "title": "Lettera di dimissione e lettera al medico di base: stile telegrafico e nominalizzazioni"
    },
    {
     "id": "soap-sbar",
     "title": "Presentare un paziente: SOAP, SBAR e consegne"
    },
    {
     "id": "risultati-studi",
     "title": "Riportare risultati: statistica e verbi (was associated with, led to, was observed)"
    },
    {
     "id": "hedging",
     "title": "Prudenza e certezza nel linguaggio scientifico (suggest, appear, may indicate)"
    },
    {
     "id": "abstract-struttura",
     "title": "Abstract e articoli scientifici: struttura IMRaD e connettori"
    }
   ]
  },
  {
   "id": "terminologia",
   "title": "Terminologia e morfologia",
   "topics": [
    {
     "id": "radici-greco-latine",
     "title": "Radici, prefissi e suffissi (cardio-, brady-, -itis, -pathy, -ectomy)"
    },
    {
     "id": "plurali-latini",
     "title": "Plurali di origine greca e latina (atrium → atria, stenosis → stenoses)"
    },
    {
     "id": "abbreviazioni",
     "title": "Abbreviazioni, acronimi ed eponimi (STEMI, LVEF, Frank-Starling)"
    },
    {
     "id": "registro-tecnico",
     "title": "Termine tecnico o termine per il paziente (heart attack / myocardial infarction)"
    },
    {
     "id": "falsi-amici-med",
     "title": "Falsi amici e trappole per l'italiano (syncope, infarct, pressure, \"ictus\" = stroke)"
    },
    {
     "id": "misure-unita",
     "title": "Numeri, unità e misure (mmHg, mg/dL, 55%, \"a systolic pressure of 140\")"
    }
   ]
  },
  {
   "id": "grammatica-med",
   "title": "Grammatica essenziale per il linguaggio medico",
   "topics": [
    {
     "id": "passivo-med",
     "title": "Il passivo nel linguaggio medico (was admitted, was given, has been started)"
    },
    {
     "id": "condizionali-med",
     "title": "Condizionali e ipotesi cliniche (if the troponin were negative…)"
    },
    {
     "id": "relative-med",
     "title": "Frasi relative e participi (a patient presenting with…, a drug used to…)"
    },
    {
     "id": "modali-med",
     "title": "Modali nella pratica clinica (should, must, may, can)"
    },
    {
     "id": "preposizioni-med",
     "title": "Preposizioni cliniche (on admission, in the setting of, due to, with respect to)"
    },
    {
     "id": "connettori-med",
     "title": "Connettori del ragionamento clinico (therefore, however, whereas, given that)"
    },
    {
     "id": "articoli-med",
     "title": "Articoli e nomi non numerabili nel linguaggio medico (the patient, no article with diseases)"
    }
   ]
  }
 ],
 "vocabThemes": [
  {
   "id": "anatomia",
   "title": "Anatomia del cuore e dei vasi",
   "hint": "camere, valvole, strati, coronarie, grandi vasi, sistema di conduzione; esempi di termini da includere: left ventricle, mitral valve, left anterior descending artery, pericardium, sinoatrial node, aortic root"
  },
  {
   "id": "fisiologia",
   "title": "Fisiologia cardiovascolare",
   "hint": "ciclo cardiaco, gittata, pre e postcarico, contrattilità, pressione, frequenza; esempi di termini da includere: cardiac output, preload, afterload, stroke volume, contractility, ejection fraction"
  },
  {
   "id": "sintomi",
   "title": "Sintomi e segni cardiologici",
   "hint": "dolore toracico, dispnea, palpitazioni, sincope, edema, cianosi, affaticabilità; esempi di termini da includere: chest pain, shortness of breath, palpitations, syncope, orthopnoea, ankle swelling"
  },
  {
   "id": "anamnesi",
   "title": "Anamnesi e domande al paziente",
   "hint": "insorgenza, durata, irradiazione, fattori scatenanti e allevianti, familiarità, farmaci, abitudini; esempi di termini da includere: onset, radiation, exertional, relieving factors, family history, \"Does the pain spread to your arm?\""
  },
  {
   "id": "esame-obiettivo",
   "title": "Esame obiettivo e auscultazione",
   "hint": "ispezione, palpazione, polsi, toni cardiaci, soffi, reperti polmonari ed edemi; esempi di termini da includere: jugular venous pressure, murmur, gallop rhythm, peripheral pulses, crackles, auscultation"
  },
  {
   "id": "parametri-vitali",
   "title": "Parametri vitali e misurazioni",
   "hint": "pressione, frequenza, saturazione, peso, diuresi, unità di misura; esempi di termini da includere: blood pressure, heart rate, oxygen saturation, mmHg, bpm, fluid balance"
  },
  {
   "id": "ecg",
   "title": "ECG e ritmi",
   "hint": "onde, intervalli, segmento ST, blocchi, derivazioni, descrizione del tracciato; esempi di termini da includere: P wave, QRS complex, ST elevation, bundle branch block, PR interval, lead"
  },
  {
   "id": "imaging",
   "title": "Ecocardiografia e imaging",
   "hint": "eco, frazione di eiezione, TC, RM, scintigrafia, coronarografia, test da sforzo; esempi di termini da includere: echocardiogram, ejection fraction, cardiac MRI, coronary angiography, CT angiogram, stress test"
  },
  {
   "id": "laboratorio",
   "title": "Laboratorio e biomarcatori",
   "hint": "troponina, BNP, D-dimero, assetto lipidico, creatinina, elettroliti, INR; esempi di termini da includere: troponin, BNP, lipid profile, creatinine, INR, electrolytes"
  },
  {
   "id": "cardiopatia-ischemica",
   "title": "Cardiopatia ischemica e sindromi coronariche",
   "hint": "angina, STEMI, NSTEMI, aterosclerosi, stenosi, occlusione, riperfusione; esempi di termini da includere: unstable angina, STEMI, atherosclerotic plaque, occlusion, reperfusion, culprit lesion"
  },
  {
   "id": "scompenso",
   "title": "Scompenso cardiaco",
   "hint": "frazione di eiezione ridotta o conservata, congestione, diuretici, classe NYHA, riacutizzazione; esempi di termini da includere: heart failure with reduced ejection fraction, congestion, diuretics, NYHA class, decompensation, guideline-directed therapy"
  },
  {
   "id": "aritmie",
   "title": "Aritmie",
   "hint": "fibrillazione atriale, tachicardia, flutter, bradicardia, blocchi, cardioversione, ablazione; esempi di termini da includere: atrial fibrillation, ventricular tachycardia, cardioversion, ablation, bradycardia, heart block"
  },
  {
   "id": "valvulopatie",
   "title": "Valvulopatie",
   "hint": "stenosi aortica, insufficienza mitralica, rigurgito, protesi, endocardite; esempi di termini da includere: aortic stenosis, mitral regurgitation, prosthetic valve, endocarditis, murmur, annulus"
  },
  {
   "id": "ipertensione-lipidi",
   "title": "Ipertensione e dislipidemie",
   "hint": "ipertensione, dislipidemia, statine, obiettivi pressori, rischio cardiovascolare; esempi di termini da includere: hypertension, dyslipidaemia, statin, LDL cholesterol, blood pressure target, cardiovascular risk"
  },
  {
   "id": "miocardio-pericardio",
   "title": "Cardiomiopatie, miocarditi e pericardite",
   "hint": "cardiomiopatia ipertrofica e dilatativa, miocardite, pericardite, versamento, tamponamento; esempi di termini da includere: hypertrophic cardiomyopathy, myocarditis, pericarditis, pericardial effusion, tamponade, dilated cardiomyopathy"
  },
  {
   "id": "congenite",
   "title": "Cardiopatie congenite",
   "hint": "difetto interatriale, pervietà del forame ovale, tetralogia di Fallot, coartazione, shunt, cianosi; esempi di termini da includere: atrial septal defect, patent foramen ovale, tetralogy of Fallot, coarctation, shunt, cyanosis"
  },
  {
   "id": "vascolare",
   "title": "Malattie vascolari e tromboembolismo",
   "hint": "dissezione aortica, aneurisma, trombosi venosa profonda, embolia polmonare, arteriopatia periferica; esempi di termini da includere: aortic dissection, aneurysm, deep vein thrombosis, pulmonary embolism, claudication, peripheral artery disease"
  },
  {
   "id": "farmaci",
   "title": "Farmaci cardiovascolari",
   "hint": "beta-bloccanti, ACE-inibitori, sartani, calcio-antagonisti, diuretici, nitrati, antiaritmici, statine, SGLT2; esempi di termini da includere: beta-blocker, ACE inhibitor, angiotensin receptor blocker, calcium channel blocker, loop diuretic, nitrate"
  },
  {
   "id": "anticoagulanti",
   "title": "Anticoagulanti e antiaggreganti",
   "hint": "warfarin, anticoagulanti orali diretti, eparina, aspirina, clopidogrel, INR, rischio emorragico; esempi di termini da includere: warfarin, direct oral anticoagulant, heparin, antiplatelet, bleeding risk, INR"
  },
  {
   "id": "procedure",
   "title": "Procedure interventistiche",
   "hint": "PCI, stent, angioplastica, TAVI, ablazione, cateterismo cardiaco, biopsia; esempi di termini da includere: percutaneous coronary intervention, stent, angioplasty, TAVI, catheter ablation, right heart catheterisation"
  },
  {
   "id": "dispositivi-chirurgia",
   "title": "Dispositivi e cardiochirurgia",
   "hint": "pacemaker, ICD, CRT, bypass, sostituzione valvolare, assistenza ventricolare, ECMO; esempi di termini da includere: pacemaker, ICD, cardiac resynchronisation therapy, coronary artery bypass graft, valve replacement, ECMO"
  },
  {
   "id": "emergenza",
   "title": "Emergenza e rianimazione",
   "hint": "arresto cardiaco, RCP, defibrillazione, shock, triage, algoritmi ACLS; esempi di termini da includere: cardiac arrest, CPR, defibrillation, cardiogenic shock, triage, ACLS"
  },
  {
   "id": "terapia-intensiva",
   "title": "Terapia intensiva cardiologica e reparto",
   "hint": "UTIC, monitoraggio, inotropi, ventilazione, dimissione, follow-up; esempi di termini da includere: coronary care unit, inotropes, haemodynamic monitoring, ventilator, discharge, follow-up"
  },
  {
   "id": "prevenzione",
   "title": "Prevenzione e fattori di rischio",
   "hint": "fumo, diabete, obesità, sedentarietà, dieta, riabilitazione cardiologica, prevenzione secondaria; esempi di termini da includere: risk factors, smoking cessation, cardiac rehabilitation, sedentary lifestyle, diabetes, secondary prevention"
  },
  {
   "id": "comunicazione",
   "title": "Comunicare con il paziente",
   "hint": "spiegare la diagnosi, consenso informato, rischi e benefici, cattive notizie, aderenza alla terapia; esempi di termini da includere: informed consent, risks and benefits, breaking bad news, adherence, \"I'd like to explain…\", reassurance"
  },
  {
   "id": "ricerca",
   "title": "Ricerca, trial e statistica",
   "hint": "trial randomizzato, endpoint, hazard ratio, intervallo di confidenza, coorte, meta-analisi, valore di p; esempi di termini da includere: randomised controlled trial, endpoint, hazard ratio, confidence interval, cohort, meta-analysis"
  },
  {
   "id": "pubblicazione",
   "title": "Scrittura scientifica e congressi",
   "hint": "abstract, metodi, risultati, discussione, limiti, poster, relatore, revisione tra pari; esempi di termini da includere: abstract, methods, findings, limitations, poster, peer review"
  },
  {
   "id": "abbreviazioni",
   "title": "Abbreviazioni, eponimi e radici greco-latine",
   "hint": "sigle usate nella lingua, prefissi e suffissi, eponimi; esempi di termini da includere: MI, LVEF, CAD, AF, CABG, -itis, -ectomy, -plasty"
  }
 ],
 "writingPrompts": [
  "Scrivi una lettera di dimissione per un paziente ricoverato per scompenso cardiaco: diagnosi, decorso, terapia alla dimissione e controlli (8-10 frasi).",
  "Scrivi una lettera al medico di base dopo una visita cardiologica: reperti, esami, impressione diagnostica e raccomandazioni (8-10 frasi).",
  "Scrivi l'abstract di un case report su un caso cardiologico insolito (100-150 parole).",
  "Spiega a un paziente, in linguaggio semplice, che cos'è la fibrillazione atriale e perché serve la terapia anticoagulante (6-8 frasi).",
  "Scrivi una nota SOAP per un paziente con dolore toracico in pronto soccorso.",
  "Scrivi una richiesta di consulto cardiologico per un paziente ricoverato in un altro reparto (5-6 frasi).",
  "Riassumi in 6-8 frasi i risultati principali di uno studio clinico su un farmaco cardiovascolare (puoi inventare i dati).",
  "Scrivi il testo con cui spieghi a un paziente la coronarografia: scopo, procedura, rischi e alternative (8-10 frasi).",
  "Scrivi un'e-mail a un collega di un altro ospedale per organizzare il trasferimento di un paziente con infarto.",
  "Descrivi un ECG con ritmo sinusale e sopraslivellamento ST in sede inferiore, come lo scriveresti in cartella (5-6 frasi).",
  "Scrivi un piano terapeutico per un paziente con ipertensione e dislipidemia, con obiettivi e controlli (6-8 frasi).",
  "Scrivi una breve relazione su un evento avverso avvenuto in reparto (incident report, 6-8 frasi).",
  "Scrivi l'abstract per un congresso di cardiologia: scopo, metodi, risultati e conclusioni (150 parole).",
  "Rispondi a un revisore che critica la numerosità del campione del tuo studio (6-8 frasi)."
 ],
 "topics": [
  "un caso clinico interessante che hai seguito",
  "come è cambiata la cardiologia negli ultimi dieci anni",
  "un congresso a cui vorresti partecipare",
  "l'intelligenza artificiale nella lettura dell'ECG",
  "un turno di guardia difficile",
  "cosa consiglieresti a un giovane che vuole fare il cardiologo",
  "la prevenzione: cosa dovrebbero fare tutti per il cuore",
  "una pubblicazione recente che ti ha colpito",
  "il rapporto con i pazienti anziani",
  "telemedicina e monitoraggio a distanza",
  "burnout e equilibrio tra lavoro e vita privata",
  "lavorare all'estero come medico",
  "le linee guida: seguirle sempre o adattarle?",
  "la medicina di genere in cardiologia",
  "la riabilitazione cardiologica",
  "come spieghi un rischio a un paziente",
  "il lavoro in équipe con infermieri e colleghi",
  "le differenze tra il sistema sanitario italiano e quello di altri paesi",
  "la formazione dei giovani medici",
  "un errore da cui hai imparato",
  "la ricerca clinica e i trial",
  "i dispositivi indossabili e la salute del cuore",
  "l'attesa per gli esami e le liste d'attesa",
  "un paziente che non dimenticherai"
 ],
 "contexts": [
  "in pronto soccorso",
  "in reparto di cardiologia",
  "in ambulatorio",
  "in sala di emodinamica",
  "in terapia intensiva cardiologica",
  "durante il giro visite",
  "durante le consegne",
  "in una riunione multidisciplinare",
  "a un congresso di cardiologia",
  "in una lettera di dimissione",
  "in un case report",
  "nella lettura di un ECG",
  "durante un ecocardiogramma",
  "durante un colloquio con i familiari",
  "al telefono con il medico di base",
  "nella spiegazione di una terapia",
  "in un consenso informato",
  "nella revisione di un articolo",
  "in un corso di rianimazione",
  "in un ambulatorio per lo scompenso",
  "in un ambulatorio di aritmologia",
  "in una riabilitazione cardiologica",
  "in una visita pre-operatoria",
  "in una telefonata notturna di guardia"
 ],
 "moves": [
  "racconta in una frase un tuo caso clinico (inventato ma plausibile) e chiedi allo studente come lo gestirebbe",
  "chiedi di spiegare a un paziente un termine tecnico in parole semplici",
  "chiedi come direbbe la stessa cosa a un collega e a un paziente (registro tecnico contro colloquiale)",
  "fai una domanda su un esame diagnostico e sulle sue indicazioni",
  "chiedi di confrontare due farmaci o due strategie terapeutiche",
  "chiedi una diagnosi differenziale a partire da un sintomo",
  "chiedi di descrivere una procedura passo per passo",
  "esprimi un'opinione clinica discutibile e chiedi se è d'accordo, con motivazioni",
  "chiedi l'interpretazione di un reperto (ECG, eco, esami di laboratorio)",
  "chiedi come comunicherebbe una cattiva notizia a un paziente",
  "chiedi cosa cambierebbe nell'organizzazione del reparto",
  "chiedi di commentare il risultato di uno studio"
 ],
 "twists": {
  "anamnesi": [
   "il paziente è ansioso e minimizza i sintomi",
   "il dolore compare solo sotto sforzo",
   "il paziente prende molti farmaci e non ricorda i nomi",
   "il paziente ha familiarità per morte improvvisa",
   "il paziente è anziano e sente poco",
   "i sintomi sono comparsi di notte"
  ],
  "visita": [
   "il paziente non ha assunto la terapia con regolarità",
   "gli esami mostrano un peggioramento della frazione di eiezione",
   "il paziente ha effetti collaterali da un farmaco",
   "il paziente vuole smettere l'anticoagulante",
   "la pressione è fuori controllo",
   "il paziente vuole tornare a fare sport"
  ],
  "reparto": [
   "il paziente si è aggravato durante la notte",
   "mancano alcuni esami nella cartella",
   "il paziente è in attesa di un intervento",
   "c'è un dubbio sulla terapia anticoagulante",
   "la dimissione è prevista per domani",
   "la famiglia chiede spiegazioni"
  ],
  "consulto": [
   "il medico di base sospetta uno scompenso",
   "il caso è una sincope di origine incerta",
   "il paziente ha un soffio nuovo",
   "c'è un disaccordo sulla strategia terapeutica",
   "il paziente è giovane con una familiarità importante",
   "serve decidere tra terapia medica e intervento"
  ],
  "consenso": [
   "il paziente ha paura dell'anestesia",
   "il paziente vuole una seconda opinione",
   "il paziente non capisce i termini tecnici",
   "il rischio di complicanze è significativo",
   "il paziente è in dubbio tra due opzioni",
   "un familiare si oppone alla procedura"
  ],
  "emergenza": [
   "il paziente ha un dolore toracico con sudorazione",
   "l'ECG mostra un sopraslivellamento del tratto ST",
   "il paziente è in shock",
   "il paziente prende anticoagulanti",
   "c'è un'aritmia ventricolare",
   "il paziente perde conoscenza"
  ],
  "congresso": [
   "un uditore contesta la scelta dell'endpoint",
   "una domanda sulla numerosità del campione",
   "il tempo a disposizione è ridotto",
   "una domanda sui limiti dello studio",
   "il presidente chiede le implicazioni cliniche",
   "una domanda sul follow-up"
  ]
 },
 "levels": [
  "B1",
  "B1+",
  "B2",
  "C1"
 ],
 "levelLabel": {
  "B1": "B1",
  "B1+": "B1+",
  "B2": "B2 (upper-intermediate)",
  "C1": "C1 (avanzato)"
 },
 "levelText": {
  "B1": "livello B1 (medico): se la cava con l'anamnesi di base e frasi cliniche semplici, ma ha un lessico tecnico limitato e fatica a presentare un caso o a scrivere",
  "B1+": "livello B1+ (medico): comunica in modo comprensibile nella pratica clinica; va spinto su terminologia tecnica della cardiologia, precisione dei termini e testi più strutturati",
  "B2": "livello B2 (medico, upper-intermediate): comunica con scioltezza con colleghi e pazienti; va spinto verso il C1 su terminologia tecnica della cardiologia, registro (tecnico o per il paziente), scrittura scientifica e presentazione dei casi",
  "C1": "livello C1 (medico, avanzato): si esprime con precisione e naturalezza; va spinto su sfumature, registro, precisione del lessico scientifico, comunicazione di situazioni difficili e discussione ad alto livello"
 },
 "tracks": {
  "B1": [
   {
    "title": "Anamnesi e sintomi",
    "focus": "raccogliere l'anamnesi e descrivere sintomi cardiologici (dolore toracico, dispnea, palpitazioni, sincope) — livello B1: termini essenziali e frasi semplici, con molto supporto",
    "topics": [
     "anamnesi-domande",
     "descrivere-sintomi",
     "tempi-clinici"
    ]
   },
   {
    "title": "Esame obiettivo, parametri e terminologia",
    "focus": "esame obiettivo, auscultazione, parametri vitali, unità di misura; radici greco-latine e registro tecnico contro registro per il paziente — livello B1: termini essenziali e frasi semplici, con molto supporto",
    "topics": [
     "registro-tecnico",
     "misure-unita",
     "radici-greco-latine"
    ]
   },
   {
    "title": "ECG, imaging e laboratorio",
    "focus": "descrivere un ECG, un ecocardiogramma e gli esami di laboratorio; abbreviazioni e termini di origine greco-latina — livello B1: termini essenziali e frasi semplici, con molto supporto",
    "topics": [
     "abbreviazioni",
     "plurali-latini",
     "relative-med"
    ]
   },
   {
    "title": "Cardiopatia ischemica ed emergenza",
    "focus": "sindromi coronariche, istruzioni rapide e consegne in emergenza, SOAP e SBAR — livello B1: termini essenziali e frasi semplici, con molto supporto",
    "topics": [
     "istruzioni-terapia",
     "modali-med",
     "soap-sbar"
    ]
   },
   {
    "title": "Scompenso, aritmie e farmaci",
    "focus": "scompenso cardiaco, aritmie, terapia farmacologica: ragionamento clinico, ipotesi e connettori — livello B1: termini essenziali e frasi semplici, con molto supporto",
    "topics": [
     "condizionali-med",
     "connettori-med",
     "preposizioni-med"
    ]
   },
   {
    "title": "Valvulopatie, procedure e dispositivi",
    "focus": "valvulopatie, procedure interventistiche, dispositivi e cardiochirurgia; case report e falsi amici — livello B1: termini essenziali e frasi semplici, con molto supporto",
    "topics": [
     "passivo-med",
     "case-report",
     "falsi-amici-med"
    ]
   },
   {
    "title": "Comunicare con il paziente e consenso",
    "focus": "spiegare diagnosi e procedure, rischi e probabilità, consenso informato, cattive notizie — livello B1: termini essenziali e frasi semplici, con molto supporto",
    "topics": [
     "spiegare-paziente",
     "rischi-probabilita",
     "cattive-notizie"
    ]
   },
   {
    "title": "Presentare un caso e leggere la letteratura",
    "focus": "presentare un caso a un congresso, leggere e riportare risultati di studi, abstract e prudenza scientifica — livello B1: termini essenziali e frasi semplici, con molto supporto",
    "topics": [
     "risultati-studi",
     "hedging",
     "abstract-struttura"
    ]
   }
  ],
  "B1+": [
   {
    "title": "Anamnesi e sintomi",
    "focus": "raccogliere l'anamnesi e descrivere sintomi cardiologici (dolore toracico, dispnea, palpitazioni, sincope) — livello B1+: termini più precisi e frasi collegate; prime presentazioni strutturate",
    "topics": [
     "anamnesi-domande",
     "descrivere-sintomi",
     "tempi-clinici"
    ]
   },
   {
    "title": "Esame obiettivo, parametri e terminologia",
    "focus": "esame obiettivo, auscultazione, parametri vitali, unità di misura; radici greco-latine e registro tecnico contro registro per il paziente — livello B1+: termini più precisi e frasi collegate; prime presentazioni strutturate",
    "topics": [
     "registro-tecnico",
     "misure-unita",
     "radici-greco-latine"
    ]
   },
   {
    "title": "ECG, imaging e laboratorio",
    "focus": "descrivere un ECG, un ecocardiogramma e gli esami di laboratorio; abbreviazioni e termini di origine greco-latina — livello B1+: termini più precisi e frasi collegate; prime presentazioni strutturate",
    "topics": [
     "abbreviazioni",
     "plurali-latini",
     "relative-med"
    ]
   },
   {
    "title": "Cardiopatia ischemica ed emergenza",
    "focus": "sindromi coronariche, istruzioni rapide e consegne in emergenza, SOAP e SBAR — livello B1+: termini più precisi e frasi collegate; prime presentazioni strutturate",
    "topics": [
     "istruzioni-terapia",
     "modali-med",
     "soap-sbar"
    ]
   },
   {
    "title": "Scompenso, aritmie e farmaci",
    "focus": "scompenso cardiaco, aritmie, terapia farmacologica: ragionamento clinico, ipotesi e connettori — livello B1+: termini più precisi e frasi collegate; prime presentazioni strutturate",
    "topics": [
     "condizionali-med",
     "connettori-med",
     "preposizioni-med"
    ]
   },
   {
    "title": "Valvulopatie, procedure e dispositivi",
    "focus": "valvulopatie, procedure interventistiche, dispositivi e cardiochirurgia; case report e falsi amici — livello B1+: termini più precisi e frasi collegate; prime presentazioni strutturate",
    "topics": [
     "passivo-med",
     "case-report",
     "falsi-amici-med"
    ]
   },
   {
    "title": "Comunicare con il paziente e consenso",
    "focus": "spiegare diagnosi e procedure, rischi e probabilità, consenso informato, cattive notizie — livello B1+: termini più precisi e frasi collegate; prime presentazioni strutturate",
    "topics": [
     "spiegare-paziente",
     "rischi-probabilita",
     "cattive-notizie"
    ]
   },
   {
    "title": "Presentare un caso e leggere la letteratura",
    "focus": "presentare un caso a un congresso, leggere e riportare risultati di studi, abstract e prudenza scientifica — livello B1+: termini più precisi e frasi collegate; prime presentazioni strutturate",
    "topics": [
     "risultati-studi",
     "hedging",
     "abstract-struttura"
    ]
   }
  ],
  "B2": [
   {
    "title": "Anamnesi e sintomi",
    "focus": "raccogliere l'anamnesi e descrivere sintomi cardiologici (dolore toracico, dispnea, palpitazioni, sincope) — livello B2: terminologia precisa, registro adeguato all'interlocutore e testi più lunghi",
    "topics": [
     "anamnesi-domande",
     "descrivere-sintomi",
     "tempi-clinici"
    ]
   },
   {
    "title": "Esame obiettivo, parametri e terminologia",
    "focus": "esame obiettivo, auscultazione, parametri vitali, unità di misura; radici greco-latine e registro tecnico contro registro per il paziente — livello B2: terminologia precisa, registro adeguato all'interlocutore e testi più lunghi",
    "topics": [
     "registro-tecnico",
     "misure-unita",
     "radici-greco-latine"
    ]
   },
   {
    "title": "ECG, imaging e laboratorio",
    "focus": "descrivere un ECG, un ecocardiogramma e gli esami di laboratorio; abbreviazioni e termini di origine greco-latina — livello B2: terminologia precisa, registro adeguato all'interlocutore e testi più lunghi",
    "topics": [
     "abbreviazioni",
     "plurali-latini",
     "relative-med"
    ]
   },
   {
    "title": "Cardiopatia ischemica ed emergenza",
    "focus": "sindromi coronariche, istruzioni rapide e consegne in emergenza, SOAP e SBAR — livello B2: terminologia precisa, registro adeguato all'interlocutore e testi più lunghi",
    "topics": [
     "istruzioni-terapia",
     "modali-med",
     "soap-sbar"
    ]
   },
   {
    "title": "Scompenso, aritmie e farmaci",
    "focus": "scompenso cardiaco, aritmie, terapia farmacologica: ragionamento clinico, ipotesi e connettori — livello B2: terminologia precisa, registro adeguato all'interlocutore e testi più lunghi",
    "topics": [
     "condizionali-med",
     "connettori-med",
     "preposizioni-med"
    ]
   },
   {
    "title": "Valvulopatie, procedure e dispositivi",
    "focus": "valvulopatie, procedure interventistiche, dispositivi e cardiochirurgia; case report e falsi amici — livello B2: terminologia precisa, registro adeguato all'interlocutore e testi più lunghi",
    "topics": [
     "passivo-med",
     "case-report",
     "falsi-amici-med"
    ]
   },
   {
    "title": "Comunicare con il paziente e consenso",
    "focus": "spiegare diagnosi e procedure, rischi e probabilità, consenso informato, cattive notizie — livello B2: terminologia precisa, registro adeguato all'interlocutore e testi più lunghi",
    "topics": [
     "spiegare-paziente",
     "rischi-probabilita",
     "cattive-notizie"
    ]
   },
   {
    "title": "Presentare un caso e leggere la letteratura",
    "focus": "presentare un caso a un congresso, leggere e riportare risultati di studi, abstract e prudenza scientifica — livello B2: terminologia precisa, registro adeguato all'interlocutore e testi più lunghi",
    "topics": [
     "risultati-studi",
     "hedging",
     "abstract-struttura"
    ]
   }
  ],
  "C1": [
   {
    "title": "Anamnesi e sintomi",
    "focus": "raccogliere l'anamnesi e descrivere sintomi cardiologici (dolore toracico, dispnea, palpitazioni, sincope) — livello C1: sfumature, registro, fluidità da specialista e precisione del linguaggio scientifico",
    "topics": [
     "anamnesi-domande",
     "descrivere-sintomi",
     "tempi-clinici"
    ]
   },
   {
    "title": "Esame obiettivo, parametri e terminologia",
    "focus": "esame obiettivo, auscultazione, parametri vitali, unità di misura; radici greco-latine e registro tecnico contro registro per il paziente — livello C1: sfumature, registro, fluidità da specialista e precisione del linguaggio scientifico",
    "topics": [
     "registro-tecnico",
     "misure-unita",
     "radici-greco-latine"
    ]
   },
   {
    "title": "ECG, imaging e laboratorio",
    "focus": "descrivere un ECG, un ecocardiogramma e gli esami di laboratorio; abbreviazioni e termini di origine greco-latina — livello C1: sfumature, registro, fluidità da specialista e precisione del linguaggio scientifico",
    "topics": [
     "abbreviazioni",
     "plurali-latini",
     "relative-med"
    ]
   },
   {
    "title": "Cardiopatia ischemica ed emergenza",
    "focus": "sindromi coronariche, istruzioni rapide e consegne in emergenza, SOAP e SBAR — livello C1: sfumature, registro, fluidità da specialista e precisione del linguaggio scientifico",
    "topics": [
     "istruzioni-terapia",
     "modali-med",
     "soap-sbar"
    ]
   },
   {
    "title": "Scompenso, aritmie e farmaci",
    "focus": "scompenso cardiaco, aritmie, terapia farmacologica: ragionamento clinico, ipotesi e connettori — livello C1: sfumature, registro, fluidità da specialista e precisione del linguaggio scientifico",
    "topics": [
     "condizionali-med",
     "connettori-med",
     "preposizioni-med"
    ]
   },
   {
    "title": "Valvulopatie, procedure e dispositivi",
    "focus": "valvulopatie, procedure interventistiche, dispositivi e cardiochirurgia; case report e falsi amici — livello C1: sfumature, registro, fluidità da specialista e precisione del linguaggio scientifico",
    "topics": [
     "passivo-med",
     "case-report",
     "falsi-amici-med"
    ]
   },
   {
    "title": "Comunicare con il paziente e consenso",
    "focus": "spiegare diagnosi e procedure, rischi e probabilità, consenso informato, cattive notizie — livello C1: sfumature, registro, fluidità da specialista e precisione del linguaggio scientifico",
    "topics": [
     "spiegare-paziente",
     "rischi-probabilita",
     "cattive-notizie"
    ]
   },
   {
    "title": "Presentare un caso e leggere la letteratura",
    "focus": "presentare un caso a un congresso, leggere e riportare risultati di studi, abstract e prudenza scientifica — livello C1: sfumature, registro, fluidità da specialista e precisione del linguaggio scientifico",
    "topics": [
     "risultati-studi",
     "hedging",
     "abstract-struttura"
    ]
   }
  ]
 },
 "tutors": [
  {
   "id": "sarah",
   "name": "Sarah",
   "avatar": "👩‍⚕️",
   "age": 44,
   "from": "Manchester",
   "job": "cardiologa (consultant)",
   "trait": "precisa, diretta e incoraggiante: ti fa ragionare come in un giro visite",
   "interests": "aritmologia, running, serie TV mediche",
   "style": "tono professionale ma cordiale; usi terminologia clinica corretta e la spieghi quando serve"
  },
  {
   "id": "james",
   "name": "James",
   "avatar": "👨‍⚕️",
   "age": 33,
   "from": "Londra",
   "job": "specializzando in cardiologia",
   "trait": "energico, curioso e alla mano: parla di casi e di guardie",
   "interests": "ecocardiografia, calcio, podcast di medicina",
   "style": "tono colloquiale tra colleghi, con terminologia tecnica e qualche abbreviazione d'uso"
  },
  {
   "id": "helen",
   "name": "Helen",
   "avatar": "👩‍🔬",
   "age": 52,
   "from": "Leeds",
   "job": "infermiera specializzata in cardiologia",
   "trait": "paziente, pratica e attenta alla comunicazione con i pazienti",
   "interests": "riabilitazione cardiologica, giardinaggio, lettura",
   "style": "tono caldo e chiaro; mostra come si spiegano i termini ai pazienti"
  },
  {
   "id": "andrew",
   "name": "Andrew",
   "avatar": "🧑‍🏫",
   "age": 61,
   "from": "Edimburgo",
   "job": "professore di cardiologia e ricercatore",
   "trait": "rigoroso, ironico e molto preparato: ama la precisione dei termini",
   "interests": "trial clinici, scrittura scientifica, rugby",
   "style": "tono accademico con un po' di ironia; cura registro formale e lessico scientifico"
  }
 ]
};
