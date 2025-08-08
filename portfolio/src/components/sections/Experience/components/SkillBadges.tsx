// src/components/sections/Experience/components/SkillBadges.tsx - ENHANCED WITH ACTIVITY SUPPORT
// Modifikasi minimal untuk mendukung activity-aware interactions

import React, { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, ChevronDown, ChevronUp, Star } from "lucide-react";
import { Skill } from "@/types/experience";
import { useMediaQuery } from "@/hooks/common/useMediaQuery";

interface SkillBadgesProps {
  skills: Skill[];
  isActivityEnabled?: boolean; // ✅ TAMBAH: Activity-aware prop
  showExpanded?: boolean;
  maxVisible?: number;
}

const SkillBadges = memo<SkillBadgesProps>(({ 
  skills, 
  isActivityEnabled = true, // ✅ TAMBAH: Default enabled
  showExpanded = false,
  maxVisible = 6 
}) => {
  const [isExpanded, setIsExpanded] = useState(showExpanded);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // ✅ MODIFIKASI: Activity-aware toggle expansion
  const toggleExpanded = useCallback(() => {
    if (!isActivityEnabled) {
      console.log('🏷️ SkillBadges: Expansion disabled due to inactivity');
      return;
    }
    setIsExpanded(prev => !prev);
  }, [isActivityEnabled]);

  if (!skills || skills.length === 0) return null;

  const visibleSkills = isExpanded ? skills : skills.slice(0, maxVisible);
  const hasMore = skills.length > maxVisible;

  // Skill level color mapping
  const getLevelColor = (level: number) => {
    switch (level) {
      case 5: return 'from-purple-500 to-indigo-600'; // Expert
      case 4: return 'from-blue-500 to-cyan-500'; // Advanced
      case 3: return 'from-green-500 to-emerald-500'; // Intermediate
      case 2: return 'from-yellow-500 to-orange-500'; // Novice
      case 1: return 'from-red-500 to-pink-500'; // Beginner
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getLevelText = (level: number) => {
    switch (level) {
      case 5: return 'Expert';
      case 4: return 'Advanced';
      case 3: return 'Intermediate';
      case 2: return 'Novice';
      case 1: return 'Beginner';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
            <Code className="w-4 h-4 text-primary" />
          </div>
          <h4 className={`font-medium text-text-primary dark:text-text-primary-dark ${!isActivityEnabled && 'opacity-60'}`}>
            Skills & Technologies ({skills.length})
          </h4>
        </div>

        {hasMore && (
          <button
            onClick={toggleExpanded}
            disabled={!isActivityEnabled} // ✅ TAMBAH: Disable when inactive
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium
              transition-all duration-300
              ${isActivityEnabled 
                ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isExpanded ? (
              <>
                Show Less
                <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                Show All
                <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Skills Grid */}
      <motion.div
        className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-200/50 dark:border-gray-700/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: isActivityEnabled ? 1 : 0.7, // ✅ TAMBAH: Visual feedback for inactive state
          y: 0 
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          layout
          className="flex flex-wrap gap-2 lg:gap-3"
        >
          <AnimatePresence>
            {visibleSkills.map((skill, index) => (
              <motion.div
                key={skill.id || `${skill.name}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: isActivityEnabled ? 1 : 0.8, 
                  scale: 1 
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                whileHover={
                  isActivityEnabled 
                    ? { 
                        scale: 1.05, 
                        y: -2,
                        transition: { duration: 0.2 }
                      } 
                    : {}
                }
                className={`
                  group relative inline-flex items-center gap-2 px-3 py-2 rounded-lg
                  bg-gradient-to-r ${getLevelColor(skill.level)} 
                  text-white text-sm font-medium shadow-sm
                  transition-all duration-300
                  ${isActivityEnabled ? 'hover:shadow-lg' : 'cursor-default'}
                `}
              >
                {/* Skill Name */}
                <span className="relative z-10">{skill.name}</span>

                {/* Level Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-2.5 h-2.5 ${
                        i < skill.level 
                          ? 'text-white fill-white' 
                          : 'text-white/40'
                      }`}
                    />
                  ))}
                </div>

                {/* Hover Tooltip */}
                {isActivityEnabled && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 0, y: 5 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded pointer-events-none whitespace-nowrap z-20"
                  >
                    {getLevelText(skill.level)}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black/80" />
                  </motion.div>
                )}

                {/* Skill Color Indicator */}
                {skill.color && (
                  <div
                    className="w-2 h-2 rounded-full border border-white/50"
                    style={{ backgroundColor: skill.color }}
                  />
                )}

                {/* Background Pattern */}
                <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Skill Level Legend */}
        {!isMobile && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200/30 dark:border-gray-700/30"
          >
            <p className={`text-xs text-text-secondary dark:text-text-secondary-dark mb-2 ${!isActivityEnabled && 'opacity-60'}`}>
              Skill Levels:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { level: 1, label: 'Beginner', color: 'from-red-500 to-pink-500' },
                { level: 2, label: 'Novice', color: 'from-yellow-500 to-orange-500' },
                { level: 3, label: 'Intermediate', color: 'from-green-500 to-emerald-500' },
                { level: 4, label: 'Advanced', color: 'from-blue-500 to-cyan-500' },
                { level: 5, label: 'Expert', color: 'from-purple-500 to-indigo-600' },
              ].map(({ level, label, color }) => (
                <div key={level} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded bg-gradient-to-r ${color}`} />
                  <span className={`text-xs text-text-secondary dark:text-text-secondary-dark ${!isActivityEnabled && 'opacity-60'}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Summary Stats */}
        {isExpanded && skills.length > 1 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200/30 dark:border-gray-700/30"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div>
                <p className={`text-lg font-semibold text-text-primary dark:text-text-primary-dark ${!isActivityEnabled && 'opacity-60'}`}>
                  {skills.length}
                </p>
                <p className={`text-xs text-text-secondary dark:text-text-secondary-dark ${!isActivityEnabled && 'opacity-60'}`}>
                  Total Skills
                </p>
              </div>
              <div>
                <p className={`text-lg font-semibold text-text-primary dark:text-text-primary-dark ${!isActivityEnabled && 'opacity-60'}`}>
                  {skills.filter(s => s.level >= 4).length}
                </p>
                <p className={`text-xs text-text-secondary dark:text-text-secondary-dark ${!isActivityEnabled && 'opacity-60'}`}>
                  Advanced+
                </p>
              </div>
              <div>
                <p className={`text-lg font-semibold text-text-primary dark:text-text-primary-dark ${!isActivityEnabled && 'opacity-60'}`}>
                  {Math.round((skills.reduce((acc, s) => acc + s.level, 0) / skills.length) * 10) / 10}
                </p>
                <p className={`text-xs text-text-secondary dark:text-text-secondary-dark ${!isActivityEnabled && 'opacity-60'}`}>
                  Avg Level
                </p>
              </div>
              <div>
                <p className={`text-lg font-semibold text-text-primary dark:text-text-primary-dark ${!isActivityEnabled && 'opacity-60'}`}>
                  {skills.filter(s => s.level === 5).length}
                </p>
                <p className={`text-xs text-text-secondary dark:text-text-secondary-dark ${!isActivityEnabled && 'opacity-60'}`}>
                  Expert
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
});

SkillBadges.displayName = "SkillBadges";

export default SkillBadges;