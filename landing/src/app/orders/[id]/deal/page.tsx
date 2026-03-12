import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { notFound } from 'next/navigation'
import { ordersMock } from '@/lib/mock-data'
import EscrowPayment from '@/components/ui/escrow-payment'
import { specialistsMock } from '@/lib/mock-data'

export default function OrderDealPage({ params }: { params: { id: string } }) {
  const order = ordersMock.find((o) => o.id === params.id)
  if (!order) return notFound()

  const amount =
    typeof order.budget === 'number'
      ? order.budget
      : Math.round((order.budget.min + order.budget.max) / 2)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          <EscrowPayment
            orderId={order.id}
            orderTitle={order.title}
            amount={amount}
            specialistName={specialistsMock[0]?.name || 'Специалист МастерОК'}
            specialistAvatar={specialistsMock[0]?.avatarUrl}
            clientName={order.client.name}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}


