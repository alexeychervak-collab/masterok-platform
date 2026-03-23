'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, DollarSign, Send, Loader2 } from 'lucide-react';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: 'pending' | 'funded' | 'in_progress' | 'submitted' | 'approved';
  due_date: string;
  order: number;
}

interface MilestoneTrackerProps {
  milestones: Milestone[];
  role: 'client' | 'specialist';
  onAction: (milestoneId: string, action: 'fund' | 'submit' | 'approve') => void;
}

const statusConfig: Record<Milestone['status'], { color: string; bg: string; border: string; label: string; icon: React.ReactNode }> = {
  pending: {
    color: 'text-gray-500',
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    label: 'Ожидание',
    icon: <Clock className="w-5 h-5" />,
  },
  funded: {
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    border: 'border-blue-400',
    label: 'Оплачено',
    icon: <DollarSign className="w-5 h-5" />,
  },
  in_progress: {
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
    border: 'border-yellow-400',
    label: 'В работе',
    icon: <Loader2 className="w-5 h-5 animate-spin" />,
  },
  submitted: {
    color: 'text-orange-600',
    bg: 'bg-orange-100',
    border: 'border-orange-400',
    label: 'На проверке',
    icon: <Send className="w-5 h-5" />,
  },
  approved: {
    color: 'text-green-600',
    bg: 'bg-green-100',
    border: 'border-green-400',
    label: 'Принято',
    icon: <CheckCircle className="w-5 h-5" />,
  },
};

export default function MilestoneTracker({ milestones, role, onAction }: MilestoneTrackerProps) {
  return (
    <div className="relative">
      {milestones.map((milestone, index) => {
        const config = statusConfig[milestone.status];
        const isLast = index === milestones.length - 1;

        return (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex gap-4 pb-8"
          >
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-[19px] top-10 w-0.5 h-[calc(100%-2.5rem)] bg-gray-200" />
            )}

            {/* Status circle */}
            <div
              className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full ${config.bg} ${config.border} border-2 flex items-center justify-center ${config.color}`}
            >
              {config.icon}
            </div>

            {/* Content card */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{milestone.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{milestone.description}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
                >
                  {config.label}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {milestone.amount.toLocaleString()} ₽
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  До {new Date(milestone.due_date).toLocaleDateString('ru-RU')}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-4">
                {role === 'client' && milestone.status === 'pending' && (
                  <button
                    onClick={() => onAction(milestone.id, 'fund')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <DollarSign className="w-4 h-4" />
                    Оплатить этап
                  </button>
                )}
                {role === 'specialist' && (milestone.status === 'funded' || milestone.status === 'in_progress') && (
                  <button
                    onClick={() => onAction(milestone.id, 'submit')}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Отправить на проверку
                  </button>
                )}
                {role === 'client' && milestone.status === 'submitted' && (
                  <button
                    onClick={() => onAction(milestone.id, 'approve')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Принять работу
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
