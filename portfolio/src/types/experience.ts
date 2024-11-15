// src/types/experience.ts

export interface ExperienceLink {
  label: string;
  url: string;
  icon?: string;
}

export interface Skill {
  name: string;
  level: number;
  color?: string;
}

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  caption?: string;
}

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