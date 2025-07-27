// src/types/experience.ts

export interface ExperienceLink {
  id?: string;
  experience_id?: string;
  label: string;
  url: string;
  icon?: string;
  order_index?: number;
}

export interface Skill {
  id?: string;
  experience_id?: string;
  name: string;
  level: number;
  color?: string;
  order_index?: number;
}

export interface MediaItem {
  id?: string;
  experience_id?: string;
  type: 'image' | 'video';
  url: string;
  storage_path?: string;
  thumbnail?: string;
  caption?: string;
  order_index?: number;
}

// Database Experience Type
export interface ExperienceDB {
  id: string;
  created_at?: string;
  updated_at?: string;
  company: string;
  role: string;
  period: string;
  description: string | null;
  icon: string | null;
  location: string | null;
  status: 'ongoing' | 'completed';
  achievements: string[] | null;
  technologies: string[] | null;
  certificate_url: string | null;
  preview_content: {
    title?: string;
    description?: string;
    features?: string[];
  } | null;
  resume_data: {
    responsibilities?: string[];
    toolsUsed?: string[];
    impact?: string[];
  } | null;
  order_index: number;
}

// Frontend Experience Type (transformed from DB)
export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  icon: string;
  achievements: string[];
  status: 'ongoing' | 'completed';
  location?: string;
  technologies?: string[];
  projectImages?: MediaItem[];
  certificateUrl?: string;
  links?: ExperienceLink[];
  skills?: Skill[];
  resumeData?: {
    responsibilities: string[];
    toolsUsed: string[];
    impact: string[];
  };
  order_index?: number;
}

export interface TimelineItemProps {
  experience: Experience;
  isActive: boolean;
  onClick: () => void;
  isLast?: boolean;
}

export interface TimelineInfoProps {
  experience: Experience;
  isVisible: boolean;
}

export interface TimelineGlowProps {
  isActive: boolean;
  color?: string;
}

export interface ExportFormat {
  type: 'pdf' | 'docx' | 'txt';
  template?: string;
}

export interface ResumeExportProps {
  onExport?: (format: ExportFormat) => void;
  isExporting?: boolean;
}

// Database Definition for Supabase Types
export type ExperienceDatabase = {
  public: {
    Tables: {
      experiences: {
        Row: ExperienceDB;
        Insert: Omit<ExperienceDB, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ExperienceDB, 'id' | 'created_at' | 'updated_at'>>;
      };
      experience_links: {
        Row: {
          id: string;
          experience_id: string;
          label: string;
          url: string;
          icon: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: Omit<ExperienceLink, 'id'> & { experience_id: string };
        Update: Partial<Omit<ExperienceLink, 'id'>>;
      };
      experience_images: {
        Row: {
          id: string;
          experience_id: string;
          url: string;
          storage_path: string | null;
          type: 'image' | 'video';
          thumbnail: string | null;
          caption: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: Omit<MediaItem, 'id'> & { experience_id: string };
        Update: Partial<Omit<MediaItem, 'id'>>;
      };
      experience_skills: {
        Row: {
          id: string;
          experience_id: string;
          name: string;
          level: number;
          color: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: Omit<Skill, 'id'> & { experience_id: string };
        Update: Partial<Omit<Skill, 'id'>>;
      };
    };
    Functions: {
      update_experience_order: {
        Args: { experience_ids: string[] };
        Returns: void;
      };
    };
  };
};

// File Upload Types
export interface ImageUploadOptions {
  alt?: string;
  caption?: string;
  orderIndex?: number;
  type?: 'image' | 'video';
}

export interface ImageUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}