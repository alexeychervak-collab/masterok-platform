// Service Worker для МастерОК PWA
// Кэширование, офлайн-поддержка, Push-уведомления

const CACHE_VERSION = 'masterok-v2';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/',
  '/offline',
  '/specialist/dashboard',
  '/specialist/messages',
  '/specialist/orders',
];

const STATIC_EXTENSIONS = ['.js', '.css', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.woff', '.woff2', '.ttf', '.eot', '.ico'];

// ─── Install ───────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Pre-caching app shell');
        return cache.addAll(PRECACHE_URLS);
      })
      .catch((err) => {
        console.error('[SW] Pre-cache failed:', err);
      })
  );
  self.skipWaiting();
});

// ─── Activate ──────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      )
    )
  );
  return self.clients.claim();
});

// ─── Fetch — routing strategies ────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http schemes
  if (!url.protocol.startsWith('http')) return;

  // Network-first for API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first for static assets
  const isStatic = STATIC_EXTENSIONS.some((ext) => url.pathname.endsWith(ext));
  if (isStatic) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Network-first for HTML pages with offline fallback
  event.respondWith(networkFirstWithOffline(request));
});

// Cache-first strategy (static assets)
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    console.error('[SW] cacheFirst fetch failed:', err);
    return new Response('Offline', { status: 503 });
  }
}

// Network-first strategy (API)
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Network-first with offline fallback (HTML pages)
async function networkFirstWithOffline(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Fallback to offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match('/offline');
      if (offlinePage) return offlinePage;
    }

    return new Response(
      '<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><title>МастерОК — Офлайн</title></head>' +
        '<body style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;background:#fff8f0;color:#333;">' +
        '<div style="text-align:center"><h1 style="color:#f97316;">МастерОК</h1><p>Нет подключения к интернету.<br>Проверьте соединение и попробуйте снова.</p></div>' +
        '</body></html>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

// ─── Push Notifications ────────────────────────────────────
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');

  let data = {
    title: 'МастерОК',
    body: 'У вас новое уведомление',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    data: {},
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      data = { ...data, ...payload };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      image: data.image,
      vibrate: [200, 100, 200, 100, 200],
      data: data.data || {},
      actions: data.actions || [],
      requireInteraction: true,
      tag: data.data?.orderId || `notif-${Date.now()}`,
      renotify: true,
    })
  );
});

// ─── Notification Click ────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/specialist/dashboard';

  if (event.action === 'reply') {
    event.waitUntil(self.clients.openWindow('/specialist/messages'));
    return;
  }
  if (event.action === 'ignore') return;

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((list) => {
        for (const client of list) {
          if (client.url.includes(targetUrl) && 'focus' in client) {
            return client.focus();
          }
        }
        return self.clients.openWindow(targetUrl);
      })
  );
});

// ─── Notification Close ────────────────────────────────────
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed');
});

// ─── Background Sync ──────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncEndpoint('/api/messages/sync', 'messages'));
  } else if (event.tag === 'sync-orders') {
    event.waitUntil(syncEndpoint('/api/orders/sync', 'orders'));
  }
});

async function syncEndpoint(url, label) {
  try {
    const res = await fetch(url, { method: 'POST' });
    if (res.ok) console.log(`[SW] ${label} synced`);
  } catch (e) {
    console.error(`[SW] ${label} sync failed:`, e);
  }
}

// ─── Client Messages ──────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data?.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    self.registration.showNotification(title, options);
  }
});

console.log('[SW] Service Worker loaded');
