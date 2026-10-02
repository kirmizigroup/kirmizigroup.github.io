// KG Saha Formları – service worker (sürüm: 78d6f0093b)
const CACHE = "kg-78d6f0093b";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.hostname.endsWith("script.google.com") || u.hostname.endsWith("googleusercontent.com")) return; // sunucu istekleri önbelleğe alınmaz
  if (u.origin === location.origin) { // kendi dosyalarımız: önce ağ, yoksa önbellek
    e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
    return;
  }
  // kütüphaneler ve yazı tipleri: önce önbellek, arkada güncelle
  e.respondWith(caches.open(CACHE).then(async c => { const hit = await c.match(e.request); const net = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit); return hit || net; }));
});
