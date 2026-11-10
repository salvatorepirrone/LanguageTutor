// Pagina delle lingue: dopo l'accesso si sceglie quale tutor aprire. Ogni lingua ha il suo livello, il suo piano e i suoi progressi.
(function () {
  'use strict';
  var LANGS = [
    { id: 'es', flag: '🇪🇸', title: 'Spagnolo', text: 'Spagnolo della Spagna: conversazione, esercizi, grammatica, vocabolario, verbi e test.' },
    { id: 'pt', flag: '🇧🇷', title: 'Portoghese', text: 'Portoghese del Brasile: conversazione, esercizi, grammatica, vocabolario, verbi e test.' },
    { id: 'en', flag: '🇬🇧', title: 'Inglese', text: 'Inglese britannico: conversazione, esercizi, grammatica, vocabolario, verbi e test.' }
  ];
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined && text !== null) e.textContent = text;
    return e;
  }
  function api(method, path) {
    return fetch(path, { method: method, credentials: 'same-origin', headers: { 'X-Requested-With': 'tutor' } })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, ok: r.ok, json: j }; }); })
      .catch(function () { return { status: 0, ok: false, json: {} }; });
  }

  var main = document.getElementById('main');
  api('GET', '/api/auth/me').then(function (r) {
    if (r.status === 401) { location.href = '/login.html'; return; }
    if (!r.ok) {   // per esempio variabili d'ambiente mancanti sul sito: meglio dirlo che mostrare una pagina con dati vuoti
      main.appendChild(el('div', 'card err', 'Impossibile aprire Language Tutor: ' + (r.json.error || 'il server non risponde') + '.'));
      return;
    }
    var me = r.json;
    var box = document.getElementById('me');
    var a = el('a', '', '👤 ' + me.user); a.href = '/account.html'; box.appendChild(a);
    if (me.role === 'admin') { var ad = el('a', '', 'Accessi'); ad.href = '/admin.html'; box.appendChild(ad); }
    var out = el('button', 'small', 'Esci');
    out.style.background = 'rgba(255,255,255,.16)'; out.style.color = '#fff'; out.style.border = '0';
    out.addEventListener('click', function () {
      fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin', headers: { 'X-Requested-With': 'tutor' } }).then(function () { location.href = '/login.html'; });
    });
    box.appendChild(out);

    main.appendChild(el('h2', '', 'Ciao, ' + me.user + ' 👋'));
    main.appendChild(el('p', 'muted', 'Scegli la lingua che vuoi studiare. Con lo stesso accesso trovi tutte le lingue; ognuna parte dal test di livello e prepara un piano sul tuo livello.'));
    var grid = el('div', 'langs'); main.appendChild(grid);
    LANGS.forEach(function (L) {
      var card = el('a', 'langcard'); card.href = '/' + L.id + '/';
      card.appendChild(el('div', 'flag', L.flag));
      card.appendChild(el('h3', '', L.title));
      card.appendChild(el('div', 'muted', L.text));
      var lvl = el('div', 'lvl', ' '); card.appendChild(lvl);
      card.appendChild(el('div', 'go', 'Apri →'));
      grid.appendChild(card);
      api('GET', '/api/' + L.id).then(function (s) {
        if (!s.ok) { lvl.textContent = ''; return; }
        var j = s.json;
        lvl.textContent = j.needsPlacement ? 'Da iniziare: ti propongo il test di livello' : 'Livello ' + j.profile.label + ' · settimana ' + (j.week + 1) + ' di ' + j.plan.length + (j.stats && j.stats.streak ? ' · 🔥 ' + j.stats.streak + ' giorni' : '');
      });
    });
  });
})();
