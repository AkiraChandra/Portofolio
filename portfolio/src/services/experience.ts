// File: src/services/experience.ts
// src/services/experience.ts - CLEANED VERSION (Removed unused methods)

import { supabase } from "@/lib/supabase";
import { Experience } from "@/types/experience";

// ✅ FIXED: Remove unused import
// import { ExperienceDB } from "@/types/experience"; // ❌ REMOVED - not used

// ✅ FIXED: Define proper types instead of any
interface DatabaseExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  description?: string;
  icon?: string;
  achievements?: string[];
  status: string;
  location?: string;
  technologies?: string[];
  certificate_url?: string;
  resume_data?: {
    responsibilities?: string[];
    toolsUsed?: string[];
    impact?: string[];
  };
  order_index: number;
  
  // JOIN relations
  experience_links?: DatabaseExperienceLink[];
  experience_images?: DatabaseExperienceImage[];
  experience_skills?: DatabaseExperienceSkill[];
}

interface DatabaseExperienceLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
  order_index: number;
}

interface DatabaseExperienceImage {
  id: string;
  type: string;
  url: string;
  storage_path?: string;
  thumbnail?: string;
  caption?: string;
  order_index: number;
}

interface DatabaseExperienceSkill {
  id: string;
  name: string;
  level: number;
  color?: string;
  order_index: number;
}

const transformDatabaseExperience = (dbExperience: DatabaseExperience): Experience => {
  try {
    return {
      id: dbExperience.id,
      company: dbExperience.company,
      role: dbExperience.role,
      period: dbExperience.period,
      description: dbExperience.description || "",
      icon: dbExperience.icon || "",
      achievements: dbExperience.achievements || [],
      status: dbExperience.status === "ongoing" || dbExperience.status === "completed"
        ? dbExperience.status
        : "completed",
      location: dbExperience.location || undefined,
      technologies: dbExperience.technologies || undefined,
      certificateUrl: dbExperience.certificate_url || undefined,

      links:
        dbExperience.experience_links?.map((link: DatabaseExperienceLink) => ({
          id: link.id,
          label: link.label,
          url: link.url,
          icon: link.icon || undefined,
          order_index: link.order_index,
        })) || undefined,

      projectImages:
        dbExperience.experience_images?.map((image: DatabaseExperienceImage) => ({
          id: image.id,
          type: image.type as "image" | "video",
          url: image.url,
          storage_path: image.storage_path || undefined,
          thumbnail: image.thumbnail || undefined,
          caption: image.caption || undefined,
          order_index: image.order_index,
        })) || undefined,

      skills:
        dbExperience.experience_skills?.map((skill: DatabaseExperienceSkill) => ({
          id: skill.id,
          name: skill.name,
          level: skill.level,
          color: skill.color || undefined,
          order_index: skill.order_index,
        })) || undefined,

      resumeData: dbExperience.resume_data
        ? {
            responsibilities: dbExperience.resume_data.responsibilities || [],
            toolsUsed: dbExperience.resume_data.toolsUsed || [],
            impact: dbExperience.resume_data.impact || [],
          }
        : undefined,
      order_index: dbExperience.order_index,
    };
  } catch (error) {
    console.error("Error transforming experience:", error);
    throw error;
  }
};

export const experienceService = {
  // ✅ OPTIMIZED: Single query with JOIN - fixes N+1 problem
  async getExperiences(): Promise<Experience[]> {
    try {
      const { data: experiences, error } = await supabase
        .from("experiences")
        .select(
          `
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
        `
        )
        .order("order_index", { ascending: true });

      if (error) throw error;
      if (!experiences) return [];

      // ✅ FIXED: Type assertion with proper type
      return experiences.map((experience) =>
        transformDatabaseExperience(experience as DatabaseExperience)
      );
    } catch (error) {
      console.error("Error in getExperiences:", error);
      throw error;
    }
  },

  // ✅ KEPT: Used in hook
  async getOngoingExperiences(): Promise<Experience[]> {
    try {
      const { data: experiences, error } = await supabase
        .from("experiences")
        .select(
          `
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
        `
        )
        .eq("status", "ongoing")
        .order("order_index", { ascending: true });

      if (error) throw error;
      if (!experiences) return [];

      return experiences.map((experience) =>
        transformDatabaseExperience(experience as DatabaseExperience)
      );
    } catch (error) {
      console.error("Error in getOngoingExperiences:", error);
      throw error;
    }
  },

  // ✅ KEPT: Used in useSingleExperience hook
  async getExperienceById(id: string): Promise<Experience | null> {
    try {
      const { data: experience, error } = await supabase
        .from("experiences")
        .select(
          `
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
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!experience) return null;

      return transformDatabaseExperience(experience as DatabaseExperience);
    } catch (error) {
      console.error("Error in getExperienceById:", error);
      throw error;
    }
  },

  // ✅ KEPT: Used in hook
  async searchExperiences(query: string): Promise<Experience[]> {
    try {
      const { data: experiences, error } = await supabase
        .from("experiences")
        .select(
          `
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
        `
        )
        .or(
          `company.ilike.%${query}%,role.ilike.%${query}%,description.ilike.%${query}%`
        )
        .order("order_index", { ascending: true });

      if (error) throw error;
      if (!experiences) return [];

      return experiences.map((experience) =>
        transformDatabaseExperience(experience as DatabaseExperience)
      );
    } catch (error) {
      console.error("Error in searchExperiences:", error);
      throw error;
    }
  },

  // ✅ KEPT: Used in hook
  async getExperiencesByTech(tech: string): Promise<Experience[]> {
    try {
      const { data: experiences, error } = await supabase
        .from("experiences")
        .select(
          `
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
        `
        )
        .contains("technologies", [tech])
        .order("order_index", { ascending: true });

      if (error) throw error;
      if (!experiences) return [];

      return experiences.map((experience) =>
        transformDatabaseExperience(experience as DatabaseExperience)
      );
    } catch (error) {
      console.error("Error in getExperiencesByTech:", error);
      throw error;
    }
  },
};
