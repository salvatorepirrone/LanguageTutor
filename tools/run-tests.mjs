// Esegue in Node le prove del backend di tutte le lingue e dell'adattatore Redis (archivio in memoria, Claude simulato): non serve rete né chiavi.
//   node tools/run-tests.mjs
let bad = false;
for (const name of ['backend', 'pt', 'en', 'redis']) {
  const m = await import('../netlify/test/' + name + '.test.mjs');
  const r = await m.run();
  console.log(`${name}: ${r.total - r.failures}/${r.total} prove superate`);
  for (const line of r.results) if (!line.startsWith('OK')) console.log('  ' + line);
  if (r.failures) bad = true;
}
process.exit(bad ? 1 : 0);
