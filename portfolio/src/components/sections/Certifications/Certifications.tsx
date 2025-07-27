// src/components/sections/Certifications/Certifications.tsx (CONSISTENT STYLING)
import React, { useState } from 'react';
import { Award, Download, AlertTriangle, X, Star, CheckCircle, ArrowDown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import CertificationsList from './CertificationList';
import { useCertifications } from '@/hooks/certifications/useCertifications';
import { Certification } from '@/types/certification';
import MovingStars from '@/components/ui/animations/Movingstars';

const Certifications: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  
  const { certifications, loading, error } = useCertifications();

  // Simple stats calculation
  const totalCerts = certifications.length;
  const activeCerts = certifications.filter(cert => !cert.isExpired).length;
  const featuredCerts = certifications.filter(cert => cert.featured);
  const expiringSoon = certifications.filter(cert => cert.isExpiringSoon).length;
  // Function to scroll to All Certifications section
  const scrollToAllCertifications = () => {
    const allCertificationsSection = document.getElementById('all-certifications');
    if (allCertificationsSection) {
      allCertificationsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };
  
  return (
    <section className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent dark:via-black/70 dark:to-black z-1" />

      {/* Background with better overflow control */}
      <div className="absolute inset-0 overflow-hidden">
        <MovingStars />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent dark:via-black/20 dark:to-black z-1" />

      {/* Main Container - Consistent with Experience/Projects */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        
        {/* Main Title Section - Reduced spacing for better viewport */}
        <div className="text-center mb-10 mt-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            All <span className="text-primary dark:text-primary-dark">Certifications</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
            Showcasing my continuous learning journey and professional expertise
          </p>

          {/* Attractive CTA Button to All Certifications - Smaller size */}
          <motion.div
            className="inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={scrollToAllCertifications}
              className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-primary to-primary-dark dark:from-primary-dark dark:to-primary overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 15px 30px rgba(246, 176, 13, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary dark:from-primary dark:to-primary-dark"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Sparkles Animation - Smaller */}
              <motion.div
                className="absolute top-0.5 right-0.5"
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-4 h-4 text-white/80" />
              </motion.div>

              {/* Content */}
              <span className="relative z-10 flex items-center space-x-2">
                <span>Explore All Certifications</span>
                <motion.div
                  animate={{ y: [0, 3, 0] }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowDown className="w-4 h-4" />
                </motion.div>
              </span>

              {/* Glowing Border Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary-dark dark:from-primary-dark dark:to-primary opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
            </motion.button>

            {/* Supporting Text - Smaller */}
            <motion.p
              className="mt-3 text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              🔍 Discover {totalCerts} certifications with search & filters below
            </motion.p>
          </motion.div>
        </div>

        {/* Stats Cards - Clean styling consistent with other pages */}
        {totalCerts > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900/50 rounded-xl p-6 text-center border border-gray-700/50">
              <Award className="w-8 h-8 text-primary dark:text-primary-dark mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">{totalCerts}</div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 text-center border border-gray-700/50">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">{activeCerts}</div>
              <div className="text-sm text-gray-400">Active</div>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 text-center border border-gray-700/50">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">{featuredCerts.length}</div>
              <div className="text-sm text-gray-400">Featured</div>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 text-center border border-gray-700/50">
              <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">{expiringSoon}</div>
              <div className="text-sm text-gray-400">Expiring</div>
            </div>
          </div>
        )}

        {/* Expiring Alert - Simple styling */}
        {expiringSoon > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6 mb-12">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  Action Required
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300">
                  {expiringSoon} certification{expiringSoon > 1 ? 's' : ''} expiring soon. 
                  Review and renew to maintain your professional credentials.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Featured Certifications Section */}
        {featuredCerts.length > 0 && (
          <div className="mb-16">
            {/* Centered Title - More compact */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                <span className="text-primary dark:text-primary-dark">Featured</span> Certifications
              </h2>
              <p className="text-gray-300 text-sm md:text-base">
                Highlighted achievements and key professional credentials
              </p>
            </div>
            
            <CertificationsList
              certifications={featuredCerts}
              loading={loading}
              showSearch={false}
              showFilters={false}
              showStats={false}
              onCertificationSelect={setSelectedCert}
            />
          </div>
        )}

        {/* All Certifications Section */}
        <div id="all-certifications" className="scroll-mt-20">
          {/* Centered Title */}
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-primary dark:text-primary-dark">All</span> Certifications
            </motion.h2>
            <motion.p 
              className="text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Complete collection of professional certifications and achievements
            </motion.p>
          </div>

          {/* Certifications List with Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <CertificationsList
              certifications={certifications}
              loading={loading}
              showSearch={true}
              showFilters={true}
              showStats={false}
              onCertificationSelect={setSelectedCert}
            />
          </motion.div>
        </div>

      </div>

      {/* Modal - Simple and clean */}
      {selectedCert && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50"
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="bg-background-primary dark:bg-background-primary-dark rounded-2xl shadow-2xl 
                     max-w-5xl w-full max-h-[90vh] overflow-auto border border-border-primary/20 dark:border-border-primary-dark/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
                  Certification Details
                </h2>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-3 rounded-lg hover:bg-background-secondary dark:hover:bg-background-secondary-dark 
                           text-text-secondary dark:text-text-secondary-dark transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <CertificationsList
                certifications={[selectedCert]}
                showSearch={false}
                showFilters={false}
                showStats={false}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Certifications;