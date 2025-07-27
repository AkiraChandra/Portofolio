// src/services/experience.ts - CLEANED VERSION (Removed unused methods)

import { supabase } from '@/lib/supabase';
import { 
  Experience, 
  ExperienceDB
} from '@/types/experience';

// ✅ Optimized transform for JOIN data (no additional queries)
const transformDatabaseExperience = (dbExperience: any): Experience => {
  try {
    return {
      id: dbExperience.id,
      company: dbExperience.company,
      role: dbExperience.role,
      period: dbExperience.period,
      description: dbExperience.description || '',
      icon: dbExperience.icon || '',
      achievements: dbExperience.achievements || [],
      status: dbExperience.status,
      location: dbExperience.location || undefined,
      technologies: dbExperience.technologies || undefined,
      certificateUrl: dbExperience.certificate_url || undefined,
      
      // ✅ Use JOIN data directly - no additional queries needed!
      links: dbExperience.experience_links?.map((link: any) => ({
        id: link.id,
        label: link.label,
        url: link.url,
        icon: link.icon || undefined,
        order_index: link.order_index
      })) || undefined,
      
      projectImages: dbExperience.experience_images?.map((image: any) => ({
        id: image.id,
        type: image.type,
        url: image.url,
        storage_path: image.storage_path || undefined,
        thumbnail: image.thumbnail || undefined,
        caption: image.caption || undefined,
        order_index: image.order_index
      })) || undefined,
      
      skills: dbExperience.experience_skills?.map((skill: any) => ({
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

// ❌ REMOVED: uploadCompanyLogo, transformExperienceForInsert functions - NOT USED

export const experienceService = {
  // ✅ OPTIMIZED: Single query with JOIN - fixes N+1 problem
  async getExperiences() {
    try {
      const { data: experiences, error } = await supabase
        .from('experiences')
        .select(`
          *,
          experience_links (
            id,
            label,
            url,
            icon,
            order_index
          ),
          experience_images (
            id,
            type,
            url,
            storage_path,
            thumbnail,
            caption,
            order_index
          ),
          experience_skills (
            id,
            name,
            level,
            color,
            order_index
          )
        `)
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (!experiences) return [];

      return experiences.map(experience => transformDatabaseExperience(experience));
    } catch (error) {
      console.error('Error in getExperiences:', error);
      throw error;
    }
  },

  // ✅ KEPT: Used in hook
  async getOngoingExperiences() {
    try {
      const { data: experiences, error } = await supabase
        .from('experiences')
        .select(`
          *,
          experience_links (
            id,
            label,
            url,
            icon,
            order_index
          ),
          experience_images (
            id,
            type,
            url,
            storage_path,
            thumbnail,
            caption,
            order_index
          ),
          experience_skills (
            id,
            name,
            level,
            color,
            order_index
          )
        `)
        .eq('status', 'ongoing')
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (!experiences) return [];

      return experiences.map(experience => transformDatabaseExperience(experience));
    } catch (error) {
      console.error('Error in getOngoingExperiences:', error);
      throw error;
    }
  },

  // ✅ KEPT: Used in useSingleExperience hook
  async getExperienceById(id: string) {
    try {
      const { data: experience, error } = await supabase
        .from('experiences')
        .select(`
          *,
          experience_links (
            id,
            label,
            url,
            icon,
            order_index
          ),
          experience_images (
            id,
            type,
            url,
            storage_path,
            thumbnail,
            caption,
            order_index
          ),
          experience_skills (
            id,
            name,
            level,
            color,
            order_index
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!experience) return null;

      return transformDatabaseExperience(experience);
    } catch (error) {
      console.error('Error in getExperienceById:', error);
      throw error;
    }
  },

  // ✅ KEPT: Used in hook
  async searchExperiences(query: string) {
    try {
      const { data: experiences, error } = await supabase
        .from('experiences')
        .select(`
          *,
          experience_links (
            id,
            label,
            url,
            icon,
            order_index
          ),
          experience_images (
            id,
            type,
            url,
            storage_path,
            thumbnail,
            caption,
            order_index
          ),
          experience_skills (
            id,
            name,
            level,
            color,
            order_index
          )
        `)
        .or(`company.ilike.%${query}%,role.ilike.%${query}%,description.ilike.%${query}%`)
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (!experiences) return [];

      return experiences.map(experience => transformDatabaseExperience(experience));
    } catch (error) {
      console.error('Error in searchExperiences:', error);
      throw error;
    }
  },

  // ✅ KEPT: Used in hook
  async getExperiencesByTech(tech: string) {
    try {
      const { data: experiences, error } = await supabase
        .from('experiences')
        .select(`
          *,
          experience_links (
            id,
            label,
            url,
            icon,
            order_index
          ),
          experience_images (
            id,
            type,
            url,
            storage_path,
            thumbnail,
            caption,
            order_index
          ),
          experience_skills (
            id,
            name,
            level,
            color,
            order_index
          )
        `)
        .contains('technologies', [tech])
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (!experiences) return [];

      return experiences.map(experience => transformDatabaseExperience(experience));
    } catch (error) {
      console.error('Error in getExperiencesByTech:', error);
      throw error;
    }
  }

  // ❌ REMOVED UNUSED METHODS (save ~200 lines of code):
  // - uploadCompanyLogo
  // - createExperience 
  // - updateExperience
  // - deleteExperience
  // - addExperienceLinks
  // - addExperienceSkills
  // - uploadExperienceImage
  // - deleteExperienceImage
  // - updateExperienceOrder
};

// ❌ COMMENTED OUT: All the unused CRUD methods for reference
/*
// These methods are not used in your read-only portfolio
export const unusedMethods = {
  async createExperience(experienceData: Partial<Experience>) { ... },
  async updateExperience(id: string, experienceData: Partial<Experience>) { ... },
  async deleteExperience(id: string) { ... },
  async addExperienceLinks(experienceId: string, links: ExperienceLink[]) { ... },
  async addExperienceSkills(experienceId: string, skills: Skill[]) { ... },
  async uploadExperienceImage(experienceId: string, file: File, options: ImageUploadOptions = {}) { ... },
  async deleteExperienceImage(experienceId: string, imageId: string) { ... },
  async updateExperienceOrder(experienceIds: string[]) { ... }
};
*/