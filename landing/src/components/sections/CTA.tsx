'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Users, Briefcase, CheckCircle, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

const benefits = [
  'Бесплатная регистрация',
  'Быстрый старт за 5 минут',
  'Первые заказы в первый день',
  'Вывод денег на любую карту',
]

export function CTA() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-violet-500/30 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-pink-500/30 to-transparent rounded-full blur-3xl"
        />
        <div className="absolute inset-0 noise opacity-[0.02]" />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full mb-8"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span className="text-white/90 font-medium">Присоединяйтесь к 15 000+ специалистов</span>
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Начните зарабатывать
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-pink-200">
                уже сегодня
              </span>
            </h2>
            
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Регистрация занимает 5 минут. Первые заказы придут в тот же день. 
              Честная комиссия только с выполненных заказов.
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full"
                >
                  <CheckCircle className="h-4 w-4 text-emerald-300" />
                  <span className="text-white/90 text-sm">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="xl"
                className="bg-white text-violet-600 hover:bg-white/90 shadow-2xl shadow-black/20 group"
                asChild
              >
                <Link href="/register">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Стать специалистом
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur"
                asChild
              >
                <Link href="/specialists">
                  <Users className="mr-2 h-5 w-5" />
                  Найти специалиста
                </Link>
              </Button>
            </div>

            {/* Trust */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-amber-300 text-amber-300" />
                ))}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {['А', 'М', 'Д', 'Е', 'И'].map((letter, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 border-2 border-white flex items-center justify-center text-white font-bold text-sm"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">12 847 отзывов</p>
                  <p className="text-white/60 text-sm">Средняя оценка 4.9</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
