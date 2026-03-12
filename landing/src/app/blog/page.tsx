'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Tag,
} from 'lucide-react';

const articles = [
  {
    slug: 'kak-vybrat-specialista',
    title: 'Как выбрать строительного специалиста: полный гид',
    excerpt:
      'Разбираем ключевые критерии выбора мастера: рейтинг, портфолио, отзывы, опыт. Пошаговая инструкция, которая поможет избежать ошибок и найти надёжного профессионала.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600',
    date: '2026-03-05',
    readTime: '7 мин',
    category: 'Советы',
    featured: true,
  },
  {
    slug: 'bezopasnaya-sdelka-eskrou',
    title: 'Безопасная сделка: как работает эскроу на МастерОК',
    excerpt:
      'Подробно объясняем механизм эскроу-защиты: как замораживаются деньги, когда они переводятся мастеру, и что происходит при спорных ситуациях.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600',
    date: '2026-02-28',
    readTime: '5 мин',
    category: 'Безопасность',
    featured: true,
  },
  {
    slug: 'trendy-dizajna-2026',
    title: 'Тренды дизайна интерьера 2026: что в моде',
    excerpt:
      'Обзор главных тенденций в дизайне интерьера: натуральные материалы, минимализм, умный дом. Что выбирают заказчики на платформе МастерОК.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600',
    date: '2026-02-20',
    readTime: '6 мин',
    category: 'Дизайн',
    featured: false,
  },
  {
    slug: 'top-10-oshibok-pri-remonte',
    title: 'Топ-10 ошибок при ремонте квартиры и как их избежать',
    excerpt:
      'Самые распространённые ошибки, которые допускают заказчики при ремонте. Экспертные советы от мастеров с многолетним опытом работы на платформе.',
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600',
    date: '2026-02-15',
    readTime: '8 мин',
    category: 'Советы',
    featured: false,
  },
  {
    slug: 'kak-rabotat-s-masterom',
    title: 'Как правильно работать с мастером: от ТЗ до приёмки',
    excerpt:
      'Пошаговый гид по взаимодействию со специалистом: составление технического задания, контроль этапов, приёмка работ и оставление отзыва.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600',
    date: '2026-02-10',
    readTime: '6 мин',
    category: 'Инструкции',
    featured: false,
  },
  {
    slug: 'skolko-stoit-remont',
    title: 'Сколько стоит ремонт квартиры в 2026 году: обзор цен',
    excerpt:
      'Актуальные цены на основные виды ремонтных работ в разных регионах России. Калькулятор бюджета и советы по экономии без потери качества.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
    date: '2026-02-05',
    readTime: '10 мин',
    category: 'Аналитика',
    featured: false,
  },
];

const categories = [
  'Все',
  'Советы',
  'Безопасность',
  'Дизайн',
  'Инструкции',
  'Аналитика',
];

export default function BlogPage() {
  const featuredArticles = articles.filter((a) => a.featured);
  const regularArticles = articles.filter((a) => !a.featured);

  return (
    <div className="min-h-screen bg-gray-50">
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
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">
                  Блог МастерОК
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Полезные{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  статьи
                </span>
              </h1>

              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Советы, инструкции и тренды для заказчиков и специалистов.
                Всё, что нужно знать о ремонте и строительстве.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category Tags */}
        <section className="py-4 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category, index) => (
                <button
                  key={category}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    index === 0
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {featuredArticles.map((article, index) => (
                <motion.div
                  key={article.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={`/blog/${article.slug}`}
                    className="group block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                          {article.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="text-xl font-bold text-white mb-2">
                          {article.title}
                        </h2>
                        <div className="flex items-center gap-4 text-white/80 text-sm">
                          <span>
                            {new Date(article.date).toLocaleDateString(
                              'ru-RU',
                              {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              }
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {article.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                        Читать статью
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Regular Articles */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Последние статьи</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {regularArticles.map((article, index) => (
                <motion.div
                  key={article.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={`/blog/${article.slug}`}
                    className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all h-full"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span>
                          {new Date(article.date).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
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
                <Sparkles className="w-10 h-10 mx-auto mb-4 opacity-80" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Подпишитесь на рассылку
                </h2>
                <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
                  Получайте лучшие статьи, советы и новости платформы
                  МастерОК прямо на вашу почту.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Ваш email"
                    className="flex-1 px-5 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transition-all">
                    Подписаться
                  </button>
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
