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

const transformProjectForInsert = (project: Partial<Project>): Omit<ProjectDB, 'id' | 'created_at' | 'images'> => {
  return {
    name: project.name!,
    description: project.description || null,
    planet_image: project.planetImage || null, // Fixed planetImage
    tech_stack: project.techStack || [],
    demo_link: project.demoLink || null, // Fixed demoLink
    github_link: project.githubLink || null,
    featured: project.featured || false,
    preview_content: project.previewContent ? {
      title: project.previewContent.title,
      description: project.previewContent.description,
      features: project.previewContent.features
    } : null,
    size: project.size || DEFAULT_SIZE
  };
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

  // Get featured projects
  async getFeaturedProjects(limit: number = 3) {
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      if (!projects) return [];

      return await Promise.all(
        projects.map(project => transformDatabaseProject(project))
      );
    } catch (error) {
      console.error('Error in getFeaturedProjects:', error);
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

  // Create new project
  async createProject(projectData: Partial<Project>) {
    try {
      const transformedData = transformProjectForInsert(projectData);
      
      const { data, error } = await supabase
        .from('projects')
        .insert([transformedData])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from insert');

      return await transformDatabaseProject(data);
    } catch (error) {
      console.error('Error in createProject:', error);
      throw error;
    }
  },

  // Update project
  async updateProject(id: string, projectData: Partial<Project>) {
    try {
      const transformedData = transformProjectForInsert(projectData);

      const { data, error } = await supabase
        .from('projects')
        .update(transformedData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from update');

      return await transformDatabaseProject(data);
    } catch (error) {
      console.error('Error in updateProject:', error);
      throw error;
    }
  },

  // Delete project and its images
  async deleteProject(id: string) {
    try {
      // First, delete all associated images
      const { data: images } = await supabase
        .from('project_images')
        .select('id')
        .eq('project_id', id);

      if (images && images.length > 0) {
        await Promise.all(
          images.map(image => this.deleteProjectImage(id, image.id))
        );
      }

      // Then delete the project
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error in deleteProject:', error);
      throw error;
    }
  },

  // Upload project image
  async uploadProjectImage(projectId: string, file: File, options: {
    alt?: string;
    caption?: string;
    orderIndex?: number;
  } = {}) {
    try {
      const filePath = `projects/${projectId}/${Date.now()}-${file.name}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      // Create image record
      const { data, error: dbError } = await supabase
        .from('project_images')
        .insert({
          project_id: projectId,
          url: publicUrl,
          storage_path: filePath,
          alt: options.alt || null,
          caption: options.caption || null,
          order_index: options.orderIndex || 0
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return data;
    } catch (error) {
      console.error('Error uploading project image:', error);
      throw error;
    }
  },

  // Delete project image
  async deleteProjectImage(projectId: string, imageId: string) {
    try {
      // Get the image record first
      const { data: image, error: fetchError } = await supabase
        .from('project_images')
        .select('storage_path')
        .eq('id', imageId)
        .eq('project_id', projectId)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage if storage_path exists
      if (image?.storage_path) {
        const { error: storageError } = await supabase.storage
          .from('project-images')
          .remove([image.storage_path]);

        if (storageError) throw storageError;
      }

      // Delete the database record
      const { error: dbError } = await supabase
        .from('project_images')
        .delete()
        .eq('id', imageId)
        .eq('project_id', projectId);

      if (dbError) throw dbError;

      return true;
    } catch (error) {
      console.error('Error deleting project image:', error);
      throw error;
    }
  },

  // Update project image order
  async updateImageOrder(projectId: string, imageIds: string[]) {
    try {
      const updates = imageIds.map((id, index) => ({
        id,
        project_id: projectId,
        order_index: index
      }));

      const { error } = await supabase
        .from('project_images')
        .upsert(updates, {
          onConflict: 'id'
        });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error updating image order:', error);
      throw error;
    }
  },

  // Search projects
  async searchProjects(query: string) {
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!projects) return [];

      return await Promise.all(
        projects.map(project => transformDatabaseProject(project))
      );
    } catch (error) {
      console.error('Error in searchProjects:', error);
      throw error;
    }
  },

  // Get projects by technology
  async getProjectsByTech(tech: string) {
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .contains('tech_stack', [tech])
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!projects) return [];

      return await Promise.all(
        projects.map(project => transformDatabaseProject(project))
      );
    } catch (error) {
      console.error('Error in getProjectsByTech:', error);
      throw error;
    }
  }
};