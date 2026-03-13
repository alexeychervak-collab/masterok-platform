'use client'

import Link from 'next/link'
import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { Star, ThumbsUp, ThumbsDown, MessageSquare, TrendingUp, Filter } from 'lucide-react'

const reviews = [
  { id: 'r1', author: 'Анна Петрова', avatar: 'https://i.pravatar.cc/100?u=r1', rating: 5, text: 'Быстро договорились, всё по срокам. Коммуникация отличная, рекомендую!', pros: 'Аккуратность, пунктуальность, качество', cons: '', date: '2026-03-08', orderTitle: 'Электрика в квартире', response: 'Спасибо, Анна! Было приятно работать.' },
  { id: 'r2', author: 'Дмитрий Иванов', avatar: 'https://i.pravatar.cc/100?u=r2', rating: 5, text: 'Очень аккуратно, с фотоотчётом. Было приятно работать. Результат превзошёл ожидания.', pros: 'Фотоотчёт, чистота, внимание к деталям', cons: '', date: '2026-02-28', orderTitle: 'Косметический ремонт', response: '' },
  { id: 'r3', author: 'Мария Сидорова', avatar: 'https://i.pravatar.cc/100?u=r3', rating: 4, text: 'Проект получился сильный, но хотелось бы немного быстрее по правкам. В остальном всё на высоте.', pros: 'Качество работы, профессионализм', cons: 'Задержка с правками на 2 дня', date: '2026-02-15', orderTitle: 'Дизайн-проект', response: 'Мария, благодарю за отзыв! Учту по срокам.' },
  { id: 'r4', author: 'Олег Васильев', avatar: 'https://i.pravatar.cc/100?u=r4', rating: 5, text: 'Третий раз заказываю, и каждый раз результат на высшем уровне. Рекомендую всем!', pros: 'Опыт, надёжность, гарантия', cons: '', date: '2026-02-10', orderTitle: 'Ремонт санузла', response: '' },
  { id: 'r5', author: 'Елена Козлова', avatar: 'https://i.pravatar.cc/100?u=r5', rating: 5, text: 'Сделали ремонт кухни за 10 дней. Всё чисто, аккуратно. Мастер на связи постоянно.', pros: 'Скорость, качество, общение', cons: '', date: '2026-01-25', orderTitle: 'Ремонт кухни', response: 'Елена, спасибо! Рад что вам понравилось.' },
  { id: 'r6', author: 'Сергей Новиков', avatar: 'https://i.pravatar.cc/100?u=r6', rating: 4, text: 'В целом хорошая работа, но были мелкие недочёты по покраске. Исправили быстро после замечания.', pros: 'Оперативно исправляет замечания', cons: 'Мелкие недочёты при покраске', date: '2026-01-18', orderTitle: 'Малярные работы', response: '' },
  { id: 'r7', author: 'Наталья Морозова', avatar: 'https://i.pravatar.cc/100?u=r7', rating: 5, text: 'Отличная работа по электрике! Всё по нормам, с актами и гарантией. Буду обращаться ещё.', pros: 'Соблюдение норм, документация', cons: '', date: '2026-01-10', orderTitle: 'Электромонтаж', response: '' },
  { id: 'r8', author: 'Ирина Попова', avatar: 'https://i.pravatar.cc/100?u=r8', rating: 3, text: 'Нормально, но ожидала большего за такую цену. Сроки немного затянулись.', pros: 'Качество материалов', cons: 'Затянутые сроки, высокая цена', date: '2025-12-20', orderTitle: 'Укладка плитки', response: 'Ирина, приношу извинения за задержку. Была вынужденная пауза из-за доставки материалов.' },
  { id: 'r9', author: 'Павел Лебедев', avatar: 'https://i.pravatar.cc/100?u=r9', rating: 5, text: 'Профессионал своего дела! Установил натяжные потолки за один день. Идеально ровные.', pros: 'Скорость, мастерство', cons: '', date: '2025-12-12', orderTitle: 'Натяжные потолки', response: '' },
  { id: 'r10', author: 'Татьяна Волкова', avatar: 'https://i.pravatar.cc/100?u=r10', rating: 5, text: 'Замечательный мастер. Сделал полную замену сантехники. Работает чисто и быстро.', pros: 'Чистота, аккуратность, опыт', cons: '', date: '2025-12-01', orderTitle: 'Замена сантехники', response: 'Благодарю за доверие, Татьяна!' },
  { id: 'r11', author: 'Виктор Зайцев', avatar: 'https://i.pravatar.cc/100?u=r11', rating: 4, text: 'Хорошая работа по штукатурке стен. Немного дороговато, но качество оправдывает.', pros: 'Ровные стены, качественные материалы', cons: 'Цена выше средней', date: '2025-11-15', orderTitle: 'Штукатурные работы', response: '' },
  { id: 'r12', author: 'Юлия Белова', avatar: 'https://i.pravatar.cc/100?u=r12', rating: 5, text: 'Разработал отличный дизайн-проект. 3D визуализация помогла сразу увидеть результат. Очень довольна!', pros: 'Визуализация, креативность, вкус', cons: '', date: '2025-11-01', orderTitle: 'Дизайн квартиры', response: '' },
]

const ratingFilter = [0, 5, 4, 3, 2, 1]

export default function SpecialistReviewsPage() {
  const [filterRating, setFilterRating] = useState(0)
  const [showRespond, setShowRespond] = useState<string | null>(null)
  const [responseText, setResponseText] = useState('')

  const filtered = filterRating === 0 ? reviews : reviews.filter(r => r.rating === filterRating)
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(2)

  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100),
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Мои отзывы</h1>
            <p className="text-sm text-gray-600">Репутация — ключ к конверсии в заказ. Отвечайте на отзывы для роста доверия.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-base px-3 py-1">
              <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
              {avg}
            </Badge>
            <Badge variant="secondary" className="text-base px-3 py-1">{reviews.length} отзывов</Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Filter */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 flex-wrap">
              <Filter className="w-4 h-4 text-gray-400" />
              {ratingFilter.map(r => (
                <button
                  key={r}
                  onClick={() => setFilterRating(r)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterRating === r ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {r === 0 ? 'Все' : `${r} ★`}
                </button>
              ))}
              <span className="text-sm text-gray-500 ml-auto">Показано: {filtered.length}</span>
            </div>

            {/* Reviews List */}
            {filtered.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start gap-4">
                  <img src={r.avatar} alt={r.author} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold text-gray-900">{r.author}</div>
                        <div className="text-sm text-gray-500 mt-0.5">
                          {new Date(r.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })} • {r.orderTitle}
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-4 h-4 ${s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-700 mt-3">{r.text}</p>

                    {(r.pros || r.cons) && (
                      <div className="flex flex-wrap gap-4 mt-3">
                        {r.pros && (
                          <div className="flex items-start gap-2 text-sm">
                            <ThumbsUp className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            <span className="text-gray-600">{r.pros}</span>
                          </div>
                        )}
                        {r.cons && (
                          <div className="flex items-start gap-2 text-sm">
                            <ThumbsDown className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                            <span className="text-gray-600">{r.cons}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {r.response && (
                      <div className="mt-4 bg-primary-50 rounded-xl p-4 border-l-4 border-primary-500">
                        <div className="text-xs font-semibold text-primary-700 mb-1">Ваш ответ:</div>
                        <p className="text-sm text-gray-700">{r.response}</p>
                      </div>
                    )}

                    {!r.response && (
                      <div className="mt-3">
                        {showRespond === r.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              placeholder="Напишите ответ на отзыв..."
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm"
                            />
                            <div className="flex gap-2">
                              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">Отправить</button>
                              <button onClick={() => { setShowRespond(null); setResponseText('') }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Отмена</button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowRespond(r.id)}
                            className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> Ответить
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rating Distribution */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-600" /> Распределение оценок
              </h2>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-gray-900">{avg}</div>
                <div className="flex items-center justify-center gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-5 h-5 ${s <= Math.round(Number(avg)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <div className="text-sm text-gray-500 mt-1">{reviews.length} отзывов</div>
              </div>
              <div className="space-y-2">
                {distribution.map(d => (
                  <div key={d.star} className="flex items-center gap-2">
                    <span className="text-sm font-medium w-6">{d.star}★</span>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all"
                        style={{ width: `${d.pct}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-12 text-right">{d.count} ({d.pct}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-3">Как увеличить число отзывов</h2>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold mt-0.5">1</span>
                  Закрывайте заказ через «Безопасную сделку» — клиенту проще оставить отзыв.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold mt-0.5">2</span>
                  Просите отзыв сразу после сдачи результата через шаблон в чате.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold mt-0.5">3</span>
                  Отвечайте на все отзывы — это повышает доверие на 35%.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold mt-0.5">4</span>
                  Держите SLA по ответу — быстрый отклик = больше заказов.
                </li>
              </ul>
              <div className="mt-5">
                <Link href="/specialist/finances" className="text-primary-700 hover:text-primary-800 font-semibold text-sm">
                  Подключить Premium для роста видимости →
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-3">Быстрые ссылки</h2>
              <div className="space-y-2">
                <Link href="/specialist/dashboard" className="block text-sm text-primary-600 hover:underline">Панель управления →</Link>
                <Link href="/specialist/settings" className="block text-sm text-primary-600 hover:underline">Настройки профиля →</Link>
                <Link href="/specialist/finances" className="block text-sm text-primary-600 hover:underline">Финансы →</Link>
                <Link href="/specialist/calendar" className="block text-sm text-primary-600 hover:underline">Календарь →</Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
