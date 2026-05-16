const CACHE_NAME = "orbitx-cache-v3";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./dashboard.html",
  "./launch.html",
  "./satellites.html",
  "./lunar.html",
  "./telemetry.html",
  "./about.html",
  "./css/style.css",
  "./css/responsive.css",
  "./js/layout.js",
  "./js/app.js",
  "./js/dashboard.js",
  "./js/launch.js",
  "./js/telemetry.js",
  "./images/orbitx-hero.png",
  "./images/orbitx-icon-192.png",
  "./images/orbitx-icon-512.png",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status >= 500) return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
