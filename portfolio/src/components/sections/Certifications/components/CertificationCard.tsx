// src/components/sections/Certifications/components/CertificationCard.tsx
'use client';

import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, Calendar, Building2, CheckCircle, AlertTriangle, Clock 
} from 'lucide-react';
import { Certification } from '@/types/certification';
import SmartImage from '@/components/common/SmartImage';
import PlaceholderImage from '@/components/common/PlaceholderImage';
import { getCertificationStatusInfo } from '../utils/certificationUtils';

interface CertificationCardProps {
  certification: Certification;
  viewMode: 'grid' | 'list';
  onClick: (cert: Certification) => void;
}

const CertificationCard = memo(({ 
  certification, 
  viewMode, 
  onClick 
}: CertificationCardProps) => {
  const [imageError, setImageError] = useState(false);
  const statusInfo = getCertificationStatusInfo(certification);

  // Rating berdasarkan faktor sertifikat (mirip proficiency di Skills)
  const getCertificationRating = () => {
    let rating = 3; // Base rating
    
    if (certification.isVerified) rating += 1;
    if (certification.featured) rating += 1;
    if (!certification.isExpired) rating += 0.5;
    if (certification.skills && certification.skills.length > 3) rating += 0.5;
    
    return Math.min(5, Math.round(rating));
  };

  const rating = getCertificationRating();

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    hover: { 
      y: -5, 
      scale: 1.02,
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  };

  // Sama seperti Skills - dark theme dengan efek glow
  const baseClasses = `
    relative overflow-hidden cursor-pointer group
    bg-gray-900/80 backdrop-blur-sm border border-gray-700/30
    hover:border-primary/40 transition-all duration-300 ease-out
  `;

  const modeClasses = viewMode === 'grid' 
    ? 'rounded-2xl p-6 h-full min-h-[320px]' 
    : 'rounded-xl p-4 flex items-center gap-4 min-h-[120px]';

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={() => onClick(certification)}
      className={`${baseClasses} ${modeClasses}`}
    >
      {/* Glow Effect - sama seperti Skills */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div 
          className="absolute inset-0 rounded-inherit blur-xl"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${statusInfo.color}15, transparent 70%)`
          }}
        />
      </div>

      {viewMode === 'grid' ? (
        <GridContent 
          certification={certification}
          statusInfo={statusInfo}
          imageError={imageError}
          setImageError={setImageError}
          rating={rating}
        />
      ) : (
        <ListContent 
          certification={certification}
          statusInfo={statusInfo}
          imageError={imageError}
          setImageError={setImageError}
          rating={rating}
        />
      )}
    </motion.div>
  );
});

// Grid Mode Content - dengan rating stars seperti Skills
const GridContent = memo(({ 
  certification, 
  statusInfo, 
  imageError, 
  setImageError,
  rating
}: {
  certification: Certification;
  statusInfo: any;
  imageError: boolean;
  setImageError: (error: boolean) => void;
  rating: number;
}) => (
  <div className="relative z-10 h-full flex flex-col">
    {/* Header dengan indicators - sama seperti Skills */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-2">
        {/* Featured Star Badge */}
        {certification.featured && (
          <motion.div 
            className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.2, rotate: 180 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Star className="w-3 h-3 text-white fill-current" />
          </motion.div>
        )}
        
        {/* Verified Badge */}
        {certification.isVerified && (
          <motion.div 
            className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-md"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <CheckCircle className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </div>

      {/* Rating Stars - sama seperti proficiency di Skills */}
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-600'
            }`}
          />
        ))}
        <span className="text-xs text-gray-400 ml-1">{rating}/5</span>
      </div>
    </div>

    {/* Certificate Image */}
    <div className="relative mb-4 rounded-xl overflow-hidden bg-gray-800/50 aspect-[4/3]">
      {!imageError && certification.certificateImage ? (
        <SmartImage
          src={certification.certificateImage}
          alt={`${certification.name} certificate`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImageError(true)}
          priority={certification.featured}
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
        <div className="absolute top-3 right-3 w-12 h-12 bg-white/90 rounded-lg p-2 backdrop-blur-sm">
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
      <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
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
      <div className="mt-auto">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{certification.issueDate.getFullYear()}</span>
          </div>
          <span 
            className="px-2 py-1 rounded-full font-medium"
            style={{ 
              backgroundColor: `${statusInfo.color}20`,
              color: statusInfo.color 
            }}
          >
            {statusInfo.label}
          </span>
        </div>
      </div>
    </div>
  </div>
));

// List Mode Content - dengan rating horizontal
const ListContent = memo(({ 
  certification, 
  statusInfo, 
  imageError, 
  setImageError,
  rating
}: {
  certification: Certification;
  statusInfo: any;
  imageError: boolean;
  setImageError: (error: boolean) => void;
  rating: number;
}) => (
  <div className="relative z-10 flex items-center gap-4 w-full">
    {/* Certificate Thumbnail */}
    <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-gray-800/50 flex-shrink-0">
      {!imageError && certification.certificateImage ? (
        <SmartImage
          src={certification.certificateImage}
          alt={`${certification.name} certificate`}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <PlaceholderImage
          width={80}
          height={64}
          className="w-full h-full text-xs"
        />
      )}
    </div>

    {/* Content */}
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate group-hover:text-primary transition-colors">
            {certification.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Building2 className="w-3 h-3 text-gray-400" />
            <span className="text-sm text-gray-300 truncate">
              {certification.issuingOrganization}
            </span>
          </div>
          
          {/* Rating untuk list mode */}
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < rating 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          {certification.featured && (
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
          )}
          {certification.isVerified && (
            <CheckCircle className="w-4 h-4 text-green-400" />
          )}
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
            style={{ 
              backgroundColor: `${statusInfo.color}20`,
              color: statusInfo.color 
            }}
          >
            {statusInfo.label}
          </span>
        </div>
      </div>
    </div>
  </div>
));

GridContent.displayName = 'GridContent';
ListContent.displayName = 'ListContent';
CertificationCard.displayName = 'CertificationCard';

export default CertificationCard;