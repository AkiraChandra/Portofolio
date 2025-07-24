// src/components/sections/Certifications/Certifications.tsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Download, Star, TrendingUp, AlertTriangle, Plus } from 'lucide-react';
import CertificationsList from './CertificationList';
import MovingStars from '@/components/ui/animations/Movingstars';
import { useCertifications, useCertificationStats, useExpiringCertifications } from '@/hooks/certifications/useCertifications';
import { Certification } from '@/types/certification';

const Certifications: React.FC = () => {
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Hooks
  const { 
    certifications, 
    loading, 
    error, 
    toggleFeatured,
    refetch 
  } = useCertifications();
  
  const { stats, loading: statsLoading } = useCertificationStats();
  const { expiringCertifications, hasExpiringCertifications } = useExpiringCertifications(90);

  const handleCertificationSelect = (certification: Certification) => {
    setSelectedCertification(certification);
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      await toggleFeatured(id, featured);
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const handleDownloadResume = () => {
    // Implementation for downloading certification summary/resume
    console.log('Downloading certification summary...');
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark transition-colors duration-300"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <MovingStars />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent dark:via-black/20 dark:to-black z-1" />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary dark:text-text-primary-dark">
              My{' '}
              <span className="text-primary dark:text-primary-dark text-glow">
                Certifications
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-text-secondary dark:text-text-secondary-dark max-w-3xl mx-auto leading-relaxed">
              Professional certifications that validate my expertise and commitment to continuous learning
            </p>

            {/* Quick Stats */}
            {stats && !statsLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-6 mt-8"
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-background-secondary/50 dark:bg-background-secondary-dark/50 
                               rounded-full backdrop-blur-sm">
                  <Award className="w-5 h-5 text-primary dark:text-primary-dark" />
                  <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                    {stats.total} Certifications
                  </span>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-background-secondary/50 dark:bg-background-secondary-dark/50 
                               rounded-full backdrop-blur-sm">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                    {stats.featured} Featured
                  </span>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-background-secondary/50 dark:bg-background-secondary-dark/50 
                               rounded-full backdrop-blur-sm">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                    {stats.active} Active
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Expiring Certifications Alert */}
        <AnimatePresence>
          {hasExpiringCertifications && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 
                         rounded-lg flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                  Certifications Expiring Soon
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  {expiringCertifications.length} certification{expiringCertifications.length > 1 ? 's' : ''} 
                  {' '}will expire within the next 90 days. Consider renewing them to maintain your credentials.
                </p>
                <div className="mt-2">
                  {expiringCertifications.slice(0, 3).map(cert => (
                    <div key={cert.id} className="text-xs text-yellow-600 dark:text-yellow-400">
                      • {cert.name} - Expires {cert.daysUntilExpiration} days
                    </div>
                  ))}
                  {expiringCertifications.length > 3 && (
                    <div className="text-xs text-yellow-600 dark:text-yellow-400">
                      • And {expiringCertifications.length - 3} more...
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <motion.button
            onClick={handleDownloadResume}
            className="flex items-center gap-2 px-6 py-3 bg-primary dark:bg-primary-dark 
                     text-background-primary rounded-lg hover:bg-primary-dark dark:hover:bg-primary 
                     transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-5 h-5" />
            <span>Download Summary</span>
          </motion.button>

          <motion.button
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            className="flex items-center gap-2 px-6 py-3 border border-primary/20 dark:border-primary-dark/20 
                     text-primary dark:text-primary-dark rounded-lg hover:bg-primary/5 dark:hover:bg-primary-dark/5 
                     transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Award className="w-5 h-5" />
            <span>View All Certifications</span>
          </motion.button>
        </motion.div>

        {/* Featured Certifications Preview */}
        {stats && stats.featured > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-text-primary-dark mb-2">
                Featured Certifications
              </h2>
              <p className="text-text-secondary dark:text-text-secondary-dark">
                Highlighting my most significant professional achievements
              </p>
            </div>

            <CertificationsList
              certifications={certifications.filter(cert => cert.featured)}
              loading={loading}
              error={error ?? undefined}
              showSearch={false}
              showFilters={false}
              showStats={false}
              onCertificationSelect={handleCertificationSelect}
              onToggleFeatured={handleToggleFeatured}
            />
          </motion.div>
        )}

        {/* All Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-text-primary-dark mb-2">
              All Certifications
            </h2>
            <p className="text-text-secondary dark:text-text-secondary-dark">
              Complete collection of my professional certifications and achievements
            </p>
          </div>

          <CertificationsList
            certifications={certifications}
            loading={loading}
            error={error ?? undefined}
            showSearch={true}
            showFilters={true}
            showStats={true}
            onCertificationSelect={handleCertificationSelect}
            onToggleFeatured={handleToggleFeatured}
          />
        </motion.div>

        {/* Top Skills Section */}
        {stats && stats.topSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-16 text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-text-primary-dark mb-8">
              Top Skills from Certifications
            </h2>
            
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {stats.topSkills.slice(0, 15).map((skillStat, index) => (
                <motion.div
                  key={skillStat.skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center gap-2 px-4 py-2 bg-background-secondary/50 dark:bg-background-secondary-dark/50 
                           rounded-full backdrop-blur-sm border border-border-primary/20 dark:border-border-primary-dark/20
                           hover:bg-primary/5 dark:hover:bg-primary-dark/5 transition-colors"
                >
                  <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                    {skillStat.skill}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-primary/10 dark:bg-primary-dark/10 
                                 text-primary dark:text-primary-dark rounded-full">
                    {skillStat.count}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Certification Detail Modal */}
      <AnimatePresence>
        {selectedCertification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedCertification(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background-primary dark:bg-background-primary-dark rounded-xl shadow-2xl 
                       max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
                    Certification Details
                  </h2>
                  <button
                    onClick={() => setSelectedCertification(null)}
                    className="p-2 rounded-lg hover:bg-background-secondary dark:hover:bg-background-secondary-dark 
                             text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark 
                             transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <CertificationsList
                  certifications={[selectedCertification]}
                  showSearch={false}
                  showFilters={false}
                  showStats={false}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certifications;