import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function OfferPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-4">Оферта</h1>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 prose max-w-none">
          <p>Демо-страница. В продакшене — публичная оферта/договор оказания услуг.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}





