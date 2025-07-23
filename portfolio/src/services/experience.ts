// src/services/experience.ts
import { supabase } from '@/lib/supabase';
import { 
  Experience, 
  ExperienceDB, 
  ExperienceLink, 
  MediaItem, 
  Skill,
  ImageUploadOptions 
} from '@/types/experience';

const transformDatabaseExperience = async (dbExperience: ExperienceDB): Promise<Experience> => {
  try {
    // Fetch related data in parallel
    const [linksResult, imagesResult, skillsResult] = await Promise.all([
      // Fetch experience links
      supabase
        .from('experience_links')
        .select('*')
        .eq('experience_id', dbExperience.id)
        .order('order_index', { ascending: true }),
      
      // Fetch experience images
      supabase
        .from('experience_images')
        .select('*')
        .eq('experience_id', dbExperience.id)
        .order('order_index', { ascending: true }),
      
      // Fetch experience skills
      supabase
        .from('experience_skills')
        .select('*')
        .eq('experience_id', dbExperience.id)
        .order('order_index', { ascending: true })
    ]);

    // Handle potential errors
    if (linksResult.error) {
      console.error('Error fetching experience links:', linksResult.error);
    }
    if (imagesResult.error) {
      console.error('Error fetching experience images:', imagesResult.error);
    }
    if (skillsResult.error) {
      console.error('Error fetching experience skills:', skillsResult.error);
    }

    return {
      id: dbExperience.id,
      company: dbExperience.company,
      role: dbExperience.role,
      period: dbExperience.period,
      description: dbExperience.description || '',
      // UPDATED: Use the icon URL directly from database (no fallback to local path)
      icon: dbExperience.icon || '',
      achievements: dbExperience.achievements || [],
      status: dbExperience.status,
      location: dbExperience.location || undefined,
      technologies: dbExperience.technologies || undefined,
      certificateUrl: dbExperience.certificate_url || undefined,
      links: linksResult.data?.map(link => ({
        id: link.id,
        label: link.label,
        url: link.url,
        icon: link.icon || undefined,
        order_index: link.order_index
      })) || undefined,
      projectImages: imagesResult.data?.map(image => ({
        id: image.id,
        type: image.type,
        url: image.url,
        storage_path: image.storage_path || undefined,
        thumbnail: image.thumbnail || undefined,
        caption: image.caption || undefined,
        order_index: image.order_index
      })) || undefined,
      skills: skillsResult.data?.map(skill => ({
        id: skill.id,
        name: skill.name,
        level: skill.level,
        color: skill.color || undefined,
        order_index: skill.order_index
      })) || undefined,
      resumeData: dbExperience.resume_data ? {
        responsibilities: dbExperience.resume_data.responsibilities || [],
        toolsUsed: dbExperience.resume_data.toolsUsed || [],
        impact: dbExperience.resume_data.impact || []
      } : undefined,
      order_index: dbExperience.order_index
    };
  } catch (error) {
    console.error('Error transforming experience:', error);
    throw error;
  }
};

// Transform frontend experience for database insert/update
const transformExperienceForInsert = (experience: Partial<Experience>): Omit<ExperienceDB, 'id' | 'created_at' | 'updated_at'> => {
  return {
    company: experience.company!,
    role: experience.role!,
    period: experience.period!,
    description: experience.description || null,
    icon: experience.icon || null,
    location: experience.location || null,
    status: experience.status || 'completed',
    achievements: experience.achievements || null,
    technologies: experience.technologies || null,
    certificate_url: experience.certificateUrl || null,
    preview_content: null, // Can be extended later if needed
    resume_data: experience.resumeData ? {
      responsibilities: experience.resumeData.responsibilities,
      toolsUsed: experience.resumeData.toolsUsed,
      impact: experience.resumeData.impact
    } : null,
    order_index: experience.order_index || 0
  };
};

export const uploadCompanyLogo = async (file: File, companyName: string) => {
  try {
    // Create filename from company name
    const fileName = `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${file.name.split('.').pop()}`;
    const filePath = `company-logos/${fileName}`;
    
    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file, {
        upsert: true // Allow overwriting existing files
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading company logo:', error);
    throw error;
  }
};

export const experienceService = {
  // Get all experiences with their related data
  async getExperiences() {
    try {
      const { data: experiences, error } = await supabase
        .from('experiences')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (!experiences) return [];

      return await Promise.all(
        experiences.map(experience => transformDatabaseExperience(experience))
      );
    } catch (error) {
      console.error('Error in getExperiences:', error);
      throw error;
    }
  },

  // Get ongoing experiences
  async getOngoingExperiences() {
    try {
      const { data: experiences, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('status', 'ongoing')
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (!experiences) return [];

      return await Promise.all(
        experiences.map(experience => transformDatabaseExperience(experience))
      );
    } catch (error) {
      console.error('Error in getOngoingExperiences:', error);
      throw error;
    }
  },

  // Get single experience by ID
  async getExperienceById(id: string) {
    try {
      const { data: experience, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!experience) return null;

      return await transformDatabaseExperience(experience);
    } catch (error) {
      console.error('Error in getExperienceById:', error);
      throw error;
    }
  },

  async uploadCompanyLogo(file: File, companyName: string) {
    return uploadCompanyLogo(file, companyName);
  },

  // Updated createExperience to handle icon URLs
  async createExperience(experienceData: Partial<Experience>) {
    try {
      const transformedData = transformExperienceForInsert(experienceData);
      
      const { data, error } = await supabase
        .from('experiences')
        .insert([transformedData])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from insert');

      // Add related data if provided
      if (experienceData.links?.length) {
        await this.addExperienceLinks(data.id, experienceData.links);
      }

      if (experienceData.skills?.length) {
        await this.addExperienceSkills(data.id, experienceData.skills);
      }

      return await transformDatabaseExperience(data);
    } catch (error) {
      console.error('Error in createExperience:', error);
      throw error;
    }
  },

  // Update experience
  async updateExperience(id: string, experienceData: Partial<Experience>) {
    try {
      const transformedData = transformExperienceForInsert(experienceData);

      const { data, error } = await supabase
        .from('experiences')
        .update(transformedData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from update');

      return await transformDatabaseExperience(data);
    } catch (error) {
      console.error('Error in updateExperience:', error);
      throw error;
    }
  },

  // Delete experience and its related data
  async deleteExperience(id: string) {
    try {
      // Delete related data first (due to foreign key constraints)
      await Promise.all([
        supabase.from('experience_links').delete().eq('experience_id', id),
        supabase.from('experience_images').delete().eq('experience_id', id),
        supabase.from('experience_skills').delete().eq('experience_id', id)
      ]);

      // Then delete the experience
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error in deleteExperience:', error);
      throw error;
    }
  },

  // Add experience links
  async addExperienceLinks(experienceId: string, links: ExperienceLink[]) {
    try {
      const linksWithExperienceId = links.map((link, index) => ({
        experience_id: experienceId,
        label: link.label,
        url: link.url,
        icon: link.icon || null,
        order_index: link.order_index || index
      }));

      const { error } = await supabase
        .from('experience_links')
        .insert(linksWithExperienceId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error adding experience links:', error);
      throw error;
    }
  },

  // Add experience skills
  async addExperienceSkills(experienceId: string, skills: Skill[]) {
    try {
      const skillsWithExperienceId = skills.map((skill, index) => ({
        experience_id: experienceId,
        name: skill.name,
        level: skill.level,
        color: skill.color || null,
        order_index: skill.order_index || index
      }));

      const { error } = await supabase
        .from('experience_skills')
        .insert(skillsWithExperienceId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error adding experience skills:', error);
      throw error;
    }
  },

  // Upload experience image
  async uploadExperienceImage(
    experienceId: string, 
    file: File, 
    options: ImageUploadOptions = {}
  ) {
    try {
      const filePath = `experiences/${experienceId}/${Date.now()}-${file.name}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('experience-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('experience-images')
        .getPublicUrl(filePath);

      // Create image record
      const { data, error: dbError } = await supabase
        .from('experience_images')
        .insert({
          experience_id: experienceId,
          url: publicUrl,
          storage_path: filePath,
          type: options.type || 'image',
          caption: options.caption || null,
          order_index: options.orderIndex || 0
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return data;
    } catch (error) {
      console.error('Error uploading experience image:', error);
      throw error;
    }
  },

  // Delete experience image
  async deleteExperienceImage(experienceId: string, imageId: string) {
    try {
      // Get the image record first
      const { data: image, error: fetchError } = await supabase
        .from('experience_images')
        .select('storage_path')
        .eq('id', imageId)
        .eq('experience_id', experienceId)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage if storage_path exists
      if (image?.storage_path) {
        const { error: storageError } = await supabase.storage
          .from('experience-images')
          .remove([image.storage_path]);

        if (storageError) throw storageError;
      }

      // Delete the database record
      const { error: dbError } = await supabase
        .from('experience_images')
        .delete()
        .eq('id', imageId)
        .eq('experience_id', experienceId);

      if (dbError) throw dbError;

      return true;
    } catch (error) {
      console.error('Error deleting experience image:', error);
      throw error;
    }
  },

  // Search experiences
  async searchExperiences(query: string) {
    try {
      const { data: experiences, error } = await supabase
        .from('experiences')
        .select('*')
        .or(`company.ilike.%${query}%,role.ilike.%${query}%,description.ilike.%${query}%`)
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (!experiences) return [];

      return await Promise.all(
        experiences.map(experience => transformDatabaseExperience(experience))
      );
    } catch (error) {
      console.error('Error in searchExperiences:', error);
      throw error;
    }
  },

  // Get experiences by technology
  async getExperiencesByTech(tech: string) {
    try {
      const { data: experiences, error } = await supabase
        .from('experiences')
        .select('*')
        .contains('technologies', [tech])
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (!experiences) return [];

      return await Promise.all(
        experiences.map(experience => transformDatabaseExperience(experience))
      );
    } catch (error) {
      console.error('Error in getExperiencesByTech:', error);
      throw error;
    }
  },

  // Update experience order
  async updateExperienceOrder(experienceIds: string[]) {
    try {
      const updates = experienceIds.map((id, index) => ({
        id,
        order_index: index
      }));

      const { error } = await supabase
        .from('experiences')
        .upsert(updates, {
          onConflict: 'id'
        });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error updating experience order:', error);
      throw error;
    }
  }
};