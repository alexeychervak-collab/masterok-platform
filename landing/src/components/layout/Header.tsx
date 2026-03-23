'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Heart, Search, User, LogOut, ChevronDown } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = () => setShowUserMenu(false);
    if (showUserMenu) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [showUserMenu]);

  const navLinks = [
    { name: 'Найти специалиста', href: '/search' },
    { name: 'Найти заказы', href: '/specialist/find-orders' },
    { name: 'Как это работает', href: '/how-it-works' },
    { name: 'Тарифы', href: '/pricing' },
  ];

  return (
    <header
      className={`header-sticky transition-all duration-300 ${
        isScrolled ? 'py-3 shadow-sm' : 'py-4'
      }`}
    >
      <nav className="container-wide">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ color: 'rgb(38, 37, 30)' }}>
              МастерОК
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-orange-600"
                style={{ color: 'rgb(38, 37, 30)' }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {loading ? (
              <div className="w-20 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 max-w-[120px] truncate">
                    {user.full_name || user.email}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900 truncate">{user.full_name}</div>
                      <div className="text-xs text-gray-500 truncate">{user.email}</div>
                    </div>
                    {user.user_type === 'specialist' ? (
                      <>
                        <Link href="/specialist/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Мои заказы</Link>
                        <Link href="/specialist/messages" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Сообщения</Link>
                        <Link href="/specialist/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Настройки</Link>
                      </>
                    ) : (
                      <>
                        <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Мои заказы</Link>
                        <Link href="/messages" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Сообщения</Link>
                        <Link href="/create-order" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Создать заказ</Link>
                      </>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Выйти
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium transition-colors hover:text-orange-600"
                  style={{ color: 'rgb(38, 37, 30)' }}
                >
                  Войти
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                  Регистрация
                </Link>
                <Link
                  href="/register-specialist"
                  className="btn-accent text-sm"
                >
                  Стать мастером
                </Link>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/search"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Поиск"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </Link>
            <Link
              href="/favorites"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Избранное"
            >
              <Heart className="w-5 h-5 text-gray-700" />
            </Link>
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Открыть меню"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}
