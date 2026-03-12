'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Check,
  X,
  Crown,
  Zap,
  Star,
  ArrowRight,
  ChevronDown,
  HelpCircle,
  Sparkles,
  Shield,
  Users,
  TrendingUp,
} from 'lucide-react';

const plans = [
  {
    name: 'Бесплатный',
    subtitle: 'Для начинающих специалистов',
    price: '0',
    currency: '₽',
    period: '/мес',
    description: 'Начните получать заказы без вложений',
    icon: Star,
    color: 'from-gray-500 to-gray-600',
    bgColor: 'bg-gray-50',
    popular: false,
    features: [
      { text: 'Профиль специалиста', included: true },
      { text: 'До 5 откликов в день', included: true },
      { text: 'Базовая аналитика', included: true },
      { text: 'Чат с заказчиками', included: true },
      { text: 'Эскроу-защита', included: true },
      { text: 'Вывод средств на карту', included: true },
      { text: 'Приоритет в поиске', included: false },
      { text: 'Безлимитные отклики', included: false },
      { text: 'Значок "Проверенный"', included: false },
      { text: 'Расширенная аналитика', included: false },
      { text: 'Выделение в каталоге', included: false },
      { text: 'Персональный менеджер', included: false },
    ],
    cta: 'Начать бесплатно',
    ctaLink: '/register-specialist',
    commission: 'Комиссия 15%',
  },
  {
    name: 'ПРО',
    subtitle: 'Для активных специалистов',
    price: '990',
    currency: '₽',
    period: '/мес',
    description: 'Больше заказов и возможностей для роста',
    icon: Zap,
    color: 'from-blue-500 to-purple-600',
    bgColor: 'bg-blue-50',
    popular: true,
    features: [
      { text: 'Профиль специалиста', included: true },
      { text: 'До 30 откликов в день', included: true },
      { text: 'Базовая аналитика', included: true },
      { text: 'Чат с заказчиками', included: true },
      { text: 'Эскроу-защита', included: true },
      { text: 'Вывод средств на карту', included: true },
      { text: 'Приоритет в поиске', included: true },
      { text: 'Безлимитные отклики', included: false },
      { text: 'Значок "Проверенный"', included: true },
      { text: 'Расширенная аналитика', included: true },
      { text: 'Выделение в каталоге', included: false },
      { text: 'Персональный менеджер', included: false },
    ],
    cta: 'Подключить ПРО',
    ctaLink: '/checkout/pro',
    commission: 'Комиссия 10%',
  },
  {
    name: 'Бизнес',
    subtitle: 'Для компаний и бригад',
    price: '2 990',
    currency: '₽',
    period: '/мес',
    description: 'Максимум инструментов для масштабирования',
    icon: Crown,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    popular: false,
    features: [
      { text: 'Профиль специалиста', included: true },
      { text: 'Безлимитные отклики', included: true },
      { text: 'Базовая аналитика', included: true },
      { text: 'Чат с заказчиками', included: true },
      { text: 'Эскроу-защита', included: true },
      { text: 'Вывод средств на карту', included: true },
      { text: 'Приоритет в поиске', included: true },
      { text: 'Безлимитные отклики', included: true },
      { text: 'Значок "Проверенный"', included: true },
      { text: 'Расширенная аналитика', included: true },
      { text: 'Выделение в каталоге', included: true },
      { text: 'Персональный менеджер', included: true },
    ],
    cta: 'Подключить Бизнес',
    ctaLink: '/checkout/business',
    commission: 'Комиссия 5%',
  },
];

const comparisonFeatures = [
  { name: 'Размещение профиля', free: true, pro: true, business: true },
  { name: 'Отклики на заказы', free: '5/день', pro: '30/день', business: 'Безлимит' },
  { name: 'Комиссия с заказа', free: '15%', pro: '10%', business: '5%' },
  { name: 'Аналитика', free: 'Базовая', pro: 'Расширенная', business: 'Полная' },
  { name: 'Приоритет в поиске', free: false, pro: true, business: true },
  { name: 'Значок верификации', free: false, pro: true, business: true },
  { name: 'Выделение в каталоге', free: false, pro: false, business: true },
  { name: 'Персональный менеджер', free: false, pro: false, business: true },
  { name: 'Управление командой', free: false, pro: false, business: true },
  { name: 'API интеграция', free: false, pro: false, business: true },
];

const pricingFaqs = [
  {
    question: 'Могу ли я сменить тариф в любое время?',
    answer:
      'Да, вы можете повысить или понизить тариф в любой момент. При повышении тарифа разница будет списана пропорционально оставшимся дням. При понижении новый тариф начнёт действовать со следующего платёжного периода.',
  },
  {
    question: 'Есть ли скидки при оплате за год?',
    answer:
      'Да! При оплате за год вы получаете 2 месяца бесплатно. Тариф ПРО обойдётся в 9 900 ₽/год (вместо 11 880 ₽), а Бизнес -- в 29 900 ₽/год (вместо 35 880 ₽).',
  },
  {
    question: 'Что входит в комиссию платформы?',
    answer:
      'Комиссия включает: обработку платежей, эскроу-защиту, страхование сделки, работу службы поддержки и разрешение споров. Комиссия списывается только с успешно завершённых заказов.',
  },
  {
    question: 'Для заказчиков платформа тоже платная?',
    answer:
      'Нет, для заказчиков МастерОК полностью бесплатен. Вы можете размещать заказы, получать отклики, общаться со специалистами и пользоваться эскроу-защитой без каких-либо платежей.',
  },
  {
    question: 'Как происходит оплата тарифа?',
    answer:
      'Оплата списывается автоматически раз в месяц (или раз в год при годовой подписке) с привязанной банковской карты. Вы можете отменить подписку в любой момент в личном кабинете.',
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">
                  Прозрачные цены
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Тарифы{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  МастерОК
                </span>
              </h1>

              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Для заказчиков -- всегда бесплатно. Для специалистов --
                выберите тариф, который подходит именно вам.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative rounded-3xl p-8 ${
                    plan.popular
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl shadow-blue-500/30 scale-105 z-10'
                      : 'bg-white border-2 border-gray-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-yellow-400 text-yellow-900 text-sm font-bold rounded-full">
                        Популярный выбор
                      </span>
                    </div>
                  )}

                  <div
                    className={`inline-flex p-3 rounded-xl mb-4 ${
                      plan.popular
                        ? 'bg-white/20'
                        : `bg-gradient-to-br ${plan.color} bg-opacity-10`
                    }`}
                  >
                    <plan.icon
                      className={`w-6 h-6 ${
                        plan.popular ? 'text-white' : 'text-white'
                      }`}
                    />
                  </div>

                  <h3
                    className={`text-2xl font-bold mb-1 ${
                      plan.popular ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-sm mb-6 ${
                      plan.popular ? 'text-white/80' : 'text-gray-500'
                    }`}
                  >
                    {plan.subtitle}
                  </p>

                  <div className="mb-2">
                    <span
                      className={`text-5xl font-bold ${
                        plan.popular ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-lg ${
                        plan.popular ? 'text-white/80' : 'text-gray-500'
                      }`}
                    >
                      {plan.currency}
                      {plan.period}
                    </span>
                  </div>

                  <div
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6 ${
                      plan.popular
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {plan.commission}
                  </div>

                  <p
                    className={`text-sm mb-6 ${
                      plan.popular ? 'text-white/80' : 'text-gray-600'
                    }`}
                  >
                    {plan.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li
                        key={feature.text}
                        className="flex items-center gap-3"
                      >
                        {feature.included ? (
                          <Check
                            className={`w-5 h-5 flex-shrink-0 ${
                              plan.popular ? 'text-white' : 'text-green-500'
                            }`}
                          />
                        ) : (
                          <X
                            className={`w-5 h-5 flex-shrink-0 ${
                              plan.popular ? 'text-white/30' : 'text-gray-300'
                            }`}
                          />
                        )}
                        <span
                          className={`text-sm ${
                            plan.popular
                              ? feature.included
                                ? 'text-white'
                                : 'text-white/30'
                              : feature.included
                              ? 'text-gray-700'
                              : 'text-gray-400'
                          }`}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.ctaLink}
                    className={`block w-full py-4 rounded-xl font-semibold text-center transition-all hover:scale-105 ${
                      plan.popular
                        ? 'bg-white text-blue-600 hover:shadow-xl'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table Toggle */}
        <section className="py-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all"
            >
              {showComparison ? 'Скрыть сравнение' : 'Сравнить все тарифы'}
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  showComparison ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          <AnimatePresence>
            {showComparison && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="max-w-4xl mx-auto mt-8">
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-4 font-semibold text-gray-900">
                            Возможности
                          </th>
                          <th className="text-center p-4 font-semibold text-gray-900">
                            Бесплатный
                          </th>
                          <th className="text-center p-4 font-semibold text-blue-600">
                            ПРО
                          </th>
                          <th className="text-center p-4 font-semibold text-amber-600">
                            Бизнес
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonFeatures.map((feature, index) => (
                          <tr
                            key={index}
                            className="border-t border-gray-100"
                          >
                            <td className="p-4 text-sm text-gray-700">
                              {feature.name}
                            </td>
                            {(['free', 'pro', 'business'] as const).map(
                              (tier) => (
                                <td
                                  key={tier}
                                  className="p-4 text-center"
                                >
                                  {typeof feature[tier] === 'boolean' ? (
                                    feature[tier] ? (
                                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                                    ) : (
                                      <X className="w-5 h-5 text-gray-300 mx-auto" />
                                    )
                                  ) : (
                                    <span className="text-sm font-medium text-gray-700">
                                      {feature[tier]}
                                    </span>
                                  )}
                                </td>
                              )
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* For Clients Banner */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 border border-green-200">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">
                    Для заказчиков -- бесплатно
                  </h3>
                  <p className="text-gray-600">
                    Размещение заказов, получение откликов, общение со
                    специалистами, эскроу-защита -- всё это бесплатно для
                    заказчиков. Просто разместите заказ и выберите лучшего
                    специалиста.
                  </p>
                </div>
                <Link
                  href="/create-order"
                  className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Разместить заказ
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing FAQ */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">
                  Вопросы о тарифах
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Часто задаваемые вопросы
              </h2>
            </div>

            <div className="space-y-3">
              {pricingFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setOpenFaq(openFaq === index ? null : index)
                    }
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-500 text-sm">
              * Все цены указаны с учётом НДС. Оплата списывается автоматически.
              Отмена подписки доступна в любой момент.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
