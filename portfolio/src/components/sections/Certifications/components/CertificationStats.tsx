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
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
    >
      {statsConfig.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 + (index * 0.05) }}
          className="bg-background-secondary/80 dark:bg-background-secondary-dark/80 backdrop-blur-sm border border-border-primary/20 dark:border-border-primary-dark/20 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-200"
        >
          <stat.icon 
            className="w-6 h-6 mx-auto mb-2"
            style={{ color: stat.color }}
          />
          <div className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
            {stat.value}
          </div>
          <div className="text-sm text-text-tertiary dark:text-text-tertiary-dark">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
});

CertificationStats.displayName = 'CertificationStats';

export default CertificationStats;