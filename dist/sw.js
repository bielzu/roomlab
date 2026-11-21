const CACHE='roomlab-v4.2-2026-11-19';
const ASSETS=['./','./index.html','./style.css','./app.js','./planner.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./vendor/three.module.js','./vendor/three.core.js','./vendor/OrbitControls.js'];
const urls=new Set(ASSETS.map(p=>new URL(p,self.registration.scope).href));
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('roomlab-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||!urls.has(event.request.url))return;
 event.respondWith((async()=>{const c=await caches.open(CACHE);if(event.request.mode==='navigate'){try{const r=await fetch(event.request);if(r.ok&&!r.redirected){await c.put(event.request,r.clone());return r;}return r;}catch{ return await c.match(event.request)||await c.match('./index.html'); }}return await c.match(event.request)||fetch(event.request);})());
});
