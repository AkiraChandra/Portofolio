// src/components/sections/Certifications/CertificationCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Award, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Star,
  Building2,
  Eye,
  Download
} from 'lucide-react';
import { Certification } from '@/types/certification';
import SmartImage from '@/components/common/SmartImage';
import PlaceholderImage from '@/components/common/PlaceholderImage';

interface CertificationCardProps {
  certification: Certification;
  showFullDetails?: boolean;
  onViewDetails?: (certification: Certification) => void;
  onToggleFeatured?: (id: string, featured: boolean) => void;
  isAdmin?: boolean;
}

const CertificationCard: React.FC<CertificationCardProps> = ({
  certification,
  showFullDetails = false,
  onViewDetails,
  onToggleFeatured,
  isAdmin = false
}) => {
  const [imageError, setImageError] = useState(false);

  // Format date helper
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short'
    }).format(date);
  };

  // Get status color and icon
  const getStatusDisplay = () => {
    if (certification.isExpired) {
      return {
        color: 'text-red-500 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        icon: AlertTriangle,
        text: 'Expired'
      };
    }
    
    if (certification.isExpiringSoon) {
      return {
        color: 'text-yellow-500 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        icon: Clock,
        text: `Expires in ${certification.daysUntilExpiration} days`
      };
    }
    
    return {
      color: 'text-green-500 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      icon: CheckCircle,
      text: certification.expirationDate ? 'Valid' : 'No Expiration'
    };
  };

  const statusDisplay = getStatusDisplay();
  const StatusIcon = statusDisplay.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-background-secondary/80 dark:bg-background-secondary-dark/80 
                 backdrop-blur-md rounded-xl border border-border-primary/20 dark:border-border-primary-dark/20 
                 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
      whileHover={{ scale: 1.02 }}
    >
      {/* Featured Badge */}
      {certification.featured && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 dark:bg-primary-dark/10 
                         text-primary dark:text-primary-dark rounded-full text-xs font-medium">
            <Star className="w-3 h-3 fill-current" />
            <span>Featured</span>
          </div>
        </div>
      )}

      {/* Admin Controls */}
      {isAdmin && (
        <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFeatured?.(certification.id, !certification.featured)}
              className="p-1.5 rounded-full bg-background-primary/80 dark:bg-background-primary-dark/80 
                       hover:bg-background-primary dark:hover:bg-background-primary-dark transition-colors"
              title={certification.featured ? 'Remove from featured' : 'Add to featured'}
            >
              <Star className={`w-4 h-4 ${certification.featured ? 'fill-primary text-primary' : 'text-text-tertiary'}`} />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Certificate Image Section */}
        <div className="flex-shrink-0 w-full lg:w-48">
          <div className="relative aspect-[4/3] lg:aspect-square rounded-lg overflow-hidden 
                         bg-background-tertiary/50 dark:bg-background-tertiary-dark/50">
            {certification.certificateImage && !imageError ? (
              <SmartImage
                src={certification.certificateImage}
                alt={`${certification.name} certificate`}
                fill
                sizes="(max-width: 1024px) 100vw, 192px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <PlaceholderImage
                type="general"
                className="rounded-lg"
              />
            )}
            
            {/* Verification Badge */}
            {certification.isVerified && (
              <div className="absolute bottom-2 right-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-green-500/90 text-white 
                               rounded-full text-xs font-medium backdrop-blur-sm">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              </div>
            )}

            {/* View Certificate Button */}
            {certification.certificateImage && (
              <div className="absolute inset-0 flex items-center justify-center 
                             bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => window.open(certification.certificateImage, '_blank')}
                  className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 
                           text-white rounded-lg backdrop-blur-sm transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">View Certificate</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-text-primary dark:text-text-primary-dark 
                         group-hover:text-primary dark:group-hover:text-primary-dark transition-colors">
              {certification.name}
            </h3>
            
            <div className="flex items-center gap-2 text-text-secondary dark:text-text-secondary-dark">
              <Building2 className="w-4 h-4" />
              <span className="font-medium">{certification.issuingOrganization}</span>
              
              {/* Organization Logo */}
              {certification.organizationLogo && (
                <div className="ml-2">
                  <SmartImage
                    src={certification.organizationLogo}
                    alt={`${certification.issuingOrganization} logo`}
                    width={24}
                    height={24}
                    className="rounded"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusDisplay.bgColor}`}>
              <StatusIcon className={`w-4 h-4 ${statusDisplay.color}`} />
              <span className={`text-sm font-medium ${statusDisplay.color}`}>
                {statusDisplay.text}
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-text-secondary dark:text-text-secondary-dark">
              <Calendar className="w-4 h-4" />
              <div>
                <span className="text-xs text-text-tertiary dark:text-text-tertiary-dark">Issued</span>
                <p className="text-sm font-medium">{formatDate(certification.issueDate)}</p>
              </div>
            </div>
            
            {certification.expirationDate && (
              <div className="flex items-center gap-2 text-text-secondary dark:text-text-secondary-dark">
                <Clock className="w-4 h-4" />
                <div>
                  <span className="text-xs text-text-tertiary dark:text-text-tertiary-dark">Expires</span>
                  <p className="text-sm font-medium">{formatDate(certification.expirationDate)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {certification.description && (
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed 
                         line-clamp-2">
              {certification.description}
            </p>
          )}

          {/* Skills */}
          {certification.skills && certification.skills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                Skills Gained
              </h4>
              <div className="flex flex-wrap gap-2">
                {certification.skills.slice(0, showFullDetails ? undefined : 4).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 text-xs rounded-full bg-primary/10 dark:bg-primary-dark/10 
                             text-primary dark:text-primary-dark border border-primary/20 dark:border-primary-dark/20"
                  >
                    {skill}
                  </span>
                ))}
                {!showFullDetails && certification.skills.length > 4 && (
                  <span className="px-2 py-1 text-xs rounded-full bg-background-tertiary/50 dark:bg-background-tertiary-dark/50 
                                 text-text-tertiary dark:text-text-tertiary-dark">
                    +{certification.skills.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Credential ID */}
          {certification.credentialId && (
            <div className="flex items-center gap-2 text-text-secondary dark:text-text-secondary-dark">
              <Award className="w-4 h-4" />
              <span className="text-xs text-text-tertiary dark:text-text-tertiary-dark">Credential ID:</span>
              <code className="text-xs font-mono bg-background-tertiary/50 dark:bg-background-tertiary-dark/50 
                             px-2 py-1 rounded">{certification.credentialId}</code>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {certification.credentialUrl && (
              <motion.a
                href={certification.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium 
                         text-primary dark:text-primary-dark hover:text-primary-dark dark:hover:text-primary 
                         border border-primary/20 dark:border-primary-dark/20 rounded-lg 
                         hover:bg-primary/5 dark:hover:bg-primary-dark/5 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Credential</span>
              </motion.a>
            )}

            {certification.verificationUrl && (
              <motion.a
                href={certification.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium 
                         text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark 
                         border border-border-primary/20 dark:border-border-primary-dark/20 rounded-lg 
                         hover:bg-background-tertiary/50 dark:hover:bg-background-tertiary-dark/50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Verify</span>
              </motion.a>
            )}

            {onViewDetails && (
              <motion.button
                onClick={() => onViewDetails(certification)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium 
                         text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark 
                         border border-border-primary/20 dark:border-border-primary-dark/20 rounded-lg 
                         hover:bg-background-tertiary/50 dark:hover:bg-background-tertiary-dark/50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </motion.button>
            )}
          </div>

          {/* Additional Links */}
          {certification.links && certification.links.length > 0 && showFullDetails && (
            <div className="space-y-2 pt-2 border-t border-border-primary/20 dark:border-border-primary-dark/20">
              <h4 className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                Additional Resources
              </h4>
              <div className="flex flex-wrap gap-2">
                {certification.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs 
                             text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark 
                             border border-border-primary/20 dark:border-border-primary-dark/20 rounded 
                             hover:bg-primary/5 dark:hover:bg-primary-dark/5 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CertificationCard;