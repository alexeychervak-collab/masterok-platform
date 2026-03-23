'use client'

import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import ChatWindow from '@/components/ui/chat-window'
import { useState } from 'react'
import { Search, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const dialogs = [
  { id: 'd1', name: 'Анна Петрова', last: 'Когда сможете начать?', online: true },
  { id: 'd2', name: 'Дмитрий Иванов', last: 'Ок, согласуем смету', online: false },
  { id: 'd3', name: 'Мария Сидорова', last: 'Скиньте примеры работ', online: true },
]

export default function SpecialistMessagesPage() {
  const [active, setActive] = useState(dialogs[0])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Link href="/specialist/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Назад к панели управления
        </Link>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Сообщения</h1>
          <p className="text-gray-600">Чат с клиентами. Обсудите детали заказов и согласуйте условия.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Dialog list */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500" placeholder="Поиск клиентов..." />
              </div>
            </div>
            <div className="divide-y">
              {dialogs.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setActive(d)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${active.id === d.id ? 'bg-orange-50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{d.name}</div>
                    <div className={`text-xs ${d.online ? 'text-green-600' : 'text-gray-400'}`}>{d.online ? 'онлайн' : 'оффлайн'}</div>
                  </div>
                  <div className="text-sm text-gray-600 line-clamp-1 mt-1">{d.last}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="lg:col-span-2">
            <ChatWindow recipientName={active.name} recipientOnline={active.online} orderTitle="Обсуждение заказа" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}





