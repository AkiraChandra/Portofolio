// src/services/skillsService.ts

import { supabase } from '@/lib/supabase';
import type {
  SkillCategory,
  SkillWithCategory,
  SkillSearchParams,
  SkillsResponse,
  SkillCategoriesResponse,
  SkillsByCategoryResponse,
} from '@/types/skills';

export class SkillsService {
  // ==========================================
  // SKILL CATEGORIES
  // ==========================================
  
  static async getSkillCategories(): Promise<SkillCategoriesResponse> {
    try {
      const { data, error, count } = await supabase
        .from('skill_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching skill categories:', error);
        return { data: [], count: 0, error: error.message };
      }

      return {
        data: data || [],
        count: count || 0
      };
    } catch (error) {
      console.error('Unexpected error fetching skill categories:', error);
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static async getSkillCategoryById(id: string): Promise<SkillCategory | null> {
    try {
      const { data, error } = await supabase
        .from('skill_categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching skill category:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Unexpected error fetching skill category:', error);
      return null;
    }
  }

  // ==========================================
  // SKILLS
  // ==========================================

  static async getSkills(params: SkillSearchParams = {}): Promise<SkillsResponse> {
    try {
      let query = supabase
        .from('skills_with_categories')
        .select('*', { count: 'exact' });

      // Apply search query
      if (params.query) {
        query = query.or(`name.ilike.%${params.query}%,description.ilike.%${params.query}%,category_name.ilike.%${params.query}%`);
      }

      // Apply filters
      if (params.filters) {
        const { filters } = params;
        
        if (filters.category_id) {
          query = query.eq('category_id', filters.category_id);
        }
        
        if (filters.proficiency_level) {
          query = query.gte('proficiency_level', filters.proficiency_level);
        }
        
        if (filters.is_featured !== undefined) {
          query = query.eq('is_featured', filters.is_featured);
        }
        
        if (filters.years_experience_min) {
          query = query.gte('years_of_experience', filters.years_experience_min);
        }
        
        if (filters.years_experience_max) {
          query = query.lte('years_of_experience', filters.years_experience_max);
        }
        
        if (filters.has_certification !== undefined) {
          if (filters.has_certification) {
            query = query.not('certification_name', 'is', null);
          } else {
            query = query.is('certification_name', null);
          }
        }
      }

      // Apply sorting
      const sortBy = params.sort_by || 'category_order';
      const sortOrder = params.sort_order || 'asc';
      
      if (sortBy === 'category_order') {
        query = query.order('category_order', { ascending: sortOrder === 'asc' })
                    .order('skill_order', { ascending: true });
      } else {
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      }

      // Apply pagination
      if (params.limit) {
        query = query.range(params.offset || 0, (params.offset || 0) + params.limit - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching skills:', error);
        return { data: [], count: 0, error: error.message };
      }

      return {
        data: data || [],
        count: count || 0
      };
    } catch (error) {
      console.error('Unexpected error fetching skills:', error);
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static async getFeaturedSkills(): Promise<SkillsResponse> {
    return this.getSkills({
      filters: { is_featured: true },
      sort_by: 'proficiency_level',
      sort_order: 'desc'
    });
  }

  static async getSkillsByCategory(): Promise<SkillsByCategoryResponse> {
    try {
      const { data, error, count } = await supabase
        .from('skills_by_category')
        .select('*')
        .order('category_order', { ascending: true });

      if (error) {
        console.error('Error fetching skills by category:', error);
        return { data: [], count: 0, error: error.message };
      }

      return {
        data: data || [],
        count: count || 0
      };
    } catch (error) {
      console.error('Unexpected error fetching skills by category:', error);
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static async getSkillById(id: string): Promise<SkillWithCategory | null> {
    try {
      const { data, error } = await supabase
        .from('skills_with_categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching skill:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Unexpected error fetching skill:', error);
      return null;
    }
  }

  static async getSkillsByIds(ids: string[]): Promise<SkillWithCategory[]> {
    try {
      const { data, error } = await supabase
        .from('skills_with_categories')
        .select('*')
        .in('id', ids)
        .order('category_order', { ascending: true })
        .order('skill_order', { ascending: true });

      if (error) {
        console.error('Error fetching skills by IDs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching skills by IDs:', error);
      return [];
    }
  }

  // ==========================================
  // EXPERIENCE SKILLS
  // ==========================================

  static async getSkillsByExperienceId(experienceId: string): Promise<SkillWithCategory[]> {
    try {
      const { data, error } = await supabase
        .from('experience_skills')
        .select(`
          skill_id,
          skills_with_categories (*)
        `)
        .eq('experience_id', experienceId);

      if (error) {
        console.error('Error fetching skills for experience:', error);
        return [];
      }

      // Extract skills from the joined data
      const skills = data?.map((item: any) => item.skills_with_categories).filter(Boolean) || [];
      
      return skills;
    } catch (error) {
      console.error('Unexpected error fetching skills for experience:', error);
      return [];
    }
  }

  static async getExperiencesBySkillId(skillId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('experience_skills')
        .select('experience_id')
        .eq('skill_id', skillId);

      if (error) {
        console.error('Error fetching experiences for skill:', error);
        return [];
      }

      return data?.map(item => item.experience_id) || [];
    } catch (error) {
      console.error('Unexpected error fetching experiences for skill:', error);
      return [];
    }
  }

  // ==========================================
  // STATISTICS
  // ==========================================

  static async getSkillsStats() {
    try {
      const [skillsResult, categoriesResult] = await Promise.all([
        this.getSkills(),
        this.getSkillCategories()
      ]);

      const skills = skillsResult.data;
      const categories = categoriesResult.data;

      const totalSkills = skills.length;
      const featuredSkills = skills.filter(skill => skill.is_featured).length;
      const categoriesCount = categories.length;
      
      const avgProficiency = totalSkills > 0 
        ? skills.reduce((sum, skill) => sum + skill.proficiency_level, 0) / totalSkills 
        : 0;
      
      const avgExperience = totalSkills > 0 
        ? skills.reduce((sum, skill) => sum + skill.years_of_experience, 0) / totalSkills 
        : 0;

      // Additional stats
      const skillsByProficiency = skills.reduce((acc, skill) => {
        acc[skill.proficiency_level] = (acc[skill.proficiency_level] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      const skillsByCategory = categories.map(category => ({
        category: category.name,
        count: skills.filter(skill => skill.category_id === category.id).length,
        color: category.color
      }));

      const recentlyUsed = skills
        .filter(skill => skill.last_used_date)
        .sort((a, b) => new Date(b.last_used_date).getTime() - new Date(a.last_used_date).getTime())
        .slice(0, 5);

      const withCertifications = skills.filter(skill => skill.certification_name).length;

      return {
        totalSkills,
        featuredSkills,
        categoriesCount,
        avgProficiency: Math.round(avgProficiency * 10) / 10,
        avgExperience: Math.round(avgExperience * 10) / 10,
        skillsByProficiency,
        skillsByCategory,
        recentlyUsed,
        withCertifications
      };
    } catch (error) {
      console.error('Error fetching skills stats:', error);
      return {
        totalSkills: 0,
        featuredSkills: 0,
        categoriesCount: 0,
        avgProficiency: 0,
        avgExperience: 0,
        skillsByProficiency: {},
        skillsByCategory: [],
        recentlyUsed: [],
        withCertifications: 0
      };
    }
  }

  // ==========================================
  // SEARCH HELPERS
  // ==========================================

  static async searchSkills(query: string, limit = 10): Promise<SkillWithCategory[]> {
    try {
      const result = await this.getSkills({
        query,
        limit,
        sort_by: 'proficiency_level',
        sort_order: 'desc'
      });

      return result.data;
    } catch (error) {
      console.error('Error searching skills:', error);
      return [];
    }
  }

  static async getTopSkills(limit = 10): Promise<SkillWithCategory[]> {
    try {
      const result = await this.getSkills({
        filters: { proficiency_level: 4 },
        limit,
        sort_by: 'proficiency_level',
        sort_order: 'desc'
      });

      return result.data;
    } catch (error) {
      console.error('Error fetching top skills:', error);
      return [];
    }
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  static getProficiencyLabel(level: number): string {
    const labels = {
      1: 'Beginner',
      2: 'Novice', 
      3: 'Intermediate',
      4: 'Advanced',
      5: 'Expert'
    };
    return labels[level as keyof typeof labels] || 'Unknown';
  }

  static getExperienceCategory(years: number): string {
    if (years < 0.5) return 'New';
    if (years < 1) return 'Fresh';
    if (years < 2) return 'Junior';
    if (years < 3) return 'Mid-level';
    return 'Senior';
  }

  static formatYearsExperience(years: number): string {
    if (years === 0) return 'New';
    if (years < 1) return `${Math.round(years * 12)} months`;
    if (years === 1) return '1 year';
    return `${Math.round(years * 10) / 10} years`;
  }
}