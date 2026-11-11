/* Offline-Betrieb für Myo.
   Eigene Dateien: zuerst aus dem Netz (damit Updates sofort ankommen), bei schlechtem oder fehlendem Netz aus dem Speicher.
   Schriften: aus dem Speicher. Supabase (Login, Sync) geht immer direkt ins Netz. */
const CACHE='myo-v5';
const SHELL=['./','./index.html','./config.js','./version.json','./manifest.webmanifest','./icons/favicon-32.png','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
function fromCache(c,req){return c.match(req,{ignoreSearch:true}).then(h=>h||(req.mode==='navigate'?c.match('./'):undefined))}
function networkFirst(req){
  return caches.open(CACHE).then(c=>new Promise(resolve=>{
    let done=false;const finish=r=>{if(!done){done=true;resolve(r)}};
    const timer=setTimeout(()=>fromCache(c,req).then(h=>{if(h)finish(h)}),2500);
    const fresh=req.mode==='navigate'?new Request(req.url,{cache:'no-cache',credentials:'same-origin'}):new Request(req,{cache:'no-cache'});
    fetch(fresh).then(r=>{clearTimeout(timer);if(r&&r.ok)c.put(req,r.clone());finish(r)})
      .catch(()=>{clearTimeout(timer);fromCache(c,req).then(h=>finish(h||Response.error()))});
  }));
}
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin===self.location.origin){e.respondWith(networkFirst(e.request));return}
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.open(CACHE).then(c=>c.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque'))c.put(e.request,r.clone());return r}))));
  }
});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{for(const c of cs){if('focus' in c)return c.focus()}return self.clients.openWindow('./')}))});
