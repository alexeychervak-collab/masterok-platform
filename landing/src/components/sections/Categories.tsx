'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Wrench, Paintbrush, Zap, Droplets, Building2, 
  Sofa, Leaf, Car, GraduationCap, Heart, 
  Camera, Code, ArrowRight, Sparkles, TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const categories = [
  { 
    name: 'Ремонт и отделка', 
    icon: Paintbrush, 
    count: 2340, 
    gradient: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50',
    slug: 'repair',
    trending: true,
  },
  { 
    name: 'Электрика', 
    icon: Zap, 
    count: 1890, 
    gradient: 'from-yellow-500 to-orange-500',
    bg: 'bg-yellow-50',
    slug: 'electric',
    trending: false,
  },
  { 
    name: 'Сантехника', 
    icon: Droplets, 
    count: 1560, 
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    slug: 'plumbing',
    trending: false,
  },
  { 
    name: 'Строительство', 
    icon: Building2, 
    count: 980, 
    gradient: 'from-gray-600 to-gray-800',
    bg: 'bg-gray-50',
    slug: 'construction',
    trending: false,
  },
  { 
    name: 'Мебель на заказ', 
    icon: Sofa, 
    count: 750, 
    gradient: 'from-amber-600 to-yellow-600',
    bg: 'bg-amber-50',
    slug: 'furniture',
    trending: false,
  },
  { 
    name: 'Сад и ландшафт', 
    icon: Leaf, 
    count: 620, 
    gradient: 'from-green-500 to-emerald-500',
    bg: 'bg-green-50',
    slug: 'garden',
    trending: false,
  },
  { 
    name: 'Авто', 
    icon: Car, 
    count: 1120, 
    gradient: 'from-slate-600 to-slate-800',
    bg: 'bg-slate-50',
    slug: 'auto',
    trending: false,
  },
  { 
    name: 'Репетиторы', 
    icon: GraduationCap, 
    count: 3200, 
    gradient: 'from-purple-500 to-indigo-500',
    bg: 'bg-purple-50',
    slug: 'tutors',
    trending: true,
  },
  { 
    name: 'Красота', 
    icon: Heart, 
    count: 2100, 
    gradient: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50',
    slug: 'beauty',
    trending: false,
  },
  { 
    name: 'Фото и видео', 
    icon: Camera, 
    count: 890, 
    gradient: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-50',
    slug: 'photo',
    trending: false,
  },
  { 
    name: 'IT и разработка', 
    icon: Code, 
    count: 1450, 
    gradient: 'from-cyan-500 to-blue-500',
    bg: 'bg-cyan-50',
    slug: 'it',
    trending: true,
  },
  { 
    name: 'Клининг', 
    icon: Sparkles, 
    count: 1780, 
    gradient: 'from-teal-500 to-green-500',
    bg: 'bg-teal-50',
    slug: 'cleaning',
    trending: false,
  },
]

export function Categories() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
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
            <Sparkles className="h-3 w-3 mr-1" />
            12 категорий
          </Badge>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Найдите <span className="gradient-text">своего</span> мастера
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            От ремонта до репетиторства — тысячи проверенных специалистов в каждой сфере
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/services/${category.slug}`}
                className={`group block relative p-6 rounded-2xl ${category.bg} border border-transparent hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden`}
              >
                {/* Trending badge */}
                {category.trending && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-white/80 backdrop-blur text-xs">
                      <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
                      Популярно
                    </Badge>
                  </div>
                )}
                
                {/* Hover gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${category.gradient} mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                >
                  <category.icon className="h-7 w-7 text-white" />
                </div>
                
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">
                  {category.name}
                </h3>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {category.count.toLocaleString('ru-RU')} мастеров
                  </p>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button variant="outline" size="lg" asChild className="group">
            <Link href="/services">
              Все категории
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
