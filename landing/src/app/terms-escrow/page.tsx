import Link from 'next/link'
import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function TermsEscrowPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Условия «Безопасной сделки»</h1>
          <p className="text-gray-600 mb-6">
            Это публичная страница условий. Здесь — понятные правила для клиента и специалиста.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-2">1. Как работает сделка</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Клиент резервирует оплату (эскроу) до завершения работ.</li>
            <li>Специалист выполняет работу и сдаёт результат.</li>
            <li>После подтверждения клиентом средства перечисляются специалисту.</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-2">2. Споры и арбитраж</h2>
          <p className="text-gray-700">
            Если стороны не договорились, платформа помогает собрать доказательства (переписка, файлы, этапы)
            и принять решение по выплате.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-2">3. Комиссии</h2>
          <p className="text-gray-700">
            Комиссия может зависеть от тарифа и категории работ. Точные значения отображаются перед оплатой.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-2">4. Документы</h2>
          <p className="text-gray-700">
            Рекомендуем фиксировать объём и сроки работ в описании заказа/в чате, прикладывать ТЗ и файлы.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/orders"
              className="px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-center"
            >
              Перейти к заказам
            </Link>
            <Link
              href="/help"
              className="px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 font-semibold text-gray-900 text-center"
            >
              В помощь
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}


