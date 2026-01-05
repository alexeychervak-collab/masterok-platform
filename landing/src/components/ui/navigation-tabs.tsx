'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Search, 
  UserPlus, 
  Briefcase, 
  Calculator, 
  Heart,
  MessageCircle,
  FileText,
  TrendingUp
} from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  description: string;
}

const tabs: Tab[] = [
  {
    id: 'find',
    label: 'Найти специалиста',
    icon: <Search className="w-5 h-5" />,
    href: '/search',
    description: 'Поиск проверенных мастеров'
  },
  {
    id: 'become',
    label: 'Стать специалистом',
    icon: <UserPlus className="w-5 h-5" />,
    href: '/become-specialist',
    description: 'Зарегистрируйтесь и получайте заказы'
  },
  {
    id: 'post',
    label: 'Разместить заказ',
    icon: <Briefcase className="w-5 h-5" />,
    href: '/post-job',
    description: 'Опишите задачу, получите предложения'
  },
  {
    id: 'calculator',
    label: 'Калькулятор',
    icon: <Calculator className="w-5 h-5" />,
    href: '#calculator',
    description: 'Рассчитайте стоимость работ'
  },
  {
    id: 'favorites',
    label: 'Избранное',
    icon: <Heart className="w-5 h-5" />,
    href: '/favorites',
    description: 'Сохраненные специалисты'
  },
];

export default function NavigationTabs() {
  const [activeTab, setActiveTab] = useState('find');

  return (
    <div className="w-full bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Tabs */}
        <div className="hidden md:flex items-center gap-2 overflow-x-auto py-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={tab.href || '#'}
                onClick={() => setActiveTab(tab.id)}
                className="relative group"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex items-center gap-2.5 px-5 py-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                    }
                  `}
                >
                  <div className={`
                    transition-colors
                    ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary-600'}
                  `}>
                    {tab.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className={`
                      text-sm font-semibold whitespace-nowrap
                      ${isActive ? 'text-white' : 'text-gray-900 group-hover:text-primary-700'}
                    `}>
                      {tab.label}
                    </span>
                    {isActive && (
                      <motion.span 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-white/90 whitespace-nowrap"
                      >
                        {tab.description}
                      </motion.span>
                    )}
                  </div>
                </motion.div>

                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-t-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden flex items-center gap-3 overflow-x-auto py-3 scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={tab.href || '#'}
                onClick={() => setActiveTab(tab.id)}
                className="flex-shrink-0"
              >
                <div className={`
                  flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all duration-200 min-w-[80px]
                  ${isActive 
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md' 
                    : 'bg-gray-50 text-gray-600'
                  }
                `}>
                  {tab.icon}
                  <span className="text-xs font-medium text-center">
                    {tab.label.split(' ')[0]}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="hidden lg:block bg-gradient-to-r from-gray-50 to-white py-2 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-6">
              <Link href="/specialists" className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors group">
                <TrendingUp className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Топ специалистов</span>
              </Link>
              <Link href="/reviews" className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors group">
                <MessageCircle className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Отзывы клиентов</span>
              </Link>
              <Link href="/blog" className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors group">
                <FileText className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Журнал о ремонте</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500">📞 Бесплатная консультация:</span>
              <a href="tel:88003334455" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                8 (800) 333-44-55
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




