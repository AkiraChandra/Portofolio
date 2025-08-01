// src/types/skills.ts

export interface SkillCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category_id: string;
  proficiency_level: number; // 1-5 scale
  years_of_experience: number;
  is_featured: boolean;
  description?: string;
  certification_name?: string;
  last_used_date: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface SkillWithCategory extends Skill {
  category_name: string;
  category_description?: string;
  category_color: string;
  category_icon: string;
  category_order: number;
}

export interface SkillsByCategory {
  category_id: string;
  category_name: string;
  category_description?: string;
  category_color: string;
  category_icon: string;
  category_order: number;
  skill_count: number;
  skills: Skill[];
}

export interface ExperienceSkill {
  id: string;
  experience_id: string;
  skill_id: string;
  created_at: string;
}

// Filter and search types
export interface SkillFilters {
  category_id?: string;
  proficiency_level?: number;
  is_featured?: boolean;
  years_experience_min?: number;
  years_experience_max?: number;
  has_certification?: boolean;
}

export interface SkillSearchParams {
  query?: string;
  filters?: SkillFilters;
  sort_by?: 'name' | 'proficiency_level' | 'years_of_experience' | 'last_used_date';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// API Response types
export interface SkillsResponse {
  data: SkillWithCategory[];
  count: number;
  error?: string;
}

export interface SkillCategoriesResponse {
  data: SkillCategory[];
  count: number;
  error?: string;
}

export interface SkillsByCategoryResponse {
  data: SkillsByCategory[];
  count: number;
  error?: string;
}

// Component prop types
export interface SkillCardProps {
  skill: SkillWithCategory;
  showCategory?: boolean;
  showProficiency?: boolean;
  showExperience?: boolean;
  showDescription?: boolean;
  compact?: boolean;
  onClick?: (skill: SkillWithCategory) => void;
}

export interface SkillCategoryTabProps {
  category: SkillCategory;
  isActive: boolean;
  skillCount: number;
  onClick: (categoryId: string) => void;
}

export interface SkillsFilterProps {
  categories: SkillCategory[];
  currentFilters: SkillFilters;
  onFiltersChange: (filters: SkillFilters) => void;
  onClearFilters: () => void;
}

export interface SkillsStatsProps {
  totalSkills: number;
  featuredSkills: number;
  categoriesCount: number;
  avgProficiency: number;
  avgExperience: number;
}

// Proficiency level mapping
export const PROFICIENCY_LEVELS = {
  1: { label: 'Beginner', color: '#ef4444', description: 'Basic understanding' },
  2: { label: 'Novice', color: '#f97316', description: 'Limited experience' },
  3: { label: 'Intermediate', color: '#eab308', description: 'Some experience' },
  4: { label: 'Advanced', color: '#22c55e', description: 'Highly experienced' },
  5: { label: 'Expert', color: '#3b82f6', description: 'Extremely experienced' }
} as const;

export type ProficiencyLevel = keyof typeof PROFICIENCY_LEVELS;

// Experience level categorization
export const EXPERIENCE_LEVELS = {
  '0-0.5': 'New',
  '0.5-1': 'Fresh',
  '1-2': 'Junior',
  '2-3': 'Mid-level',
  '3+': 'Senior'
} as const;

// Default skill icons mapping
export const SKILL_ICONS = {
  'Programming Languages': 'Code',
  'Web Technologies': 'Globe',
  'Mobile Development': 'Smartphone',
  'Database & Storage': 'Database',
  'Cloud & DevOps': 'Cloud',
  'Frameworks & Libraries': 'Layers',
  'Tools & Software': 'Settings',
  'Soft Skills': 'Users',
  'Certifications': 'Award'
} as const;