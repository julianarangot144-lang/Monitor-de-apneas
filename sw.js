const CACHE_NAME = 'apnea-monitor-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Evento de instalación: Guarda los archivos esenciales en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caché abierta');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de intercepción de red (Fetch)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna la respuesta en caché si existe, si no, hace la petición a la red
        return response || fetch(event.request);
      })
  );
});

// Evento de activación: Limpia cachés antiguas si cambias la versión
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});