'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Search,
  Star,
  Shield,
  Clock,
  TrendingUp,
  Award,
  Users,
  CheckCircle,
  ArrowRight,
  Play,
  Sparkles,
  Zap,
  Heart,
  MessageSquare,
  MapPin,
  DollarSign,
  Briefcase,
  Phone,
  Mail,
  Menu,
  X,
  FileText,
  Building2,
  Hammer,
  Palette,
  Droplets,
  Ruler,
  Home,
  PaintBucket,
  type LucideIcon
} from 'lucide-react';

const categoryIconMap: Record<string, LucideIcon> = {
  Building2, Hammer, Palette, Droplets, Zap, Ruler, Home, PaintBucket
};

const APP_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL || '/downloads/app-release.apk';
const WEBAPP_URL = process.env.NEXT_PUBLIC_WEBAPP_URL || '/webapp/';

const categories = [
  {
    id: 1,
    name: 'Строительство домов',
    count: 3200,
    icon: 'Building2',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400',
    popular: true
  },
  {
    id: 2,
    name: 'Ремонт квартир',
    count: 4800,
    icon: 'Hammer',
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400',
    popular: true
  },
  {
    id: 3,
    name: 'Дизайн интерьера',
    count: 1920,
    icon: 'Palette',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400',
    popular: true
  },
  {
    id: 4,
    name: 'Сантехника',
    count: 1850,
    icon: 'Droplets',
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400'
  },
  {
    id: 5,
    name: 'Электромонтаж',
    count: 2100,
    icon: 'Zap',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400'
  },
  {
    id: 6,
    name: 'Архитектура',
    count: 2450,
    icon: 'Ruler',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400'
  },
  {
    id: 7,
    name: 'Кровельные работы',
    count: 980,
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400'
  },
  {
    id: 8,
    name: 'Фасадные работы',
    count: 1340,
    icon: 'PaintBucket',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'
  }
];

const topSpecialists = [
  {
    id: 1,
    name: 'Даниил Крахин',
    role: 'Архитектор',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 4.95,
    reviews: 127,
    projects: 89,
    price: 2500,
    location: 'Москва',
    experience: 15,
    skills: ['Архитектура', 'Проектирование', 'AutoCAD'],
    verified: true,
    top: true,
    portfolio: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=300'
    ]
  },
  {
    id: 2,
    name: 'Мария Соколова',
    role: 'Дизайнер интерьера',
    avatar: 'https://i.pravatar.cc/150?img=5',
    rating: 4.88,
    reviews: 94,
    projects: 156,
    price: 1800,
    location: 'Санкт-Петербург',
    experience: 8,
    skills: ['Дизайн интерьера', '3D Max', 'Планировка'],
    verified: true,
    portfolio: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300',
      'https://images.unsplash.com/photo-1615873968403-89e068629265?w=300'
    ]
  },
  {
    id: 3,
    name: 'Алексей Петров',
    role: 'Прораб, инженер-строитель',
    avatar: 'https://i.pravatar.cc/150?img=33',
    rating: 4.92,
    reviews: 203,
    projects: 312,
    price: 3000,
    location: 'Москва',
    experience: 20,
    skills: ['Строительство', 'Ремонт', 'Управление проектами'],
    verified: true,
    top: true,
    portfolio: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=300',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300'
    ]
  },
  {
    id: 4,
    name: 'Елена Васильева',
    role: 'Дизайнер ландшафта',
    avatar: 'https://i.pravatar.cc/150?img=9',
    rating: 4.90,
    reviews: 78,
    projects: 92,
    price: 2200,
    location: 'Москва',
    experience: 12,
    skills: ['Ландшафтный дизайн', 'Озеленение', '3D визуализация'],
    verified: true,
    portfolio: [
      'https://images.unsplash.com/photo-1585857188823-f833bee2f8f4?w=300',
      'https://images.unsplash.com/photo-1584200186925-87fa8f93be9b?w=300',
      'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=300'
    ]
  }
];

const projects = [
  {
    id: 1,
    title: 'Строительство дома',
    description: 'Загородный дом под ключ',
    budget: 3500000,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500',
    category: 'Строительство'
  },
  {
    id: 2,
    title: 'Капитальный ремонт',
    description: 'Квартира 85м²',
    budget: 1200000,
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=500',
    category: 'Ремонт'
  },
  {
    id: 3,
    title: 'Архитектурный проект',
    description: 'Проектирование коттеджа',
    budget: 180000,
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=500',
    category: 'Архитектура'
  },
  {
    id: 4,
    title: 'Дизайн интерьера',
    description: 'Современный стиль',
    budget: 350000,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500',
    category: 'Дизайн'
  }
];

export default function EnhancedHomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    } else {
      window.location.href = '/search';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Floating Header */}
      <motion.header
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  МастерОК
                </div>
                <div className="text-xs text-gray-500">Строительные специалисты</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/search" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Найти специалиста
              </Link>
              <Link href="/specialist/find-orders" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Найти заказы
              </Link>
              <Link href="/how-it-works" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Как работает
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Тарифы
              </Link>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <Link
                href={WEBAPP_URL}
                className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                Веб‑версия
              </Link>
              <Link
                href={APP_DOWNLOAD_URL}
                className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                Скачать APK
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                Вход
              </Link>
              <Link
                href="/register-specialist"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                Регистрация
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-6 space-y-4">
              <Link href={WEBAPP_URL} className="block text-gray-700 hover:text-orange-600 font-medium">
                Веб‑версия
              </Link>
              <Link href={APP_DOWNLOAD_URL} className="block text-gray-700 hover:text-orange-600 font-medium">
                Скачать APK
              </Link>
              <Link href="/search" className="block text-gray-700 hover:text-orange-600 font-medium">
                Найти специалиста
              </Link>
              <Link href="/specialist/find-orders" className="block text-gray-700 hover:text-orange-600 font-medium">
                Найти заказы
              </Link>
              <Link href="/how-it-works" className="block text-gray-700 hover:text-orange-600 font-medium">
                Как работает
              </Link>
              <Link href="/pricing" className="block text-gray-700 hover:text-orange-600 font-medium">
                Тарифы
              </Link>
              <div className="pt-4 space-y-2">
                <Link href="/login" className="block w-full px-4 py-2 text-center border-2 border-gray-300 rounded-xl font-medium">
                  Вход
                </Link>
                <Link href="/register-specialist" className="block w-full px-4 py-3 text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold">
                  Регистрация
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section with Parallax */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-600">
                  #1 Платформа для поиска специалистов
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                Найдите{' '}
                <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 bg-clip-text text-transparent">
                  лучших
                </span>
                <br />
                специалистов
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                15,000+ проверенных профессионалов готовы выполнить ваш проект.
                Безопасные сделки, гарантия качества.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  Найти специалиста <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href={WEBAPP_URL}
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white text-gray-900 rounded-2xl font-semibold border border-gray-200 hover:shadow-md transition-all"
                >
                  Открыть веб‑версию <Play className="w-5 h-5" />
                </Link>
                <Link
                  href={APP_DOWNLOAD_URL}
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white text-gray-900 rounded-2xl font-semibold border border-gray-200 hover:shadow-md transition-all"
                >
                  Скачать приложение (APK) <Phone className="w-5 h-5" />
                </Link>
              </div>

              {/* Search Bar */}
              <div className="relative mb-8">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Найти специалиста или услугу..."
                    className="w-full pl-16 pr-40 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-xl"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                  >
                    Найти
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                <p className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Популярно: Ремонт квартир, Дизайн интерьера, Строительство
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: 'Специалистов', value: '15,000+', icon: <Users className="w-5 h-5" /> },
                  { label: 'Проектов', value: '50,000+', icon: <Briefcase className="w-5 h-5" /> },
                  { label: 'Рейтинг', value: '4.9/5', icon: <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" /> }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                  >
                    <div className="flex items-center gap-2 text-orange-600 mb-1">
                      {stat.icon}
                      <span className="text-2xl font-bold">{stat.value}</span>
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
                  alt="Hero"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute top-10 right-10 bg-white rounded-2xl p-4 shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="https://i.pravatar.cc/60?img=12"
                      alt="Specialist"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="font-semibold">Даниил К.</div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>4.95 (127)</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                  className="absolute bottom-10 left-10 bg-white rounded-2xl p-4 shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Проект завершён</div>
                      <div className="text-sm text-gray-600">+3,500,000 ₽</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Logos */}
      <section className="py-12 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-500 mb-8">Нам доверяют:</p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-50">
            {['Сбербанк', 'Яндекс', 'ВТБ', 'МТС', 'Газпром', 'Ростелеком'].map((company) => (
              <div key={company} className="text-2xl font-bold text-gray-400">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories with Images */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Найдите специалистов по категориям
            </h2>
            <p className="text-xl text-gray-600">
              Выберите нужную категорию строительных работ
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link key={category.id} href={`/search?q=${encodeURIComponent(category.name)}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="group relative rounded-2xl overflow-hidden shadow-xl cursor-pointer"
              >
                <div className="relative h-64">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {category.popular && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-400 text-black text-xs font-bold rounded-full">
                      Популярно
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    {(() => { const IconComp = categoryIconMap[category.icon]; return IconComp ? <IconComp className="w-8 h-8 text-orange-500 mb-2" /> : null; })()}
                    <h3 className="text-xl font-bold text-white mb-2">
                      {category.name}
                    </h3>
                    <div className="flex items-center justify-between text-white/80 text-sm">
                      <span>{category.count} специалистов</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 rounded-xl font-semibold hover:border-orange-500 hover:text-orange-600 transition-all"
            >
              Все категории
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Как это работает</h2>
            <p className="text-xl text-gray-600">Простой процесс в 4 шага</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Разместите заказ',
                description: 'Опишите проект — это бесплатно. Получите предложения за минуты.',
                icon: <FileText className="w-8 h-8" />,
                color: 'from-orange-500 to-amber-500'
              },
              {
                step: '02',
                title: 'Выберите специалиста',
                description: 'Сравните портфолио, отзывы и цены. Выберите лучшего.',
                icon: <Users className="w-8 h-8" />,
                color: 'from-orange-600 to-red-500'
              },
              {
                step: '03',
                title: 'Безопасная сделка',
                description: 'Деньги защищены до завершения работы. Milestone платежи.',
                icon: <Shield className="w-8 h-8" />,
                color: 'from-green-500 to-emerald-500'
              },
              {
                step: '04',
                title: 'Получите результат',
                description: 'Примите работу и оплатите. Гарантия качества.',
                icon: <CheckCircle className="w-8 h-8" />,
                color: 'from-orange-500 to-red-500'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all group">
                  <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <div className="text-5xl font-bold text-gray-100 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Specialists with 3D Cards */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Топ специалисты</h2>
              <p className="text-xl text-gray-600">
                Лучшие профессионалы с высоким рейтингом
              </p>
            </div>
            <Link
              href="/specialists"
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold hover:border-orange-500 hover:text-orange-600 transition-all"
            >
              Все специалисты
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {topSpecialists.map((specialist, index) => (
              <motion.div
                key={specialist.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all"
              >
                {/* Header with Avatar */}
                <div className="relative h-48 bg-gradient-to-br from-orange-500 to-orange-600 p-6">
                  {specialist.top && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-400 text-black text-xs font-bold rounded-full flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      ТОП
                    </div>
                  )}
                  <img
                    src={specialist.avatar}
                    alt={specialist.name}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-xl mx-auto group-hover:scale-110 transition-transform"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold mb-1">{specialist.name}</h3>
                      <p className="text-sm text-gray-600">{specialist.role}</p>
                    </div>
                    {specialist.verified && (
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{specialist.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({specialist.reviews} отзывов)
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {specialist.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      {specialist.projects} проектов
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {specialist.experience} лет опыта
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {specialist.skills.slice(0, 2).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-100 text-xs rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                    {specialist.skills.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded-lg">
                        +{specialist.skills.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Portfolio Preview */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {specialist.portfolio.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Portfolio"
                        className="w-full h-16 object-cover rounded-lg"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-sm text-gray-500">от</div>
                      <div className="text-xl font-bold text-orange-600">
                        {specialist.price.toLocaleString()} ₽/час
                      </div>
                    </div>
                    <Link href={`/specialists/${specialist.id}`} className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors">
                      <MessageSquare className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Gallery */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Примеры выполненных проектов</h2>
            <p className="text-xl text-gray-600">
              Реальные проекты наших специалистов
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group relative rounded-2xl overflow-hidden shadow-xl cursor-pointer"
              >
                <div className="relative h-80">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold">
                    {project.category}
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-white/80 text-sm mb-4">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-white">
                        {project.budget.toLocaleString()} ₽
                      </div>
                      <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 text-gray-900 ml-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200')] opacity-10 mix-blend-overlay" />
            
            <div className="relative px-8 py-16 text-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Начните строительный проект сегодня
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Найдите проверенных строительных специалистов. Получите бесплатные предложения от лучших профессионалов.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/create-order"
                  className="px-8 py-4 bg-white text-orange-600 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all"
                >
                  Разместить проект бесплатно
                </Link>
                <Link
                  href="/search"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  Найти специалиста
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">МастерОК</div>
                  <div className="text-sm text-gray-400">Строительные специалисты</div>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Крупнейшая биржа строительных специалистов. Найдите профессионалов для любого проекта.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <Phone className="w-4 h-4" />
                  8 (800) 555-35-35
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  support@masterok.ru
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  Москва, ул. Тверская, 1
                </div>
              </div>
            </div>

            {[
              {
                title: 'Для заказчиков',
                links: [
                  { text: 'Как это работает', href: '/how-it-works' },
                  { text: 'Найти специалистов', href: '/search' },
                  { text: 'Разместить проект', href: '/create-order' },
                  { text: 'Тарифы', href: '/pricing' },
                  { text: 'Безопасная сделка', href: '/safe-deal' },
                ]
              },
              {
                title: 'Для специалистов',
                links: [
                  { text: 'Найти заказы', href: '/specialist/find-orders' },
                  { text: 'Стать специалистом', href: '/register-specialist' },
                  { text: 'Истории успеха', href: '/success-stories' },
                  { text: 'Тарифы PRO', href: '/pricing' },
                ]
              },
              {
                title: 'Компания',
                links: [
                  { text: 'О нас', href: '/about' },
                  { text: 'Контакты', href: '/contacts' },
                  { text: 'Блог', href: '/blog' },
                  { text: 'Вакансии', href: '/careers' },
                  { text: 'Для бизнеса', href: '/business' },
                ]
              }
            ].map((section, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm">
              © 2026 МастерОК. Все права защищены.
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Конфиденциальность
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Условия
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

