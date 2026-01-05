'use client'

import Link from 'next/link'
import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'

const reviews = [
  {
    id: 'r1',
    author: 'Анна',
    rating: 5,
    text: 'Быстро договорились, всё по срокам. Коммуникация отличная, рекомендую.',
    date: '2025-12-12',
    orderTitle: 'Электрика в квартире',
  },
  {
    id: 'r2',
    author: 'Дмитрий',
    rating: 5,
    text: 'Очень аккуратно, с фотоотчётом. Было приятно работать.',
    date: '2025-11-28',
    orderTitle: 'Косметический ремонт',
  },
  {
    id: 'r3',
    author: 'Мария',
    rating: 4,
    text: 'Проект получился сильный, но хотелось бы немного быстрее по правкам.',
    date: '2025-10-09',
    orderTitle: 'Дизайн-проект',
  },
]

export default function SpecialistReviewsPage() {
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(2)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Отзывы</h1>
            <p className="text-sm text-gray-600">Репутация — ключ к конверсии в заказ.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
              <Star className="w-3.5 h-3.5 mr-1 fill-yellow-400 text-yellow-400" />
              {avg}
            </Badge>
            <Badge variant="secondary">{reviews.length} отзывов</Badge>
          </div>
        </div>

        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-gray-900">{r.author}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(r.date).toLocaleDateString('ru-RU')} • {r.orderTitle}
                  </div>
                </div>
                <div className="inline-flex items-center gap-1 text-yellow-600 font-semibold">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {r.rating}
                </div>
              </div>
              <p className="text-gray-700 mt-3">{r.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Как увеличить число отзывов</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Закрывайте заказ через «Безопасную сделку» — клиенту проще оставить отзыв.</li>
            <li>Просите отзыв сразу после сдачи результата (шаблон сообщения в чате).</li>
            <li>Держите SLA по ответу — это повышает рейтинг и повторные обращения.</li>
          </ul>
          <div className="mt-5">
            <Link href="/specialist/finances" className="text-primary-700 hover:text-primary-800 font-semibold">
              Подключить Premium для роста видимости →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}



