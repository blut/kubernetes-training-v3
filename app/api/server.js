'use strict';

// Übungs-API: absichtlich abhängigkeitsfrei (nur Node-Bordmittel), damit
// der Docker-Build ohne npm install / Internetzugang funktioniert.
const http = require('http');

const PORT = process.env.PORT || 8080;
const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:9090';
const API_TOKEN = process.env.API_TOKEN || '';
const FAIL_MODE = process.env.FAIL_MODE || ''; // '', 'unready' oder 'crash'

function fetchBackend(pathname) {
  return new Promise((resolve, reject) => {
    const url = new URL(pathname, BACKEND_URL);
    http
      .get(url, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      })
      .on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/health') {
    // Liveness: beantwortet nur "läuft der Prozess", ohne Backend zu prüfen.
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
    return;
  }

  if (req.url === '/ready') {
    // Readiness: prüft, ob die API tatsächlich Traffic bedienen kann.
    if (FAIL_MODE === 'unready') {
      res.writeHead(503, { 'Content-Type': 'text/plain' });
      res.end('not ready (FAIL_MODE=unready)');
      return;
    }
    try {
      const backend = await fetchBackend('/health');
      if (backend.status === 200) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('ready');
      } else {
        res.writeHead(503, { 'Content-Type': 'text/plain' });
        res.end('backend not healthy');
      }
    } catch (err) {
      res.writeHead(503, { 'Content-Type': 'text/plain' });
      res.end(`backend unreachable: ${err.message}`);
    }
    return;
  }

  if (req.url === '/api/items') {
    if (API_TOKEN && req.headers['x-api-token'] !== API_TOKEN) {
      res.writeHead(401, { 'Content-Type': 'text/plain' });
      res.end('missing or invalid x-api-token header');
      return;
    }
    try {
      const backend = await fetchBackend('/items');
      res.writeHead(backend.status, { 'Content-Type': 'application/json' });
      res.end(backend.body);
    } catch (err) {
      res.writeHead(502, { 'Content-Type': 'text/plain' });
      res.end(`backend error: ${err.message}`);
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('not found');
});

server.listen(PORT, () => {
  console.log(`api listening on ${PORT}, backend=${BACKEND_URL}`);
});

if (FAIL_MODE === 'crash') {
  // Simuliert einen Absturz nach einer Weile, z. B. für CrashLoopBackOff-Übungen.
  const delayMs = Number(process.env.CRASH_AFTER_MS || 45000);
  setTimeout(() => {
    console.error('simulated crash (FAIL_MODE=crash)');
    process.exit(1);
  }, delayMs);
}
