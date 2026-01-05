'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MessageCircle, CreditCard, CheckCircle, ArrowRight, Play, Pause } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Найдите специалиста',
    description: 'Воспользуйтесь умным поиском или просмотрите каталог. Изучите профили, рейтинги и отзывы реальных клиентов.',
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
    features: ['Фильтры по 20+ параметрам', 'Рейтинг и отзывы', 'Портфолио работ'],
  },
  {
    icon: MessageCircle,
    number: '02',
    title: 'Обсудите детали',
    description: 'Свяжитесь со специалистом в чате, обсудите задачу, сроки и согласуйте стоимость работ.',
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-50',
    features: ['Онлайн-чат', 'Фото и файлы', 'История переписки'],
  },
  {
    icon: CreditCard,
    number: '03',
    title: 'Безопасная оплата',
    description: 'Оплатите заказ картой или через СБП. Деньги заморозятся на защищённом счёте до завершения работы.',
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-50',
    features: ['Эскроу-счёт', 'Возврат при споре', 'Чек и договор'],
  },
  {
    icon: CheckCircle,
    number: '04',
    title: 'Получите результат',
    description: 'После выполнения работы подтвердите качество. Деньги уйдут специалисту, а вы получите гарантию.',
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50',
    features: ['Гарантия качества', 'Поддержка 24/7', 'Оставьте отзыв'],
  },
]

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-violet-100/50 to-pink-100/50 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <Badge variant="secondary" className="mb-4">
            Простой процесс
          </Badge>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Как это <span className="gradient-text">работает</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            4 простых шага от поиска до результата. Всё прозрачно и безопасно.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Steps List */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => setActiveStep(index)}
                className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                  activeStep === index
                    ? `${step.bgColor} border-2 border-transparent shadow-xl`
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                {/* Progress line */}
                {activeStep === index && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isPlaying ? '100%' : '0%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    onAnimationComplete={() => {
                      if (isPlaying) {
                        setActiveStep((prev) => (prev + 1) % steps.length)
                      }
                    }}
                    className={`absolute top-0 left-0 h-1 rounded-t-2xl bg-gradient-to-r ${step.color}`}
                  />
                )}
                
                <div className="flex items-start gap-5">
                  {/* Icon */}
                  <div
                    className={`shrink-0 p-4 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg`}
                  >
                    <step.icon className="h-7 w-7 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-sm font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                        {step.number}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {step.description}
                    </p>
                    
                    {/* Features */}
                    {activeStep === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex flex-wrap gap-2"
                      >
                        {step.features.map((feature) => (
                          <span
                            key={feature}
                            className="px-3 py-1 text-xs font-medium bg-white rounded-full text-gray-600 border"
                          >
                            {feature}
                          </span>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Arrow */}
                  <ArrowRight
                    className={`h-5 w-5 transition-transform ${
                      activeStep === index ? 'text-gray-900 translate-x-1' : 'text-gray-400'
                    }`}
                  />
                </div>
              </motion.div>
            ))}
            
            {/* Play/Pause button */}
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="gap-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Пауза
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Продолжить
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Main circle */}
              <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${steps[activeStep].color} opacity-10`} />
              <div className={`absolute inset-8 rounded-full bg-gradient-to-br ${steps[activeStep].color} opacity-20`} />
              <div className={`absolute inset-16 rounded-full bg-gradient-to-br ${steps[activeStep].color} opacity-30`} />
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  key={activeStep}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  className={`p-8 rounded-3xl bg-gradient-to-br ${steps[activeStep].color} shadow-2xl`}
                >
                  {(() => {
                    const Icon = steps[activeStep].icon
                    return <Icon className="h-16 w-16 text-white" />
                  })()}
                </motion.div>
              </div>
              
              {/* Step indicators */}
              {steps.map((_, index) => {
                const angle = (index * 90 - 45) * (Math.PI / 180)
                const radius = 180
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius
                
                return (
                  <motion.div
                    key={index}
                    className={`absolute w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      index === activeStep
                        ? `bg-gradient-to-br ${steps[index].color} text-white shadow-lg scale-110`
                        : 'bg-white text-gray-400 border-2'
                    }`}
                    style={{
                      left: `calc(50% + ${x}px - 20px)`,
                      top: `calc(50% + ${y}px - 20px)`,
                    }}
                    animate={{
                      scale: index === activeStep ? 1.2 : 1,
                    }}
                  >
                    {index + 1}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
