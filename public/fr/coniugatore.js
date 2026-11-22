// Motore di coniugazione del francese: forme calcolate dalle regole e dai verbi irregolari. Le forme irregolari si evidenziano
// confrontando con la coniugazione regolare. Un verbo che non è in elenco viene coniugato come regolare.
// Stessa interfaccia del motore delle altre lingue (SPV), così le pagine in /app/ funzionano per tutte.
// Le forme si danno senza il pronome soggetto (come negli altri motori); il participio passato dei verbi con «être» porta (e)/(s).
var SPV = (function () {
  'use strict';

  var PERSONS = ['je (j\')', 'tu', 'il / elle / on', 'nous', 'vous', 'ils / elles'];
  var IMP_PERSONS = ['tu', 'nous', 'vous'];
  var V = {};   // infinito -> { inf, it, tags[], irr{} }

  function def(inf, it, tags, irr) { V[inf] = { inf: inf, it: it, tags: tags ? tags.split(' ') : [], irr: irr || null }; }

  // ---------------------------------------------------------------- base di coniugazione
  function cls(inf) { return /er$/.test(inf) ? 'er' : /ir$/.test(inf) ? 'ir' : 're'; }

  function regBase(inf, tags) {
    var has = function (t) { return tags.indexOf(t) >= 0; };
    var c = cls(inf), s = inf.slice(0, -2), b = { c: c };
    if (c === 'er') {
      var mute = s;
      if (has('yi')) mute = s.slice(0, -1) + 'i';                         // payer → pai-
      else if (has('eg')) mute = s.replace(/e([^e]*)$/, 'è$1');           // acheter → achèt-
      else if (has('eac')) mute = s.replace(/é([^é]*)$/, 'è$1');          // espérer → espèr-
      else if (has('ll')) mute = s + s.slice(-1);                         // appeler → appell-
      var nousS = has('c') ? s.slice(0, -1) + 'ç' : has('g') ? s + 'e' : s;   // avançons, mangeons
      b.p = [mute + 'e', mute + 'es', mute + 'e', nousS + 'ons', s + 'ez', mute + 'ent'];
      b.impS = s; b.impA = nousS; b.fut = has('eac') ? s + 'er' : mute + 'er';
      b.sj = mute; b.sn = s; b.pp = s + 'é';
    } else if (c === 'ir') {
      b.p = [s + 'is', s + 'is', s + 'it', s + 'issons', s + 'issez', s + 'issent'];
      b.impS = b.impA = s + 'iss'; b.fut = inf; b.sj = b.sn = s + 'iss'; b.pp = s + 'i';
    } else {
      b.p = [s + 's', s + 's', s, s + 'ons', s + 'ez', s + 'ent'];
      b.impS = b.impA = s; b.fut = inf.slice(0, -1); b.sj = b.sn = s; b.pp = s + 'u';
    }
    b.aux = has('etre') ? 'etre' : 'avoir';
    b.ger = b.impA + 'ant';
    return b;
  }

  function imperOf(p) { return [/es$/.test(p[1]) || p[1] === 'vas' ? p[1].slice(0, -1) : p[1], p[3], p[4]]; }

  function baseOf(inf, e, plain) {
    var tags = (plain || !e) ? [] : e.tags, irr = (plain || !e) ? null : e.irr;
    var b = regBase(inf, tags);
    if (irr) {
      if (irr.p) {
        b.p = irr.p;
        b.impS = irr.i || b.p[3].replace(/ons$/, '');
        b.impA = irr.ia || b.impS;
        b.sj = irr.sj || b.p[5].replace(/(ent|nt)$/, '');
        b.sn = irr.sn || b.impS;
        b.fut = /re$/.test(inf) ? inf.slice(0, -1) : inf;
        b.ger = b.impA + 'ant';
        b.imper = imperOf(b.p);
      }
      ['f', 'pp', 'ger', 'sf', 'imper', 'aux', 'noimp'].forEach(function (k) {
        if (irr[k] !== undefined) b[k === 'f' ? 'fut' : k] = irr[k];
      });
      if (irr.ia === undefined && irr.i !== undefined && !irr.p) { b.impS = irr.i; b.impA = irr.i; }
    }
    if (!b.imper) b.imper = imperOf(b.p);
    return b;
  }

  var AUX = { avoir: ['ai', 'as', 'a', 'avons', 'avez', 'ont'], etre: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'] };
  var AUX_IMP = { avoir: ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient'], etre: ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient'] };
  var AGREE = ['(e)', '(e)', '(e)', '(e)s', '(e)(s)', 's'];

  function conj(inf, plain) {
    var e = V[inf] || null;
    var b = baseOf(inf, e, plain);
    var out = { inf: inf, it: e ? e.it : '', known: !!e, cls: b.c };
    var each = function (fn) { var r = []; for (var p = 0; p < 6; p++) r.push(fn(p)); return r; };
    var pp = function (p) { return b.aux === 'etre' ? b.pp + AGREE[p] : b.pp; };

    out.presente = b.p.slice();
    out.passeCompose = each(function (p) { return AUX[b.aux][p] + ' ' + pp(p); });
    out.imparfait = each(function (p) { return (p === 3 ? b.impS + 'ions' : p === 4 ? b.impS + 'iez' : b.impA + ['ais', 'ais', 'ait', '', '', 'aient'][p]); });
    out.plusQueParfait = each(function (p) { return AUX_IMP[b.aux][p] + ' ' + pp(p); });
    out.futur = each(function (p) { return b.fut + ['ai', 'as', 'a', 'ons', 'ez', 'ont'][p]; });
    out.conditionnel = each(function (p) { return b.fut + ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'][p]; });
    out.subjonctif = b.sf ? b.sf.slice() : each(function (p) { return p === 3 ? b.sn + 'ions' : p === 4 ? b.sn + 'iez' : b.sj + ['e', 'es', 'e', '', '', 'ent'][p]; });
    out.impAfirmativo = b.noimp ? ['—', '—', '—'] : b.imper.slice();   // «—»: verbo senza imperativo (pouvoir, devoir, valoir)
    out.impNegativo = b.noimp ? ['—', '—', '—'] : b.imper.map(function (x) { return 'ne ' + x + ' pas'; });
    out.ppBase = b.pp;
    out.gerundio = b.ger;                                        // participe présent
    out.participio = b.aux === 'etre' ? b.pp + '(e)(s)' : b.pp;  // participe passé
    out.auxEtre = b.aux === 'etre';
    return out;
  }

  // Con "être" il participio concorda: «allé(e)» si accetta anche come «allé» o «allée» (e analogamente al plurale).
  function alts(form) {
    if (form.indexOf('(e)') < 0) return [];
    var out = [];
    ['', 'e'].forEach(function (a) { ['', 's', 'es'].forEach(function (z) {
      var f = form.replace('(e)(s)', a + z).replace('(e)s', a + 's').replace('(e)', a);
      if (f !== form && out.indexOf(f) < 0) out.push(f);
    }); });
    return out;
  }

  var TENSES = [
    { key: 'presente', label: 'Présent', group: 'Indicatif', use: 'Abitudini, azioni di adesso, verità generali; si usa anche per il futuro prossimo.', n: 6 },
    { key: 'passeCompose', label: 'Passé composé', group: 'Indicatif', use: 'Azioni concluse nel passato (hier, l\'année dernière): passato prossimo e remoto italiano.', n: 6 },
    { key: 'imparfait', label: 'Imparfait', group: 'Indicatif', use: 'Abitudini e descrizioni nel passato (quand j\'étais enfant…).', n: 6 },
    { key: 'plusQueParfait', label: 'Plus-que-parfait', group: 'Indicatif', use: 'Passato prima di un altro passato (quand je suis arrivé, il était déjà parti).', n: 6 },
    { key: 'futur', label: 'Futur simple', group: 'Indicatif', use: 'Progetti, previsioni e ipotesi; nel parlato si preferisce «aller + infinito».', n: 6 },
    { key: 'conditionnel', label: 'Conditionnel présent', group: 'Condizionale e congiuntivo', use: 'Cortesia, consigli, ipotesi (je voudrais, tu devrais).', n: 6 },
    { key: 'subjonctif', label: 'Subjonctif présent', group: 'Condizionale e congiuntivo', use: 'Volontà, dubbio, emozioni, necessità (il faut que, je veux que, bien que).', n: 6 },
    { key: 'impAfirmativo', label: 'Impératif', group: 'Imperativo', use: 'Ordini e inviti (tu, nous, vous).', n: 3 },
    { key: 'impNegativo', label: 'Impératif négatif', group: 'Imperativo', use: 'Divieti (ne parle pas, ne mangeons pas).', n: 3 }
  ];

  // ---------------------------------------------------------------- verbi
  function reg(list, tags) {
    list.split('|').forEach(function (x) { var a = x.split(':'); if (!V[a[0]]) def(a[0], a[1], tags || ''); });
  }
  function irr(inf, it, spec, tags) { def(inf, it, tags || '', spec); }

  // Completamente irregolari
  irr('être', 'essere', { p: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'], pp: 'été', f: 'ser', i: 'ét', sf: ['sois', 'sois', 'soit', 'soyons', 'soyez', 'soient'], ger: 'étant', imper: ['sois', 'soyons', 'soyez'] });
  irr('avoir', 'avere', { p: ['ai', 'as', 'a', 'avons', 'avez', 'ont'], pp: 'eu', f: 'aur', i: 'av', sf: ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient'], ger: 'ayant', imper: ['aie', 'ayons', 'ayez'] });
  irr('aller', 'andare', { p: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'], pp: 'allé', f: 'ir', i: 'all', sf: ['aille', 'ailles', 'aille', 'allions', 'alliez', 'aillent'], aux: 'etre', imper: ['va', 'allons', 'allez'] });
  irr('faire', 'fare', { p: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'], pp: 'fait', f: 'fer', sj: 'fass', sn: 'fass', imper: ['fais', 'faisons', 'faites'] });
  irr('dire', 'dire', { p: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'], pp: 'dit', f: 'dir', imper: ['dis', 'disons', 'dites'] });
  irr('pouvoir', 'potere', { p: ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent'], pp: 'pu', f: 'pourr', sj: 'puiss', sn: 'puiss', noimp: true });
  irr('vouloir', 'volere', { p: ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent'], pp: 'voulu', f: 'voudr', sj: 'veuill', sn: 'voul', imper: ['veuille', 'voulons', 'veuillez'] });
  irr('savoir', 'sapere', { p: ['sais', 'sais', 'sait', 'savons', 'savez', 'savent'], pp: 'su', f: 'saur', sj: 'sach', sn: 'sach', ger: 'sachant', imper: ['sache', 'sachons', 'sachez'] });
  irr('devoir', 'dovere', { p: ['dois', 'dois', 'doit', 'devons', 'devez', 'doivent'], pp: 'dû', f: 'devr', noimp: true });
  irr('valoir', 'valere', { p: ['vaux', 'vaux', 'vaut', 'valons', 'valez', 'valent'], pp: 'valu', f: 'vaudr', sj: 'vaill', sn: 'val', noimp: true });
  irr('voir', 'vedere', { p: ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient'], pp: 'vu', f: 'verr' });
  irr('venir', 'venire', { p: ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'], pp: 'venu', f: 'viendr', aux: 'etre' });
  irr('tenir', 'tenere', { p: ['tiens', 'tiens', 'tient', 'tenons', 'tenez', 'tiennent'], pp: 'tenu', f: 'tiendr' });
  irr('prendre', 'prendere', { p: ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'], pp: 'pris' });
  irr('mettre', 'mettere', { p: ['mets', 'mets', 'met', 'mettons', 'mettez', 'mettent'], pp: 'mis' });
  irr('boire', 'bere', { p: ['bois', 'bois', 'boit', 'buvons', 'buvez', 'boivent'], pp: 'bu', f: 'boir' });
  irr('croire', 'credere', { p: ['crois', 'crois', 'croit', 'croyons', 'croyez', 'croient'], pp: 'cru', f: 'croir' });
  irr('recevoir', 'ricevere', { p: ['reçois', 'reçois', 'reçoit', 'recevons', 'recevez', 'reçoivent'], pp: 'reçu', f: 'recevr' });
  irr('courir', 'correre', { p: ['cours', 'cours', 'court', 'courons', 'courez', 'courent'], pp: 'couru', f: 'courr' });
  irr('mourir', 'morire', { p: ['meurs', 'meurs', 'meurt', 'mourons', 'mourez', 'meurent'], pp: 'mort', f: 'mourr', aux: 'etre' });
  irr('naître', 'nascere', { p: ['nais', 'nais', 'naît', 'naissons', 'naissez', 'naissent'], pp: 'né', f: 'naîtr', aux: 'etre' });
  irr('connaître', 'conoscere', { p: ['connais', 'connais', 'connaît', 'connaissons', 'connaissez', 'connaissent'], pp: 'connu', f: 'connaîtr' });
  irr('paraître', 'sembrare, apparire', { p: ['parais', 'parais', 'paraît', 'paraissons', 'paraissez', 'paraissent'], pp: 'paru', f: 'paraîtr' });
  irr('plaire', 'piacere', { p: ['plais', 'plais', 'plaît', 'plaisons', 'plaisez', 'plaisent'], pp: 'plu', f: 'plair' });
  irr('lire', 'leggere', { p: ['lis', 'lis', 'lit', 'lisons', 'lisez', 'lisent'], pp: 'lu', f: 'lir' });
  irr('écrire', 'scrivere', { p: ['écris', 'écris', 'écrit', 'écrivons', 'écrivez', 'écrivent'], pp: 'écrit', f: 'écrir' });
  irr('vivre', 'vivere', { p: ['vis', 'vis', 'vit', 'vivons', 'vivez', 'vivent'], pp: 'vécu', f: 'vivr' });
  irr('suivre', 'seguire', { p: ['suis', 'suis', 'suit', 'suivons', 'suivez', 'suivent'], pp: 'suivi', f: 'suivr' });
  irr('rire', 'ridere', { p: ['ris', 'ris', 'rit', 'rions', 'riez', 'rient'], pp: 'ri', f: 'rir' });
  irr('ouvrir', 'aprire', { p: ['ouvre', 'ouvres', 'ouvre', 'ouvrons', 'ouvrez', 'ouvrent'], pp: 'ouvert' });
  irr('offrir', 'offrire', { p: ['offre', 'offres', 'offre', 'offrons', 'offrez', 'offrent'], pp: 'offert' });
  irr('couvrir', 'coprire', { p: ['couvre', 'couvres', 'couvre', 'couvrons', 'couvrez', 'couvrent'], pp: 'couvert' });
  irr('souffrir', 'soffrire', { p: ['souffre', 'souffres', 'souffre', 'souffrons', 'souffrez', 'souffrent'], pp: 'souffert' });
  irr('envoyer', 'inviare, mandare', { f: 'enverr' }, 'yi');

  // Famiglie: partir/sortir/dormir… (pars, pars, part, partons), conduire/construire…, craindre/peindre…
  function partLike(inf, it, aux) {
    var st = inf.slice(0, -3), c = inf.slice(-3, -2);
    irr(inf, it, { p: [st + 's', st + 's', st + 't', st + c + 'ons', st + c + 'ez', st + c + 'ent'], pp: inf.slice(0, -1), f: inf, aux: aux || 'avoir' });
  }
  partLike('partir', 'partire', 'etre'); partLike('sortir', 'uscire', 'etre'); partLike('dormir', 'dormire'); partLike('servir', 'servire');
  partLike('sentir', 'sentire'); partLike('mentir', 'mentire'); partLike('repartir', 'ripartire', 'etre'); partLike('ressortir', 'riuscire', 'etre');
  function isLike(inf, it) {
    var st = inf.slice(0, -2);
    irr(inf, it, { p: [st + 's', st + 's', st + 't', st + 'sons', st + 'sez', st + 'sent'], pp: st + 't', f: inf.slice(0, -1) });
  }
  ['conduire:guidare', 'produire:produrre', 'traduire:tradurre', 'construire:costruire', 'détruire:distruggere', 'cuire:cuocere', 'réduire:ridurre', 'introduire:introdurre'].forEach(function (x) { var a = x.split(':'); isLike(a[0], a[1]); });
  function indreLike(inf, it) {
    var b = inf.slice(0, -3), n = b.replace(/in$/, 'ign');
    irr(inf, it, { p: [b + 's', b + 's', b + 't', n + 'ons', n + 'ez', n + 'ent'], pp: b + 't', f: inf.slice(0, -1) });
  }
  ['craindre:temere', 'peindre:dipingere', 'joindre:unire', 'atteindre:raggiungere', 'éteindre:spegnere', 'plaindre:compatire'].forEach(function (x) { var a = x.split(':'); indreLike(a[0], a[1]); });

  // Derivati con prefisso: stesse irregolarità (comprendre da prendre, devenir da venir…)
  function derive(prefix, baseInf, it, extra, strip) {
    var b = V[baseInf], s = b.irr, k = strip || 0, out = {}, key;
    var pre = function (x) { return prefix + x.slice(k); };
    for (key in s) {
      if (key === 'aux' || typeof s[key] === 'boolean') out[key] = s[key];
      else if (key === 'p' || key === 'sf' || key === 'imper') out[key] = s[key].map(pre);
      else out[key] = pre(s[key]);
    }
    for (key in (extra || {})) out[key] = extra[key];
    def(prefix + baseInf.slice(k), it, b.tags.join(' '), out);
  }
  derive('com', 'prendre', 'capire, comprendere'); derive('ap', 'prendre', 'imparare'); derive('sur', 'prendre', 'sorprendere'); derive('entre', 'prendre', 'intraprendere');
  derive('pro', 'mettre', 'promettere'); derive('per', 'mettre', 'permettere'); derive('ad', 'mettre', 'ammettere'); derive('re', 'mettre', 'rimettere, rimettersi'); derive('com', 'mettre', 'commettere');
  derive('de', 'venir', 'diventare'); derive('re', 'venir', 'tornare'); derive('par', 'venir', 'riuscire, pervenire'); derive('pré', 'venir', 'prevenire', { aux: 'avoir' }, 0);
  derive('ob', 'tenir', 'ottenere'); derive('re', 'tenir', 'trattenere'); derive('con', 'tenir', 'contenere'); derive('main', 'tenir', 'mantenere'); derive('appar', 'tenir', 'appartenere');
  derive('re', 'voir', 'rivedere', { f: 'reverr' }); derive('pré', 'voir', 'prevedere', { f: 'prévoir' });
  derive('re', 'faire', 'rifare'); derive('dé', 'faire', 'disfare'); derive('re', 'lire', 'rileggere'); derive('dé', 'écrire', 'descrivere', {}, 1); derive('pres', 'écrire', 'prescrivere', {}, 1); derive('ins', 'écrire', 'iscrivere', {}, 1); derive('sou', 'rire', 'sorridere');
  derive('re', 'connaître', 'riconoscere'); derive('ap', 'paraître', 'apparire', {}, 0); derive('dis', 'paraître', 'scomparire', {}, 0); derive('dé', 'couvrir', 'scoprire', {}, 0);
  derive('re', 'dire', 'ridire'); derive('pré', 'dire', 'predire', { p: ['prédis', 'prédis', 'prédit', 'prédisons', 'prédisez', 'prédisent'], imper: ['prédis', 'prédisons', 'prédisez'] });
  derive('sou', 'tenir', 'sostenere', {}, 0);

  // Regolari: -er (con le particolarità ortografiche), -ir (secondo gruppo), -re
  reg('parler:parlare|aimer:amare, piacere|chanter:cantare|danser:ballare|travailler:lavorare|habiter:abitare|regarder:guardare|écouter:ascoltare|donner:dare|trouver:trovare|penser:pensare|' +
      'demander:chiedere|montrer:mostrare|jouer:giocare, suonare|marcher:camminare, funzionare|porter:portare, indossare|laver:lavare|cuisiner:cucinare|étudier:studiare|oublier:dimenticare|' +
      'utiliser:usare|visiter:visitare|organiser:organizzare|préparer:preparare|téléphoner:telefonare|rencontrer:incontrare|présenter:presentare|expliquer:spiegare|chercher:cercare|' +
      'passer:passare, trascorrere|fermer:chiudere|ouvrir:aprire|inviter:invitare|aider:aiutare|arrêter:fermare, smettere|attraper:afferrare|bavarder:chiacchierare|casser:rompere|' +
      'choisir:scegliere|commander:ordinare|compter:contare|continuer:continuare|couper:tagliare|coûter:costare|crier:gridare|décider:decidere|déjeuner:pranzare|dîner:cenare|' +
      'écrire:scrivere|embrasser:baciare|entrer:entrare|essayer:provare|éviter:evitare|fumer:fumare|gagner:vincere, guadagnare|garder:tenere, custodire|goûter:assaggiare|imaginer:immaginare|' +
      'laisser:lasciare|manquer:mancare|montrer:mostrare|noter:annotare|oser:osare|pleurer:piangere|poser:posare|pousser:spingere|prêter:prestare|quitter:lasciare|' +
      'raconter:raccontare|refuser:rifiutare|remercier:ringraziare|rêver:sognare|saluer:salutare|sembler:sembrare|sonner:suonare|supposer:supporre|terminer:terminare|tirer:tirare|' +
      'toucher:toccare|tourner:girare|trouver:trovare|tuer:uccidere|visiter:visitare|voler:volare, rubare|créer:creare|apprécier:apprezzare|copier:copiare|photographier:fotografare', '');
  reg('arriver:arrivare|rester:restare|tomber:cadere|rentrer:rientrare|retourner:ritornare|monter:salire|descendre:scendere|passer:passare', 'etre');
  reg('commencer:cominciare|avancer:avanzare|lancer:lanciare|placer:mettere|annoncer:annunciare|prononcer:pronunciare|remplacer:sostituire|menacer:minacciare|effacer:cancellare', 'c');
  reg('manger:mangiare|voyager:viaggiare|changer:cambiare|ranger:riordinare|partager:condividere|déménager:traslocare|corriger:correggere|encourager:incoraggiare|nager:nuotare|obliger:obbligare|déranger:disturbare|exiger:esigere|juger:giudicare|plonger:tuffarsi|ménager:risparmiare', 'g');
  reg('protéger:proteggere', 'eac g');
  reg('payer:pagare|essayer:provare|employer:impiegare|nettoyer:pulire|ennuyer:annoiare|appuyer:appoggiare|balayer:spazzare|déployer:dispiegare|effrayer:spaventare|essuyer:asciugare|renvoyer:rimandare|tutoyer:dare del tu|vouvoyer:dare del lei', 'yi');
  reg('acheter:comprare|lever:alzare|mener:condurre|peser:pesare|geler:gelare|amener:portare (qualcuno)|emmener:portare via|promener:portare a spasso|achever:completare|élever:allevare|soulever:sollevare|ramener:riportare', 'eg');
  reg('espérer:sperare|préférer:preferire|répéter:ripetere|célébrer:celebrare|considérer:considerare|exagérer:esagerare|gérer:gestire|posséder:possedere|régler:regolare|révéler:rivelare|sécher:asciugare|suggérer:suggerire|compléter:completare', 'eac');
  reg('appeler:chiamare|jeter:gettare|rappeler:richiamare, ricordare|épeler:sillabare|rejeter:respingere|projeter:progettare|renouveler:rinnovare|feuilleter:sfogliare|ficeler:legare|étinceler:scintillare', 'll');
  ['arriver', 'rester', 'tomber', 'rentrer', 'retourner', 'monter', 'descendre', 'entrer'].forEach(function (k) { if (V[k] && V[k].tags.indexOf('etre') < 0) V[k].tags.push('etre'); });
  reg('finir:finire|choisir:scegliere|réussir:riuscire|grandir:crescere|grossir:ingrassare|maigrir:dimagrire|réfléchir:riflettere|rougir:arrossire|remplir:riempire|obéir:obbedire|agir:agire|punir:punire|bâtir:costruire|établir:stabilire|saisir:afferrare|vieillir:invecchiare|réunir:riunire|atterrir:atterrare|ralentir:rallentare|applaudir:applaudire|guérir:guarire|nourrir:nutrire|pâlir:impallidire|finir:finire', '');
  reg('vendre:vendere|attendre:aspettare|entendre:sentire (udire)|répondre:rispondere|perdre:perdere|descendre:scendere|rendre:rendere, restituire|défendre:difendere|étendre:stendere|tendre:tendere|mordre:mordere|confondre:confondere|fondre:fondere|correspondre:corrispondere|répandre:spargere|prétendre:pretendere|suspendre:sospendere|pendre:appendere|tondre:tosare|épandre:spargere', '');
  ['descendre'].forEach(function (k) { if (V[k].tags.indexOf('etre') < 0) V[k].tags.push('etre'); });

  // ---------------------------------------------------------------- descrizioni delle irregolarità
  function notes(inf) {
    var e = V[inf];
    if (!e) return ['Verbo non presente nell\'elenco: è mostrata la coniugazione regolare, che potrebbe non essere corretta se il verbo è irregolare.'];
    var out = [], t = e.tags, irrs = e.irr, c = cls(inf);
    if (inf === 'être' || inf === 'avoir' || inf === 'aller' || inf === 'faire') out.push('Verbo molto irregolare: conviene impararlo a memoria.');
    else if (irrs && irrs.p) out.push('Verbo irregolare: presente (je ' + irrs.p[0] + ', nous ' + irrs.p[3] + ', ils ' + irrs.p[5] + ') e participio passato «' + (irrs.pp || '') + '».');
    if (!irrs && c === 'ir') out.push('Verbo regolare del secondo gruppo (-ir): al plurale e all\'imparfait compare -iss- (nous finissons, je finissais).');
    if (!irrs && c === 're') out.push('Verbo regolare in -re (terzo gruppo): alla 3ª persona singolare del presente non ha desinenza (il vend).');
    if (t.indexOf('c') >= 0) out.push('Verbi in -cer: c → ç davanti a a e o (nous avançons, j\'avançais).');
    if (t.indexOf('g') >= 0) out.push('Verbi in -ger: si aggiunge una e dopo la g davanti a a e o (nous mangeons, je mangeais).');
    if (t.indexOf('yi') >= 0) out.push('Verbi in -yer: y → i davanti a una e muta (j\'envoie, ils paient; futuro: j\'enverrai / je paierai).');
    if (t.indexOf('eg') >= 0) out.push('e → è davanti a una sillaba con e muta (j\'achète, il lève; futuro: j\'achèterai).');
    if (t.indexOf('eac') >= 0) out.push('é → è davanti a una sillaba con e muta (j\'espère, tu préfères) ma nel futuro resta é (j\'espérerai).');
    if (t.indexOf('ll') >= 0) out.push('La consonante si raddoppia davanti a una e muta (j\'appelle, je jette; futuro: j\'appellerai).');
    if (irrs && irrs.f && !irrs.p) out.push('Futuro e condizionale con radice irregolare (' + irrs.f + '-).');
    if (irrs && irrs.f && irrs.p && !/^(.*)(er|ir|re)$/.test(irrs.f)) out.push('Futuro e condizionale con radice irregolare (' + irrs.f + '-).');
    if (t.indexOf('etre') >= 0 || (irrs && irrs.aux === 'etre')) out.push('Il passé composé si forma con être: il participio si accorda con il soggetto (je suis allé / allée, nous sommes allés).');
    else out.push('Il passé composé si forma con avoir (il participio resta invariato, salvo accordo con il complemento oggetto che precede).');
    if (/^(.*)(oir)$/.test(inf) && !irrs) out.push('Verbo in -oir: di solito irregolare.');
    return out;
  }

  // Coniuga e segna le forme diverse dalla coniugazione regolare.
  function full(inf) {
    var c = conj(inf, false), r = conj(inf, true), irregular = {};
    TENSES.forEach(function (t) {
      irregular[t.key] = c[t.key].map(function (form, i) { return form !== '—' && form !== r[t.key][i]; });
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

  // Un infinito plausibile ha almeno una vocale prima della desinenza.
  function plausible(inf) { return /[aeiouyàâäéèêëîïôöùûüœ]/.test(inf.slice(0, -2)); }

  // Le quattro forme del participio passato e come si accorda (la parte che nella tabella dei tempi non si vede).
  function participleNote(inf) {
    var c = conj(inf), pp = c.ppBase;
    if (!pp) return '';
    if (pp === 'été') return 'Participe passé: été (invariabile: non si accorda mai).';
    var fs = pp === 'dû' ? 'due' : (/e$/.test(pp) ? pp : pp + 'e'), mp = /[sx]$/.test(pp) ? pp : pp + 's', fp = fs + 's';
    var rule = c.auxEtre
      ? 'Con être il participio si accorda con il soggetto (elle est allée, ils sont partis).'
      : 'Con avoir si accorda solo con il complemento oggetto che lo precede (les lettres que j\'ai écrites; ma j\'ai écrit des lettres); con i verbi pronominali di solito si accorda con il soggetto (elles se sont lavées).';
    return 'Participe passé: ' + pp + ' (m. sing.), ' + fs + ' (f. sing.), ' + mp + ' (m. plur.), ' + fp + ' (f. plur.). ' + rule;
  }

  // Normalizza quello che l'utente scrive: minuscole, senza "se"/"s'" davanti (verbi pronominali); null se non sembra un infinito.
  function parse(text) {
    var t = String(text || '').trim().toLowerCase().normalize('NFC').replace(/’/g, '\'');
    var reflexive = false;
    if (/^s'/.test(t)) { t = t.slice(2); reflexive = true; }
    else if (/^se\s+/.test(t)) { t = t.replace(/^se\s+/, ''); reflexive = true; }
    if (!/^[a-zàâäçéèêëîïôöùûüÿœæ-]{3,}$/.test(t)) return null;
    if (!/(er|ir|re|oir)$/.test(t)) return null;
    return { inf: t, reflexive: reflexive };
  }

  return {
    add: function (list, tags) { reg(list, tags || ''); },
    PERSONS: PERSONS, IMP_PERSONS: IMP_PERSONS, TENSES: TENSES, verbs: V, full: full, conj: conj, parse: parse, suggest: suggest, plausible: plausible, alts: alts, participleNote: participleNote,
    list: function () { return Object.keys(V).sort(); },
    irregularTop: ['être', 'avoir', 'aller', 'faire', 'dire', 'pouvoir', 'vouloir', 'savoir', 'devoir', 'venir', 'voir', 'prendre', 'mettre', 'partir', 'sortir', 'dormir', 'servir',
                   'tenir', 'boire', 'croire', 'recevoir', 'courir', 'mourir', 'naître', 'connaître', 'lire', 'écrire', 'vivre', 'suivre', 'rire', 'ouvrir', 'offrir', 'comprendre',
                   'apprendre', 'permettre', 'promettre', 'devenir', 'revenir', 'obtenir', 'conduire', 'traduire', 'construire', 'craindre', 'peindre', 'plaire', 'valoir',
                   'envoyer', 'acheter', 'appeler', 'jeter', 'manger', 'commencer', 'payer', 'espérer', 'préférer', 'lever', 'finir', 'choisir', 'vendre', 'attendre']
  };
})();
