// src/components/sections/Certifications/Certifications.tsx (NO ROUTING CONFLICT)
import React, { useState, useEffect } from 'react';
import { Award, Download, AlertTriangle, X, Star, CheckCircle, ArrowDown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import CertificationsList from './CertificationList';
import { useCertifications } from '@/hooks/certifications/useCertifications';
import { Certification } from '@/types/certification';
import MovingStars from '@/components/ui/animations/Movingstars';

const Certifications: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { certifications, loading, error } = useCertifications();

  // Simple stats calculation with safety checks
  const totalCerts = certifications?.length || 0;
  const activeCerts = certifications?.filter(cert => !cert?.isExpired)?.length || 0;
  const featuredCerts = certifications?.filter(cert => cert?.featured) || [];
  const expiringSoon = certifications?.filter(cert => cert?.isExpiringSoon)?.length || 0;

  // Initialize component after mount to prevent routing conflicts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // SAFE scroll function that doesn't trigger routing
  const scrollToAllCertifications = () => {
    try {
      const allCertificationsSection = document.getElementById('all-certifications');
      if (allCertificationsSection) {
        // Use native scrollIntoView to avoid routing conflicts
        allCertificationsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    } catch (error) {
      console.error('Error scrolling to all certifications:', error);
    }
  };

  // Show loading while initializing to prevent early renders
  if (!isInitialized || loading) {
    return (
      <section className="relative min-h-screen bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <MovingStars />
        </div>
        <div className="relative z-10 container mx-auto px-6 py-16">
          <div className="text-center">
            <div className="text-white text-xl">Loading certifications...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Moving Stars Background */}
      <div className="absolute inset-0 z-0">
        <MovingStars />
      </div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        
        {/* Main Title Section - Compact */}
        <div className="text-center mb-6 sm:mb-8 mt-4 sm:mt-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            All <span className="text-primary dark:text-primary-dark">Certifications</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-xl sm:max-w-2xl mx-auto mb-4 sm:mb-6 px-4">
            Showcasing my continuous learning journey and professional expertise
          </p>

          {/* CTA Button - Mobile friendly - Hidden on mobile */}
          {totalCerts > 0 && (
            <div className="hidden sm:inline-block">
              <button
                onClick={scrollToAllCertifications}
                className="group relative inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-primary-dark overflow-hidden transition-all duration-300 hover:scale-105"
              >
                {/* Content */}
                <span className="relative z-10 flex items-center space-x-1.5 sm:space-x-2">
                  <span>Explore All Certifications</span>
                  <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
              </button>

              {/* Supporting Text */}
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-400">
                🔍 Discover {totalCerts} certifications below
              </p>
            </div>
          )}
        </div>

        {/* Stats Cards - Hidden on mobile, visible on desktop */}
        {totalCerts > 0 && (
          <div className="hidden sm:grid sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-gray-900/50 rounded-lg p-3 sm:p-4 text-center border border-gray-700/50">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-primary dark:text-primary-dark mx-auto mb-1.5 sm:mb-2" />
              <div className="text-lg sm:text-xl font-bold text-white">{totalCerts}</div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-3 sm:p-4 text-center border border-gray-700/50">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mx-auto mb-1.5 sm:mb-2" />
              <div className="text-lg sm:text-xl font-bold text-white">{activeCerts}</div>
              <div className="text-xs text-gray-400">Active</div>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-3 sm:p-4 text-center border border-gray-700/50">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mx-auto mb-1.5 sm:mb-2" />
              <div className="text-lg sm:text-xl font-bold text-white">{featuredCerts.length}</div>
              <div className="text-xs text-gray-400">Featured</div>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-3 sm:p-4 text-center border border-gray-700/50">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mx-auto mb-1.5 sm:mb-2" />
              <div className="text-lg sm:text-xl font-bold text-white">{expiringSoon}</div>
              <div className="text-xs text-gray-400">Expiring</div>
            </div>
          </div>
        )}

        {/* Expiring Alert - Simple version */}
        {expiringSoon > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400 mt-0.5 sm:mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-1 sm:mb-2">
                  Action Required
                </h3>
                <p className="text-sm sm:text-base text-yellow-700 dark:text-yellow-300">
                  {expiringSoon} certification{expiringSoon > 1 ? 's' : ''} expiring soon. 
                  Review and renew to maintain your professional credentials.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Featured Certifications Section - Hidden on mobile, visible on desktop */}
        {featuredCerts.length > 0 && (
          <div className="hidden sm:block mb-12 sm:mb-16">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">
                <span className="text-primary dark:text-primary-dark">Featured</span> Certifications
              </h2>
              <p className="text-gray-300 text-sm sm:text-base">
                Highlighted achievements and key professional credentials
              </p>
            </div>
            
            <CertificationsList
              certifications={featuredCerts}
              loading={false}
              showSearch={false}
              showFilters={false}
              showStats={false}
              onCertificationSelect={setSelectedCert}
            />
          </div>
        )}

        {/* All Certifications Section - Simple anchor */}
        <div id="all-certifications" className="scroll-mt-16 sm:scroll-mt-20">
          <div className="hidden sm:block text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">
              <span className="text-primary dark:text-primary-dark">All</span> Certifications
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">
              Complete collection of professional certifications and achievements
            </p>
          </div>

          {/* Certifications List - No complex animations */}
          <div>
            <CertificationsList
              certifications={certifications}
              loading={loading}
              showSearch={true}
              showFilters={true}
              showStats={false}
              onCertificationSelect={setSelectedCert}
            />
          </div>
        </div>
      </div>

      {/* Modal - Simple version */}
      {selectedCert && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 sm:p-6 z-50"
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="bg-background-primary dark:bg-background-primary-dark rounded-xl sm:rounded-2xl shadow-2xl 
                     w-full max-w-4xl max-h-[90vh] overflow-auto border border-border-primary/20 dark:border-border-primary-dark/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex justify-between items-center mb-4 sm:mb-6 lg:mb-8">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-text-primary dark:text-text-primary-dark">
                  Certification Details
                </h2>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-2 sm:p-3 rounded-lg hover:bg-background-secondary dark:hover:bg-background-secondary-dark 
                           text-text-secondary dark:text-text-secondary-dark transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
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