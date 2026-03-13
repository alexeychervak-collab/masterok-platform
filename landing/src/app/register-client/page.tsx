'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Phone, User, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function RegisterClientPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    agree: false,
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      const result = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      })
      if (result.success) {
        localStorage.setItem('masterok_role', 'client')
        router.push('/create-order')
      } else {
        setError(result.error || 'Ошибка регистрации')
      }
    } catch {
      setError('Ошибка соединения с сервером')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4 py-12">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            МастерОК
          </Link>
          <h1 className="text-3xl font-bold mt-4">Регистрация заказчика</h1>
          <p className="text-gray-600 mt-2">Создайте аккаунт, чтобы размещать проекты и общаться со специалистами</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Имя"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="+7 (999) 123-45-67"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Пароль"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                className="mt-1 w-5 h-5"
                checked={form.agree}
                onChange={(e) => setForm({ ...form, agree: e.target.checked })}
              />
              <span>
                Я принимаю{' '}
                <Link href="/terms" className="text-primary-600 hover:underline">
                  условия
                </Link>{' '}
                и{' '}
                <Link href="/privacy" className="text-primary-600 hover:underline">
                  политику
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting || !form.agree}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Создаём...
                </>
              ) : (
                <>
                  Создать аккаунт <CheckCircle2 className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        <div className="mt-6 text-center text-sm text-gray-600">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-primary-600 font-semibold hover:underline">
            Войти
          </Link>
        </div>
      </div>
    </div>
  )
}





