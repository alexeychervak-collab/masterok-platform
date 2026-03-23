'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle, X, DollarSign, ArrowRight, User, MessageCircle } from 'lucide-react';
import api from '@/lib/api';

interface AdminDispute {
  id: string;
  orderId: string;
  orderTitle: string;
  client: string;
  specialist: string;
  reason: string;
  status: 'open' | 'under_review' | 'resolved';
  amount: number;
  createdAt: string;
  evidence: { author: string; role: string; content: string; date: string }[];
}

const mockDisputes: AdminDispute[] = [
  {
    id: '1',
    orderId: '12',
    orderTitle: 'Ремонт кухни',
    client: 'Анна Петрова',
    specialist: 'Алексей Иванов',
    reason: 'Работы выполнены не в полном объёме',
    status: 'open',
    amount: 85000,
    createdAt: '2025-03-18',
    evidence: [
      { author: 'Анна Петрова', role: 'client', content: 'Мастер не завершил покраску стен и не установил вытяжку.', date: '2025-03-18' },
      { author: 'Алексей Иванов', role: 'specialist', content: 'Вытяжка не была в смете. Покраска будет завершена после высыхания штукатурки.', date: '2025-03-19' },
    ],
  },
  {
    id: '2',
    orderId: '8',
    orderTitle: 'Укладка плитки в ванной',
    client: 'Дмитрий Козлов',
    specialist: 'Сергей Смирнов',
    reason: 'Низкое качество работ',
    status: 'under_review',
    amount: 32000,
    createdAt: '2025-03-15',
    evidence: [
      { author: 'Дмитрий Козлов', role: 'client', content: 'Плитка уложена неровно, швы разной ширины.', date: '2025-03-15' },
    ],
  },
  {
    id: '3',
    orderId: '5',
    orderTitle: 'Электропроводка в офисе',
    client: 'ООО Стройтех',
    specialist: 'Николай Волков',
    reason: 'Срыв сроков',
    status: 'open',
    amount: 120000,
    createdAt: '2025-03-12',
    evidence: [
      { author: 'ООО Стройтех', role: 'client', content: 'Работы должны были быть завершены 10 марта, но до сих пор не закончены.', date: '2025-03-12' },
      { author: 'Николай Волков', role: 'specialist', content: 'Задержка из-за поставки материалов. Завершу к 15 марта.', date: '2025-03-13' },
    ],
  },
];

const statusConfig: Record<string, { label: string; bg: string; color: string; icon: React.ReactNode }> = {
  open: { label: 'Открыт', bg: 'bg-red-500/20', color: 'text-red-400', icon: <AlertTriangle className="w-4 h-4" /> },
  under_review: { label: 'На рассмотрении', bg: 'bg-yellow-500/20', color: 'text-yellow-400', icon: <Clock className="w-4 h-4" /> },
  resolved: { label: 'Решён', bg: 'bg-green-500/20', color: 'text-green-400', icon: <CheckCircle className="w-4 h-4" /> },
};

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<AdminDispute[]>(mockDisputes);
  const [selectedDispute, setSelectedDispute] = useState<AdminDispute | null>(null);
  const [resolution, setResolution] = useState('');

  useEffect(() => {
    api.getAdminDisputes()
      .then((res) => {
        if (res.data && Array.isArray(res.data) && (res.data as any[]).length > 0) {
          setDisputes(res.data as AdminDispute[]);
        }
      })
      .catch(() => {});
  }, []);

  const handleResolve = async (disputeId: string, action: 'refund' | 'release' | 'split') => {
    const labels = { refund: 'Возврат заказчику', release: 'Выплата специалисту', split: 'Разделение 50/50' };
    try {
      await api.resolveDispute(disputeId, action);
    } catch {}
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: 'resolved' as const } : d))
    );
    setSelectedDispute(null);
  };

  const openDisputes = disputes.filter((d) => d.status !== 'resolved');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Споры</h1>
        <p className="text-gray-400">{openDisputes.length} открытых споров требуют внимания</p>
      </div>

      {/* Dispute list */}
      <div className="space-y-4">
        {disputes.map((dispute, index) => {
          const config = statusConfig[dispute.status];
          return (
            <motion.div
              key={dispute.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-800 rounded-2xl border border-gray-700 p-6 hover:border-gray-600 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-white">{dispute.orderTitle}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.bg} ${config.color}`}>
                      {config.icon}
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">Заказ #{dispute.orderId} | {new Date(dispute.createdAt).toLocaleDateString('ru-RU')}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-white">{dispute.amount.toLocaleString()} ₽</span>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4">{dispute.reason}</p>

              <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Заказчик: <span className="text-gray-300">{dispute.client}</span>
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Специалист: <span className="text-gray-300">{dispute.specialist}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {dispute.evidence.length} сообщений
                </span>
              </div>

              {dispute.status !== 'resolved' && (
                <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => setSelectedDispute(dispute)}
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-xl text-sm hover:bg-gray-600 transition-colors"
                  >
                    Подробнее
                  </button>
                  <button
                    onClick={() => handleResolve(dispute.id, 'refund')}
                    className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl text-sm hover:bg-blue-500/30 transition-colors"
                  >
                    Возврат заказчику
                  </button>
                  <button
                    onClick={() => handleResolve(dispute.id, 'release')}
                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl text-sm hover:bg-green-500/30 transition-colors"
                  >
                    Выплата специалисту
                  </button>
                  <button
                    onClick={() => handleResolve(dispute.id, 'split')}
                    className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-xl text-sm hover:bg-orange-500/30 transition-colors"
                  >
                    Разделить 50/50
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedDispute && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setSelectedDispute(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Спор: {selectedDispute.orderTitle}</h2>
                  <button onClick={() => setSelectedDispute(null)} className="p-2 hover:bg-gray-700 rounded-xl transition-colors">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {selectedDispute.evidence.map((ev, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-xl ${
                        ev.role === 'client' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-orange-500/10 border border-orange-500/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-medium text-sm ${ev.role === 'client' ? 'text-blue-400' : 'text-orange-400'}`}>
                          {ev.author} ({ev.role === 'client' ? 'Заказчик' : 'Специалист'})
                        </span>
                        <span className="text-xs text-gray-500">{new Date(ev.date).toLocaleDateString('ru-RU')}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{ev.content}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => handleResolve(selectedDispute.id, 'refund')}
                    className="flex-1 py-2.5 bg-blue-500/20 text-blue-400 rounded-xl text-sm font-medium hover:bg-blue-500/30 transition-colors"
                  >
                    Возврат заказчику
                  </button>
                  <button
                    onClick={() => handleResolve(selectedDispute.id, 'release')}
                    className="flex-1 py-2.5 bg-green-500/20 text-green-400 rounded-xl text-sm font-medium hover:bg-green-500/30 transition-colors"
                  >
                    Выплата специалисту
                  </button>
                  <button
                    onClick={() => handleResolve(selectedDispute.id, 'split')}
                    className="flex-1 py-2.5 bg-orange-500/20 text-orange-400 rounded-xl text-sm font-medium hover:bg-orange-500/30 transition-colors"
                  >
                    50/50
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
