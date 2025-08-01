// src/components/sections/Skills/components/SkillCard.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Globe, 
  Smartphone, 
  Database, 
  Cloud, 
  Layers, 
  Settings, 
  Users, 
  Award,
  Star,
  Calendar
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

interface SkillCardProps {
  skill: SkillWithCategory;
  isActive?: boolean;
  isFeatured?: boolean;
  compact?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  isActive = false,
  isFeatured = false,
  compact = false,
  onClick,
  style,
  className = ''
}) => {
  const proficiencyInfo = getProficiencyInfo(skill.proficiency_level);
  const experienceText = formatYearsOfExperience(skill.years_of_experience);
  const IconComponent = CATEGORY_ICONS[skill.category_name as keyof typeof CATEGORY_ICONS] || Code;
  
  // Calculate floating animation delay based on skill name for staggered effect
  const animationDelay = (skill.name.length % 4) * 0.5;
  
  // Proficiency percentage for progress bar
  const proficiencyPercentage = (skill.proficiency_level / 5) * 100;

  return (
    <motion.div
      className={`skill-card relative group cursor-pointer select-none ${className}`}
      style={{
        ...style,
        '--category-color': skill.category_color,
        '--proficiency-color': proficiencyInfo.color,
      } as React.CSSProperties}
      onClick={onClick}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: isActive ? 1.05 : 1,
      }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: 0.6,
        delay: animationDelay,
        type: "spring",
        stiffness: 100
      }}
    >
      {/* Floating Animation */}
      <motion.div
        animate={{
          y: [-2, 2, -2],
          rotateZ: [-0.5, 0.5, -0.5]
        }}
        transition={{
          duration: 4 + animationDelay,
          repeat: Infinity,
          ease: "easeInOut",
          delay: animationDelay
        }}
        className="w-full h-full"
      >
        {/* Card Background with Glass Effect */}
        <div className={`
          relative w-full h-full rounded-2xl overflow-hidden
          bg-background-secondary/80 dark:bg-background-secondary-dark/80 
          backdrop-blur-lg border border-border-primary/30 dark:border-border-primary-dark/30
          shadow-lg hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary-dark/10
          transition-all duration-300
          ${isActive ? 'ring-2 ring-primary/50 dark:ring-primary-dark/50 shadow-primary/20 dark:shadow-primary-dark/20' : ''}
          ${compact ? 'p-3' : 'p-4'}
        `}>
          
          {/* Glow Effect */}
          <div 
            className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
            style={{
              background: `radial-gradient(circle at center, ${proficiencyInfo.color}33, transparent 70%)`
            }}
          />

          {/* Featured Badge */}
          {(skill.is_featured || isFeatured) && (
            <motion.div
              className="absolute -top-1 -right-1 z-10"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                >
                  <Star className="w-3 h-3 text-white fill-current" />
                </motion.div>
                {/* Pulse effect */}
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-yellow-400 rounded-full"
                />
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          <div className="relative z-10 h-full flex flex-col">
            
            {/* Category Icon */}
            <div className="flex justify-center mb-3">
              <div 
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  transition-all duration-300 group-hover:scale-110
                  ${compact ? 'w-10 h-10' : 'w-12 h-12'}
                `}
                style={{
                  background: `linear-gradient(135deg, ${skill.category_color}20, ${skill.category_color}10)`,
                  border: `1px solid ${skill.category_color}30`
                }}
              >
                <IconComponent 
                  className={`${compact ? 'w-5 h-5' : 'w-6 h-6'} transition-colors duration-300`}
                  style={{ color: skill.category_color }}
                />
              </div>
            </div>

            {/* Skill Name */}
            <h3 className={`
              text-center font-semibold text-text-primary dark:text-text-primary-dark
              mb-3 leading-tight line-clamp-2 group-hover:text-primary dark:group-hover:text-primary-dark
              transition-colors duration-300
              ${compact ? 'text-sm' : 'text-base'}
            `}>
              {skill.name}
            </h3>

            {/* Proficiency Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs text-text-tertiary dark:text-text-tertiary-dark`}>
                  Proficiency
                </span>
                <span className={`text-xs font-medium`} style={{ color: proficiencyInfo.color }}>
                  {skill.proficiency_level}/5
                </span>
              </div>
              
              <div className="relative w-full h-2 bg-background-tertiary/50 dark:bg-background-tertiary-dark/50 rounded-full overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{ 
                    background: `linear-gradient(90deg, ${proficiencyInfo.color}, ${proficiencyInfo.color}aa)`
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${proficiencyPercentage}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                />
                {/* Shimmer effect */}
                <motion.div
                  className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: [-32, 120] }}
                  transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
                />
              </div>
            </div>

            {/* Experience */}
            <div className="mb-3">
              <div className="flex items-center justify-center gap-1 text-text-secondary dark:text-text-secondary-dark">
                <Calendar className="w-3 h-3" />
                <span className={`font-medium ${compact ? 'text-xs' : 'text-sm'}`}>
                  {experienceText}
                </span>
              </div>
            </div>

            {/* Category Label */}
            <div className="mt-auto">
              <div 
                className={`
                  text-center px-2 py-1 rounded-lg text-xs font-medium
                  transition-all duration-300
                `}
                style={{
                  backgroundColor: `${skill.category_color}15`,
                  color: skill.category_color,
                  border: `1px solid ${skill.category_color}25`
                }}
              >
                {skill.category_name}
              </div>
            </div>

            {/* Certification Indicator */}
            {skill.certification_name && (
              <motion.div
                className="absolute bottom-2 left-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
              >
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <Award className="w-2 h-2 text-white" />
                </div>
              </motion.div>
            )}

            {/* Hover Overlay with Additional Info */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
                         rounded-2xl flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100
                         transition-opacity duration-300"
              initial={false}
            >
              <div className="text-white text-xs space-y-1">
                <div className="font-medium">{proficiencyInfo.label}</div>
                {skill.description && (
                  <div className="line-clamp-2 opacity-90">
                    {skill.description}
                  </div>
                )}
                {skill.certification_name && (
                  <div className="flex items-center gap-1 text-green-300">
                    <Award className="w-3 h-3" />
                    <span className="truncate">Certified</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SkillCard;