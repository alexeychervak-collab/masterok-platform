'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Briefcase, Users, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-600">YoDo</span>
            <Sparkles className="w-5 h-5 text-primary-600" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">Регистрация</h1>
          <p className="text-gray-600 mt-2">Выберите роль — всё остальное настроим автоматически</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div whileHover={{ y: -6 }} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white mb-5">
              <Users className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold mb-2">Я заказчик</h2>
            <p className="text-gray-600 mb-6">
              Найду специалиста, обсужу проект в чате, оплачу через безопасную сделку (эскроу).
            </p>
            <Link
              href="/register-client"
              className="inline-flex items-center gap-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors px-5 py-3 rounded-xl"
            >
              Продолжить <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -6 }} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white mb-5">
              <Briefcase className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold mb-2">Я специалист</h2>
            <p className="text-gray-600 mb-6">
              Заполню профиль, загружу портфолио, начну получать заказы + уведомления по компетенциям.
            </p>
            <Link
              href="/register-specialist"
              className="inline-flex items-center gap-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors px-5 py-3 rounded-xl"
            >
              Стать специалистом <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-primary-600 font-semibold hover:underline">
            Войти
          </Link>
        </div>

        <div className="mt-6 bg-white/70 backdrop-blur rounded-2xl border border-gray-100 p-5 text-sm text-gray-700 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5" />
          <div>
            <div className="font-semibold mb-1">Безопасная сделка</div>
            <div className="text-gray-600">
              Деньги резервируются в эскроу до подтверждения результата — защищаем и заказчика, и специалиста.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}





