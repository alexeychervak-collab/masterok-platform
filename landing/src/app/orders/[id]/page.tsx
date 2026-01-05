import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ordersMock } from '@/lib/mock-data'
import { MapPin, Calendar, ShieldCheck, MessageSquare, CreditCard, ArrowRight } from 'lucide-react'

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = ordersMock.find((o) => o.id === params.id)
  if (!order) return notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
              <div className="text-sm text-white/70">Заказ</div>
              <h1 className="text-3xl font-bold mt-1">{order.title}</h1>
              <div className="flex flex-wrap gap-3 mt-4 text-sm text-white/80">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {order.location}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> срок до {new Date(order.deadline).toLocaleDateString('ru-RU')}
                </span>
                {order.client.verified && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30">
                    <ShieldCheck className="w-4 h-4" /> клиент верифицирован
                  </span>
                )}
              </div>
            </div>

            <div className="p-8">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-bold mb-3">Описание</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{order.description}</p>

                  <h3 className="text-lg font-bold mt-8 mb-3">Что дальше</h3>
                  <ol className="list-decimal pl-5 text-gray-700 space-y-2">
                    <li>Обсудить детали с исполнителем в чате</li>
                    <li>Зафиксировать этапы (milestones) и стоимость</li>
                    <li>Подключить безопасную сделку (эскроу)</li>
                    <li>Принять результат и разблокировать оплату</li>
                  </ol>
                </div>

                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                  <div className="text-sm text-gray-600">Бюджет</div>
                  <div className="text-3xl font-bold text-gray-900 mt-1">
                    {typeof order.budget === 'number'
                      ? `${order.budget.toLocaleString()} ₽`
                      : `${order.budget.min.toLocaleString()}–${order.budget.max.toLocaleString()} ₽`}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">Откликов: <b className="text-gray-900">{order.responses}</b></div>

                  <div className="mt-6 space-y-2">
                    <Link
                      href="/messages"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border border-gray-200 font-bold hover:bg-gray-50"
                    >
                      <MessageSquare className="w-5 h-5" /> Обсудить в чате
                    </Link>
                    <Link
                      href={`/orders/${order.id}/deal`}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-700"
                    >
                      <CreditCard className="w-5 h-5" /> Безопасная сделка <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>

                  <div className="mt-6 text-xs text-gray-500">
                    Демо: платежи подключаются через ЮKassa. В продакшене — webhook и статусы в заказе.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}




