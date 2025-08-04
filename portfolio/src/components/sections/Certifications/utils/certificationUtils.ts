// src/components/sections/Certifications/utils/certificationUtils.ts
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Certification } from '@/types/certification';

export const getCertificationStatusInfo = (certification: Certification) => {
  if (certification.isExpired) {
    return { 
      color: '#ef4444', 
      label: 'Expired', 
      icon: AlertTriangle 
    };
  }
  
  if (certification.isExpiringSoon) {
    return { 
      color: '#f59e0b', 
      label: 'Expiring Soon', 
      icon: Clock 
    };
  }
  
  return { 
    color: '#10b981', 
    label: 'Active', 
    icon: CheckCircle 
  };
};

export const formatCertificationDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const calculateDaysUntilExpiration = (expirationDate: Date): number => {
  const now = new Date();
  const diffTime = expirationDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};