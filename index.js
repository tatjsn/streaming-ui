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
<head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="stylesheet" type="text/css" href="/build/index.css" />
</head>
<body>
<div class="container">
  <div class="header">
    <div>Header</div>
    <div></div>
    <div>
      Stocks:
      APPL:<lol-suspense match="appl"><div class="loading"></div></lol-suspense> |
      GOOG:<lol-suspense match="goog"><div class="loading"></div></lol-suspense>
    </div>
  </div>
  <div class="content">
    <div class="box">
      <h1>Main Content</h1>
      <p>CSS Grid Layout is a two-dimensional layout system for the web. It lets you lay content out in rows and columns. It has many features that make building complex layouts straightforward. This article will explain all you need to know to get started with page layout.</p>
      <p>CSS Grid Layout is a two-dimensional layout system for the web. It lets you lay content out in rows and columns. It has many features that make building complex layouts straightforward. This article will explain all you need to know to get started with page layout.</p>
      <p>CSS Grid Layout is a two-dimensional layout system for the web. It lets you lay content out in rows and columns. It has many features that make building complex layouts straightforward. This article will explain all you need to know to get started with page layout.</p>
    </div>
  </div>
  <div class="footer">Footer (c) 2022</div>
</div>
<script src="/build/index.js"></script>
  `);

  // Load slow dependencies
  await Promise.all([
    new Promise(r => setTimeout(r, 2000)).then(() => {
      res.write(html`<template id="appl">
        <span>172.14 &#10548;&#65039;</span>
      </template>`);
    }),
    new Promise(r => setTimeout(r, 4000)).then(() => {
      res.write(html`<template id="goog">
        <span>2700.00 &#10549;&#65039;</span>
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
