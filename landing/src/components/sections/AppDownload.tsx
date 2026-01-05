'use client'

import { motion } from 'framer-motion'
import { Smartphone, Star, Download, Bell, MessageCircle, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  { icon: Bell, text: 'Push-уведомления о заказах' },
  { icon: MessageCircle, text: 'Чат со специалистом' },
  { icon: Calendar, text: 'Удобное расписание' },
  { icon: Star, text: 'Отзывы и рейтинги' },
]

export function AppDownload() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[100px]" />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <Smartphone className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-medium text-white/80">Мобильное приложение</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Все специалисты
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                в твоём кармане
              </span>
            </h2>
            
            <p className="text-lg text-white/70 mb-8 max-w-md">
              Скачай приложение и находи лучших мастеров в любое время. 
              Удобно, быстро, без лишних звонков.
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <div className="p-2 rounded-lg bg-white/10">
                    <feature.icon className="h-5 w-5 text-violet-400" />
                  </div>
                  <span className="text-white/80 text-sm">{feature.text}</span>
                </motion.div>
              ))}
            </div>
            
            {/* Download buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="xl"
                className="bg-white text-gray-900 hover:bg-white/90 gap-3"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                App Store
              </Button>
              <Button
                size="xl"
                className="bg-white text-gray-900 hover:bg-white/90 gap-3"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
                </svg>
                Google Play
              </Button>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/10">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div>
                <p className="text-white font-semibold">4.9 из 5</p>
                <p className="text-white/50 text-sm">12,847 оценок</p>
              </div>
            </div>
          </motion.div>
          
          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative hidden lg:flex justify-center"
          >
            <div className="relative">
              {/* Phone frame */}
              <div className="relative w-[280px] h-[580px] bg-gray-900 rounded-[50px] p-3 shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10" />
                <div className="w-full h-full bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-[40px] overflow-hidden">
                  {/* App content mock */}
                  <div className="p-6 pt-12">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-white/60 text-xs">Добро пожаловать</p>
                        <p className="text-white font-bold text-lg">YODO</p>
                      </div>
                      <div className="w-10 h-10 bg-white/20 rounded-full" />
                    </div>
                    
                    {/* Search */}
                    <div className="bg-white/20 rounded-2xl p-4 mb-6">
                      <p className="text-white/80 text-sm">Что вам нужно?</p>
                    </div>
                    
                    {/* Categories */}
                    <div className="grid grid-cols-4 gap-3 mb-6">
                      {['⚡', '🔧', '🧹', '📚'].map((emoji, i) => (
                        <div key={i} className="aspect-square bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                          {emoji}
                        </div>
                      ))}
                    </div>
                    
                    {/* Specialist card */}
                    <div className="bg-white rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center text-white font-bold">
                          А
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">Алексей П.</p>
                          <p className="text-gray-500 text-sm">Электрик</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-gray-900">4.9</span>
                        </div>
                      </div>
                      <div className="bg-violet-100 text-violet-700 rounded-xl py-2 text-center text-sm font-semibold">
                        Связаться
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-8 -left-16 bg-white rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-emerald-500" />
                  <span className="font-semibold text-gray-900">50K+</span>
                </div>
                <p className="text-xs text-gray-500">скачиваний</p>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -right-12 bg-white rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-violet-500" />
                  <span className="font-semibold text-gray-900">Чат</span>
                </div>
                <p className="text-xs text-gray-500">в реальном времени</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}




