'use client'

import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { ordersMock, OrderMock } from '@/lib/mock-data'
import { CheckCircle2, Plus, Search, ShieldCheck } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

type ClientOrder = OrderMock & { status?: 'draft' | 'published' | 'in_progress' | 'done' | 'cancelled' }

function normalizeOrdersFromStorage(): ClientOrder[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('masterok_client_orders')
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function OrdersContent() {
  const searchParams = useSearchParams()
  const created = searchParams?.get('created') === 'true'

  const [query, setQuery] = useState('')
  const [orders, setOrders] = useState<ClientOrder[]>([])

  useEffect(() => {
    // Первичная инициализация: мок + сохранённые
    const saved = normalizeOrdersFromStorage()
    const initial: ClientOrder[] = [
      ...ordersMock.map((o) => ({ ...o, status: 'published' as const })),
      ...saved,
    ]
    setOrders(initial)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return orders
    return orders.filter((o) => (o.title + ' ' + o.description + ' ' + o.category).toLowerCase().includes(q))
  }, [orders, query])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Мои заказы</h1>
            <p className="text-gray-600">Все ваши проекты, обсуждения и безопасные сделки — в одном месте.</p>
          </div>
          <Link href="/create-order" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-700">
            <Plus className="w-5 h-5" /> Создать заказ
          </Link>
        </div>

        {created && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 mt-0.5" />
            <div className="text-sm text-emerald-900">
              Заказ создан! Теперь вы можете выбрать специалиста, обсудить детали в чате и подключить безопасную сделку.
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Поиск по заказам..."
              />
            </div>
            <div className="text-sm text-gray-500">
              Всего: <b className="text-gray-900">{filtered.length}</b>
            </div>
          </div>

          <div className="divide-y">
            {filtered.map((o) => (
              <Link key={o.id} href={`/orders/${o.id}`} className="block p-5 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 truncate">{o.title}</div>
                    <div className="text-sm text-gray-600 line-clamp-2 mt-1">{o.description}</div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 rounded-full bg-gray-100 border border-gray-200">{o.category}</span>
                      <span className="px-2 py-1 rounded-full bg-gray-100 border border-gray-200">{o.location}</span>
                      <span className="px-2 py-1 rounded-full bg-gray-100 border border-gray-200">Откликов: {o.responses}</span>
                      {o.client.verified && (
                        <span className="px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 inline-flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Верифицирован
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm text-gray-500">Бюджет</div>
                    <div className="font-bold text-gray-900">
                      {typeof o.budget === 'number'
                        ? `${o.budget.toLocaleString()} ₽`
                        : `${o.budget.min.toLocaleString()}–${o.budget.max.toLocaleString()} ₽`}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 pt-24 pb-12">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">Загрузка…</div>
          </main>
          <Footer />
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  )
}


