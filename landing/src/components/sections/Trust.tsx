'use client'

import { motion } from 'framer-motion'
import { Shield, Award, Clock, CreditCard, HeadphonesIcon, CheckCircle2 } from 'lucide-react'

const trustItems = [
  {
    icon: Shield,
    title: 'Безопасные сделки',
    description: 'Деньги хранятся на защищённом счёте до завершения работы',
  },
  {
    icon: Award,
    title: 'Проверенные мастера',
    description: 'Каждый специалист проходит верификацию документов',
  },
  {
    icon: Clock,
    title: 'Быстрый отклик',
    description: 'Среднее время ответа — 5 минут',
  },
  {
    icon: CreditCard,
    title: 'Удобная оплата',
    description: 'Картой, наличными или в рассрочку',
  },
  {
    icon: HeadphonesIcon,
    title: 'Поддержка 24/7',
    description: 'Поможем решить любой вопрос в чате',
  },
  {
    icon: CheckCircle2,
    title: 'Гарантия качества',
    description: 'Вернём деньги, если что-то пойдёт не так',
  },
]

const logos = [
  { name: 'Тинькофф', width: 120 },
  { name: 'Сбер', width: 80 },
  { name: 'ЮКасса', width: 100 },
  { name: 'Visa', width: 60 },
  { name: 'Mastercard', width: 50 },
]

export function Trust() {
  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4">
        {/* Trust badges */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-4"
            >
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-600 mb-3">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Partner logos */}
        <div className="flex items-center justify-center gap-8 md:gap-16 opacity-40 grayscale">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="text-gray-400 font-bold text-lg"
              style={{ width: logo.width }}
            >
              {logo.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}




