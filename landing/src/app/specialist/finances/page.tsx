'use client'

import Link from 'next/link'
import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { CreditCard, Sparkles, Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, Ban, Download } from 'lucide-react'

const transactions = [
  { id: 't1', date: '2026-03-10', title: 'Ремонт санузла — Анна П.', amount: 45000, type: 'income', status: 'completed' },
  { id: 't2', date: '2026-03-08', title: 'Вывод на карту *4589', amount: -35000, type: 'withdrawal', status: 'completed' },
  { id: 't3', date: '2026-03-05', title: 'Электромонтаж — Дмитрий К.', amount: 28500, type: 'income', status: 'completed' },
  { id: 't4', date: '2026-03-03', title: 'Укладка плитки — Мария С.', amount: 67000, type: 'income', status: 'completed' },
  { id: 't5', date: '2026-02-28', title: 'Вывод на карту *4589', amount: -80000, type: 'withdrawal', status: 'completed' },
  { id: 't6', date: '2026-02-25', title: 'Косметический ремонт — Олег В.', amount: 52000, type: 'income', status: 'completed' },
  { id: 't7', date: '2026-02-22', title: 'Установка сантехники — Елена М.', amount: 18000, type: 'income', status: 'completed' },
  { id: 't8', date: '2026-02-18', title: 'Замена проводки — Артём Н.', amount: 35000, type: 'income', status: 'pending' },
  { id: 't9', date: '2026-02-15', title: 'Вывод на карту *4589', amount: -50000, type: 'withdrawal', status: 'completed' },
  { id: 't10', date: '2026-02-10', title: 'Штукатурные работы — Ирина Д.', amount: 41000, type: 'income', status: 'completed' },
  { id: 't11', date: '2026-02-05', title: 'Монтаж потолков — Сергей К.', amount: 29000, type: 'income', status: 'completed' },
  { id: 't12', date: '2026-01-30', title: 'Вывод на карту *4589', amount: -60000, type: 'withdrawal', status: 'completed' },
]

const monthlyData = [
  { month: 'Сен', income: 85000 },
  { month: 'Окт', income: 142000 },
  { month: 'Ноя', income: 98000 },
  { month: 'Дек', income: 175000 },
  { month: 'Янв', income: 120000 },
  { month: 'Фев', income: 195000 },
  { month: 'Мар', income: 128400 },
]

type Period = '7d' | '30d' | '90d' | 'year'

export default function SpecialistFinancesPage() {
  const [period, setPeriod] = useState<Period>('30d')
  const [showWithdraw, setShowWithdraw] = useState(false)

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalWithdrawn = Math.abs(transactions.filter(t => t.type === 'withdrawal').reduce((s, t) => s + t.amount, 0))
  const maxMonthly = Math.max(...monthlyData.map(m => m.income))

  const stats = [
    { label: 'Доход за 30 дней', value: '128 400 ₽', change: '+12%', up: true, icon: <Wallet className="w-5 h-5" /> },
    { label: 'Доступно к выводу', value: '42 000 ₽', change: '', up: true, icon: <CreditCard className="w-5 h-5" /> },
    { label: 'Всего заработано', value: `${(totalIncome / 1000).toFixed(0)}K ₽`, change: '+8%', up: true, icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'Комиссия платформы', value: '7%', change: 'Premium', up: true, icon: <Sparkles className="w-5 h-5" /> },
  ]

  const periods: { key: Period; label: string }[] = [
    { key: '7d', label: '7 дней' },
    { key: '30d', label: '30 дней' },
    { key: '90d', label: '90 дней' },
    { key: 'year', label: 'Год' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Финансы</h1>
            <p className="text-sm text-gray-600">Выплаты, доходы, подписка и баланс. Всё под контролем.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowWithdraw(!showWithdraw)} className="px-4 py-2 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50">
              Вывести средства
            </button>
            <Link href="/checkout/premium" className="px-4 py-2 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700">
              Подключить Premium
            </Link>
          </div>
        </div>

        {/* Withdraw form */}
        {showWithdraw && (
          <div className="bg-white rounded-2xl border border-primary-200 p-6 mb-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Вывод средств</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Сумма</label>
                <input type="number" placeholder="42 000" className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Карта</label>
                <select className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                  <option>**** 4589 (Сбербанк)</option>
                  <option>**** 7821 (Тинькофф)</option>
                  <option>+ Добавить карту</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full px-4 py-2.5 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black">
                  Вывести
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Вывод обрабатывается за 1-3 рабочих дня. Минимальная сумма: 1 000 ₽.</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                {s.icon}
                {s.label}
              </div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                {s.change && (
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${s.up ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {s.change}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Доходы по месяцам</h2>
            <div className="flex gap-1">
              {periods.map(p => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${period === p.key ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-2 h-48">
            {monthlyData.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs font-medium text-gray-600">{(m.income / 1000).toFixed(0)}K</div>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-primary-600 to-primary-400 transition-all duration-500"
                  style={{ height: `${(m.income / maxMonthly) * 160}px` }}
                />
                <div className="text-xs text-gray-500">{m.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">История операций</h2>
            <button className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1">
              <Download className="w-4 h-4" />
              Скачать выписку
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-green-100' : 'bg-orange-100'}`}>
                    {t.type === 'income' ? <ArrowDownRight className="w-4 h-4 text-green-600" /> : <ArrowUpRight className="w-4 h-4 text-orange-600" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{t.title}</div>
                    <div className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString('ru-RU')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${t.amount > 0 ? 'text-green-700' : 'text-gray-900'}`}>
                    {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString('ru-RU')} ₽
                  </span>
                  {t.status === 'pending' ? (
                    <Clock className="w-4 h-4 text-amber-500" />
                  ) : t.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Ban className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monetization */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Монетизация</h2>
            <Badge className="bg-amber-100 text-amber-700 border-amber-200">Рекомендуем</Badge>
          </div>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Premium-профиль — выше в выдаче, больше откликов, приоритет в поддержке.</li>
            <li>Безопасная сделка — повышает конверсию в оплату и доверие клиентов.</li>
            <li>Платное продвижение карточки в поиске по выбранным направлениям.</li>
            <li>Пониженная комиссия 7% вместо 15% для Premium-специалистов.</li>
          </ul>
          <div className="flex flex-col md:flex-row gap-3 mt-6">
            <Link href="/pricing" className="flex-1 px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 font-semibold text-gray-900 text-center">
              Сравнить тарифы
            </Link>
            <Link href="/checkout/premium" className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-95 text-white font-bold text-center">
              Оплатить Premium
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
