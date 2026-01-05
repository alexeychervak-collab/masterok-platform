import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-2">Профиль</h1>
        <p className="text-gray-600 mb-6">Единый профиль для заказчика и специалиста (демо).</p>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <Link
              href="/settings"
              className="px-4 py-3 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50"
            >
              Настройки
            </Link>
            <Link
              href="/specialist/dashboard"
              className="px-4 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700"
            >
              Кабинет специалиста
            </Link>
            <Link
              href="/create-order"
              className="px-4 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black"
            >
              Создать заказ
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}





