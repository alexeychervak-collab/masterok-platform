'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Star, MapPin, CheckCircle, ArrowRight, Clock, MessageCircle, Briefcase, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Rating } from '@/components/ui/rating'

const specialists = [
  {
    id: '1',
    name: 'Алексей Петров',
    title: 'Электрик',
    avatar: null,
    rating: 4.9,
    reviews: 128,
    city: 'Москва',
    experience: 12,
    isVerified: true,
    isPremium: true,
    completedOrders: 340,
    responseTime: 15,
    price: 'от 2 000 ₽',
    skills: ['Электромонтаж', 'Умный дом', 'Ремонт'],
    lastOnline: 'Сейчас онлайн',
    badge: 'top',
  },
  {
    id: '2',
    name: 'Мария Иванова',
    title: 'Дизайнер интерьеров',
    avatar: null,
    rating: 5.0,
    reviews: 89,
    city: 'Санкт-Петербург',
    experience: 8,
    isVerified: true,
    isPremium: false,
    completedOrders: 156,
    responseTime: 30,
    price: 'от 15 000 ₽',
    skills: ['3D-визуализация', 'Авторский надзор'],
    lastOnline: '5 мин назад',
    badge: null,
  },
  {
    id: '3',
    name: 'Дмитрий Смирнов',
    title: 'Сантехник',
    avatar: null,
    rating: 4.8,
    reviews: 203,
    city: 'Москва',
    experience: 15,
    isVerified: true,
    isPremium: true,
    completedOrders: 520,
    responseTime: 10,
    price: 'от 1 500 ₽',
    skills: ['Аварийные работы', 'Установка', 'Ремонт'],
    lastOnline: 'Сейчас онлайн',
    badge: 'fast',
  },
  {
    id: '4',
    name: 'Елена Козлова',
    title: 'Репетитор английского',
    avatar: null,
    rating: 4.9,
    reviews: 156,
    city: 'Онлайн',
    experience: 10,
    isVerified: true,
    isPremium: false,
    completedOrders: 890,
    responseTime: 20,
    price: 'от 1 200 ₽/час',
    skills: ['IELTS', 'Разговорный', 'Бизнес'],
    lastOnline: '10 мин назад',
    badge: null,
  },
]

function getBadge(badge: string | null) {
  if (badge === 'top') {
    return (
      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
        <Award className="h-3 w-3 mr-1" />
        Топ мастер
      </Badge>
    )
  }
  if (badge === 'fast') {
    return (
      <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0">
        <Clock className="h-3 w-3 mr-1" />
        Быстрый отклик
      </Badge>
    )
  }
  return null
}

export function FeaturedSpecialists() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <Badge variant="secondary" className="mb-4">
              <Star className="h-3 w-3 mr-1 fill-amber-400 text-amber-400" />
              Рейтинг 4.9+
            </Badge>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Лучшие <span className="gradient-text">специалисты</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-xl">
              Проверенные профессионалы с высоким рейтингом, которых рекомендуют клиенты
            </p>
          </div>
          <Button variant="outline" size="lg" asChild className="shrink-0 group">
            <Link href="/specialists">
              Все специалисты
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>

        {/* Specialists Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {specialists.map((specialist, index) => (
            <motion.div
              key={specialist.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/specialists/${specialist.id}`}
                className="group block p-6 rounded-3xl bg-white border border-gray-100 hover:border-violet-200 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/10"
              >
                <div className="flex gap-5">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${
                      specialist.isPremium ? 'from-violet-500 to-fuchsia-500' : 'from-gray-400 to-gray-500'
                    } flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                      {specialist.name.charAt(0)}
                    </div>
                    {specialist.lastOnline === 'Сейчас онлайн' && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-violet-600 transition-colors">
                            {specialist.name}
                          </h3>
                          {specialist.isVerified && (
                            <CheckCircle className="h-5 w-5 text-violet-500" />
                          )}
                        </div>
                        <p className="text-gray-500">{specialist.title}</p>
                      </div>
                      {getBadge(specialist.badge)}
                    </div>
                    
                    {/* Rating & Location */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Rating value={specialist.rating} size="sm" />
                        <span className="font-semibold text-gray-900">{specialist.rating}</span>
                        <span className="text-gray-400">({specialist.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{specialist.city}</span>
                      </div>
                    </div>
                    
                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {specialist.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Briefcase className="h-4 w-4" />
                          <span>{specialist.completedOrders} заказов</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>~{specialist.responseTime} мин</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-violet-600">{specialist.price}</span>
                      </div>
                    </div>
                  </div>
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
          className="text-center mt-12"
        >
          <Button variant="gradient" size="xl" asChild className="group">
            <Link href="/specialists">
              Найти специалиста
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
