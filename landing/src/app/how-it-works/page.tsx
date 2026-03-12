'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  FileText,
  Users,
  Shield,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Clock,
  Star,
  MessageSquare,
  CreditCard,
  Lock,
  ThumbsUp,
  HelpCircle,
} from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Разместите заказ',
    subtitle: 'Бесплатно и за 2 минуты',
    description:
      'Опишите ваш проект: что нужно сделать, в какие сроки, какой бюджет. Добавьте фотографии объекта, чтобы специалисты лучше поняли задачу. Размещение заказа полностью бесплатно.',
    features: [
      'Подробное описание проекта',
      'Указание бюджета и сроков',
      'Загрузка фотографий объекта',
      'Выбор категории работ',
    ],
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600',
  },
  {
    number: '02',
    title: 'Получите отклики специалистов',
    subtitle: 'В среднем 5 откликов за 30 минут',
    description:
      'Проверенные специалисты увидят ваш заказ и предложат свои услуги. Сравните их цены, рейтинги, отзывы и портфолио выполненных работ. Обсудите детали в чате.',
    features: [
      'Сравнение цен и условий',
      'Проверенные рейтинги и отзывы',
      'Портфолио выполненных работ',
      'Чат со специалистами',
    ],
    icon: Users,
    color: 'from-purple-500 to-pink-500',
    image:
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600',
  },
  {
    number: '03',
    title: 'Безопасная сделка через эскроу',
    subtitle: 'Деньги защищены до завершения работ',
    description:
      'После выбора специалиста вы вносите оплату на защищённый эскроу-счёт. Деньги замораживаются и не перечисляются мастеру до тех пор, пока вы не подтвердите выполнение работы.',
    features: [
      'Средства на защищённом счёте',
      'Этапная оплата (milestone)',
      'Возврат при спорной ситуации',
      'Прозрачная комиссия',
    ],
    icon: Shield,
    color: 'from-green-500 to-emerald-500',
    image:
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600',
  },
  {
    number: '04',
    title: 'Получите результат',
    subtitle: 'Подтвердите работу и оставьте отзыв',
    description:
      'После завершения работ проверьте результат и подтвердите выполнение. Деньги автоматически переведутся мастеру. Оставьте отзыв, чтобы помочь другим заказчикам.',
    features: [
      'Проверка качества перед оплатой',
      'Автоматический перевод мастеру',
      'Гарантия на выполненные работы',
      'Система отзывов и рейтингов',
    ],
    icon: CheckCircle,
    color: 'from-orange-500 to-red-500',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
  },
];

const faqs = [
  {
    question: 'Сколько стоит размещение заказа?',
    answer:
      'Размещение заказа на МастерОК полностью бесплатно. Вы не платите ничего за публикацию заказа и получение откликов от специалистов. Комиссия платформы включена в стоимость работ и составляет от 5% до 15% в зависимости от тарифа специалиста.',
  },
  {
    question: 'Как работает эскроу-защита?',
    answer:
      'Когда вы договариваетесь со специалистом, оплата поступает на защищённый эскроу-счёт. Деньги замораживаются и не перечисляются мастеру до тех пор, пока вы не подтвердите качественное выполнение работы. Если возникает спор, наша служба поддержки помогает его разрешить.',
  },
  {
    question: 'Как проверяются специалисты?',
    answer:
      'Каждый специалист проходит верификацию: мы проверяем паспортные данные, квалификацию, опыт работы и портфолио. Дополнительно работает система рейтингов и отзывов от реальных заказчиков. Специалисты с высоким рейтингом получают значок "Проверенный".',
  },
  {
    question: 'Что делать, если я недоволен качеством работы?',
    answer:
      'Если работа выполнена некачественно, вы можете открыть спор. Наша служба поддержки рассмотрит обращение в течение 24 часов. Если претензия обоснована, деньги с эскроу-счёта будут возвращены вам полностью или частично. Мы также можем помочь найти другого специалиста.',
  },
  {
    question: 'Можно ли оплатить работу поэтапно?',
    answer:
      'Да, для крупных проектов доступна этапная оплата (milestone). Вы разбиваете проект на этапы, и оплачиваете каждый по мере выполнения. Это удобно при строительстве, капитальном ремонте и других масштабных проектах.',
  },
  {
    question: 'Сколько времени занимает поиск специалиста?',
    answer:
      'В среднем первые отклики поступают в течение 15-30 минут после размещения заказа. Для популярных категорий (ремонт квартир, сантехника, электрика) отклики приходят ещё быстрее. Вы можете начать общение со специалистами сразу и выбрать лучшего.',
  },
];

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
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
                  Простой и безопасный процесс
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Как работает{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  МастерОК
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                4 простых шага от размещения заказа до получения результата.
                Прозрачно, безопасно и удобно.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-24">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:direction-rtl' : ''
                  }`}
                >
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${step.color} text-white text-sm font-bold mb-4`}
                    >
                      Шаг {step.number}
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-2">
                      {step.title}
                    </h2>
                    <p className="text-lg text-blue-600 font-medium mb-4">
                      {step.subtitle}
                    </p>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      {step.description}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3">
                      {step.features.map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                        >
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-[400px] object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div
                        className={`absolute bottom-6 left-6 w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}
                      >
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Почему выбирают МастерОК
              </h2>
              <p className="text-xl text-gray-600">
                Преимущества работы через нашу платформу
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Lock,
                  title: 'Безопасные платежи',
                  desc: 'Эскроу-защита на все сделки. Деньги в безопасности до завершения работ.',
                },
                {
                  icon: Star,
                  title: 'Проверенные мастера',
                  desc: 'Все специалисты проходят верификацию. Реальные отзывы и рейтинги.',
                },
                {
                  icon: Clock,
                  title: 'Быстрый поиск',
                  desc: 'Первые отклики за 15 минут. Средний срок подбора специалиста - 1 день.',
                },
                {
                  icon: ThumbsUp,
                  title: 'Гарантия качества',
                  desc: 'Если работа не устроит, мы поможем решить вопрос и вернём деньги.',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">
                  FAQ
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Часто задаваемые вопросы
              </h2>
              <p className="text-gray-600">
                Ответы на самые популярные вопросы о работе платформы
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
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
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200')] opacity-10 mix-blend-overlay" />

              <div className="relative px-8 py-16 text-center text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Готовы начать свой проект?
                </h2>
                <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
                  Разместите заказ бесплатно и получите предложения от
                  проверенных специалистов уже сегодня.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/create-order"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    Разместить заказ бесплатно
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/search"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                  >
                    Найти специалиста
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
