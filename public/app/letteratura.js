// Sezione Letteratura (versioni per medici): articoli scientifici reali da PubMed, con una scheda di studio per ciascuno
// (terminologia, strutture tipiche degli abstract, domande di comprensione) e il collegamento al journal club con il tutor.
(function () {
  'use strict';
  var el = SP.el;
  var TOPICS = [['Scompenso cardiaco', 'heart failure'], ['Fibrillazione atriale', 'atrial fibrillation'], ['Sindromi coronariche acute', 'acute coronary syndrome'],
    ['Valvulopatie e TAVI', 'aortic stenosis transcatheter valve'], ['Ipertensione', 'hypertension blood pressure'], ['Lipidi e prevenzione', 'lipid lowering cardiovascular prevention'],
    ['Cardiomiopatie', 'cardiomyopathy'], ['Linee guida e consensus', 'guideline consensus statement'], ['Intelligenza artificiale in cardiologia', 'artificial intelligence electrocardiogram'],
    ['Imaging cardiaco', 'cardiac imaging echocardiography MRI']];

  function mount(root, arg) {
    var page = el('div', 'page');
    page.appendChild(el('h2', '', 'Letteratura scientifica'));
    page.appendChild(el('p', 'muted', 'Articoli reali e recenti da PubMed (ultimi tre anni, con abstract, in inglese). Per ogni articolo ricavo una scheda di studio: la terminologia tecnica come si usa davvero, le strutture tipiche degli abstract e qualche domanda di comprensione. Poi puoi discuterlo con il tutor come in un journal club. L\'abstract non viene riprodotto: sta sempre a PubMed.'));
    var card = el('div', 'card');
    var row = el('div', 'row');
    var sel = el('select'); sel.setAttribute('aria-label', 'Argomento');
    TOPICS.forEach(function (t) { var o = el('option', '', t[0]); o.value = t[1]; sel.appendChild(o); });
    var free = el('input'); free.type = 'text'; free.placeholder = 'oppure cerca (in inglese), per esempio sacubitril valsartan'; free.setAttribute('aria-label', 'Ricerca libera');
    var go = el('button', 'primary', 'Cerca articoli');
    row.appendChild(sel); row.appendChild(free); row.appendChild(go);
    card.appendChild(row);
    page.appendChild(card);
    var out = el('div'); page.appendChild(out);
    root.appendChild(page);

    function search() {
      SP.clear(out);
      var stop = SP.loading(out, 'Cerco su PubMed…');
      SP.call({ action: 'lit_search', query: free.value.trim() || sel.value }).then(function (r) {
        stop();
        if (!r.items.length) { out.appendChild(el('p', 'muted', 'Nessun articolo trovato: prova con altre parole.')); return; }
        r.items.forEach(function (a) {
          var c = el('div', 'card');
          c.appendChild(el('b', '', a.title));
          c.appendChild(el('div', 'muted', [a.authors, a.journal, a.year].filter(Boolean).join(' · ')));
          var b = el('button', 'small', 'Apri la scheda di studio'); b.style.marginTop = '8px';
          b.addEventListener('click', function () { SP.go('letteratura', a.pmid); });
          c.appendChild(b); out.appendChild(c);
        });
      }).catch(function (e) { stop(); out.appendChild(el('div', 'err', e.message)); });
    }
    go.addEventListener('click', search);
    free.addEventListener('keydown', function (e) { if (e.key === 'Enter') search(); });

    if (arg) sheet(out, arg);
  }

  function sheet(out, pmid) {
    SP.clear(out);
    var back = el('a', 'back', '← Torna all\'elenco'); back.href = '#/letteratura'; out.appendChild(back);
    var stop = SP.loading(out, 'Preparo la scheda di studio… (la prima volta ci vuole qualche secondo, poi resta salvata)');
    SP.call({ action: 'lit_read', pmid: pmid }).then(function (r) {
      stop();
      var a = r.article, s = r.sheet;
      var head = el('div', 'card');
      head.appendChild(el('h3', '', a.title));
      head.appendChild(el('div', 'muted', a.journal + ' · ' + a.year));
      var link = el('a', '', 'Apri su PubMed (PMID ' + a.pmid + ')'); link.href = a.url; link.target = '_blank'; link.rel = 'noopener';
      head.appendChild(link);
      head.appendChild(el('p', '', s.summary));
      var club = el('button', 'primary', 'Discuti l\'articolo con il tutor (journal club)');
      club.addEventListener('click', function () { SP.pref('mode', 'conversazione'); SP.pref('scenario', 'journalclub'); SP.pref('pmid', a.pmid); SP.go('conversazione'); });
      head.appendChild(club);
      out.appendChild(head);

      var tc = el('div', 'card');
      tc.appendChild(el('h3', '', 'Terminologia dell\'articolo'));
      var tb = el('table', 'conj'), body = el('tbody');
      s.terms.forEach(function (t) {
        var tr = el('tr'), c1 = el('td', 'pn'), c2 = el('td');
        c1.appendChild(el('b', '', t.term + ' ')); c1.appendChild(SP.speakButton(t.term));
        c2.appendChild(document.createTextNode(t.it + (t.type ? ' (' + t.type + ')' : '')));
        if (t.def) c2.appendChild(el('div', 'muted', t.def));
        if (t.example) c2.appendChild(el('div', 'muted', '«' + t.example + '»'));
        if (t.note) c2.appendChild(el('div', 'muted', t.note));
        tr.appendChild(c1); tr.appendChild(c2); body.appendChild(tr);
      });
      tb.appendChild(body); tc.appendChild(tb);
      var add = el('button', '', 'Aggiungi i termini al mazzo di ripasso'); add.style.marginTop = '8px';
      add.addEventListener('click', function () {
        add.disabled = true;
        SP.call({ action: 'lit_deck_add', pmid: a.pmid }).then(function (x) { add.textContent = x.added + ' termini aggiunti al mazzo'; }).catch(function (e) { add.disabled = false; tc.appendChild(el('div', 'err', e.message)); });
      });
      tc.appendChild(add);
      out.appendChild(tc);

      if (s.patterns.length) {
        var pc = el('div', 'card');
        pc.appendChild(el('h3', '', 'Strutture tipiche degli abstract'));
        s.patterns.forEach(function (p) {
          var d = el('div'); d.style.margin = '8px 0';
          d.appendChild(el('b', '', p.pattern)); d.appendChild(document.createTextNode(' — ' + p.it));
          if (p.example) d.appendChild(el('div', 'muted', '«' + p.example + '»'));
          pc.appendChild(d);
        });
        out.appendChild(pc);
      }

      var qc = el('div', 'card');
      qc.appendChild(el('h3', '', 'Domande di comprensione'));
      s.questions.forEach(function (q, n) {
        var d = el('div'); d.style.margin = '12px 0';
        d.appendChild(el('div', '', (n + 1) + '. ' + q.q));
        var res = el('div');
        var opts = el('div', 'opts');
        q.options.forEach(function (o, k) {
          var b = el('button', '', o);
          b.addEventListener('click', function () {
            Array.prototype.forEach.call(opts.querySelectorAll('button'), function (x) { x.disabled = true; });
            var ok = k === q.answer;
            res.className = 'verdict ' + (ok ? 'ok' : 'ko');
            res.textContent = ok ? 'Giusto! ' : 'Non proprio: ' + q.options[q.answer] + '. ';
            if (q.why) res.appendChild(el('div', 'why', q.why));
          });
          opts.appendChild(b);
        });
        d.appendChild(opts); d.appendChild(res); qc.appendChild(d);
      });
      s.cloze.forEach(function (c, n) {
        var d = el('div'); d.style.margin = '12px 0';
        d.appendChild(el('div', '', (s.questions.length + n + 1) + '. ' + c.q));
        var inp = el('input'); inp.type = 'text'; inp.placeholder = 'Il termine mancante'; inp.autocapitalize = 'off'; inp.spellcheck = false;
        var b = el('button', 'small', 'Controlla'), res = el('div');
        function check() {
          if (!inp.value.trim()) return;
          var r2 = SP.compare(inp.value, c.answer, [], { articles: true });
          res.className = 'verdict ' + (r2 === 'no' ? 'ko' : 'ok');
          res.textContent = r2 === 'no' ? 'Non proprio: ' + c.answer : r2 === 'accent' ? 'Giusto, attento all\'ortografia: ' + c.answer : 'Giusto!';
          if (c.why) res.appendChild(el('div', 'why', c.why));
        }
        b.addEventListener('click', check);
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); check(); } });
        d.appendChild(inp); d.appendChild(b); d.appendChild(res); qc.appendChild(d);
      });
      out.appendChild(qc);
    }).catch(function (e) { stop(); out.appendChild(el('div', 'err', e.message)); });
  }

  SP.sections.letteratura = { mount: mount };
})();
