// src/components/sections/Certifications/components/CertificationModal.tsx
'use client';

import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, ExternalLink, CheckCircle, X 
} from 'lucide-react';
import { Certification } from '@/types/certification';
import SmartImage from '@/components/common/SmartImage';
import { getCertificationStatusInfo } from '../utils/certificationUtils';

interface CertificationModalProps {
  certification: Certification | null;
  onClose: () => void;
}

const CertificationModal = memo(({ 
  certification, 
  onClose 
}: CertificationModalProps) => {
  if (!certification) return null;

  const statusInfo = getCertificationStatusInfo(certification);

  return typeof document !== 'undefined' ? createPortal(
    <AnimatePresence>
      {certification && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            margin: 0,
            transform: 'none'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            onClose();
            document.body.style.overflow = 'unset';
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-background-primary/95 dark:bg-background-primary-dark/95 backdrop-blur-sm rounded-2xl border border-border-primary/20 dark:border-border-primary-dark/20 max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
          {/* Header */}
          <div className="p-6 border-b border-border-primary/20 dark:border-border-primary-dark/20">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark mb-2">
                  {certification.name}
                </h2>
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-text-tertiary dark:text-text-tertiary-dark" />
                  <span className="text-text-secondary dark:text-text-secondary-dark">
                    {certification.issuingOrganization}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  document.body.style.overflow = 'unset';
                }}
                className="p-2 rounded-lg hover:bg-background-secondary dark:hover:bg-background-secondary-dark transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
            {/* Certificate Image */}
            {certification.certificateImage && (
              <div className="relative mb-6 rounded-xl overflow-hidden bg-background-secondary/50 dark:bg-background-secondary-dark/50 aspect-[4/3]">
                <SmartImage
                  src={certification.certificateImage}
                  alt={`${certification.name} certificate`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}

            {/* Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-text-tertiary dark:text-text-tertiary-dark">Issue Date</label>
                  <p className="font-medium text-text-primary dark:text-text-primary-dark">
                    {certification.issueDate.toLocaleDateString()}
                  </p>
                </div>
                {certification.expirationDate && (
                  <div>
                    <label className="text-sm text-text-tertiary dark:text-text-tertiary-dark">Expiration Date</label>
                    <p className="font-medium text-text-primary dark:text-text-primary-dark">
                      {certification.expirationDate.toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {certification.description && (
                <div>
                  <label className="text-sm text-text-tertiary dark:text-text-tertiary-dark">Description</label>
                  <p className="text-text-secondary dark:text-text-secondary-dark mt-1">
                    {certification.description}
                  </p>
                </div>
              )}

              {certification.skills && certification.skills.length > 0 && (
                <div>
                  <label className="text-sm text-text-tertiary dark:text-text-tertiary-dark">Skills</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {certification.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm bg-primary/20 dark:bg-primary-dark/20 text-primary dark:text-primary-dark rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 pt-4 border-t border-border-primary/20 dark:border-border-primary-dark/20">
                <div className="flex items-center gap-2">
                  <statusInfo.icon 
                    className="w-5 h-5"
                    style={{ color: statusInfo.color }}
                  />
                  <span 
                    className="font-medium"
                    style={{ color: statusInfo.color }}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                {certification.isVerified && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Verified</span>
                  </div>
                )}
              </div>

              {/* Action Buttons - FIXED */}
              <div className="flex gap-3 pt-4">
                {certification.credentialUrl && (
                  <a
                    href={certification.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 dark:bg-primary-dark/20 text-primary dark:text-primary-dark rounded-lg hover:bg-primary/30 dark:hover:bg-primary-dark/30 transition-colors font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Credential
                  </a>
                )}
                {certification.verificationUrl && (
                  <a
                    href={certification.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-500/30 transition-colors font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Verify
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>,
    document.body
  ) : null;
});

CertificationModal.displayName = 'CertificationModal';

export default CertificationModal;