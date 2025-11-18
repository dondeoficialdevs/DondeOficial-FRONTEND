// Versión del service worker - Incrementar para forzar actualización
const SW_VERSION = '2.0.0';
const CACHE_NAME = `dondeoficial-v${SW_VERSION}`;
const RUNTIME_CACHE = `dondeoficial-runtime-v${SW_VERSION}`;

// Assets estáticos que se pueden cachear por más tiempo
const STATIC_ASSETS = [
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

// Install Event - Cache solo assets estáticos críticos
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker version:', SW_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Service worker installed');
        return self.skipWaiting(); // Activar inmediatamente
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Activate Event - Limpiar caches antiguos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker version:', SW_VERSION);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Eliminar todos los caches que no sean los actuales
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
    .then(() => {
      console.log('[SW] Service worker activated');
      return self.clients.claim(); // Tomar control de todas las páginas
    })
  );
});

// Fetch Event - Estrategia Network First para HTML/JS, Cache First para assets estáticos
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip external domains
  if (!request.url.startsWith(self.location.origin)) return;

  const url = new URL(request.url);
  const isHTML = request.destination === 'document' || url.pathname.endsWith('.html');
  const isJS = request.destination === 'script' || url.pathname.endsWith('.js');
  const isCSS = request.destination === 'style' || url.pathname.endsWith('.css');
  const isImage = request.destination === 'image' || /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(url.pathname);
  const isFont = request.destination === 'font' || /\.(woff|woff2|ttf|otf)$/i.test(url.pathname);
  const isStaticAsset = isImage || isFont || url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/images/');

  // Para HTML y JS: Network First (siempre buscar versión nueva)
  if (isHTML || isJS) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Si la respuesta es válida, actualizar el caché
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Si falla la red, intentar desde caché
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Si no hay caché y es HTML, mostrar página offline
            if (isHTML) {
              return caches.match('/offline.html').catch(() => new Response('Offline', { status: 503 }));
            }
            return new Response('Network error', { status: 503 });
          });
        })
    );
    return;
  }

  // Para CSS: Network First con fallback a caché
  if (isCSS) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Para assets estáticos (imágenes, fuentes, etc.): Cache First con actualización en background
  if (isStaticAsset) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          // Si está en caché, devolverlo inmediatamente
          if (cachedResponse) {
            // Actualizar en background (stale-while-revalidate)
            fetch(request)
              .then((response) => {
                if (response && response.status === 200) {
                  const responseToCache = response.clone();
                  caches.open(RUNTIME_CACHE).then((cache) => {
                    cache.put(request, responseToCache);
                  });
                }
              })
              .catch(() => {
                // Ignorar errores de actualización en background
              });
            return cachedResponse;
          }

          // Si no está en caché, buscar en red
          return fetch(request)
            .then((response) => {
              if (response && response.status === 200) {
                const responseToCache = response.clone();
                caches.open(RUNTIME_CACHE).then((cache) => {
                  cache.put(request, responseToCache);
                });
              }
              return response;
            })
            .catch(() => {
              // Si falla, devolver respuesta vacía o placeholder
              if (isImage) {
                return new Response('', { status: 404 });
              }
              return new Response('Network error', { status: 503 });
            });
        })
    );
    return;
  }

  // Para otros recursos: Network First
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Escuchar mensajes del cliente para forzar actualización
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

// Background Sync para operaciones offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      Promise.resolve()
    );
  }
});

// Push Notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva actualización en DondeOficial',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('DondeOficial', options)
  );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});

