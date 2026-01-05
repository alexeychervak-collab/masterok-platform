'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { 
  Shield, Zap, Award, Clock, MessageCircle, Star, 
  CreditCard, HeadphonesIcon, TrendingUp, Users 
} from 'lucide-react';
import AnimatedCounter from '@/components/ui/animated-counter';

const features = [
  {
    icon: Shield,
    title: 'Проверенные специалисты',
    description: 'Все мастера проходят верификацию документов и проверку квалификации',
    gradient: 'from-blue-500 to-cyan-500',
    stat: '100%',
    statLabel: 'проверенных',
  },
  {
    icon: Zap,
    title: 'Быстрый отклик',
    description: 'Получите первые предложения от специалистов в течение 15 минут',
    gradient: 'from-yellow-500 to-orange-500',
    stat: '15',
    statLabel: 'минут',
  },
  {
    icon: Award,
    title: 'Гарантия качества',
    description: 'Гарантия на все работы и возврат средств при неудовлетворительном результате',
    gradient: 'from-purple-500 to-pink-500',
    stat: '2',
    statLabel: 'года',
  },
  {
    icon: CreditCard,
    title: 'Безопасные платежи',
    description: 'Оплата через защищенный сервис, деньги переводятся только после выполнения работ',
    gradient: 'from-green-500 to-emerald-500',
    stat: '100%',
    statLabel: 'безопасно',
  },
  {
    icon: MessageCircle,
    title: 'Онлайн-чат',
    description: 'Общайтесь со специалистами напрямую в удобном чате с историей сообщений',
    gradient: 'from-indigo-500 to-blue-500',
    stat: '24/7',
    statLabel: 'доступен',
  },
  {
    icon: HeadphonesIcon,
    title: 'Поддержка 24/7',
    description: 'Наша команда всегда на связи и готова помочь решить любую проблему',
    gradient: 'from-red-500 to-rose-500',
    stat: '24/7',
    statLabel: 'поддержка',
  },
];

const stats = [
  { value: 50000, suffix: '+', label: 'Специалистов', icon: Users },
  { value: 2000000, suffix: '+', label: 'Выполненных заказов', icon: Award },
  { value: 4.9, decimals: 1, label: 'Средний рейтинг', icon: Star },
  { value: 98, suffix: '%', label: 'Довольных клиентов', icon: TrendingUp },
];

export default function InteractiveFeatures() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="py-20 md:py-32 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-teal-50" />
      <motion.div
        style={{ y, opacity }}
        className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-bl from-teal-200 to-transparent rounded-full blur-3xl opacity-30"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]), opacity }}
        className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200 to-transparent rounded-full blur-3xl opacity-30"
      />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Почему выбирают <span className="gradient-text">YoDo</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Современная платформа с максимальной защитой и удобством для клиентов и специалистов
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center"
            >
              <div className="inline-flex p-3 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl mb-4">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                <AnimatedCounter 
                  end={stat.value} 
                  suffix={stat.suffix} 
                  decimals={stat.decimals}
                />
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="h-full bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-300 group-hover:shadow-2xl overflow-hidden">
                {/* Gradient Orb */}
                <motion.div
                  className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${feature.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                />

                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`inline-flex p-4 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-6 shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>

                {/* Stat Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-50 to-blue-50 rounded-full">
                  <span className="text-2xl font-bold gradient-text">{feature.stat}</span>
                  <span className="text-sm text-gray-600">{feature.statLabel}</span>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white rounded-full shadow-lg border border-gray-100">
            <Shield className="w-6 h-6 text-teal-600" />
            <span className="text-gray-700">
              <strong className="text-teal-600">100% безопасность</strong> — Ваши данные и платежи надежно защищены
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



