// src/components/sections/Certifications/CertificationCard.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Award,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Clock,
  Building2,
  Eye,
} from "lucide-react";
import { Certification } from "@/types/certification";
import SmartImage from "@/components/common/SmartImage";
import PlaceholderImage from "@/components/common/PlaceholderImage";

interface CertificationCardProps {
  certification: Certification;
  onViewDetails?: (certification: Certification) => void;
  isAdmin?: boolean;
}

const CertificationCard: React.FC<CertificationCardProps> = ({
  certification,
  onViewDetails,
  isAdmin = false,
}) => {
  const [imageError, setImageError] = useState(false);

  // Format date helper
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
    }).format(date);
  };

  // Get status display
  const getStatusDisplay = () => {
    if (certification.isExpired) {
      return {
        color: "text-red-500",
        icon: AlertTriangle,
        text: "Expired",
      };
    }

    if (certification.isExpiringSoon) {
      return {
        color: "text-yellow-500",
        icon: Clock,
        text: `Expires in ${certification.daysUntilExpiration} days`,
      };
    }

    return {
      color: "text-green-500",
      icon: CheckCircle,
      text: "Valid",
    };
  };

  const statusDisplay = getStatusDisplay();
  const StatusIcon = statusDisplay.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-background-secondary/80 dark:bg-background-secondary-dark/80 
                 backdrop-blur-md rounded-xl border border-border-primary/20 dark:border-border-primary-dark/20 
                 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Certificate Image */}
        <div className="flex-shrink-0 w-full sm:w-24 h-24">
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-background-tertiary/50 dark:bg-background-tertiary-dark/50">
            {certification.certificateImage && !imageError ? (
              <SmartImage
                src={certification.certificateImage}
                alt={`${certification.name} certificate`}
                fill
                sizes="96px"
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <PlaceholderImage type="general" className="rounded-lg" />
            )}

            {/* View Certificate Button */}
            {certification.certificateImage && (
              <div
                className="absolute inset-0 flex items-center justify-center 
                             bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
              >
                <button
                  onClick={() =>
                    window.open(certification.certificateImage, "_blank")
                  }
                  className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Information */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark truncate">
              {certification.name}
            </h3>

            <div className="flex items-center gap-2 text-text-secondary dark:text-text-secondary-dark text-sm">
              <Building2 className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">
                {certification.issuingOrganization}
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <StatusIcon className={`w-4 h-4 ${statusDisplay.color}`} />
              <span className={`text-sm font-medium ${statusDisplay.color}`}>
                {statusDisplay.text}
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="flex flex-wrap gap-4 mb-3 text-sm text-text-secondary dark:text-text-secondary-dark">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Issued {formatDate(certification.issueDate)}</span>
            </div>

            {certification.expirationDate && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Expires {formatDate(certification.expirationDate)}</span>
              </div>
            )}
          </div>

          {/* Skills (max 3) */}
          {certification.skills && certification.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {certification.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 text-xs rounded-md bg-primary/10 dark:bg-primary-dark/10 
                           text-primary dark:text-primary-dark border border-primary/20 dark:border-primary-dark/20"
                >
                  {skill}
                </span>
              ))}
              {certification.skills.length > 3 && (
                <span
                  className="px-2 py-1 text-xs rounded-md bg-background-tertiary/50 dark:bg-background-tertiary-dark/50 
                               text-text-tertiary dark:text-text-tertiary-dark"
                >
                  +{certification.skills.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Credential ID */}
          {certification.credentialId && (
            <div className="flex items-center gap-2 text-text-secondary dark:text-text-secondary-dark">
              <Award className="w-4 h-4" />
              <span className="text-xs text-text-tertiary dark:text-text-tertiary-dark">
                Credential ID:
              </span>
              <code
                className="text-xs font-mono bg-background-tertiary/50 dark:bg-background-tertiary-dark/50 
                             px-2 py-1 rounded"
              >
                {certification.credentialId}
              </code>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {certification.credentialUrl && (
              <a
                href={certification.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium 
                         text-primary dark:text-primary-dark hover:text-primary-dark dark:hover:text-primary 
                         border border-primary/20 dark:border-primary-dark/20 rounded-lg 
                         hover:bg-primary/5 dark:hover:bg-primary-dark/5 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View</span>
              </a>
            )}

            {certification.verificationUrl && (
              <a
                href={certification.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium 
                         text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark 
                         border border-border-primary/20 dark:border-border-primary-dark/20 rounded-lg 
                         hover:bg-background-tertiary/50 dark:hover:bg-background-tertiary-dark/50 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Verify</span>
              </a>
            )}

            {onViewDetails && (
              <button
                onClick={() => onViewDetails(certification)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium 
                         text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark 
                         border border-border-primary/20 dark:border-border-primary-dark/20 rounded-lg 
                         hover:bg-background-tertiary/50 dark:hover:bg-background-tertiary-dark/50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Details</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CertificationCard;
