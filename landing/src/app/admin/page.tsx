'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, DollarSign, AlertTriangle, TrendingUp, ArrowUpRight, Eye, Clock } from 'lucide-react';
import api from '@/lib/api';

interface DashboardStats {
  totalUsers: number;
  activeOrders: number;
  monthRevenue: number;
  openDisputes: number;
}

const mockStats: DashboardStats = {
  totalUsers: 1247,
  activeOrders: 89,
  monthRevenue: 2450000,
  openDisputes: 7,
};

interface RecentOrder {
  id: string;
  title: string;
  client: string;
  specialist: string;
  amount: number;
  status: string;
  date: string;
}

const mockRecentOrders: RecentOrder[] = [
  { id: '1', title: 'Ремонт кухни', client: 'Анна Петрова', specialist: 'Алексей Иванов', amount: 85000, status: 'in_progress', date: '2025-03-20' },
  { id: '2', title: 'Укладка плитки', client: 'Дмитрий Козлов', specialist: 'Сергей Смирнов', amount: 32000, status: 'new', date: '2025-03-19' },
  { id: '3', title: 'Электрика в офисе', client: 'ООО Стройтех', specialist: 'Николай Волков', amount: 120000, status: 'completed', date: '2025-03-18' },
  { id: '4', title: 'Дизайн-проект', client: 'Мария Сидорова', specialist: 'Ольга Кузнецова', amount: 45000, status: 'in_progress', date: '2025-03-17' },
  { id: '5', title: 'Сантехника ванной', client: 'Павел Морозов', specialist: 'Андрей Петров', amount: 28000, status: 'new', date: '2025-03-17' },
  { id: '6', title: 'Штукатурка стен', client: 'Елена Ковалёва', specialist: 'Виктор Сидоров', amount: 56000, status: 'completed', date: '2025-03-16' },
  { id: '7', title: 'Замена окон', client: 'Игорь Новиков', specialist: 'Денис Попов', amount: 95000, status: 'in_progress', date: '2025-03-15' },
  { id: '8', title: 'Натяжной потолок', client: 'Татьяна Белова', specialist: 'Роман Жуков', amount: 18000, status: 'completed', date: '2025-03-14' },
  { id: '9', title: 'Ремонт балкона', client: 'Алексей Фёдоров', specialist: 'Максим Орлов', amount: 42000, status: 'new', date: '2025-03-13' },
  { id: '10', title: 'Монтаж кондиционера', client: 'Ирина Захарова', specialist: 'Евгений Лебедев', amount: 15000, status: 'completed', date: '2025-03-12' },
];

const statusBadge: Record<string, { label: string; className: string }> = {
  new: { label: 'Новый', className: 'bg-blue-500/20 text-blue-400' },
  in_progress: { label: 'В работе', className: 'bg-yellow-500/20 text-yellow-400' },
  completed: { label: 'Завершён', className: 'bg-green-500/20 text-green-400' },
  cancelled: { label: 'Отменён', className: 'bg-red-500/20 text-red-400' },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>(mockRecentOrders);

  useEffect(() => {
    api.getDashboardStats()
      .then((res) => {
        if (res.data) setStats(res.data as DashboardStats);
      })
      .catch(() => {});
  }, []);

  const statCards = [
    { label: 'Пользователей', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/20', trend: '+12%' },
    { label: 'Активных заказов', value: stats.activeOrders.toString(), icon: ShoppingBag, color: 'text-orange-400', bg: 'bg-orange-500/20', trend: '+8%' },
    { label: 'Выручка (мес.)', value: `${(stats.monthRevenue / 1000000).toFixed(1)}M ₽`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/20', trend: '+23%' },
    { label: 'Открытых споров', value: stats.openDisputes.toString(), icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/20', trend: '-3' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Дашборд</h1>
        <p className="text-gray-400">Обзор платформы МастерОК</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-xs text-green-400 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden mb-8"
      >
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Последние заказы</h2>
          <Link href="/admin/orders" className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors">
            Все заказы
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">Заказ</th>
                <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">Заказчик</th>
                <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">Специалист</th>
                <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">Сумма</th>
                <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">Статус</th>
                <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">Дата</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-white font-medium">{order.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{order.client}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{order.specialist}</td>
                  <td className="px-6 py-4 text-sm text-white font-medium">{order.amount.toLocaleString()} ₽</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge[order.status]?.className}`}>
                      {statusBadge[order.status]?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{new Date(order.date).toLocaleDateString('ru-RU')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/verification" className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-orange-500/50 transition-all group">
          <Eye className="w-8 h-8 text-orange-400 mb-3" />
          <h3 className="font-semibold text-white mb-1">Проверить документы</h3>
          <p className="text-sm text-gray-400">5 заявок ожидают проверки</p>
        </Link>
        <Link href="/admin/disputes" className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-orange-500/50 transition-all group">
          <AlertTriangle className="w-8 h-8 text-red-400 mb-3" />
          <h3 className="font-semibold text-white mb-1">Разрешить споры</h3>
          <p className="text-sm text-gray-400">{stats.openDisputes} открытых споров</p>
        </Link>
        <Link href="/admin/analytics" className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-orange-500/50 transition-all group">
          <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
          <h3 className="font-semibold text-white mb-1">Аналитика</h3>
          <p className="text-sm text-gray-400">Отчёты и статистика</p>
        </Link>
      </div>
    </div>
  );
}
