import React, { useState, useMemo, useCallback, memo, useRef } from 'react';
import { Award, AlertTriangle, X, Star, CheckCircle, ArrowDown } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import CertificationsList from './CertificationList';
import { useCertifications } from '@/hooks/certifications/useCertifications';
import { Certification } from '@/types/certification';
import MovingStars from '@/components/ui/animations/Movingstars';

// ✅ MEMOIZED STATS CARDS COMPONENT
const StatsCards = memo(({ statsData }: { 
  statsData: { 
    totalCerts: number;
    activeCerts: number;
    featuredCerts: number;
    expiringSoon: number;
  }
}) => (
  <div className="hidden sm:grid sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
    <div className="bg-gray-900/50 rounded-lg p-3 sm:p-4 text-center border border-gray-700/50">
      <Award className="w-5 h-5 sm:w-6 sm:h-6 text-primary dark:text-primary-dark mx-auto mb-1.5 sm:mb-2" />
      <div className="text-lg sm:text-xl font-bold text-white">{statsData.totalCerts}</div>
      <div className="text-xs text-gray-400">Total</div>
    </div>
    
    <div className="bg-gray-900/50 rounded-lg p-3 sm:p-4 text-center border border-gray-700/50">
      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mx-auto mb-1.5 sm:mb-2" />
      <div className="text-lg sm:text-xl font-bold text-white">{statsData.activeCerts}</div>
      <div className="text-xs text-gray-400">Active</div>
    </div>
    
    <div className="bg-gray-900/50 rounded-lg p-3 sm:p-4 text-center border border-gray-700/50">
      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mx-auto mb-1.5 sm:mb-2" />
      <div className="text-lg sm:text-xl font-bold text-white">{statsData.featuredCerts}</div>
      <div className="text-xs text-gray-400">Featured</div>
    </div>
    
    <div className="bg-gray-900/50 rounded-lg p-3 sm:p-4 text-center border border-gray-700/50">
      <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mx-auto mb-1.5 sm:mb-2" />
      <div className="text-lg sm:text-xl font-bold text-white">{statsData.expiringSoon}</div>
      <div className="text-xs text-gray-400">Expiring</div>
    </div>
  </div>
));

StatsCards.displayName = 'StatsCards';

// ✅ MEMOIZED EXPIRING ALERT COMPONENT
const ExpiringAlert = memo(({ expiringSoon }: { expiringSoon: number }) => {
  if (expiringSoon === 0) return null;

  return (
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
  );
});

ExpiringAlert.displayName = 'ExpiringAlert';

// ✅ MEMOIZED FEATURED CERTIFICATIONS COMPONENT
const FeaturedCertifications = memo(({ 
  featuredCerts, 
  onCertificationSelect 
}: { 
  featuredCerts: Certification[];
  onCertificationSelect: (cert: Certification | null) => void;
}) => {
  if (featuredCerts.length === 0) return null;

  return (
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
        onCertificationSelect={onCertificationSelect}
      />
    </div>
  );
});

FeaturedCertifications.displayName = 'FeaturedCertifications';

// ✅ MEMOIZED MODAL COMPONENT
const CertificationModal = memo(({ 
  selectedCert, 
  onClose 
}: { 
  selectedCert: Certification | null;
  onClose: () => void;
}) => {
  const selectedCertArray = useMemo(() => 
    selectedCert ? [selectedCert] : [], 
    [selectedCert]
  );

  if (!selectedCert) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 sm:p-6 z-50"
      onClick={onClose}
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
              onClick={onClose}
              className="p-2 sm:p-3 rounded-lg hover:bg-background-secondary dark:hover:bg-background-secondary-dark 
                       text-text-secondary dark:text-text-secondary-dark transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          
          <CertificationsList
            certifications={selectedCertArray}
            showSearch={false}
            showFilters={false}
            showStats={false}
          />
        </div>
      </div>
    </div>
  );
});

CertificationModal.displayName = 'CertificationModal';

// ✅ MAIN COMPONENT WITH OPTIMIZATIONS
const Certifications = memo(() => {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const allCertificationsRef = useRef<HTMLDivElement>(null);
  
  const { certifications, loading } = useCertifications();
  const shouldReduceMotion = useReducedMotion();

  // ✅ MEMOIZED STATS CALCULATION
  const statsData = useMemo(() => {
    if (!certifications?.length) {
      return {
        totalCerts: 0,
        activeCerts: 0,
        featuredCerts: 0,
        expiringSoon: 0
      };
    }

    return {
      totalCerts: certifications.length,
      activeCerts: certifications.filter(cert => !cert?.isExpired).length,
      featuredCerts: certifications.filter(cert => cert?.featured).length,
      expiringSoon: certifications.filter(cert => cert?.isExpiringSoon).length
    };
  }, [certifications]);

  // ✅ MEMOIZED FEATURED CERTIFICATIONS
  const featuredCerts = useMemo(() => 
    certifications?.filter(cert => cert?.featured) || [], 
    [certifications]
  );

  // ✅ OPTIMIZED SCROLL FUNCTION
  const scrollToAllCertifications = useCallback(() => {
    allCertificationsRef.current?.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [shouldReduceMotion]);

  // ✅ MEMOIZED CLOSE MODAL FUNCTION
  const closeModal = useCallback(() => {
    setSelectedCert(null);
  }, []);

  // ✅ LOADING STATE
  if (loading) {
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
        
        {/* Main Title Section */}
        <div className="text-center mb-6 sm:mb-8 mt-4 sm:mt-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            All <span className="text-primary dark:text-primary-dark">Certifications</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-xl sm:max-w-2xl mx-auto mb-4 sm:mb-6 px-4">
            Showcasing my continuous learning journey and professional expertise
          </p>

          {/* CTA Button */}
          {statsData.totalCerts > 0 && (
            <div className="hidden sm:inline-block">
              <button
                onClick={scrollToAllCertifications}
                className="group relative inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-primary-dark overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10 flex items-center space-x-1.5 sm:space-x-2">
                  <span>Explore All Certifications</span>
                  <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
              </button>

              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-400">
                🔍 Discover {statsData.totalCerts} certifications below
              </p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        {statsData.totalCerts > 0 && (
          <StatsCards statsData={statsData} />
        )}

        {/* Expiring Alert */}
        <ExpiringAlert expiringSoon={statsData.expiringSoon} />

        {/* Featured Certifications */}
        <FeaturedCertifications 
          featuredCerts={featuredCerts}
          onCertificationSelect={setSelectedCert}
        />

        {/* All Certifications Section */}
        <div ref={allCertificationsRef} className="scroll-mt-16 sm:scroll-mt-20">
          <div className="hidden sm:block text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">
              <span className="text-primary dark:text-primary-dark">All</span> Certifications
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">
              Complete collection of professional certifications and achievements
            </p>
          </div>

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

      {/* Modal */}
      <CertificationModal 
        selectedCert={selectedCert}
        onClose={closeModal}
      />
    </section>
  );
});

Certifications.displayName = 'Certifications';

export default Certifications;