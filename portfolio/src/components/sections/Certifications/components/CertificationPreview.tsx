// src/components/sections/Certifications/components/CertificationPreview.tsx
'use client';

import React, { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Building2, 
  Calendar, 
  CheckCircle, 
  Star, 
  ExternalLink,
  Shield,
  Clock,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import SmartImage from '@/components/common/SmartImage';
import type { Certification } from '@/types/certification';

interface CertificationPreviewProps {
  certification: Certification;
  isVisible: boolean;
  onClose?: () => void;
  className?: string;
}

const CertificationPreview: React.FC<CertificationPreviewProps> = memo(({
  certification,
  isVisible,
  onClose,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [autoSlideEnabled, setAutoSlideEnabled] = useState(true);

  // Get status info
  const getStatusInfo = (certification: Certification) => {
    if (certification.expirationDate) {
      const now = new Date();
      const expiration = new Date(certification.expirationDate);
      const daysDifference = Math.ceil((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDifference < 0) {
        return { 
          label: 'Expired', 
          color: '#ef4444', 
          icon: AlertCircle 
        };
      } else if (daysDifference <= 30) {
        return { 
          label: 'Expiring Soon', 
          color: '#f59e0b', 
          icon: Clock 
        };
      } else {
        return { 
          label: 'Valid', 
          color: '#10b981', 
          icon: CheckCircle 
        };
      }
    }
    
    return { 
      label: 'Lifetime', 
      color: '#3b82f6', 
      icon: Shield 
    };
  };

  const statusInfo = getStatusInfo(certification);

  // Auto-slide for multiple images (if exists)
  useEffect(() => {
    if (!isVisible || !autoSlideEnabled) return;

    const images = [certification.certificateImage].filter(Boolean);
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [certification.certificateImage, isVisible, autoSlideEnabled]);

  // Reset image index when certification changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setImageError(false);
  }, [certification.id]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`w-full max-w-4xl mx-auto ${className}`}
      >
        <div className="bg-background-primary/95 dark:bg-background-primary-dark/95 backdrop-blur-md rounded-2xl border border-border-primary/20 dark:border-border-primary-dark/20 shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="p-6 border-b border-border-primary/10 dark:border-border-primary-dark/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${statusInfo.color}15`,
                    border: `1px solid ${statusInfo.color}30`
                  }}
                >
                  <Award className="w-6 h-6" style={{ color: statusInfo.color }} />
                </div>
                
                <div>
                  <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-1">
                    {certification.name}
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-text-secondary dark:text-text-secondary-dark">
                      <Building2 className="w-4 h-4" />
                      <span className="font-medium">{certification.issuingOrganization}</span>
                    </div>
                    
                    {/* Status and badges */}
                    <div className="flex items-center gap-2">
                      {certification.featured && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-400/10 rounded-full">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs font-medium text-yellow-400">Featured</span>
                        </div>
                      )}
                      
                      {certification.isVerified && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-400/10 rounded-full">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span className="text-xs font-medium text-green-400">Verified</span>
                        </div>
                      )}
                      
                      <div 
                        className="flex items-center gap-1 px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: `${statusInfo.color}15`,
                          color: statusInfo.color 
                        }}
                      >
                        <statusInfo.icon className="w-3 h-3" />
                        <span className="text-xs font-medium">{statusInfo.label}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-background-secondary dark:hover:bg-background-secondary-dark text-text-tertiary dark:text-text-tertiary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Certificate Image */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-background-tertiary/30 dark:bg-background-tertiary-dark/30">
                {!imageError && certification.certificateImage ? (
                  <SmartImage
                    src={certification.certificateImage}
                    alt={`${certification.name} certificate`}
                    fill
                    className="object-contain p-4"
                    onError={() => setImageError(true)}
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Award className="w-16 h-16 text-text-tertiary dark:text-text-tertiary-dark mx-auto mb-4" />
                      <p className="text-text-tertiary dark:text-text-tertiary-dark">Certificate image not available</p>
                    </div>
                  </div>
                )}
                
                {/* Organization Logo Overlay */}
                {certification.organizationLogo && (
                  <div className="absolute top-4 right-4 w-16 h-16 bg-white/95 rounded-xl p-3 backdrop-blur-sm shadow-lg">
                    <SmartImage
                      src={certification.organizationLogo}
                      alt={certification.issuingOrganization}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                {certification.credentialUrl && (
                  <motion.a
                    href={certification.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary/20 dark:bg-primary-dark/20 text-primary dark:text-primary-dark rounded-lg hover:bg-primary/30 dark:hover:bg-primary-dark/30 transition-colors font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Credential
                  </motion.a>
                )}
                
                {certification.verificationUrl && (
                  <motion.a
                    href={certification.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Shield className="w-4 h-4" />
                    Verify
                  </motion.a>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              {/* Date Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-tertiary dark:text-text-tertiary-dark">Issue Date</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-text-secondary dark:text-text-secondary-dark" />
                    <span className="font-medium text-text-primary dark:text-text-primary-dark">
                      {certification.issueDate.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
                
                {certification.expirationDate && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-tertiary dark:text-text-tertiary-dark">
                      Expiration Date
                    </label>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-text-secondary dark:text-text-secondary-dark" />
                      <span className="font-medium text-text-primary dark:text-text-primary-dark">
                        {certification.expirationDate.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {certification.description && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-tertiary dark:text-text-tertiary-dark">Description</label>
                  <p className="text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                    {certification.description}
                  </p>
                </div>
              )}

              {/* Skills */}
              {certification.skills && certification.skills.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-tertiary dark:text-text-tertiary-dark">
                    Related Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {certification.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 text-sm bg-primary/15 dark:bg-primary-dark/15 text-primary dark:text-primary-dark rounded-lg font-medium border border-primary/20 dark:border-primary-dark/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating */}
              {/* {certification.rating && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-tertiary dark:text-text-tertiary-dark">Rating</label>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < certification.rating! 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-text-tertiary dark:text-text-tertiary-dark'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
                      {certification.rating}/5
                    </span>
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

CertificationPreview.displayName = 'CertificationPreview';

export default CertificationPreview;