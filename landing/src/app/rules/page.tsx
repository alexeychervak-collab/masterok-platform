import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-4">Правила платформы</h1>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 prose max-w-none">
          <ul>
            <li>Никаких фейковых отзывов — только подтверждённые заказы.</li>
            <li>Запрещены спам, обман и обход безопасной сделки.</li>
            <li>Споры решаются через поддержку и арбитраж (демо‑описание).</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  )
}





