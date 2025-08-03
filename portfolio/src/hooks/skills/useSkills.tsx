// src/hooks/skills/useSkills.ts - LEAN VERSION (150 lines)

import { useState, useEffect, useCallback } from 'react';
import { SkillsService } from '@/services/skills';
import type {
  SkillWithCategory,
  SkillCategory,
  SkillFilters,
  SkillSearchParams
} from '@/types/skills';

// ==========================================
// MAIN SKILLS HOOK - SIMPLIFIED
// ==========================================

export interface UseSkillsOptions {
  autoFetch?: boolean;
}

export interface UseSkillsReturn {
  // Core data (2 properties only)
  skills: SkillWithCategory[];
  categories: SkillCategory[];
  
  // Unified states (2 properties only)
  loading: boolean;
  error: string | null;
  
  // Filter functionality (3 methods)
  filters: SkillFilters;
  setFilters: (filters: SkillFilters | ((prev: SkillFilters) => SkillFilters)) => void;
  clearFilters: () => void;
  
  // Search functionality (1 method)
  setSearchQuery: (query: string) => void;
  
  // Core action (1 method)
  refetch: () => Promise<void>;
}

export const useSkills = (options: UseSkillsOptions = {}): UseSkillsReturn => {
  const { autoFetch = true } = options;

  // Core state - MINIMAL
  const [skills, setSkills] = useState<SkillWithCategory[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SkillFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  // OPTIMIZED FETCH WITH PARALLEL LOADING
  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build search params
      const params: SkillSearchParams = {
        query: searchQuery || undefined,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        sort_by: 'proficiency_level',
        sort_order: 'desc',
        limit: 1000 // Get all skills với caching
      };

      // PARALLEL FETCH FOR PERFORMANCE
      const [skillsResult, categoriesResult] = await Promise.all([
        SkillsService.getSkills(params),
        SkillsService.getSkillCategories()
      ]);

      // Handle skills result
      if (skillsResult.error) {
        setError(skillsResult.error);
        return;
      }
      setSkills(skillsResult.data);

      // Handle categories result - Don't fail whole operation
      if (categoriesResult.error) {
        console.warn('Categories error:', categoriesResult.error);
      } else {
        setCategories(categoriesResult.data);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch skills';
      setError(errorMessage);
      console.error('Fetch skills error:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  // DEBOUNCED SEARCH
  const setSearchQueryDebounced = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // SIMPLE CLEAR FILTERS
  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
  }, []);

  // SIMPLE REFETCH
  const refetch = useCallback(async () => {
    await fetchSkills();
  }, [fetchSkills]);

  // SINGLE EFFECT
  useEffect(() => {
    if (autoFetch) {
      fetchSkills();
    }
  }, [autoFetch, fetchSkills]);

  return {
    // Core data
    skills,
    categories,
    
    // States
    loading,
    error,
    
    // Filters
    filters,
    setFilters,
    clearFilters,
    
    // Search
    setSearchQuery: setSearchQueryDebounced,
    
    // Actions
    refetch
  };
};

// ==========================================
// SKILLS STATS HOOK - MINIMAL
// ==========================================

export interface UseSkillsStatsReturn {
  stats: {
    totalSkills: number;
    featuredSkills: number;
    categoriesCount: number;
    avgProficiency: number;
    avgExperience: number;
  } | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSkillsStats = (): UseSkillsStatsReturn => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await SkillsService.getSkillsStats();
      
      if (!result) {
        setError('Failed to fetch stats');
        return;
      }

      setStats(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats';
      setError(errorMessage);
      console.error('Fetch stats error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

// ==========================================
// FEATURED SKILLS HOOK - SIMPLIFIED
// ==========================================

export const useFeaturedSkills = () => {
  const [featuredSkills, setFeaturedSkills] = useState<SkillWithCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedSkills = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await SkillsService.getFeaturedSkills();
      
      if (result.error) {
        setError(result.error);
        return;
      }

      setFeaturedSkills(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch featured skills';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedSkills();
  }, [fetchFeaturedSkills]);

  return {
    featuredSkills,
    loading,
    error,
    refetch: fetchFeaturedSkills
  };
};