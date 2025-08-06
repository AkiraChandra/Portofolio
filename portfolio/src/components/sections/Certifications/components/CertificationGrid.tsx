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

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20,
      scale: shouldReduceMotion ? 1 : 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: "easeOut"
      }
    }
  };

  // Enhanced grid classes for better responsiveness
  const gridClasses = viewMode === 'grid'
    ? `grid gap-4 md:gap-6 lg:gap-8
       grid-cols-1
       sm:grid-cols-2 
       lg:grid-cols-2
       xl:grid-cols-3
       2xl:grid-cols-4`
    : 'space-y-3 md:space-y-4 lg:space-y-6';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`${gridClasses} w-full`}
    >
      {certifications.map((certification, index) => (
        <motion.div
          key={certification.id}
          variants={itemVariants}
          className="w-full"
          style={{
            // Stagger delay for smoother animation
            animationDelay: shouldReduceMotion ? '0ms' : `${index * 50}ms`
          }}
        >
          <CertificationCard
            certification={certification}
            viewMode={viewMode}
            onClick={() => onCertificationClick(certification)}
            isFeatured={certification.featured}
            className="h-full" // Ensure cards fill container height in grid
          />
        </motion.div>
      ))}
    </motion.div>
  );
});

CertificationGrid.displayName = 'CertificationGrid';

export default CertificationGrid;