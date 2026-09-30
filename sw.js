const C='bob-v8';
const A=['./','./index.html','./style.css','./app.js','./manifest.webmanifest','./icon.svg','./brand-logo.svg'];
self.addEventListener('install',e=>e.waitUntil(Promise.all([caches.open(C).then(c=>c.addAll(A)),self.skipWaiting()])));
self.addEventListener('activate',e=>e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==C).map(k=>caches.delete(k))))])));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));