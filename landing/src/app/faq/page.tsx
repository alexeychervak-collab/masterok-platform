'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  ChevronDown,
  HelpCircle,
  Search,
  MessageCircle,
  Shield,
  CreditCard,
  Users,
  Settings,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const faqCategories = [
  { id: 'all', name: 'Все вопросы', icon: HelpCircle },
  { id: 'general', name: 'Общие', icon: Settings },
  { id: 'orders', name: 'Заказы', icon: Users },
  { id: 'payments', name: 'Оплата', icon: CreditCard },
  { id: 'safety', name: 'Безопасность', icon: Shield },
  { id: 'specialists', name: 'Для специалистов', icon: MessageCircle },
];

const faqs = [
  {
    category: 'general',
    question: 'Что такое МастерОК?',
    answer: 'МастерОК — крупнейшая платформа для поиска проверенных строительных специалистов в России. Мы объединяем заказчиков и профессионалов: от дизайнеров интерьера и архитекторов до электриков и сантехников. На платформе зарегистрировано более 15,000 специалистов в 100+ городах России.',
  },
  {
    category: 'general',
    question: 'Как зарегистрироваться на платформе?',
    answer: 'Регистрация бесплатна и занимает менее 2 минут. Нажмите «Регистрация» на главной странице, выберите роль (заказчик или специалист), укажите имя, email и пароль. После подтверждения email вы сможете сразу разместить заказ или начать получать заказы.',
  },
  {
    category: 'general',
    question: 'Платформа бесплатна для заказчиков?',
    answer: 'Да, для заказчиков МастерОК полностью бесплатен. Вы можете размещать неограниченное количество заказов, получать отклики специалистов, общаться в чате и пользоваться эскроу-защитой без каких-либо платежей.',
  },
  {
    category: 'orders',
    question: 'Как разместить заказ?',
    answer: 'Нажмите «Разместить заказ», опишите задачу (что нужно сделать, сроки, бюджет, адрес). Добавьте фото если есть. Через несколько минут вы получите отклики от специалистов с предложениями цен и сроков. Сравните их портфолио и отзывы, выберите лучшего.',
  },
  {
    category: 'orders',
    question: 'Сколько откликов я получу?',
    answer: 'В среднем заказ получает 5-15 откликов в первые 24 часа. Количество зависит от категории работ, бюджета и города. Популярные направления (ремонт квартир, дизайн) получают больше откликов.',
  },
  {
    category: 'orders',
    question: 'Можно ли отменить заказ?',
    answer: 'Да, заказ можно отменить до начала работ без каких-либо санкций. Если работы уже начаты и оплата внесена через эскроу, необходимо согласовать отмену с специалистом или обратиться в службу поддержки для разрешения ситуации.',
  },
  {
    category: 'orders',
    question: 'Как выбрать специалиста?',
    answer: 'Рекомендуем обращать внимание на: рейтинг (от 4.5 и выше), количество завершённых заказов, портфолио работ, отзывы клиентов, наличие верификации и время отклика. Также полезно пообщаться в чате перед принятием решения.',
  },
  {
    category: 'payments',
    question: 'Как работает эскроу-защита?',
    answer: 'Эскроу — это безопасная сделка: вы вносите оплату, деньги замораживаются на специальном счёте платформы. Мастер видит, что оплата гарантирована, и начинает работу. После завершения и вашего подтверждения деньги автоматически переводятся специалисту. Если возникает спор, служба поддержки поможет разрешить ситуацию.',
  },
  {
    category: 'payments',
    question: 'Какие способы оплаты принимаются?',
    answer: 'Мы принимаем банковские карты (Visa, MasterCard, МИР), СБП (Система быстрых платежей), а также переводы с расчётного счёта для юридических лиц. Все платежи обрабатываются через сертифицированного партнёра YooKassa.',
  },
  {
    category: 'payments',
    question: 'Какая комиссия у платформы?',
    answer: 'Для заказчиков комиссия 0%. Для специалистов: бесплатный тариф — 15%, тариф ПРО (990 ₽/мес) — 10%, тариф Бизнес (2 990 ₽/мес) — 5%. Комиссия взимается только с успешно завершённых заказов.',
  },
  {
    category: 'payments',
    question: 'Когда специалист получает деньги?',
    answer: 'Деньги переводятся специалисту в течение 1-3 рабочих дней после подтверждения заказчиком завершения работ. При этапной оплате (milestone) — после подтверждения каждого этапа отдельно.',
  },
  {
    category: 'safety',
    question: 'Как проверяются специалисты?',
    answer: 'Каждый специалист проходит многоступенчатую верификацию: проверка документов (паспорт, ИНН/ОГРНИП), подтверждение квалификации, проверка портфолио. Специалисты с пометкой «Проверенный» прошли полную верификацию. Также рейтинг формируется на основе реальных отзывов заказчиков.',
  },
  {
    category: 'safety',
    question: 'Что делать при проблемах с качеством работ?',
    answer: 'Откройте спор в личном кабинете в течение 7 дней после завершения работ. Приложите фото/видео доказательства. Служба поддержки рассмотрит спор в течение 48 часов. При подтверждении проблемы деньги будут возвращены из эскроу или назначена компенсация.',
  },
  {
    category: 'safety',
    question: 'Защищены ли мои персональные данные?',
    answer: 'Да, мы строго соблюдаем ФЗ-152 «О персональных данных». Все данные хранятся на защищённых серверах в России, передаются по зашифрованным каналам. Мы никогда не передаём ваши данные третьим лицам без вашего согласия.',
  },
  {
    category: 'specialists',
    question: 'Как стать специалистом на МастерОК?',
    answer: 'Зарегистрируйтесь, выберите роль «Специалист», заполните профиль (описание, навыки, портфолио), пройдите верификацию. После одобрения вы сразу начнёте получать заказы. Бесплатный тариф позволяет откликаться на 5 заказов в день.',
  },
  {
    category: 'specialists',
    question: 'Сколько можно заработать на платформе?',
    answer: 'Доход зависит от специализации, города и активности. В среднем специалисты зарабатывают от 80,000 до 300,000 ₽/мес. Топ-специалисты с рейтингом 4.9+ и тарифом Бизнес зарабатывают свыше 500,000 ₽/мес.',
  },
  {
    category: 'specialists',
    question: 'Как получить больше заказов?',
    answer: 'Советы: заполните профиль на 100%, добавьте качественные фото в портфолио, отвечайте быстро (в первые 30 минут), предлагайте конкурентные цены, собирайте отзывы, рассмотрите тариф ПРО для приоритета в поиске.',
  },
  {
    category: 'specialists',
    question: 'Можно ли работать как самозанятый?',
    answer: 'Да, платформа поддерживает работу как для самозанятых (НПД), так и для ИП и юрлиц. При выводе средств налоговый статус учитывается автоматически, и мы формируем корректные чеки.',
  },
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
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
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">Центр помощи</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Часто задаваемые{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  вопросы
                </span>
              </h1>

              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Ответы на самые популярные вопросы о платформе МастерОК
              </p>

              {/* Search */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по вопросам..."
                  className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-6 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              {faqCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setOpenFaq(null); }}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600'
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="py-10 px-4">
          <div className="max-w-3xl mx-auto space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Ничего не найдено
                </h3>
                <p className="text-gray-500">
                  Попробуйте изменить запрос или выбрать другую категорию
                </p>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  viewport={{ once: true }}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
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
              ))
            )}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
              <div className="relative px-8 py-16 text-center text-white">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-80" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Не нашли ответ?
                </h2>
                <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
                  Свяжитесь с нашей службой поддержки — мы ответим в течение 5 минут
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contacts"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    Написать в поддержку
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <a
                    href="tel:88001234567"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                  >
                    8 800 123-45-67
                  </a>
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
