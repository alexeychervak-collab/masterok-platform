import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HowItWorks } from '@/components/sections/HowItWorks'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}





