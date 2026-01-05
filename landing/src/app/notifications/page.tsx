'use client'

import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { usePushNotifications, notificationTemplates } from '@/lib/push-notifications'
import { motion } from 'framer-motion'
import { Bell, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function NotificationsPage() {
  const { isSupported, permission, requestPermission, subscribe, unsubscribe, showNotification } = usePushNotifications()

  async function enable() {
    const p = await requestPermission()
    if (p === 'granted') {
      await subscribe()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Уведомления</h1>
          <p className="text-gray-600">Push-уведомления о заказах, сообщениях и платежах (работают даже когда вкладка закрыта).</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center">
              <Bell className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Статус</div>
              <div className="text-sm text-gray-600 mt-1">
                <div>
                  <b>Поддержка браузером:</b> {isSupported ? 'да' : 'нет'}
                </div>
                <div>
                  <b>Разрешение:</b> {permission}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={enable}
                disabled={!isSupported || permission === 'denied'}
                className="px-4 py-2 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50"
              >
                Включить
              </button>
              <button
                onClick={unsubscribe}
                className="px-4 py-2 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50"
              >
                Выключить
              </button>
            </div>
          </div>

          {!isSupported && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-900">
                Push-уведомления недоступны в этом браузере/режиме. Откройте сайт в Chrome/Edge и включите уведомления.
              </div>
            </div>
          )}

          <div className="mt-6">
            <div className="font-semibold mb-3">Тестовые уведомления</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => showNotification(notificationTemplates.newOrder('Ремонт квартиры', 'Ремонт', 150000))}
                className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black"
              >
                Новый заказ
              </button>
              <button
                onClick={() => showNotification(notificationTemplates.newMessage('Анна', 'Когда сможете начать?'))}
                className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black"
              >
                Сообщение
              </button>
              <button
                onClick={() => showNotification(notificationTemplates.paymentReceived(65000, 'Замена проводки'))}
                className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black"
              >
                Платёж
              </button>
            </div>
            <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              После включения уведомления приходят “по компетенциям” (в реальном проекте — по профилю специалиста).
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}





