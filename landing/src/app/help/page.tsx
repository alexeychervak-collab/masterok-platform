import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { Search, MessageCircle, Shield, HelpCircle, Book, Phone, Mail, Clock } from 'lucide-react'

const faqs = [
  {
    category: 'Для заказчиков',
    icon: Search,
    questions: [
      {
        q: 'Как найти специалиста?',
        a: 'Используйте поиск на главной странице, выберите категорию услуги, просмотрите рейтинг и отзывы специалистов. Вы можете связаться напрямую или создать заказ, и специалисты сами откликнутся.'
      },
      {
        q: 'Как работает безопасная сделка?',
        a: 'Деньги блокируются на счете эскроу до выполнения работ. Специалист получает оплату только после вашего подтверждения качества работы. Это защищает обе стороны.'
      },
      {
        q: 'Можно ли отменить заказ?',
        a: 'Да, вы можете отменить заказ до начала работ без комиссии. Если работы начались, условия отмены обсуждаются со специалистом.'
      },
      {
        q: 'Что делать при споре?',
        a: 'Свяжитесь с нашей службой поддержки через чат или по телефону. Мы рассмотрим ситуацию и поможем найти решение в течение 24 часов.'
      },
    ],
  },
  {
    category: 'Для специалистов',
    icon: HelpCircle,
    questions: [
      {
        q: 'Как начать получать заказы?',
        a: 'Зарегистрируйтесь как специалист, заполните профиль, добавьте портфолио и примеры работ. Укажите свои услуги и цены. После проверки профиля вы сможете откликаться на заказы.'
      },
      {
        q: 'Какая комиссия платформы?',
        a: 'Комиссия составляет 10% от стоимости заказа для специалистов. Первые 3 заказа - без комиссии. Для премиум-подписки комиссия снижается до 5%.'
      },
      {
        q: 'Как повысить рейтинг?',
        a: 'Выполняйте заказы качественно и в срок, общайтесь вежливо с клиентами, быстро отвечайте на сообщения. Клиенты оставляют отзывы, которые влияют на ваш рейтинг.'
      },
      {
        q: 'Как получить статус PRO?',
        a: 'Выполните минимум 20 заказов с рейтингом 4.8+, пройдите верификацию документов, получите не менее 15 положительных отзывов.'
      },
    ],
  },
  {
    category: 'Оплата и безопасность',
    icon: Shield,
    questions: [
      {
        q: 'Какие способы оплаты доступны?',
        a: 'Принимаем банковские карты (Visa, MasterCard, МИР), СБП, электронные кошельки (ЮMoney, QIWI), оплату по QR-коду.'
      },
      {
        q: 'Безопасно ли платить через платформу?',
        a: 'Да, мы используем защищенное соединение (SSL), данные карт передаются напрямую платежной системе. Деньги хранятся на счете эскроу до выполнения работ.'
      },
      {
        q: 'Когда специалист получает деньги?',
        a: 'После завершения работ и вашего подтверждения качества. Если вы не подтвердили в течение 3 дней, деньги автоматически переводятся специалисту.'
      },
      {
        q: 'Можно ли вернуть деньги?',
        a: 'Да, если работы не выполнены или выполнены некачественно. Обратитесь в поддержку с доказательствами, мы вернем деньги в течение 5-10 рабочих дней.'
      },
    ],
  },
]

const quickLinks = [
  { icon: Book, title: 'База знаний', desc: 'Статьи и руководства', link: '/blog' },
  { icon: MessageCircle, title: 'Онлайн-чат', desc: 'Ответим за 5 минут', link: '#chat' },
  { icon: Phone, title: 'Телефон', desc: '8 800 123-45-67', link: 'tel:88001234567' },
  { icon: Mail, title: 'Email', desc: 'support@masterok.ru', link: 'mailto:support@masterok.ru' },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16 mb-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Центр помощи
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Ответы на часто задаваемые вопросы и полезные материалы
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Поиск по базе знаний..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="container mx-auto px-4 mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((item) => (
              <Link
                key={item.title}
                href={item.link}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="container mx-auto px-4">
          <div className="space-y-12">
            {faqs.map((section) => (
              <div key={section.category}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">{section.category}</h2>
                </div>
                
                <div className="space-y-4">
                  {section.questions.map((item, idx) => (
                    <details
                      key={idx}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden group"
                    >
                      <summary className="p-6 cursor-pointer list-none flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <h3 className="font-semibold text-lg pr-4">{item.q}</h3>
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-open:rotate-180 transition-transform">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </summary>
                      <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                        {item.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Support Hours */}
        <section className="container mx-auto px-4 mt-16">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <Clock className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Не нашли ответ?</h2>
              <p className="text-lg mb-6 text-white/90">
                Наша служба поддержки работает круглосуточно и готова помочь вам в любое время
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="#chat"
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-lg transition-shadow"
                >
                  Написать в чат
                </a>
                <a
                  href="tel:88001234567"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
                >
                  Позвонить
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Useful Links */}
        <section className="container mx-auto px-4 mt-16">
          <h2 className="text-2xl font-bold mb-6">Полезные ссылки</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/how-it-works" className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <h3 className="font-bold mb-2">Как это работает</h3>
              <p className="text-gray-600 text-sm">Пошаговое руководство для новых пользователей</p>
            </Link>
            <Link href="/rules" className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <h3 className="font-bold mb-2">Правила платформы</h3>
              <p className="text-gray-600 text-sm">Условия использования и правила поведения</p>
            </Link>
            <Link href="/pricing" className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <h3 className="font-bold mb-2">Тарифы</h3>
              <p className="text-gray-600 text-sm">Стоимость услуг и комиссии платформы</p>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}





