'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Heart, Trash2, Star, MapPin, Award, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import FavoritesButton from '@/components/ui/favorites-button';

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
  avatar: string;
  verified: boolean;
  topRated: boolean;
}

// Mock data (in real app, fetch from API)
const mockSpecialists: Record<string, Specialist> = {
  '1': {
    id: '1',
    name: 'Даниил Крахин',
    title: 'Профессиональный архитектор и проектировщик',
    rating: 4.95,
    reviewCount: 127,
    completedJobs: 200,
    fixedPrice: 150000,
    location: 'Москва',
    avatar: 'ДК',
    verified: true,
    topRated: true,
  },
  '2': {
    id: '2',
    name: 'Алексей Иванов',
    title: 'Мастер по ремонту и отделке',
    rating: 4.89,
    reviewCount: 89,
    completedJobs: 156,
    hourlyRate: 2500,
    location: 'Москва',
    avatar: 'АИ',
    verified: true,
    topRated: true,
  },
  '3': {
    id: '3',
    name: 'Михаил Петров',
    title: 'Электрик с опытом 10+ лет',
    rating: 4.92,
    reviewCount: 64,
    completedJobs: 98,
    hourlyRate: 1800,
    location: 'Москва',
    avatar: 'МП',
    verified: true,
    topRated: false,
  },
};

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Specialist[]>([]);

  useEffect(() => {
    loadFavorites();
    
    // Listen for favorites changes
    const handleFavoritesChanged = () => {
      loadFavorites();
    };
    
    window.addEventListener('favoritesChanged', handleFavoritesChanged);
    return () => window.removeEventListener('favoritesChanged', handleFavoritesChanged);
  }, []);

  const loadFavorites = () => {
    const stored = localStorage.getItem('masterok_favorites');
    if (stored) {
      const ids = JSON.parse(stored);
      setFavoriteIds(ids);
      
      // Get specialist data (in real app, fetch from API)
      const specialists = ids
        .map((id: string) => mockSpecialists[id])
        .filter(Boolean);
      setFavorites(specialists);
    }
  };

  const clearAllFavorites = () => {
    if (confirm('Удалить всех специалистов из избранного?')) {
      localStorage.removeItem('masterok_favorites');
      setFavoriteIds([]);
      setFavorites([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Избранное</h1>
              <p className="text-gray-600">
                {favorites.length > 0 
                  ? `Сохранено специалистов: ${favorites.length}` 
                  : 'У вас пока нет избранных специалистов'
                }
              </p>
            </div>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={clearAllFavorites}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Очистить все
            </button>
          )}
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((specialist, index) => (
              <motion.div
                key={specialist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  {/* Favorite Button */}
                  <div className="absolute top-4 right-4 z-10">
                    <FavoritesButton specialistId={specialist.id} />
                  </div>

                  <Link href={`/specialists/${specialist.id}`}>
                    <div className="flex flex-col items-center text-center mb-4">
                      {/* Avatar */}
                      <div className="relative mb-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                          {specialist.avatar}
                        </div>
                        {specialist.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                            <Shield className="w-4 h-4 text-teal-600" />
                          </div>
                        )}
                      </div>

                      {/* Name and Title */}
                      <h3 className="font-semibold text-lg text-gray-900 mb-1 flex items-center gap-2">
                        {specialist.name}
                        {specialist.topRated && (
                          <Award className="w-4 h-4 text-amber-500" />
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{specialist.title}</p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{specialist.rating}</span>
                          <span className="text-gray-500">({specialist.reviewCount})</span>
                        </div>
                        <div className="text-gray-600">
                          {specialist.completedJobs} заказов
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                        <MapPin className="w-4 h-4" />
                        {specialist.location}
                      </div>

                      {/* Price */}
                      <div className="text-center py-3 bg-teal-50 rounded-lg w-full">
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
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-6">
              <Heart className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Пока нет избранных
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Добавляйте специалистов в избранное, чтобы быстро находить их позже
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Найти специалиста
            </Link>
          </div>
        )}

        {/* Tips */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              💡 Полезные советы
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-teal-600 mt-1">✓</span>
                <span>Сохраняйте понравившихся специалистов, чтобы сравнить их позже</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 mt-1">✓</span>
                <span>Нажмите на карточку, чтобы посмотреть полный профиль</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 mt-1">✓</span>
                <span>Свяжитесь с несколькими специалистами для лучшего предложения</span>
              </li>
            </ul>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}



