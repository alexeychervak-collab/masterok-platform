'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import BeforeAfterSlider from '@/components/ui/before-after-slider';
import { ChevronRight, Home, ArrowLeft, X, Clock, DollarSign, Camera, ChevronLeft } from 'lucide-react';
import api from '@/lib/api';

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  duration: string;
  cost: number;
  photos: string[];
  beforeImage?: string;
  afterImage?: string;
  category: string;
}

const mockPortfolio: PortfolioProject[] = [
  {
    id: '1',
    title: 'Ремонт студии 35 м²',
    description: 'Полный ремонт квартиры-студии в современном стиле. Перепланировка, новая электропроводка, тёплый пол, дизайнерская отделка.',
    duration: '45 дней',
    cost: 850000,
    photos: ['/placeholder-1.jpg', '/placeholder-2.jpg', '/placeholder-3.jpg'],
    beforeImage: '/placeholder-before.jpg',
    afterImage: '/placeholder-after.jpg',
    category: 'Ремонт квартир',
  },
  {
    id: '2',
    title: 'Ванная комната под ключ',
    description: 'Полная замена сантехники, укладка итальянской плитки, установка подвесного потолка и светодиодной подсветки.',
    duration: '14 дней',
    cost: 280000,
    photos: ['/placeholder-4.jpg', '/placeholder-5.jpg'],
    beforeImage: '/placeholder-before-2.jpg',
    afterImage: '/placeholder-after-2.jpg',
    category: 'Сантехника',
  },
  {
    id: '3',
    title: 'Кухня-гостиная 40 м²',
    description: 'Объединение кухни и гостиной, монтаж барной стойки, укладка паркетной доски, покраска стен.',
    duration: '30 дней',
    cost: 620000,
    photos: ['/placeholder-6.jpg', '/placeholder-7.jpg', '/placeholder-8.jpg'],
    category: 'Ремонт квартир',
  },
  {
    id: '4',
    title: 'Электрика в коттедже',
    description: 'Полная разводка электрики в двухэтажном коттедже 200 м². Установка щитка, розеток, выключателей, системы умного дома.',
    duration: '21 день',
    cost: 450000,
    photos: ['/placeholder-9.jpg'],
    category: 'Электрика',
  },
  {
    id: '5',
    title: 'Балкон под ключ',
    description: 'Утепление, остекление, отделка вагонкой, установка шкафа и освещения.',
    duration: '7 дней',
    cost: 120000,
    photos: ['/placeholder-10.jpg', '/placeholder-11.jpg'],
    beforeImage: '/placeholder-before-3.jpg',
    afterImage: '/placeholder-after-3.jpg',
    category: 'Ремонт',
  },
  {
    id: '6',
    title: 'Укладка плитки в холле',
    description: 'Укладка керамогранита на пол и мозаики на стены в прихожей 12 м².',
    duration: '5 дней',
    cost: 85000,
    photos: ['/placeholder-12.jpg'],
    category: 'Плиточные работы',
  },
];

export default function PortfolioPage() {
  const params = useParams();
  const specialistId = params?.id as string;
  const [projects, setProjects] = useState<PortfolioProject[]>(mockPortfolio);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  useEffect(() => {
    api.getPortfolio(specialistId)
      .then((res) => {
        if (res.data && Array.isArray(res.data) && (res.data as any[]).length > 0) {
          setProjects(res.data as PortfolioProject[]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [specialistId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-orange-600 transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            Главная
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/search" className="hover:text-orange-600 transition-colors">Специалисты</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/specialists/${specialistId}`} className="hover:text-orange-600 transition-colors">Профиль</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Портфолио</span>
        </nav>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link href={`/specialists/${specialistId}`} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Портфолио работ</h1>
          </div>
          <p className="text-gray-600 ml-12">{projects.length} проектов</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Загрузка...</div>
        ) : (
          /* Masonry grid */
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="break-inside-avoid bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer border border-gray-100"
                onClick={() => setSelectedProject(project)}
              >
                {/* Photo placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                  <Camera className="w-12 h-12 text-gray-300" />
                  {project.beforeImage && project.afterImage && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-orange-500 text-white text-xs rounded-lg font-medium">
                      До / После
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 text-white text-xs rounded-lg">
                    {project.photos.length} фото
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs text-orange-600 font-medium">{project.category}</span>
                  <h3 className="font-semibold text-gray-900 mt-1 mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{project.description}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {project.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      {project.cost.toLocaleString()} ₽
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Expanded project modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{selectedProject.title}</h2>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Before/After slider */}
                {selectedProject.beforeImage && selectedProject.afterImage && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">До / После</h3>
                    <BeforeAfterSlider
                      beforeImage={selectedProject.beforeImage}
                      afterImage={selectedProject.afterImage}
                    />
                  </div>
                )}

                {/* Photo gallery placeholder */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {selectedProject.photos.map((_, i) => (
                    <div key={i} className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-300" />
                    </div>
                  ))}
                </div>

                <p className="text-gray-700 mb-4">{selectedProject.description}</p>

                <div className="flex items-center gap-6 text-sm text-gray-600 pt-4 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Срок: {selectedProject.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Стоимость: {selectedProject.cost.toLocaleString()} ₽
                  </span>
                  <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium">
                    {selectedProject.category}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
