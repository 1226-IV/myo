/* Offline-Betrieb: App-Dateien und Schriften kommen aus dem Cache und werden im Hintergrund aktualisiert.
   Anfragen an Supabase (Login, Sync) gehen immer direkt ins Netz. */
const CACHE='myo-v1';
const SHELL=['./','./index.html','./config.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  const own=u.origin===self.location.origin,font=u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
  if(!own&&!font)return;
  e.respondWith(caches.open(CACHE).then(c=>c.match(e.request,{ignoreSearch:own}).then(hit=>{
    const net=fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque'))c.put(e.request,r.clone());return r}).catch(()=>hit||(e.request.mode==='navigate'?c.match('./'):undefined));
    return hit||net;
  })));
});
