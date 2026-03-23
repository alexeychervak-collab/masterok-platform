'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Shield, Ban, UserCog, Users as UsersIcon } from 'lucide-react';
import api from '@/lib/api';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'specialist' | 'admin';
  status: 'active' | 'banned';
  registered: string;
  ordersCount: number;
}

const mockUsers: AdminUser[] = Array.from({ length: 25 }, (_, i) => ({
  id: String(i + 1),
  name: [
    'Анна Петрова', 'Дмитрий Козлов', 'Мария Сидорова', 'Алексей Иванов', 'Елена Ковалёва',
    'Сергей Смирнов', 'Ольга Кузнецова', 'Николай Волков', 'Татьяна Белова', 'Павел Морозов',
    'Ирина Захарова', 'Виктор Сидоров', 'Наталья Попова', 'Андрей Петров', 'Юлия Орлова',
    'Максим Лебедев', 'Светлана Жукова', 'Роман Фёдоров', 'Марина Новикова', 'Евгений Семёнов',
    'Оксана Васильева', 'Денис Степанов', 'Кристина Михайлова', 'Артём Соколов', 'Валерия Егорова',
  ][i],
  email: `user${i + 1}@example.com`,
  role: i < 2 ? 'admin' : i % 3 === 0 ? 'specialist' : 'client',
  status: i === 5 ? 'banned' : 'active',
  registered: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
  ordersCount: Math.floor(Math.random() * 20),
}));

const roleLabels: Record<string, { label: string; className: string }> = {
  client: { label: 'Заказчик', className: 'bg-blue-500/20 text-blue-400' },
  specialist: { label: 'Специалист', className: 'bg-orange-500/20 text-orange-400' },
  admin: { label: 'Админ', className: 'bg-purple-500/20 text-purple-400' },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    api.getAdminUsers({ search: searchQuery || undefined, role: roleFilter !== 'all' ? roleFilter : undefined })
      .then((res) => {
        if (res.data && Array.isArray(res.data) && (res.data as any[]).length > 0) {
          setUsers(res.data as AdminUser[]);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const toggleBan = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } as AdminUser : u))
    );
    api.updateUser(userId, { status: users.find((u) => u.id === userId)?.status === 'active' ? 'banned' : 'active' }).catch(() => {});
  };

  const changeRole = (userId: string, newRole: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole as AdminUser['role'] } : u))
    );
    api.updateUser(userId, { role: newRole }).catch(() => {});
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Пользователи</h1>
        <p className="text-gray-400">Управление пользователями платформы</p>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Поиск по имени или email..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'client', 'specialist', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => { setRoleFilter(role); setCurrentPage(1); }}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                roleFilter === role ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {role === 'all' ? 'Все' : roleLabels[role]?.label}
            </button>
          ))}
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
                <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">Имя</th>
                <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">Email</th>
                <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">Роль</th>
                <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">Статус</th>
                <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">Регистрация</th>
                <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">Действия</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((user) => (
                <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white font-medium">
                        {user.name.split(' ').map((w) => w[0]).join('')}
                      </div>
                      <span className="text-sm text-white font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleLabels[user.role]?.className}`}>
                      {roleLabels[user.role]?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {user.status === 'active' ? 'Активен' : 'Заблокирован'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{new Date(user.registered).toLocaleDateString('ru-RU')}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBan(user.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          user.status === 'active'
                            ? 'text-red-400 hover:bg-red-500/20'
                            : 'text-green-400 hover:bg-green-500/20'
                        }`}
                        title={user.status === 'active' ? 'Заблокировать' : 'Разблокировать'}
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                      <select
                        value={user.role}
                        onChange={(e) => changeRole(user.id, e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded-lg text-xs text-gray-300 px-2 py-1 focus:ring-1 focus:ring-orange-500 outline-none"
                      >
                        <option value="client">Заказчик</option>
                        <option value="specialist">Специалист</option>
                        <option value="admin">Админ</option>
                      </select>
                    </div>
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {page}
              </button>
            ))}
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
