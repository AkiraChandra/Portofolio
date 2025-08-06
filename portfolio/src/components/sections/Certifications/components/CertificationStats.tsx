// src/components/sections/Certifications/components/CertificationStats.tsx
'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle, Star, AlertTriangle } from 'lucide-react';

interface CertificationStatsProps {
  stats: {
    total: number;
    active: number;
    featured: number;
    expired: number;
  };
}

const CertificationStats = memo(({ stats }: CertificationStatsProps) => {
  const statsConfig = [
    { label: 'Total', value: stats.total, icon: Award, color: '#6366f1' },
    { label: 'Active', value: stats.active, icon: CheckCircle, color: '#10b981' },
    { label: 'Featured', value: stats.featured, icon: Star, color: '#f59e0b' },
    { label: 'Expired', value: stats.expired, icon: AlertTriangle, color: '#ef4444' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-6"
    >
      {statsConfig.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 + (index * 0.05) }}
          className="bg-background-secondary/80 dark:bg-background-secondary-dark/80 backdrop-blur-sm border border-border-primary/20 dark:border-border-primary-dark/20 rounded-lg px-4 py-2 md:px-6 md:py-3 flex items-center gap-3 hover:scale-105 transition-transform duration-200 min-w-[120px] md:min-w-[140px]"
        >
          <div className="text-xs md:text-sm text-text-tertiary dark:text-text-tertiary-dark font-medium mt-0.5">
              {stat.label}
            </div>
          <stat.icon 
            className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0"
            style={{ color: stat.color }}
          />
          <div className="text-left">
            <div className="text-xl md:text-2xl font-bold text-text-primary dark:text-text-primary-dark leading-none">
              {stat.value}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
});

CertificationStats.displayName = 'CertificationStats';

export default CertificationStats;