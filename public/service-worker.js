var dataCacheName = 'pwa';
var cacheName = 'pwa';
var filesToCache = [
 "https://ananya.github.io/pwa/public/fonts/roboto/Roboto-Bold.woff",
 "https://ananya.github.io/pwa/public/fonts/roboto/Roboto-Bold.woff2",
 "https://ananya.github.io/pwa/public/fonts/roboto/Roboto-Light.woff",
 "https://ananya.github.io/pwa/public/fonts/roboto/Roboto-Light.woff2",
 "https://ananya.github.io/pwa/public/fonts/roboto/Roboto-Medium.woff",
 "https://ananya.github.io/pwa/public/fonts/roboto/Roboto-Medium.woff2",
 "https://ananya.github.io/pwa/public/fonts/roboto/Roboto-Regular.woff",
 "https://ananya.github.io/pwa/public/fonts/roboto/Roboto-Regular.woff2",
 "https://ananya.github.io/pwa/public/fonts/roboto/Roboto-Thin.woff",
 "https://ananya.github.io/pwa/public/fonts/roboto/Roboto-Thin.woff2",
 "https://ananya.github.io/pwa/public/images/640x1136.png",
 "https://ananya.github.io/pwa/public/images/750x1294.jpeg",
 "https://ananya.github.io/pwa/public/images/1125x2436.jpeg",
 "https://ananya.github.io/pwa/public/images/1242x2148.png",
 "https://ananya.github.io/pwa/public/images/1536x2048.jpeg",
 "https://ananya.github.io/pwa/public/images/1668x2224.jpeg",
 "https://ananya.github.io/pwa/public/images/2048x2732.jpeg",
 "https://ananya.github.io/pwa/public/images/android-chrome-192x192.png",
 "https://ananya.github.io/pwa/public/images/android-chrome-512x512.png",
 "https://ananya.github.io/pwa/public/images/apple-touch-icon.png",
 "https://ananya.github.io/pwa/public/images/bg.jpg",
 "https://ananya.github.io/pwa/public/images/browserconfig.xml",
 "https://ananya.github.io/pwa/public/images/favicon-16x16.png",
 "https://ananya.github.io/pwa/public/images/favicon-32x32.png",
 "https://ananya.github.io/pwa/public/images/favicon.ico",
 "https://ananya.github.io/pwa/public/images/mstile-150x150.png",
 "https://ananya.github.io/pwa/public/images/pic01.jpg",
 "https://ananya.github.io/pwa/public/images/pic02.jpg",
 "https://ananya.github.io/pwa/public/images/pic03.jpg",
 "https://ananya.github.io/pwa/public/images/pic04.jpg",
 "https://ananya.github.io/pwa/public/images/pic05.jpg",
 "https://ananya.github.io/pwa/public/images/pic06.jpg",
 "https://ananya.github.io/pwa/public/images/pic07.jpg",
 "https://ananya.github.io/pwa/public/images/pic08.jpg",
 "https://ananya.github.io/pwa/public/images/site.webmanifest",
 "https://ananya.github.io/pwa/public/images/icons/icon-128x128.png",
 "https://ananya.github.io/pwa/public/images/icons/icon-144x144.png",
 "https://ananya.github.io/pwa/public/images/icons/icon-152x152.png",
 "https://ananya.github.io/pwa/public/images/icons/icon-192x192.png",
 "https://ananya.github.io/pwa/public/images/icons/icon-256x256.png",
 "https://ananya.github.io/pwa/public/index.html",
 "https://ananya.github.io/pwa/public/manifest.json",
 "https://ananya.github.io/pwa/public/scripts/app.js",
 "https://ananya.github.io/pwa/public/scripts/jquery-3.3.1.js",
 "https://ananya.github.io/pwa/public/scripts/materialize.js",
 "https://ananya.github.io/pwa/public/service-worker.js",
 "https://ananya.github.io/pwa/public/styles/materialize.css",
 "https://ananya.github.io/pwa/public/styles/style.css"
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      // return response || fetch(e.request);
      if (response) {
        return response;
      }
      var fetchRequest = e.request.clone();

      return fetch(fetchRequest).then(
        function(response) {
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          var responseToCache = response.clone();

          caches.open(cacheName)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });
            return response;
        }
      )
    })
  );
});
