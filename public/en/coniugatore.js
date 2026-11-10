// Motore di coniugazione dell'inglese (britannico): forme calcolate dalle regole e dai verbi irregolari. Le forme irregolari si evidenziano
// confrontando con la coniugazione regolare. Un verbo che non è in elenco viene coniugato come regolare.
// Stessa interfaccia del motore dello spagnolo e del portoghese (SPV), così le pagine in /app/ funzionano per tutte le lingue.
var SPV = (function () {
  'use strict';

  var PERSONS = ['I', 'you', 'he / she / it', 'we', 'you (plural)', 'they'];
  var IMP_PERSONS = ['you', 'we (let\'s)'];
  var PRONOUNS = ['I', 'you', 'he', 'we', 'you', 'they'];
  var BE_PRES = ['am', 'are', 'is', 'are', 'are', 'are'];
  var BE_PAST = ['was', 'were', 'was', 'were', 'were', 'were'];
  var HAVE_PRES = ['have', 'have', 'has', 'have', 'have', 'have'];
  var V = {};   // infinito -> { inf, it, tags[], irr{} }

  function def(inf, it, tags, irr) { V[inf] = { inf: inf, it: it, tags: tags ? tags.split(' ') : [], irr: irr || {} }; }

  // ---------------------------------------------------------------- regole di formazione
  // Raddoppio della consonante finale: verbi di una sola sillaba che finiscono in vocale + consonante (stop, plan), più quelli segnati "dbl".
  function doubles(inf, tags) {
    if (tags.indexOf('dbl') >= 0) return true;
    return /^[^aeiou]*[aeiou][^aeiouwxy]$/.test(inf);
  }
  function third(inf) {
    if (/(s|x|z|ch|sh|o)$/.test(inf)) return inf + 'es';
    if (/[^aeiou]y$/.test(inf)) return inf.slice(0, -1) + 'ies';
    return inf + 's';
  }
  function ingForm(inf, tags) {
    if (/ie$/.test(inf)) return inf.slice(0, -2) + 'ying';
    if (/(ee|oe|ye)$/.test(inf)) return inf + 'ing';
    if (/e$/.test(inf)) return inf.slice(0, -1) + 'ing';
    if (doubles(inf, tags)) return inf + inf.slice(-1) + 'ing';
    return inf + 'ing';
  }
  function pastForm(inf, tags) {
    if (/e$/.test(inf)) return inf + 'd';
    if (/[^aeiou]y$/.test(inf)) return inf.slice(0, -1) + 'ied';
    if (doubles(inf, tags)) return inf + inf.slice(-1) + 'ed';
    return inf + 'ed';
  }

  function conj(inf, plain) {
    var e = V[inf] || null;
    var irr = (plain || !e) ? {} : e.irr;
    var tags = (plain || !e) ? [] : e.tags;
    var base = inf;
    var past = irr.past || pastForm(inf, tags);
    var pp = irr.pp || (irr.past && !Array.isArray(irr.past) ? irr.past : pastForm(inf, tags));
    var thirdF = irr.third || third(inf);
    var ingF = irr.ing || ingForm(inf, tags);
    var out = { inf: inf, it: e ? e.it : '', known: !!e, cls: '' };

    function pastAt(p) { return Array.isArray(past) ? past[p] : past; }
    function each(fn) { var r = []; for (var p = 0; p < 6; p++) r.push(fn(p)); return r; }

    out.presente = each(function (p) { return irr.pres ? irr.pres[p] : (p === 2 ? thirdF : base); });
    out.presenteContinuo = each(function (p) { return BE_PRES[p] + ' ' + ingF; });
    out.passato = each(pastAt);
    out.passatoContinuo = each(function (p) { return BE_PAST[p] + ' ' + ingF; });
    out.perfetto = each(function (p) { return HAVE_PRES[p] + ' ' + pp; });
    out.passatoPerfetto = each(function () { return 'had ' + pp; });
    out.futuro = each(function () { return 'will ' + base; });
    out.futuroGoing = each(function (p) { return BE_PRES[p] + ' going to ' + base; });
    out.condizionale = each(function () { return 'would ' + base; });
    out.impAfirmativo = [base, 'let\'s ' + base];
    out.impNegativo = ['don\'t ' + base, 'let\'s not ' + base];
    out.gerundio = ingF;
    out.participio = pp;
    return out;
  }

  // Forme con contrazione (I'm speaking, he's gone, they'll go): accettate come risposta equivalente.
  var CONTRACT = { am: '\'m', are: '\'re', is: '\'s', have: '\'ve', has: '\'s', had: '\'d', will: '\'ll', would: '\'d' };
  function alts(form, tenseKey, personIdx) {
    var m = /^(am|are|is|have|has|had|will|would) (.+)$/.exec(form);
    if (!m || tenseKey === 'impAfirmativo' || tenseKey === 'impNegativo') return [];
    return [PRONOUNS[personIdx] + CONTRACT[m[1]] + ' ' + m[2]];
  }

  var TENSES = [
    { key: 'presente', label: 'Present simple', group: 'Presente', use: 'Abitudini, routine, verità generali; he/she/it vuole la -s.', n: 6 },
    { key: 'presenteContinuo', label: 'Present continuous', group: 'Presente', use: 'Azioni in corso adesso o progetti vicini (I am working).', n: 6 },
    { key: 'passato', label: 'Past simple', group: 'Passato', use: 'Azioni concluse nel passato (yesterday, last year, in 2019).', n: 6 },
    { key: 'passatoContinuo', label: 'Past continuous', group: 'Passato', use: 'Azioni in corso nel passato, sfondo di un racconto (I was working when…).', n: 6 },
    { key: 'perfetto', label: 'Present perfect', group: 'Passato', use: 'Passato collegato al presente: esperienze, risultati, for e since.', n: 6 },
    { key: 'passatoPerfetto', label: 'Past perfect', group: 'Passato', use: 'Passato prima di un altro passato (I had finished when she arrived).', n: 6 },
    { key: 'futuro', label: 'Future with will', group: 'Futuro e condizionale', use: 'Previsioni, decisioni al momento, promesse.', n: 6 },
    { key: 'futuroGoing', label: 'Future with going to', group: 'Futuro e condizionale', use: 'Piani e intenzioni, previsioni basate su indizi.', n: 6 },
    { key: 'condizionale', label: 'Conditional', group: 'Futuro e condizionale', use: 'Cortesia, consigli, ipotesi (I would like, it would be better).', n: 6 },
    { key: 'impAfirmativo', label: 'Imperative', group: 'Imperativo', use: 'Ordini e inviti (Come in! Let\'s go!).', n: 2 },
    { key: 'impNegativo', label: 'Negative imperative', group: 'Imperativo', use: 'Divieti e inviti negativi (Don\'t worry! Let\'s not wait.).', n: 2 }
  ];

  // ---------------------------------------------------------------- verbi irregolari: infinito:significato:passato:participio passato
  function irregulars(list) {
    list.split('|').forEach(function (x) {
      var a = x.split(':');
      def(a[0], a[1], '', { past: a[2], pp: a[3] });
    });
  }
  irregulars(
    'go:andare:went:gone|get:ottenere, diventare, arrivare:got:got|make:fare, produrre:made:made|take:prendere, portare:took:taken|come:venire:came:come|see:vedere:saw:seen|know:sapere, conoscere:knew:known|' +
    'think:pensare:thought:thought|say:dire:said:said|tell:dire, raccontare:told:told|give:dare:gave:given|find:trovare:found:found|leave:partire, lasciare:left:left|feel:sentire, sentirsi:felt:felt|' +
    'bring:portare:brought:brought|buy:comprare:bought:bought|put:mettere:put:put|keep:tenere, mantenere:kept:kept|begin:cominciare:began:begun|run:correre:ran:run|write:scrivere:wrote:written|' +
    'read:leggere:read:read|speak:parlare:spoke:spoken|eat:mangiare:ate:eaten|drink:bere:drank:drunk|drive:guidare:drove:driven|sit:sedersi:sat:sat|stand:stare in piedi:stood:stood|' +
    'understand:capire:understood:understood|meet:incontrare:met:met|pay:pagare:paid:paid|send:mandare:sent:sent|sell:vendere:sold:sold|lose:perdere:lost:lost|win:vincere:won:won|' +
    'teach:insegnare:taught:taught|catch:prendere, afferrare:caught:caught|choose:scegliere:chose:chosen|forget:dimenticare:forgot:forgotten|fall:cadere:fell:fallen|break:rompere:broke:broken|' +
    'sleep:dormire:slept:slept|sing:cantare:sang:sung|swim:nuotare:swam:swum|fly:volare:flew:flown|wear:indossare:wore:worn|hold:tenere in mano:held:held|hear:sentire (udire):heard:heard|' +
    'let:lasciare, permettere:let:let|mean:significare:meant:meant|build:costruire:built:built|spend:spendere, trascorrere:spent:spent|cut:tagliare:cut:cut|hit:colpire:hit:hit|hurt:far male:hurt:hurt|' +
    'bend:piegare:bent:bent|bet:scommettere:bet:bet|bite:mordere:bit:bitten|bleed:sanguinare:bled:bled|blow:soffiare:blew:blown|burn:bruciare:burnt:burnt|cost:costare:cost:cost|deal:trattare:dealt:dealt|' +
    'dig:scavare:dug:dug|draw:disegnare, tirare:drew:drawn|dream:sognare:dreamt:dreamt|drive:guidare:drove:driven|feed:nutrire:fed:fed|fight:combattere:fought:fought|forgive:perdonare:forgave:forgiven|' +
    'freeze:congelare:froze:frozen|grow:crescere:grew:grown|hang:appendere:hung:hung|hide:nascondere:hid:hidden|lay:posare:laid:laid|lead:guidare, condurre:led:led|lend:prestare:lent:lent|' +
    'light:accendere:lit:lit|ride:andare (a cavallo, in bici):rode:ridden|ring:suonare (campanello):rang:rung|rise:alzarsi:rose:risen|set:impostare:set:set|shake:scuotere:shook:shaken|shine:brillare:shone:shone|' +
    'shoot:sparare:shot:shot|show:mostrare:showed:shown|shut:chiudere:shut:shut|sink:affondare:sank:sunk|spread:diffondere:spread:spread|steal:rubare:stole:stolen|stick:attaccare:stuck:stuck|swing:oscillare:swung:swung|' +
    'tear:strappare:tore:torn|throw:lanciare:threw:thrown|wake:svegliarsi:woke:woken|undo:disfare:undid:undone|overcome:superare:overcame:overcome|withdraw:ritirare:withdrew:withdrawn|upset:turbare:upset:upset|' +
    'seek:cercare:sought:sought|sew:cucire:sewed:sewn|sweep:spazzare:swept:swept|weep:piangere:wept:wept|lie:giacere, sdraiarsi:lay:lain|learn:imparare:learnt:learnt|spell:sillabare:spelt:spelt|smell:odorare:smelt:smelt|' +
    'quit:smettere:quit:quit|rid:liberare:rid:rid|bind:legare:bound:bound|breed:allevare:bred:bred|broadcast:trasmettere:broadcast:broadcast|forecast:prevedere:forecast:forecast|' +
    'overtake:sorpassare:overtook:overtaken|mistake:sbagliare:mistook:mistaken|rebuild:ricostruire:rebuilt:rebuilt|retell:raccontare di nuovo:retold:retold|oversleep:dormire troppo:overslept:overslept'
  );
  // Verbi con forme tutte proprie
  def('be', 'essere, stare', '', { pres: ['am', 'are', 'is', 'are', 'are', 'are'], past: ['was', 'were', 'was', 'were', 'were', 'were'], pp: 'been', ing: 'being', third: 'is' });
  def('have', 'avere', '', { past: 'had', pp: 'had', third: 'has' });
  def('do', 'fare', '', { past: 'did', pp: 'done', third: 'does' });
  // Derivati
  def('withstand', 'resistere', '', { past: 'withstood', pp: 'withstood' });
  def('undertake', 'intraprendere', '', { past: 'undertook', pp: 'undertaken' });
  def('become', 'diventare', '', { past: 'became', pp: 'become' });
  def('forget', 'dimenticare', '', { past: 'forgot', pp: 'forgotten' });
  def('beat', 'battere', '', { past: 'beat', pp: 'beaten' });

  // Regolari (con le regole ortografiche: -es, -ies, -ied, raddoppio, e muta)
  function regulars(list, tags) {
    list.split('|').forEach(function (x) { var a = x.split(':'); if (!V[a[0]]) def(a[0], a[1], tags || ''); });
  }
  regulars(
    'work:lavorare|play:giocare, suonare|live:vivere, abitare|like:piacere, gradire|love:amare|want:volere|need:aver bisogno di|use:usare|help:aiutare|ask:chiedere|call:chiamare, telefonare|' +
    'try:provare, tentare|start:cominciare|study:studiare|carry:portare|cry:piangere|enjoy:godersi, divertirsi con|move:muovere, traslocare|open:aprire|close:chiudere|wait:aspettare|walk:camminare|' +
    'talk:parlare, chiacchierare|listen:ascoltare|watch:guardare|look:guardare|cook:cucinare|clean:pulire|visit:visitare|arrive:arrivare|decide:decidere|agree:essere d\'accordo|answer:rispondere|' +
    'believe:credere|change:cambiare|check:controllare|collect:raccogliere|cover:coprire|dance:ballare|depend:dipendere|describe:descrivere|discuss:discutere|expect:aspettarsi|explain:spiegare|' +
    'fill:riempire|finish:finire|follow:seguire|happen:succedere|hate:odiare|hope:sperare|imagine:immaginare|invite:invitare|join:unirsi a|jump:saltare|kiss:baciare|laugh:ridere|last:durare|' +
    'marry:sposare|miss:mancare, perdere (un mezzo)|notice:notare|offer:offrire|order:ordinare|organise:organizzare|pass:passare|pick:raccogliere, scegliere|prefer:preferire|prepare:preparare|' +
    'push:spingere|pull:tirare|rain:piovere|reach:raggiungere|receive:ricevere|remember:ricordare|repeat:ripetere|return:tornare, restituire|save:salvare, risparmiare|share:condividere|' +
    'smile:sorridere|snow:nevicare|stay:restare, soggiornare|suggest:suggerire|surprise:sorprendere|talk:parlare|thank:ringraziare|touch:toccare|train:allenare|travel:viaggiare|trust:fidarsi|' +
    'turn:girare|wash:lavare|wish:desiderare|wonder:chiedersi|worry:preoccuparsi|book:prenotare|plan:progettare|stop:fermarsi, smettere|shop:fare acquisti|drop:far cadere|jog:fare jogging|' +
    'admit:ammettere|permit:permettere|refer:riferirsi|regret:rimpiangere|commit:impegnarsi|control:controllare|cancel:cancellare|label:etichettare|equip:equipaggiare|occur:accadere|' +
    'apply:fare domanda|reply:rispondere|deny:negare|fry:friggere|copy:copiare|empty:svuotare|hurry:affrettarsi|tidy:riordinare|type:digitare|' +
    'agree:essere d\'accordo|allow:permettere|appear:apparire|ask:chiedere|borrow:prendere in prestito|bother:disturbare|brush:spazzolare|calm:calmare|celebrate:festeggiare|complain:lamentarsi|' +
    'connect:collegare|create:creare|damage:danneggiare|deliver:consegnare|destroy:distruggere|disappear:scomparire|earn:guadagnare|encourage:incoraggiare|escape:fuggire|exist:esistere|' +
    'fail:fallire|fix:riparare|guess:indovinare|hug:abbracciare|improve:migliorare|introduce:presentare|knock:bussare|manage:riuscire, gestire|mention:menzionare|mix:mescolare|' +
    'pack:fare le valigie|paint:dipingere|park:parcheggiare|point:indicare|practise:esercitarsi|promise:promettere|protect:proteggere|realise:rendersi conto|reduce:ridurre|relax:rilassarsi|' +
    'rent:affittare|repair:riparare|rest:riposare|rush:correre, precipitarsi|serve:servire|shout:gridare|sound:sembrare|spend:spendere|taste:assaggiare|tie:legare|translate:tradurre|' +
    'unlock:aprire (chiave)|warn:avvertire|waste:sprecare|whisper:sussurrare|wrap:incartare|yell:urlare', '');
  ['prefer', 'admit', 'permit', 'refer', 'regret', 'commit', 'control', 'cancel', 'label', 'equip', 'occur', 'travel', 'begin', 'forget', 'quit', 'upset'].forEach(function (k) { if (V[k] && V[k].tags.indexOf('dbl') < 0) V[k].tags.push('dbl'); });

  // ---------------------------------------------------------------- descrizioni delle irregolarità
  function notes(inf) {
    var e = V[inf];
    if (!e) return ['Verbo non presente nell\'elenco: è mostrata la coniugazione regolare, che potrebbe non essere corretta se il verbo è irregolare.'];
    var out = [], irr = e.irr;
    if (inf === 'be') out.push('Il verbo più irregolare: am/are/is al presente, was/were al passato, been come participio. Conviene impararlo a memoria.');
    else if (inf === 'have') out.push('Have: has alla 3ª persona singolare, had per passato e participio.');
    else if (inf === 'do') out.push('Do: does alla 3ª persona singolare, did al passato, done come participio.');
    else if (irr.past) out.push('Verbo irregolare: past simple «' + irr.past + '», participio passato «' + irr.pp + '» (le tre forme da imparare: ' + inf + ' – ' + irr.past + ' – ' + irr.pp + ').');
    var reg = !irr.past;
    if (reg) {
      if (/(s|x|z|ch|sh|o)$/.test(inf)) out.push('Alla 3ª persona singolare del present simple si aggiunge -es (' + third(inf) + ').');
      else if (/[^aeiou]y$/.test(inf)) out.push('Dopo consonante, la -y diventa -i: ' + third(inf) + ', ' + pastForm(inf, e.tags) + '.');
      if (/e$/.test(inf)) out.push('Finisce già in -e: al passato si aggiunge solo -d (' + pastForm(inf, e.tags) + ') e nella forma in -ing la -e cade (' + ingForm(inf, e.tags) + ').');
      if (doubles(inf, e.tags)) out.push('La consonante finale si raddoppia prima di -ed e -ing (' + pastForm(inf, e.tags) + ', ' + ingForm(inf, e.tags) + ').');
    }
    if (!out.length) out.push('Verbo regolare: past simple e participio passato in -ed (' + pastForm(inf, e.tags) + ').');
    return out;
  }

  // Coniuga e segna le forme diverse dalla coniugazione regolare.
  function full(inf) {
    var c = conj(inf, false), r = conj(inf, true), irregular = {};
    TENSES.forEach(function (t) {
      irregular[t.key] = c[t.key].map(function (form, i) { return form !== r[t.key][i]; });
    });
    c.irregular = irregular;
    c.irrGer = c.gerundio !== r.gerundio;
    c.irrPart = c.participio !== r.participio;
    c.notes = notes(inf);
    return c;
  }

  // ---------------------------------------------------------------- verbi non in elenco
  function plain(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function distance(a, b) {
    var prev = [], cur, i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      for (j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1));
      prev = cur;
    }
    return prev[b.length];
  }
  function isSubsequence(a, b) { var k = 0; for (var i = 0; i < b.length && k < a.length; i++) if (b.charAt(i) === a.charAt(k)) k++; return k === a.length; }

  // Verbi dell'elenco simili a quello scritto (errori di battitura, lettere mancanti).
  function suggest(text, n) {
    var t = plain(text), out = [];
    Object.keys(V).forEach(function (v) {
      var pv = plain(v), d = distance(t, pv);
      var sub = t.length >= 3 && isSubsequence(t, pv), pre = t.length >= 3 && pv.indexOf(t) === 0;
      if (v === text || (d > 2 && !sub && !pre)) return;
      out.push({ v: v, score: d - (sub ? 1 : 0) - (pre ? 1 : 0), same: t.charAt(0) === pv.charAt(0) ? 0 : 1, gap: Math.abs(t.length - pv.length) });
    });
    out.sort(function (a, b) { return (a.score - b.score) || (a.same - b.same) || (a.gap - b.gap) || a.v.localeCompare(b.v); });
    return out.slice(0, n || 6).map(function (x) { return x.v; });
  }

  // Un verbo plausibile ha almeno una vocale (go, be, do sono in elenco e non passano di qui).
  function plausible(inf) { return /[aeiouy]/.test(inf); }

  // Normalizza quello che l'utente scrive: minuscole, senza "to" davanti; null se non sembra un verbo.
  function parse(text) {
    var t = String(text || '').trim().toLowerCase().normalize('NFC').replace(/^to\s+/, '');
    if (!/^[a-z]{2,}$/.test(t)) return null;
    return { inf: t, reflexive: false };
  }

  return {
    PERSONS: PERSONS, IMP_PERSONS: IMP_PERSONS, TENSES: TENSES, verbs: V, full: full, conj: conj, parse: parse, suggest: suggest, plausible: plausible, alts: alts,
    list: function () { return Object.keys(V).sort(); },
    irregularTop: ['be', 'have', 'do', 'go', 'get', 'make', 'take', 'come', 'see', 'know', 'think', 'say', 'tell', 'give', 'find', 'leave', 'feel', 'bring', 'buy', 'put', 'keep', 'begin',
                   'run', 'write', 'read', 'speak', 'eat', 'drink', 'drive', 'sit', 'stand', 'understand', 'meet', 'pay', 'send', 'sell', 'lose', 'win', 'teach', 'catch', 'choose', 'forget',
                   'fall', 'break', 'sleep', 'sing', 'swim', 'fly', 'wear', 'hold', 'hear', 'let', 'mean', 'build', 'spend', 'cut', 'hit', 'hurt', 'become', 'lend', 'ride', 'steal']
  };
})();
