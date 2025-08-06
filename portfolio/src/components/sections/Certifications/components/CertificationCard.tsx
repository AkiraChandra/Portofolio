// src/components/sections/Certifications/components/CertificationCard.tsx
'use client';

import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
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
  Zap
} from 'lucide-react';
import SmartImage from '@/components/common/SmartImage';
import PlaceholderImage from '@/components/common/PlaceholderImage';
import type { Certification } from '@/types/certification';

interface CertificationCardProps {
  certification: Certification;
  viewMode: 'grid' | 'list';
  isActive?: boolean;
  isFeatured?: boolean;
  className?: string;
  onClick?: () => void;
}

const getStatusInfo = (certification: Certification) => {
  if (certification.expirationDate) {
    const now = new Date();
    const expiration = new Date(certification.expirationDate);
    const daysDifference = Math.ceil((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference < 0) {
      return { 
        label: 'Expired', 
        color: '#ef4444', 
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
        icon: AlertCircle,
        priority: 1 
      };
    } else if (daysDifference <= 30) {
      return { 
        label: 'Expiring Soon', 
        color: '#f59e0b', 
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/20',
        icon: Clock,
        priority: 2 
      };
    } else {
      return { 
        label: 'Valid', 
        color: '#10b981', 
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
        icon: CheckCircle,
        priority: 3 
      };
    }
  }
  
  return { 
    label: 'Lifetime', 
    color: '#3b82f6', 
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    icon: Shield,
    priority: 4 
  };
};

const CertificationCard = memo(({
  certification,
  viewMode,
  isActive = false,
  isFeatured = false,
  className = '',
  onClick
}: CertificationCardProps) => {
  const [imageError, setImageError] = useState(false);
  const statusInfo = getStatusInfo(certification);
  const StatusIcon = statusInfo.icon;

  const cardContent = (
    <>
      {/* Card Header with Image/Icon */}
      <div className={`
        relative overflow-hidden
        ${viewMode === 'grid' 
          ? 'h-28 md:h-32 mb-3' 
          : 'w-16 h-16 md:w-18 md:h-18 flex-shrink-0'
        }
        rounded-lg bg-background-tertiary/30 dark:bg-background-tertiary-dark/30
        border border-border-primary/10 dark:border-border-primary-dark/10
      `}>
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
            <Award className={`
              ${viewMode === 'grid' ? 'w-6 h-6 md:w-8 md:h-8' : 'w-5 h-5 md:w-6 md:h-6'} 
              text-text-tertiary dark:text-text-tertiary-dark
            `} />
          </div>
        )}
        
        {/* Status Badge - Top Right */}
        <div className={`
          absolute top-1.5 right-1.5 flex items-center gap-1 px-1.5 py-0.5
          ${statusInfo.bgColor} ${statusInfo.borderColor}
          border backdrop-blur-sm rounded-md
        `}>
          <StatusIcon className="w-2.5 h-2.5" style={{ color: statusInfo.color }} />
          {viewMode === 'grid' && (
            <span className="text-[10px] font-medium" style={{ color: statusInfo.color }}>
              {statusInfo.label}
            </span>
          )}
        </div>

        {/* Featured Badge - Top Left */}
        {isFeatured && (
          <div className="absolute top-1.5 left-1.5 w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-sm">
            <Star className="w-2.5 h-2.5 text-white fill-current" />
          </div>
        )}

        {/* Organization Logo - Bottom Right */}
        {certification.organizationLogo && (
          <div className="absolute bottom-1.5 right-1.5 w-5 h-5 md:w-6 md:h-6 bg-white/90 rounded-sm p-0.5 border border-border-primary/20 dark:border-border-primary-dark/20">
            <SmartImage
              src={certification.organizationLogo}
              alt={certification.issuingOrganization}
              fill
              className="object-contain"
            />
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className={`
        flex-1 min-w-0 space-y-2
        ${viewMode === 'list' ? 'ml-3 md:ml-4' : ''}
      `}>
        {/* Title and Organization */}
        <div className="space-y-1.5">
          <h3 className={`
            font-bold text-text-primary dark:text-text-primary-dark 
            leading-tight transition-colors duration-300
            group-hover:text-primary dark:group-hover:text-primary-dark
            ${viewMode === 'grid' ? 'text-sm md:text-base' : 'text-sm'}
            line-clamp-2
          `}>
            {certification.name}
          </h3>
          
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3 h-3 text-text-tertiary dark:text-text-tertiary-dark flex-shrink-0" />
            <span className="text-xs text-text-secondary dark:text-text-secondary-dark truncate">
              {certification.issuingOrganization}
            </span>
          </div>
        </div>

        {/* Description (Grid only) */}
        {viewMode === 'grid' && certification.description && (
          <p className="text-xs text-text-tertiary dark:text-text-tertiary-dark line-clamp-2 leading-relaxed">
            {certification.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-text-tertiary dark:text-text-tertiary-dark" />
            <span className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark">
              {certification.issueDate.getFullYear()}
              {certification.expirationDate && (
                <span> - {certification.expirationDate.getFullYear()}</span>
              )}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            {certification.isVerified && (
              <div className="flex items-center gap-1 text-green-500">
                <CheckCircle className="w-3 h-3" />
                {viewMode === 'grid' && (
                  <span className="text-[10px] font-medium">Verified</span>
                )}
              </div>
            )}
            
            {certification.credentialUrl && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 rounded-md bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark hover:bg-primary/20 dark:hover:bg-primary-dark/20 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      layout
      className={`${className} w-full`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        onClick={onClick}
        className={`
          group relative cursor-pointer h-full
          p-3 md:p-4
          bg-background-secondary/50 dark:bg-background-secondary-dark/50
          backdrop-blur-sm
          border border-border-primary/20 dark:border-border-primary-dark/20
          rounded-xl
          transition-all duration-300
          hover:bg-background-secondary/70 dark:hover:bg-background-secondary-dark/70
          hover:border-primary/30 dark:hover:border-primary-dark/30
          hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary-dark/5
          ${isActive ? 'ring-1 ring-primary/30 dark:ring-primary-dark/30' : ''}
          ${isFeatured ? 'border-primary/25 dark:border-primary-dark/25' : ''}
          ${viewMode === 'grid' ? 'flex flex-col' : 'flex items-start'}
        `}
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 8px 30px rgba(var(--color-primary), 0.08)"
        }}
      >
        {/* Subtle background gradient - Skills style */}
        <div 
          className="absolute inset-0 opacity-[0.01] dark:opacity-[0.02] rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${statusInfo.color}20, transparent 70%)`
          }}
        />

        {/* Content */}
        <div className={`
          relative z-10 w-full
          ${viewMode === 'grid' ? 'flex flex-col h-full' : 'flex items-start'}
        `}>
          {cardContent}
        </div>
      </motion.div>
    </motion.div>
  );
});

CertificationCard.displayName = 'CertificationCard';

export default CertificationCard;