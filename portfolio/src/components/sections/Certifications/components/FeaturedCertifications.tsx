// src/components/sections/Certifications/components/FeaturedCertifications.tsx
'use client';

import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  Calendar,
  Award,
  ExternalLink,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import type { Certification } from '@/types/certification';
import SmartImage from '@/components/common/SmartImage';
import { useMediaQuery } from '@/hooks/common/useMediaQuery';

interface FeaturedCertificationsProps {
  certifications: Certification[];
  onCertificationClick: (cert: Certification) => void;
}

const FeaturedCertifications = memo(({ 
  certifications, 
  onCertificationClick 
}: FeaturedCertificationsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [lastManualAction, setLastManualAction] = useState(0);
  
  // Enhanced Responsive Detection
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  // Intelligent Visible Items Calculation with Optimized Spacing
  const visibleConfiguration = useMemo(() => {
    if (isMobile) return { visible: 1, spacing: 0 };
    if (isTablet) return { visible: 3, spacing: 90 }; // Slightly closer for tablet
    return { visible: 3, spacing: 110 }; // More compact for desktop
  }, [isMobile, isTablet]);

  // Auto-play functionality - respects manual actions
  useEffect(() => {
    if (!isAutoPlaying || certifications.length <= 1) return;

    const interval = setInterval(() => {
      const now = Date.now();
      // Only auto-advance if no recent manual action (within 4 seconds)
      if (now - lastManualAction > 4000) {
        setCurrentIndex((prev) => (prev + 1) % certifications.length);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, certifications.length, lastManualAction]);

  // Navigation handlers - Reset auto-scroll timer on manual action
  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + certifications.length) % certifications.length);
    setLastManualAction(Date.now()); // Mark manual action timestamp
  }, [certifications.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % certifications.length);
    setLastManualAction(Date.now()); // Mark manual action timestamp
  }, [certifications.length]);

  if (certifications.length === 0) return null;

  return (
    <section className="mb-4 mb:mb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-0"
      >
        <div className="flex items-center justify-center gap-3 mb-0">
          <Star className="w-5 h-5 text-primary dark:text-primary-dark" />
          <h3 className="text-xl md:text-2xl font-bold text-text-primary dark:text-text-primary-dark">
            Featured Certifications
          </h3>
          <Star className="w-5 h-5 text-primary dark:text-primary-dark" />
        </div>
      </motion.div>

      {/* Carousel Container - Auto-scrolling with Focus on Hover */}
      <div className="relative px-0 md:px-0">
        {/* Card Display System */}
        <div className="flex justify-center items-center py-4">
          <div className="relative w-full max-w-6xl">
            <div className="flex items-center justify-center min-h-[160px] overflow-hidden">
              {certifications.map((cert, index) => {
                const position = index - currentIndex;
                const isCenter = position === 0;
                const isVisible = Math.abs(position) <= Math.floor(visibleConfiguration.visible / 2);
                
                if (!isVisible && !isMobile) return null;

                return (
                  <HorizontalCertificationCard
                    key={cert.id}
                    certification={cert}
                    position={position}
                    isCenter={isCenter}
                    onClick={() => onCertificationClick(cert)}
                    isMobile={isMobile}
                    isTablet={isTablet}
                    spacing={visibleConfiguration.spacing}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <motion.button
            onClick={handlePrevious}
            className="p-2 md:p-3 rounded-full bg-background-secondary/80 dark:bg-background-secondary-dark/80 backdrop-blur-sm border border-border-primary/30 dark:border-border-primary-dark/30 text-text-primary dark:text-text-primary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>
        </div>

        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <motion.button
            onClick={handleNext}
            className="p-2 md:p-3 rounded-full bg-background-secondary/80 dark:bg-background-secondary-dark/80 backdrop-blur-sm border border-border-primary/30 dark:border-border-primary-dark/30 text-text-primary dark:text-text-primary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>
        </div>
      </div>

      {/* Indicators - Reduced spacing */}
      <div className="flex justify-center items-center gap-4 mt-2">
        <div className="flex gap-2">
          {certifications.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setLastManualAction(Date.now()); // Mark manual action timestamp
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary dark:bg-primary-dark w-6' 
                  : 'bg-text-tertiary/30 dark:bg-text-tertiary-dark/30'
              }`}
            />
          ))}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-text-tertiary dark:text-text-tertiary-dark">
          <div className={`w-2 h-2 rounded-full bg-green-400 transition-colors duration-300`} />
          <span>Auto-rotating</span>
        </div>
      </div>
    </section>
  );
});

// Enhanced Horizontal Card with Better Spacing
const HorizontalCertificationCard = memo(({ 
  certification, 
  position,
  isCenter,
  onClick,
  isMobile,
  isTablet,
  spacing
}: {
  certification: Certification;
  position: number;
  isCenter: boolean;
  onClick: () => void;
  isMobile: boolean;
  isTablet: boolean;
  spacing: number;
}) => {
  const [imageError, setImageError] = useState(false);

  // Status Calculation
  const getStatusInfo = () => {
    if (certification.expirationDate) {
      const now = new Date();
      const expiration = new Date(certification.expirationDate);
      const daysDifference = Math.ceil((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDifference < 0) {
        return { label: 'Expired', color: '#ef4444', icon: AlertCircle };
      } else if (daysDifference <= 30) {
        return { label: 'Expiring Soon', color: '#f59e0b', icon: Clock };
      } else {
        return { label: 'Valid', color: '#10b981', icon: CheckCircle };
      }
    }
    return { label: 'Lifetime', color: '#3b82f6', icon: Shield };
  };

  const statusInfo = getStatusInfo();

  // Transform Calculation with Compact Spacing
  const getTransformStyles = () => {
    const baseScale = isCenter ? 1 : 0.85;
    const baseOpacity = isCenter ? 1 : 0.6;
    
    // Optimized spacing calculation for tighter layout
    let translateX = position * spacing;
    if (isMobile) {
      translateX = position * 300;
    } else if (isTablet) {
      translateX = position * 340;
    } else {
      translateX = position * 360;
    }
    
    return {
      scale: baseScale,
      opacity: baseOpacity,
      x: translateX,
      zIndex: isCenter ? 20 : Math.max(0, 10 - Math.abs(position))
    };
  };

  const transformStyles = getTransformStyles();

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        width: isMobile ? '280px' : isTablet ? '320px' : '350px',
        height: '160px',
        left: '50%',
        marginLeft: isMobile ? '-140px' : isTablet ? '-160px' : '-175px',
      }}
      animate={transformStyles}
      transition={{ 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94],
        scale: { duration: 0.4 },
        opacity: { duration: 0.4 }
      }}
      onClick={onClick}
      whileHover={isCenter ? { y: -4, scale: 1.02 } : { scale: transformStyles.scale * 1.05 }}
    >
      {/* Skills Section Card Styling - Simplified */}
      <div className={`
        relative h-full rounded-xl overflow-hidden
        bg-background-secondary/50 dark:bg-background-secondary-dark/50 
        backdrop-blur-sm
        border border-border-primary/20 dark:border-border-primary-dark/20
        hover:bg-background-secondary/70 dark:hover:bg-background-secondary-dark/70
        hover:border-primary/30 dark:hover:border-primary-dark/30
        transition-all duration-300
        hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary-dark/5
        ${isCenter
          ? 'ring-1 ring-primary/20 dark:ring-primary-dark/20 shadow-lg shadow-primary/10 dark:shadow-primary-dark/10' 
          : ''
        }
      `}>
        {/* Subtle background gradient - Skills style */}
        <div 
          className="absolute inset-0 opacity-[0.01] dark:opacity-[0.02]"
          style={{
            background: `linear-gradient(135deg, ${statusInfo.color}20, transparent 70%)`
          }}
        />

        {/* Content Layout - More compact */}
        <div className="flex gap-3 h-full p-3">
          {/* Image Section - Smaller */}
          <div className="relative w-14 h-14 flex-shrink-0 mt-1">
            <div className="w-full h-full rounded-lg overflow-hidden bg-background-tertiary/30 dark:bg-background-tertiary-dark/30 border border-border-primary/10 dark:border-border-primary-dark/10">
              {certification.certificateImage && !imageError ? (
                <SmartImage
                  src={certification.certificateImage}
                  alt={`${certification.name} certificate`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-text-tertiary dark:text-text-tertiary-dark" />
                </div>
              )}
            </div>
            
            {/* Status Badge - Smaller */}
            <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ backgroundColor: statusInfo.color }}>
              <statusInfo.icon className="w-2 h-2 text-white" />
            </div>
          </div>

          {/* Content Section - More compact */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="mb-1.5">
              <h3 className={`font-bold text-text-primary dark:text-text-primary-dark leading-tight transition-colors duration-300 ${
                isMobile ? 'text-xs' : 'text-sm'
              } line-clamp-2 group-hover:text-primary dark:group-hover:text-primary-dark`}>
                {certification.name}
              </h3>
              
              <div className="flex items-center gap-1 mt-0.5">
                <Building2 className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-text-tertiary dark:text-text-tertiary-dark flex-shrink-0`} />
                <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-text-secondary dark:text-text-secondary-dark truncate`}>
                  {certification.issuingOrganization}
                </span>
              </div>
            </div>

            {/* Enhanced Content for Center Card - More compact */}
            {isCenter && !isMobile && certification.description && (
              <p className="text-[10px] text-text-tertiary dark:text-text-tertiary-dark line-clamp-1 mb-1.5 leading-relaxed">
                {certification.description}
              </p>
            )}

            {/* Footer - More compact */}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-1 text-text-tertiary dark:text-text-tertiary-dark">
                <Calendar className="w-2.5 h-2.5" />
                <span className="text-[10px] font-medium">
                  {certification.issueDate.getFullYear()}
                  {certification.expirationDate && (
                    <span> - {certification.expirationDate.getFullYear()}</span>
                  )}
                </span>
              </div>
              
              <div className="flex items-center gap-1.5">
                {certification.isVerified && (
                  <div className="flex items-center gap-0.5 text-green-400">
                    <CheckCircle className="w-2.5 h-2.5" />
                    {!isMobile && <span className="text-[9px]">Verified</span>}
                  </div>
                )}
                
                {isCenter && certification.credentialUrl && (
                  <motion.a
                    href={certification.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-0.5 rounded-md bg-primary/15 dark:bg-primary-dark/15 text-primary dark:text-primary-dark hover:bg-primary/25 dark:hover:bg-primary-dark/25 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

FeaturedCertifications.displayName = 'FeaturedCertifications';

export default FeaturedCertifications;