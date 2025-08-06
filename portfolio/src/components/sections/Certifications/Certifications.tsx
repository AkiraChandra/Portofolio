// src/components/sections/Certifications/Certifications.tsx (Enhanced Integration)
'use client';

import React, { memo, useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';
import CertificationCard from './components/CertificationCard';
import CertificationPreview from './components/CertificationPreview';
import CertificationControls from './components/CertificationControls';
import FeaturedCertifications from './components/FeaturedCertifications';
import { useCertifications } from '@/hooks/certifications/useCertifications';
import { useMediaQuery } from '@/hooks/common/useMediaQuery';
import { filterCertificationsByStatus } from './utils/certificationUtils';
import type { Certification } from '@/types/certification';

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'valid' | 'expiring' | 'expired' | 'lifetime' | 'featured' | 'verified';
type SortBy = 'date' | 'name' | 'organization' | 'status';

const Certifications: React.FC = memo(() => {
  // Responsive Detection
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  
  // Enhanced State Management
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [showFeatured, setShowFeatured] = useState(true);

  // Data Acquisition
  const { certifications, loading, error, refetch } = useCertifications();

  // Strategic Data Processing: Featured Certifications Extraction
  const featuredCertifications = useMemo(() => {
    if (!certifications || certifications.length === 0) return [];
    
    // Primary: Extract explicitly featured certifications
    let featured = certifications.filter(cert => cert.featured === true);
    
    // Fallback Strategy: Auto-select high-value certifications
    if (featured.length === 0) {
      featured = certifications
        .filter(cert => !cert.isExpired)
        .sort((a, b) => {
          // Priority Algorithm: Verified > Recent
          if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1;
          // If both are the same, sort by issueDate (most recent first)
          return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
        })
        .slice(0, 6); // Optimal carousel size
    }
    
    return featured.slice(0, 8); // Maximum featured items
  }, [certifications]);

  // Enhanced Filtering Logic
  const filteredAndSortedCertifications = useMemo(() => {
    let filtered = certifications.filter(cert => {
      const matchesSearch = !searchQuery || 
        cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuingOrganization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });

    // Apply status-based filtering
    filtered = filterCertificationsByStatus(filtered, selectedFilter);

    // Intelligent Sorting Algorithm
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'organization':
          return a.issuingOrganization.localeCompare(b.issuingOrganization);
        case 'status':
          // Multi-criteria sorting: Featured > Verified > Valid > Recent
          if (a.featured !== b.featured) return a.featured ? -1 : 1;
          if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1;
          return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [certifications, searchQuery, selectedFilter, sortBy]);

  // Comprehensive Statistics Calculation
  const stats = useMemo(() => {
    const now = new Date();
    return {
      total: certifications.length,
      valid: certifications.filter(cert => 
        !cert.expirationDate || new Date(cert.expirationDate) > now
      ).length,
      expiring: certifications.filter(cert => {
        if (!cert.expirationDate) return false;
        const daysDiff = Math.ceil((new Date(cert.expirationDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff > 0 && daysDiff <= 30;
      }).length,
      expired: certifications.filter(cert => 
        cert.expirationDate && new Date(cert.expirationDate) <= now
      ).length,
      lifetime: certifications.filter(cert => !cert.expirationDate).length,
      featured: certifications.filter(cert => cert.featured).length,
      verified: certifications.filter(cert => cert.isVerified).length
    };
  }, [certifications]);

  // Enhanced Event Handlers
  const handleCertificationClick = useCallback((certification: Certification) => {
    setSelectedCertification(certification);
  }, []);

  const handleClosePreview = useCallback(() => {
    setSelectedCertification(null);
  }, []);

  const handleFeaturedCertificationClick = useCallback((certification: Certification) => {
    setSelectedCertification(certification);
  }, []);

  // Responsive Layout Adjustments
  useEffect(() => {
    if (isMobile) {
      setViewMode('list');
      setShowFeatured(true); // Always show featured on mobile for better UX
    }
  }, [isMobile]);

  // Loading State Management
  if (loading) {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-background-secondary dark:bg-background-secondary-dark rounded w-64 mx-auto"></div>
              <div className="h-4 bg-background-secondary dark:bg-background-secondary-dark rounded w-96 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-32 bg-background-secondary dark:bg-background-secondary-dark rounded-xl"></div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Error State Management
  if (error) {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Award className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark mb-2">
              Error Loading Certifications
            </h3>
            <p className="text-red-500 mb-4">Unable to load certifications. Please try again.</p>
            <motion.button 
              onClick={refetch}
              className="px-6 py-3 bg-primary dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Retry Loading
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="certifications" className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 dark:bg-primary-dark/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 dark:bg-secondary-dark/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary dark:text-text-primary-dark mb-6">
            Professional Certifications
          </h2>
          <p className="text-lg md:text-xl text-text-secondary dark:text-text-secondary-dark max-w-3xl mx-auto leading-relaxed">
            Validated expertise and continuous learning achievements that demonstrate my commitment to professional excellence and industry best practices.
          </p>
          
          {/* Enhanced Statistics Display */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-10">
            {[
              { label: 'Total', value: stats.total, color: 'text-primary dark:text-primary-dark' },
              { label: 'Valid', value: stats.valid, color: 'text-green-500' },
              { label: 'Featured', value: stats.featured, color: 'text-yellow-400' },
              ...(stats.expiring > 0 ? [{ label: 'Expiring', value: stats.expiring, color: 'text-orange-500' }] : [])
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="text-center min-w-[80px]"
              >
                <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-text-tertiary dark:text-text-tertiary-dark font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Strategic Integration: Featured Certifications Section */}
        {showFeatured && featuredCertifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-20"
          >
            <FeaturedCertifications
              certifications={featuredCertifications}
              onCertificationClick={handleFeaturedCertificationClick}
            />
          </motion.div>
        )}

        {/* Enhanced Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          {/* Toggle Featured Section */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
              All Certifications
            </h3>
            
            {featuredCertifications.length > 0 && (
              <motion.button
                onClick={() => setShowFeatured(!showFeatured)}
                className="px-4 py-2 rounded-lg bg-background-secondary/50 dark:bg-background-secondary-dark/50 border border-border-primary/20 dark:border-border-primary-dark/20 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {showFeatured ? 'Hide Featured' : 'Show Featured'}
              </motion.button>
            )}
          </div>

          <CertificationControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            viewMode={viewMode}
            setViewMode={setViewMode}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            stats={stats}
          />
        </motion.div>

        {/* Enhanced Certifications Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filteredAndSortedCertifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <Award className="w-20 h-20 text-text-tertiary dark:text-text-tertiary-dark mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark mb-3">
                No Certifications Found
              </h3>
              <p className="text-text-secondary dark:text-text-secondary-dark max-w-md mx-auto">
                {searchQuery || selectedFilter !== 'all' 
                  ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
                  : 'No certifications are currently available to display.'}
              </p>
              
              {(searchQuery || selectedFilter !== 'all') && (
                <motion.button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFilter('all');
                  }}
                  className="mt-4 px-4 py-2 bg-primary/20 dark:bg-primary-dark/20 text-primary dark:text-primary-dark rounded-lg hover:bg-primary/30 dark:hover:bg-primary-dark/30 transition-colors font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear Filters
                </motion.button>
              )}
            </motion.div>
          ) : (
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'space-y-4'
              }
            `}>
              <AnimatePresence mode="popLayout">
                {filteredAndSortedCertifications.map((certification, index) => (
                  <motion.div
                    key={certification.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: Math.min(index * 0.05, 0.5),
                      layout: { duration: 0.3 }
                    }}
                  >
                    <CertificationCard
                      certification={certification}
                      viewMode={viewMode}
                      isActive={selectedCertification?.id === certification.id}
                      isFeatured={certification.featured}
                      onClick={() => handleCertificationClick(certification)}
                      className="w-full"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Enhanced Preview Modal */}
        <AnimatePresence>
          {selectedCertification && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={handleClosePreview}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <CertificationPreview
                  certification={selectedCertification}
                  isVisible={true}
                  onClose={handleClosePreview}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
});

Certifications.displayName = 'Certifications';

export default Certifications;