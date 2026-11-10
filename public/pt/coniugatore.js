// Motore di coniugazione del portoghese brasiliano: regole generali + verbi irregolari.
// Le forme sono calcolate, non generate: così sono sempre le stesse e le irregolarità si possono evidenziare
// confrontando con la coniugazione regolare. Un verbo che non è in elenco viene coniugato come regolare.
// Persone: eu, tu, ele/ela/você, nós, eles/elas/vocês (il "vós" non si usa in Brasile e non è mostrato).
var SPV = (function () {
  'use strict';

  var PERSONS = ['eu', 'tu', 'ele / ela / você', 'nós', 'eles / elas / vocês'];
  var IMP_PERSONS = ['tu', 'você', 'nós', 'vocês'];
  var V = {};   // infinito -> { inf, it, tags[], irr{} }

  function def(inf, it, tags, irr) { V[inf] = { inf: inf, it: it, tags: tags ? tags.split(' ') : [], irr: irr || {} }; }

  // Accento sull'ultima vocale: serve alla forma di "nós" dell'imperfeito do subjuntivo (falássemos, comêssemos, fôssemos).
  function accentLast(s, vowel) {
    var map = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' };
    for (var i = s.length - 1; i >= 0; i--) {
      var c = s.charAt(i);
      if ('áéíóúâêô'.indexOf(c) >= 0) return s;   // già accentata (saí → saíssemos)
      if (map[c]) return s.slice(0, i) + (vowel || map[c]) + s.slice(i + 1);
    }
    return s;
  }
  function repl(s, from, to) {   // sostituisce l'ultima occorrenza
    var i = s.lastIndexOf(from);
    return i < 0 ? s : s.slice(0, i) + to + s.slice(i + from.length);
  }

  // Verbo derivato (manter da ter, compor da pôr…): stesse irregolarità con il prefisso davanti.
  function derive(prefix, baseInf, it, extra) {
    var b = V[baseInf], irr = {}, k;
    function pre(x) { return Array.isArray(x) ? x.map(function (y) { return y == null ? y : prefix + y; }) : prefix + x; }
    for (k in b.irr) {
      if (k === 'infP' || typeof b.irr[k] === 'boolean') continue;
      irr[k] = pre(b.irr[k]);
    }
    // ter e vir: la 2ª e la 3ª persona dei derivati hanno l'accento acuto (manténs, mantém; convéns, convém)
    if (baseInf === 'ter' || baseInf === 'vir') {
      irr.pres = irr.pres.slice();
      irr.pres[1] = prefix + (baseInf === 'ter' ? 'téns' : 'véns');
      irr.pres[2] = prefix + (baseInf === 'ter' ? 'tém' : 'vém');
    }
    for (k in (extra || {})) irr[k] = extra[k];
    def((prefix + baseInf).replace('ô', 'o'), it, b.tags.join(' '), irr);
  }

  var END = {
    pres: { ar: ['o', 'as', 'a', 'amos', 'am'], er: ['o', 'es', 'e', 'emos', 'em'], ir: ['o', 'es', 'e', 'imos', 'em'] },
    presUir: ['o', 'is', 'i', 'ímos', 'em'],
    ind: { ar: ['ei', 'aste', 'ou', 'amos', 'aram'], er: ['i', 'este', 'eu', 'emos', 'eram'], ir: ['i', 'iste', 'iu', 'imos', 'iram'] },
    imp: { ar: ['ava', 'avas', 'ava', 'ávamos', 'avam'], er: ['ia', 'ias', 'ia', 'íamos', 'iam'], ir: ['ia', 'ias', 'ia', 'íamos', 'iam'] },
    fut: ['ei', 'ás', 'á', 'emos', 'ão'],
    cond: ['ia', 'ias', 'ia', 'íamos', 'iam'],
    sub: { ar: ['e', 'es', 'e', 'emos', 'em'], er: ['a', 'as', 'a', 'amos', 'am'], ir: ['a', 'as', 'a', 'amos', 'am'] },
    infP: ['', 'es', '', 'mos', 'em'],
    tenho: ['tenho', 'tens', 'tem', 'temos', 'têm'],
    tinha: ['tinha', 'tinhas', 'tinha', 'tínhamos', 'tinham']
  };

  // Unisce radice e desinenza applicando le regole ortografiche.
  function fix(stem, end, inf, hiatus) {
    var s = stem, c0 = end.charAt(0);
    var front = c0 === 'e' || c0 === 'é' || c0 === 'ê';
    var back = c0 === 'o' || c0 === 'a' || c0 === 'á';
    if (front) {
      if (/car$/.test(inf) && /c$/.test(s)) s = s.slice(0, -1) + 'qu';        // busquei, busque
      else if (/çar$/.test(inf) && /ç$/.test(s)) s = s.slice(0, -1) + 'c';    // comecei, comece
      else if (/gar$/.test(inf) && /g$/.test(s)) s = s + 'u';                 // paguei, pague
    }
    if (back) {
      if (/g[ei]r$/.test(inf) && /g$/.test(s)) s = s.slice(0, -1) + 'j';      // dirijo, dirija
      else if (/gu[ei]r$/.test(inf) && /gu$/.test(s)) s = s.slice(0, -1);     // sigo, siga
      else if (/c[ei]r$/.test(inf) && /c$/.test(s)) s = s.slice(0, -1) + 'ç'; // conheço, conheça
    }
    // Iato: dopo vocale la i accentata porta l'accento (saí, saíste, caímos, construíram).
    if (hiatus && /^(i$|iste|imos|istes|iram)/.test(end) && /[aeou]$/.test(s) && !/[gq]u$/.test(s)) end = 'í' + end.slice(1);
    return s + end;
  }

  function conj(inf, plain) {
    var e = V[inf] || null;
    var irr = (plain || !e) ? {} : e.irr;
    var tags = (plain || !e) ? [] : e.tags;
    var has = function (t) { return tags.indexOf(t) >= 0; };
    var last2 = inf.slice(-2);
    var cls = last2 === 'ar' ? 'ar' : last2 === 'ir' ? 'ir' : 'er';   // er, ôr e or seguono le desinenze in -er dove non sono irregolari
    var stem = inf.slice(0, -2);
    var infAcc = inf.replace('ô', 'o');
    var f = function (st, end) { return fix(st, end, inf); };
    var out = { inf: inf, it: e ? e.it : '', known: !!e, cls: cls };
    var p;

    // radice del presente per ogni persona (0 eu, 1 tu, 2 ele, 3 nós, 4 eles)
    function presStem(p) {
      if (has('ei') && p === 0) return repl(stem, 'e', 'i');
      if (has('ou') && p === 0) return repl(stem, 'o', 'u');
      if (has('uo') && (p === 1 || p === 2 || p === 4)) return repl(stem, 'u', 'o');
      if (has('ear') && p !== 3) return stem + 'i';
      if (has('iar-ei') && p !== 3) return stem.slice(0, -1) + 'ei';
      return stem;
    }

    // presente
    out.presente = [];
    for (p = 0; p < 5; p++) {
      if (irr.pres && irr.pres[p] != null) out.presente[p] = irr.pres[p];
      else if (p === 0 && irr.yo) out.presente[p] = irr.yo;
      else if (has('uir')) out.presente[p] = f(stem, END.presUir[p]);
      else out.presente[p] = f(presStem(p), END.pres[cls][p]);
    }
    var yoForm = out.presente[0];

    // pretérito perfeito
    out.perfeito = [];
    for (p = 0; p < 5; p++) out.perfeito[p] = irr.ind ? irr.ind[p] : fix(stem, END.ind[cls][p], inf, true);

    // pretérito imperfeito
    out.imperfeito = irr.imp ? irr.imp.slice() : END.imp[cls].map(function (d) { return stem + d; });

    // futuro e condizionale
    var fstem = irr.futStem || infAcc;
    out.futuro = END.fut.map(function (d) { return fstem + d; });
    out.condicional = END.cond.map(function (d) { return fstem + d; });

    // gerundio e participio
    out.gerundio = irr.ger || (cls === 'ar' ? stem + 'ando' : cls === 'er' ? stem + 'endo' : stem + 'indo');
    out.participio = irr.part || (cls === 'ar' ? stem + 'ado' : (/[aeou]$/.test(stem) && !/[gq]u$/.test(stem) ? stem + 'ído' : stem + 'ido'));

    // presente do subjuntivo: radice della 1ª persona del presente, uguale per tutte le persone
    out.subjPresente = [];
    for (p = 0; p < 5; p++) {
      if (irr.subj) { out.subjPresente[p] = irr.subj[p]; continue; }
      var sst;
      if (irr.subjStem) sst = irr.subjStem;
      else if (p === 3 && (has('ear') || has('iar-ei'))) sst = stem;
      else sst = yoForm.replace(/o$/, '');
      out.subjPresente[p] = f(sst, END.sub[cls][p]);
    }

    // imperfeito e futuro do subjuntivo: dalla 3ª persona plurale del perfeito
    var base = out.perfeito[4].replace(/ram$/, '');
    var vowel = (!irr.ind && cls === 'er') ? 'ê' : (base === 'fo' ? 'ô' : null);
    out.subjImperfeito = [base + 'sse', base + 'sses', base + 'sse', accentLast(base, vowel) + 'ssemos', base + 'ssem'];
    out.subjFuturo = [base + 'r', base + 'res', base + 'r', base + 'rmos', base + 'rem'];

    // infinito pessoale
    out.infinitivoPessoal = irr.infP ? irr.infP.slice() : END.infP.map(function (d) { return inf + d; });

    // tempi composti
    out.perfeitoComposto = END.tenho.map(function (h) { return h + ' ' + out.participio; });
    out.maisQuePerfeito = END.tinha.map(function (h) { return h + ' ' + out.participio; });

    // imperativo: tu, você, nós, vocês
    var sp = out.subjPresente;
    out.impAfirmativo = [irr.impTu || out.presente[2], sp[2], irr.impNos || sp[3], sp[4]];
    out.impNegativo = [sp[1], sp[2], sp[3], sp[4]].map(function (x) { return 'não ' + x; });
    return out;
  }

  var TENSES = [
    { key: 'presente', label: 'Presente', group: 'Indicativo', use: 'Abitudini, azioni di adesso, verità generali; si usa anche per il futuro prossimo.', n: 5 },
    { key: 'perfeito', label: 'Pretérito perfeito', group: 'Indicativo', use: 'Azioni concluse nel passato (ontem, ano passado): passato prossimo e remoto italiano.', n: 5 },
    { key: 'imperfeito', label: 'Pretérito imperfeito', group: 'Indicativo', use: 'Abitudini e descrizioni nel passato (quando eu era criança…).', n: 5 },
    { key: 'futuro', label: 'Futuro do presente', group: 'Indicativo', use: 'Previsioni e ipotesi; nel parlato si preferisce "vou + infinitivo".', n: 5 },
    { key: 'condicional', label: 'Futuro do pretérito', group: 'Indicativo', use: 'Cortesia, consigli, ipotesi (eu gostaria, você deveria).', n: 5 },
    { key: 'perfeitoComposto', label: 'Pretérito perfeito composto', group: 'Tempi composti', use: 'Attenzione: indica un\'azione ripetuta fino ad ora (tenho trabalhado muito), non il passato prossimo italiano.', n: 5 },
    { key: 'maisQuePerfeito', label: 'Mais-que-perfeito composto', group: 'Tempi composti', use: 'Passato prima di un altro passato (quando cheguei, ele já tinha saído).', n: 5 },
    { key: 'subjPresente', label: 'Presente do subjuntivo', group: 'Subjuntivo', use: 'Desideri, consigli, dubbi, emozioni (quero que…, talvez…).', n: 5 },
    { key: 'subjImperfeito', label: 'Imperfeito do subjuntivo', group: 'Subjuntivo', use: 'Ipotesi irreali (se eu tivesse…), desideri nel passato.', n: 5 },
    { key: 'subjFuturo', label: 'Futuro do subjuntivo', group: 'Subjuntivo', use: 'Dopo se e quando per azioni future (quando eu puder, se você quiser): una particolarità del portoghese.', n: 5 },
    { key: 'impAfirmativo', label: 'Imperativo afirmativo', group: 'Imperativo', use: 'Ordini e inviti.', n: 4 },
    { key: 'impNegativo', label: 'Imperativo negativo', group: 'Imperativo', use: 'Divieti (não fale, não saia).', n: 4 },
    { key: 'infinitivoPessoal', label: 'Infinitivo pessoal', group: 'Infinito', use: 'Infinito che si coniuga: para eu fazer, antes de sairmos, sem eles saberem.', n: 5 }
  ];

  // ---------------------------------------------------------------- verbi
  // Completamente irregolari
  def('ser', 'essere', '', { pres: ['sou', 'és', 'é', 'somos', 'são'], ind: ['fui', 'foste', 'foi', 'fomos', 'foram'],
    imp: ['era', 'eras', 'era', 'éramos', 'eram'], subj: ['seja', 'sejas', 'seja', 'sejamos', 'sejam'], impTu: 'sê', full: true });
  def('estar', 'stare, essere (stato, posizione)', '', { pres: ['estou', 'estás', 'está', 'estamos', 'estão'], ind: ['estive', 'estiveste', 'esteve', 'estivemos', 'estiveram'],
    subj: ['esteja', 'estejas', 'esteja', 'estejamos', 'estejam'], full: true });
  def('ir', 'andare', '', { pres: ['vou', 'vais', 'vai', 'vamos', 'vão'], ind: ['fui', 'foste', 'foi', 'fomos', 'foram'],
    subj: ['vá', 'vás', 'vá', 'vamos', 'vão'], impNos: 'vamos', full: true });
  def('haver', 'avere (ausiliare), esserci', '', { pres: ['hei', 'hás', 'há', 'havemos', 'hão'], ind: ['houve', 'houveste', 'houve', 'houvemos', 'houveram'], subjStem: 'haj', full: true });
  def('dar', 'dare', '', { pres: ['dou', 'dás', 'dá', 'damos', 'dão'], ind: ['dei', 'deste', 'deu', 'demos', 'deram'],
    subj: ['dê', 'dês', 'dê', 'demos', 'deem'], full: true });
  def('ter', 'avere, tenere', '', { pres: ['tenho', 'tens', 'tem', 'temos', 'têm'], ind: ['tive', 'tiveste', 'teve', 'tivemos', 'tiveram'],
    imp: ['tinha', 'tinhas', 'tinha', 'tínhamos', 'tinham'] });
  def('vir', 'venire', '', { pres: ['venho', 'vens', 'vem', 'vimos', 'vêm'], ind: ['vim', 'vieste', 'veio', 'viemos', 'vieram'],
    imp: ['vinha', 'vinhas', 'vinha', 'vínhamos', 'vinham'], part: 'vindo' });
  def('pôr', 'mettere', '', { pres: ['ponho', 'pões', 'põe', 'pomos', 'põem'], ind: ['pus', 'puseste', 'pôs', 'pusemos', 'puseram'],
    imp: ['punha', 'punhas', 'punha', 'púnhamos', 'punham'], ger: 'pondo', part: 'posto', infP: ['pôr', 'pores', 'pôr', 'pormos', 'porem'] });
  def('ver', 'vedere', '', { pres: ['vejo', 'vês', 'vê', 'vemos', 'veem'], ind: ['vi', 'viste', 'viu', 'vimos', 'viram'], part: 'visto' });
  def('ler', 'leggere', '', { pres: ['leio', 'lês', 'lê', 'lemos', 'leem'] });
  def('crer', 'credere', '', { pres: ['creio', 'crês', 'crê', 'cremos', 'creem'] });
  def('rir', 'ridere', '', { pres: ['rio', 'ris', 'ri', 'rimos', 'riem'] });

  // Radice irregolare
  def('fazer', 'fare', '', { pres: ['faço', 'fazes', 'faz', 'fazemos', 'fazem'], ind: ['fiz', 'fizeste', 'fez', 'fizemos', 'fizeram'], futStem: 'far', part: 'feito' });
  def('dizer', 'dire', '', { pres: ['digo', 'dizes', 'diz', 'dizemos', 'dizem'], ind: ['disse', 'disseste', 'disse', 'dissemos', 'disseram'], futStem: 'dir', part: 'dito' });
  def('trazer', 'portare', '', { pres: ['trago', 'trazes', 'traz', 'trazemos', 'trazem'], ind: ['trouxe', 'trouxeste', 'trouxe', 'trouxemos', 'trouxeram'], futStem: 'trar' });
  def('poder', 'potere', '', { yo: 'posso', ind: ['pude', 'pudeste', 'pôde', 'pudemos', 'puderam'] });
  def('querer', 'volere, amare', '', { pres: ['quero', 'queres', 'quer', 'queremos', 'querem'], ind: ['quis', 'quiseste', 'quis', 'quisemos', 'quiseram'], subjStem: 'queir' });
  def('saber', 'sapere', '', { pres: ['sei', 'sabes', 'sabe', 'sabemos', 'sabem'], ind: ['soube', 'soubeste', 'soube', 'soubemos', 'souberam'], subjStem: 'saib' });
  def('caber', 'starci, entrare', '', { yo: 'caibo', ind: ['coube', 'coubeste', 'coube', 'coubemos', 'couberam'] });
  def('valer', 'valere', '', { yo: 'valho' });
  def('sair', 'uscire', '', { pres: ['saio', 'sais', 'sai', 'saímos', 'saem'] });
  def('cair', 'cadere', '', { pres: ['caio', 'cais', 'cai', 'caímos', 'caem'] });
  def('construir', 'costruire', 'uir', { pres: ['construo', 'constróis', 'constrói', 'construímos', 'constroem'] });
  def('destruir', 'distruggere', 'uir', { pres: ['destruo', 'destróis', 'destrói', 'destruímos', 'destroem'] });

  // Derivati
  derive('man', 'ter', 'mantenere'); derive('con', 'ter', 'contenere'); derive('ob', 'ter', 'ottenere');
  derive('de', 'ter', 'fermare, trattenere'); derive('sus', 'ter', 'sostenere'); derive('re', 'ter', 'trattenere');
  derive('con', 'vir', 'convenire'); derive('inter', 'vir', 'intervenire'); derive('pro', 'vir', 'provenire');
  derive('com', 'pôr', 'comporre'); derive('pro', 'pôr', 'proporre'); derive('su', 'pôr', 'supporre'); derive('ex', 'pôr', 'esporre');
  derive('re', 'pôr', 'rimettere, reintegrare'); derive('dis', 'pôr', 'disporre'); derive('im', 'pôr', 'imporre'); derive('o', 'pôr', 'opporsi a');
  derive('des', 'fazer', 'disfare'); derive('re', 'fazer', 'rifare'); derive('satis', 'fazer', 'soddisfare');
  derive('pre', 'dizer', 'predire'); derive('contra', 'dizer', 'contraddire');
  derive('pre', 'ver', 'prevedere'); derive('re', 'ver', 'rivedere');

  // Alternanze vocaliche e ortografia
  function bulk(list, tag) { list.split('|').forEach(function (x) { var a = x.split(':'); if (!V[a[0]]) def(a[0], a[1], tag); }); }
  bulk('sentir:sentire, provare|mentir:mentire|preferir:preferire|referir:riferire|divertir:divertire|vestir:vestire|servir:servire|repetir:ripetere|seguir:seguire|conseguir:ottenere, riuscire|perseguir:perseguire|competir:competere|sugerir:suggerire|digerir:digerire|ferir:ferire', 'ei');
  bulk('dormir:dormire|tossir:tossire|engolir:inghiottire', 'ou');
  def('cobrir', 'coprire', 'ou', { part: 'coberto' });
  derive('des', 'cobrir', 'scoprire'); derive('en', 'cobrir', 'coprire, nascondere');
  bulk('subir:salire|fugir:fuggire|sumir:sparire|consumir:consumare|cuspir:sputare|sacudir:scuotere|acudir:accorrere|bulir:agitarsi', 'uo');
  def('pedir', 'chiedere', '', { yo: 'peço' }); def('medir', 'misurare', '', { yo: 'meço' }); def('ouvir', 'sentire, ascoltare', '', { yo: 'ouço' });
  def('impedir', 'impedire', '', { yo: 'impeço' }); def('despedir', 'congedare, licenziare', '', { yo: 'despeço' });
  def('perder', 'perdere', '', { yo: 'perco' });
  bulk('passear:passeggiare|nomear:nominare|recear:temere|mapear:mappare|golpear:colpire|folhear:sfogliare', 'ear');
  bulk('odiar:odiare|mediar:mediare|ansiar:anelare|remediar:rimediare|incendiar:incendiare', 'iar-ei');
  bulk('incluir:includere|concluir:concludere|contribuir:contribuire|distribuir:distribuire|substituir:sostituire|atribuir:attribuire|diminuir:diminuire|excluir:escludere|influir:influire|possuir:possedere', 'uir');
  def('abrir', 'aprire', '', { part: 'aberto' }); def('escrever', 'scrivere', '', { part: 'escrito' }); def('descrever', 'descrivere', '', { part: 'descrito' });
  def('inscrever', 'iscrivere', '', { part: 'inscrito' }); def('imprimir', 'stampare', '', { part: 'impresso' });
  def('ganhar', 'vincere, guadagnare', '', { part: 'ganho' }); def('gastar', 'spendere, consumare', '', { part: 'gasto' }); def('pagar', 'pagare', '', { part: 'pago' });
  def('aceitar', 'accettare', '', { part: 'aceito' }); def('entregar', 'consegnare', '', { part: 'entregue' }); def('eleger', 'eleggere', '', { part: 'eleito' });
  def('morrer', 'morire', '', { part: 'morto' }); def('prender', 'arrestare, fissare', '', { part: 'preso' });

  // Regolari e con solo ortografia
  bulk('falar:parlare|trabalhar:lavorare|estudar:studiare|morar:abitare|comprar:comprare|cantar:cantare|dançar:ballare|chamar:chiamare|precisar:aver bisogno di|tomar:prendere, bere|' +
       'levar:portare, indossare|olhar:guardare|escutar:ascoltare|procurar:cercare|buscar:cercare, andare a prendere|chegar:arrivare|tocar:toccare, suonare|tirar:togliere|cozinhar:cucinare|limpar:pulire|ajudar:aiutare|usar:usare|' +
       'esperar:aspettare, sperare|viajar:viaggiare|mudar:cambiare, traslocare|explicar:spiegare|praticar:praticare|lembrar:ricordare|cortar:tagliare|jogar:giocare|gostar:piacere, gradire|começar:cominciare|' +
       'almoçar:pranzare|jantar:cenare|acordar:svegliarsi, accordare|andar:camminare|encontrar:trovare, incontrare|pensar:pensare|achar:trovare, pensare|ficar:restare, diventare|deixar:lasciare|' +
       'pegar:prendere|carregar:caricare|apagar:spegnere, cancellare|desligar:spegnere|ligar:accendere, chiamare|entrar:entrare|mostrar:mostrare|voltar:tornare|casar:sposare|namorar:fidanzarsi|' +
       'comer:mangiare|beber:bere|vender:vendere|correr:correre|aprender:imparare|entender:capire|receber:ricevere|resolver:risolvere|esquecer:dimenticare|conhecer:conoscere|parecer:sembrare|' +
       'crescer:crescere|nascer:nascere|merecer:meritare|oferecer:offrire|agradecer:ringraziare|aparecer:apparire|escolher:scegliere|mexer:muovere|responder:rispondere|temer:temere|' +
       'partir:partire, dividere|decidir:decidere|discutir:discutere|assistir:assistere, guardare|existir:esistere|cumprir:compiere, rispettare|sofrir:soffrire|permitir:permettere|' +
       'dirigir:dirigere, guidare|exigir:esigere|surgir:sorgere|agir:agire|atingir:raggiungere|proteger:proteggere|vencer:vincere|convencer:convincere|aquecer:riscaldare|' +
       'lavar:lavare|levantar:alzare|deitar:coricare|acostumar:abituare', '');

  // ---------------------------------------------------------------- descrizioni delle irregolarità
  function notes(inf) {
    var e = V[inf];
    if (!e) return ['Verbo non presente nell\'elenco: è mostrata la coniugazione regolare, che potrebbe non essere corretta se il verbo è irregolare.'];
    var out = [], t = e.tags, irr = e.irr;
    if (irr.full) out.push('Verbo molto irregolare: conviene impararlo a memoria.');
    if (t.indexOf('ei') >= 0) out.push('Alla 1ª persona del presente la vocale della radice cambia e → i (sinto, visto, sigo); anche tutto il congiuntivo presente usa questa radice (sinta, vista).');
    if (t.indexOf('ou') >= 0) out.push('Alla 1ª persona del presente la vocale della radice cambia o → u (durmo, cubro); anche tutto il congiuntivo presente usa questa radice (durma, cubra).');
    if (t.indexOf('uo') >= 0) out.push('Alla 2ª e 3ª persona del presente la u della radice diventa o (sobes, sobe; foges, foge); la 1ª persona resta regolare.');
    if (t.indexOf('ear') >= 0) out.push('I verbi in -ear aggiungono una i nelle forme accentate del presente (passeio, passeias, passeia, passeiam).');
    if (t.indexOf('iar-ei') >= 0) out.push('Verbo in -iar con presente in -eio (odeio, odeias, odeia, odeiam); nós resta regolare (odiamos).');
    if (t.indexOf('uir') >= 0) out.push('Verbo in -uir: presente in -uo, -uis, -ui, -uímos, -uem; la i dopo la u porta l\'accento al perfeito e al participio (incluí, incluído).');
    if (irr.yo && !irr.full) out.push('1ª persona del presente irregolare: ' + irr.yo + ' (la radice si ritrova in tutto il congiuntivo presente).');
    if (irr.pres && !irr.full) out.push('Presente irregolare: ' + irr.pres.join(', ') + '.');
    if (irr.ind && !irr.full) out.push('Pretérito perfeito con radice irregolare (' + irr.ind[0] + ', ' + irr.ind[2] + '…): la forma di "eles" si ritrova nell\'imperfeito e nel futuro do subjuntivo.');
    if (irr.futStem) out.push('Futuro e condizionale con radice irregolare (' + irr.futStem + 'ei, ' + irr.futStem + 'ia).');
    if (irr.part) out.push('Participio irregolare: ' + irr.part + '.');
    var sp = '';
    if (/car$/.test(inf)) sp = 'c → qu davanti a e (busquei, busque)';
    else if (/çar$/.test(inf)) sp = 'ç → c davanti a e (comecei, comece)';
    else if (/gar$/.test(inf)) sp = 'g → gu davanti a e (paguei, pague)';
    else if (/g[ei]r$/.test(inf)) sp = 'g → j davanti a o/a (dirijo, dirija)';
    else if (/gu[ei]r$/.test(inf)) sp = 'gu → g davanti a o/a (sigo, siga)';
    else if (/c[ei]r$/.test(inf)) sp = 'c → ç davanti a o/a (conheço, conheça)';
    if (sp) out.push('Cambio ortografico: ' + sp + '.');
    if (!out.length) out.push('Verbo regolare.');
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
  function plain(s) { return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
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

  // Verbi dell'elenco simili a quello scritto (errori di battitura, lettere mancanti): "dir" → dar, decir, ir…
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

  // Un infinito plausibile ha almeno una vocale prima della desinenza (ser, ver, dar, ir sono in elenco e non passano di qui).
  function plausible(inf) { return /[aeiouáàâãéêíóôõúü]/.test(inf.slice(0, -2)); }

  // Normalizza quello che l'utente scrive: minuscole, senza spazi; ritorna null se non è un infinito.
  function parse(text) {
    var t = String(text || '').trim().toLowerCase().normalize('NFC');
    if (!/^[a-záàâãéêíóôõúüç-]{2,}$/.test(t)) return null;
    if (/-se$/.test(t) && /(ar|er|ir|ôr|or)$/.test(t.slice(0, -3))) return { inf: t.slice(0, -3), reflexive: true };
    if (/(ar|er|ir|ôr|or)$/.test(t)) return { inf: t, reflexive: false };
    return null;
  }

  return {
    PERSONS: PERSONS, IMP_PERSONS: IMP_PERSONS, TENSES: TENSES, verbs: V, full: full, conj: conj, parse: parse, suggest: suggest, plausible: plausible,
    list: function () { return Object.keys(V).sort(function (a, b) { return a.localeCompare(b, 'pt'); }); },
    irregularTop: ['ser', 'estar', 'ir', 'ter', 'fazer', 'poder', 'querer', 'dizer', 'vir', 'pôr', 'saber', 'ver', 'dar', 'sair', 'trazer', 'ouvir', 'cair', 'haver',
                   'pedir', 'dormir', 'vestir', 'seguir', 'sentir', 'perder', 'ler', 'rir', 'crer', 'construir', 'caber', 'valer', 'subir', 'fugir', 'abrir', 'escrever', 'ganhar', 'pagar', 'manter', 'compor']
  };
})();
