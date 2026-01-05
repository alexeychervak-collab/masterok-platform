'use client'

import Link from 'next/link'
import { ordersMock } from '@/lib/mock-data'
import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Briefcase, MapPin, ShieldCheck } from 'lucide-react'

export default function SpecialistOrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Мои заказы</h1>
            <p className="text-sm text-gray-600">История откликов и текущие сделки.</p>
          </div>
          <Link
            href="/specialist/find-orders"
            className="px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
          >
            Найти заказы
          </Link>
        </div>

        <div className="space-y-4">
          {ordersMock.map((o) => (
            <Link
              key={o.id}
              href={`/specialist/orders/${o.id}`}
              className="block bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-sm transition-all"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        <Briefcase className="w-3.5 h-3.5 mr-1" />
                        {o.category}
                      </Badge>
                      {o.safeDeal && (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                          Безопасная сделка
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        До {new Date(o.deadline).toLocaleDateString('ru-RU')}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 truncate">{o.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{o.description}</p>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                      <MapPin className="w-4 h-4" />
                      <span>{o.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-primary-700 font-semibold shrink-0">
                    Открыть
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}



