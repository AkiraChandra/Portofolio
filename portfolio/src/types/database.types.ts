// src/types/database.types.ts
export interface ProjectDB {
    id: string;
    created_at: string;
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
  }
  
  export type Database = {
    public: {
      Tables: {
        projects: {
          Row: ProjectDB;
          Insert: Omit<ProjectDB, 'id' | 'created_at'>;
          Update: Partial<Omit<ProjectDB, 'id' | 'created_at'>>;
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
  
  // src/types/projects.ts updates
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
      features: string[];
    };
    size: {
      desktop: number;
      tablet: number;
      mobile: number;
    };
  }
  