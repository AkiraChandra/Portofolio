// src/components/sections/Certifications/components/CertificationControls.tsx
'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid3X3, List } from 'lucide-react';

interface CertificationControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedFilter: 'all' | 'active' | 'featured' | 'expired';
  setSelectedFilter: (filter: 'all' | 'active' | 'featured' | 'expired') => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

const CertificationControls = memo(({
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
  viewMode,
  setViewMode
}: CertificationControlsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8"
    >
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary dark:text-text-tertiary-dark" />
        <input
          type="text"
          placeholder="Search certifications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-background-secondary/80 dark:bg-background-secondary-dark/80 border border-border-primary/20 dark:border-border-primary-dark/20 rounded-xl text-text-primary dark:text-text-primary-dark placeholder-text-tertiary dark:placeholder-text-tertiary-dark focus:outline-none focus:border-primary/40 dark:focus:border-primary-dark/40 transition-colors"
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Filter */}
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value as any)}
          className="px-4 py-3 bg-background-secondary/80 dark:bg-background-secondary-dark/80 border border-border-primary/20 dark:border-border-primary-dark/20 rounded-xl text-text-primary dark:text-text-primary-dark focus:outline-none focus:border-primary/40 dark:focus:border-primary-dark/40 transition-colors"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="featured">Featured</option>
          <option value="expired">Expired</option>
        </select>

        {/* View Mode */}
        <div className="flex bg-background-secondary/80 dark:bg-background-secondary-dark/80 border border-border-primary/20 dark:border-border-primary-dark/20 rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary/20 dark:bg-primary-dark/20 text-primary dark:text-primary-dark'
                : 'text-text-tertiary dark:text-text-tertiary-dark hover:text-text-primary dark:hover:text-text-primary-dark'
            }`}
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-primary/20 dark:bg-primary-dark/20 text-primary dark:text-primary-dark'
                : 'text-text-tertiary dark:text-text-tertiary-dark hover:text-text-primary dark:hover:text-text-primary-dark'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

CertificationControls.displayName = 'CertificationControls';

export default CertificationControls;