'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import MilestoneTracker, { Milestone } from '@/components/ui/milestone-tracker';
import { ChevronRight, Home, ArrowLeft, DollarSign, CheckCircle, Clock } from 'lucide-react';
import api from '@/lib/api';

const mockMilestones: Milestone[] = [
  {
    id: '1',
    title: 'Подготовительные работы',
    description: 'Демонтаж старых покрытий, подготовка поверхностей, закупка материалов',
    amount: 25000,
    status: 'approved',
    due_date: '2025-02-01',
    order: 1,
  },
  {
    id: '2',
    title: 'Черновые работы',
    description: 'Выравнивание стен, стяжка пола, прокладка электропроводки',
    amount: 45000,
    status: 'submitted',
    due_date: '2025-02-15',
    order: 2,
  },
  {
    id: '3',
    title: 'Чистовая отделка',
    description: 'Покраска стен, укладка плитки, монтаж напольного покрытия',
    amount: 50000,
    status: 'in_progress',
    due_date: '2025-03-01',
    order: 3,
  },
  {
    id: '4',
    title: 'Установка сантехники',
    description: 'Монтаж ванны, раковины, унитаза, смесителей',
    amount: 20000,
    status: 'funded',
    due_date: '2025-03-10',
    order: 4,
  },
  {
    id: '5',
    title: 'Финальная приёмка',
    description: 'Уборка, проверка всех систем, подписание акта приёмки',
    amount: 10000,
    status: 'pending',
    due_date: '2025-03-15',
    order: 5,
  },
];

export default function MilestonesPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones);
  const [role] = useState<'client' | 'specialist'>('client');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMilestones(orderId)
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setMilestones(res.data as Milestone[]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleAction = async (milestoneId: string, action: 'fund' | 'submit' | 'approve') => {
    try {
      if (action === 'fund') await api.fundMilestone(milestoneId);
      if (action === 'submit') await api.submitMilestone(milestoneId);
      if (action === 'approve') await api.approveMilestone(milestoneId);
    } catch {
      // Fallback: update locally
    }
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== milestoneId) return m;
        const nextStatus: Record<string, Milestone['status']> = {
          fund: 'funded',
          submit: 'submitted',
          approve: 'approved',
        };
        return { ...m, status: nextStatus[action] };
      })
    );
  };

  const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
  const approvedAmount = milestones.filter((m) => m.status === 'approved').reduce((sum, m) => sum + m.amount, 0);
  const progressPercent = totalAmount > 0 ? Math.round((approvedAmount / totalAmount) * 100) : 0;

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
          <span className="text-gray-900 font-medium">Этапы работ</span>
        </nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Link href={`/orders/${orderId}`} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Этапы работ</h1>
              <p className="text-gray-600">Заказ #{orderId}</p>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Общая сумма</span>
                <DollarSign className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalAmount.toLocaleString()} ₽</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Выполнено</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{approvedAmount.toLocaleString()} ₽</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Прогресс</span>
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{progressPercent}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <motion.div
                  className="bg-orange-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Milestone timeline */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">Загрузка...</div>
        ) : (
          <MilestoneTracker milestones={milestones} role={role} onAction={handleAction} />
        )}
      </div>

      <Footer />
    </div>
  );
}
