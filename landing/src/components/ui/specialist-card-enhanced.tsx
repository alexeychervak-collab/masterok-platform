'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Briefcase, 
  Heart, 
  MessageCircle,
  CheckCircle2,
  TrendingUp,
  Zap,
  Award,
  Clock
} from 'lucide-react';

interface SpecialistCardProps {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  hourlyRate: number;
  location: string;
  avatar?: string;
  verified?: boolean;
  topSpecialist?: boolean;
  promo?: {
    type: 'discount' | 'new' | 'featured';
    text: string;
    badge?: string;
  };
  availableToday?: boolean;
  responseTime?: string;
}

export default function SpecialistCardEnhanced({
  id,
  name,
  specialty,
  rating,
  reviewsCount,
  completedJobs,
  hourlyRate,
  location,
  avatar,
  verified = false,
  topSpecialist = false,
  promo,
  availableToday = false,
  responseTime = '< 1 ч'
}: SpecialistCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    
    // Save to localStorage
    const favorites = JSON.parse(localStorage.getItem('masterok_favorites') || '[]');
    if (isFavorite) {
      const updated = favorites.filter((fav: any) => fav.id !== id);
      localStorage.setItem('masterok_favorites', JSON.stringify(updated));
    } else {
      favorites.push({ id, name, specialty, rating, hourlyRate });
      localStorage.setItem('masterok_favorites', JSON.stringify(favorites));
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative"
    >
      <Link href={`/specialist/${id}`}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary-200">
          {/* Promo Banner */}
          {promo && (
            <div className={`
              px-4 py-2 text-sm font-semibold text-white flex items-center justify-between
              ${promo.type === 'discount' && 'bg-gradient-to-r from-red-500 to-pink-500'}
              ${promo.type === 'new' && 'bg-gradient-to-r from-green-500 to-emerald-500'}
              ${promo.type === 'featured' && 'bg-gradient-to-r from-purple-500 to-indigo-500'}
            `}>
              <span className="flex items-center gap-2">
                {promo.type === 'discount' && <Zap className="w-4 h-4" />}
                {promo.type === 'new' && <TrendingUp className="w-4 h-4" />}
                {promo.type === 'featured' && <Award className="w-4 h-4" />}
                {promo.text}
              </span>
              {promo.badge && (
                <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                  {promo.badge}
                </span>
              )}
            </div>
          )}

          {/* Header */}
          <div className="p-5 pb-4">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 ring-4 ring-primary-50">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={name}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary-600">
                      {name.charAt(0)}
                    </div>
                  )}
                </div>
                
                {/* Online indicator */}
                {availableToday && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                      {name}
                    </h3>
                    <p className="text-sm text-gray-600">{specialty}</p>
                  </div>
                  
                  {/* Favorite Button */}
                  <button
                    onClick={handleFavoriteToggle}
                    className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-50 hover:bg-primary-50 flex items-center justify-center transition-all hover:scale-110"
                  >
                    <Heart
                      className={`w-5 h-5 transition-all ${
                        isFavorite
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-400 group-hover:text-primary-500'
                      }`}
                    />
                  </button>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {verified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Проверен
                    </span>
                  )}
                  {topSpecialist && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-lg text-xs font-medium shadow-md">
                      <Award className="w-3.5 h-3.5" />
                      Топ
                    </span>
                  )}
                  {availableToday && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      Доступен сегодня
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-gray-900">{rating}</span>
                    <span className="text-gray-500">({reviewsCount})</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>{completedJobs} заказов</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* Footer */}
          <div className="p-5 pt-4 bg-gradient-to-br from-gray-50/50 to-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{location}</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">от</div>
                <div className="text-lg font-bold text-primary-600">
                  {hourlyRate.toLocaleString()} ₽<span className="text-sm font-normal text-gray-500">/час</span>
                </div>
              </div>
            </div>

            {/* Response Time */}
            {responseTime && (
              <div className="mb-4 px-3 py-2 bg-blue-50 rounded-lg flex items-center justify-center gap-2 text-sm">
                <MessageCircle className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 font-medium">
                  Отвечает {responseTime}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Написать
              </button>
              <button className="px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-primary-500/30 hover:scale-105 transition-all duration-200">
                Нанять
              </button>
            </div>
          </div>

          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/0 to-primary-600/0 group-hover:from-primary-500/5 group-hover:to-primary-600/5 transition-all duration-300 pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
}




