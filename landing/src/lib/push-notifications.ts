// Push Notifications Service для YoDo
// Использует Web Push API и Service Workers

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: {
    url?: string;
    orderId?: string;
    type?: 'new_order' | 'message' | 'payment' | 'review' | 'status_change';
  };
  actions?: {
    action: string;
    title: string;
    icon?: string;
  }[];
}

class PushNotificationService {
  private vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
  private registration: ServiceWorkerRegistration | null = null;

  /**
   * Проверка поддержки Push уведомлений
   */
  isSupported(): boolean {
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }

  /**
   * Запрос разрешения на отправку уведомлений
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error('Push notifications are not supported');
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  /**
   * Проверка текущего статуса разрешения
   */
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) {
      return 'denied';
    }
    return Notification.permission;
  }

  /**
   * Регистрация Service Worker
   */
  async registerServiceWorker(): Promise<ServiceWorkerRegistration> {
    if (!this.isSupported()) {
      throw new Error('Service Workers are not supported');
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', this.registration);
      return this.registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }

  /**
   * Подписка на Push уведомления
   */
  async subscribe(): Promise<PushSubscription> {
    if (!this.registration) {
      this.registration = await this.registerServiceWorker();
    }

    // Проверяем существующую подписку
    let subscription = await this.registration.pushManager.getSubscription();

    if (!subscription) {
      // Создаём новую подписку
      const applicationServerKey = this.urlBase64ToUint8Array(this.vapidPublicKey);
      
      subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as BufferSource
      });

      console.log('New push subscription created:', subscription);
    }

    // Отправляем подписку на сервер
    await this.sendSubscriptionToServer(subscription);

    return subscription;
  }

  /**
   * Отписка от Push уведомлений
   */
  async unsubscribe(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    const subscription = await this.registration.pushManager.getSubscription();
    
    if (subscription) {
      const successful = await subscription.unsubscribe();
      
      if (successful) {
        // Удаляем подписку на сервере
        await this.removeSubscriptionFromServer(subscription);
      }
      
      return successful;
    }

    return false;
  }

  /**
   * Отправка подписки на сервер
   */
  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          userAgent: navigator.userAgent
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send subscription to server');
      }

      console.log('Subscription sent to server successfully');
    } catch (error) {
      console.error('Error sending subscription to server:', error);
      throw error;
    }
  }

  /**
   * Удаление подписки с сервера
   */
  private async removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription })
      });

      if (!response.ok) {
        throw new Error('Failed to remove subscription from server');
      }

      console.log('Subscription removed from server successfully');
    } catch (error) {
      console.error('Error removing subscription from server:', error);
    }
  }

  /**
   * Показ локального уведомления (для тестирования)
   */
  async showLocalNotification(payload: PushNotificationPayload): Promise<void> {
    if (!this.registration) {
      this.registration = await this.registerServiceWorker();
    }

    const options: any = {
      body: payload.body,
      icon: payload.icon || '/icons/icon-192x192.png',
      badge: payload.badge || '/icons/badge-72x72.png',
      data: payload.data,
      tag: payload.data?.orderId || `notification-${Date.now()}`,
      requireInteraction: true,
      vibrate: [200, 100, 200]
    };

    if (payload.actions) {
      options.actions = payload.actions;
    }

    await this.registration.showNotification(payload.title, options);
  }

  /**
   * Конвертация VAPID ключа из base64 в Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  /**
   * Инициализация: проверка и подписка если уже разрешено
   */
  async initialize(): Promise<void> {
    if (!this.isSupported()) {
      console.warn('Push notifications are not supported');
      return;
    }

    const permission = this.getPermissionStatus();
    
    if (permission === 'granted') {
      try {
        await this.subscribe();
        console.log('Push notifications initialized and subscribed');
      } catch (error) {
        console.error('Failed to initialize push notifications:', error);
      }
    }
  }
}

// Singleton instance
const pushNotificationService = new PushNotificationService();

export default pushNotificationService;

// Helper функции для различных типов уведомлений

export const notificationTemplates = {
  newOrder: (orderTitle: string, category: string, price: number): PushNotificationPayload => ({
    title: '🔔 Новый заказ!',
    body: `${orderTitle} - ${price.toLocaleString()} ₽`,
    icon: '/icons/new-order.png',
    data: {
      type: 'new_order',
      url: '/specialist/dashboard'
    },
    actions: [
      { action: 'view', title: 'Посмотреть' },
      { action: 'ignore', title: 'Позже' }
    ]
  }),

  newMessage: (senderName: string, messagePreview: string): PushNotificationPayload => ({
    title: `💬 Сообщение от ${senderName}`,
    body: messagePreview,
    icon: '/icons/message.png',
    data: {
      type: 'message',
      url: '/specialist/messages'
    },
    actions: [
      { action: 'reply', title: 'Ответить' },
      { action: 'view', title: 'Открыть' }
    ]
  }),

  paymentReceived: (amount: number, orderTitle: string): PushNotificationPayload => ({
    title: '💰 Получен платёж!',
    body: `${amount.toLocaleString()} ₽ за "${orderTitle}"`,
    icon: '/icons/payment.png',
    data: {
      type: 'payment',
      url: '/specialist/finances'
    }
  }),

  newReview: (clientName: string, rating: number): PushNotificationPayload => ({
    title: '⭐ Новый отзыв',
    body: `${clientName} оставил отзыв: ${rating}/5`,
    icon: '/icons/review.png',
    data: {
      type: 'review',
      url: '/specialist/reviews'
    }
  }),

  orderStatusChange: (orderTitle: string, newStatus: string): PushNotificationPayload => ({
    title: '📋 Статус заказа изменён',
    body: `"${orderTitle}" - ${newStatus}`,
    icon: '/icons/status.png',
    data: {
      type: 'status_change',
      url: '/specialist/orders'
    }
  })
};

// React Hook для использования в компонентах
export function usePushNotifications() {
  const isSupported = pushNotificationService.isSupported();
  const permission = pushNotificationService.getPermissionStatus();

  const requestPermission = async () => {
    return await pushNotificationService.requestPermission();
  };

  const subscribe = async () => {
    return await pushNotificationService.subscribe();
  };

  const unsubscribe = async () => {
    return await pushNotificationService.unsubscribe();
  };

  const showNotification = async (payload: PushNotificationPayload) => {
    return await pushNotificationService.showLocalNotification(payload);
  };

  return {
    isSupported,
    permission,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification
  };
}

