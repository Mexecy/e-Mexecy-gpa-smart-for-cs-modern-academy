const CACHE = "mexicy-gpa-v12";

const ASSETS = [

"./",
"./index.html",
"./style.css",
"./script.js",
"./manifest.json",
"./icon-192.png",
"./icon-512.png"

];

self.addEventListener("install",e=>{

self.skipWaiting();

e.waitUntil(

caches.open(CACHE)

.then(cache=>cache.addAll(ASSETS))

);

});

self.addEventListener("activate",e=>{

e.waitUntil(

caches.keys()

.then(keys=>Promise.all(

keys.filter(k=>k!==CACHE)

.map(k=>caches.delete(k))

))

);

self.clients.claim();

});

self.addEventListener("fetch",e=>{

if(e.request.method!=="GET") return;

e.respondWith(

caches.match(e.request)

.then(res=>res || fetch(e.request))

);

});
