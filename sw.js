const C='bob-v12';
const CORE=['./','./index.html','./style.css?v=12','./app.js?v=12','./manifest.webmanifest?v=12','./brand-logo.svg?v=12','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil(Promise.all([caches.open(C).then(c=>c.addAll(CORE)),self.skipWaiting()])));
self.addEventListener('activate',e=>e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==C).map(k=>caches.delete(k))))])));
self.addEventListener('fetch',e=>{
  const req=e.request,u=new URL(req.url);
  if(req.mode==='navigate'||u.pathname.endsWith('/app.js')||u.pathname.endsWith('/style.css')||u.pathname.endsWith('/manifest.webmanifest')){
    e.respondWith(fetch(req,{cache:'no-store'}).then(r=>{const copy=r.clone();caches.open(C).then(c=>c.put(req,copy));return r}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(r=>r||fetch(req)));
});