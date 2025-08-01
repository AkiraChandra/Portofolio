// src/components/sections/Experience/components/TimeLinePoint.tsx

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TimelineItemProps } from "@/types/experience";
import SmartImage from '@/components/common/SmartImage';
import PlaceholderImage from '@/components/common/PlaceholderImage';
const TimelinePoint: React.FC<TimelineItemProps> = ({
  experience,
  isActive,
  onClick,
  isLast = false,
}) => {
  const handleClick = () => {
    onClick();
  };


  return (
    <motion.div
      className="group cursor-pointer flex items-start relative"
      onClick={handleClick}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {/* Timeline Point Container with Company Logo */}
      <div className="relative flex items-center">
        {/* Company Logo */}
        <div
          className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-primary/30 dark:border-primary-dark/30 
               group-hover:border-primary dark:group-hover:border-primary-dark transition-colors duration-300 
               z-20 bg-background-primary dark:bg-background-primary-dark"
        >
          {experience.icon && experience.icon.trim() !== "" ? (
            <SmartImage
              src={experience.icon}
              alt={`${experience.company} logo`}
              fill
              sizes="48px"
              className="object-cover rounded-full"
              priority={isActive}
              showPlaceholder={false}
              onError={() => {
                console.warn(`Company logo failed: ${experience.company}`);
              }}
            />
          ) : (
            <PlaceholderImage
              type="company"
              className="rounded-full"
              width={48}
              height={48}
            />
          )}
        </div>

        {/* Timeline Point and Line */}
        <div className="relative ml-4">
          {/* Vertical line */}
          {!isLast && (
            <div
              className={`absolute left-[11px] top-[36px] w-0.5 h-[150px] -translate-y-2
                           ${
                             isActive
                               ? "bg-primary dark:bg-primary-dark"
                               : "bg-primary/30 dark:bg-primary-dark/30"
                           }
                           transition-colors duration-300`}
            />
          )}

          {/* Point */}
          <motion.div
            className="relative z-10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300 border-3
                                ${
                                  isActive
                                    ? "bg-primary dark:bg-primary-dark border-primary dark:border-primary-dark"
                                    : "bg-background-primary dark:bg-background-primary-dark border-primary/30 dark:border-primary-dark/30"
                                }`}
              animate={
                isActive
                  ? {
                      boxShadow: [
                        "0 0 10px rgba(var(--color-primary), 0.3)",
                        "0 0 20px rgba(var(--color-primary), 0.5)",
                        "0 0 10px rgba(var(--color-primary), 0.3)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div
                className={`w-3 h-3 rounded-full transition-colors duration-300
                           ${
                             isActive
                               ? "bg-background-primary dark:bg-background-primary-dark"
                               : "bg-primary/30 dark:bg-primary-dark/30"
                           }`}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Company Info - Updated for better text wrapping */}
        <div className="ml-4 group-hover:translate-x-1 transition-transform duration-200 flex-1 min-w-0">
          <h3
            className={`text-base font-medium transition-colors duration-300 break-words
                       ${
                         isActive
                           ? "text-primary dark:text-primary-dark"
                           : "text-text-primary dark:text-text-primary-dark"
                       }`}
          >
            {experience.company}
          </h3>
          <div className="mt-0.5">
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark line-clamp-2 break-words">
              {experience.role}
            </p>
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-xs text-text-tertiary dark:text-text-tertiary-dark">
                {experience.period}
              </span>
              {experience.location && (
                <>
                  <span className="text-xs text-text-tertiary dark:text-text-tertiary-dark">
                    •
                  </span>
                  <span className="text-xs text-text-tertiary dark:text-text-tertiary-dark truncate">
                    {experience.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TimelinePoint;
