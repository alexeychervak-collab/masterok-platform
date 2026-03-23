'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingBag, DollarSign, BarChart3 } from 'lucide-react';
import api from '@/lib/api';

// Generate mock data for last 30 days
const generateDailyData = (base: number, variance: number) =>
  Array.from({ length: 30 }, (_, i) => ({
    date: new Date(2025, 2, i + 1).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
    value: Math.max(0, base + Math.floor(Math.random() * variance * 2 - variance)),
  }));

const registrationsData = generateDailyData(15, 8);
const ordersData = generateDailyData(8, 5);
const revenueData = generateDailyData(150000, 80000);

const categoryBreakdown = [
  { name: 'Ремонт квартир', value: 32, color: '#f97316' },
  { name: 'Сантехника', value: 18, color: '#3b82f6' },
  { name: 'Электрика', value: 15, color: '#22c55e' },
  { name: 'Дизайн', value: 12, color: '#a855f7' },
  { name: 'Плиточные работы', value: 10, color: '#eab308' },
  { name: 'Штукатурка', value: 8, color: '#ec4899' },
  { name: 'Другое', value: 5, color: '#6b7280' },
];

function BarChart({ data, color, label, suffix = '' }: { data: { date: string; value: number }[]; color: string; label: string; suffix?: string }) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const avg = Math.round(total / data.length);

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-white">{label}</h3>
        <div className="text-sm text-gray-400">
          Среднее: <span className="text-white font-medium">{suffix === '₽' ? avg.toLocaleString() + ' ' + suffix : avg + suffix}</span>
        </div>
      </div>
      <div className="flex items-end gap-1 h-40">
        {data.map((d, i) => {
          const height = maxValue > 0 ? (d.value / maxValue) * 100 : 0;
          return (
            <motion.div
              key={i}
              className="flex-1 rounded-t-sm relative group cursor-pointer"
              style={{ backgroundColor: color, opacity: 0.7 + (d.value / maxValue) * 0.3 }}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: i * 0.02, duration: 0.5 }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {d.date}: {suffix === '₽' ? d.value.toLocaleString() + ' ' + suffix : d.value + suffix}
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}

function PieChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;

  const segments = data.map((d) => {
    const angle = (d.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    return { ...d, startAngle, angle, percentage: Math.round((d.value / total) * 100) };
  });

  // Build SVG path for each segment
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 80;

  const describeArc = (startAngle: number, endAngle: number) => {
    const start = {
      x: cx + r * Math.cos(((startAngle - 90) * Math.PI) / 180),
      y: cy + r * Math.sin(((startAngle - 90) * Math.PI) / 180),
    };
    const end = {
      x: cx + r * Math.cos(((endAngle - 90) * Math.PI) / 180),
      y: cy + r * Math.sin(((endAngle - 90) * Math.PI) / 180),
    };
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
  };

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
      <h3 className="font-semibold text-white mb-6">Заказы по категориям</h3>
      <div className="flex items-center gap-8">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
          {segments.map((seg, i) => (
            <motion.path
              key={i}
              d={describeArc(seg.startAngle, seg.startAngle + seg.angle - 0.5)}
              fill={seg.color}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          ))}
          {/* Center circle for donut effect */}
          <circle cx={cx} cy={cy} r={45} fill="#1f2937" />
          <text x={cx} y={cy - 5} textAnchor="middle" className="text-lg font-bold fill-white">{total}%</text>
          <text x={cx} y={cy + 12} textAnchor="middle" className="text-[10px] fill-gray-400">всего</text>
        </svg>
        <div className="flex-1 space-y-2">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="text-sm text-gray-300 flex-1">{seg.name}</span>
              <span className="text-sm text-white font-medium">{seg.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  useEffect(() => {
    api.getAnalytics().catch(() => {});
  }, []);

  const summaryCards = [
    { label: 'Регистрации (мес.)', value: registrationsData.reduce((s, d) => s + d.value, 0).toString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { label: 'Заказы (мес.)', value: ordersData.reduce((s, d) => s + d.value, 0).toString(), icon: ShoppingBag, color: 'text-orange-400', bg: 'bg-orange-500/20' },
    { label: 'Выручка (мес.)', value: `${(revenueData.reduce((s, d) => s + d.value, 0) / 1000000).toFixed(1)}M ₽`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/20' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Аналитика</h1>
        <p className="text-gray-400">Статистика платформы за последние 30 дней</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <span className="text-sm text-gray-400">{card.label}</span>
              </div>
              <div className="text-2xl font-bold text-white">{card.value}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <BarChart data={registrationsData} color="#3b82f6" label="Регистрации за день" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <BarChart data={ordersData} color="#f97316" label="Заказы за день" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <BarChart data={revenueData} color="#22c55e" label="Выручка за день" suffix="₽" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <PieChart data={categoryBreakdown} />
        </motion.div>
      </div>
    </div>
  );
}
