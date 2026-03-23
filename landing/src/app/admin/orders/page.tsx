'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Eye, ExternalLink } from 'lucide-react';
import api from '@/lib/api';

interface AdminOrder {
  id: string;
  title: string;
  client: string;
  specialist: string;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  amount: number;
  date: string;
  category: string;
}

const mockOrders: AdminOrder[] = Array.from({ length: 30 }, (_, i) => {
  const titles = ['Ремонт квартиры', 'Укладка плитки', 'Электрика', 'Дизайн-проект', 'Сантехника', 'Штукатурка', 'Покраска', 'Монтаж потолка', 'Замена окон', 'Ремонт балкона'];
  const clients = ['Анна Петрова', 'Дмитрий Козлов', 'Мария Сидорова', 'Павел Морозов', 'Елена Ковалёва'];
  const specialists = ['Алексей Иванов', 'Сергей Смирнов', 'Николай Волков', 'Андрей Петров', 'Виктор Сидоров'];
  const statuses: AdminOrder['status'][] = ['new', 'in_progress', 'completed', 'cancelled', 'disputed'];
  const categories = ['Ремонт', 'Плиточные работы', 'Электрика', 'Дизайн', 'Сантехника'];
  return {
    id: String(i + 1),
    title: titles[i % titles.length],
    client: clients[i % clients.length],
    specialist: specialists[i % specialists.length],
    status: statuses[i % statuses.length],
    amount: Math.floor(Math.random() * 200000) + 10000,
    date: new Date(2025, 2, 23 - i).toISOString().split('T')[0],
    category: categories[i % categories.length],
  };
});

const statusTabs = [
  { value: 'all', label: 'Все' },
  { value: 'new', label: 'Новые' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'completed', label: 'Завершённые' },
  { value: 'cancelled', label: 'Отменённые' },
  { value: 'disputed', label: 'Споры' },
];

const statusBadge: Record<string, { label: string; className: string }> = {
  new: { label: 'Новый', className: 'bg-blue-500/20 text-blue-400' },
  in_progress: { label: 'В работе', className: 'bg-yellow-500/20 text-yellow-400' },
  completed: { label: 'Завершён', className: 'bg-green-500/20 text-green-400' },
  cancelled: { label: 'Отменён', className: 'bg-red-500/20 text-red-400' },
  disputed: { label: 'Спор', className: 'bg-purple-500/20 text-purple-400' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(mockOrders);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    api.getAdminOrders({ status: statusFilter !== 'all' ? statusFilter : undefined })
      .then((res) => {
        if (res.data && Array.isArray(res.data) && (res.data as any[]).length > 0) {
          setOrders(res.data as AdminOrder[]);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return o.title.toLowerCase().includes(q) || o.client.toLowerCase().includes(q) || o.specialist.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Заказы</h1>
        <p className="text-gray-400">Все заказы на платформе</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatusFilter(tab.value); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              statusFilter === tab.value ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-70">
              ({orders.filter((o) => tab.value === 'all' || o.status === tab.value).length})
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Поиск по названию, заказчику или специалисту..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">ID</th>
                <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">Название</th>
                <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">Заказчик</th>
                <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">Специалист</th>
                <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">Статус</th>
                <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">Сумма</th>
                <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">Дата</th>
                <th className="text-left text-xs text-gray-400 font-medium px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paged.map((order) => (
                <tr key={order.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-400">#{order.id}</td>
                  <td className="px-6 py-4 text-sm text-white font-medium">{order.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{order.client}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{order.specialist}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge[order.status]?.className}`}>
                      {statusBadge[order.status]?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white font-medium">{order.amount.toLocaleString()} ₽</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{new Date(order.date).toLocaleDateString('ru-RU')}</td>
                  <td className="px-6 py-4">
                    <Link href={`/orders/${order.id}`} className="p-1.5 rounded-lg text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-700">
          <span className="text-sm text-gray-400">
            Показано {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} из {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const page = currentPage <= 3 ? i + 1 : currentPage + i - 2;
              if (page > totalPages || page < 1) return null;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
