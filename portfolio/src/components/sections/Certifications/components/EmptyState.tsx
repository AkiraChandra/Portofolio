// src/components/sections/Certifications/components/EmptyState.tsx
'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

interface EmptyStateProps {
  searchTerm: string;
  selectedFilter: string;
}

const EmptyState = memo(({ searchTerm, selectedFilter }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12"
    >
      <Award className="w-16 h-16 text-text-tertiary dark:text-text-tertiary-dark mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark mb-2">
        No certifications found
      </h3>
      <p className="text-text-secondary dark:text-text-secondary-dark">
        {searchTerm || selectedFilter !== 'all' 
          ? 'Try adjusting your search or filter criteria'
          : 'No certifications available at the moment'
        }
      </p>
    </motion.div>
  );
});

EmptyState.displayName = 'EmptyState';

export default EmptyState;