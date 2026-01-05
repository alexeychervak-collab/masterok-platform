'use client'

import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { categoriesMock } from '@/lib/mock-data'

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-2">Все услуги</h1>
        <p className="text-gray-600 mb-6">Каталог услуг (демо). Переходите в поиск — там фильтры, рейтинги, фото.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoriesMock.map((c) => (
            <Link
              key={c.id}
              href={`/search?q=${encodeURIComponent(c.name)}`}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all flex items-center justify-between"
            >
              <div>
                <div className="font-bold">{c.icon} {c.name}</div>
                <div className="text-sm text-gray-600 mt-1">{c.count.toLocaleString()} специалистов</div>
              </div>
              <div className="text-primary-600 font-semibold">→</div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}





