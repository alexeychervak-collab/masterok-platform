'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Heart, Search, User } from 'lucide-react';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-xl">Y</span>
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ color: 'rgb(38, 37, 30)' }}>
              YODO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-teal-600"
                style={{ color: 'rgb(38, 37, 30)' }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium transition-colors hover:text-teal-600"
              style={{ color: 'rgb(38, 37, 30)' }}
            >
              Войти
            </Link>
            <Link
              href="/register"
              className="btn-primary text-sm"
            >
              Регистрация
            </Link>
            <Link
              href="/register-specialist"
              className="btn-accent text-sm"
            >
              Стать мастером
            </Link>
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
