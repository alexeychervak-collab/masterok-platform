'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChevronRight, Home, ArrowLeft, AlertTriangle, Upload, MessageCircle, Shield, Clock, CheckCircle } from 'lucide-react';
import api from '@/lib/api';

interface DisputeEvidence {
  id: string;
  author: string;
  role: 'client' | 'specialist' | 'admin';
  type: 'text' | 'photo' | 'document';
  content: string;
  date: string;
}

interface Dispute {
  id: string;
  orderId: string;
  status: 'open' | 'under_review' | 'resolved';
  reason: string;
  createdAt: string;
  evidence: DisputeEvidence[];
  resolution?: string;
}

const mockDispute: Dispute = {
  id: 'disp-1',
  orderId: '1',
  status: 'under_review',
  reason: 'Работы выполнены не в полном объёме. Не установлена часть розеток, не завершена покраска в спальне.',
  createdAt: '2025-02-20',
  evidence: [
    {
      id: '1',
      author: 'Анна Петрова',
      role: 'client',
      type: 'text',
      content: 'Мастер не завершил покраску в спальне и не установил 3 из 5 розеток по договору.',
      date: '2025-02-20',
    },
    {
      id: '2',
      author: 'Алексей Петров',
      role: 'specialist',
      type: 'text',
      content: 'Розетки не были установлены из-за отсутствия материалов, которые должен был предоставить заказчик. Покраска будет завершена после доставки краски.',
      date: '2025-02-21',
    },
    {
      id: '3',
      author: 'Анна Петрова',
      role: 'client',
      type: 'photo',
      content: 'Фото незавершённых работ в спальне',
      date: '2025-02-21',
    },
  ],
};

const statusConfig = {
  open: { label: 'Открыт', bg: 'bg-red-100', color: 'text-red-700', icon: <AlertTriangle className="w-5 h-5" /> },
  under_review: { label: 'На рассмотрении', bg: 'bg-yellow-100', color: 'text-yellow-700', icon: <Clock className="w-5 h-5" /> },
  resolved: { label: 'Решён', bg: 'bg-green-100', color: 'text-green-700', icon: <CheckCircle className="w-5 h-5" /> },
};

export default function DisputePage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [dispute, setDispute] = useState<Dispute>(mockDispute);
  const [loading, setLoading] = useState(true);
  const [newEvidence, setNewEvidence] = useState('');

  useEffect(() => {
    api.getDispute(orderId)
      .then((res) => {
        if (res.data) setDispute(res.data as Dispute);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvidence.trim()) return;
    const evidence: DisputeEvidence = {
      id: String(dispute.evidence.length + 1),
      author: 'Вы',
      role: 'client',
      type: 'text',
      content: newEvidence,
      date: new Date().toISOString().split('T')[0],
    };
    try {
      await api.addDisputeEvidence(dispute.id, { content: newEvidence, type: 'text' });
    } catch {}
    setDispute({ ...dispute, evidence: [...dispute.evidence, evidence] });
    setNewEvidence('');
  };

  const config = statusConfig[dispute.status];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-orange-600 transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            Главная
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/orders" className="hover:text-orange-600 transition-colors">Заказы</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/orders/${orderId}`} className="hover:text-orange-600 transition-colors">Заказ #{orderId}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Спор</span>
        </nav>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link href={`/orders/${orderId}`} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Спор по заказу</h1>
              <p className="text-gray-600">Заказ #{orderId}</p>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Загрузка...</div>
        ) : (
          <>
            {/* Dispute info card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Информация о споре</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${config.bg} ${config.color}`}>
                  {config.icon}
                  {config.label}
                </span>
              </div>
              <div className="mb-4">
                <span className="text-sm text-gray-500">Причина:</span>
                <p className="text-gray-800 mt-1">{dispute.reason}</p>
              </div>
              <div className="text-sm text-gray-500">
                Создан: {new Date(dispute.createdAt).toLocaleDateString('ru-RU')}
              </div>
            </motion.div>

            {/* Evidence timeline */}
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Доказательства и обсуждение</h2>
            <div className="space-y-4 mb-6">
              {dispute.evidence.map((ev, index) => {
                const roleColors = {
                  client: 'border-l-blue-500 bg-blue-50',
                  specialist: 'border-l-orange-500 bg-orange-50',
                  admin: 'border-l-purple-500 bg-purple-50',
                };
                const roleLabels = { client: 'Заказчик', specialist: 'Специалист', admin: 'Администратор' };

                return (
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-l-4 rounded-r-2xl p-4 ${roleColors[ev.role]}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{ev.author}</span>
                        <span className="text-xs px-2 py-0.5 bg-white/80 rounded-full text-gray-600">
                          {roleLabels[ev.role]}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(ev.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                    {ev.type === 'photo' ? (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">{ev.content}</span>
                      </div>
                    ) : (
                      <p className="text-gray-700 text-sm">{ev.content}</p>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Add evidence form */}
            {dispute.status !== 'resolved' && (
              <form onSubmit={handleAddEvidence} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-orange-500" />
                  Добавить доказательство
                </h3>
                <textarea
                  value={newEvidence}
                  onChange={(e) => setNewEvidence(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none mb-4"
                  rows={3}
                  placeholder="Опишите ситуацию или добавьте комментарий..."
                  required
                />
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Прикрепить файл
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors"
                  >
                    Отправить
                  </button>
                </div>
              </form>
            )}

            {/* Resolution */}
            {dispute.status === 'resolved' && dispute.resolution && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-6 mt-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Решение администратора</h3>
                </div>
                <p className="text-green-700">{dispute.resolution}</p>
              </motion.div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
