'use client'

import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useState } from 'react'
import { User, Wrench, MapPin, Clock, GraduationCap, Shield, Save, Plus, X, Star, Bell, Eye } from 'lucide-react'

const allSkills = [
  'Электромонтаж', 'Сантехника', 'Плиточные работы', 'Малярные работы', 'Штукатурка',
  'Дизайн интерьера', 'Кровельные работы', 'Фасадные работы', 'Утепление', 'Демонтаж',
  'Бетонные работы', 'Сварка', 'Столярные работы', 'Установка окон', 'Натяжные потолки',
  'Ландшафтный дизайн', 'Мебель на заказ', 'Клининг', 'Инженерные сети', 'Строительство домов',
]

export default function SpecialistSettingsPage() {
  const [profile, setProfile] = useState({
    title: 'Мастер-универсал по ремонту',
    description: 'Выполняю все виды ремонтных и отделочных работ. Опыт 12 лет. Работаю аккуратно, по договору. Фотоотчёт на каждом этапе. Гарантия 2 года на все виды работ.',
    city: 'Москва',
    address: 'Выезд по всей Москве и МО',
    experience: 12,
    education: 'Строительный колледж №26, курсы повышения квалификации',
    workSchedule: 'Пн-Сб 8:00-20:00',
    responseTime: 30,
  })
  const [skills, setSkills] = useState(['Электромонтаж', 'Плиточные работы', 'Малярные работы', 'Штукатурка'])
  const [isAvailable, setIsAvailable] = useState(true)
  const [notifications, setNotifications] = useState({ newOrders: true, messages: true, reviews: true, promo: false })
  const [saved, setSaved] = useState(false)

  const availableSkills = allSkills.filter(s => !skills.includes(s))

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Настройки профиля</h1>
            <p className="text-sm text-gray-600">Заполните профиль на 100% — это увеличивает конверсию откликов в 3 раза.</p>
          </div>
          <button onClick={handleSave} className={`px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all ${saved ? 'bg-green-600 text-white' : 'bg-primary-600 text-white hover:bg-primary-700'}`}>
            {saved ? <><Star className="w-4 h-4" /> Сохранено!</> : <><Save className="w-4 h-4" /> Сохранить</>}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4"><User className="w-5 h-5 text-primary-600" /><h2 className="font-bold text-gray-900">Основная информация</h2></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Специализация</label>
                  <input value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Опыт (лет)</label>
                  <input type="number" value={profile.experience} onChange={(e) => setProfile({ ...profile, experience: +e.target.value })} className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">О себе</label>
                  <textarea value={profile.description} onChange={(e) => setProfile({ ...profile, description: e.target.value })} rows={4} className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
                  <div className="text-xs text-gray-400 mt-1">{profile.description.length}/500</div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4"><MapPin className="w-5 h-5 text-primary-600" /><h2 className="font-bold text-gray-900">Локация и график</h2></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Город</label>
                  <select value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                    {['Москва', 'Санкт-Петербург', 'Казань', 'Новосибирск', 'Екатеринбург', 'Краснодар', 'Нижний Новгород', 'Самара', 'Ростов-на-Дону'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Адрес / район</label>
                  <input value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">График работы</label>
                  <input value={profile.workSchedule} onChange={(e) => setProfile({ ...profile, workSchedule: e.target.value })} className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Время отклика (мин)</label>
                  <input type="number" value={profile.responseTime} onChange={(e) => setProfile({ ...profile, responseTime: +e.target.value })} className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4"><Wrench className="w-5 h-5 text-primary-600" /><h2 className="font-bold text-gray-900">Навыки и компетенции</h2></div>
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map(s => (
                  <span key={s} className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                    {s}
                    <button onClick={() => setSkills(skills.filter(x => x !== s))} className="hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
                  </span>
                ))}
              </div>
              {availableSkills.length > 0 && (
                <>
                  <div className="text-sm text-gray-600 mb-2">Добавить:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {availableSkills.slice(0, 10).map(s => (
                      <button key={s} onClick={() => setSkills([...skills, s])} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary-100 hover:text-primary-700 transition-colors">
                        <Plus className="w-3 h-3" /> {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4"><GraduationCap className="w-5 h-5 text-primary-600" /><h2 className="font-bold text-gray-900">Образование и сертификаты</h2></div>
              <textarea value={profile.education} onChange={(e) => setProfile({ ...profile, education: e.target.value })} rows={3} placeholder="Укажите образование, курсы, сертификаты..." className="w-full px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
            </div>

            {/* Portfolio */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4"><Clock className="w-5 h-5 text-primary-600" /><h2 className="font-bold text-gray-900">Портфолио</h2></div>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                    <img src={`https://picsum.photos/seed/portfolio${i}/200/200`} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
                <button className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-primary-400 hover:bg-primary-50">
                  <Plus className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Добавить</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4"><Eye className="w-5 h-5 text-primary-600" /><h2 className="font-bold text-gray-900">Доступность</h2></div>
              <button onClick={() => setIsAvailable(!isAvailable)} className={`w-full py-3 rounded-xl font-semibold transition-colors ${isAvailable ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {isAvailable ? '✓ Принимаю заказы' : '✕ Не принимаю заказы'}
              </button>
              <p className="text-xs text-gray-500 mt-2">{isAvailable ? 'Профиль виден в поиске.' : 'Вас не видно в поиске.'}</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4"><Bell className="w-5 h-5 text-primary-600" /><h2 className="font-bold text-gray-900">Уведомления</h2></div>
              <div className="space-y-3">
                {([['newOrders', 'Новые заказы'], ['messages', 'Сообщения'], ['reviews', 'Отзывы'], ['promo', 'Акции']] as const).map(([key, label]) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">{label}</span>
                    <div onClick={() => setNotifications({ ...notifications, [key]: !notifications[key] })} className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${notifications[key] ? 'bg-primary-600' : 'bg-gray-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notifications[key] ? 'translate-x-5' : 'translate-x-1'}`} />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4"><Shield className="w-5 h-5 text-primary-600" /><h2 className="font-bold text-gray-900">Верификация</h2></div>
              <div className="space-y-3">
                <div className="flex items-center gap-2"><Badge className="bg-green-100 text-green-700 border-green-200">✓</Badge><span className="text-sm">Email подтверждён</span></div>
                <div className="flex items-center gap-2"><Badge className="bg-green-100 text-green-700 border-green-200">✓</Badge><span className="text-sm">Телефон подтверждён</span></div>
                <div className="flex items-center gap-2"><Badge className="bg-amber-100 text-amber-700 border-amber-200">⏳</Badge><span className="text-sm">Паспорт на проверке</span></div>
              </div>
              <p className="text-xs text-gray-500 mt-3">Верифицированные получают на 40% больше откликов.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-3">Быстрые ссылки</h2>
              <div className="space-y-2">
                <Link href="/specialist/dashboard" className="block text-sm text-primary-600 hover:underline">Панель управления →</Link>
                <Link href="/specialist/finances" className="block text-sm text-primary-600 hover:underline">Финансы →</Link>
                <Link href="/specialist/reviews" className="block text-sm text-primary-600 hover:underline">Мои отзывы →</Link>
                <Link href="/specialist/calendar" className="block text-sm text-primary-600 hover:underline">Календарь →</Link>
                <Link href="/settings" className="block text-sm text-primary-600 hover:underline">Общие настройки →</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
