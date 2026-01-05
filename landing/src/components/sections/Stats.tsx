'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, Briefcase, Star, MapPin } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: 15000,
    suffix: '+',
    label: 'Специалистов',
    color: 'from-primary to-purple-600',
  },
  {
    icon: Briefcase,
    value: 50000,
    suffix: '+',
    label: 'Выполненных заказов',
    color: 'from-pink-500 to-rose-600',
  },
  {
    icon: Star,
    value: 4.9,
    suffix: '',
    label: 'Средний рейтинг',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: MapPin,
    value: 150,
    suffix: '+',
    label: 'Городов России',
    color: 'from-green-500 to-emerald-600',
  },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const steps = 60
      const increment = value / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(current)
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {value < 10 ? count.toFixed(1) : Math.floor(count).toLocaleString('ru-RU')}
      {suffix}
    </span>
  )
}

export function Stats() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div
                className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} mb-4 shadow-lg`}
              >
                <stat.icon className="h-7 w-7 text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-display font-bold mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}




