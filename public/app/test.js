// Sezione Test: verifica di livello (20 domande + produzione scritta) e riepilogo dei progressi.
(function () {
  'use strict';
  var el = SP.el;
  var SECTION_LABEL = { tempi: 'Tempi verbali', forme: 'Pronomi, preposizioni e forme', lessico: 'Vocabolario', comprensione: 'Comprensione scritta' };
  var WEIGHT = { A2: 1, B1: 2, B2: 3, C1: 4 };
  if (TUTOR.lessicoLabel) SECTION_LABEL.lessico = TUTOR.lessicoLabel;   // nelle versioni per medici la sezione «lessico» è la terminologia

  // Le lingue con meno livelli (versioni per medici) usano soglie proprie e livelli adattati a quelli disponibili.
  var ORDER = ['A2', 'B1-', 'B1', 'B1+', 'B2', 'C1'];
  function fit(level) {
    var ls = (SP.catalog && SP.catalog.levels) || ORDER, i = ORDER.indexOf(level);
    if (ls.indexOf(level) >= 0) return level;
    for (var d = 1; d < ORDER.length; d++) {
      if (ORDER[i + d] && ls.indexOf(ORDER[i + d]) >= 0) return ORDER[i + d];
      if (ORDER[i - d] && ls.indexOf(ORDER[i - d]) >= 0) return ORDER[i - d];
    }
    return ls[0];
  }
  function estimate(ratio) {
    if (TUTOR.levelCuts) { for (var k = 0; k < TUTOR.levelCuts.length; k++) if (ratio < TUTOR.levelCuts[k][0]) return TUTOR.levelCuts[k][1]; return 'C1'; }
    return fit(ratio < 0.33 ? 'A2' : ratio < 0.48 ? 'B1-' : ratio < 0.62 ? 'B1' : ratio < 0.74 ? 'B1+' : ratio < 0.88 ? 'B2' : 'C1');
  }
  var LEVEL_TEXT = {
    'A2': 'A2: base solida da consolidare',
    'B1-': 'appena sotto il B1: ci sei quasi',
    'B1': 'B1: livello raggiunto',
    'B1+': 'B1 pieno, con basi del B2',
    'B2': 'B2: upper-intermediate, puntando al C1',
    'C1': 'C1: livello avanzato'
  };

  var placement = false;   // true quando il test serve a stabilire il livello di partenza

  function intro(root, arg) {
    placement = arg === 'placement' || !!(SP.catalog && SP.catalog.needsPlacement && arg !== 'normal');
    var page = el('div', 'page');
    page.appendChild(el('h2', '', placement ? 'Test di ingresso' : 'Test di livello'));
    if (placement) {
      page.appendChild(el('p', 'muted', 'Serve a capire da dove partire: in base al risultato preparo il piano di studio e adatto conversazione ed esercizi al tuo livello. Non è un esame: se non sai una risposta, scegli quella che ti sembra più naturale.'));
    }
    var c = el('div', 'card');
    c.appendChild(el('p', '', '20 domande a scelta multipla (tempi verbali, forme, vocabolario, comprensione) e un breve testo scritto, valutato dal tutor. Ogni volta le domande sono diverse. Richiede circa 15 minuti.'));
    c.appendChild(el('p', 'muted', 'È una stima indicativa, non una certificazione: serve a vedere i progressi ' + (TUTOR.deadlineLabel ? 'da qui al ' + TUTOR.deadlineLabel : 'nel tempo') + '. Consiglio un test a settimana.'));
    var start = el('button', 'primary', 'Inizia il test');
    c.appendChild(start);
    var area = el('div');
    page.appendChild(c);
    page.appendChild(area);
    var again = null;
    start.addEventListener('click', function () {
      start.disabled = true;
      var stop = SP.loading(c, 'Preparo il test… (può richiedere fino a un minuto)');
      SP.call({ action: 'test' }).then(function (t) { stop(); SP.clear(page); runTest(page, t); })
        .catch(function (e) { stop(); c.appendChild(el('div', 'err', e.message)); start.disabled = false; });
    });
    progress(page);
    root.appendChild(page);
  }

  // Andamento: percentuale di punti pesati (le risposte difficili contano di più) per giorno di esercizi e per test, con la media mobile.
  function trend(c, s) {
    var pts = [], byDay = {};
    (s.series || []).forEach(function (x) {
      var d = byDay[x.t] = byDay[x.t] || { t: x.t, wn: 0, wc: 0, n: 0 };
      d.wn += x.wn; d.wc += x.wc; d.n += x.n;
    });
    Object.keys(byDay).sort().forEach(function (k) { var d = byDay[k]; if (d.wn > 0) pts.push({ t: k, v: d.wc / d.wn, kind: 'ex', n: d.n }); });
    (s.tests || []).forEach(function (t) { if (t.wtotal > 0) pts.push({ t: t.t, v: t.wcorrect / t.wtotal, kind: 'test', n: t.total }); });
    pts.sort(function (a, b) { return a.t < b.t ? -1 : a.t > b.t ? 1 : (a.kind < b.kind ? -1 : 1); });
    c.appendChild(el('h3', '', 'Andamento'));
    if (pts.length < 2) {
      c.appendChild(el('p', 'muted', 'L\'andamento compare dopo qualche giorno di esercizi o dopo un secondo test. Le risposte più difficili (B2, C1) valgono più di quelle facili: il punteggio è pesato.'));
      return;
    }
    var W = 320, H = 120, L = 28, B = 18, T = 8, R = 8;
    var NS = 'http://www.w3.org/2000/svg';
    function n(tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
    var svg = n('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', role: 'img', 'aria-label': 'Andamento del punteggio pesato' });
    svg.style.maxWidth = '520px';
    var xs = function (i) { return L + (pts.length === 1 ? 0 : i * (W - L - R) / (pts.length - 1)); };
    var ys = function (v) { return T + (1 - v) * (H - T - B); };
    [0, 0.5, 0.7, 1].forEach(function (g) {
      var ln = n('line', { x1: L, x2: W - R, y1: ys(g), y2: ys(g), stroke: 'currentColor', 'stroke-opacity': g === 0.7 ? 0.45 : 0.15, 'stroke-dasharray': g === 0.7 ? '4 3' : '' });
      svg.appendChild(ln);
      var tx = n('text', { x: L - 4, y: ys(g) + 3, 'text-anchor': 'end', 'font-size': 9, fill: 'currentColor', 'fill-opacity': 0.6 }); tx.textContent = Math.round(g * 100) + '%'; svg.appendChild(tx);
    });
    var avg = pts.map(function (p, i) {
      var from = Math.max(0, i - 2), sum = 0, k;
      for (k = from; k <= i; k++) sum += pts[k].v;
      return sum / (i - from + 1);
    });
    svg.appendChild(n('polyline', { points: avg.map(function (v, i) { return xs(i) + ',' + ys(v); }).join(' '), fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-opacity': 0.75 }));
    pts.forEach(function (p, i) {
      var dot = n(p.kind === 'test' ? 'rect' : 'circle', p.kind === 'test' ? { x: xs(i) - 4, y: ys(p.v) - 4, width: 8, height: 8, fill: '#c0392b' } : { cx: xs(i), cy: ys(p.v), r: 3.5, fill: '#2e8b57' });
      var tt = n('title', {}); tt.textContent = p.t + ' · ' + (p.kind === 'test' ? 'test' : 'esercizi') + ' · ' + Math.round(p.v * 100) + '% (' + p.n + ' risposte)'; dot.appendChild(tt);
      svg.appendChild(dot);
    });
    var first = n('text', { x: L, y: H - 4, 'font-size': 9, fill: 'currentColor', 'fill-opacity': 0.6 }); first.textContent = pts[0].t; svg.appendChild(first);
    var last = n('text', { x: W - R, y: H - 4, 'text-anchor': 'end', 'font-size': 9, fill: 'currentColor', 'fill-opacity': 0.6 }); last.textContent = pts[pts.length - 1].t; svg.appendChild(last);
    c.appendChild(svg);
    var tot = 0, totW = 0;
    Object.keys(s.exProgress || {}).forEach(function (k) { var e = s.exProgress[k]; tot += e.wdone !== undefined ? e.wdone : e.done; totW += e.wcorrect !== undefined ? e.wcorrect : e.correct; });
    c.appendChild(el('p', 'muted', '● esercizi (un punto al giorno) · ■ test · linea = media delle ultime tre misure. Punteggio pesato: A2 vale 1, B1 2, B2 3, C1 4' + (tot ? ' · negli esercizi finora: ' + Math.round(100 * totW / tot) + '%' : '') + '.'));
  }

  function progress(page) {
    var s = SP.stats;
    page.appendChild(el('div', 'sec-title', 'I miei progressi'));
    var c = el('div', 'card');
    c.appendChild(el('div', '', 'Giorni di pratica: ' + s.totalDays + ' · Serie attuale: ' + s.streak + ' · Parole nel mazzo: ' + s.vocabCount));
    trend(c, s);
    if (s.tests && s.tests.length) {
      c.appendChild(el('h3', '', 'Test svolti'));
      var bars = el('div', 'bars');
      s.tests.forEach(function (t) {
        var b = el('div'), pct = Math.round(100 * (t.wtotal > 0 ? t.wcorrect / t.wtotal : t.correct / t.total));
        b.style.height = Math.max(4, Math.round(0.5 * pct)) + 'px'; b.title = t.t + ': ' + pct + '%';
        bars.appendChild(b);
      });
      c.appendChild(bars);
      var ul = el('ul');
      s.tests.slice().reverse().forEach(function (t) {
        ul.appendChild(el('li', '', t.t + ' — ' + t.correct + '/' + t.total + (t.wtotal > 0 ? ' (pesato ' + Math.round(100 * t.wcorrect / t.wtotal) + '%)' : '') + (t.level ? ' · stima ' + t.level : '') + (t.writing >= 0 ? ' · scritto ' + t.writing + '/10' : '')));
      });
      c.appendChild(ul);
    } else {
      c.appendChild(el('p', 'muted', 'Non hai ancora fatto nessun test: il primo ti dà il punto di partenza.'));
    }
    var keys = Object.keys(s.topErrors || {});
    if (keys.length) {
      c.appendChild(el('h3', '', 'Dove sbagli di più'));
      var ul2 = el('ul'); keys.forEach(function (k) { ul2.appendChild(el('li', '', k + ': ' + s.topErrors[k])); }); c.appendChild(ul2);
    }
    if (s.recentErrors && s.recentErrors.length) {
      c.appendChild(el('h3', '', 'Ultimi errori'));
      s.recentErrors.forEach(function (e) {
        var d = el('div', 'mist');
        d.appendChild(el('span', 'w', e.orig)); d.appendChild(document.createTextNode(' → ')); d.appendChild(el('span', 'r', e.corr));
        if (e.note) d.appendChild(el('div', 'muted', e.note));
        c.appendChild(d);
      });
      var ex = el('button', '', 'Esercitati sui miei errori');
      ex.addEventListener('click', function () { SP.go('esercizi', 'errori'); });
      c.appendChild(ex);
    }
    page.appendChild(c);
  }

  function runTest(page, t) {
    page.appendChild(el('h2', '', 'Test di livello'));
    var items = t.items, picked = [];
    // Raggruppa per sezione mantenendo l'ordine di arrivo.
    var order = [], bySec = {};
    items.forEach(function (it, i) {
      var sec = it.section && SECTION_LABEL[it.section] ? it.section : 'forme';
      it.section = sec;
      if (!bySec[sec]) { bySec[sec] = []; order.push(sec); }
      bySec[sec].push(i);
    });
    var submit = el('button', 'primary', '');
    function refresh() {
      var left = items.length - picked.filter(function (x) { return x !== undefined; }).length;
      submit.disabled = left > 0;
      submit.textContent = left > 0 ? 'Rispondi a tutte le domande (' + left + ' mancanti)' : 'Concludi il test';
    }
    var n = 0;
    order.forEach(function (sec) {
      page.appendChild(el('div', 'sec-title', SECTION_LABEL[sec]));
      bySec[sec].forEach(function (i) {
        var it = items[i];
        var q = el('div', 'card q');
        q.appendChild(el('div', 'muted', 'Domanda ' + (++n)));
        if (it.text) q.appendChild(el('div', 'passage', it.text));
        q.appendChild(el('div', 'stem', it.q));
        var btns = [];
        it.options.forEach(function (o, k) {
          var b = el('button', 'choice', o);
          b.addEventListener('click', function () {
            picked[i] = k;
            btns.forEach(function (x, j) { x.classList.toggle('sel', j === k); });
            refresh();
          });
          btns.push(b); q.appendChild(b);
        });
        page.appendChild(q);
      });
    });

    page.appendChild(el('div', 'sec-title', 'Produzione scritta (facoltativa, consigliata)'));
    var w = el('div', 'card');
    w.appendChild(el('div', 'stem', t.writing));
    var ta = el('textarea'); ta.rows = 6; ta.style.width = '100%'; ta.style.maxHeight = 'none';
    ta.placeholder = 'Scrivi in ' + TUTOR.name + '…';
    w.appendChild(ta);
    page.appendChild(w);

    var fin = el('div', 'card');
    fin.appendChild(submit);
    page.appendChild(fin);
    refresh();

    submit.addEventListener('click', function () {
      submit.disabled = true;
      var text = ta.value.trim();
      var after = function (writing) { showResult(page, t, picked, writing, text); };
      if (text.length < 20) { after(null); return; }
      var stop = SP.loading(fin, 'Il tutor legge il tuo testo…');
      SP.call({ action: 'writing', prompt: t.writing, text: text })
        .then(function (r) { stop(); after(r); })
        .catch(function (e) { stop(); fin.appendChild(el('div', 'err', e.message + ' Puoi riprovare o svuotare il testo per concludere senza.')); submit.disabled = false; });
    });
  }

  function showResult(page, t, picked, writing, userText) {
    SP.clear(page);
    var items = t.items, correct = 0, wsum = 0, wmax = 0, secs = {}, errors = [];
    items.forEach(function (it, i) {
      var ok = picked[i] === it.answer, w = WEIGHT[it.level] || 2;
      wmax += w; if (ok) { correct++; wsum += w; }
      var s = secs[it.section] = secs[it.section] || { correct: 0, total: 0 };
      s.total++; if (ok) s.correct++;
      if (!ok) errors.push({ orig: it.options[picked[i]] || '', corr: it.options[it.answer], note: (it.q + ' ' + (it.why || '')).trim() });
    });
    var level = estimate(wsum / wmax);

    page.appendChild(el('h2', '', 'Risultato'));
    var top = el('div', 'card');
    top.appendChild(el('div', 'result', correct + ' / ' + items.length));
    top.appendChild(el('div', '', 'Stima: ' + (LEVEL_TEXT[level] || level)));
    Object.keys(secs).forEach(function (k) {
      var s = secs[k], row = el('div'), bar = el('div', 'progressbar'), f = el('i');
      f.style.width = Math.round(100 * s.correct / s.total) + '%'; bar.appendChild(f);
      row.appendChild(el('div', 'muted', SECTION_LABEL[k] + ': ' + s.correct + '/' + s.total));
      row.appendChild(bar); top.appendChild(row);
    });
    page.appendChild(top);

    if (writing) {
      var wc = el('div', 'card');
      wc.appendChild(el('h3', '', 'Testo scritto: ' + writing.score + '/10 · ' + writing.level));
      if (writing.comment) wc.appendChild(el('p', '', writing.comment));
      writing.corrections.forEach(function (c) {
        var d = el('div', 'mist');
        d.appendChild(el('span', 'w', c.original)); d.appendChild(document.createTextNode(' → ')); d.appendChild(el('span', 'r', c.corrected));
        if (c.note) d.appendChild(el('div', 'muted', c.note));
        wc.appendChild(d);
      });
      if (writing.improved) {
        wc.appendChild(el('h3', '', 'Versione migliorata'));
        var p = el('p', '', writing.improved + ' ');
        p.appendChild(SP.speakButton(writing.improved));
        wc.appendChild(p);
      }
      page.appendChild(wc);
    }

    var rev = el('div', 'card');
    rev.appendChild(el('h3', '', 'Rivedi le risposte'));
    items.forEach(function (it, i) {
      var ok = picked[i] === it.answer, d = el('div', 'verdict ' + (ok ? 'ok' : 'ko'));
      d.style.marginBottom = '8px';
      d.appendChild(el('div', '', (i + 1) + '. ' + (it.text ? it.text + ' — ' : '') + it.q));
      d.appendChild(el('div', '', ok ? '✓ ' + it.options[it.answer] : '✗ ' + (it.options[picked[i]] || '—') + '  →  ' + it.options[it.answer]));
      if (it.why) d.appendChild(el('div', 'why', it.why));
      rev.appendChild(d);
    });
    page.appendChild(rev);

    // Livello e piano: il test di ingresso li imposta; un test successivo propone di aggiornarli.
    var plan = el('div', 'card');
    page.insertBefore(plan, rev);
    var cur = SP.catalog && SP.catalog.profile ? SP.catalog.profile.level : null;
    function setLevel(label) {
      return SP.call({ action: 'profile_set', level: level, source: 'test' }).then(function () { return SP.reload(); });
    }
    if (placement) {
      var st = SP.loading(plan, 'Preparo il tuo piano…');
      setLevel().then(function () {
        st();
        plan.appendChild(el('h3', '', 'Il tuo punto di partenza: ' + (LEVEL_TEXT[level] || level)));
        plan.appendChild(el('p', '', 'Ho preparato un piano di 8 settimane per questo livello. Conversazione, esercizi e argomenti consigliati ora tengono conto del tuo livello.'));
        var go = el('button', 'primary', 'Vedi il mio piano');
        go.addEventListener('click', function () { SP.go('piano'); });
        plan.appendChild(go);
      }).catch(function (e) { st(); plan.appendChild(el('div', 'err', e.message)); });
    } else if (cur && cur !== level) {
      plan.appendChild(el('p', '', 'Il tuo piano è impostato sul livello «' + cur + '»; questo test indica «' + level + '».'));
      var up = el('button', 'primary', 'Aggiorna il mio piano a ' + level);
      up.addEventListener('click', function () {
        up.disabled = true;
        setLevel().then(function () { SP.go('piano'); }).catch(function (e) { plan.appendChild(el('div', 'err', e.message)); up.disabled = false; });
      });
      plan.appendChild(up);
      plan.appendChild(el('p', 'muted', 'Il piano ripartirà dalla settimana 1.'));
    } else {
      plan.appendChild(el('p', 'muted', 'Il livello stimato coincide con quello del tuo piano: nessuna modifica.'));
    }

    var back = el('button', '', 'Torna ai progressi');
    back.addEventListener('click', function () { SP.clear(SP.$('view')); SP.sections.test.mount(SP.$('view'), 'normal'); });
    page.appendChild(back);

    SP.call({
      action: 'test_result', correct: correct, total: items.length, wcorrect: wsum, wtotal: wmax, sections: secs, level: level,
      writing: writing ? writing.score : -1, errors: errors
    }).catch(function () {});
  }

  SP.sections.test = { mount: function (root, arg) { intro(root, arg); } };
})();
