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

app.get('/', async (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  res.write(html`<!DOCTYPE html>
    <html>
    <body>
      <h1>Hello from slow content</h1>
      <p>Main content</p>
      <p>Main content</p>
      <div id="ph">(placeholder)</div>
      <p>Main content</p>
      <p>End of contentful part</p>
      <script>
        function callback(mutations, observer) {
          const m = mutations[0];
          if (m.type === 'childList' &&
              m.addedNodes[0] &&
              m.addedNodes[0].tagName === 'TEMPLATE') {
            console.log('template added');
            const tmpl = m.addedNodes[0];
            const target = document.getElementById('ph');
            while (target.firstChild) {
              target.removeChild(target.firstChild);
            }
            target.appendChild(tmpl.content.cloneNode(true));
          }
        }
        const observer = new MutationObserver(callback);
        const config = { attributes: true, childList: true, subtree: false };
        observer.observe(document.body, config);
      </script>
  `);

  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 1000));

    res.write(html`<template id="tmpl${i}">
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
