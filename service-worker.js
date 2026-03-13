const CACHE_NAME = "gpa-clean-v9";

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

caches.match(event.request).then(cachedResponse => {

if(cachedResponse){
return cachedResponse;
}

return fetch(event.request).then(networkResponse => {

if(!networkResponse || networkResponse.status !== 200){
return networkResponse;
}

const responseClone = networkResponse.clone();

caches.open(CACHE_NAME).then(cache=>{
cache.put(event.request,responseClone);
});

return networkResponse;

}).catch(()=>caches.match("./index.html"));

})

);

});
