// src/components/sections/Certifications/components/CertificationControls.tsx
'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid3X3, List, Filter } from 'lucide-react';

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'valid' | 'expiring' | 'expired' | 'lifetime' | 'featured' | 'verified';

interface CertificationControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFilter: FilterType;
  setSelectedFilter: (filter: FilterType) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  stats: {
    total: number;
    valid: number;
    expiring: number;
    expired: number;
    lifetime: number;
    featured: number;
    verified: number;
  };
}

const CertificationControls = memo(({
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
  viewMode,
  setViewMode,
  showFilters,
  setShowFilters,
  stats
}: CertificationControlsProps) => {
  const filterOptions = [
    { value: 'all' as const, label: 'All', count: stats.total },
    { value: 'valid' as const, label: 'Valid', count: stats.valid },
    { value: 'expiring' as const, label: 'Expiring Soon', count: stats.expiring },
    { value: 'expired' as const, label: 'Expired', count: stats.expired },
    { value: 'lifetime' as const, label: 'Lifetime', count: stats.lifetime },
    { value: 'featured' as const, label: 'Featured', count: stats.featured },
    { value: 'verified' as const, label: 'Verified', count: stats.verified }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mb-8"
    >
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary dark:text-text-tertiary-dark" />
          <input
            type="text"
            placeholder="Search certifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-background-secondary/50 dark:bg-background-secondary-dark/50 border border-border-primary/20 dark:border-border-primary-dark/20 text-text-primary dark:text-text-primary-dark placeholder-text-tertiary dark:placeholder-text-tertiary-dark focus:border-primary dark:focus:border-primary-dark focus:outline-none transition-colors"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl border transition-colors flex items-center gap-2 ${
              showFilters || selectedFilter !== 'all'
                ? 'bg-primary dark:bg-primary-dark text-white border-primary dark:border-primary-dark'
                : 'bg-background-secondary/50 dark:bg-background-secondary-dark/50 border-border-primary/20 dark:border-border-primary-dark/20 text-text-primary dark:text-text-primary-dark hover:border-primary/30 dark:hover:border-primary-dark/30'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>

          {/* View Toggle */}
          <div className="flex items-center bg-background-secondary/50 dark:bg-background-secondary-dark/50 rounded-xl border border-border-primary/20 dark:border-border-primary-dark/20 p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary dark:bg-primary-dark text-white'
                  : 'text-text-tertiary dark:text-text-tertiary-dark hover:text-text-primary dark:hover:text-text-primary-dark'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary dark:bg-primary-dark text-white'
                  : 'text-text-tertiary dark:text-text-tertiary-dark hover:text-text-primary dark:hover:text-text-primary-dark'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 p-4 bg-background-secondary/30 dark:bg-background-secondary-dark/30 rounded-xl border border-border-primary/10 dark:border-border-primary-dark/10"
        >
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedFilter === filter.value
                    ? 'bg-primary dark:bg-primary-dark text-white'
                    : 'bg-background-secondary/50 dark:bg-background-secondary-dark/50 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark'
                }`}
              >
                {filter.label}
                <span className="text-xs opacity-75">({filter.count})</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
});

CertificationControls.displayName = 'CertificationControls';

export default CertificationControls;