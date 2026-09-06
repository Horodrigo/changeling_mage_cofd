const VERSION = "2026.09.06-1";
const CACHE = `characters-of-the-darkness-${VERSION}`;
const SHELL = ["/", "/manifest.webmanifest", "/favicon.svg", "/app-icon-192.png", "/app-icon-512.png", "/cod-emblem.png", "/changeling-sheet-frame.png", "/changeling-skull.png", "/mage-sheet-frame.png", "/mage-skull.png", "/version.json"];

self.addEventListener("install", (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL))));
self.addEventListener("activate", (event) => event.waitUntil(Promise.all([
  caches.keys().then((keys) => Promise.all(keys.filter((key) => (key.startsWith("arquivo-das-trevas-") || key.startsWith("characters-of-the-darkness-")) && key !== CACHE).map((key) => caches.delete(key)))),
  self.clients.claim(),
])));
self.addEventListener("message", (event) => { if (event.data?.type === "SKIP_WAITING") self.skipWaiting(); });
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;
  if (url.pathname === "/version.json") {
    event.respondWith(fetch(request).catch(()=>caches.match("/version.json").then((response)=>response || Response.error())));
    return;
  }
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then((response) => { const copy=response.clone();caches.open(CACHE).then((cache)=>cache.put("/",copy));return response; }).catch(()=>caches.match("/").then((response)=>response || Response.error())));
    return;
  }
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => { if(response.ok)caches.open(CACHE).then((cache)=>cache.put(request,response.clone()));return response; })));
});
