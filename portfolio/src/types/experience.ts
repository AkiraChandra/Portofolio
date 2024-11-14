// src/types/experience.ts

export interface ExperienceLink {
  label: string;
  url: string;
  icon?: string;
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
  projectImages?: {
    url: string;
    caption?: string;
  }[];
  certificateUrl?: string;
  links?: ExperienceLink[];
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