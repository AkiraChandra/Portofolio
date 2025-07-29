// src/services/projects.ts
import { supabase } from '@/lib/supabase';
import { Project, ProjectDB, ProjectImage } from '@/types/projects';

const DEFAULT_SIZE = {
  desktop: 200,
  tablet: 160,
  mobile: 120
};

// Transform database project to frontend project
const transformDatabaseProject = async (dbProject: ProjectDB): Promise<Project> => {
  try {
    // Fetch related images for the project
    const { data: projectImages, error: imagesError } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', dbProject.id)
      .order('order_index', { ascending: true });

    if (imagesError) {
      console.error('Error fetching project images:', imagesError);
    }

    return {
      id: dbProject.id,
      name: dbProject.name,
      description: dbProject.description || '',
      planetImage: dbProject.planet_image || `/planets/planet${Math.floor(Math.random() * 15) + 1}.png`, // Fixed planetImage
      demoLink: dbProject.demo_link || undefined, // Fixed demoLink
      githubLink: dbProject.github_link || undefined,
      techStack: dbProject.tech_stack || [],
      featured: dbProject.featured,
      previewContent: {
        title: dbProject.preview_content?.title || dbProject.name,
        description: dbProject.preview_content?.description || dbProject.description || '',
        features: dbProject.preview_content?.features || []
      },
      size: dbProject.size || DEFAULT_SIZE,
      images: projectImages?.map(img => ({
        url: img.url,
        alt: img.alt || '',
        caption: img.caption || '',
        orderIndex: img.order_index // Fixed orderIndex name
      })) || []
    };
  } catch (error) {
    console.error('Error transforming project:', error);
    throw error;
  }
};

export const projectService = {
  // Get all projects with their images
  async getProjects() {
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!projects) return [];

      return await Promise.all(
        projects.map(project => transformDatabaseProject(project))
      );
    } catch (error) {
      console.error('Error in getProjects:', error);
      throw error;
    }
  },

  // Get single project by ID
  async getProjectById(id: string) {
    try {
      const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!project) return null;

      return await transformDatabaseProject(project);
    } catch (error) {
      console.error('Error in getProjectById:', error);
      throw error;
    }
  },

};