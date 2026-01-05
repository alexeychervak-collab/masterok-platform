'use client'

import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { Crown, ShieldCheck, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function PremiumCheckoutPage() {
  const [isPaying, setIsPaying] = useState(false)

  async function pay() {
    setIsPaying(true)
    try {
      // TODO: создать платеж через backend /api/payments/create (ЮKassa) и редиректнуть на confirmation_url
      await new Promise((r) => setTimeout(r, 900))
      alert('Демо: оплата Premium. Подключим ЮKassa после добавления ключей и webhook.')
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Premium</h1>
                  <p className="text-white/80">Максимум заказов и возможностей</p>
                </div>
              </div>
              <div className="text-4xl font-bold mt-6">1 490₽ <span className="text-base font-semibold text-white/80">/ месяц</span></div>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {[
                  'Неограниченные отклики',
                  'Топ в выдаче поиска',
                  'Расширенная аналитика',
                  'Значок Premium',
                  'Приоритетная поддержка',
                  'Push по компетенциям',
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm">{t}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 mb-6">
                <ShieldCheck className="w-5 h-5 text-emerald-700 mt-0.5" />
                <div className="text-sm text-emerald-900">
                  Оплата будет подключена через <b>ЮKassa</b>. Деньги списываются ежемесячно, можно отменить в любой момент.
                </div>
              </div>

              <button
                onClick={pay}
                disabled={isPaying}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPaying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Переходим к оплате...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Оплатить Premium
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="mt-4 text-center text-sm text-gray-600">
                Нет аккаунта?{' '}
                <Link href="/register-specialist" className="text-primary-600 font-semibold hover:underline">
                  Зарегистрироваться как специалист
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}





