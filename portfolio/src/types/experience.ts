// src/types/experience.ts

export interface Experience {
    id: string;
    company: string;
    role: string;
    period: string;
    description: string;
    icon: string;
    achievements: string[];
  }
  
  export interface TimelinePointProps {
    experience: Experience;
    isActive: boolean;
    onHover: () => void;
    onLeave: () => void;
  }
  
  export interface TimelineInfoProps {
    experience: Experience;
    isVisible: boolean;
  }
  
  export interface ExperienceTransitionHook {
    activeIndex: number;
    setActiveIndex: (index: number) => void;
    isTransitioning: boolean;
  }