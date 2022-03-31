const express = require('express');

const app = express();

function html(strings, ...keys) {
  const results = [];
  const s = Array.from(strings);
  const k = Array.from(keys);
  while (s.length || k.length) {
    if (s.length) results.push(s.shift());
    if (k.length) results.push(k.shift());
  }
  return results.join('');
}

app.use('/build', express.static('client/build'));

app.get('/', async (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  res.write(html`<!DOCTYPE html>
    <html>
    <body>
      <h1>Hello from slow content</h1>
      <p>Main content</p>
      <p>Main content</p>
      <lol-suspense match="^tmpl-"></lol-suspense>
      <p>Main content</p>
      <p>End of contentful part</p>
      <script src="/build/index.js"></script>
  `);

  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 1000));

    res.write(html`<template id="tmpl-${i}">
      <p>Chunked content ${i + 1}/10</p>
    </template>`);
  }

  res.write(html`
     </body>
   </html>
  `);
  res.end();
});


app.listen(5000);
console.log('running...');
