'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Phone, Lock, ArrowRight, ShieldCheck, Briefcase, Users } from 'lucide-react'

type Role = 'client' | 'specialist'

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>('client')
  const [mode, setMode] = useState<'email' | 'sms'>('email')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const canVerify = useMemo(() => phone.trim().length >= 10 && code.trim().length >= 4, [phone, code])

  useEffect(() => {
    // читаем role из query без useSearchParams, чтобы не ломать prerender
    try {
      const params = new URLSearchParams(window.location.search)
      const qp = params.get('role')
      if (qp === 'specialist' || qp === 'client') setRole(qp)
    } catch {
      // ignore
    }
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // TODO: backend auth (JWT)
      localStorage.setItem('masterok_role', role)
      localStorage.setItem('masterok_user', JSON.stringify({ role, email, phone }))
      await new Promise((r) => setTimeout(r, 600))
      router.push(role === 'specialist' ? '/specialist/dashboard' : '/create-order')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function sendSms() {
    // TODO: backend SMS provider (SMS.ru/Twilio/etc)
    alert('Код отправлен (демо). Введите любой 4-6 значный код.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4 py-12">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            МастерОК
          </Link>
          <h1 className="text-3xl font-bold mt-4">Вход</h1>
          <p className="text-gray-600 mt-2">Войдите как заказчик или специалист</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Role switch */}
          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`px-4 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 ${
                role === 'client' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              <Users className="w-4 h-4" /> Заказчик
            </button>
            <button
              type="button"
              onClick={() => setRole('specialist')}
              className={`px-4 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 ${
                role === 'specialist' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              <Briefcase className="w-4 h-4" /> Специалист
            </button>
          </div>

          {/* Mode switch */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setMode('email')}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm border transition-colors ${
                mode === 'email' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Email + пароль
            </button>
            <button
              type="button"
              onClick={() => setMode('sms')}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm border transition-colors ${
                mode === 'sms' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              SMS-код
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === 'email' ? (
              <>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="+7 (999) 123-45-67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={sendSms}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Отправить SMS-код
                </button>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Код из SMS (демо)"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting || (mode === 'sms' ? !canVerify : false)}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Входим...
                </>
              ) : (
                <>
                  Войти <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Нет аккаунта?{' '}
            <Link href="/register" className="text-primary-600 font-semibold hover:underline">
              Регистрация
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}


