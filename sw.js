// Service Worker Offline — A Bíblia Cronológica em 365 Dias (12 Fases)
const CACHE_NAME = 'biblia-cronologica-365-pwa-v3';
const CORE_ASSETS = [
  './',
  './index.html',
  './Biblia_Cronologica_365_Dias_PWA.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './favicon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.allSettled(
        CORE_ASSETS.map(async (url) => {
          try {
            const res = await fetch(url, { cache: 'reload' });
            if (res && res.ok) {
              await cache.put(url, res.clone());
              if (url.endsWith('.html')) {
                await cache.put('./', res.clone());
              }
            }
          } catch (e) {
            // Ignore optional filename variants if not present
          }
        })
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : Promise.resolve()))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_CURRENT_PAGE' && event.data.url) {
    event.waitUntil(
      (async () => {
        try {
          const cache = await caches.open(CACHE_NAME);
          const res = await fetch(event.data.url);
          if (res && res.ok) {
            await cache.put(event.data.url, res.clone());
            await cache.put('./', res.clone());
          }
        } catch (e) {}
      })()
    );
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navigation requests (HTML pages): Network-first with immediate Offline Cache fallback
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        try {
          const netRes = await fetch(req);
          if (netRes && netRes.ok) {
            cache.put(req, netRes.clone());
            cache.put('./', netRes.clone());
            return netRes;
          }
        } catch (e) {
          // Device is offline: serve from cache
        }
        return (
          (await cache.match(req)) ||
          (await cache.match('./')) ||
          (await cache.match('./index.html')) ||
          (await cache.match('./Biblia_Cronologica_365_Dias_PWA.html'))
        );
      })()
    );
    return;
  }

  // Static local assets (manifest, PNG icons): Cache-first with background refresh
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      const netPromise = fetch(req)
        .then((netRes) => {
          if (netRes && netRes.ok) {
            cache.put(req, netRes.clone());
          }
          return netRes;
        })
        .catch(() => cached);
      return cached || netPromise;
    })()
  );
});
