'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SmartSearch from '@/components/ui/smart-search';

const rotatingWords = [
  'электрика',
  'сантехника',
  'дизайнера',
  'репетитора',
  'курьера',
  'уборщика',
  'ремонтника',
  'фотографа',
];

export default function Hero() {
  const router = useRouter();
  const [currentWord, setCurrentWord] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [onlineCount, setOnlineCount] = useState(2847);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWord((prev) => (prev + 1) % rotatingWords.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulate online count changing
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => prev + Math.floor(Math.random() * 10) - 5);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: 'rgb(247, 247, 244)' }}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(0, 150, 136, 0.15) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(255, 90, 95, 0.15) 0%, transparent 70%)' }}
        />
      </div>

      <div className="container-wide relative py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Online badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-fadeInUp" 
               style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
            <span className="online-indicator" />
            <span className="text-sm font-medium" style={{ color: 'rgb(34, 197, 94)' }}>
              {onlineCount.toLocaleString()} специалистов онлайн
            </span>
          </div>

          {/* Main heading */}
          <h1 className="heading-xl mb-6 animate-fadeInUp delay-100" style={{ color: 'rgb(38, 37, 30)' }}>
            Найдите лучшего{' '}
            <span className="relative inline-block">
              <span 
                className={`gradient-text transition-all duration-300 ${
                  isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
                }`}
              >
                {rotatingWords[currentWord]}
              </span>
              <span 
                className="absolute bottom-0 left-0 right-0 h-1 rounded-full"
                style={{ background: 'linear-gradient(90deg, rgb(0, 150, 136), rgb(0, 188, 212))' }}
              />
            </span>
            <br />
            для любой задачи
          </h1>

          {/* Subtitle */}
          <p className="text-xl mb-10 max-w-2xl mx-auto animate-fadeInUp delay-200" 
             style={{ color: 'rgba(38, 37, 30, 0.7)' }}>
            Миллионы проверенных специалистов готовы помочь вам. 
            Получите предложения за минуты.
          </p>

          {/* Smart Search */}
          <div className="max-w-3xl mx-auto mb-12 animate-fadeInUp delay-300">
            <SmartSearch 
              placeholder="Что вам нужно сделать? Начните вводить..." 
              onSearch={(query) => router.push(`/search?q=${encodeURIComponent(query)}`)}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto animate-fadeInUp delay-500">
            <div className="text-center">
              <div className="stat-number">50K+</div>
              <div className="text-small mt-1">Специалистов</div>
            </div>
            <div className="text-center">
              <div className="stat-number">2M+</div>
              <div className="text-small mt-1">Выполненных заказов</div>
            </div>
            <div className="text-center">
              <div className="stat-number">4.9</div>
              <div className="text-small mt-1">Средняя оценка</div>
            </div>
          </div>
        </div>

        {/* Floating cards */}
        <div className="hidden xl:block">
          {/* Left card */}
          <div className="absolute left-8 top-1/3 animate-float" style={{ animationDelay: '0s' }}>
            <div className="card p-4 w-64 shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                  АК
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: 'rgb(38, 37, 30)' }}>
                    Алексей К.
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 star-filled" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs" style={{ color: 'rgba(38, 37, 30, 0.6)' }}>4.9 (127)</span>
                  </div>
                </div>
              </div>
              <div className="badge badge-success text-xs">Сантехник · Онлайн</div>
            </div>
          </div>

          {/* Right card */}
          <div className="absolute right-8 top-1/4 animate-float" style={{ animationDelay: '1s' }}>
            <div className="card p-4 w-72 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="badge badge-accent">Новый заказ</span>
                <span className="text-xs" style={{ color: 'rgba(38, 37, 30, 0.5)' }}>2 мин назад</span>
              </div>
              <div className="font-semibold mb-2" style={{ color: 'rgb(38, 37, 30)' }}>
                Ремонт смесителя в ванной
              </div>
              <div className="flex items-center justify-between">
                <span className="price-tag text-lg">от 2 000 ₽</span>
                <span className="text-xs" style={{ color: 'rgba(38, 37, 30, 0.5)' }}>12 откликов</span>
              </div>
            </div>
          </div>

          {/* Bottom card */}
          <div className="absolute right-1/4 bottom-16 animate-float" style={{ animationDelay: '2s' }}>
            <div className="card p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: 'rgb(38, 37, 30)' }}>
                    Заказ выполнен!
                  </div>
                  <div className="text-xs" style={{ color: 'rgba(38, 37, 30, 0.5)' }}>
                    Клиент оставил отзыв ⭐⭐⭐⭐⭐
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0 50L48 45.8C96 41.7 192 33.3 288 35.2C384 37 480 49 576 54.2C672 59.3 768 57.7 864 52.5C960 47.3 1056 38.7 1152 38.3C1248 38 1344 46 1392 50L1440 54V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" 
            fill="rgb(242, 241, 237)"
          />
        </svg>
      </div>
    </section>
  );
}
