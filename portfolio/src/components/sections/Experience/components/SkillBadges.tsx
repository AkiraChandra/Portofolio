import React from 'react';
import { motion } from 'framer-motion';

interface Skill {
  name: string;
  level: number; // 0-100
  color?: string;
}

interface SkillBadgesProps {
  skills: Skill[];
}

const SkillBadges: React.FC<SkillBadgesProps> = ({ skills }) => {
  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-medium text-text-primary dark:text-text-primary-dark">
        Skills & Technologies
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
                {skill.name}
              </span>
              <span className="text-xs text-text-tertiary dark:text-text-tertiary-dark">
                {skill.level}%
              </span>
            </div>
            
            <div className="h-2 bg-background-tertiary dark:bg-background-tertiary-dark rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{
                  backgroundColor: skill.color || 'rgb(var(--color-primary))'
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillBadges;