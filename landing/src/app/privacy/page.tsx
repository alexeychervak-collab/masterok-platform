import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-4">Политика конфиденциальности</h1>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 prose max-w-none">
          <p>
            Демо-страница. В продакшене добавим полноценную политику обработки персональных данных (152‑ФЗ), cookies,
            хранение, сроки, права пользователя.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}





