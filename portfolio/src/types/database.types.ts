export type Project = {
    id: string
    created_at: string 
    name: string
    description: string
    planetImage: string // Sesuaikan dengan struktur yang ada
    techStack: string[]
    demoLink?: string
    githubLink?: string
    previewContent: {
      title: string
      description: string
      features: string[]
    }
    size?: {
      desktop: number
      tablet: number
      mobile: number
    }
  }
  
  export type Database = {
    public: {
      Tables: {
        projects: {
          Row: Project
          Insert: Omit<Project, 'id' | 'created_at'>
          Update: Partial<Project>
        }
      }
    }
  }