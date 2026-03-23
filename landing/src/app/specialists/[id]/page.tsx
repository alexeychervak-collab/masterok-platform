'use client'

import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { Star, ShieldCheck, MessageSquare, Briefcase, MapPin, Clock, ArrowLeft, CheckCircle, ThumbsUp, ThumbsDown } from 'lucide-react'
import { specialistsMock, reviewsMock } from '@/lib/mock-data'

export default function SpecialistProfilePage({ params }: { params: { id: string } }) {
  const s = specialistsMock.find((x) => x.id === params.id)
  if (!s) return notFound()

  const reviews = reviewsMock.filter((r) => r.specialistId === params.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Back button */}
        <Link href="/search" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Назад к поиску
        </Link>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header banner */}
          <div className="p-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <img src={s.avatarUrl} alt={s.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white/30" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{s.name}</h1>
                  {s.verified && <ShieldCheck className="w-5 h-5" />}
                  {s.topRated && (
                    <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">TOP</span>
                  )}
                </div>
                <div className="text-white/90 mt-1">{s.title}</div>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-white/90">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    <b>{s.rating}</b> ({s.reviewCount} отзывов)
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> {s.completedJobs} заказов
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {s.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Ответ: {s.responseTime}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link
                  href="/messages"
                  className="px-5 py-3 rounded-2xl bg-white text-orange-600 font-bold hover:bg-white/90 transition-colors inline-flex items-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" /> Написать
                </Link>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold mb-3">О специалисте</h2>
                <p className="text-gray-700 leading-relaxed">{s.description}</p>

                <h3 className="text-lg font-bold mt-8 mb-3">Портфолио</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {s.portfolio.map((img) => (
                    <img key={img} src={img} alt="Portfolio" className="w-full h-40 object-cover rounded-2xl hover:scale-105 transition-transform" loading="lazy" />
                  ))}
                </div>

                {/* Reviews section */}
                <h3 className="text-lg font-bold mt-8 mb-4">
                  Отзывы ({reviews.length > 0 ? reviews.length : s.reviewCount})
                </h3>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <div className="flex items-start gap-3 mb-3">
                          <img src={review.clientAvatar} alt={review.clientName} className="w-10 h-10 rounded-full object-cover" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold text-gray-900">{review.clientName}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(review.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                        {review.pros && (
                          <div className="mt-2 flex items-start gap-2 text-sm text-green-700">
                            <ThumbsUp className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>{review.pros}</span>
                          </div>
                        )}
                        {review.cons && (
                          <div className="mt-1 flex items-start gap-2 text-sm text-red-600">
                            <ThumbsDown className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>{review.cons}</span>
                          </div>
                        )}
                        {review.response && (
                          <div className="mt-3 ml-4 pl-4 border-l-2 border-orange-200 text-sm text-gray-600">
                            <span className="font-medium text-orange-600">Ответ специалиста:</span>{' '}
                            {review.response}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-2xl p-6 text-center text-gray-500">
                    <Star className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>Отзывы скоро появятся</p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 sticky top-24">
                  <h2 className="text-lg font-bold mb-4">Стоимость</h2>
                  <div className="text-3xl font-bold text-gray-900">
                    {s.hourlyRate ? `${s.hourlyRate.toLocaleString()} \u20BD/час` : s.fixedPrice ? `${s.fixedPrice.toLocaleString()} \u20BD` : 'По договорённости'}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">Отклик/чат — бесплатно. Безопасная сделка — через эскроу.</div>

                  {/* Availability indicator */}
                  <div className="mt-4 flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${s.availability === 'online' ? 'bg-green-500 animate-pulse' : s.availability === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                    <span className="text-sm text-gray-600">
                      {s.availability === 'online' ? 'Онлайн, готов к работе' : s.availability === 'busy' ? 'Занят, но принимает заказы' : 'Сейчас оффлайн'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mt-6 mb-3">Навыки</h3>
                  <div className="flex flex-wrap gap-2">
                    {s.skills.map((sk) => (
                      <span key={sk} className="px-3 py-1 rounded-xl bg-white border border-gray-200 text-sm">
                        {sk}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 space-y-3">
                    <Link href="/create-order" className="block w-full text-center px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:shadow-lg transition-all">
                      Создать заказ
                    </Link>
                    <Link href="/messages" className="block w-full text-center px-5 py-3 rounded-2xl border-2 border-gray-200 text-gray-700 font-bold hover:border-orange-500 hover:text-orange-600 transition-all">
                      Связаться
                    </Link>
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
