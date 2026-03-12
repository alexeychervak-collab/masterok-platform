'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ordersMock } from '@/lib/mock-data'
import EscrowPayment from '@/components/ui/escrow-payment'
import { ArrowLeft } from 'lucide-react'

export default function SpecialistDealPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const order = ordersMock.find((o) => o.id === id)

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Сделка не найдена</h1>
          <Link href="/specialist/orders" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-600 text-white">
            <ArrowLeft className="w-5 h-5" />
            К моим заказам
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const amount = typeof order.budget === 'number' ? order.budget : order.budget.max

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href={`/specialist/orders/${order.id}`} className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Назад к заказу
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Безопасная сделка</h1>
          <p className="text-gray-600 mb-6">
            Клиент резервирует оплату — вы приступаете к работе после подтверждения. Деньги выплачиваются после сдачи результата.
          </p>

          <EscrowPayment
            orderId={order.id}
            orderTitle={order.title}
            amount={amount}
            specialistName="Специалист МастерОК"
            clientName={order.client.name}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}



