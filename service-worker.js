const CACHE_NAME = "gpa-app-v6";

const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Install
self.addEventListener("install", event => {

  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
  );

});

// Activate
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

// Fetch
self.addEventListener("fetch", event => {

  if(event.request.method !== "GET") return;

  event.respondWith(

    fetch(event.request)
      .then(response => response)
      .catch(() => caches.match(event.request))

  );

});
