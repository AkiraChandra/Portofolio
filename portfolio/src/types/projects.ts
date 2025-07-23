// src/types/projects.ts
import { Transition } from 'framer-motion';

// Base Image type for project images
export interface ProjectImage {
  id: string;
  project_id: string;
  url: string;
  storage_path: string;
  alt: string | null;
  caption: string | null;
  order_index: number;
  created_at: string;
}

// Database Project Type
export interface ProjectDB {
  id: string;
  created_at?: string;
  name: string;
  description: string | null;
  planet_image: string | null;
  tech_stack: string[] | null;
  demo_link: string | null;
  github_link: string | null;
  featured: boolean;
  preview_content: {
    title?: string;
    description?: string;
    features?: string[];
  } | null;
  size: {
    desktop: number;
    tablet: number;
    mobile: number;
  } | null;
  images?: ProjectImage[] | null;
}

// Frontend Project Type
export interface Project {
  id: string;
  name: string;
  description: string;
  planetImage: string;
  techStack: string[];
  demoLink?: string;
  githubLink?: string;
  featured: boolean;
  previewContent: {
    title: string;
    description: string;
    features: string[];
  };
  size: {
    desktop: number;
    tablet: number;
    mobile: number;
  };
  images: {
    url: string;
    alt?: string;
    caption?: string;
    orderIndex: number;
  }[];
}

// Component Props Types
export interface ProjectPreviewProps {
  project: Project;
  isVisible: boolean;
  containerWidth?: number;
  onTransitionEnd?: () => void;
}

export interface PlanetProps {
  project: Project;
  isActive: boolean;
  index: number;
  totalPlanets: number;
  size?: number;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  onPlanetClick?: () => void;
  isTransitioning?: boolean;
  isSelected?: boolean;
}

export interface ConnectingLineProps {
  progress: number;
  isActive: boolean;
  width?: number;
}

// Animation Types
export interface AnimationConfig {
  rotate: number[] | number;
  transition: Transition;
}

export interface PlanetAnimation {
  rotate: number[] | number;
  scale: number;
  transition: Transition;
}

export interface PlanetAnimationHook {
  rotateAnimation: AnimationConfig;
  scaleAnimation: PlanetAnimation;
}

export interface ProjectTransitionHook {
  activeIndex: number;
  progress: number;
  direction: 'right' | 'left';
  isLineAnimating: boolean;
  isPaused: boolean;
  jumpToProject: (index: number) => void;
  pausePreview: () => void;
  resumePreview: () => void;
}

export interface ProjectTransitionProps {
  totalProjects: number;
  previewDuration?: number;
  lineDuration?: number;
}

// Database Definition
export type Database = {
  public: {
    Tables: {
      projects: {
        Row: ProjectDB;
        Insert: Omit<ProjectDB, 'id' | 'created_at' | 'images'>;
        Update: Partial<Omit<ProjectDB, 'id' | 'created_at' | 'images'>>;
      };
      project_images: {
        Row: ProjectImage;
        Insert: Omit<ProjectImage, 'id' | 'created_at'>;
        Update: Partial<Omit<ProjectImage, 'id' | 'created_at'>>;
      };
    };
    Functions: {
      update_project_order: {
        Args: { project_ids: string[] };
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
}

export interface ImageUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}