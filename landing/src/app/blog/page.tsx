import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

const posts = [
  { slug: 'kak-vybrat-profi', title: 'Как выбрать специалиста: чек‑лист на 5 минут', date: '2026-01-01' },
  { slug: 'bezopasnaya-sdelka', title: 'Безопасная сделка: как работает эскроу', date: '2026-01-02' },
  { slug: 'top-10-oshibok', title: 'Топ‑10 ошибок при ремонте и как их избежать', date: '2026-01-03' },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-2">Блог</h1>
        <p className="text-gray-600 mb-6">Полезные статьи для заказчиков и специалистов (демо‑контент).</p>
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href="#"
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all"
            >
              <div className="text-sm text-gray-500">{new Date(p.date).toLocaleDateString('ru-RU')}</div>
              <div className="font-bold mt-2">{p.title}</div>
              <div className="text-sm text-primary-600 font-semibold mt-3">Читать →</div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}





