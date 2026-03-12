'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Shield,
  Users,
  Star,
  TrendingUp,
  Award,
  Heart,
  MapPin,
  Target,
  Eye,
  Sparkles,
  Building2,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

const stats = [
  { value: '15,000+', label: 'Специалистов на платформе', icon: Users },
  { value: '50,000+', label: 'Выполненных заказов', icon: CheckCircle },
  { value: '100+', label: 'Городов России', icon: MapPin },
  { value: '4.9/5', label: 'Средний рейтинг', icon: Star },
];

const values = [
  {
    icon: Shield,
    title: 'Безопасность',
    description:
      'Все сделки защищены эскроу-системой. Деньги замораживаются до подтверждения качества работ. Персональные данные надёжно защищены.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Star,
    title: 'Качество',
    description:
      'Строгая система верификации специалистов, реальные отзывы от заказчиков и многоуровневый контроль качества на каждом этапе.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Eye,
    title: 'Прозрачность',
    description:
      'Честные цены без скрытых комиссий. Открытые рейтинги, реальные отзывы. Вы видите полную информацию о специалисте перед выбором.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Heart,
    title: 'Поддержка',
    description:
      'Служба поддержки работает круглосуточно. Мы помогаем решить любые вопросы и споры между заказчиками и специалистами.',
    color: 'from-green-500 to-emerald-500',
  },
];

const team = [
  {
    name: 'Александр Волков',
    role: 'Генеральный директор',
    bio: 'Более 15 лет опыта в IT и строительной отрасли',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
  },
  {
    name: 'Елена Морозова',
    role: 'Директор по продукту',
    bio: 'Эксперт в разработке маркетплейсов и цифровых платформ',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
  },
  {
    name: 'Дмитрий Козлов',
    role: 'Технический директор',
    bio: 'Архитектор высоконагруженных систем, ex-Яндекс',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  },
  {
    name: 'Анна Петрова',
    role: 'Директор по работе с клиентами',
    bio: 'Создание первоклассного клиентского сервиса',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
  },
];

const milestones = [
  { year: '2022', title: 'Основание', desc: 'Запуск платформы МастерОК в Москве' },
  { year: '2023', title: 'Рост', desc: 'Выход на 50 городов, 5,000 специалистов' },
  { year: '2024', title: 'Эскроу', desc: 'Запуск системы безопасных платежей' },
  { year: '2025', title: 'Масштаб', desc: '15,000+ специалистов, 100+ городов' },
];

export default function AboutPage() {
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
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">
                  О компании
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                О компании{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  МастерОК
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                МастерОК -- современная платформа для поиска проверенных
                специалистов в сфере строительства, ремонта и обслуживания.
                Мы объединяем профессионалов и заказчиков, делая процесс поиска
                и выполнения работ максимально простым и безопасным.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 rounded-full mb-4">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-600">
                    Наша миссия
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Делаем ремонт и строительство доступными для каждого
                </h2>

                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                  Мы создаём экосистему, где каждый может легко найти надёжного
                  специалиста для любой задачи, а профессионалы получают
                  постоянный поток заказов и инструменты для развития своего
                  бизнеса.
                </p>

                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Наша цель -- сделать процесс поиска и заказа строительных
                  услуг таким же простым, как онлайн-шопинг, но с гарантией
                  качества и безопасности на каждом этапе.
                </p>

                <div className="flex flex-wrap gap-3">
                  {['Доверие', 'Инновации', 'Качество', 'Доступность'].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800"
                    alt="Строительство"
                    className="w-full h-[500px] object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Наши ценности
              </h2>
              <p className="text-xl text-gray-600">
                Принципы, которыми мы руководствуемся каждый день
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-5`}
                  >
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Наша история
              </h2>
              <p className="text-xl text-gray-600">
                Ключевые этапы развития платформы
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2 hidden md:block" />

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`flex flex-col md:flex-row items-center gap-6 ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    <div
                      className={`flex-1 ${
                        index % 2 === 0 ? 'md:text-right' : 'md:text-left'
                      }`}
                    >
                      <div className="bg-white rounded-2xl p-6 shadow-lg inline-block">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                          {milestone.year}
                        </div>
                        <h3 className="font-bold text-lg mb-1">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {milestone.desc}
                        </p>
                      </div>
                    </div>

                    <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full border-4 border-white shadow-md z-10 flex-shrink-0" />

                    <div className="flex-1" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Наша команда
              </h2>
              <p className="text-xl text-gray-600">
                Люди, которые создают МастерОК
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="relative rounded-2xl overflow-hidden mb-4 shadow-lg">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-bold text-white">
                        {member.name}
                      </h3>
                      <p className="text-white/80 text-sm">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
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
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />

              <div className="relative px-8 py-16 text-center text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Присоединяйтесь к МастерОК
                </h2>
                <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
                  Станьте частью крупнейшего сообщества профессионалов и
                  заказчиков. Вместе мы делаем ремонт и строительство лучше.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/register-specialist"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    Стать специалистом
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/create-order"
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
