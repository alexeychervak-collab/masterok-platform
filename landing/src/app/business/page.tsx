'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Building2,
  Shield,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  FileText,
  CreditCard,
  Headphones,
  BarChart3,
  Sparkles,
  Clock,
  Building,
  Store,
  Hotel,
  Landmark,
  Factory,
  type LucideIcon,
} from 'lucide-react';

const businessIconMap: Record<string, LucideIcon> = {
  Building, Building2, Store, Hotel, Landmark, Factory
};

const features = [
  {
    icon: Users,
    title: 'Пул проверенных специалистов',
    description: 'Доступ к 15,000+ верифицированных специалистов. Подбор команды под ваш проект с учётом специализации, рейтинга и города.',
  },
  {
    icon: Shield,
    title: 'Корпоративная эскроу-защита',
    description: 'Безопасные платежи через юридическое лицо с полным пакетом закрывающих документов (акты, счета-фактуры, УПД).',
  },
  {
    icon: FileText,
    title: 'Электронный документооборот',
    description: 'Договоры, акты, сметы — всё в электронном виде с юридической силой. Интеграция с 1С и EDI-системами.',
  },
  {
    icon: BarChart3,
    title: 'Аналитика и отчётность',
    description: 'Дашборд с метриками: расходы, сроки, качество. Ежемесячные отчёты для бухгалтерии и руководства.',
  },
  {
    icon: Headphones,
    title: 'Персональный менеджер',
    description: 'Выделенный аккаунт-менеджер для решения задач, координации и контроля качества всех работ.',
  },
  {
    icon: CreditCard,
    title: 'Гибкие условия оплаты',
    description: 'Постоплата до 30 дней для надёжных партнёров. Оплата по безналичному расчёту для юрлиц.',
  },
];

const useCases = [
  { title: 'Управляющие компании', desc: 'Плановый и аварийный ремонт, обслуживание зданий', icon: 'Building' },
  { title: 'Девелоперы', desc: 'Отделка, благоустройство, коммуникации для новостроек', icon: 'Building2' },
  { title: 'Ритейл', desc: 'Ремонт и оформление торговых точек по всей России', icon: 'Store' },
  { title: 'HoReCa', desc: 'Ремонт ресторанов, кафе, отелей с минимальным простоем', icon: 'Hotel' },
  { title: 'Офисы', desc: 'Обустройство и ремонт офисных пространств', icon: 'Landmark' },
  { title: 'Производство', desc: 'Ремонт и обслуживание промышленных объектов', icon: 'Factory' },
];

const clients = [
  'Сбербанк', 'X5 Group', 'Яндекс', 'Магнит', 'МТС', 'Ростелеком', 'ПИК', 'Самолёт',
];

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-6">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-600">Для бизнеса</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                МастерОК{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  для бизнеса
                </span>
              </h1>

              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Корпоративная платформа для компаний: безналичная оплата, закрывающие документы,
                персональный менеджер и доступ к 15,000+ специалистов
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contacts"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                >
                  Оставить заявку
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="tel:88001234567"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 rounded-xl font-semibold hover:border-indigo-500 transition-all"
                >
                  8 800 123-45-67
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust logos */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-center text-gray-400 text-sm mb-6">Нам доверяют крупнейшие компании России</p>
            <div className="flex flex-wrap items-center justify-center gap-10 opacity-40">
              {clients.map((name) => (
                <span key={name} className="text-xl font-bold text-gray-400">{name}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Возможности для бизнеса</h2>
              <p className="text-xl text-gray-600">Всё что нужно для корпоративных клиентов</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mb-5">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 px-4 bg-gradient-to-br from-indigo-50 to-blue-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Для кого</h2>
              <p className="text-xl text-gray-600">Отрасли, с которыми мы работаем</p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
              {useCases.map((uc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="mb-3">{(() => { const IC = businessIconMap[uc.icon]; return IC ? <IC className="w-8 h-8 text-orange-500" /> : null; })()}</div>
                  <h3 className="font-bold mb-1 text-sm">{uc.title}</h3>
                  <p className="text-xs text-gray-500">{uc.desc}</p>
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
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600" />
              <div className="relative px-8 py-16 text-center text-white">
                <Building2 className="w-12 h-12 mx-auto mb-4 opacity-80" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Начните работать с МастерОК
                </h2>
                <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
                  Оставьте заявку — менеджер свяжется с вами в течение часа и подберёт решение под ваши задачи
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contacts"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    Оставить заявку
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <a
                    href="mailto:sales@masterok.ru"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                  >
                    sales@masterok.ru
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
