/* POS Manager · funciona sin internet: guarda la app en el teléfono */
const CACHE = 'pos-manager-202611011946';
const FILES = ['./', './index.html', './manifest.webmanifest', './libs/xlsx.full.min.js', './libs/jspdf.umd.min.js', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-180.png', './fonts/fonts.css', './fonts/plus-jakarta-sans-latin-400-normal.woff2', './fonts/plus-jakarta-sans-latin-500-normal.woff2', './fonts/plus-jakarta-sans-latin-600-normal.woff2', './fonts/plus-jakarta-sans-latin-700-normal.woff2', './fonts/plus-jakarta-sans-latin-800-normal.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // la app: primero intenta la versión nueva (si hay internet), si no usa la guardada
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return r; }).catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
  } else if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return r; }).catch(() => hit)));
  }
});
