// src/components/sections/Skills/components/SkillPreviewCard.tsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Calendar, 
  ExternalLink, 
  Code, 
  Globe, 
  Smartphone, 
  Database, 
  Cloud, 
  Layers, 
  Settings, 
  Users,
  Star,
  TrendingUp,
  Clock
} from 'lucide-react';
import type { SkillWithCategory } from '@/types/skills';
import { getProficiencyInfo, formatYearsOfExperience, getSkillDisplayInfo } from '@/utils/skills/skillsUtils';

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

interface SkillPreviewCardProps {
  skill: SkillWithCategory | null;
  isVisible?: boolean;
  className?: string;
}

const SkillPreviewCard: React.FC<SkillPreviewCardProps> = ({
  skill,
  isVisible = true,
  className = ''
}) => {
  if (!skill || !isVisible) {
    return (
      <motion.div
        className={`skill-preview-placeholder ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className="bg-background-secondary/50 dark:bg-background-secondary-dark/50 
                       backdrop-blur-lg rounded-2xl border border-border-primary/20 dark:border-border-primary-dark/20
                       p-8 text-center min-h-[200px] flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-background-tertiary/30 dark:bg-background-tertiary-dark/30 rounded-xl 
                         flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-text-tertiary dark:text-text-tertiary-dark" />
          </div>
          <h3 className="text-lg font-medium text-text-primary dark:text-text-primary-dark mb-2">
            Select a Featured Skill
          </h3>
          <p className="text-text-secondary dark:text-text-secondary-dark text-sm max-w-sm">
            Click on any skill above to see detailed information, experience, and related projects.
          </p>
        </div>
      </motion.div>
    );
  }

  const skillInfo = getSkillDisplayInfo(skill);
  const proficiencyInfo = getProficiencyInfo(skill.proficiency_level);
  const experienceText = formatYearsOfExperience(skill.years_of_experience);
  const IconComponent = CATEGORY_ICONS[skill.category_name as keyof typeof CATEGORY_ICONS] || Code;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={skill.id}
        className={`skill-preview-card ${className}`}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
        style={{
          '--category-color': skill.category_color,
          '--proficiency-color': proficiencyInfo.color,
        } as React.CSSProperties}
      >
        <div className="bg-background-secondary/80 dark:bg-background-secondary-dark/80 
                       backdrop-blur-lg rounded-2xl border border-border-primary/30 dark:border-border-primary-dark/30
                       shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
          
          {/* Header with gradient background */}
          <div 
            className="relative p-6 pb-4"
            style={{
              background: `linear-gradient(135deg, ${skill.category_color}15, ${skill.category_color}05)`
            }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" 
                   style={{
                     backgroundImage: `radial-gradient(circle at 20% 20%, ${skill.category_color} 1px, transparent 1px)`,
                     backgroundSize: '24px 24px'
                   }} 
              />
            </div>

            <div className="relative z-10 flex items-start gap-4">
              {/* Category Icon */}
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0
                          shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${skill.category_color}, ${skill.category_color}cc)`,
                }}
              >
                <IconComponent className="w-8 h-8 text-white" />
              </div>

              {/* Skill Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark leading-tight">
                    {skill.name}
                  </h2>
                  
                  {/* Featured Badge */}
                  {skill.is_featured && (
                    <motion.div
                      className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 
                                rounded-full text-white text-xs font-medium shadow-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </motion.div>
                  )}
                </div>

                {/* Category */}
                <div className="flex items-center gap-2 mt-1">
                  <span 
                    className="text-sm font-medium"
                    style={{ color: skill.category_color }}
                  >
                    {skill.category_name}
                  </span>
                  {skill.certification_name && (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <Award className="w-3 h-3" />
                      <span className="text-xs">Certified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 pt-4">
            {/* Proficiency & Experience Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Proficiency */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary dark:text-text-secondary-dark">
                    Proficiency Level
                  </span>
                  <span className="text-sm font-medium" style={{ color: proficiencyInfo.color }}>
                    {proficiencyInfo.label}
                  </span>
                </div>
                
                <div className="relative h-3 bg-background-tertiary/50 dark:bg-background-tertiary-dark/50 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full rounded-full shadow-sm"
                    style={{ 
                      background: `linear-gradient(90deg, ${proficiencyInfo.color}, ${proficiencyInfo.color}aa)`
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${skillInfo.proficiency.percentage}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  />
                  
                  {/* Level indicators */}
                  {[1, 2, 3, 4].map(level => (
                    <div
                      key={level}
                      className="absolute top-0 w-px h-full bg-white/30"
                      style={{ left: `${level * 20}%` }}
                    />
                  ))}
                </div>
                
                <div className="flex justify-between text-xs text-text-tertiary dark:text-text-tertiary-dark">
                  <span>{skill.proficiency_level}/5</span>
                  <span>{proficiencyInfo.description}</span>
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary dark:text-text-secondary-dark">
                    Experience
                  </span>
                  <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                    {skillInfo.experience.category}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-text-tertiary dark:text-text-tertiary-dark" />
                  <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                    {experienceText}
                  </span>
                </div>
                
                {/* Last Used */}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-text-tertiary dark:text-text-tertiary-dark" />
                  <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                    Last used: {skillInfo.lastUsedDaysAgo < 30 ? 'Recently' : 
                               skillInfo.lastUsedDaysAgo < 90 ? 'This quarter' : 
                               skillInfo.lastUsedDaysAgo < 365 ? 'This year' : 'Over a year ago'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            {skill.description && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2">
                  About this skill
                </h4>
                <p className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                  {skill.description}
                </p>
              </div>
            )}

            {/* Certification */}
            {skill.certification_name && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                  Certification
                </h4>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    {skill.certification_name}
                  </p>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-primary/20 dark:border-border-primary-dark/20">
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1 rounded-lg flex items-center justify-center"
                     style={{ backgroundColor: `${proficiencyInfo.color}20` }}>
                  <TrendingUp className="w-4 h-4" style={{ color: proficiencyInfo.color }} />
                </div>
                <div className="text-xs text-text-tertiary dark:text-text-tertiary-dark">Level</div>
                <div className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                  {skill.proficiency_level}/5
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-xs text-text-tertiary dark:text-text-tertiary-dark">Experience</div>
                <div className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                  {Math.round(skill.years_of_experience * 10) / 10}y
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Star className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-xs text-text-tertiary dark:text-text-tertiary-dark">Status</div>
                <div className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                  {skill.is_featured ? 'Featured' : 'Active'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SkillPreviewCard;