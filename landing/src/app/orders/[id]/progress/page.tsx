'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChevronRight, Home, ArrowLeft, Camera, Plus, Calendar, Percent } from 'lucide-react';
import api from '@/lib/api';

interface ProgressUpdate {
  id: string;
  description: string;
  progress_percent: number;
  date: string;
  photos: string[];
  author: string;
}

const mockUpdates: ProgressUpdate[] = [
  {
    id: '1',
    description: 'Завершён демонтаж старых покрытий. Стены и пол подготовлены к дальнейшим работам.',
    progress_percent: 15,
    date: '2025-01-20',
    photos: ['/placeholder-progress-1.jpg', '/placeholder-progress-2.jpg'],
    author: 'Алексей Петров',
  },
  {
    id: '2',
    description: 'Выполнена стяжка пола, штукатурка стен. Проложена новая электропроводка.',
    progress_percent: 40,
    date: '2025-02-05',
    photos: ['/placeholder-progress-3.jpg'],
    author: 'Алексей Петров',
  },
  {
    id: '3',
    description: 'Начата чистовая отделка: покраска стен в гостиной, укладка плитки в ванной.',
    progress_percent: 65,
    date: '2025-02-18',
    photos: ['/placeholder-progress-4.jpg', '/placeholder-progress-5.jpg'],
    author: 'Алексей Петров',
  },
];

export default function ProgressPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [updates, setUpdates] = useState<ProgressUpdate[]>(mockUpdates);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [newPercent, setNewPercent] = useState(65);

  useEffect(() => {
    api.getProgressUpdates(orderId)
      .then((res) => {
        if (res.data && Array.isArray(res.data) && (res.data as any[]).length > 0) {
          setUpdates(res.data as ProgressUpdate[]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  const currentProgress = updates.length > 0 ? updates[updates.length - 1].progress_percent : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const update: ProgressUpdate = {
      id: String(updates.length + 1),
      description: newDescription,
      progress_percent: newPercent,
      date: new Date().toISOString().split('T')[0],
      photos: [],
      author: 'Вы',
    };
    try {
      await api.createProgressUpdate(orderId, { description: newDescription, progress_percent: newPercent });
    } catch {}
    setUpdates([...updates, update]);
    setNewDescription('');
    setShowForm(false);
  };

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
          <span className="text-gray-900 font-medium">Прогресс</span>
        </nav>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link href={`/orders/${orderId}`} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Прогресс выполнения</h1>
                <p className="text-gray-600">Заказ #{orderId}</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Добавить обновление
            </button>
          </div>

          {/* Overall progress bar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Общий прогресс</span>
              <span className="text-2xl font-bold text-orange-600">{currentProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <motion.div
                className="bg-gradient-to-r from-orange-400 to-orange-600 h-4 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${currentProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Add update form */}
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 shadow-sm mb-8 border-2 border-orange-200"
          >
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Новое обновление</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Описание работ</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                rows={3}
                placeholder="Опишите выполненные работы..."
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Прогресс: {newPercent}%
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={newPercent}
                onChange={(e) => setNewPercent(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Фотографии</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors cursor-pointer">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Нажмите для загрузки фото</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                Отмена
              </button>
              <button type="submit" className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors">
                Опубликовать
              </button>
            </div>
          </motion.form>
        )}

        {/* Timeline */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">Загрузка...</div>
        ) : (
          <div className="space-y-6">
            {[...updates].reverse().map((update, index) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Percent className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{update.author}</span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(update.date).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                    {update.progress_percent}%
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{update.description}</p>

                {update.photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {update.photos.map((photo, i) => (
                      <div key={i} className="aspect-video rounded-xl bg-gray-100 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Camera className="w-8 h-8" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
