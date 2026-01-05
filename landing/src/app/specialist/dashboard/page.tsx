'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Search,
  MessageSquare,
  Calendar,
  Settings,
  Bell,
  DollarSign,
  TrendingUp,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  ArrowRight,
  User,
  Briefcase
} from 'lucide-react';

interface Order {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  deadline: string;
  status: 'new' | 'in_progress' | 'completed' | 'declined';
  client: {
    name: string;
    avatar?: string;
    rating: number;
  };
  createdAt: string;
  responses: number;
}

const mockOrders: Order[] = [
  {
    id: '1',
    title: 'Ремонт квартиры 50 м²',
    description: 'Требуется косметический ремонт двухкомнатной квартиры. Поклейка обоев, покраска потолка, замена плинтусов.',
    category: 'Ремонт квартир',
    budget: 150000,
    location: 'Москва, ЦАО',
    deadline: '2025-02-15',
    status: 'new',
    client: {
      name: 'Анна Петрова',
      rating: 4.8
    },
    createdAt: '2025-01-15',
    responses: 3
  },
  {
    id: '2',
    title: 'Замена электропроводки в доме',
    description: 'Полная замена проводки в частном доме 120 м². Нужен опытный электрик с лицензией.',
    category: 'Электрика',
    budget: 85000,
    location: 'Московская область',
    deadline: '2025-01-30',
    status: 'in_progress',
    client: {
      name: 'Дмитрий Иванов',
      rating: 5.0
    },
    createdAt: '2025-01-10',
    responses: 7
  },
  {
    id: '3',
    title: 'Дизайн интерьера студии 35 м²',
    description: 'Создание дизайн-проекта для студии в современном стиле. Нужны 3D визуализации.',
    category: 'Дизайн интерьера',
    budget: 45000,
    location: 'Москва, СВАО',
    deadline: '2025-02-01',
    status: 'new',
    client: {
      name: 'Мария Сидорова',
      rating: 4.9
    },
    createdAt: '2025-01-14',
    responses: 12
  }
];

export default function SpecialistDashboard() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    activeOrders: orders.filter(o => o.status === 'in_progress').length,
    completedOrders: 47,
    totalEarnings: 1285000,
    averageRating: 4.9,
    responseRate: 95,
    newOrders: orders.filter(o => o.status === 'new').length
  };

  const filteredOrders = orders
    .filter(order => {
      if (filterStatus !== 'all' && order.status !== filterStatus) return false;
      if (searchQuery && !order.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

  const getStatusBadge = (status: Order['status']) => {
    const badges = {
      new: { label: 'Новый', className: 'bg-blue-100 text-blue-700' },
      in_progress: { label: 'В работе', className: 'bg-yellow-100 text-yellow-700' },
      completed: { label: 'Завершён', className: 'bg-green-100 text-green-700' },
      declined: { label: 'Отклонён', className: 'bg-red-100 text-red-700' }
    };
    return badges[status];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                YoDo
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link href="/specialist/dashboard" className="text-primary-600 font-medium">
                  Заказы
                </Link>
                <Link href="/specialist/find-orders" className="text-gray-600 hover:text-gray-900">
                  Поиск заказов
                </Link>
                <Link href="/specialist/messages" className="text-gray-600 hover:text-gray-900 relative">
                  Сообщения
                  <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </Link>
                <Link href="/specialist/calendar" className="text-gray-600 hover:text-gray-900">
                  Календарь
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <Link href="/specialist/settings" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-6 h-6 text-gray-600" />
              </Link>
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Добро пожаловать, Иван!</h1>
          <p className="text-primary-100">У вас {stats.newOrders} новых заказов, готовых к откликам</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Активных заказов</span>
              <Briefcase className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.activeOrders}</div>
            <p className="text-xs text-gray-500 mt-1">В работе сейчас</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Завершено</span>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.completedOrders}</div>
            <p className="text-xs text-gray-500 mt-1">Всего проектов</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Заработано</span>
              <DollarSign className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {(stats.totalEarnings / 1000).toFixed(0)}k
            </div>
            <p className="text-xs text-gray-500 mt-1">Рублей за всё время</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Рейтинг</span>
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.averageRating}</div>
            <p className="text-xs text-gray-500 mt-1">Из 5.0 звёзд</p>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по заказам..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'new', 'in_progress', 'completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`
                    px-4 py-3 rounded-xl font-medium text-sm transition-all
                    ${filterStatus === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {status === 'all' && 'Все'}
                  {status === 'new' && 'Новые'}
                  {status === 'in_progress' && 'В работе'}
                  {status === 'completed' && 'Завершённые'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{order.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status).className}`}>
                      {getStatusBadge(order.status).label}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{order.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {order.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      До {new Date(order.deadline).toLocaleDateString('ru-RU')}
                    </span>
                    <span>{order.location}</span>
                    <span className="text-primary-600 font-medium">
                      {order.responses} откликов
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600 mb-1">
                    {order.budget.toLocaleString()} ₽
                  </div>
                  <div className="text-xs text-gray-500">Бюджет</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{order.client.name}</div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      {order.client.rating}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {order.status === 'new' && (
                    <>
                      <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition-colors">
                        Скрыть
                      </button>
                      <Link
                        href={`/specialist/orders/${order.id}`}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        Откликнуться
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </>
                  )}
                  {order.status === 'in_progress' && (
                    <Link
                      href={`/specialist/orders/${order.id}`}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      Открыть
                      <Eye className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Заказы не найдены</h3>
            <p className="text-gray-500">Попробуйте изменить фильтры или поисковый запрос</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Link
            href="/specialist/find-orders"
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white hover:shadow-lg transition-all"
          >
            <Search className="w-8 h-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">Найти новые заказы</h3>
            <p className="text-blue-100 text-sm">Найдите заказы по вашим компетенциям</p>
          </Link>

          <Link
            href="/specialist/messages"
            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white hover:shadow-lg transition-all"
          >
            <MessageSquare className="w-8 h-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">Сообщения</h3>
            <p className="text-purple-100 text-sm">3 непрочитанных сообщения</p>
          </Link>
        </div>
      </div>
    </div>
  );
}




