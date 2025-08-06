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
  AlertCircle
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
        icon: AlertCircle,
        priority: 1 
      };
    } else if (daysDifference <= 30) {
      return { 
        label: 'Expiring Soon', 
        color: '#f59e0b', 
        icon: Clock,
        priority: 2 
      };
    } else {
      return { 
        label: 'Valid', 
        color: '#10b981', 
        icon: CheckCircle,
        priority: 3 
      };
    }
  }
  
  return { 
    label: 'Lifetime', 
    color: '#3b82f6', 
    icon: Shield,
    priority: 4 
  };
};

// Horizontal Card Content for both Grid and List modes
const HorizontalContent = memo(({ 
  certification, 
  statusInfo, 
  isGrid = false 
}: { 
  certification: Certification; 
  statusInfo: ReturnType<typeof getStatusInfo>;
  isGrid?: boolean;
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`flex gap-4 h-full ${isGrid ? 'p-4' : 'p-3'}`}>
      {/* Certificate Image - Compact */}
      <div className={`relative flex-shrink-0 rounded-lg overflow-hidden bg-background-tertiary/30 dark:bg-background-tertiary-dark/30 ${
        isGrid ? 'w-24 h-20' : 'w-20 h-16'
      }`}>
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
          <div className="w-full h-full flex items-center justify-center">
            <Award className="w-6 h-6 text-text-tertiary dark:text-text-tertiary-dark" />
          </div>
        )}
        
        {/* Organization Logo - Small overlay */}
        {certification.organizationLogo && (
          <div className="absolute bottom-1 right-1 w-6 h-6 bg-white/90 rounded-md p-1 backdrop-blur-sm">
            <SmartImage
              src={certification.organizationLogo}
              alt={certification.issuingOrganization}
              fill
              className="object-contain"
            />
          </div>
        )}
      </div>

      {/* Content - Expanded */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className={`font-bold text-text-primary dark:text-text-primary-dark line-clamp-2 group-hover:text-primary dark:group-hover:text-primary-dark transition-colors ${
              isGrid ? 'text-sm' : 'text-sm'
            }`}>
              {certification.name}
            </h3>
            
            {/* Icons - Compact */}
            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              {certification.featured && (
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
              )}
              {certification.isVerified && (
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
              )}
            </div>
          </div>
          
          {/* Organization */}
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-3.5 h-3.5 text-text-tertiary dark:text-text-tertiary-dark flex-shrink-0" />
            <span className="text-xs text-text-secondary dark:text-text-secondary-dark truncate">
              {certification.issuingOrganization}
            </span>
          </div>

          {/* Description - Only in grid mode */}
          {isGrid && certification.description && (
            <p className="text-xs text-text-tertiary dark:text-text-tertiary-dark line-clamp-2 mb-2">
              {certification.description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Date */}
          <div className="flex items-center gap-1 text-xs text-text-tertiary dark:text-text-tertiary-dark">
            <Calendar className="w-3 h-3" />
            <span>{certification.issueDate.getFullYear()}</span>
            {certification.expirationDate && (
              <>
                <span>-</span>
                <span>{certification.expirationDate.getFullYear()}</span>
              </>
            )}
          </div>
          
          {/* Status */}
          <div className="flex items-center gap-1">
            <statusInfo.icon className="w-3 h-3" style={{ color: statusInfo.color }} />
            <span 
              className="text-xs font-medium"
              style={{ color: statusInfo.color }}
            >
              {statusInfo.label}
            </span>
          </div>
        </div>

        {/* Skills Tags - Only in grid mode */}
        {isGrid && certification.skills && certification.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {certification.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs bg-primary/15 dark:bg-primary-dark/15 text-primary dark:text-primary-dark rounded-md font-medium"
              >
                {skill}
              </span>
            ))}
            {certification.skills.length > 3 && (
              <span className="text-xs text-text-tertiary dark:text-text-tertiary-dark">
                +{certification.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Button - Only in grid mode */}
      {isGrid && certification.credentialUrl && (
        <div className="flex-shrink-0 flex items-center">
          <motion.a
            href={certification.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark hover:bg-primary/20 dark:hover:bg-primary-dark/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </div>
      )}
    </div>
  );
});

HorizontalContent.displayName = 'HorizontalContent';

const CertificationCard: React.FC<CertificationCardProps> = memo(({
  certification,
  viewMode,
  isActive = false,
  isFeatured = false,
  className = '',
  onClick
}) => {
  const statusInfo = getStatusInfo(certification);
  
  return (
    <motion.div
      className={`group cursor-pointer ${className}`}
      onClick={onClick}
      whileHover={{ 
        scale: 1.01, 
        y: viewMode === 'grid' ? -2 : 0,
        x: viewMode === 'list' ? 2 : 0 
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`
          relative overflow-hidden rounded-xl
          bg-background-secondary/50 dark:bg-background-secondary-dark/50 
          backdrop-blur-sm
          border border-border-primary/20 dark:border-border-primary-dark/20
          hover:bg-background-secondary/70 dark:hover:bg-background-secondary-dark/70
          hover:border-primary/30 dark:hover:border-primary-dark/30
          transition-all duration-300
          hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary-dark/5
          ${isActive ? 'ring-1 ring-primary/30 dark:ring-primary-dark/30 shadow-md shadow-primary/10 dark:shadow-primary-dark/10' : ''}
          ${isFeatured ? 'border-primary/25 dark:border-primary-dark/25' : ''}
          ${viewMode === 'grid' ? 'h-32' : 'h-20'}
        `}
      >
        {/* Background Gradient Effect - sama seperti Skills */}
        <div 
          className="absolute inset-0 opacity-[0.01] dark:opacity-[0.02]"
          style={{
            background: `linear-gradient(135deg, ${statusInfo.color}20, transparent 70%)`
          }}
        />

        {/* Content */}
        <HorizontalContent 
          certification={certification} 
          statusInfo={statusInfo}
          isGrid={viewMode === 'grid'}
        />
      </div>
    </motion.div>
  );
});

CertificationCard.displayName = 'CertificationCard';

export default CertificationCard;