import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Mail, Phone, MapPin, MessageCircle, Clock, Send, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react'

const contactMethods = [
  {
    icon: Phone,
    title: 'Телефон',
    primary: '8 800 123-45-67',
    secondary: 'Бесплатно по России',
    link: 'tel:88001234567',
    description: 'Звонки принимаются круглосуточно',
  },
  {
    icon: Mail,
    title: 'Email',
    primary: 'support@yodo.ru',
    secondary: 'Для общих вопросов',
    link: 'mailto:support@yodo.ru',
    description: 'Ответим в течение 24 часов',
  },
  {
    icon: MessageCircle,
    title: 'Онлайн-чат',
    primary: 'Написать сейчас',
    secondary: 'Быстрый ответ',
    link: '#chat',
    description: 'Средн time ответа: 5 минут',
  },
  {
    icon: Mail,
    title: 'Для специалистов',
    primary: 'partners@yodo.ru',
    secondary: 'Партнерские вопросы',
    link: 'mailto:partners@yodo.ru',
    description: 'Сотрудничество и партнерство',
  },
]

const offices = [
  {
    city: 'Москва',
    address: 'ул. Тверская, д. 1, офис 101',
    metro: 'м. Тверская',
    phone: '+7 (495) 123-45-67',
    hours: 'Пн-Пт: 9:00 - 18:00',
    coordinates: { lat: 55.7558, lng: 37.6173 },
  },
  {
    city: 'Санкт-Петербург',
    address: 'Невский проспект, д. 28',
    metro: 'м. Невский проспект',
    phone: '+7 (812) 123-45-67',
    hours: 'Пн-Пт: 9:00 - 18:00',
    coordinates: { lat: 59.9343, lng: 30.3351 },
  },
]

const departments = [
  { name: 'Техническая поддержка', email: 'support@yodo.ru', desc: 'Помощь с платформой' },
  { name: 'Отдел продаж', email: 'sales@yodo.ru', desc: 'B2B и корпоративные клиенты' },
  { name: 'PR и маркетинг', email: 'pr@yodo.ru', desc: 'СМИ и пресса' },
  { name: 'HR отдел', email: 'hr@yodo.ru', desc: 'Вакансии и карьера' },
]

const socialLinks = [
  { icon: Instagram, name: 'Instagram', link: '#', followers: '15K' },
  { icon: Facebook, name: 'Facebook', link: '#', followers: '8K' },
  { icon: Linkedin, name: 'LinkedIn', link: '#', followers: '5K' },
  { icon: Twitter, name: 'Twitter', link: '#', followers: '12K' },
]

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16 mb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Свяжитесь с нами
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Мы всегда рады помочь. Выберите удобный способ связи или заполните форму ниже
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="container mx-auto px-4 mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method) => (
              <a
                key={method.title}
                href={method.link}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <method.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-1">{method.title}</h3>
                <p className="text-blue-600 font-semibold mb-1">{method.primary}</p>
                <p className="text-sm text-gray-600 mb-2">{method.secondary}</p>
                <p className="text-xs text-gray-500">{method.description}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="container mx-auto px-4 mb-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6">Напишите нам</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ваше имя *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none"
                    placeholder="Иван Иванов"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none"
                    placeholder="ivan@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Тема обращения *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Выберите тему</option>
                    <option>Техническая поддержка</option>
                    <option>Вопрос по заказу</option>
                    <option>Сотрудничество</option>
                    <option>Предложение</option>
                    <option>Другое</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Сообщение *
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none resize-none"
                    placeholder="Опишите ваш вопрос или проблему..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Отправить сообщение
                </button>
              </form>
            </div>

            {/* Additional Info */}
            <div className="space-y-8">
              {/* Working Hours */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                  <h3 className="text-xl font-bold">Время работы</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Понедельник - Пятница</span>
                    <span className="font-semibold">9:00 - 21:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Суббота - Воскресенье</span>
                    <span className="font-semibold">10:00 - 18:00</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">
                      Техподдержка: круглосуточно 24/7
                    </span>
                  </div>
                </div>
              </div>

              {/* Departments */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold mb-6">Отделы</h3>
                <div className="space-y-4">
                  {departments.map((dept) => (
                    <div key={dept.name} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="font-semibold text-gray-900 mb-1">{dept.name}</div>
                      <a href={`mailto:${dept.email}`} className="text-blue-600 text-sm hover:underline">
                        {dept.email}
                      </a>
                      <p className="text-sm text-gray-600 mt-1">{dept.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold mb-6">Соцсети</h3>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.link}
                      className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                    >
                      <social.icon className="w-6 h-6 text-gray-600" />
                      <div>
                        <div className="font-semibold text-sm">{social.name}</div>
                        <div className="text-xs text-gray-600">{social.followers}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Offices */}
        <section className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Наши офисы</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {offices.map((office) => (
              <div key={office.city} className="bg-white rounded-2xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold mb-4">{office.city}</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">{office.address}</p>
                      <p className="text-sm text-gray-600">{office.metro}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <a href={`tel:${office.phone.replace(/\D/g, '')}`} className="hover:text-blue-600">
                      {office.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span>{office.hours}</span>
                  </div>
                </div>
                <button className="mt-6 w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors">
                  Показать на карте
                </button>
              </div>
            ))}
        </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}





