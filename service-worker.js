const CACHE_NAME = "mexicy-gpa-v13";

const FILES_TO_CACHE = [
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
      .then(cache => {
        return cache.addAll(FILES_TO_CACHE);
      })
  );

});

// Activate
self.addEventListener("activate", event => {

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if(key !== CACHE_NAME){
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );

});

// Fetch
self.addEventListener("fetch", event => {

  if(event.request.method !== "GET") return;

  event.respondWith(

    caches.match(event.request)
      .then(response => {

        if(response){
          return response;
        }

        return fetch(event.request)
          .then(networkResponse => {

            const responseClone = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseClone));

            return networkResponse;

          })
          .catch(() => caches.match("./index.html"));

      })

  );

});
