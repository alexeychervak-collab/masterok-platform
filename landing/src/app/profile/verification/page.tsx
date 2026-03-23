'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChevronRight, Home, Upload, FileText, Shield, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

type DocType = 'passport' | 'diploma' | 'license' | 'insurance';
type DocStatus = 'none' | 'pending' | 'under_review' | 'approved' | 'rejected';

interface VerificationDoc {
  type: DocType;
  label: string;
  description: string;
  status: DocStatus;
  fileName?: string;
  rejectionReason?: string;
}

const initialDocs: VerificationDoc[] = [
  { type: 'passport', label: 'Паспорт', description: 'Скан или фото основной страницы паспорта', status: 'none' },
  { type: 'diploma', label: 'Диплом / сертификат', description: 'Документ об образовании или квалификации', status: 'none' },
  { type: 'license', label: 'Лицензия', description: 'Лицензия или допуск СРО (при наличии)', status: 'none' },
  { type: 'insurance', label: 'Страховка', description: 'Полис страхования ответственности (при наличии)', status: 'none' },
];

const statusConfig: Record<DocStatus, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  none: { label: 'Не загружен', icon: <Upload className="w-4 h-4" />, color: 'text-gray-500', bg: 'bg-gray-100' },
  pending: { label: 'Ожидает отправки', icon: <Clock className="w-4 h-4" />, color: 'text-blue-600', bg: 'bg-blue-100' },
  under_review: { label: 'На проверке', icon: <AlertCircle className="w-4 h-4" />, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  approved: { label: 'Подтверждён', icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600', bg: 'bg-green-100' },
  rejected: { label: 'Отклонён', icon: <XCircle className="w-4 h-4" />, color: 'text-red-600', bg: 'bg-red-100' },
};

export default function VerificationPage() {
  const [docs, setDocs] = useState<VerificationDoc[]>(initialDocs);
  const [uploading, setUploading] = useState<DocType | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getMyVerification()
      .then((res) => {
        if (res.data && Array.isArray((res.data as any).documents)) {
          const apiDocs = (res.data as any).documents;
          setDocs((prev) =>
            prev.map((d) => {
              const found = apiDocs.find((ad: any) => ad.type === d.type);
              if (found) return { ...d, status: found.status, fileName: found.fileName, rejectionReason: found.rejectionReason };
              return d;
            })
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleFileSelect = (docType: DocType) => {
    // Simulate file upload
    setUploading(docType);
    setTimeout(() => {
      setDocs((prev) =>
        prev.map((d) => (d.type === docType ? { ...d, status: 'pending' as DocStatus, fileName: `${docType}_document.pdf` } : d))
      );
      setUploading(null);
    }, 1500);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const pendingDocs = docs.filter((d) => d.status === 'pending');
    try {
      await api.submitVerification({ documents: pendingDocs.map((d) => ({ type: d.type, fileName: d.fileName })) });
    } catch {}
    setDocs((prev) =>
      prev.map((d) => (d.status === 'pending' ? { ...d, status: 'under_review' as DocStatus } : d))
    );
    setSubmitting(false);
  };

  const hasPendingUploads = docs.some((d) => d.status === 'pending');
  const overallStatus = docs.every((d) => d.status === 'approved')
    ? 'approved'
    : docs.some((d) => d.status === 'under_review')
    ? 'under_review'
    : docs.some((d) => d.status === 'rejected')
    ? 'rejected'
    : 'none';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-orange-600 transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            Главная
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/profile" className="hover:text-orange-600 transition-colors">Профиль</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Верификация</span>
        </nav>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Верификация документов</h1>
          <p className="text-gray-600">Загрузите документы для подтверждения вашей квалификации. Верифицированные специалисты получают больше заказов.</p>
        </motion.div>

        {/* Overall status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${overallStatus === 'approved' ? 'bg-green-100' : overallStatus === 'under_review' ? 'bg-yellow-100' : 'bg-gray-100'}`}>
              <Shield className={`w-6 h-6 ${overallStatus === 'approved' ? 'text-green-600' : overallStatus === 'under_review' ? 'text-yellow-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {overallStatus === 'approved' && 'Верификация пройдена'}
                {overallStatus === 'under_review' && 'Документы на проверке'}
                {overallStatus === 'rejected' && 'Требуется повторная загрузка'}
                {overallStatus === 'none' && 'Верификация не начата'}
              </h2>
              <p className="text-sm text-gray-600">
                {overallStatus === 'approved' && 'Ваш профиль верифицирован. Заказчики видят значок подтверждения.'}
                {overallStatus === 'under_review' && 'Мы проверяем ваши документы. Обычно это занимает 1-2 рабочих дня.'}
                {overallStatus === 'rejected' && 'Некоторые документы были отклонены. Загрузите исправленные версии.'}
                {overallStatus === 'none' && 'Загрузите документы, чтобы начать процесс верификации.'}
              </p>
            </div>
          </div>

          {/* Progress tracker */}
          <div className="flex items-center gap-2 mt-4">
            {['Загрузка', 'На проверке', 'Подтверждено'].map((step, i) => {
              const stepIndex = overallStatus === 'approved' ? 3 : overallStatus === 'under_review' ? 2 : hasPendingUploads ? 1 : 0;
              const isActive = i < stepIndex;
              const isCurrent = i === stepIndex - 1;
              return (
                <div key={step} className="flex items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${isActive ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {i + 1}
                  </div>
                  <span className={`ml-2 text-xs ${isActive ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>{step}</span>
                  {i < 2 && <div className={`flex-1 h-0.5 mx-2 ${isActive ? 'bg-orange-500' : 'bg-gray-200'}`} />}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Document cards */}
        <div className="space-y-4">
          {docs.map((doc, index) => {
            const config = statusConfig[doc.status];
            return (
              <motion.div
                key={doc.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{doc.label}</h3>
                      <p className="text-sm text-gray-600 mt-0.5">{doc.description}</p>
                      {doc.fileName && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {doc.fileName}
                        </p>
                      )}
                      {doc.status === 'rejected' && doc.rejectionReason && (
                        <p className="text-xs text-red-600 mt-1">Причина: {doc.rejectionReason}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.bg} ${config.color}`}>
                      {config.icon}
                      {config.label}
                    </span>
                    {(doc.status === 'none' || doc.status === 'rejected') && (
                      <button
                        onClick={() => handleFileSelect(doc.type)}
                        disabled={uploading === doc.type}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        {uploading === doc.type ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Загрузка...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Загрузить
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Submit button */}
        {hasPendingUploads && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Отправить на проверку
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
