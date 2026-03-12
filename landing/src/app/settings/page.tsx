 'use client'

import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { usePushNotifications } from '@/lib/push-notifications'
import { Bell, Phone, ShieldCheck, CalendarDays, CreditCard } from 'lucide-react'

type Settings = {
  smsEnabled: boolean
  pushEnabled: boolean
  phone?: string
  phoneVerified?: boolean
  proPlan?: 'free' | 'premium'
}

function loadSettings(): Settings {
  if (typeof window === 'undefined') return { smsEnabled: true, pushEnabled: false, proPlan: 'free' }
  try {
    const raw = localStorage.getItem('masterok_settings')
    if (!raw) return { smsEnabled: true, pushEnabled: false, proPlan: 'free' }
    return { smsEnabled: true, pushEnabled: false, proPlan: 'free', ...JSON.parse(raw) }
  } catch {
    return { smsEnabled: true, pushEnabled: false, proPlan: 'free' }
  }
}

function saveSettings(s: Settings) {
  try {
    localStorage.setItem('masterok_settings', JSON.stringify(s))
  } catch {
    // ignore
  }
}

function generateCode() {
  return String(Math.floor(1000 + Math.random() * 9000))
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(() => loadSettings())
  const [smsCode, setSmsCode] = useState('')
  const [sentCode, setSentCode] = useState<string | null>(null)
  const { isSupported, permission, requestPermission, subscribe, unsubscribe } = usePushNotifications()

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const canVerify = useMemo(() => (settings.phone || '').replace(/\D/g, '').length >= 10 && smsCode.length >= 4, [settings.phone, smsCode])

  async function sendSms() {
    // Production: подключить backend + SMS провайдер (SMS.ru / Twilio / etc)
    const code = generateCode()
    setSentCode(code)
    alert(`SMS отправлено (демо). Код: ${code}`)
  }

  async function verifySms() {
    if (!sentCode) return
    if (smsCode.trim() === sentCode) {
      setSettings((s) => ({ ...s, phoneVerified: true }))
      alert('Телефон подтвержден ✅')
    } else {
      alert('Неверный код ❌')
    }
  }

  async function enablePush() {
    const p = await requestPermission()
    if (p === 'granted') {
      await subscribe()
      setSettings((s) => ({ ...s, pushEnabled: true }))
    }
  }

  async function disablePush() {
    await unsubscribe()
    setSettings((s) => ({ ...s, pushEnabled: false }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Настройки</h1>
            <p className="text-gray-600">Уведомления (Push/SMS), безопасность, календарь, монетизация — всё в одном месте.</p>
          </div>
          <Link href="/profile" className="px-4 py-2 rounded-xl bg-white border border-gray-200 font-semibold hover:bg-gray-50">
            Профиль →
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-5 h-5 text-primary-600" />
              <h2 className="font-bold">Push-уведомления</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Новые заказы по компетенциям, сообщения, статус оплаты. Работает даже когда вкладка закрыта.
            </p>
            <div className="text-xs text-gray-500 space-y-1 mb-4">
              <div><b>Поддержка:</b> {isSupported ? 'да' : 'нет'}</div>
              <div><b>Разрешение:</b> {permission}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={enablePush}
                disabled={!isSupported || permission === 'denied'}
                className="flex-1 px-4 py-2 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50"
              >
                Включить
              </button>
              <button
                onClick={disablePush}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50"
              >
                Выключить
              </button>
            </div>
            <div className="mt-4">
              <Link href="/notifications" className="text-primary-600 font-semibold hover:underline">
                Детальные настройки и тест →
              </Link>
            </div>
          </div>

          {/* SMS */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-5 h-5 text-primary-600" />
              <h2 className="font-bold">SMS / Телефон</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Вход по SMS и уведомления: “поступил заказ по компетенции”, “изменился статус оплаты”.
            </p>

            <label className="text-sm font-semibold text-gray-700">Телефон</label>
            <input
              value={settings.phone || ''}
              onChange={(e) => setSettings((s) => ({ ...s, phone: e.target.value }))}
              placeholder="+7 (999) 123-45-67"
              className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
            />

            <div className="flex gap-2 mt-3">
              <button
                onClick={sendSms}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50"
              >
                Отправить код
              </button>
              <button
                onClick={() => setSettings((s) => ({ ...s, smsEnabled: !s.smsEnabled }))}
                className={`flex-1 px-4 py-2 rounded-xl font-semibold ${settings.smsEnabled ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                {settings.smsEnabled ? 'SMS включены' : 'SMS выключены'}
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <input
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
                placeholder="Код"
                className="px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={verifySms}
                disabled={!canVerify || !sentCode}
                className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black disabled:opacity-50"
              >
                Подтвердить
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {settings.phoneVerified ? 'Телефон подтвержден' : 'Демо: подтвердите телефон для полноценного продакшена'}
            </div>
          </div>

          {/* Calendar + monetization */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays className="w-5 h-5 text-primary-600" />
                <h2 className="font-bold">Календарь</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Отмечайте занятость — заказчики видят доступность. Календарь сохраняется локально (готово под backend-sync).
              </p>
              <Link href="/specialist/calendar" className="text-primary-600 font-semibold hover:underline">
                Открыть календарь →
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-primary-600" />
                <h2 className="font-bold">Монетизация</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Premium: больше откликов, топ в выдаче, приоритетные лиды и push по компетенциям.
              </p>
              <div className="flex gap-2">
                <Link href="/pricing" className="flex-1 text-center px-4 py-2 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50">
                  Тарифы
                </Link>
                <Link href="/checkout/premium" className="flex-1 text-center px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold hover:opacity-95">
                  Premium
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}





