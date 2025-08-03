// src/components/sections/Skills/components/SkillPreviewCard.tsx - Compact Version

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
        className={`${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/30
                       p-6 text-center">
          <div className="w-12 h-12 bg-gray-700/30 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-gray-500" />
          </div>
          <h3 className="text-base font-medium text-white mb-2">
            Select a Skill
          </h3>
          <p className="text-gray-400 text-sm">
            Click on any skill to see detailed information
          </p>
        </div>
      </motion.div>
    );
  }

  const skillInfo = getSkillDisplayInfo(skill);
  const proficiencyInfo = getProficiencyInfo(skill.proficiency_level);
  const experienceText = formatYearsOfExperience(skill.years_of_experience);
  const IconComponent = CATEGORY_ICONS[getCategoryIconName(skill.category_name) as keyof typeof CATEGORY_ICONS] || Code;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={skill.id}
        className={`${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50
                       shadow-lg overflow-hidden">
          
          {/* Compact Header */}
          <div 
            className="p-4 border-b border-gray-700/30"
            style={{
              background: `linear-gradient(135deg, ${skill.category_color}10, transparent)`
            }}
          >
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${skill.category_color}20` }}
              >
                <IconComponent 
                  className="w-5 h-5" 
                  style={{ color: skill.category_color }}
                />
              </div>

              {/* Basic Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white truncate">
                    {skill.name}
                  </h2>
                  {skill.is_featured && (
                    <div className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-2.5 h-2.5" />
                      Featured
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span style={{ color: skill.category_color }}>
                    {skill.category_name}
                  </span>
                  {skill.certification_name && (
                    <div className="flex items-center gap-1 text-green-400">
                      <Award className="w-3 h-3" />
                      <span className="text-xs">Certified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Compact Content */}
          <div className="p-4 space-y-4">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold" style={{ color: proficiencyInfo.color }}>
                  {skill.proficiency_level}/5
                </div>
                <div className="text-xs text-gray-400">Proficiency</div>
                <div className="text-xs text-gray-500">{proficiencyInfo.label}</div>
              </div>
              
              <div>
                <div className="text-lg font-bold text-white">
                  {Math.round(skill.years_of_experience * 10) / 10}y
                </div>
                <div className="text-xs text-gray-400">Experience</div>
                <div className="text-xs text-gray-500">{experienceText}</div>
              </div>
              
              <div>
                <div className="text-lg font-bold text-white">
                  {skill.is_featured ? 'Featured' : 'Active'}
                </div>
                <div className="text-xs text-gray-400">Status</div>
                <div className="text-xs text-gray-500">
                  {skillInfo.lastUsedDaysAgo < 30 ? 'Recent' : 'Stable'}
                </div>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Proficiency</span>
                  <span className="text-xs" style={{ color: proficiencyInfo.color }}>
                    {skillInfo.proficiency.percentage}%
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: proficiencyInfo.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${skillInfo.proficiency.percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
            </div>

            {/* Description - Compact */}
            {skill.description && (
              <div>
                <p className="text-sm text-gray-300 line-clamp-3">
                  {skill.description}
                </p>
              </div>
            )}

            {/* Certification - Compact */}
            {skill.certification_name && (
              <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-300">
                    {skill.certification_name}
                  </span>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-700/30">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>Since {new Date().getFullYear() - Math.floor(skill.years_of_experience)}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-400">Active</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SkillPreviewCard;