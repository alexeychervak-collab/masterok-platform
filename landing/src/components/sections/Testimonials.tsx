'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Star, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const testimonials = [
  {
    id: 1,
    name: 'Анна Сергеева',
    role: 'Заказала ремонт квартиры',
    avatar: null,
    rating: 5,
    text: 'Искала электрика через множество сервисов, но именно на YODO нашла настоящего профессионала. Алексей приехал вовремя, сделал всё аккуратно и объяснил, что было не так. Теперь только здесь буду искать мастеров!',
    specialist: 'Алексей П.',
    category: 'Электрика',
    date: '2 дня назад',
    verified: true,
  },
  {
    id: 2,
    name: 'Михаил Козлов',
    role: 'Специалист по сантехнике',
    avatar: null,
    rating: 5,
    text: 'Как специалист работаю на платформе уже год. Заказы приходят регулярно, клиенты адекватные, комиссия честная. Вывод денег быстрый — на карту падает в тот же день. Рекомендую коллегам!',
    specialist: null,
    category: 'Сантехника',
    date: 'неделю назад',
    verified: true,
  },
  {
    id: 3,
    name: 'Елена Новикова',
    role: 'Заказала уборку после ремонта',
    avatar: null,
    rating: 5,
    text: 'После ремонта квартира была в ужасном состоянии. Заказала генеральную уборку через YODO — приехала команда из 3 человек, за 4 часа всё вычистили до блеска. Цена адекватная, качество отличное!',
    specialist: 'Клининг Про',
    category: 'Клининг',
    date: '3 дня назад',
    verified: true,
  },
  {
    id: 4,
    name: 'Дмитрий Волков',
    role: 'Репетитор по математике',
    avatar: null,
    rating: 5,
    text: 'За полгода на платформе заработал в 2 раза больше, чем раньше на репетиторстве через знакомых. Ученики находятся сами, расписание удобное, оплата гарантирована. Лучший сервис для репетиторов!',
    specialist: null,
    category: 'Репетиторы',
    date: '5 дней назад',
    verified: true,
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">
            <Quote className="h-3 w-3 mr-1" />
            12 847 отзывов
          </Badge>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Нас <span className="gradient-text">рекомендуют</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Реальные истории от заказчиков и специалистов
          </p>
        </motion.div>

        {/* Testimonials Slider */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100"
            >
              {/* Quote icon */}
              <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Quote className="h-6 w-6 text-white" />
              </div>
              
              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              {/* Text */}
              <blockquote className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-8">
                &ldquo;{testimonials[currentIndex].text}&rdquo;
              </blockquote>
              
              {/* Author */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xl font-bold">
                    {testimonials[currentIndex].name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900">{testimonials[currentIndex].name}</p>
                      {testimonials[currentIndex].verified && (
                        <Badge variant="success" className="text-xs">Проверен</Badge>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">
                    {testimonials[currentIndex].category}
                  </Badge>
                  {testimonials[currentIndex].specialist && (
                    <span className="text-sm text-gray-500">
                      Мастер: <span className="font-medium text-gray-700">{testimonials[currentIndex].specialist}</span>
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? 'w-8 bg-gradient-to-r from-violet-500 to-fuchsia-500'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Video testimonial CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button variant="outline" size="lg" className="group">
            <Play className="h-5 w-5 mr-2 text-violet-500 group-hover:text-violet-600" />
            Смотреть видео-отзывы
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
