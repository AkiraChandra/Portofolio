// src/components/sections/Skills/components/SkillCard.tsx - Improved Version

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Calendar, 
  Code, 
  Globe, 
  Smartphone, 
  Database, 
  Cloud, 
  Layers, 
  Settings, 
  Users,
  Star,
  Clock,
  CheckCircle,
  TrendingUp,
  Zap
} from 'lucide-react';
import type { SkillWithCategory } from '@/types/skills';
import { getProficiencyInfo, formatYearsOfExperience } from '@/utils/skills/skillsUtils';

// Icon mapping untuk categories
const CATEGORY_ICONS = {
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

// Function to map category names to icon names
const getCategoryIconName = (categoryName: string): string => {
  const lowerName = categoryName.toLowerCase();
  if (lowerName.includes('programming') || lowerName.includes('language')) return 'Programming Languages';
  if (lowerName.includes('web') || lowerName.includes('frontend') || lowerName.includes('backend')) return 'Web Technologies';
  if (lowerName.includes('mobile') || lowerName.includes('app')) return 'Mobile Development';
  if (lowerName.includes('database') || lowerName.includes('storage')) return 'Database & Storage';
  if (lowerName.includes('cloud') || lowerName.includes('devops')) return 'Cloud & DevOps';
  if (lowerName.includes('framework') || lowerName.includes('library')) return 'Frameworks & Libraries';
  if (lowerName.includes('tool') || lowerName.includes('software')) return 'Tools & Software';
  if (lowerName.includes('soft') || lowerName.includes('management')) return 'Soft Skills';
  if (lowerName.includes('certification') || lowerName.includes('certificate')) return 'Certifications';
  return 'Programming Languages';
};

interface SkillCardProps {
  skill: SkillWithCategory;
  compact?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  className?: string;
  onClick?: () => void;
}

const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  compact = false,
  isActive = false,
  isFeatured = false,
  className = '',
  onClick
}) => {
  const proficiencyInfo = getProficiencyInfo(skill.proficiency_level);
  const experienceText = formatYearsOfExperience(skill.years_of_experience);
  
  const CategoryIcon = CATEGORY_ICONS[getCategoryIconName(skill.category_name) as keyof typeof CATEGORY_ICONS] || Code;
  
  return (
    <motion.div
      className={`group cursor-pointer ${className}`}
      onClick={onClick}
      whileHover={{ scale: compact ? 1.02 : 1.01, y: compact ? -2 : 0, x: compact ? 0 : 2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`
          relative overflow-hidden rounded-xl h-full
          bg-background-secondary/50 dark:bg-background-secondary-dark/50 
          backdrop-blur-sm
          border border-border-primary/20 dark:border-border-primary-dark/20
          hover:bg-background-secondary/70 dark:hover:bg-background-secondary-dark/70
          hover:border-primary/30 dark:hover:border-primary-dark/30
          transition-all duration-300
          hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary-dark/5
          ${isActive ? 'ring-1 ring-primary/30 dark:ring-primary-dark/30 shadow-md shadow-primary/10 dark:shadow-primary-dark/10' : ''}
          ${isFeatured ? 'border-primary/25 dark:border-primary-dark/25' : ''}
        `}
      >
        {/* Background Gradient Effect */}
        <div 
          className="absolute inset-0 opacity-[0.01] dark:opacity-[0.02]"
          style={{
            background: `linear-gradient(135deg, ${skill.category_color}20, transparent 70%)`
          }}
        />

        {/* Compact Mode for Grid View */}
        {compact ? (
          <div className="p-5 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center backdrop-blur-sm"
                  style={{ 
                    backgroundColor: `${skill.category_color}12`,
                    border: `1px solid ${skill.category_color}20`
                  }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <CategoryIcon 
                    className="w-4 h-4" 
                    style={{ color: skill.category_color }}
                  />
                </motion.div>
                {skill.certification_name && (
                  <motion.div 
                    className="w-5 h-5 bg-green-500/90 rounded-full flex items-center justify-center shadow-sm"
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <CheckCircle className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                <span className="text-xs font-semibold text-text-secondary dark:text-text-secondary-dark">
                  {skill.proficiency_level}/5
                </span>
              </div>
            </div>

            {/* Skill Name */}
            <h3 className="text-sm font-semibold text-text-primary dark:text-text-primary-dark mb-3 line-clamp-2 flex-1 group-hover:text-primary dark:group-hover:text-primary-dark transition-colors duration-300">
              {skill.name}
            </h3>

            {/* Progress Bar with Enhanced Design */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-text-tertiary dark:text-text-tertiary-dark">
                  {proficiencyInfo.label}
                </span>
                <span className="text-xs font-semibold" style={{ color: proficiencyInfo.color }}>
                  {experienceText}
                </span>
              </div>
              
              <div className="relative">
                {/* Background track */}
                <div className="h-2 bg-background-tertiary/30 dark:bg-background-tertiary-dark/30 rounded-full overflow-hidden">
                  {/* Progress fill */}
                  <motion.div
                    className="h-full rounded-full relative overflow-hidden"
                    style={{ 
                      background: `linear-gradient(90deg, ${proficiencyInfo.color}, ${proficiencyInfo.color}dd)`
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(skill.proficiency_level / 5) * 100}%` }}
                    transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: [-40, 120] }}
                      transition={{ 
                        duration: 1.5, 
                        delay: 0.8, 
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    />
                  </motion.div>
                </div>
                
                {/* Skill level indicators */}
                <div className="absolute -top-1 -bottom-1 left-0 right-0 flex justify-between items-center">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-1 h-4 rounded-full transition-all duration-500 ${
                        i < skill.proficiency_level 
                          ? 'opacity-80' 
                          : 'bg-background-tertiary/30 dark:bg-background-tertiary-dark/30 opacity-40'
                      }`}
                      style={i < skill.proficiency_level ? { backgroundColor: proficiencyInfo.color } : {}}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.3 + (i * 0.1), duration: 0.3 }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Experience with Icon */}
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-3.5 h-3.5 text-text-tertiary dark:text-text-tertiary-dark" />
              <span className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark">
                {experienceText}
              </span>
              {skill.years_of_experience >= 3 && (
                <TrendingUp className="w-3 h-3 text-green-500" />
              )}
            </div>

            {/* Description */}
            {skill.description && (
              <p className="text-xs text-text-tertiary dark:text-text-tertiary-dark line-clamp-2 mb-4 flex-1">
                {skill.description}
              </p>
            )}

            {/* Category Badge */}
            <div className="mt-auto">
              <motion.div 
                className="text-center px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm transition-all duration-300"
                style={{
                  backgroundColor: `${skill.category_color}08`,
                  color: skill.category_color,
                  border: `1px solid ${skill.category_color}15`
                }}
                whileHover={{ 
                  backgroundColor: `${skill.category_color}12`,
                  scale: 1.02
                }}
              >
                {skill.category_name.split(' ')[0]}
              </motion.div>
            </div>
          </div>
        ) : (
          /* List Mode - Enhanced Horizontal Layout */
          <div className="p-4 flex items-center gap-4 h-full">
            {/* Icon with Enhanced Design */}
            <motion.div 
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm"
              style={{ 
                backgroundColor: `${skill.category_color}12`,
                border: `1px solid ${skill.category_color}20`
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <CategoryIcon 
                className="w-5 h-5" 
                style={{ color: skill.category_color }}
              />
            </motion.div>

            {/* Main Info */}
            <div className="flex-1 min-w-0 group-hover:translate-x-1 transition-transform duration-200">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-text-primary dark:text-text-primary-dark truncate group-hover:text-primary dark:group-hover:text-primary-dark transition-colors duration-300">
                  {skill.name}
                </h3>
                {skill.certification_name && (
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  </motion.div>
                )}
                {skill.is_featured && (
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-current flex-shrink-0" />
                  </motion.div>
                )}
                {skill.years_of_experience >= 3 && (
                  <Zap className="w-3 h-3 text-orange-500 flex-shrink-0" />
                )}
              </div>
              
              <div className="flex items-center gap-3 text-xs text-text-secondary dark:text-text-secondary-dark">
                <span className="truncate font-medium">{skill.category_name}</span>
                <span className="text-text-tertiary dark:text-text-tertiary-dark">•</span>
                <span className="font-medium">{experienceText}</span>
              </div>
            </div>

            {/* Progress & Level - Enhanced Compact */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-right">
                <div className="text-xs font-semibold" style={{ color: proficiencyInfo.color }}>
                  {skill.proficiency_level}/5
                </div>
                <div className="text-xs text-text-tertiary dark:text-text-tertiary-dark font-medium">
                  {proficiencyInfo.label}
                </div>
              </div>
              
              {/* Vertical Progress Bars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-1 h-8 rounded-full transition-all duration-300 ${
                      i < skill.proficiency_level 
                        ? 'opacity-100' 
                        : 'bg-background-tertiary/30 dark:bg-background-tertiary-dark/30 opacity-40'
                    }`}
                    style={i < skill.proficiency_level ? { backgroundColor: proficiencyInfo.color } : {}}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.1 + (i * 0.05), duration: 0.3 }}
                    whileHover={{ scaleY: 1.1 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Hover Effects for Compact Mode */}
        {compact && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent 
                     rounded-xl flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100
                     transition-opacity duration-300 backdrop-blur-sm"
            initial={false}
          >
            <div className="text-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{proficiencyInfo.label}</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs font-medium">{experienceText}</span>
                </div>
              </div>
              {skill.description && (
                <p className="line-clamp-2 text-gray-200 text-xs leading-relaxed">
                  {skill.description}
                </p>
              )}
              {skill.certification_name && (
                <div className="flex items-center gap-1 text-green-300">
                  <Award className="w-3 h-3" />
                  <span className="text-xs font-medium">Certified</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Featured Indicator */}
        {skill.is_featured && compact && (
          <motion.div 
            className="absolute top-3 right-3"
            whileHover={{ scale: 1.2, rotate: 180 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
              <Star className="w-3.5 h-3.5 text-white fill-current" />
            </div>
          </motion.div>
        )}

        {/* Certification Indicator */}
        {skill.certification_name && compact && (
          <motion.div 
            className="absolute top-3 left-3"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-md">
              <Award className="w-2.5 h-2.5 text-white" />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SkillCard;