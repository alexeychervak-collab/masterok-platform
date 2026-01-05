import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { Search, Home, HelpCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="text-6xl font-black text-gray-900">404</div>
          <h1 className="text-2xl font-bold mt-2">Страница не найдена</h1>
          <p className="text-gray-600 mt-2">
            Мы сделали так, чтобы по сайту 404 не встречались. Если вы попали сюда — значит адрес введён вручную или ссылка устарела.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gray-900 text-white font-bold hover:bg-black">
              <Home className="w-5 h-5" /> На главную
            </Link>
            <Link href="/search" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-700">
              <Search className="w-5 h-5" /> Найти специалиста
            </Link>
            <Link href="/help" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-gray-200 font-bold hover:bg-gray-50">
              <HelpCircle className="w-5 h-5" /> Помощь
            </Link>
          </div>

          <div className="mt-8 text-left">
            <div className="font-bold mb-2">Популярные разделы</div>
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              <Link className="px-4 py-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-100" href="/create-order">
                Создать заказ
              </Link>
              <Link className="px-4 py-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-100" href="/specialist/find-orders">
                Найти заказы (специалисту)
              </Link>
              <Link className="px-4 py-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-100" href="/pricing">
                Тарифы / Premium
              </Link>
              <Link className="px-4 py-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-100" href="/messages">
                Сообщения
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}




