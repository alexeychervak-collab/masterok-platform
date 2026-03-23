'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, XCircle, Eye, FileText, Clock, User, X } from 'lucide-react';
import api from '@/lib/api';

interface VerificationRequest {
  id: string;
  specialistName: string;
  email: string;
  documentType: string;
  fileName: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockVerifications: VerificationRequest[] = [
  { id: '1', specialistName: 'Алексей Иванов', email: 'alex@example.com', documentType: 'Паспорт', fileName: 'passport_scan.pdf', submittedAt: '2025-03-20', status: 'pending' },
  { id: '2', specialistName: 'Сергей Смирнов', email: 'sergey@example.com', documentType: 'Диплом', fileName: 'diploma.pdf', submittedAt: '2025-03-19', status: 'pending' },
  { id: '3', specialistName: 'Николай Волков', email: 'nikolay@example.com', documentType: 'Лицензия СРО', fileName: 'sro_license.pdf', submittedAt: '2025-03-18', status: 'pending' },
  { id: '4', specialistName: 'Андрей Петров', email: 'andrey@example.com', documentType: 'Страховка', fileName: 'insurance.pdf', submittedAt: '2025-03-17', status: 'pending' },
  { id: '5', specialistName: 'Виктор Сидоров', email: 'victor@example.com', documentType: 'Паспорт', fileName: 'id_document.pdf', submittedAt: '2025-03-15', status: 'approved' },
  { id: '6', specialistName: 'Ольга Кузнецова', email: 'olga@example.com', documentType: 'Диплом', fileName: 'diploma_2020.pdf', submittedAt: '2025-03-14', status: 'rejected' },
];

export default function AdminVerificationPage() {
  const [verifications, setVerifications] = useState<VerificationRequest[]>(mockVerifications);
  const [selectedVerification, setSelectedVerification] = useState<VerificationRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('pending');

  useEffect(() => {
    api.getAdminVerifications({ status: filterStatus !== 'all' ? filterStatus : undefined })
      .then((res) => {
        if (res.data && Array.isArray(res.data) && (res.data as any[]).length > 0) {
          setVerifications(res.data as VerificationRequest[]);
        }
      })
      .catch(() => {});
  }, []);

  const handleApprove = async (id: string) => {
    try { await api.approveVerification(id); } catch {}
    setVerifications((prev) => prev.map((v) => (v.id === id ? { ...v, status: 'approved' as const } : v)));
    setSelectedVerification(null);
  };

  const handleReject = async (id: string) => {
    if (!rejectionReason.trim()) return;
    try { await api.rejectVerification(id, rejectionReason); } catch {}
    setVerifications((prev) => prev.map((v) => (v.id === id ? { ...v, status: 'rejected' as const } : v)));
    setSelectedVerification(null);
    setShowRejectForm(false);
    setRejectionReason('');
  };

  const filtered = verifications.filter((v) => filterStatus === 'all' || v.status === filterStatus);
  const pendingCount = verifications.filter((v) => v.status === 'pending').length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Верификация</h1>
        <p className="text-gray-400">{pendingCount} заявок ожидают проверки</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { value: 'pending', label: 'Ожидающие' },
          { value: 'approved', label: 'Одобренные' },
          { value: 'rejected', label: 'Отклонённые' },
          { value: 'all', label: 'Все' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterStatus(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterStatus === tab.value ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Verification cards */}
      <div className="space-y-4">
        {filtered.map((ver, index) => (
          <motion.div
            key={ver.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gray-800 rounded-2xl border border-gray-700 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-700 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{ver.specialistName}</h3>
                  <p className="text-sm text-gray-400">{ver.email}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {ver.documentType}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(ver.submittedAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{ver.fileName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {ver.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => setSelectedVerification(ver)}
                      className="p-2 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-colors"
                      title="Просмотреть"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleApprove(ver.id)}
                      className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl text-sm font-medium hover:bg-green-500/30 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Одобрить
                    </button>
                    <button
                      onClick={() => { setSelectedVerification(ver); setShowRejectForm(true); }}
                      className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/30 transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      Отклонить
                    </button>
                  </>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    ver.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {ver.status === 'approved' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {ver.status === 'approved' ? 'Одобрен' : 'Отклонён'}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Нет заявок</h3>
            <p className="text-gray-500">В этой категории пока нет заявок на верификацию</p>
          </div>
        )}
      </div>

      {/* Rejection modal */}
      <AnimatePresence>
        {showRejectForm && selectedVerification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => { setShowRejectForm(false); setSelectedVerification(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-2xl max-w-md w-full border border-gray-700 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Отклонить документ</h3>
                <button onClick={() => { setShowRejectForm(false); setSelectedVerification(null); }} className="p-1 hover:bg-gray-700 rounded-lg">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                {selectedVerification.specialistName} - {selectedVerification.documentType}
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Укажите причину отклонения..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none resize-none mb-4"
                rows={3}
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => { setShowRejectForm(false); setSelectedVerification(null); }}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={() => handleReject(selectedVerification.id)}
                  disabled={!rejectionReason.trim()}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  Отклонить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
