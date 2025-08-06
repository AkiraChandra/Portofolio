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
  const [isPaused, setIsPaused] = useState(false);
  
  // Enhanced Responsive Detection
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  // Intelligent Visible Items Calculation
  const visibleConfiguration = useMemo(() => {
    if (isMobile) return { visible: 1, spacing: 0 };
    if (isTablet) return { visible: 1, spacing: 120 };
    return { visible: 3, spacing: 100 };
  }, [isMobile, isTablet]);

  // Enhanced Auto-Rotation
  useEffect(() => {
    if (!isAutoPlaying || isPaused || certifications.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % certifications.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isPaused, certifications.length]);

  // Navigation Handlers
  const navigateToIndex = useCallback((newIndex: number) => {
    setCurrentIndex(newIndex);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  }, []);

  const goToNext = useCallback(() => {
    navigateToIndex((currentIndex + 1) % certifications.length);
  }, [currentIndex, certifications.length, navigateToIndex]);

  const goToPrevious = useCallback(() => {
    navigateToIndex((currentIndex - 1 + certifications.length) % certifications.length);
  }, [currentIndex, certifications.length, navigateToIndex]);

  // Interaction State Management
  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => setIsPaused(false), []);

  if (!certifications.length) return null;

  return (
    <section className="relative mb-20">
      {/* Section Header - Aligned with Skills Section Typography */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Star className="w-6 h-6 text-primary dark:text-primary-dark" />
          <h3 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-text-primary-dark">
            Featured Certifications
          </h3>
          <Star className="w-6 h-6 text-primary dark:text-primary-dark" />
        </div>
        <p className="text-text-secondary dark:text-text-secondary-dark max-w-2xl mx-auto">
          Showcasing premier professional achievements and industry-recognized expertise
        </p>
      </motion.div>

      {/* Carousel Container - Proper Spacing */}
      <div 
        className="relative px-4 md:px-8"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Card Display System - Fixed Positioning */}
        <div className="flex justify-center items-center py-8">
          <div className="relative w-full max-w-6xl">
            <div className="flex items-center justify-center min-h-[200px]">
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
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation Controls - Skills Section Style */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
          <motion.button
            onClick={goToPrevious}
            className="p-3 rounded-full bg-background-secondary/80 dark:bg-background-secondary-dark/80 backdrop-blur-sm border border-border-primary/20 dark:border-border-primary-dark/20 text-text-primary dark:text-text-primary-dark hover:border-primary/30 dark:hover:border-primary-dark/30 hover:bg-background-secondary dark:hover:bg-background-secondary-dark transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={certifications.length <= 1}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
          <motion.button
            onClick={goToNext}
            className="p-3 rounded-full bg-background-secondary/80 dark:bg-background-secondary-dark/80 backdrop-blur-sm border border-border-primary/20 dark:border-border-primary-dark/20 text-text-primary dark:text-text-primary-dark hover:border-primary/30 dark:hover:border-primary-dark/30 hover:bg-background-secondary dark:hover:bg-background-secondary-dark transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={certifications.length <= 1}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Indicator System - Skills Section Alignment */}
      <div className="flex items-center justify-center gap-6 mt-8">
        <div className="flex gap-2">
          {certifications.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => navigateToIndex(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary dark:bg-primary-dark w-8 h-2'
                  : 'bg-background-tertiary dark:bg-background-tertiary-dark hover:bg-background-secondary dark:hover:bg-background-secondary-dark w-2 h-2'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-text-tertiary dark:text-text-tertiary-dark">
          <div className={`w-2 h-2 rounded-full ${
            isAutoPlaying && !isPaused ? 'bg-green-400' : 'bg-background-tertiary dark:bg-background-tertiary-dark'
          } transition-colors duration-300`} />
          <span>
            {isPaused ? 'Paused' : isAutoPlaying ? 'Auto-rotating' : 'Manual'}
          </span>
        </div>
      </div>
    </section>
  );
});

// Enhanced Horizontal Card - Skills Section Design Language
const HorizontalCertificationCard = memo(({ 
  certification, 
  position,
  isCenter,
  onClick,
  isMobile,
  isTablet
}: {
  certification: Certification;
  position: number;
  isCenter: boolean;
  onClick: () => void;
  isMobile: boolean;
  isTablet: boolean;
}) => {
  const [imageError, setImageError] = useState(false);

  // Status Calculation - Skills Section Pattern
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

  // Transform Calculation - Mathematical Precision
  const getTransformStyles = () => {
    const baseScale = isCenter ? 1 : 0.88;
    const baseOpacity = isCenter ? 1 : 0.6;
    const translateX = position * (isMobile ? 300 : isTablet ? 320 : 320);
    
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
        width: isMobile ? '280px' : '400px',
        height: '180px',
        left: '50%',
        marginLeft: isMobile ? '-140px' : '-200px',
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
      {/* Skills Section Card Styling */}
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
          ? 'ring-1 ring-primary/30 dark:ring-primary-dark/30 shadow-md shadow-primary/10 dark:shadow-primary-dark/10' 
          : ''
        }
      `}>
        
        {/* Background Gradient - Skills Section Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.01] dark:opacity-[0.02]"
          style={{
            background: `linear-gradient(135deg, ${statusInfo.color}20, transparent 70%)`
          }}
        />

        {/* Badge System - Skills Section Style */}
        <div className="absolute top-3 right-3 z-30">
          <motion.div 
            className="w-7 h-7 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Star className="w-3.5 h-3.5 text-white fill-current" />
          </motion.div>
        </div>

        <div className="absolute top-3 left-3 z-30">
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
            style={{ 
              backgroundColor: `${statusInfo.color}15`,
              color: statusInfo.color,
              border: `1px solid ${statusInfo.color}30`
            }}
          >
            <statusInfo.icon className="w-3 h-3" />
            <span>{statusInfo.label}</span>
          </div>
        </div>

        {/* Content Layout - Skills Section Structure */}
        <div className="relative z-20 h-full flex items-center p-4">
          {/* Certificate Image - Compact */}
          <div className={`relative flex-shrink-0 rounded-lg overflow-hidden bg-background-tertiary/30 dark:bg-background-tertiary-dark/30 ${
            isMobile ? 'w-16 h-12' : 'w-20 h-16'
          }`}>
            {!imageError && certification.certificateImage ? (
              <SmartImage
                src={certification.certificateImage}
                alt={`${certification.name} certificate`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImageError(true)}
                priority={isCenter}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Award className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-text-tertiary dark:text-text-tertiary-dark`} />
              </div>
            )}
            
            {/* Organization Logo */}
            {certification.organizationLogo && (
              <div className={`absolute bottom-0.5 right-0.5 bg-white/90 rounded-sm p-0.5 ${
                isMobile ? 'w-3 h-3' : 'w-4 h-4'
              }`}>
                <SmartImage
                  src={certification.organizationLogo}
                  alt={certification.issuingOrganization}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>

          {/* Content Area - Skills Section Typography */}
          <div className="flex-1 min-w-0 ml-3">
            <div className="mb-2">
              <h3 className={`font-bold text-text-primary dark:text-text-primary-dark leading-tight transition-colors duration-300 ${
                isMobile ? 'text-sm' : 'text-base'
              } line-clamp-2 group-hover:text-primary dark:group-hover:text-primary-dark`}>
                {certification.name}
              </h3>
              
              <div className="flex items-center gap-1.5 mt-1">
                <Building2 className={`${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-text-tertiary dark:text-text-tertiary-dark flex-shrink-0`} />
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-text-secondary dark:text-text-secondary-dark truncate`}>
                  {certification.issuingOrganization}
                </span>
              </div>
            </div>

            {/* Enhanced Content for Center Card */}
            {isCenter && !isMobile && certification.description && (
              <p className="text-xs text-text-tertiary dark:text-text-tertiary-dark line-clamp-2 mb-2 leading-relaxed">
                {certification.description}
              </p>
            )}

            {/* Footer - Skills Section Pattern */}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-1.5 text-text-tertiary dark:text-text-tertiary-dark">
                <Calendar className="w-3 h-3" />
                <span className="text-xs font-medium">
                  {certification.issueDate.getFullYear()}
                  {certification.expirationDate && (
                    <span> - {certification.expirationDate.getFullYear()}</span>
                  )}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {certification.isVerified && (
                  <div className="flex items-center gap-1 text-green-400">
                    <CheckCircle className="w-3 h-3" />
                    {!isMobile && <span className="text-xs">Verified</span>}
                  </div>
                )}
                
                {isCenter && certification.credentialUrl && (
                  <motion.a
                    href={certification.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-md bg-primary/15 dark:bg-primary-dark/15 text-primary dark:text-primary-dark hover:bg-primary/25 dark:hover:bg-primary-dark/25 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3 h-3" />
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

HorizontalCertificationCard.displayName = 'HorizontalCertificationCard';
FeaturedCertifications.displayName = 'FeaturedCertifications';

export default FeaturedCertifications;