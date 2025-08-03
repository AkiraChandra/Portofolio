// src/utils/skills/iconUtils.ts - CONSOLIDATED ICON UTILITIES

import React from 'react';
import { 
  Award, 
  Code, 
  Globe, 
  Smartphone, 
  Database, 
  Cloud, 
  Layers, 
  Settings, 
  Users,
  type LucideIcon
} from 'lucide-react';

// Single source of truth untuk icon mapping
export const CATEGORY_ICONS = {
  'Programming Languages': Code,
  'Web Technologies': Globe,
  'Mobile Development': Smartphone,
  'Database & Storage': Database,
  'Cloud & DevOps': Cloud,
  'Frameworks & Libraries': Layers,
  'Tools & Software': Settings,
  'Soft Skills': Users,
  'Certifications': Award,
} as const;

// Type untuk icon names
export type CategoryIconName = keyof typeof CATEGORY_ICONS;

// Mapping keywords ke category icon names
const KEYWORD_MAPPINGS: Record<string, CategoryIconName> = {
  // Programming Languages
  'programming': 'Programming Languages',
  'language': 'Programming Languages',
  'code': 'Programming Languages',
  'script': 'Programming Languages',
  
  // Web Technologies
  'web': 'Web Technologies',
  'frontend': 'Web Technologies',
  'backend': 'Web Technologies',
  'fullstack': 'Web Technologies',
  'html': 'Web Technologies',
  'css': 'Web Technologies',
  'javascript': 'Web Technologies',
  'react': 'Web Technologies',
  'vue': 'Web Technologies',
  'angular': 'Web Technologies',
  
  // Mobile Development
  'mobile': 'Mobile Development',
  'app': 'Mobile Development',
  'android': 'Mobile Development',
  'ios': 'Mobile Development',
  'flutter': 'Mobile Development',
  'react native': 'Mobile Development',
  
  // Database & Storage
  'database': 'Database & Storage',
  'storage': 'Database & Storage',
  'sql': 'Database & Storage',
  'nosql': 'Database & Storage',
  'mongodb': 'Database & Storage',
  'postgresql': 'Database & Storage',
  'mysql': 'Database & Storage',
  
  // Cloud & DevOps
  'cloud': 'Cloud & DevOps',
  'devops': 'Cloud & DevOps',
  'aws': 'Cloud & DevOps',
  'azure': 'Cloud & DevOps',
  'gcp': 'Cloud & DevOps',
  'docker': 'Cloud & DevOps',
  'kubernetes': 'Cloud & DevOps',
  'ci/cd': 'Cloud & DevOps',
  
  // Frameworks & Libraries
  'framework': 'Frameworks & Libraries',
  'library': 'Frameworks & Libraries',
  'package': 'Frameworks & Libraries',
  'sdk': 'Frameworks & Libraries',
  'api': 'Frameworks & Libraries',
  
  // Tools & Software
  'tool': 'Tools & Software',
  'software': 'Tools & Software',
  'editor': 'Tools & Software',
  'ide': 'Tools & Software',
  'git': 'Tools & Software',
  'testing': 'Tools & Software',
  
  // Soft Skills
  'soft': 'Soft Skills',
  'management': 'Soft Skills',
  'leadership': 'Soft Skills',
  'communication': 'Soft Skills',
  'teamwork': 'Soft Skills',
  
  // Certifications
  'certification': 'Certifications',
  'certificate': 'Certifications',
  'course': 'Certifications',
  'training': 'Certifications',
};

/**
 * Get category icon name berdasarkan category name atau description
 * Menggunakan keyword matching untuk flexibility
 */
export const getCategoryIconName = (categoryName: string): CategoryIconName => {
  const lowerName = categoryName.toLowerCase();
  
  // Exact match first
  if (CATEGORY_ICONS[categoryName as CategoryIconName]) {
    return categoryName as CategoryIconName;
  }
  
  // Keyword matching
  for (const [keyword, iconName] of Object.entries(KEYWORD_MAPPINGS)) {
    if (lowerName.includes(keyword)) {
      return iconName;
    }
  }
  
  // Default fallback
  return 'Programming Languages';
};

/**
 * Get icon component dari category name
 */
export const getCategoryIcon = (categoryName: string): LucideIcon => {
  const iconName = getCategoryIconName(categoryName);
  return CATEGORY_ICONS[iconName];
};

/**
 * Render icon component dengan className
 */
export const renderCategoryIcon = (
  categoryName: string, 
  className: string = "w-4 h-4"
): React.ReactNode => {
  const IconComponent = getCategoryIcon(categoryName);
  return React.createElement(IconComponent, { className });
};

/**
 * Get icon dari database icon field (fallback ke category name)
 */
export const getIconFromField = (
  iconField?: string, 
  categoryName?: string
): LucideIcon => {
  // Jika ada icon field dan valid, gunakan itu
  if (iconField && CATEGORY_ICONS[iconField as CategoryIconName]) {
    return CATEGORY_ICONS[iconField as CategoryIconName];
  }
  
  // Fallback ke category name
  if (categoryName) {
    return getCategoryIcon(categoryName);
  }
  
  // Default fallback
  return Code;
};

/**
 * Get icon colors berdasarkan category
 */
export const getCategoryIconColors = (categoryName: string) => {
  const iconName = getCategoryIconName(categoryName);
  
  const colorMap: Record<CategoryIconName, { 
    bg: string; 
    text: string; 
    border: string;
    gradient: string;
  }> = {
    'Programming Languages': {
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      gradient: 'from-blue-400 to-blue-600'
    },
    'Web Technologies': {
      bg: 'bg-green-100 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
      gradient: 'from-green-400 to-green-600'
    },
    'Mobile Development': {
      bg: 'bg-purple-100 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800',
      gradient: 'from-purple-400 to-purple-600'
    },
    'Database & Storage': {
      bg: 'bg-orange-100 dark:bg-orange-900/20',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-800',
      gradient: 'from-orange-400 to-orange-600'
    },
    'Cloud & DevOps': {
      bg: 'bg-cyan-100 dark:bg-cyan-900/20',
      text: 'text-cyan-600 dark:text-cyan-400',
      border: 'border-cyan-200 dark:border-cyan-800',
      gradient: 'from-cyan-400 to-cyan-600'
    },
    'Frameworks & Libraries': {
      bg: 'bg-indigo-100 dark:bg-indigo-900/20',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-200 dark:border-indigo-800',
      gradient: 'from-indigo-400 to-indigo-600'
    },
    'Tools & Software': {
      bg: 'bg-gray-100 dark:bg-gray-900/20',
      text: 'text-gray-600 dark:text-gray-400',
      border: 'border-gray-200 dark:border-gray-800',
      gradient: 'from-gray-400 to-gray-600'
    },
    'Soft Skills': {
      bg: 'bg-pink-100 dark:bg-pink-900/20',
      text: 'text-pink-600 dark:text-pink-400',
      border: 'border-pink-200 dark:border-pink-800',
      gradient: 'from-pink-400 to-pink-600'
    },
    'Certifications': {
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
      text: 'text-yellow-600 dark:text-yellow-400',
      border: 'border-yellow-200 dark:border-yellow-800',
      gradient: 'from-yellow-400 to-yellow-600'
    },
  };
  
  return colorMap[iconName];
};

/**
 * Get all available icon names untuk dropdown/selection
 */
export const getAllIconNames = (): CategoryIconName[] => {
  return Object.keys(CATEGORY_ICONS) as CategoryIconName[];
};

/**
 * Validate icon name
 */
export const isValidIconName = (iconName: string): iconName is CategoryIconName => {
  return iconName in CATEGORY_ICONS;
};