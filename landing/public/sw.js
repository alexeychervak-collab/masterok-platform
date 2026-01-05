// Service Worker для Push-уведомлений YoDo
// Обрабатывает входящие Push сообщения и клики по уведомлениям

const CACHE_NAME = 'yodo-v1';
const urlsToCache = [
  '/',
  '/specialist/dashboard',
  '/specialist/messages',
  '/specialist/orders',
  '/icons/icon-192x192.png',
  '/icons/badge-72x72.png'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...', event);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('[SW] Cache installation failed:', error);
      })
  );
  
  // Активировать SW немедленно
  self.skipWaiting();
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...', event);
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Захватить всех клиентов
  return self.clients.claim();
});

// Обработка Push событий
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received:', event);
  
  let notificationData = {
    title: 'YoDo',
    body: 'У вас новое уведомление',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: {}
  };

  // Парсим данные из Push сообщения
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data
      };
    } catch (error) {
      console.error('[SW] Error parsing push data:', error);
      notificationData.body = event.data.text();
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    image: notificationData.image,
    vibrate: [200, 100, 200, 100, 200],
    data: notificationData.data || {},
    actions: notificationData.actions || [],
    requireInteraction: true,
    tag: notificationData.data?.orderId || `notification-${Date.now()}`,
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/specialist/dashboard';

  // Обработка действий (кнопок)
  if (event.action) {
    console.log('[SW] Action clicked:', event.action);
    
    // Различные действия
    switch (event.action) {
      case 'view':
        // Открыть страницу
        break;
      case 'reply':
        // Открыть страницу сообщений
        event.waitUntil(
          clients.openWindow('/specialist/messages')
        );
        return;
      case 'ignore':
        // Просто закрыть уведомление
        return;
      default:
        break;
    }
  }

  // Открыть URL или сфокусировать существующее окно
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Проверяем, есть ли уже открытое окно с этим URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Если нет открытого окна, открываем новое
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Обработка закрытия уведомлений
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed:', event);
  
  // Можно отправить аналитику о закрытии уведомления
  const notification = event.notification;
  const notificationData = notification.data;
  
  // TODO: Отправить на сервер информацию о закрытии
  // fetch('/api/notifications/closed', {
  //   method: 'POST',
  //   body: JSON.stringify({ notificationId: notificationData?.id })
  // });
});

// Обработка фоновой синхронизации (Background Sync)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  } else if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }
});

// Функции синхронизации
async function syncMessages() {
  try {
    console.log('[SW] Syncing messages...');
    // TODO: Синхронизировать сообщения с сервером
    const response = await fetch('/api/messages/sync', {
      method: 'POST'
    });
    
    if (response.ok) {
      console.log('[SW] Messages synced successfully');
      
      // Показать уведомление о новых сообщениях
      const data = await response.json();
      if (data.newMessages > 0) {
        self.registration.showNotification('Новые сообщения', {
          body: `У вас ${data.newMessages} новых сообщений`,
          icon: '/icons/message.png',
          badge: '/icons/badge-72x72.png',
          data: { url: '/specialist/messages' }
        });
      }
    }
  } catch (error) {
    console.error('[SW] Failed to sync messages:', error);
  }
}

async function syncOrders() {
  try {
    console.log('[SW] Syncing orders...');
    // TODO: Синхронизировать заказы с сервером
    const response = await fetch('/api/orders/sync', {
      method: 'POST'
    });
    
    if (response.ok) {
      console.log('[SW] Orders synced successfully');
      
      const data = await response.json();
      if (data.newOrders > 0) {
        self.registration.showNotification('Новые заказы!', {
          body: `Доступно ${data.newOrders} новых заказов по вашим компетенциям`,
          icon: '/icons/new-order.png',
          badge: '/icons/badge-72x72.png',
          data: { url: '/specialist/dashboard' }
        });
      }
    }
  } catch (error) {
    console.error('[SW] Failed to sync orders:', error);
  }
}

// Стратегия кэширования для запросов
self.addEventListener('fetch', (event) => {
  // Игнорируем запросы к API (они должны быть всегда свежими)
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Вернуть из кэша или запросить из сети
        return response || fetch(event.request);
      })
      .catch((error) => {
        console.error('[SW] Fetch failed:', error);
        throw error;
      })
  );
});

// Обработка сообщений от клиентов
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    self.registration.showNotification(title, options);
  }
});

console.log('[SW] Service Worker loaded');




