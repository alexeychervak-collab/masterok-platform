import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-4">Условия использования</h1>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 prose max-w-none">
          <p>
            Это демо-версия условий. Для продакшена добавим юридические документы: оферта, политика, правила платформы,
            регламент споров, SLA поддержки.
          </p>
          <h3>1. Безопасная сделка</h3>
          <p>Платёж резервируется в эскроу до подтверждения результата заказчиком или решения спора.</p>
          <h3>2. Комиссия и тарифы</h3>
          <p>Комиссия и/или подписка зависят от выбранного тарифа (см. страницу “Тарифы”).</p>
          <h3>3. Рейтинги и отзывы</h3>
          <p>Отзывы можно оставлять после завершения заказа. Фальсификации запрещены.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}





