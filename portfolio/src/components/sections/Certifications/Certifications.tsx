// src/components/sections/Certifications/Certifications.tsx
'use client';

import React, { useState, useMemo, useCallback, memo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, Search, Grid3X3, List, Filter, Star, X,
  CheckCircle, AlertTriangle, Clock, Building2
} from 'lucide-react';
import { useCertifications } from '@/hooks/certifications/useCertifications';
import { useReducedMotion } from '@/hooks/common/useMediaQuery';
import { Certification } from '@/types/certification';
import MovingStars from '@/components/ui/animations/Movingstars';
import FeaturedCertifications from './components/FeaturedCertifications';
import CertificationGrid from './components/CertificationGrid';
import CertificationModal from './components/CertificationModal';
import CertificationStats from './components/CertificationStats';
import LoadingState from './components/LoadingState';

const Certifications = memo(() => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'featured' | 'expired'>('all');
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [selectedFeaturedCert, setSelectedFeaturedCert] = useState<Certification | null>(null);
  
  const { certifications, loading } = useCertifications();
  const shouldReduceMotion = useReducedMotion();

  // ✅ MEMOIZED FEATURED CERTIFICATIONS (sama seperti Skills)
  const featuredCertifications = useMemo(() => {
    if (!certifications || certifications.length === 0) return [];
    
    let featured = certifications.filter(cert => cert.featured === true);
    
    if (featured.length === 0) {
      // Fallback ke active certifications dengan status terbaik
      featured = certifications
        .filter(cert => !cert.isExpired)
        .sort((a, b) => {
          if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1;
          return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
        })
        .slice(0, 6);
    }
    
    return featured.slice(0, 6); // Max 6 untuk rotating
  }, [certifications]);

  // ✅ MEMOIZED FILTERED DATA
  const filteredCertifications = useMemo(() => {
    if (!certifications) return [];

    return certifications.filter(cert => {
      const matchesSearch = cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cert.issuingOrganization.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = selectedFilter === 'all' ||
                           (selectedFilter === 'active' && !cert.isExpired) ||
                           (selectedFilter === 'featured' && cert.featured) ||
                           (selectedFilter === 'expired' && cert.isExpired);

      return matchesSearch && matchesFilter;
    });
  }, [certifications, searchTerm, selectedFilter]);

  // ✅ MEMOIZED STATS
  const stats = useMemo(() => {
    if (!certifications) return { total: 0, active: 0, featured: 0, expired: 0 };
    
    return {
      total: certifications.length,
      active: certifications.filter(cert => !cert.isExpired).length,
      featured: certifications.filter(cert => cert.featured).length,
      expired: certifications.filter(cert => cert.isExpired).length
    };
  }, [certifications]);

  const handleCertificationClick = useCallback((cert: Certification) => {
    setSelectedCert(cert);
  }, []);

  const handleFeaturedCertClick = useCallback((cert: Certification) => {
    setSelectedFeaturedCert(cert);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCert(null);
    setSelectedFeaturedCert(null);
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <section className="relative bg-black overflow-hidden py-24">
      {/* Moving Stars Background - sama seperti Skills */}
      <div className="absolute inset-0 z-0">
        <MovingStars />
      </div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        
        {/* Header - sama style dengan Skills */}
        <div className="text-center">
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            My <span className="text-primary">Certifications</span>
          </motion.h1>
          <motion.p 
            className="text-gray-300 max-w-2xl mx-auto mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Professional certifications and achievements showcasing continuous learning and expertise
          </motion.p>

          {/* Stats - sama seperti Skills */}
          <motion.div 
            className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <span><strong className="text-primary">{stats.total}</strong> Certifications</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span><strong className="text-green-400">{stats.active}</strong> Active</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span><strong className="text-yellow-400">{featuredCertifications.length}</strong> Featured</span>
            </div>
          </motion.div>
        </div>

        {/* Featured Certifications Section - sama seperti Skills */}
        {featuredCertifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-16"
          >
            <div className="flex items-center gap-2 mb-8">
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
              <h2 className="text-xl font-bold text-white">Featured Certifications</h2>
            </div>
            
            <FeaturedCertifications 
              certifications={featuredCertifications}
              onCertificationClick={handleFeaturedCertClick}
            />
          </motion.div>
        )}

        {/* Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search certifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Filter */}
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as any)}
              className="px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-xl text-white focus:outline-none focus:border-primary/40 transition-colors"
            >
              <option value="all">All ({stats.total})</option>
              <option value="active">Active ({stats.active})</option>
              <option value="featured">Featured ({stats.featured})</option>
              <option value="expired">Expired ({stats.expired})</option>
            </select>

            {/* View Mode */}
            <div className="flex bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary/20 text-primary'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary/20 text-primary'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* All Certifications Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-6"
        >
          <p className="text-gray-400 text-sm">
            {filteredCertifications.length} of {stats.total} certifications
          </p>
        </motion.div>

        {/* Certifications Grid/List */}
        {filteredCertifications.length > 0 ? (
          <CertificationGrid
            certifications={filteredCertifications}
            viewMode={viewMode}
            onCertificationClick={handleCertificationClick}
            shouldReduceMotion={shouldReduceMotion}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No certifications found
            </h3>
            <p className="text-gray-400">
              {searchTerm || selectedFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No certifications available at the moment'
              }
            </p>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <CertificationModal 
        certification={selectedCert || selectedFeaturedCert} 
        onClose={handleCloseModal} 
      />
    </section>
  );
});

Certifications.displayName = 'Certifications';

export default Certifications;