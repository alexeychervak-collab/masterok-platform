'use client';

import { motion } from 'framer-motion';

interface MatchScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function MatchScoreBadge({ score, size = 'md' }: MatchScoreBadgeProps) {
  const sizeConfig = {
    sm: { width: 48, stroke: 3, fontSize: 'text-xs', label: 'text-[8px]' },
    md: { width: 64, stroke: 4, fontSize: 'text-sm', label: 'text-[10px]' },
    lg: { width: 80, stroke: 5, fontSize: 'text-lg', label: 'text-xs' },
  };

  const config = sizeConfig[size];
  const radius = (config.width - config.stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (score: number) => {
    if (score < 50) return { stroke: '#ef4444', text: 'text-red-500' };
    if (score < 75) return { stroke: '#f59e0b', text: 'text-amber-500' };
    return { stroke: '#22c55e', text: 'text-green-500' };
  };

  const color = getColor(score);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: config.width, height: config.width }}>
      <svg
        width={config.width}
        height={config.width}
        viewBox={`0 0 ${config.width} ${config.width}`}
        className="-rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={config.stroke}
        />
        {/* Animated fill circle */}
        <motion.circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-bold ${config.fontSize} ${color.text}`}>{score}%</span>
      </div>
    </div>
  );
}
