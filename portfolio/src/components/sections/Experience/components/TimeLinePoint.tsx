// src/components/sections/Experience/components/TimeLinePoint.tsx
// ✅ MENAMBAHKAN PARAMETER isVisible TANPA IMPORT HOOK

import React from "react";
import { motion } from "framer-motion";
import { TimelineItemProps } from "@/types/experience";
import SmartImage from '@/components/common/SmartImage';
import PlaceholderImage from '@/components/common/PlaceholderImage';

// ✅ TAMBAH: Enhanced interface dengan parameter isVisible
interface EnhancedTimelineItemProps extends TimelineItemProps {
  isVisible?: boolean; // ✅ TAMBAH: Parameter isVisible dari parent
}

const TimelinePoint: React.FC<EnhancedTimelineItemProps> = ({
  experience,
  isActive,
  onClick,
  isLast = false,
  isVisible = false, // ✅ TAMBAH: Default false untuk backward compatibility
}) => {
  const handleClick = () => {
    // ✅ TAMBAH: Check isVisible sebelum onClick
    if (!isVisible) return;
    onClick();
  };

  return (
    <motion.div
      className="group cursor-pointer flex items-start relative"
      onClick={handleClick}
      whileHover={
        isVisible 
          ? { scale: 1.01 } 
          : {} // ✅ TAMBAH: Conditional animation berdasarkan isVisible
      }
      transition={{ duration: 0.2 }}
      style={{
        opacity: isVisible ? 1 : 0.6, // ✅ TAMBAH: Visual feedback
        pointerEvents: isVisible ? 'auto' : 'none', // ✅ TAMBAH: Disable interactions
      }}
    >
      {/* Timeline Point Container with Company Logo */}
      <div className="relative flex items-center">
        {/* Company Logo */}
        <div
          className={`w-12 h-12 relative rounded-full overflow-hidden border-2 
               transition-colors duration-300 z-20 bg-background-primary dark:bg-background-primary-dark
               ${isVisible 
                 ? 'border-primary/30 dark:border-primary-dark/30 group-hover:border-primary dark:group-hover:border-primary-dark'
                 : 'border-primary/10 dark:border-primary-dark/10' // ✅ TAMBAH: Inactive state
               }`}
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
                           transition-colors duration-300
                           ${isActive && isVisible
                             ? "bg-primary dark:bg-primary-dark"
                             : isVisible
                             ? "bg-primary/30 dark:bg-primary-dark/30"
                             : "bg-primary/10 dark:bg-primary-dark/10" // ✅ TAMBAH: Inactive state berdasarkan isVisible
                           }`}
            />
          )}

          {/* Point */}
          <motion.div
            className="relative z-10"
            whileHover={
              isVisible 
                ? { scale: 1.05 } 
                : {} // ✅ TAMBAH: Conditional animation berdasarkan isVisible
            }
            whileTap={
              isVisible 
                ? { scale: 0.95 } 
                : {} // ✅ TAMBAH: Conditional animation berdasarkan isVisible
            }
          >
            <motion.div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300 border-3
                                ${isActive && isVisible
                                  ? "bg-primary dark:bg-primary-dark border-primary dark:border-primary-dark"
                                  : isVisible
                                  ? "bg-background-primary dark:bg-background-primary-dark border-primary/30 dark:border-primary-dark/30"
                                  : "bg-background-primary dark:bg-background-primary-dark border-primary/10 dark:border-primary-dark/10" // ✅ TAMBAH: Inactive state
                                }`}
              animate={
                isActive && isVisible // ✅ TAMBAH: Animation hanya jika isVisible
                  ? {
                      boxShadow: [
                        "0 0 10px rgba(var(--color-primary), 0.3)",
                        "0 0 20px rgba(var(--color-primary), 0.5)",
                        "0 0 10px rgba(var(--color-primary), 0.3)",
                      ],
                    }
                  : {}
              }
              transition={{ 
                duration: isVisible ? 2 : 0, 
                repeat: isVisible && isActive ? Infinity : 0 // ✅ TAMBAH: Conditional repeat berdasarkan isVisible
              }}
            >
              <div
                className={`w-3 h-3 rounded-full transition-colors duration-300
                           ${isActive && isVisible
                             ? "bg-background-primary dark:bg-background-primary-dark"
                             : isVisible
                             ? "bg-primary/30 dark:bg-primary-dark/30"
                             : "bg-primary/10 dark:bg-primary-dark/10" // ✅ TAMBAH: Inactive state berdasarkan isVisible
                           }`}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Company Info - Updated for better text wrapping */}
        <div 
          className={`ml-4 flex-1 min-w-0 transition-transform duration-200
            ${isVisible 
              ? 'group-hover:translate-x-1' 
              : '' // ✅ TAMBAH: Conditional transform berdasarkan isVisible
            }`}
        >
          <h3
            className={`text-base font-medium transition-colors duration-300 break-words
                       ${isActive && isVisible
                         ? "text-primary dark:text-primary-dark"
                         : isVisible
                         ? "text-text-primary dark:text-text-primary-dark"
                         : "text-text-primary/50 dark:text-text-primary-dark/50" // ✅ TAMBAH: Inactive state berdasarkan isVisible
                       }`}
          >
            {experience.company}
          </h3>
          <div className="mt-0.5">
            <p 
              className={`text-sm line-clamp-2 break-words transition-colors duration-300
                ${isVisible
                  ? "text-text-secondary dark:text-text-secondary-dark"
                  : "text-text-secondary/50 dark:text-text-secondary-dark/50" // ✅ TAMBAH: Inactive state berdasarkan isVisible
                }`}
            >
              {experience.role}
            </p>
            <div className="flex flex-wrap items-center gap-1">
              <span 
                className={`text-xs transition-colors duration-300
                  ${isVisible
                    ? "text-text-tertiary dark:text-text-tertiary-dark"
                    : "text-text-tertiary/50 dark:text-text-tertiary-dark/50" // ✅ TAMBAH: Inactive state berdasarkan isVisible
                  }`}
              >
                {experience.period}
              </span>
              {experience.location && (
                <>
                  <span 
                    className={`text-xs transition-colors duration-300
                      ${isVisible
                        ? "text-text-tertiary dark:text-text-tertiary-dark"
                        : "text-text-tertiary/50 dark:text-text-tertiary-dark/50"
                      }`}
                  >
                    •
                  </span>
                  <span 
                    className={`text-xs truncate transition-colors duration-300
                      ${isVisible
                        ? "text-text-tertiary dark:text-text-tertiary-dark"
                        : "text-text-tertiary/50 dark:text-text-tertiary-dark/50"
                      }`}
                  >
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