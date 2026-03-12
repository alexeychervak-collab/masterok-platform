'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Home, Search, Heart, User, Menu, 
  MessageCircle, Bell, Settings, LogOut,
  TrendingUp, Shield, Award
} from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: 'Главная', href: '/' },
  { icon: Search, label: 'Найти специалиста', href: '/search' },
  { icon: TrendingUp, label: 'Найти заказы', href: '/specialist/find-orders' },
  { icon: Shield, label: 'Как это работает', href: '/how-it-works' },
  { icon: Award, label: 'Тарифы', href: '/pricing' },
  { icon: Heart, label: 'Избранное', href: '/favorites' },
  { icon: MessageCircle, label: 'Сообщения', href: '/messages', badge: 3 },
  { icon: Bell, label: 'Уведомления', href: '/notifications', badge: 5 },
  { icon: User, label: 'Профиль', href: '/profile' },
];

const quickLinks = [
  { icon: TrendingUp, label: 'Популярное', href: '/trending' },
  { icon: Shield, label: 'Проверенные', href: '/search?verified=true' },
  { icon: Award, label: 'Топ специалисты', href: '/search?top_rated=true' },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [user, setUser] = useState<any>(null); // Replace with real user data

  useEffect(() => {
    // Prevent body scroll when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-80 bg-white z-50 shadow-2xl lg:hidden overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Меню</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Закрыть меню"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* User Info or Auth */}
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-teal-100">{user.email}</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="block w-full py-2 px-4 bg-white text-teal-600 rounded-lg font-semibold text-center hover:bg-teal-50 transition-colors"
                  >
                    Войти
                  </Link>
                  <Link
                    href="/register"
                    onClick={onClose}
                    className="block w-full py-2 px-4 bg-white/20 text-white rounded-lg font-semibold text-center hover:bg-white/30 transition-colors"
                  >
                    Регистрация
                  </Link>
                </div>
              )}
            </div>

            {/* Main Menu */}
            <div className="p-4">
              <nav className="space-y-1 mb-6">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
                          <item.icon className="w-5 h-5 text-teal-600" />
                        </div>
                        <span className="font-medium text-gray-900">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Quick Links */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
                  Быстрые ссылки
                </h3>
                <div className="space-y-1">
                  {quickLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (menuItems.length + index) * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        <link.icon className="w-4 h-4" />
                        <span className="text-sm">{link.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Settings & Logout */}
              {user && (
                <div className="border-t border-gray-200 pt-4">
                  <Link
                    href="/settings"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 mb-2"
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Настройки</span>
                  </Link>
                  <button
                    onClick={() => {
                      // Handle logout
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Выйти</span>
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 mt-auto">
              <div className="text-xs text-gray-500 text-center">
                <p className="mb-2">МастерОК</p>
                <div className="flex justify-center gap-4">
                  <Link href="/about" className="hover:text-teal-600">О нас</Link>
                  <Link href="/help" className="hover:text-teal-600">Помощь</Link>
                  <Link href="/terms" className="hover:text-teal-600">Условия</Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}



