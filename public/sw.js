const CACHE_NAME = 'mercado-campesino-v2';
const urlsToCache = ['/', '/index.html', '/manifest.json'];

// Instalar service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activar service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

function isNavigationRequest(request) {
  return request.mode === 'navigate' || request.destination === 'document';
}

async function getAppShellFallback() {
  const cache = await caches.open(CACHE_NAME);
  return (
    (await cache.match('/index.html')) ||
    (await cache.match('/')) ||
    new Response('Offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    })
  );
}

// Estrategia: network first, pero preservando la SPA para rutas directas
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  if (isNavigationRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
            return response;
          }
          return getAppShellFallback();
        })
        .catch(() => getAppShellFallback())
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }
        const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(response => response || getAppShellFallback());
      })
  );
});
