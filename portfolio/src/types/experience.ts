// src/types/experience.ts

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  icon: string; // URL to company logo
  achievements: string[];
  status: 'ongoing' | 'completed';
  location?: string;
}

export interface TimelineItemProps {
  experience: Experience;
  isActive: boolean;
  onClick: () => void;
  isLast?: boolean; // Added isLast prop
}

export interface TimelineInfoProps {
  experience: Experience;
  isVisible: boolean;
}

export interface TimelineGlowProps {
  isActive: boolean;
  color?: string;
}