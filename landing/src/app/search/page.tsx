'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import SmartSearch from '@/components/ui/smart-search';
import { 
  SlidersHorizontal, Star, MapPin, Clock, TrendingUp, 
  Grid3x3, List, ChevronDown, Award, Shield, Zap 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { specialistsMock, projectSections } from '@/lib/mock-data';

interface Specialist {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  hourlyRate?: number;
  fixedPrice?: number;
  location: string;
  avatar: string; // initials fallback
  avatarUrl?: string;
  verified: boolean;
  topRated: boolean;
  responseTime: string;
  skills: string[];
  availability: 'online' | 'offline' | 'busy';
  description: string;
}

const mockSpecialists: Specialist[] = specialistsMock.map((s) => ({
  id: s.id,
  name: s.name,
  title: s.title,
  rating: s.rating,
  reviewCount: s.reviewCount,
  completedJobs: s.completedJobs,
  hourlyRate: s.hourlyRate,
  fixedPrice: s.fixedPrice,
  location: s.location,
  avatar: s.initials,
  avatarUrl: s.avatarUrl,
  verified: s.verified,
  topRated: s.topRated,
  responseTime: s.responseTime,
  skills: s.skills,
  availability: s.availability,
  description: s.description,
}));

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';

  const [specialists, setSpecialists] = useState<Specialist[]>(mockSpecialists);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    minRating: 0,
    maxPrice: Infinity,
    verified: 'any' as 'any' | 'yes' | 'no',
    hasReviews: 'any' as 'any' | 'yes' | 'no',
    experience: 'any' as 'any' | '1-3' | '3-5' | '5-10' | '10+',
    direction: 'any' as
      | 'any'
      | 'Проектирование'
      | 'ПТО'
      | 'Смета'
      | 'Строительство'
      | 'Ремонт'
      | 'Дизайн'
      | 'Инженерные сети',
    stage: 'any' as 'any' | 'Проектная документация' | 'Рабочая документация',
    section: 'any' as 'any' | string,
    topRated: false,
    availability: 'all' as 'all' | 'online' | 'offline' | 'busy',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort specialists
  useEffect(() => {
    let filtered = mockSpecialists.filter(s => {
      if (filters.minRating && s.rating < filters.minRating) return false;
      if (filters.verified === 'yes' && !s.verified) return false;
      if (filters.verified === 'no' && s.verified) return false;
      if (filters.hasReviews === 'yes' && s.reviewCount <= 0) return false;
      if (filters.hasReviews === 'no' && s.reviewCount > 0) return false;

      if (filters.experience !== 'any') {
        const years = specialistsMock.find((x) => x.id === s.id)?.experienceYears ?? 0;
        if (filters.experience === '1-3' && !(years >= 1 && years <= 3)) return false;
        if (filters.experience === '3-5' && !(years >= 3 && years <= 5)) return false;
        if (filters.experience === '5-10' && !(years >= 5 && years <= 10)) return false;
        if (filters.experience === '10+' && !(years >= 10)) return false;
      }

      if (filters.direction !== 'any') {
        const dir = specialistsMock.find((x) => x.id === s.id)?.direction;
        if (dir !== filters.direction) return false;
      }

      // ОФ_Поиск: стадия/раздел только если проектирование
      if (filters.direction === 'Проектирование') {
        if (filters.section !== 'any') {
          const sectionLower = String(filters.section).toLowerCase();
          const ok = s.skills.some((sk) => sk.toLowerCase().includes(sectionLower));
          if (!ok) return false;
        }
        // stage пока не кодируем в данных; оставлено под backend
      }

      if (filters.topRated && !s.topRated) return false;
      if (filters.availability !== 'all' && s.availability !== filters.availability) return false;
      if (filters.maxPrice !== Infinity) {
        const price = s.hourlyRate || s.fixedPrice || 0;
        if (price > filters.maxPrice) return false;
      }
      
      // Search in name, title, skills
      if (query) {
        const searchLower = query.toLowerCase();
        return (
          s.name.toLowerCase().includes(searchLower) ||
          s.title.toLowerCase().includes(searchLower) ||
          s.skills.some(skill => skill.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });

    // Sort
    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price_low') {
      filtered.sort((a, b) => {
        const priceA = a.hourlyRate || a.fixedPrice || 0;
        const priceB = b.hourlyRate || b.fixedPrice || 0;
        return priceA - priceB;
      });
    } else if (sortBy === 'price_high') {
      filtered.sort((a, b) => {
        const priceA = a.hourlyRate || a.fixedPrice || 0;
        const priceB = b.hourlyRate || b.fixedPrice || 0;
        return priceB - priceA;
      });
    } else if (sortBy === 'reviews') {
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    setSpecialists(filtered);
  }, [query, filters, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Search Bar */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <SmartSearch 
            placeholder="Уточните поиск..."
            showFilters={true}
          />
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className={`
            ${showFilters ? 'block' : 'hidden'} lg:block
            w-full lg:w-64 flex-shrink-0
          `}>
            <div className="sticky top-24 space-y-4">
              {/* Filter Header */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    Фильтры
                  </h3>
                  <button
                    onClick={() => setFilters({
                      minRating: 0,
                      maxPrice: Infinity,
                      verified: 'any',
                      hasReviews: 'any',
                      experience: 'any',
                      direction: 'any',
                      stage: 'any',
                      section: 'any',
                      topRated: false,
                      availability: 'all',
                    })}
                    className="text-xs text-teal-600 hover:text-teal-700"
                  >
                    Сбросить
                  </button>
                </div>

                {/* Rating Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Минимальный рейтинг
                  </label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value={0}>Любой</option>
                    <option value={4}>4+ звезды</option>
                    <option value={4.5}>4.5+ звезды</option>
                    <option value={4.8}>4.8+ звезды</option>
                  </select>
                </div>

                {/* ОФ_Поиск: Верифицирован Да/Нет */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Верифицирован</label>
                  <select
                    value={filters.verified}
                    onChange={(e) => setFilters({ ...filters, verified: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="any">Любой</option>
                    <option value="yes">Да</option>
                    <option value="no">Нет</option>
                  </select>
                </div>

                {/* ОФ_Поиск: Отзывы Да/Нет */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Отзывы</label>
                  <select
                    value={filters.hasReviews}
                    onChange={(e) => setFilters({ ...filters, hasReviews: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="any">Любые</option>
                    <option value="yes">Да</option>
                    <option value="no">Нет</option>
                  </select>
                </div>

                {/* Price Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Максимальная цена
                  </label>
                  <select
                    value={filters.maxPrice === Infinity ? 'all' : filters.maxPrice}
                    onChange={(e) => setFilters({ 
                      ...filters, 
                      maxPrice: e.target.value === 'all' ? Infinity : Number(e.target.value) 
                    })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="all">Любая</option>
                    <option value={5000}>До 5,000 ₽</option>
                    <option value={20000}>До 20,000 ₽</option>
                    <option value={50000}>До 50,000 ₽</option>
                    <option value={100000}>До 100,000 ₽</option>
                  </select>
                </div>

                {/* ОФ_Поиск: Опыт в профессии */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Опыт в профессии</label>
                  <select
                    value={filters.experience}
                    onChange={(e) => setFilters({ ...filters, experience: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="any">Любой</option>
                    <option value="1-3">1–3</option>
                    <option value="3-5">3–5</option>
                    <option value="5-10">5–10</option>
                    <option value="10+">10+</option>
                  </select>
                </div>

                {/* ОФ_Поиск: Направление */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Направление</label>
                  <select
                    value={filters.direction}
                    onChange={(e) => setFilters({ ...filters, direction: e.target.value as any, stage: 'any', section: 'any' })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="any">Любое</option>
                    <option value="Проектирование">Проектирование</option>
                    <option value="ПТО">ПТО</option>
                    <option value="Смета">Смета</option>
                    <option value="Строительство">Строительство</option>
                    <option value="Ремонт">Ремонт</option>
                    <option value="Дизайн">Дизайн</option>
                    <option value="Инженерные сети">Инженерные сети</option>
                  </select>
                </div>

                {/* ОФ_Поиск: Стадия/Раздел только если проектирование */}
                {filters.direction === 'Проектирование' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Стадия</label>
                      <select
                        value={filters.stage}
                        onChange={(e) => setFilters({ ...filters, stage: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="any">Любая</option>
                        <option value="Проектная документация">Проектная документация</option>
                        <option value="Рабочая документация">Рабочая документация</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Раздел</label>
                      <select
                        value={filters.section}
                        onChange={(e) => setFilters({ ...filters, section: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="any">Любой</option>
                        {projectSections.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* Availability */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Доступность
                  </label>
                  <select
                    value={filters.availability}
                    onChange={(e) => setFilters({ ...filters, availability: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="all">Все</option>
                    <option value="online">Онлайн</option>
                    <option value="offline">Оффлайн</option>
                    <option value="busy">Занят</option>
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.topRated}
                      onChange={(e) => setFilters({ ...filters, topRated: e.target.checked })}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700 flex items-center gap-1">
                      <Award className="w-4 h-4 text-amber-500" />
                      Топ специалисты
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {query ? `Результаты по запросу "${query}"` : 'Все специалисты'}
                </h1>
                <p className="text-sm text-gray-600">
                  Найдено специалистов: <span className="font-semibold">{specialists.length}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="relevance">По релевантности</option>
                  <option value="rating">По рейтингу</option>
                  <option value="reviews">По отзывам</option>
                  <option value="price_low">Цена: по возрастанию</option>
                  <option value="price_high">Цена: по убыванию</option>
                </select>

                {/* View Mode */}
                <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden px-4 py-2 bg-teal-600 text-white rounded-lg flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Фильтры
                </button>
              </div>
            </div>

            {/* Specialists Grid/List */}
            {specialists.length > 0 ? (
              <div className={`
                ${viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
                  : 'space-y-4'
                }
              `}>
                {specialists.map((specialist, index) => (
                  <motion.div
                    key={specialist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/specialists/${specialist.id}`}>
                      <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-teal-200">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className={`
                            flex-shrink-0 w-16 h-16 rounded-xl 
                            bg-gradient-to-br from-teal-400 to-teal-600
                            flex items-center justify-center text-white font-bold text-xl
                            ${specialist.availability === 'online' ? 'ring-4 ring-green-100' : ''}
                          `}>
                            {specialist.avatarUrl ? (
                              <img
                                src={specialist.avatarUrl}
                                alt={specialist.name}
                                className="w-full h-full object-cover rounded-xl"
                                loading="lazy"
                              />
                            ) : (
                              specialist.avatar
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg text-gray-900 mb-1 flex items-center gap-2">
                                  {specialist.name}
                                  {specialist.verified && (
                                    <Shield className="w-4 h-4 text-teal-600" />
                                  )}
                                  {specialist.topRated && (
                                    <Award className="w-4 h-4 text-amber-500" />
                                  )}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">{specialist.title}</p>
                              </div>
                              
                              {specialist.availability === 'online' && (
                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                                  Онлайн
                                </Badge>
                              )}
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 mb-3 text-sm">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold">{specialist.rating}</span>
                                <span className="text-gray-500">({specialist.reviewCount})</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <Award className="w-4 h-4" />
                                {specialist.completedJobs} заказов
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <Clock className="w-4 h-4" />
                                {specialist.responseTime}
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {specialist.description}
                            </p>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {specialist.skills.slice(0, 3).map((skill, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{specialist.location}</span>
                              </div>
                              <div className="text-right">
                                {specialist.hourlyRate && (
                                  <div className="text-lg font-bold text-teal-600">
                                    {specialist.hourlyRate.toLocaleString()} ₽/час
                                  </div>
                                )}
                                {specialist.fixedPrice && (
                                  <div className="text-lg font-bold text-teal-600">
                                    от {specialist.fixedPrice.toLocaleString()} ₽
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ничего не найдено
                </h3>
                <p className="text-gray-600 mb-6">
                  Попробуйте изменить фильтры или поисковый запрос
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      minRating: 0,
                      maxPrice: Infinity,
                      verified: 'any',
                      hasReviews: 'any',
                      experience: 'any',
                      direction: 'any',
                      stage: 'any',
                      section: 'any',
                      topRated: false,
                      availability: 'all',
                    });
                  }}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Сбросить фильтры
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка...</div>}>
      <SearchContent />
    </Suspense>
  );
}



