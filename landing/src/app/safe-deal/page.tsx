'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Shield,
  Lock,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  CreditCard,
  Clock,
  MessageCircle,
  FileText,
  Sparkles,
  ShieldCheck,
  Ban,
  Undo2,
} from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Создание заказа',
    description: 'Заказчик размещает заказ и выбирает специалиста. Обе стороны согласовывают объём работ, сроки и стоимость.',
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    step: '02',
    title: 'Внесение оплаты',
    description: 'Заказчик вносит оплату на защищённый эскроу-счёт. Деньги замораживаются и не доступны никому до завершения работ.',
    icon: CreditCard,
    color: 'from-purple-500 to-pink-500',
  },
  {
    step: '03',
    title: 'Выполнение работ',
    description: 'Специалист выполняет работу, зная что оплата гарантирована. Заказчик может отслеживать прогресс через платформу.',
    icon: Clock,
    color: 'from-green-500 to-emerald-500',
  },
  {
    step: '04',
    title: 'Приёмка и оплата',
    description: 'Заказчик подтверждает завершение работ. Деньги автоматически переводятся специалисту в течение 1-3 дней.',
    icon: CheckCircle,
    color: 'from-orange-500 to-red-500',
  },
];

const guarantees = [
  {
    icon: ShieldCheck,
    title: '100% защита платежей',
    description: 'Деньги хранятся на отдельном эскроу-счёте, защищённом банковскими стандартами безопасности PCI DSS.',
  },
  {
    icon: Undo2,
    title: 'Возврат при проблемах',
    description: 'Если работы не выполнены или выполнены некачественно, деньги возвращаются заказчику из эскроу.',
  },
  {
    icon: MessageCircle,
    title: 'Разрешение споров',
    description: 'Профессиональные медиаторы помогут решить спорную ситуацию в течение 48 часов. Решение основано на доказательствах.',
  },
  {
    icon: Lock,
    title: 'Шифрование данных',
    description: 'Все данные передаются по защищённым каналам TLS 1.3. Карточные данные обрабатываются сертифицированным партнёром.',
  },
];

const advantages = [
  { title: 'Для заказчиков', items: [
    'Оплата только за результат',
    'Деньги защищены до приёмки работ',
    'Поэтапная оплата (milestone)',
    'Возврат при некачественной работе',
    'Профессиональное разрешение споров',
    'Никаких предоплат напрямую мастеру',
  ]},
  { title: 'Для специалистов', items: [
    'Гарантированная оплата за работу',
    'Защита от неплатёжеспособных клиентов',
    'Быстрый вывод средств (1-3 дня)',
    'Прозрачная история платежей',
    'Рост доверия и рейтинга',
    'Никаких рисков неоплаты',
  ]},
];

export default function SafeDealPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-6">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-600">Эскроу-защита</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Безопасная{' '}
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  сделка
                </span>
              </h1>

              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Ваши деньги под надёжной защитой. Система эскроу гарантирует безопасность
                каждой сделки на платформе МастерОК.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/create-order"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                >
                  Разместить заказ
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/faq"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 rounded-xl font-semibold hover:border-green-500 transition-all"
                >
                  Узнать больше
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Как работает эскроу</h2>
              <p className="text-xl text-gray-600">Простой и надёжный процесс в 4 шага</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all">
                    <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center text-white mb-6`}>
                      <item.icon className="w-8 h-8" />
                    </div>
                    <div className="text-5xl font-bold text-gray-100 mb-4">{item.step}</div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Guarantees */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Наши гарантии</h2>
              <p className="text-xl text-gray-600">Многоуровневая защита каждой сделки</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {guarantees.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Advantages */}
        <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Преимущества для всех сторон</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {advantages.map((side, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold mb-6">{side.title}</h3>
                  <ul className="space-y-4">
                    {side.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600" />
              <div className="relative px-8 py-16 text-center text-white">
                <Shield className="w-12 h-12 mx-auto mb-4 opacity-80" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Начните безопасную сделку
                </h2>
                <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
                  Разместите заказ бесплатно и получите предложения от проверенных специалистов
                  с гарантией безопасной оплаты
                </p>
                <Link
                  href="/create-order"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-600 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all"
                >
                  Разместить заказ бесплатно
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
