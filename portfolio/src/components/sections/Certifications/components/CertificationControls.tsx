// src/components/sections/Certifications/components/CertificationControls.tsx
'use client';

import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid3X3, List, Filter, SortAsc } from 'lucide-react';
import type { Certification } from '@/types/certification';

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'valid' | 'expiring' | 'expired' | 'lifetime' | 'featured' | 'verified';
type SortType = 'newest' | 'oldest' | 'name' | 'organization' | 'status';

interface CertificationControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
  certifications: Certification[];
  isMobile: boolean;
}

const CertificationControls = memo(({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  selectedFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  certifications,
  isMobile
}: CertificationControlsProps) => {
  
  // Calculate filter counts
  const filterOptions = useMemo(() => {
    const now = new Date();
    
    const counts = {
      all: certifications.length,
      valid: certifications.filter(cert => 
        !cert.expirationDate || new Date(cert.expirationDate) > now
      ).length,
      expired: certifications.filter(cert => 
        cert.expirationDate && new Date(cert.expirationDate) <= now
      ).length,
      expiring: certifications.filter(cert => {
        if (!cert.expirationDate) return false;
        const daysDiff = Math.ceil((new Date(cert.expirationDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff > 0 && daysDiff <= 30;
      }).length,
      lifetime: certifications.filter(cert => !cert.expirationDate).length,
      featured: certifications.filter(cert => cert.featured).length,
      verified: certifications.filter(cert => cert.isVerified).length
    };

    return [
      { key: 'all' as FilterType, label: 'All', count: counts.all },
      { key: 'valid' as FilterType, label: 'Valid', count: counts.valid },
      { key: 'featured' as FilterType, label: 'Featured', count: counts.featured },
      { key: 'verified' as FilterType, label: 'Verified', count: counts.verified },
      ...(counts.expiring > 0 ? [{ key: 'expiring' as FilterType, label: 'Expiring', count: counts.expiring }] : []),
      ...(counts.expired > 0 ? [{ key: 'expired' as FilterType, label: 'Expired', count: counts.expired }] : []),
      ...(counts.lifetime > 0 ? [{ key: 'lifetime' as FilterType, label: 'Lifetime', count: counts.lifetime }] : [])
    ];
  }, [certifications]);

  const sortOptions = [
    { key: 'newest' as SortType, label: 'Newest First' },
    { key: 'oldest' as SortType, label: 'Oldest First' },
    { key: 'name' as SortType, label: 'Name A-Z' },
    { key: 'organization' as SortType, label: 'Organization' },
    { key: 'status' as SortType, label: 'Status' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 md:space-y-6"
    >
      {/* Top Row: Search and View Controls */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        {/* Search Bar - Full width */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary dark:text-text-tertiary-dark" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search certifications..."
            className={`
              w-full pl-10 pr-4 py-2.5 md:py-3
              bg-background-secondary/50 dark:bg-background-secondary-dark/50
              border border-border-primary/20 dark:border-border-primary-dark/20
              rounded-lg md:rounded-xl
              text-text-primary dark:text-text-primary-dark
              placeholder-text-tertiary dark:placeholder-text-tertiary-dark
              focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary-dark/20
              focus:border-primary/30 dark:focus:border-primary-dark/30
              transition-all duration-300
              text-sm md:text-base
            `}
          />
        </div>

        {/* View Mode and Sort Controls */}
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          {!isMobile && (
            <div className="flex items-center bg-background-secondary/50 dark:bg-background-secondary-dark/50 rounded-lg p-1 border border-border-primary/20 dark:border-border-primary-dark/20">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`
                  p-2 rounded-md transition-all duration-200 flex items-center gap-2
                  ${viewMode === 'grid'
                    ? 'bg-primary dark:bg-primary-dark text-white shadow-sm'
                    : 'text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark'
                  }
                `}
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`
                  p-2 rounded-md transition-all duration-200 flex items-center gap-2
                  ${viewMode === 'list'
                    ? 'bg-primary dark:bg-primary-dark text-white shadow-sm'
                    : 'text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark'
                  }
                `}
              >
                <List className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">List</span>
              </button>
            </div>
          )}

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortType)}
              className={`
                appearance-none pl-3 pr-8 py-2.5
                bg-background-secondary/50 dark:bg-background-secondary-dark/50
                border border-border-primary/20 dark:border-border-primary-dark/20
                rounded-lg text-sm
                text-text-primary dark:text-text-primary-dark
                focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary-dark/20
                focus:border-primary/30 dark:focus:border-primary-dark/30
                transition-all duration-300
                cursor-pointer
              `}
            >
              {sortOptions.map(option => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
            <SortAsc className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary dark:text-text-tertiary-dark pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-wrap gap-2 md:gap-3"
      >
        {filterOptions.map((filter) => (
          <motion.button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`
              px-3 py-1.5 md:px-4 md:py-2
              rounded-full border transition-all duration-200
              text-xs md:text-sm font-medium
              flex items-center gap-1.5
              ${selectedFilter === filter.key
                ? 'bg-primary dark:bg-primary-dark text-white border-primary dark:border-primary-dark shadow-md'
                : 'bg-background-secondary/50 dark:bg-background-secondary-dark/50 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark border-border-primary/20 dark:border-border-primary-dark/20 hover:border-border-primary/40 dark:hover:border-border-primary-dark/40'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{filter.label}</span>
            <span className={`
              text-xs px-1.5 py-0.5 rounded-full
              ${selectedFilter === filter.key
                ? 'bg-white/20 text-white'
                : 'bg-text-tertiary/10 dark:bg-text-tertiary-dark/10 text-text-tertiary dark:text-text-tertiary-dark'
              }
            `}>
              {filter.count}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-between text-sm text-text-tertiary dark:text-text-tertiary-dark"
      >
        <span>
          Showing{' '}
          <span className="font-medium text-text-secondary dark:text-text-secondary-dark">
            {filterOptions.find(f => f.key === selectedFilter)?.count || 0}
          </span>{' '}
          certifications
        </span>
        
        {searchQuery && (
          <span>
            Search: <span className="font-medium text-text-secondary dark:text-text-secondary-dark">"{searchQuery}"</span>
          </span>
        )}
      </motion.div>
    </motion.div>
  );
});

CertificationControls.displayName = 'CertificationControls';

export default CertificationControls;