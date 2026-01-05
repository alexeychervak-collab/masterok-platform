import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Pricing } from '@/components/sections/Pricing'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}





