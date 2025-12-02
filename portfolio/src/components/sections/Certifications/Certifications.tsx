// src/components/sections/Certifications/Certifications.tsx
'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@/hooks/common/useMediaQuery';
import { useCertifications } from '@/hooks/certifications/useCertifications';
import type { Certification } from '@/types/certification';

// Components
import CertificationStats from './components/CertificationStats';
import CertificationControls from './components/CertificationControls';
import CertificationGrid from './components/CertificationGrid';
import FeaturedCertifications from './components/FeaturedCertifications';
import CertificationModal from './components/CertificationModal';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';
import MovingStars from "@/components/ui/animations/Movingstars";
import { useCertificationsActivity } from '@/hooks/common/useSectionActivity';

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'active' | 'featured' | 'expired' | 'valid' | 'expiring' | 'lifetime' | 'verified';
type SortType = 'newest' | 'oldest' | 'name' | 'organization' | 'status';

const Certifications = () => {
  // ✅ Activity detection
  const { isActive } = useCertificationsActivity();
  
  // Hooks
  const { certifications, loading, error } = useCertifications();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const shouldReduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  // ✅ Activity logging
  useEffect(() => {
    console.log(`📜 Certifications Section: ${isActive ? 'ACTIVE' : 'SUSPENDED'}`);
  }, [isActive]);

  // State Management
  const [viewMode, setViewMode] = useState<ViewMode>('grid'); // DEFAULT TO GRID
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null);
  const [showFeatured, setShowFeatured] = useState(true);

  // Featured certifications
  const featuredCertifications = useMemo(() => 
    certifications.filter(cert => cert.featured),
    [certifications]
  );

  // Filter and Search Logic
  const filteredCertifications = useMemo(() => {
    let filtered = certifications.filter(cert => {
      // Search filter
      const matchesSearch = !searchQuery || 
        cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuingOrganization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.description?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Category filter
      switch (selectedFilter) {
        case 'valid':
          return !cert.expirationDate || new Date(cert.expirationDate) > new Date();
        case 'expired':
          return cert.expirationDate && new Date(cert.expirationDate) <= new Date();
        case 'active':
          return !cert.expirationDate || new Date(cert.expirationDate) > new Date();
        case 'lifetime':
          return !cert.expirationDate;
        case 'featured':
          return cert.featured;
        case 'verified':
          return cert.isVerified;
        default:
          return true;
      }
    });

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
        case 'oldest':
          return new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'organization':
          return a.issuingOrganization.localeCompare(b.issuingOrganization);
        case 'status':
          if (a.featured !== b.featured) return a.featured ? -1 : 1;
          if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1;
          return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [certifications, searchQuery, selectedFilter, sortBy]);

  // Enhanced Statistics Calculation
  const stats = useMemo(() => {
    const now = new Date();
    return {
      total: certifications.length,
      valid: certifications.filter(cert => 
        !cert.expirationDate || new Date(cert.expirationDate) > now
      ).length,
      active: certifications.filter(cert => 
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

  // Event Handlers
  const handleCertificationClick = useCallback((certification: Certification) => {
    setSelectedCertification(certification);
  }, []);

  const handleClosePreview = useCallback(() => {
    setSelectedCertification(null);
  }, []);

  const handleFeaturedCertificationClick = useCallback((certification: Certification) => {
    setSelectedCertification(certification);
  }, []);

  // Responsive adjustments - KEEP GRID AS DEFAULT
  useEffect(() => {
    // Only force list on very small mobile screens
    if (isMobile && window.innerWidth < 480) {
      setViewMode('list');
    }
    // Always show featured on mobile for better UX
    if (isMobile) {
      setShowFeatured(true);
    }
  }, [isMobile]);

  // Loading State
  if (loading) {
    return <LoadingState />;
  }

  // Error State
  if (error) {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500"
          >
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-text-secondary dark:text-text-secondary-dark">{error}</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="certifications" className="py-16 md:py-12 lg:py-20 relative min-h-screen bg-background-primary dark:bg-background-primary-dark">
      {/* Glow Orbs & Background Effects - Optimized */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {/* Primary glow orbs - simplified animation, only when active */}
        {isActive && (
          <>
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 dark:opacity-30"
              style={{
                background: 'radial-gradient(circle, rgba(246, 176, 13, 0.3) 0%, rgba(246, 176, 13, 0.1) 50%, transparent 100%)',
                filter: 'blur(60px)',
                willChange: 'transform'
              }}
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 dark:opacity-25"
              style={{
                background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(147, 51, 234, 0.1) 50%, transparent 100%)',
                filter: 'blur(50px)',
                willChange: 'transform'
              }}
              animate={{
                x: [0, -80, 0],
                y: [0, 60, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 6
              }}
            />
          </>
        )}

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <div
        className="w-full h-full"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(var(--color-primary), 0.15) 1px, transparent 0)`,
          backgroundSize: "80px 80px",
        }}
          />
        </div>

        {/* Floating particles - reduced count, only when active */}
        {isActive && [...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 dark:bg-primary-dark/30 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + (i % 2) * 40}%`,
              willChange: 'transform, opacity'
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 3,
            }}
          />
        ))}
        {/* Moving Stars - placed above orbs */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {isActive && <MovingStars isActive={isActive} starCount={50} />}
        </div>
      </div>
      {/* Remove or lower opacity of dark overlays to make effects visible */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent dark:via-black/20 dark:to-black z-1" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent dark:via-black/20 dark:to-black z-1" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Minimalist Header - Like Skills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 md:mb-6"
        >
          <motion.h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-text-primary dark:text-text-primary-dark">My </span>
            <span className="text-primary dark:text-primary-dark">Certifications</span>
          </motion.h1>
          
          <motion.p 
            className="text-base md:text-lg text-text-secondary dark:text-text-secondary-dark max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Validated expertise and continuous learning achievements that demonstrate my commitment to excellence.
          </motion.p>
          
          {/* Stats - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <CertificationStats stats={stats} />
          </motion.div>
        </motion.div>

        {/* Featured Certifications Section */}
        {showFeatured && featuredCertifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-0"
          >
            <FeaturedCertifications
              certifications={featuredCertifications}
              onCertificationClick={handleFeaturedCertificationClick}
            />
          </motion.div>
        )}

        {/* Minimalist Controls and Grid Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          {/* Simple Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h3 className="text-xl md:text-2xl font-bold text-text-primary dark:text-text-primary-dark">
              All Certifications
            </h3>
            
            {featuredCertifications.length > 0 && (
              <motion.button
                onClick={() => setShowFeatured(!showFeatured)}
                className={`
                  px-3 py-1.5 rounded-lg transition-all duration-300
                  border border-border-primary/20 dark:border-border-primary-dark/20
                  text-sm font-medium
                  ${showFeatured 
                    ? 'bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark' 
                    : 'bg-background-secondary/50 dark:bg-background-secondary-dark/50 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {showFeatured ? 'Hide Featured' : 'Show Featured'}
              </motion.button>
            )}
          </div>

          {/* Controls */}
          <CertificationControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            certifications={certifications}
            isMobile={isMobile}
          />

          {/* Results */}
          <AnimatePresence mode="wait">
            {filteredCertifications.length === 0 ? (
              <EmptyState 
                searchTerm={searchQuery} 
                selectedFilter={selectedFilter} 
              />
            ) : (
              <motion.div
                key={`${viewMode}-${selectedFilter}-${searchQuery}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CertificationGrid
                  certifications={filteredCertifications}
                  viewMode={viewMode}
                  onCertificationClick={handleCertificationClick}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {selectedCertification && (
            <CertificationModal
              certification={selectedCertification}
              onClose={handleClosePreview}
            />
          )}
        </AnimatePresence>
      </div>
      
      {/* ✅ Debug indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-48 right-4 bg-black/80 text-white p-2 rounded text-xs font-mono z-50 border border-yellow-500">
          <div>Certifications: {isActive ? '🟢 ACTIVE' : '🔴 SUSPENDED'}</div>
          <div>Stars: {isActive ? '🌟 ON' : '⭐ OFF'}</div>
          <div>Glows: {isActive ? '✨ ON' : '🚫 OFF'}</div>
        </div>
      )}
    </section>
  );
};

export default Certifications;