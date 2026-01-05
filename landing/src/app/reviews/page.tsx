import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { Star, ShieldCheck, MessageSquare } from 'lucide-react'
import { specialistsMock } from '@/lib/mock-data'

const reviews = [
  {
    id: 'r1',
    specialistId: '1',
    author: 'Анна Петрова',
    rating: 5,
    text: 'Супер-четко: проект дома сделали быстро, по нормам, всё пояснили. Отличная коммуникация.',
    date: '2026-01-01',
  },
  {
    id: 'r2',
    specialistId: '2',
    author: 'Дмитрий Иванов',
    rating: 5,
    text: 'Ремонт под ключ — в срок, без «сюрпризов». Фотоотчёты, смета, всё прозрачно. Рекомендую.',
    date: '2025-12-22',
  },
  {
    id: 'r3',
    specialistId: '3',
    author: 'Мария Сидорова',
    rating: 4,
    text: 'Проводку заменили аккуратно. Было пару уточнений, но решилось быстро. В целом отлично.',
    date: '2025-12-14',
  },
]

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < n ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
      ))}
    </span>
  )
}

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Отзывы</h1>
            <p className="text-gray-600">Реальные отзывы клиентов — ключ к доверию. Это работает лучше, чем на Profi/YouDo.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/search" className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black">
              Найти специалиста
            </Link>
            <Link href="/create-order" className="px-4 py-2 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50">
              Создать заказ
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {reviews.map((r) => {
              const sp = specialistsMock.find((s) => s.id === r.specialistId)
              return (
                <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <img
                      src={sp?.avatarUrl || 'https://i.pravatar.cc/200?img=1'}
                      alt={sp?.name || 'Специалист'}
                      className="w-12 h-12 rounded-xl object-cover"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-bold">{r.author}</div>
                        <div className="text-xs text-gray-500">{new Date(r.date).toLocaleDateString('ru-RU')}</div>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Stars n={r.rating} />
                        {sp?.verified && (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                            <ShieldCheck className="w-3.5 h-3.5" /> Проверенный
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mt-3">{r.text}</p>
                      {sp && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Link
                            href={`/specialists/${sp.id}`}
                            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold text-sm"
                          >
                            Профиль {sp.name}
                          </Link>
                          <Link
                            href="/messages"
                            className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 font-semibold text-sm inline-flex items-center gap-2"
                          >
                            <MessageSquare className="w-4 h-4" /> Написать
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-fit">
            <h2 className="text-lg font-bold mb-2">Оставить отзыв</h2>
            <p className="text-sm text-gray-600 mb-4">
              Демо-форма. В продакшене отзывы публикуются только по выполненным заказам и после модерации.
            </p>
            <ol className="text-sm text-gray-700 space-y-2 list-decimal pl-5">
              <li>Создайте заказ</li>
              <li>Выберите специалиста и работайте в чате</li>
              <li>Оплатите через безопасную сделку</li>
              <li>После завершения — оставьте отзыв</li>
            </ol>
            <div className="mt-5">
              <Link href="/create-order" className="block w-full text-center px-5 py-3 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-700">
                Создать заказ
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}




