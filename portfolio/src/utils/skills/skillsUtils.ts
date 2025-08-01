// src/utils/skills/skillsUtils.ts

import type { SkillWithCategory, SkillCategory, SkillsByCategory, ProficiencyLevel } from '@/types/skills';
import { PROFICIENCY_LEVELS, EXPERIENCE_LEVELS } from '@/types/skills';

// ==========================================
// SKILL FORMATTING UTILITIES
// ==========================================

export const formatYearsOfExperience = (years: number): string => {
  if (years === 0) return 'New';
  if (years < 1) {
    const months = Math.round(years * 12);
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  if (years === 1) return '1 year';
  
  // Format to 1 decimal place if needed
  const formatted = Math.round(years * 10) / 10;
  return `${formatted} year${formatted !== 1 ? 's' : ''}`;
};

export const getProficiencyInfo = (level: number) => {
  return PROFICIENCY_LEVELS[level as ProficiencyLevel] || PROFICIENCY_LEVELS[3];
};

export const getExperienceCategory = (years: number): string => {
  if (years < 0.5) return 'New';
  if (years < 1) return 'Fresh';
  if (years < 2) return 'Junior';
  if (years < 3) return 'Mid-level';
  return 'Senior';
};

export const getProficiencyPercentage = (level: number): number => {
  return (level / 5) * 100;
};

// ==========================================
// SKILL SORTING UTILITIES
// ==========================================

export const sortSkillsByProficiency = (skills: SkillWithCategory[]): SkillWithCategory[] => {
  return [...skills].sort((a, b) => {
    if (b.proficiency_level !== a.proficiency_level) {
      return b.proficiency_level - a.proficiency_level;
    }
    return b.years_of_experience - a.years_of_experience;
  });
};

export const sortSkillsByExperience = (skills: SkillWithCategory[]): SkillWithCategory[] => {
  return [...skills].sort((a, b) => {
    if (b.years_of_experience !== a.years_of_experience) {
      return b.years_of_experience - a.years_of_experience;
    }
    return b.proficiency_level - a.proficiency_level;
  });
};

export const sortSkillsByName = (skills: SkillWithCategory[]): SkillWithCategory[] => {
  return [...skills].sort((a, b) => a.name.localeCompare(b.name));
};

export const sortSkillsByLastUsed = (skills: SkillWithCategory[]): SkillWithCategory[] => {
  return [...skills].sort((a, b) => {
    const dateA = new Date(a.last_used_date).getTime();
    const dateB = new Date(b.last_used_date).getTime();
    return dateB - dateA;
  });
};

export const sortSkillsByCategory = (skills: SkillWithCategory[]): SkillWithCategory[] => {
  return [...skills].sort((a, b) => {
    if (a.category_order !== b.category_order) {
      return a.category_order - b.category_order;
    }
    return a.display_order - b.display_order;
  });
};

// ==========================================
// SKILL FILTERING UTILITIES
// ==========================================

export const filterSkillsByProficiency = (
  skills: SkillWithCategory[], 
  minLevel: number, 
  maxLevel?: number
): SkillWithCategory[] => {
  return skills.filter(skill => {
    if (maxLevel) {
      return skill.proficiency_level >= minLevel && skill.proficiency_level <= maxLevel;
    }
    return skill.proficiency_level >= minLevel;
  });
};

export const filterSkillsByExperience = (
  skills: SkillWithCategory[], 
  minYears: number, 
  maxYears?: number
): SkillWithCategory[] => {
  return skills.filter(skill => {
    if (maxYears) {
      return skill.years_of_experience >= minYears && skill.years_of_experience <= maxYears;
    }
    return skill.years_of_experience >= minYears;
  });
};

export const filterSkillsByCategory = (
  skills: SkillWithCategory[], 
  categoryId: string
): SkillWithCategory[] => {
  return skills.filter(skill => skill.category_id === categoryId);
};

export const filterFeaturedSkills = (skills: SkillWithCategory[]): SkillWithCategory[] => {
  return skills.filter(skill => skill.is_featured);
};

export const filterSkillsWithCertifications = (skills: SkillWithCategory[]): SkillWithCategory[] => {
  return skills.filter(skill => skill.certification_name && skill.certification_name.trim() !== '');
};

export const filterRecentlyUsedSkills = (
  skills: SkillWithCategory[], 
  monthsBack: number = 12
): SkillWithCategory[] => {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - monthsBack);
  
  return skills.filter(skill => {
    const lastUsed = new Date(skill.last_used_date);
    return lastUsed >= cutoffDate;
  });
};

// ==========================================
// SKILL GROUPING UTILITIES
// ==========================================

export const groupSkillsByCategory = (skills: SkillWithCategory[]): Record<string, SkillWithCategory[]> => {
  return skills.reduce((groups, skill) => {
    const category = skill.category_name;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(skill);
    return groups;
  }, {} as Record<string, SkillWithCategory[]>);
};

export const groupSkillsByProficiency = (skills: SkillWithCategory[]): Record<string, SkillWithCategory[]> => {
  return skills.reduce((groups, skill) => {
    const proficiency = getProficiencyInfo(skill.proficiency_level).label;
    if (!groups[proficiency]) {
      groups[proficiency] = [];
    }
    groups[proficiency].push(skill);
    return groups;
  }, {} as Record<string, SkillWithCategory[]>);
};

export const groupSkillsByExperience = (skills: SkillWithCategory[]): Record<string, SkillWithCategory[]> => {
  return skills.reduce((groups, skill) => {
    const experience = getExperienceCategory(skill.years_of_experience);
    if (!groups[experience]) {
      groups[experience] = [];
    }
    groups[experience].push(skill);
    return groups;
  }, {} as Record<string, SkillWithCategory[]>);
};

// ==========================================
// SKILL SEARCH UTILITIES
// ==========================================

export const searchSkills = (
  skills: SkillWithCategory[], 
  query: string
): SkillWithCategory[] => {
  if (!query.trim()) return skills;
  
  const lowerQuery = query.toLowerCase();
  
  return skills.filter(skill => 
    skill.name.toLowerCase().includes(lowerQuery) ||
    skill.description?.toLowerCase().includes(lowerQuery) ||
    skill.category_name.toLowerCase().includes(lowerQuery) ||
    skill.certification_name?.toLowerCase().includes(lowerQuery)
  );
};

export const getSkillSearchScore = (skill: SkillWithCategory, query: string): number => {
  if (!query.trim()) return 0;
  
  const lowerQuery = query.toLowerCase();
  const lowerName = skill.name.toLowerCase();
  const lowerDescription = skill.description?.toLowerCase() || '';
  const lowerCategory = skill.category_name.toLowerCase();
  
  let score = 0;
  
  // Exact name match gets highest score
  if (lowerName === lowerQuery) score += 100;
  
  // Name starts with query
  else if (lowerName.startsWith(lowerQuery)) score += 80;
  
  // Name contains query
  else if (lowerName.includes(lowerQuery)) score += 60;
  
  // Description contains query
  if (lowerDescription.includes(lowerQuery)) score += 30;
  
  // Category contains query
  if (lowerCategory.includes(lowerQuery)) score += 20;
  
  // Boost score based on proficiency and featured status
  score += skill.proficiency_level * 5;
  if (skill.is_featured) score += 10;
  
  return score;
};

export const rankSearchResults = (
  skills: SkillWithCategory[], 
  query: string
): SkillWithCategory[] => {
  return skills
    .map(skill => ({
      skill,
      score: getSkillSearchScore(skill, query)
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.skill);
};

// ==========================================
// SKILL STATISTICS UTILITIES
// ==========================================

export const calculateSkillsStats = (skills: SkillWithCategory[]) => {
  const totalSkills = skills.length;
  
  if (totalSkills === 0) {
    return {
      totalSkills: 0,
      averageProficiency: 0,
      averageExperience: 0,
      featuredCount: 0,
      withCertifications: 0,
      proficiencyDistribution: {},
      categoryDistribution: {},
      experienceDistribution: {}
    };
  }
  
  const averageProficiency = skills.reduce((sum, skill) => sum + skill.proficiency_level, 0) / totalSkills;
  const averageExperience = skills.reduce((sum, skill) => sum + skill.years_of_experience, 0) / totalSkills;
  const featuredCount = skills.filter(skill => skill.is_featured).length;
  const withCertifications = skills.filter(skill => skill.certification_name).length;
  
  // Proficiency distribution
  const proficiencyDistribution = skills.reduce((dist, skill) => {
    const level = getProficiencyInfo(skill.proficiency_level).label;
    dist[level] = (dist[level] || 0) + 1;
    return dist;
  }, {} as Record<string, number>);
  
  // Category distribution
  const categoryDistribution = skills.reduce((dist, skill) => {
    dist[skill.category_name] = (dist[skill.category_name] || 0) + 1;
    return dist;
  }, {} as Record<string, number>);
  
  // Experience distribution
  const experienceDistribution = skills.reduce((dist, skill) => {
    const category = getExperienceCategory(skill.years_of_experience);
    dist[category] = (dist[category] || 0) + 1;
    return dist;
  }, {} as Record<string, number>);
  
  return {
    totalSkills,
    averageProficiency: Math.round(averageProficiency * 10) / 10,
    averageExperience: Math.round(averageExperience * 10) / 10,
    featuredCount,
    withCertifications,
    proficiencyDistribution,
    categoryDistribution,
    experienceDistribution
  };
};

// ==========================================
// SKILL VALIDATION UTILITIES
// ==========================================

export const validateSkillData = (skill: Partial<SkillWithCategory>): string[] => {
  const errors: string[] = [];
  
  if (!skill.name || skill.name.trim().length === 0) {
    errors.push('Skill name is required');
  }
  
  if (!skill.category_id) {
    errors.push('Category is required');
  }
  
  if (skill.proficiency_level && (skill.proficiency_level < 1 || skill.proficiency_level > 5)) {
    errors.push('Proficiency level must be between 1 and 5');
  }
  
  if (skill.years_of_experience && skill.years_of_experience < 0) {
    errors.push('Years of experience cannot be negative');
  }
  
  return errors;
};

// ==========================================
// SKILL DISPLAY UTILITIES
// ==========================================

export const getSkillDisplayInfo = (skill: SkillWithCategory) => {
  const proficiencyInfo = getProficiencyInfo(skill.proficiency_level);
  const experienceText = formatYearsOfExperience(skill.years_of_experience);
  const experienceCategory = getExperienceCategory(skill.years_of_experience);
  
  return {
    proficiency: {
      level: skill.proficiency_level,
      label: proficiencyInfo.label,
      color: proficiencyInfo.color,
      description: proficiencyInfo.description,
      percentage: getProficiencyPercentage(skill.proficiency_level)
    },
    experience: {
      years: skill.years_of_experience,
      text: experienceText,
      category: experienceCategory
    },
    category: {
      name: skill.category_name,
      color: skill.category_color,
      icon: skill.category_icon
    },
    hasCertification: !!(skill.certification_name && skill.certification_name.trim()),
    isFeatured: skill.is_featured,
    lastUsedDaysAgo: Math.floor((Date.now() - new Date(skill.last_used_date).getTime()) / (1000 * 60 * 60 * 24))
  };
};

export const getTopSkillsInCategory = (
  skills: SkillWithCategory[], 
  categoryId: string, 
  limit: number = 5
): SkillWithCategory[] => {
  return skills
    .filter(skill => skill.category_id === categoryId)
    .sort((a, b) => {
      if (b.proficiency_level !== a.proficiency_level) {
        return b.proficiency_level - a.proficiency_level;
      }
      return b.years_of_experience - a.years_of_experience;
    })
    .slice(0, limit);
};

export const getMostRecentSkills = (
  skills: SkillWithCategory[], 
  limit: number = 10
): SkillWithCategory[] => {
  return skills
    .sort((a, b) => new Date(b.last_used_date).getTime() - new Date(a.last_used_date).getTime())
    .slice(0, limit);
};

export const getSkillProgressSuggestions = (skill: SkillWithCategory): string[] => {
  const suggestions: string[] = [];
  
  if (skill.proficiency_level < 3) {
    suggestions.push('Consider taking more courses or doing practice projects');
  }
  
  if (skill.years_of_experience < 1) {
    suggestions.push('Look for opportunities to use this skill in real projects');
  }
  
  if (!skill.certification_name && skill.proficiency_level >= 3) {
    suggestions.push('Consider getting certified to validate your expertise');
  }
  
  const daysSinceLastUsed = Math.floor((Date.now() - new Date(skill.last_used_date).getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceLastUsed > 365) {
    suggestions.push('This skill might need refreshing - consider a refresher course');
  }
  
  return suggestions;
};