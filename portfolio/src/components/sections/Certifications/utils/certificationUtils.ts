// src/components/sections/Certifications/utils/certificationUtils.ts
import { AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';
import type { Certification } from '@/types/certification';

export const getCertificationStatusInfo = (certification: Certification) => {
  if (certification.expirationDate) {
    const now = new Date();
    const expiration = new Date(certification.expirationDate);
    const daysDifference = Math.ceil((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference < 0) {
      return { 
        color: '#ef4444', 
        label: 'Expired', 
        icon: AlertTriangle,
        priority: 1 
      };
    } else if (daysDifference <= 30) {
      return { 
        color: '#f59e0b', 
        label: 'Expiring Soon', 
        icon: Clock,
        priority: 2 
      };
    } else {
      return { 
        color: '#10b981', 
        label: 'Valid', 
        icon: CheckCircle,
        priority: 3 
      };
    }
  }
  
  return { 
    color: '#3b82f6', 
    label: 'Lifetime', 
    icon: Shield,
    priority: 4 
  };
};

export const sortCertificationsByStatus = (certifications: Certification[]) => {
  return certifications.sort((a, b) => {
    const statusA = getCertificationStatusInfo(a);
    const statusB = getCertificationStatusInfo(b);
    return statusA.priority - statusB.priority;
  });
};

export const filterCertificationsByStatus = (
  certifications: Certification[], 
  filter: 'all' | 'valid' | 'expiring' | 'expired' | 'lifetime' | 'featured' | 'verified'
) => {
  switch (filter) {
    case 'valid':
      return certifications.filter(cert => {
        if (!cert.expirationDate) return true;
        const daysDiff = Math.ceil((new Date(cert.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff > 30;
      });
    case 'expiring':
      return certifications.filter(cert => {
        if (!cert.expirationDate) return false;
        const daysDiff = Math.ceil((new Date(cert.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff > 0 && daysDiff <= 30;
      });
    case 'expired':
      return certifications.filter(cert => {
        if (!cert.expirationDate) return false;
        return new Date() > new Date(cert.expirationDate);
      });
    case 'lifetime':
      return certifications.filter(cert => !cert.expirationDate);
    case 'featured':
      return certifications.filter(cert => cert.featured);
    case 'verified':
      return certifications.filter(cert => cert.isVerified);
    default:
      return certifications;
  }
};