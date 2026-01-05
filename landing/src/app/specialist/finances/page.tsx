'use client'

import Link from 'next/link'
import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Sparkles, Wallet } from 'lucide-react'

export default function SpecialistFinancesPage() {
  const stats = [
    { label: 'Доход за 30 дней', value: '128 400 ₽', icon: <Wallet className="w-5 h-5" /> },
    { label: 'Доступно к выводу', value: '42 000 ₽', icon: <CreditCard className="w-5 h-5" /> },
    { label: 'Комиссия платформы', value: '7%', icon: <Sparkles className="w-5 h-5" /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Финансы</h1>
            <p className="text-sm text-gray-600">Выплаты, доходы, подписка и баланс.</p>
          </div>
          <Link
            href="/checkout/premium"
            className="px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
          >
            Подключить Premium
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                {s.icon}
                {s.label}
              </div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Монетизация</h2>
            <Badge className="bg-amber-100 text-amber-700 border-amber-200">Рекомендуем</Badge>
          </div>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Premium-профиль — выше в выдаче, больше откликов, приоритет в поддержке.</li>
            <li>Безопасная сделка — повышает конверсию в оплату и доверие клиентов.</li>
            <li>Платное продвижение карточки в поиске по выбранным направлениям.</li>
          </ul>

          <div className="flex flex-col md:flex-row gap-3 mt-6">
            <Link
              href="/pricing"
              className="flex-1 px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 font-semibold text-gray-900 text-center"
            >
              Тарифы
            </Link>
            <Link
              href="/checkout/premium"
              className="flex-1 px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-center"
            >
              Оплатить Premium
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}



