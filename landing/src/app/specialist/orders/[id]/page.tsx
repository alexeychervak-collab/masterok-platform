'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ordersMock } from '@/lib/mock-data'
import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Calendar, MapPin, ShieldCheck, Star } from 'lucide-react'

export default function SpecialistOrderDetailsPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const order = ordersMock.find((o) => o.id === id)

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Заказ не найден</h1>
          <p className="text-gray-600 mb-6">Возможно, ссылка устарела или заказ удалён.</p>
          <Link href="/specialist/orders" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-600 text-white">
            <ArrowLeft className="w-5 h-5" />
            К моим заказам
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link href="/specialist/orders" className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Назад
          </Link>

          <div className="flex items-center gap-2">
            {order.safeDeal && (
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Безопасная сделка
              </Badge>
            )}
            {order.direction && (
              <Badge variant="secondary" className="text-xs">
                {order.direction}
              </Badge>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{order.title}</h1>
          <p className="text-gray-700 mb-4">{order.description}</p>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-gray-50">
              <div className="text-xs text-gray-500 mb-1">Локация</div>
              <div className="font-medium text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                {order.location}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50">
              <div className="text-xs text-gray-500 mb-1">Срок</div>
              <div className="font-medium text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                {order.term ?? 'Не указан'}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50">
              <div className="text-xs text-gray-500 mb-1">Экспертиза</div>
              <div className="font-medium text-gray-900">{order.expertise ?? 'Не требуется'}</div>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <Link
              href="/messages"
              className="flex-1 px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 font-semibold text-gray-900 text-center"
            >
              Открыть чат
            </Link>
            <Link
              href={order.safeDeal ? `/specialist/orders/${order.id}/deal` : `/orders/${order.id}/deal`}
              className="flex-1 px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-center inline-flex items-center justify-center gap-2"
            >
              {order.safeDeal ? 'Перейти к сделке' : 'Предложить условия'}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Клиент</h2>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-gray-900">{order.client.name}</div>
              <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {order.client.rating}
                </span>
                <span>•</span>
                <span>{order.client.ordersCount} заказов</span>
                {order.client.verified && (
                  <>
                    <span>•</span>
                    <span className="text-green-700">Верифицирован</span>
                  </>
                )}
              </div>
            </div>
            <Link href="/profile" className="text-primary-700 hover:text-primary-800 font-semibold">
              Профиль клиента
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}



