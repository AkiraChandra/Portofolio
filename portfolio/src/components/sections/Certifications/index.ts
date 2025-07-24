// src/components/sections/Certifications/index.ts

export { default as Certifications } from './Certifications';
export { default as CertificationCard } from './CertificationCard';
export { default as CertificationsList } from './CertificationList';

// Re-export types
export type {
  Certification,
  CertificationLink,
  CertificationSkill,
  CertificationFilters,
  CertificationCardProps,
  CertificationListProps
} from '@/types/certification';