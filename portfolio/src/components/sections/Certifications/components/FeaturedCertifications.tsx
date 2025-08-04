// src/components/sections/Certifications/components/FeaturedCertifications.tsx
'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Building2, Calendar } from 'lucide-react';
import { Certification } from '@/types/certification';
import { getCertificationStatusInfo } from '../utils/certificationUtils';
import SmartImage from '@/components/common/SmartImage';
import PlaceholderImage from '@/components/common/PlaceholderImage';

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

  // Auto-rotation logic - sama seperti Skills
  useEffect(() => {
    if (!isAutoPlaying || certifications.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % certifications.length);
    }, 4000); // 4 detik seperti Skills

    return () => clearInterval(interval);
  }, [isAutoPlaying, certifications.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % certifications.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume after 10s
  }, [certifications.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + certifications.length) % certifications.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume after 10s
  }, [certifications.length]);

  if (!certifications.length) return null;

  return (
    <div className="relative">
      {/* Featured Cards Container - styling sama seperti Skills */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-4 overflow-hidden">
          {certifications.map((cert, index) => (
            <FeaturedCertificationItem
              key={cert.id}
              certification={cert}
              isActive={index === currentIndex}
              index={index}
              onClick={() => onCertificationClick(cert)}
            />
          ))}
        </div>
      </div>

      {/* Navigation Controls - sama seperti Skills */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={goToPrevious}
          className="p-2 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 text-gray-400 hover:text-white hover:border-primary/40 transition-all duration-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dots Indicator */}
        <div className="flex gap-2">
          {certifications.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
                setTimeout(() => setIsAutoPlaying(true), 10000);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary w-6'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          className="p-2 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 text-gray-400 hover:text-white hover:border-primary/40 transition-all duration-200"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Auto-play indicator */}
      <div className="flex items-center justify-center mt-4">
        <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-400' : 'bg-gray-600'} transition-colors duration-300`} />
        <span className="text-xs text-gray-400 ml-2">
          {isAutoPlaying ? 'Auto-rotating' : 'Paused'}
        </span>
      </div>
    </div>
  );
});

// Featured Certification Item - styling sama seperti Skills featured items
const FeaturedCertificationItem = memo(({ 
  certification, 
  isActive, 
  index, 
  onClick 
}: {
  certification: Certification;
  isActive: boolean;
  index: number;
  onClick: () => void;
}) => {
  const statusInfo = getCertificationStatusInfo(certification);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      className={`
        relative cursor-pointer transition-all duration-500 ease-out
        ${isActive 
          ? 'scale-100 opacity-100 z-10' 
          : 'scale-75 opacity-40 hover:opacity-70 hover:scale-80'
        }
      `}
      onClick={onClick}
      whileHover={!isActive ? { scale: 0.85 } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-6 w-80 h-96 overflow-hidden group">
        {/* Glow Effect - sama seperti Skills */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div 
            className="absolute inset-0 rounded-2xl blur-xl"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${statusInfo.color}15, transparent 70%)`
            }}
          />
        </div>

        {/* Featured Star Badge - sama seperti Skills */}
        <div className="absolute top-4 right-4 z-20">
          <motion.div 
            className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.2, rotate: 180 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Star className="w-4 h-4 text-white fill-current" />
          </motion.div>
        </div>

        {/* Status Indicator */}
        <div className="absolute top-4 left-4 z-20">
          <div 
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
            style={{ 
              backgroundColor: `${statusInfo.color}20`,
              color: statusInfo.color,
              border: `1px solid ${statusInfo.color}30`
            }}
          >
            <statusInfo.icon className="w-3 h-3" />
            <span>{statusInfo.label}</span>
          </div>
        </div>

        <div className="relative z-10 h-full flex flex-col">
          {/* Certificate Image */}
          <div className="relative mb-4 rounded-xl overflow-hidden bg-gray-800/50 aspect-[4/3] flex-shrink-0">
            {!imageError && certification.certificateImage ? (
              <SmartImage
                src={certification.certificateImage}
                alt={`${certification.name} certificate`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
                priority={isActive}
              />
            ) : (
              <PlaceholderImage
                width={300}
                height={200}
                className="w-full h-full"
              />
            )}
            
            {/* Organization Logo Overlay */}
            {certification.organizationLogo && (
              <div className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 rounded-lg p-1.5 backdrop-blur-sm">
                <SmartImage
                  src={certification.organizationLogo}
                  alt={certification.issuingOrganization}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {certification.name}
            </h3>
            
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300 truncate">
                {certification.issuingOrganization}
              </span>
            </div>

            {certification.description && (
              <p className="text-sm text-gray-400 line-clamp-3 mb-4 flex-1">
                {certification.description}
              </p>
            )}

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-gray-700/30">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{certification.issueDate.getFullYear()}</span>
                </div>
                {certification.isVerified && (
                  <div className="flex items-center gap-1 text-green-400">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

FeaturedCertificationItem.displayName = 'FeaturedCertificationItem';
FeaturedCertifications.displayName = 'FeaturedCertifications';

export default FeaturedCertifications;