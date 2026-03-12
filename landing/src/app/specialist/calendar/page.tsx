'use client'

import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { CalendarDays, Clock, CheckCircle2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function daysInMonth(date: Date) {
  return endOfMonth(date).getDate()
}

function weekdayIndex(date: Date) {
  // 0..6 Mon..Sun
  const d = date.getDay() // 0..6 Sun..Sat
  return (d + 6) % 7
}

function isoDate(y: number, m: number, d: number) {
  const mm = String(m + 1).padStart(2, '0')
  const dd = String(d).padStart(2, '0')
  return `${y}-${mm}-${dd}`
}

type DayStatus = 'free' | 'partial' | 'busy' | 'off'

export default function SpecialistCalendarPage() {
  const [cursor, setCursor] = useState(() => new Date())
  const [workHours, setWorkHours] = useState({ from: '09:00', to: '18:00' })
  const [statusByDay, setStatusByDay] = useState<Record<string, DayStatus>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('masterok_calendar_status')
        if (raw) return JSON.parse(raw)
      } catch {
        // ignore
      }
    }
    const now = new Date()
    const base: Record<string, DayStatus> = {}
    base[isoDate(now.getFullYear(), now.getMonth(), Math.min(2, daysInMonth(now)))] = 'busy'
    base[isoDate(now.getFullYear(), now.getMonth(), Math.min(5, daysInMonth(now)))] = 'partial'
    return base
  })

  // persist calendar + workHours
  function persist(nextStatus: Record<string, DayStatus>, nextHours?: { from: string; to: string }) {
    try {
      localStorage.setItem('masterok_calendar_status', JSON.stringify(nextStatus))
      if (nextHours) localStorage.setItem('masterok_calendar_hours', JSON.stringify(nextHours))
    } catch {
      // ignore
    }
  }

  // load work hours once
  useEffect(() => {
    try {
      const raw = localStorage.getItem('masterok_calendar_hours')
      if (raw) setWorkHours(JSON.parse(raw))
    } catch {
      // ignore
    }
  }, [])

  const monthLabel = useMemo(() => cursor.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }), [cursor])
  const grid = useMemo(() => {
    const first = startOfMonth(cursor)
    const offset = weekdayIndex(first)
    const total = daysInMonth(cursor)
    const cells: Array<{ day?: number }> = []
    for (let i = 0; i < offset; i++) cells.push({})
    for (let d = 1; d <= total; d++) cells.push({ day: d })
    while (cells.length % 7 !== 0) cells.push({})
    return cells
  }, [cursor])

  function cycleStatus(key: string) {
    const order: DayStatus[] = ['free', 'partial', 'busy', 'off']
    const current = statusByDay[key] ?? 'free'
    const next = order[(order.indexOf(current) + 1) % order.length]
    setStatusByDay((s) => {
      const nextState = { ...s, [key]: next }
      persist(nextState)
      return nextState
    })
  }

  function statusStyle(status: DayStatus) {
    switch (status) {
      case 'free':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800'
      case 'partial':
        return 'bg-amber-50 border-amber-200 text-amber-800'
      case 'busy':
        return 'bg-rose-50 border-rose-200 text-rose-800'
      case 'off':
        return 'bg-gray-100 border-gray-200 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Календарь специалиста</h1>
            <p className="text-gray-600">Отмечайте занятость — заказчики видят доступность, а вы получаете лучшее планирование.</p>
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50"
              onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
            >
              ←
            </button>
            <button
              className="px-4 py-2 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50"
              onClick={() => setCursor(new Date())}
            >
              Сегодня
            </button>
            <button
              className="px-4 py-2 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50"
              onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
            >
              →
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-5 h-5 text-primary-600" />
              <div className="font-bold capitalize">{monthLabel}</div>
              <div className="text-sm text-gray-500 ml-auto">Клик по дню: свободно → частично → занято → выходной</div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 mb-2">
              {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
                <div key={d} className="text-center font-semibold">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {grid.map((cell, idx) => {
                if (!cell.day) return <div key={idx} className="h-14" />
                const y = cursor.getFullYear()
                const m = cursor.getMonth()
                const key = isoDate(y, m, cell.day)
                const status = statusByDay[key] ?? 'free'
                return (
                  <button
                    key={idx}
                    onClick={() => cycleStatus(key)}
                    className={`h-14 rounded-xl border text-sm font-semibold transition-colors ${statusStyle(status)}`}
                    title={key}
                  >
                    {cell.day}
                  </button>
                )
              })}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary-600" />
              <div className="font-bold">Рабочие часы</div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <label className="text-sm">
                <div className="text-gray-600 mb-1">С</div>
                <input
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                  value={workHours.from}
                  onChange={(e) => {
                    const next = { ...workHours, from: e.target.value }
                    setWorkHours(next)
                    persist(statusByDay, next)
                  }}
                />
              </label>
              <label className="text-sm">
                <div className="text-gray-600 mb-1">До</div>
                <input
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                  value={workHours.to}
                  onChange={(e) => {
                    const next = { ...workHours, to: e.target.value }
                    setWorkHours(next)
                    persist(statusByDay, next)
                  }}
                />
              </label>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 mt-0.5" />
              <div className="text-sm text-emerald-900">
                Демо сохранения: в продакшене сохраняем расписание в профиль и используем для рекомендаций и уведомлений.
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}





