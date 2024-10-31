// src/types/projects.ts
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
  }
  
  export interface PlanetProps {
    project: Project;
    isActive: boolean;
    index: number;
    totalPlanets: number;
    onTransitionEnd?: () => void;
  }
  
  export interface ProgressLineProps {
    startIndex: number;
    endIndex: number;
    progress: number;
    isActive: boolean;
  }
  
  export interface ProjectPreviewProps {
    project: Project;
    isVisible: boolean;
    onTransitionEnd?: () => void;
  }