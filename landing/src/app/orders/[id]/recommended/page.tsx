'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import MatchScoreBadge from '@/components/ui/match-score-badge';
import { ChevronRight, Home, ArrowLeft, Star, MapPin, Shield, Award, UserPlus, Info } from 'lucide-react';
import api from '@/lib/api';

interface RecommendedSpecialist {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  initials: string;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  location: string;
  verified: boolean;
  matchScore: number;
  scoreBreakdown: {
    skills: number;
    rating: number;
    experience: number;
    location: number;
    price: number;
  };
  hourlyRate?: number;
  skills: string[];
}

const mockSpecialists: RecommendedSpecialist[] = [
  {
    id: '1',
    name: 'Алексей Петров',
    title: 'Мастер-отделочник',
    initials: 'АП',
    rating: 4.9,
    reviewCount: 87,
    completedJobs: 124,
    location: 'Москва, ЦАО',
    verified: true,
    matchScore: 95,
    scoreBreakdown: { skills: 98, rating: 95, experience: 92, location: 100, price: 88 },
    hourlyRate: 2500,
    skills: ['Ремонт квартир', 'Штукатурка', 'Покраска'],
  },
  {
    id: '2',
    name: 'Дмитрий Козлов',
    title: 'Электрик, сантехник',
    initials: 'ДК',
    rating: 4.8,
    reviewCount: 56,
    completedJobs: 89,
    location: 'Москва, СВАО',
    verified: true,
    matchScore: 82,
    scoreBreakdown: { skills: 85, rating: 90, experience: 78, location: 80, price: 75 },
    hourlyRate: 2200,
    skills: ['Электрика', 'Сантехника', 'Тёплый пол'],
  },
  {
    id: '3',
    name: 'Сергей Иванов',
    title: 'Плиточник',
    initials: 'СИ',
    rating: 4.7,
    reviewCount: 42,
    completedJobs: 67,
    location: 'Москва, ЮАО',
    verified: false,
    matchScore: 68,
    scoreBreakdown: { skills: 72, rating: 80, experience: 60, location: 55, price: 70 },
    hourlyRate: 1800,
    skills: ['Укладка плитки', 'Мозаика', 'Затирка'],
  },
  {
    id: '4',
    name: 'Николай Смирнов',
    title: 'Маляр-штукатур',
    initials: 'НС',
    rating: 4.5,
    reviewCount: 31,
    completedJobs: 45,
    location: 'Московская обл.',
    verified: true,
    matchScore: 45,
    scoreBreakdown: { skills: 50, rating: 60, experience: 40, location: 30, price: 45 },
    hourlyRate: 1500,
    skills: ['Покраска', 'Штукатурка', 'Шпаклёвка'],
  },
];

export default function RecommendedPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [specialists, setSpecialists] = useState<RecommendedSpecialist[]>(mockSpecialists);
  const [loading, setLoading] = useState(true);
  const [tooltipId, setTooltipId] = useState<string | null>(null);

  useEffect(() => {
    api.getRecommendedSpecialists(orderId)
      .then((res) => {
        if (res.data && Array.isArray(res.data) && (res.data as any[]).length > 0) {
          setSpecialists(res.data as RecommendedSpecialist[]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleInvite = (specialistId: string) => {
    setSpecialists((prev) =>
      prev.map((s) => (s.id === specialistId ? { ...s, invited: true } as any : s))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-orange-600 transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            Главная
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/orders" className="hover:text-orange-600 transition-colors">Заказы</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/orders/${orderId}`} className="hover:text-orange-600 transition-colors">Заказ #{orderId}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Рекомендации</span>
        </nav>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link href={`/orders/${orderId}`} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Рекомендованные специалисты</h1>
          </div>
          <p className="text-gray-600 ml-12">На основе ИИ-анализа требований заказа</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Загрузка...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specialists.map((specialist, index) => (
              <motion.div
                key={specialist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar + Score */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xl">
                      {specialist.initials}
                    </div>
                    <MatchScoreBadge score={specialist.matchScore} size="sm" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg text-gray-900">{specialist.name}</h3>
                      {specialist.verified && <Shield className="w-4 h-4 text-orange-500" />}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{specialist.title}</p>

                    <div className="flex items-center gap-3 text-sm mb-3">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{specialist.rating}</span>
                        <span className="text-gray-500">({specialist.reviewCount})</span>
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Award className="w-4 h-4" />
                        {specialist.completedJobs} работ
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      {specialist.location}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {specialist.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Score breakdown */}
                    <div className="relative mb-4">
                      <button
                        onClick={() => setTooltipId(tooltipId === specialist.id ? null : specialist.id)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-orange-600 transition-colors"
                      >
                        <Info className="w-3.5 h-3.5" />
                        Подробности совпадения
                      </button>
                      {tooltipId === specialist.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute left-0 top-6 z-10 bg-white border border-gray-200 rounded-xl p-4 shadow-lg w-64"
                        >
                          <h4 className="font-medium text-sm text-gray-900 mb-2">Разбор совпадения</h4>
                          {Object.entries(specialist.scoreBreakdown).map(([key, value]) => {
                            const labels: Record<string, string> = {
                              skills: 'Навыки',
                              rating: 'Рейтинг',
                              experience: 'Опыт',
                              location: 'Расположение',
                              price: 'Цена',
                            };
                            return (
                              <div key={key} className="flex items-center justify-between mb-1.5">
                                <span className="text-xs text-gray-600">{labels[key]}</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-20 bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-orange-500 h-1.5 rounded-full"
                                      style={{ width: `${value}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-medium w-8 text-right">{value}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      {specialist.hourlyRate && (
                        <span className="text-lg font-bold text-orange-600">
                          {specialist.hourlyRate.toLocaleString()} ₽/час
                        </span>
                      )}
                      <button
                        onClick={() => handleInvite(specialist.id)}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Пригласить
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
