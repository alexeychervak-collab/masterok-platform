'use client';

import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  Sparkles,
  Building2,
} from 'lucide-react';

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
    primary: 'support@masterok.ru',
    secondary: 'Для общих вопросов',
    link: 'mailto:support@masterok.ru',
    description: 'Ответим в течение 24 часов',
  },
  {
    icon: MessageCircle,
    title: 'Онлайн-чат',
    primary: 'Написать сейчас',
    secondary: 'Быстрый ответ',
    link: '#chat',
    description: 'Среднее время ответа: 5 минут',
  },
  {
    icon: Mail,
    title: 'Для специалистов',
    primary: 'partners@masterok.ru',
    secondary: 'Партнерские вопросы',
    link: 'mailto:partners@masterok.ru',
    description: 'Сотрудничество и партнерство',
  },
];

const offices = [
  {
    city: 'Москва',
    address: 'ул. Тверская, д. 1, офис 101',
    metro: 'м. Тверская',
    phone: '+7 (495) 123-45-67',
    hours: 'Пн-Пт: 9:00 - 18:00',
  },
  {
    city: 'Санкт-Петербург',
    address: 'Невский проспект, д. 28',
    metro: 'м. Невский проспект',
    phone: '+7 (812) 123-45-67',
    hours: 'Пн-Пт: 9:00 - 18:00',
  },
];

const departments = [
  {
    name: 'Техническая поддержка',
    email: 'support@masterok.ru',
    desc: 'Помощь с платформой',
  },
  {
    name: 'Отдел продаж',
    email: 'sales@masterok.ru',
    desc: 'B2B и корпоративные клиенты',
  },
  {
    name: 'PR и маркетинг',
    email: 'pr@masterok.ru',
    desc: 'СМИ и пресса',
  },
  {
    name: 'HR отдел',
    email: 'hr@masterok.ru',
    desc: 'Вакансии и карьера',
  },
];

const socialLinks = [
  { name: 'Telegram', link: 'https://t.me/masterok', emoji: '📱', followers: '15K' },
  { name: 'ВКонтакте', link: 'https://vk.com/masterok', emoji: '💬', followers: '8K' },
  { name: 'YouTube', link: 'https://youtube.com/@masterok', emoji: '📺', followers: '12K' },
  { name: 'Дзен', link: 'https://dzen.ru/masterok', emoji: '📰', followers: '5K' },
];

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
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
                  Мы на связи
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Свяжитесь с нами
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Мы всегда рады помочь. Выберите удобный способ связи или
                заполните форму ниже.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <motion.a
                  key={method.title}
                  href={method.link}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{method.title}</h3>
                  <p className="text-blue-600 font-semibold mb-1">
                    {method.primary}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    {method.secondary}
                  </p>
                  <p className="text-xs text-gray-500">{method.description}</p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-6">Напишите нам</h2>
                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ваше имя *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
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
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                        placeholder="ivan@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Телефон
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                        placeholder="+7 (999) 123-45-67"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Тема обращения *
                      </label>
                      <select
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                      >
                        <option value="">Выберите тему</option>
                        <option>Техническая поддержка</option>
                        <option>Вопрос по заказу</option>
                        <option>Сотрудничество</option>
                        <option>Предложение</option>
                        <option>Другое</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Сообщение *
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none transition-all"
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
              </motion.div>

              {/* Additional Info */}
              <div className="space-y-8">
                {/* Working Hours */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-8 h-8 text-blue-600" />
                    <h3 className="text-xl font-bold">Время работы</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">
                        Понедельник - Пятница
                      </span>
                      <span className="font-semibold">9:00 - 21:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">
                        Суббота - Воскресенье
                      </span>
                      <span className="font-semibold">10:00 - 18:00</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-600">
                        Техподдержка: круглосуточно 24/7
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Departments */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 border border-gray-100"
                >
                  <h3 className="text-xl font-bold mb-6">Отделы</h3>
                  <div className="space-y-4">
                    {departments.map((dept) => (
                      <div
                        key={dept.name}
                        className="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                      >
                        <div className="font-semibold text-gray-900 mb-1">
                          {dept.name}
                        </div>
                        <a
                          href={`mailto:${dept.email}`}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          {dept.email}
                        </a>
                        <p className="text-sm text-gray-600 mt-1">
                          {dept.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Social Media */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 border border-gray-100"
                >
                  <h3 className="text-xl font-bold mb-6">
                    Мы в социальных сетях
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                      >
                        <span className="text-2xl">{social.emoji}</span>
                        <div>
                          <div className="font-semibold text-sm">
                            {social.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {social.followers} подписчиков
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Offices */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Наши офисы</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {offices.map((office) => (
                <motion.div
                  key={office.city}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">{office.city}</h3>
                  </div>
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
                      <a
                        href={`tel:${office.phone.replace(/\D/g, '')}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {office.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span>{office.hours}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
