'use strict';

// Backend-Simulation: persistiert Einträge in einer Datei (Volume-Übung).
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 9090;
const DATA_FILE = process.env.DATA_FILE || '/data/items.json';

function readItems() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeItems(items) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
    return;
  }

  if (req.url === '/items' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(readItems()));
    return;
  }

  if (req.url === '/items' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      let parsed;
      try {
        parsed = JSON.parse(body || '{}');
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('invalid json body');
        return;
      }
      const items = readItems();
      items.push({ text: parsed.text || '(kein text)', createdAt: new Date().toISOString() });
      writeItems(items);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(items));
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('not found');
});

server.listen(PORT, () => {
  console.log(`backend listening on ${PORT}, data file=${DATA_FILE}`);
});
