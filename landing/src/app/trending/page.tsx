import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { categoriesMock } from '@/lib/mock-data'

export default function TrendingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-2">Популярное</h1>
        <p className="text-gray-600 mb-6">Трендовые категории и лучшие специалисты (живой контент).</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesMock.filter((c) => c.popular).map((c) => (
            <Link
              key={c.id}
              href={`/search?q=${encodeURIComponent(c.name)}`}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="h-36 relative">
                <img src={c.image} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="text-2xl">{c.icon}</div>
                  <div className="font-bold">{c.name}</div>
                </div>
              </div>
              <div className="p-4 text-sm text-gray-600">{c.count.toLocaleString()} специалистов</div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}





