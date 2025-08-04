// src/components/sections/Certifications/components/CertificationGrid.tsx
'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Certification } from '@/types/certification';
import CertificationCard from './CertificationCard';

interface CertificationGridProps {
  certifications: Certification[];
  viewMode: 'grid' | 'list';
  onCertificationClick: (cert: Certification) => void;
  shouldReduceMotion: boolean;
}

const CertificationGrid = memo(({ 
  certifications, 
  viewMode, 
  onCertificationClick, 
  shouldReduceMotion 
}: CertificationGridProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: 0.1
      }
    }
  };

  const gridClasses = viewMode === 'grid'
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    : 'space-y-4';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={gridClasses}
    >
      {certifications.map((certification) => (
        <CertificationCard
          key={certification.id}
          certification={certification}
          viewMode={viewMode}
          onClick={onCertificationClick}
        />
      ))}
    </motion.div>
  );
});

CertificationGrid.displayName = 'CertificationGrid';

export default CertificationGrid;