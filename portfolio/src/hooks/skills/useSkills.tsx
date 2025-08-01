// src/hooks/skills/useSkills.ts

import { useState, useEffect, useCallback, useMemo } from 'react';
import { SkillsService } from '@/services/skills';
import type {
  SkillWithCategory,
  SkillCategory,
  SkillsByCategory,
  SkillFilters,
  SkillSearchParams
} from '@/types/skills';

// ==========================================
// MAIN SKILLS HOOK
// ==========================================

export interface UseSkillsOptions {
  initialFilters?: SkillFilters;
  initialSearchQuery?: string;
  autoFetch?: boolean;
  featuredOnly?: boolean;
}

export interface UseSkillsReturn {
  // Data
  skills: SkillWithCategory[];
  categories: SkillCategory[];
  skillsByCategory: SkillsByCategory[];
  
  // Loading states
  loading: boolean;
  categoriesLoading: boolean;
  skillsByCategoryLoading: boolean;
  
  // Error states
  error: string | null;
  categoriesError: string | null;
  skillsByCategoryError: string | null;
  
  // Search and filters
  searchQuery: string;
  filters: SkillFilters;
  
  // Pagination
  hasMore: boolean;
  totalCount: number;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setFilters: (filters: SkillFilters) => void;
  clearFilters: () => void;
  refetch: () => Promise<void>;
  fetchMore: () => Promise<void>;
  
  // Utility
  getSkillsByCategory: (categoryId: string) => SkillWithCategory[];
  searchSkills: (query: string) => SkillWithCategory[];
}

export const useSkills = (options: UseSkillsOptions = {}): UseSkillsReturn => {
  const {
    initialFilters = {},
    initialSearchQuery = '',
    autoFetch = true,
    featuredOnly = false
  } = options;

  // State
  const [skills, setSkills] = useState<SkillWithCategory[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [skillsByCategory, setSkillsByCategory] = useState<SkillsByCategory[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [skillsByCategoryLoading, setSkillsByCategoryLoading] = useState(false);
  
  // Error states
  const [error, setError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [skillsByCategoryError, setSkillsByCategoryError] = useState<string | null>(null);
  
  // Search and filters
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [filters, setFilters] = useState<SkillFilters>(
    featuredOnly ? { ...initialFilters, is_featured: true } : initialFilters
  );
  
  // Pagination
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const LIMIT = 20;

  // Fetch skills
  const fetchSkills = useCallback(async (isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
        setError(null);
      }

      const params: SkillSearchParams = {
        query: searchQuery || undefined,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        sort_by: 'name',
        sort_order: 'asc',
        limit: LIMIT,
        offset: isLoadMore ? offset : 0
      };

      const result = await SkillsService.getSkills(params);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (isLoadMore) {
        setSkills(prev => [...prev, ...result.data]);
        setOffset(prev => prev + LIMIT);
      } else {
        setSkills(result.data);
        setOffset(LIMIT);
      }

      setTotalCount(result.count);
      setHasMore(result.data.length === LIMIT && skills.length + result.data.length < result.count);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch skills';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, offset, skills.length]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);

      const result = await SkillsService.getSkillCategories();

      if (result.error) {
        setCategoriesError(result.error);
        return;
      }

      setCategories(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setCategoriesError(errorMessage);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Fetch skills by category
  const fetchSkillsByCategory = useCallback(async () => {
    try {
      setSkillsByCategoryLoading(true);
      setSkillsByCategoryError(null);

      const result = await SkillsService.getSkillsByCategory();

      if (result.error) {
        setSkillsByCategoryError(result.error);
        return;
      }

      setSkillsByCategory(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch skills by category';
      setSkillsByCategoryError(errorMessage);
    } finally {
      setSkillsByCategoryLoading(false);
    }
  }, []);

  // Refetch all data
  const refetch = useCallback(async () => {
    setOffset(0);
    await Promise.all([
      fetchSkills(false),
      fetchCategories(),
      fetchSkillsByCategory()
    ]);
  }, [fetchSkills, fetchCategories, fetchSkillsByCategory]);

  // Load more skills
  const fetchMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchSkills(true);
  }, [hasMore, loading, fetchSkills]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters(featuredOnly ? { is_featured: true } : {});
    setSearchQuery('');
  }, [featuredOnly]);

  // Utility functions
  const getSkillsByCategory = useCallback((categoryId: string): SkillWithCategory[] => {
    return skills.filter(skill => skill.category_id === categoryId);
  }, [skills]);

  const searchSkills = useCallback((query: string): SkillWithCategory[] => {
    const lowerQuery = query.toLowerCase();
    return skills.filter(skill => 
      skill.name.toLowerCase().includes(lowerQuery) ||
      skill.description?.toLowerCase().includes(lowerQuery) ||
      skill.category_name.toLowerCase().includes(lowerQuery)
    );
  }, [skills]);

  // Effects
  useEffect(() => {
    if (autoFetch) {
      refetch();
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      setOffset(0);
      fetchSkills(false);
    }
  }, [searchQuery, filters]);

  return {
    // Data
    skills,
    categories,
    skillsByCategory,
    
    // Loading states
    loading,
    categoriesLoading,
    skillsByCategoryLoading,
    
    // Error states
    error,
    categoriesError,
    skillsByCategoryError,
    
    // Search and filters
    searchQuery,
    filters,
    
    // Pagination
    hasMore,
    totalCount,
    
    // Actions
    setSearchQuery,
    setFilters,
    clearFilters,
    refetch,
    fetchMore,
    
    // Utility
    getSkillsByCategory,
    searchSkills
  };
};

// ==========================================
// FEATURED SKILLS HOOK
// ==========================================

export const useFeaturedSkills = () => {
  return useSkills({ 
    featuredOnly: true,
    autoFetch: true 
  });
};

// ==========================================
// SKILL CATEGORIES HOOK
// ==========================================

export const useSkillCategories = () => {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await SkillsService.getSkillCategories();

      if (result.error) {
        setError(result.error);
        return;
      }

      setCategories(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
};

// ==========================================
// SINGLE SKILL HOOK
// ==========================================

export const useSkill = (skillId?: string) => {
  const [skill, setSkill] = useState<SkillWithCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSkill = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await SkillsService.getSkillById(id);

      if (!result) {
        setError('Skill not found');
        return;
      }

      setSkill(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch skill';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (skillId) {
      fetchSkill(skillId);
    }
  }, [skillId, fetchSkill]);

  return {
    skill,
    loading,
    error,
    refetch: skillId ? () => fetchSkill(skillId) : undefined
  };
};

// ==========================================
// SKILLS STATS HOOK
// ==========================================

export const useSkillsStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await SkillsService.getSkillsStats();
      setStats(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats';
      setError(errorMessage);
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
// SKILLS SEARCH HOOK
// ==========================================

export const useSkillsSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SkillWithCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await SkillsService.searchSkills(searchQuery);
      setResults(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, search]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearSearch
  };
};

// ==========================================
// EXPERIENCE SKILLS HOOK
// ==========================================

export const useExperienceSkills = (experienceId?: string) => {
  const [skills, setSkills] = useState<SkillWithCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async (expId: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await SkillsService.getSkillsByExperienceId(expId);
      setSkills(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch experience skills';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (experienceId) {
      fetchSkills(experienceId);
    }
  }, [experienceId, fetchSkills]);

  return {
    skills,
    loading,
    error,
    refetch: experienceId ? () => fetchSkills(experienceId) : undefined
  };
};