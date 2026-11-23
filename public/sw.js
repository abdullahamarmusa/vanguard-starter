const CACHE_NAME = 'vanguard-static-v1';
const OFFLINE_URL = '/offline.html';
const STATIC_PATHS = new Set([
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  OFFLINE_URL,
]);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL)),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) => key.startsWith('vanguard-static-') && key !== CACHE_NAME,
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/api/') ||
    request.headers.has('authorization')
  ) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const offlinePage = await caches.match(OFFLINE_URL);
        return (
          offlinePage ??
          new Response('You are offline. Reconnect and try again.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          })
        );
      }),
    );
    return;
  }

  if (!STATIC_PATHS.has(url.pathname)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) return cachedResponse;

      const response = await fetch(request);
      const cacheControl = response.headers.get('cache-control') ?? '';

      if (
        response.ok &&
        response.type === 'basic' &&
        !/private|no-store/i.test(cacheControl)
      ) {
        event.waitUntil(cache.put(request, response.clone()));
      }

      return response;
    }),
  );
});
