'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
  count: number;
  icon: string; // emoji or icon name
  gradient: string;
  image: string; // gradient or pattern
  trending?: boolean;
  slug: string;
}

const categories: Category[] = [
  {
    id: '1',
    name: 'Строительство домов',
    count: 3200,
    icon: '🏗️',
    gradient: 'from-blue-500 via-blue-600 to-blue-700',
    image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    trending: true,
    slug: 'construction',
  },
  {
    id: '2',
    name: 'Ремонт квартир',
    count: 4800,
    icon: '🔨',
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    image: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    trending: true,
    slug: 'repair',
  },
  {
    id: '3',
    name: 'Архитектура',
    count: 2450,
    icon: '📐',
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
    image: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    trending: false,
    slug: 'architecture',
  },
  {
    id: '4',
    name: 'Сантехника',
    count: 1850,
    icon: '🚰',
    gradient: 'from-blue-400 via-blue-500 to-blue-600',
    image: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    trending: false,
    slug: 'plumbing',
  },
  {
    id: '5',
    name: 'Электромонтаж',
    count: 2100,
    icon: '⚡',
    gradient: 'from-yellow-400 via-orange-400 to-red-400',
    image: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    trending: true,
    slug: 'electric',
  },
  {
    id: '6',
    name: 'Дизайн интерьера',
    count: 1920,
    icon: '🎨',
    gradient: 'from-purple-500 via-pink-500 to-red-500',
    image: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    trending: false,
    slug: 'design',
  },
  {
    id: '7',
    name: 'Кровельные работы',
    count: 980,
    icon: '🏠',
    gradient: 'from-gray-600 via-gray-700 to-gray-800',
    image: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    trending: false,
    slug: 'roofing',
  },
  {
    id: '8',
    name: 'Фасадные работы',
    count: 1340,
    icon: '🏢',
    gradient: 'from-teal-500 via-green-500 to-emerald-500',
    image: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    trending: false,
    slug: 'facade',
  },
];

export default function CategoriesEnhanced() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-violet-100 to-transparent rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-fuchsia-100 to-transparent rounded-full blur-3xl opacity-50" />
      
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">
            <TrendingUp className="h-3 w-3 mr-1" />
            Популярные категории
          </Badge>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Найдите <span className="gradient-text">своего</span> специалиста
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Тысячи проверенных мастеров готовы помочь вам в любой сфере
          </p>
        </motion.div>

        {/* Categories Grid - Enhanced with Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/search?q=${encodeURIComponent(category.name)}`}
                className="group block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Gradient Background */}
                <div 
                  className="absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: category.image }}
                />
                
                {/* Overlay gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative p-6 h-48 flex flex-col justify-between">
                  {/* Top: Icon and Badge */}
                  <div className="flex items-start justify-between">
                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">
                      {category.icon}
                    </div>
                    
                    {category.trending && (
                      <Badge className="bg-white/90 backdrop-blur-sm text-emerald-600 border-0 shadow-lg">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Топ
                      </Badge>
                    )}
                  </div>
                  
                  {/* Bottom: Title and Count */}
                  <div>
                    <h3 className="font-bold text-xl text-white mb-2 group-hover:text-white transition-colors drop-shadow-lg">
                      {category.name}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white/90 font-medium drop-shadow">
                        {category.count.toLocaleString('ru-RU')} специалистов
                      </p>
                      <ArrowRight className="w-5 h-5 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all drop-shadow" />
                    </div>
                  </div>
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Посмотреть все категории
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">50K+</div>
            <div className="text-sm text-gray-600">Специалистов</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">2M+</div>
            <div className="text-sm text-gray-600">Заказов выполнено</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">4.9</div>
            <div className="text-sm text-gray-600">Средний рейтинг</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">24/7</div>
            <div className="text-sm text-gray-600">Поддержка</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



