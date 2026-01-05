import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { Star, ShieldCheck, MessageSquare, Briefcase, MapPin } from 'lucide-react'
import { specialistsMock } from '@/lib/mock-data'

export default function SpecialistProfilePage({ params }: { params: { id: string } }) {
  const s = specialistsMock.find((x) => x.id === params.id)
  if (!s) return notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <img src={s.avatarUrl} alt={s.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white/30" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{s.name}</h1>
                  {s.verified && <ShieldCheck className="w-5 h-5" />}
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
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/messages"
                  className="px-5 py-3 rounded-2xl bg-white text-emerald-700 font-bold hover:bg-white/90 transition-colors inline-flex items-center gap-2"
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
                <p className="text-gray-700">{s.description}</p>

                <h3 className="text-lg font-bold mt-8 mb-3">Портфолио</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {s.portfolio.map((img) => (
                    <img key={img} src={img} alt="Portfolio" className="w-full h-40 object-cover rounded-2xl" loading="lazy" />
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold mb-4">Стоимость</h2>
                <div className="text-3xl font-bold text-gray-900">
                  {s.hourlyRate ? `${s.hourlyRate.toLocaleString()} ₽/час` : s.fixedPrice ? `${s.fixedPrice.toLocaleString()} ₽` : 'По договорённости'}
                </div>
                <div className="text-sm text-gray-600 mt-2">Отклик/чат — бесплатно. Безопасная сделка — через эскроу.</div>

                <h3 className="text-lg font-bold mt-6 mb-3">Навыки</h3>
                <div className="flex flex-wrap gap-2">
                  {s.skills.map((sk) => (
                    <span key={sk} className="px-3 py-1 rounded-xl bg-white border border-gray-200 text-sm">
                      {sk}
                    </span>
                  ))}
                </div>

                <div className="mt-6">
                  <Link href="/create-order" className="block w-full text-center px-5 py-3 rounded-2xl bg-gray-900 text-white font-bold hover:bg-black transition-colors">
                    Создать заказ
                  </Link>
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



