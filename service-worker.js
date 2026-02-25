/* ===============================
   Mexcecy GPA - Service Worker
   Production Ready
================================= */

const CACHE_VERSION = "v1.0.0";
const CACHE_NAME = "mexcecy-gpa-cache-" + CACHE_VERSION;

const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// ===============================
// Install
// ===============================
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(APP_SHELL);
    })
  );
});

// ===============================
// Activate (clean old caches)
// ===============================
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ===============================
// Fetch Strategy
// Network First for HTML
// Cache First for Assets
// ===============================
self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") return;

  const requestURL = new URL(event.request.url);

  // HTML → Network First
  if (requestURL.pathname.endsWith(".html") || requestURL.pathname === "/") {

    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );

    return;
  }

  // Assets → Cache First
  event.respondWith(
    caches.match(event.request).then(cached => {
      return (
        cached ||
        fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
          });
          return response;
        })
      );
    })
  );

});
