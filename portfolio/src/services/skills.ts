// src/services/skillsService.ts - LEAN VERSION (Hanya Method yang Dipakai)

import { supabase } from '@/lib/supabase';
import type {
  SkillFilters,
  SkillSearchParams,
  SkillsResponse,
  SkillCategoriesResponse
} from '@/types/skills';

export class SkillsService {
  // Cache untuk performance
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static CACHE_TTL = 5 * 60 * 1000; // 5 menit

  // ==========================================
  // CACHE MANAGEMENT
  // ==========================================
  
  private static getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private static setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  static clearCache(): void {
    this.cache.clear();
  }

  // ==========================================
  // SKILL CATEGORIES - REQUIRED
  // ==========================================
  
  static async getSkillCategories(): Promise<SkillCategoriesResponse> {
    try {
      const cacheKey = 'skill_categories';
      const cached = this.getFromCache<SkillCategoriesResponse>(cacheKey);
      if (cached) return cached;

      const { data, error, count } = await supabase
        .from('skill_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching skill categories:', error);
        return { data: [], count: 0, error: error.message };
      }

      const result = { data: data || [], count: count || 0 };
      this.setCache(cacheKey, result);
      return result;

    } catch (error) {
      console.error('Unexpected error fetching skill categories:', error);
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // ==========================================
  // SKILLS - MAIN METHOD
  // ==========================================

  static async getSkills(params: SkillSearchParams = {}): Promise<SkillsResponse> {
    try {
      let query = supabase
        .from('skills_with_categories')
        .select('*', { count: 'exact' });

      // Search optimization
      if (params.query) {
        const searchTerm = params.query.trim();
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category_name.ilike.%${searchTerm}%`);
      }

      // Apply filters
      if (params.filters) {
        this.applyFilters(query, params.filters);
      }

      // Apply sorting
      this.applySorting(query, params.sort_by, params.sort_order);

      // Apply pagination
      if (params.limit && params.limit > 0) {
        const start = params.offset || 0;
        const end = start + params.limit - 1;
        query = query.range(start, end);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching skills:', error);
        return { data: [], count: 0, error: error.message };
      }

      return { data: data || [], count: count || 0 };

    } catch (error) {
      console.error('Unexpected error fetching skills:', error);
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Helper methods untuk getSkills
  private static applyFilters(query: any, filters: SkillFilters): void {
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

  private static applySorting(query: any, sortBy?: string, sortOrder?: string): void {
    const actualSortBy = sortBy || 'category_order';
    const actualSortOrder = sortOrder || 'asc';
    
    if (actualSortBy === 'category_order') {
      query = query
        .order('category_order', { ascending: actualSortOrder === 'asc' })
        .order('display_order', { ascending: true });
    } else {
      query = query.order(actualSortBy, { ascending: actualSortOrder === 'asc' });
    }
  }

  // ==========================================
  // FEATURED SKILLS - REQUIRED
  // ==========================================

  static async getFeaturedSkills(): Promise<SkillsResponse> {
    const cacheKey = 'featured_skills';
    const cached = this.getFromCache<SkillsResponse>(cacheKey);
    if (cached) return cached;

    const result = await this.getSkills({
      filters: { is_featured: true },
      sort_by: 'proficiency_level',
      sort_order: 'desc'
    });

    if (!result.error) {
      this.setCache(cacheKey, result);
    }

    return result;
  }

  // ==========================================
  // STATISTICS - REQUIRED
  // ==========================================

  static async getSkillsStats() {
    try {
      const cacheKey = 'skills_stats';
      const cached = this.getFromCache<any>(cacheKey);
      if (cached) return cached;

      // Single query untuk performance
      const { data: skillsData, error } = await supabase
        .from('skills_with_categories')
        .select('proficiency_level, years_of_experience, is_featured, category_id');

      if (error) {
        console.error('Error fetching skills stats:', error);
        return null;
      }

      const { data: categoriesData } = await supabase
        .from('skill_categories')
        .select('id');

      const totalSkills = skillsData?.length || 0;
      const featuredSkills = skillsData?.filter(skill => skill.is_featured).length || 0;
      const categoriesCount = categoriesData?.length || 0;
      
      const avgProficiency = totalSkills > 0 
        ? skillsData.reduce((sum: number, skill: any) => sum + skill.proficiency_level, 0) / totalSkills 
        : 0;
      
      const avgExperience = totalSkills > 0 
        ? skillsData.reduce((sum: number, skill: any) => sum + skill.years_of_experience, 0) / totalSkills 
        : 0;

      const stats = {
        totalSkills,
        featuredSkills,
        categoriesCount,
        avgProficiency: Math.round(avgProficiency * 10) / 10,
        avgExperience: Math.round(avgExperience * 10) / 10
      };

      this.setCache(cacheKey, stats);
      return stats;

    } catch (error) {
      console.error('Error fetching skills stats:', error);
      return null;
    }
  }
}
