import { Transition } from 'framer-motion';

export interface Project {
  id: string;
  name: string;
  description: string;
  planetImage: string;
  demoLink?: string;
  githubLink?: string;
  techStack: string[];
  previewContent: {
    title: string;
    description: string;
    image?: string;
    features?: string[];
  };
  size?: {
    desktop: number;
    tablet: number;
    mobile: number;
  };
}

export interface PlanetProps {
  project: Project;
  isActive: boolean;
  index: number;
  totalPlanets: number;
  size?: number;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

export interface ConnectingLineProps {
  progress: number;
  isActive: boolean;
  width?: number;
}

export interface ProjectPreviewProps {
  project: Project;
  isVisible: boolean;
  containerWidth?: number;
  onTransitionEnd?: () => void;
}

// Animation related types
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