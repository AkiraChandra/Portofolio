// src/components/sections/Certifications/Certifications.tsx
import React, { useState } from 'react';
import { Award, Download, AlertTriangle, X, Star, CheckCircle } from 'lucide-react';
import CertificationsList from './CertificationList';
import { useCertifications } from '@/hooks/certifications/useCertifications';
import { Certification } from '@/types/certification';

const Certifications: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  
  const { certifications, loading, error } = useCertifications();

  // Simple stats calculation
  const totalCerts = certifications.length;
  const activeCerts = certifications.filter(cert => !cert.isExpired).length;
  const featuredCerts = certifications.filter(cert => cert.featured);
  const expiringSoon = certifications.filter(cert => cert.isExpiringSoon).length;
  console.log('Total Certifications:', totalCerts);
  console.log('Active Certifications:', activeCerts);
  console.log('Featured Certifications:', featuredCerts.length);
  console.log('Expiring Soon:', expiringSoon);
  console.log('Certifications Data:', certifications);
  console.log('Loading:', loading);
  console.log('Error:', error);
  const downloadSummary = () => {
    console.log('Downloading certification summary...');
  };

  return (
    <section>
      {/* Main Container */}
      <div className="min-h-screen bg-background-primary dark:bg-background-primary-dark">
        <div className="container mx-auto px-6 py-16">
          
          {/* Title Section */}
          <div className="text-center mb-16 mt-10">
            <h1 className="text-5xl font-bold text-text-primary dark:text-text-primary-dark mb-6">
              All <span className="text-primary dark:text-primary-dark">Certifications</span>
            </h1>
            <p className="text-xl text-text-secondary dark:text-text-secondary-dark max-w-3xl mx-auto">
              Showcasing my continuous learning journey and professional expertise
            </p>
          </div>

          {/* Stats Cards */}
          {/* {totalCerts > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-background-secondary/60 dark:bg-background-secondary-dark/60 rounded-xl p-6 text-center">
                <Award className="w-8 h-8 text-primary dark:text-primary-dark mx-auto mb-3" />
                <div className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">{totalCerts}</div>
                <div className="text-sm text-text-secondary dark:text-text-secondary-dark">Total</div>
              </div>
              
              <div className="bg-background-secondary/60 dark:bg-background-secondary-dark/60 rounded-xl p-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">{activeCerts}</div>
                <div className="text-sm text-text-secondary dark:text-text-secondary-dark">Active</div>
              </div>
              
              <div className="bg-background-secondary/60 dark:bg-background-secondary-dark/60 rounded-xl p-6 text-center">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">{featuredCerts.length}</div>
                <div className="text-sm text-text-secondary dark:text-text-secondary-dark">Featured</div>
              </div>
              
              <div className="bg-background-secondary/60 dark:bg-background-secondary-dark/60 rounded-xl p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">{expiringSoon}</div>
                <div className="text-sm text-text-secondary dark:text-text-secondary-dark">Expiring</div>
              </div>
            </div>
          )} */}

          {/* Expiring Alert */}
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

          {/* Download Button */}
          {/* <div className="text-center mb-16">
            <button
              onClick={downloadSummary}
              className="inline-flex items-center px-8 py-4 bg-primary dark:bg-primary-dark text-white 
                       rounded-xl hover:bg-primary/90 dark:hover:bg-primary-dark/90 
                       transition-all duration-200 font-semibold text-lg shadow-lg"
            >
              <Download className="w-5 h-5 mr-3" />
              Download Certificate Summary
            </button>
          </div> */}

          {/* Featured Section */}
          {/* {featuredCerts.length > 0 && (
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-text-primary dark:text-text-primary-dark text-center mb-12">
                Featured Certifications
              </h2>
              <CertificationsList
                certifications={featuredCerts}
                loading={loading}
                error={error}
                showSearch={false}
                showFilters={false}
                showStats={false}
                onCertificationSelect={setSelectedCert}
              />
            </div>
          )} */}

          {/* All Certifications */}
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

      {/* Simple Modal */}
      {selectedCert && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50"
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="bg-background-primary dark:bg-background-primary-dark rounded-2xl shadow-2xl 
                     max-w-5xl w-full max-h-[90vh] overflow-auto"
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