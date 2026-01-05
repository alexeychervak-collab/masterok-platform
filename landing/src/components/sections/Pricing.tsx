'use client'

import { motion } from 'framer-motion'
import { Check, X, Crown, Zap, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const plans = [
  {
    name: 'Для клиентов',
    description: 'Найдите идеального специалиста',
    price: 'Бесплатно',
    period: '',
    features: [
      { text: 'Неограниченный поиск', included: true },
      { text: 'Отзывы и рейтинги', included: true },
      { text: 'Чат с мастерами', included: true },
      { text: 'Безопасные платежи', included: true },
      { text: 'История заказов', included: true },
      { text: 'Поддержка 24/7', included: true },
    ],
    cta: 'Начать бесплатно',
    popular: false,
    gradient: 'from-gray-100 to-gray-50',
    icon: Star,
  },
  {
    name: 'Для специалистов',
    description: 'Получайте заказы и зарабатывайте',
    price: '0₽',
    period: 'Комиссия 15%',
    features: [
      { text: 'Профиль специалиста', included: true },
      { text: 'До 10 откликов в день', included: true },
      { text: 'Базовая аналитика', included: true },
      { text: 'Чат с клиентами', included: true },
      { text: 'Вывод на карту', included: true },
      { text: 'Приоритетная поддержка', included: false },
    ],
    cta: 'Стать специалистом',
    popular: false,
    gradient: 'from-violet-100 to-fuchsia-50',
    icon: Zap,
  },
  {
    name: 'Premium',
    description: 'Максимум заказов и возможностей',
    price: '1 490₽',
    period: '/месяц',
    features: [
      { text: 'Всё из базового тарифа', included: true },
      { text: 'Неограниченные отклики', included: true },
      { text: 'Топ в выдаче поиска', included: true },
      { text: 'Расширенная аналитика', included: true },
      { text: 'Значок Premium', included: true },
      { text: 'Приоритетная поддержка', included: true },
    ],
    cta: 'Попробовать Premium',
    popular: true,
    gradient: 'from-violet-600 to-fuchsia-600',
    icon: Crown,
  },
]

export function Pricing() {
  return (
    <section className="py-20 md:py-32 bg-gray-50/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">
            Тарифы
          </Badge>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Прозрачные <span className="gradient-text">цены</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Для клиентов — всегда бесплатно. Для специалистов — честная комиссия только с выполненных заказов.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-3xl p-8 ${
                plan.popular
                  ? 'bg-gradient-to-br ' + plan.gradient + ' text-white scale-105 shadow-2xl shadow-violet-500/30'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-amber-400 text-amber-900 font-bold px-4">
                    <Crown className="h-3 w-3 mr-1" />
                    Популярный
                  </Badge>
                </div>
              )}
              
              <div className={`inline-flex p-3 rounded-xl mb-4 ${
                plan.popular ? 'bg-white/20' : 'bg-gradient-to-br ' + plan.gradient
              }`}>
                <plan.icon className={`h-6 w-6 ${plan.popular ? 'text-white' : 'text-violet-600'}`} />
              </div>
              
              <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-6 ${plan.popular ? 'text-white/80' : 'text-gray-500'}`}>
                {plan.description}
              </p>
              
              <div className="mb-6">
                <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className={`text-sm ${plan.popular ? 'text-white/80' : 'text-gray-500'}`}>
                    {plan.period}
                  </span>
                )}
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className={`h-5 w-5 ${plan.popular ? 'text-white' : 'text-emerald-500'}`} />
                    ) : (
                      <X className={`h-5 w-5 ${plan.popular ? 'text-white/40' : 'text-gray-300'}`} />
                    )}
                    <span className={`text-sm ${
                      plan.popular
                        ? feature.included ? 'text-white' : 'text-white/40'
                        : feature.included ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button
                asChild
                className={`w-full ${
                  plan.popular
                    ? 'bg-white text-violet-600 hover:bg-white/90'
                    : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                }`}
                size="lg"
              >
                <Link
                  href={
                    plan.name === 'Premium'
                      ? '/checkout/premium'
                      : plan.name === 'Для специалистов'
                        ? '/register-specialist'
                        : '/create-order'
                  }
                >
                  {plan.cta}
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
        
        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center text-gray-500 text-sm mt-12"
        >
          * Комиссия списывается только с успешно выполненных заказов. Без скрытых платежей.
        </motion.p>
      </div>
    </section>
  )
}




