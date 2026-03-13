'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Star,
  Quote,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  CheckCircle,
  MapPin,
  Sparkles,
} from 'lucide-react';

const stories = [
  {
    name: 'Алексей Петров',
    role: 'Прораб, инженер-строитель',
    avatar: 'https://i.pravatar.cc/200?img=33',
    city: 'Москва',
    stats: { orders: 312, income: '18M+', rating: 4.92, years: 3 },
    quote: 'За 3 года на МастерОК я вырос с одиночного мастера до руководителя бригады из 12 человек. Платформа даёт стабильный поток заказов и доверие клиентов через систему отзывов.',
    before: 'Самостоятельный поиск клиентов, нестабильный доход 80-120 тыс/мес',
    after: 'Стабильный доход 500+ тыс/мес, бригада из 12 человек, тариф Бизнес',
    specialization: 'Строительство и ремонт',
    featured: true,
  },
  {
    name: 'Мария Соколова',
    role: 'Дизайнер интерьера',
    avatar: 'https://i.pravatar.cc/200?img=5',
    city: 'Санкт-Петербург',
    stats: { orders: 156, income: '8.5M+', rating: 4.88, years: 2 },
    quote: 'МастерОК помог мне найти первых клиентов, когда я только начинала. Сейчас мой профиль в топе, клиенты приходят сами. Эскроу-защита — огромный плюс, все платят вовремя.',
    before: 'Начинающий дизайнер, 2-3 заказа в месяц через знакомых',
    after: '10-15 заказов в месяц, собственная студия, рейтинг 4.88',
    specialization: 'Дизайн интерьера',
    featured: true,
  },
  {
    name: 'Дмитрий Волков',
    role: 'Электрик, ИП',
    avatar: 'https://i.pravatar.cc/200?img=60',
    city: 'Казань',
    stats: { orders: 89, income: '3.2M+', rating: 4.95, years: 1.5 },
    quote: 'Переехал в Казань из маленького города. Клиентов не было вообще. Зарегистрировался на МастерОК — через месяц уже было по 3-4 заказа в неделю. Рейтинг 4.95 помогает выигрывать крупные заказы.',
    before: 'Переезд в новый город, 0 клиентов, поиск работы',
    after: '3-4 заказа в неделю, доход 180 тыс/мес, 89 выполненных заказов',
    specialization: 'Электромонтаж',
    featured: false,
  },
  {
    name: 'Елена Морозова',
    role: 'Архитектор',
    avatar: 'https://i.pravatar.cc/200?img=9',
    city: 'Новосибирск',
    stats: { orders: 45, income: '5.1M+', rating: 4.90, years: 2 },
    quote: 'Как архитектор, мне важна репутация и качественные проекты. МастерОК позволяет работать с серьёзными заказчиками, которые ценят профессионализм. Средний чек моих проектов вырос в 3 раза.',
    before: 'Работа в бюро за 120 тыс/мес, отсутствие личных проектов',
    after: 'Фриланс, средний проект 350-500 тыс, свобода выбора заказов',
    specialization: 'Архитектура и проектирование',
    featured: false,
  },
  {
    name: 'Сергей Кузнецов',
    role: 'Сантехник',
    avatar: 'https://i.pravatar.cc/200?img=51',
    city: 'Екатеринбург',
    stats: { orders: 203, income: '4.8M+', rating: 4.87, years: 2.5 },
    quote: 'Раньше весь маркетинг был по сарафанке. На МастерОК я выстроил профиль с портфолио и отзывами — теперь клиенты выбирают меня сами. Никаких пустых выездов.',
    before: 'Только сарафанное радио, нестабильные 60-100 тыс/мес',
    after: '200+ заказов, стабильные 150 тыс/мес, постоянные клиенты',
    specialization: 'Сантехника',
    featured: false,
  },
  {
    name: 'Анна Белова',
    role: 'Ландшафтный дизайнер',
    avatar: 'https://i.pravatar.cc/200?img=25',
    city: 'Краснодар',
    stats: { orders: 67, income: '6.2M+', rating: 4.93, years: 1.5 },
    quote: 'Ландшафтный дизайн — узкая ниша. На МастерОК клиенты находят именно меня, потому что платформа позволяет точно настроить специализацию. За 1.5 года — 67 проектов.',
    before: 'Сложности с поиском клиентов в нишевой специализации',
    after: '67 проектов, портфолио мечты, приглашения на выставки',
    specialization: 'Ландшафтный дизайн',
    featured: false,
  },
];

const platformStats = [
  { value: '₽2.5 млрд+', label: 'Общий оборот специалистов' },
  { value: '92%', label: 'Специалистов рекомендуют платформу' },
  { value: '4.87', label: 'Средний рейтинг специалистов' },
  { value: '78%', label: 'Повторных заказов' },
];

export default function SuccessStoriesPage() {
  const featured = stories.filter((s) => s.featured);
  const regular = stories.filter((s) => !s.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full mb-6">
                <Award className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-semibold text-yellow-600">Истории успеха</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Наши специалисты{' '}
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  добиваются большего
                </span>
              </h1>

              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Реальные истории профессионалов, которые построили успешный бизнес
                с помощью МастерОК
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {platformStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Stories */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Топ истории</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featured.map((story, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl overflow-hidden shadow-xl"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={story.avatar} alt={story.name} className="w-16 h-16 rounded-full border-3 border-white/50" />
                      <div>
                        <h3 className="text-xl font-bold">{story.name}</h3>
                        <p className="text-white/80 text-sm">{story.role}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-white/60" />
                          <span className="text-white/60 text-xs">{story.city}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div><div className="text-2xl font-bold">{story.stats.orders}</div><div className="text-xs text-white/60">заказов</div></div>
                      <div><div className="text-2xl font-bold">₽{story.stats.income}</div><div className="text-xs text-white/60">доход</div></div>
                      <div><div className="text-2xl font-bold">{story.stats.rating}</div><div className="text-xs text-white/60">рейтинг</div></div>
                      <div><div className="text-2xl font-bold">{story.stats.years}г</div><div className="text-xs text-white/60">на платформе</div></div>
                    </div>
                  </div>
                  <div className="p-8">
                    <Quote className="w-8 h-8 text-blue-200 mb-3" />
                    <p className="text-gray-700 leading-relaxed mb-6 italic">{story.quote}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-50 rounded-xl p-4">
                        <div className="text-xs font-semibold text-red-600 mb-1">ДО</div>
                        <p className="text-sm text-gray-600">{story.before}</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4">
                        <div className="text-xs font-semibold text-green-600 mb-1">ПОСЛЕ</div>
                        <p className="text-sm text-gray-600">{story.after}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Regular Stories */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Ещё истории</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {regular.map((story, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <img src={story.avatar} alt={story.name} className="w-12 h-12 rounded-full" />
                    <div>
                      <h3 className="font-bold">{story.name}</h3>
                      <p className="text-sm text-gray-500">{story.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <MapPin className="w-3 h-3" />
                    {story.city} · {story.specialization}
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm font-semibold ml-1">{story.stats.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{story.quote}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{story.stats.orders} заказов</span>
                    <span>₽{story.stats.income}</span>
                  </div>
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
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500" />
              <div className="relative px-8 py-16 text-center text-white">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-80" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Станьте следующей историей успеха
                </h2>
                <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
                  Присоединяйтесь к 15,000+ специалистов, которые уже зарабатывают с МастерОК
                </p>
                <Link
                  href="/register-specialist"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all"
                >
                  Стать специалистом
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
