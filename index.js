const express = require('express');

const app = express();

// For cosmetic purpose
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
      <lol-suspense match="^widget1">
        <p>Loading...</p>
      </lol-suspense>
      <lol-suspense match="^widget2">
        <p>Loading...</p>
      </lol-suspense>
      <lol-suspense match="^widget3">
        <p>Loading...</p>
      </lol-suspense>
      <p>Main content</p>
      <p>End of contentful part</p>
      <script src="/build/index.js"></script>
  `);

  // Load slow dependencies
  await Promise.all([
    new Promise(r => setTimeout(r, 1000)).then(() => {
      res.write(html`<template id="widget1">
        <p>Widget 1 loaded</p>
      </template>`);
    }),
    new Promise(r => setTimeout(r, 2000)).then(() => {
      res.write(html`<template id="widget2">
        <p>Widget 2 loaded</p>
      </template>`);
    }),
    new Promise(r => setTimeout(r, 3000)).then(() => {
      res.write(html`<template id="widget3">
        <p>Widget 3 loaded</p>
      </template>`);
    }),
  ]);

  res.write(html`
     </body>
   </html>
  `);
  res.end();
});


app.listen(5000);
console.log('running...');
