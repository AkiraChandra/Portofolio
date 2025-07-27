// src/types/certifications.ts

export interface CertificationLink {
  id?: string;
  certification_id?: string;
  label: string;
  url: string;
  link_type: 'credential' | 'verification' | 'course' | 'portfolio' | 'other';
  order_index?: number;
}

export interface CertificationSkill {
  id?: string;
  certification_id?: string;
  skill_name: string;
  skill_level: number; // 1-100
  order_index?: number;
}

// Database Certification Type
export interface CertificationDB {
  id: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  issuing_organization: string;
  issue_date: string; // ISO date string
  expiration_date: string | null; // ISO date string or null
  credential_id: string | null;
  credential_url: string | null;
  description: string | null;
  skills: string[] | null;
  status: 'active' | 'expired' | 'pending';
  certificate_image: string | null;
  organization_logo: string | null;
  is_verified: boolean;
  verification_url: string | null;
  featured: boolean;
  order_index: number;
  metadata: Record<string, any> | null;
}

// Frontend Certification Type (transformed from DB)
export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: Date;
  expirationDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  skills?: string[];
  status: 'active' | 'expired' | 'pending';
  certificateImage?: string;
  organizationLogo?: string;
  isVerified: boolean;
  verificationUrl?: string;
  featured: boolean;
  orderIndex: number;
  
  // Related data
  links?: CertificationLink[];
  skillDetails?: CertificationSkill[];
  metadata?: Record<string, any>;
  
  // Computed properties
  isExpired?: boolean;
  daysUntilExpiration?: number;
  isExpiringSoon?: boolean; // within 90 days
}

// Component Props Types
export interface CertificationCardProps {
  certification: Certification;
  showFullDetails?: boolean;
  onEdit?: (certification: Certification) => void;
  onDelete?: (id: string) => void;
  onToggleFeatured?: (id: string, featured: boolean) => void;
}

export interface CertificationListProps {
  certifications: Certification[];
  loading?: boolean;
  error?: string;
  onEdit?: (certification: Certification) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
  showFilters?: boolean;
  showSearch?: boolean;
}

export interface CertificationFilters {
  status?: 'all' | 'active' | 'expired' | 'pending';
  featured?: boolean;
  organization?: string;
  skills?: string[];
  issueDateRange?: {
    start?: Date;
    end?: Date;
  };
  expirationDateRange?: {
    start?: Date;
    end?: Date;
  };
}

export interface CertificationFormData {
  name: string;
  issuingOrganization: string;
  issueDate: Date;
  expirationDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  skills?: string[];
  status: 'active' | 'expired' | 'pending';
  certificateImage?: File | string;
  organizationLogo?: File | string;
  isVerified?: boolean;
  verificationUrl?: string;
  featured?: boolean;
  links?: Omit<CertificationLink, 'id' | 'certification_id'>[];
  skillDetails?: Omit<CertificationSkill, 'id' | 'certification_id'>[];
}

// Database Definition for Supabase Types
export type CertificationDatabase = {
  public: {
    Tables: {
      certifications: {
        Row: CertificationDB;
        Insert: Omit<CertificationDB, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CertificationDB, 'id' | 'created_at' | 'updated_at'>>;
      };
      certification_skills: {
        Row: {
          id: string;
          certification_id: string;
          skill_name: string;
          skill_level: number;
          order_index: number;
          created_at: string;
        };
        Insert: Omit<CertificationSkill, 'id'> & { certification_id: string };
        Update: Partial<Omit<CertificationSkill, 'id'>>;
      };
      certification_links: {
        Row: {
          id: string;
          certification_id: string;
          label: string;
          url: string;
          link_type: 'credential' | 'verification' | 'course' | 'portfolio' | 'other';
          order_index: number;
          created_at: string;
        };
        Insert: Omit<CertificationLink, 'id'> & { certification_id: string };
        Update: Partial<Omit<CertificationLink, 'id'>>;
      };
    };
    Functions: {
      update_certification_order: {
        Args: { certification_ids: string[] };
        Returns: void;
      };
    };
  };
};

// File Upload Types
export interface ImageUploadOptions {
  alt?: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface ImageUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

// Search and Analytics Types
export interface CertificationStats {
  total: number;
  active: number;
  expired: number;
  expiringSoon: number; // within 90 days
  featured: number;
  topSkills: Array<{
    skill: string;
    count: number;
  }>;
  topOrganizations: Array<{
    organization: string;
    count: number;
  }>;
}

export interface CertificationSearchOptions {
  query?: string;
  filters?: CertificationFilters;
  sortBy?: 'issue_date' | 'expiration_date' | 'name' | 'organization' | 'order_index';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}