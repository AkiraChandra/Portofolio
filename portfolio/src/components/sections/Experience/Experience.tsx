// src/components/sections/Experience/Experience.tsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Loader, AlertCircle, RefreshCw } from "lucide-react";
import TimelinePoint from "./components/TimeLinePoint";
import TimelineInfo from "./components/TimeLineInfo";
import MovingStars from "@/components/ui/animations/Movingstars";
import type { Experience as ExperienceType } from "@/types/experience";
import ResumeExport from "./components/ResumeExport";
import { useExperienceVisibility } from "@/hooks/experience/useExperienceVisibility";
import { useExperience } from "@/hooks/experience/useExperience";
import SmartImage from '@/components/common/SmartImage';
import PlaceholderImage from '@/components/common/PlaceholderImage';

const Experience: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showSkills, setShowSkills] = useState(false);
  const { isExperienceVisible, experienceSectionRef } =
    useExperienceVisibility();
  const headerRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [scrollTarget, setScrollTarget] = useState<"info" | "top" | null>(null);

  // Use the new hook instead of hardcoded data
  const { experiences, loading, error, refetch } = useExperience();

  const scrollToInfo = () => {
    if (infoRef.current) {
      infoRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const scrollToTop = () => {
    if (headerRef.current) {
      headerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    if (shouldScroll) {
      if (scrollTarget === "info" && activeIndex !== null) {
        scrollToInfo();
      } else if (scrollTarget === "top") {
        scrollToTop();
      }
      setShouldScroll(false);
      setScrollTarget(null);
    }
  }, [shouldScroll, scrollTarget, activeIndex]);

  const handleExperienceClick = (index: number) => {
    setActiveIndex((prev) => {
      const newIndex = prev === index ? null : index;
      setShouldScroll(true);
      if (newIndex !== null) {
        setScrollTarget("info");
      } else {
        setScrollTarget("top");
      }
      return newIndex;
    });
  };

  // Generate skills from all experiences
  const allSkills = experiences.reduce((skills, exp) => {
    exp.technologies?.forEach((tech) => {
      if (!skills.find((s) => s.name === tech)) {
        skills.push({
          name: tech,
          level: Math.floor(Math.random() * 30) + 70,
          color: `rgb(${Math.random() * 100 + 155}, ${
            Math.random() * 100 + 155
          }, ${Math.random() * 100 + 155})`,
        });
      }
    });
    return skills;
  }, [] as { name: string; level: number; color?: string }[]);

  // Loading state
  if (loading) {
    return (
      <section className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <MovingStars />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-primary dark:text-primary-dark" />
          <p className="text-text-primary dark:text-text-primary-dark">
            Loading experiences...
          </p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <MovingStars />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400" />
          <p className="text-red-500 dark:text-red-400 text-center">
            Failed to load experiences
          </p>
          <button
            onClick={refetch}
            className="flex items-center gap-2 px-4 py-2 bg-primary dark:bg-primary-dark 
                     rounded-lg text-background-primary hover:bg-primary-dark 
                     dark:hover:bg-primary transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // No experiences state
  if (!experiences?.length) {
    return (
      <section className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <MovingStars />
        </div>
        <div className="relative z-10 text-center">
          <p className="text-text-primary dark:text-text-primary-dark">
            No experiences available.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={experienceSectionRef}
      className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark transition-colors duration-300 px-4"
    >
      <div ref={headerRef} className="mb-0">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent dark:via-black/70 dark:to-black z-1" />
        <div className="absolute inset-0 overflow-hidden">
          <MovingStars />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent dark:via-black/20 dark:to-black z-1" />
        <div className="relative z-10 max-w-7xl mx-auto min-h-screen overflow-y-auto">
          <div className="mt-20 mb-0">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-text-primary-dark mb-2 sm:mb-4">
                My{" "}
                <span className="text-primary dark:text-primary-dark">
                  Journey
                </span>
              </h2>
              <p className="text-sm sm:text-base text-text-secondary dark:text-text-secondary-dark">
                Explore my space mission throughout the years
              </p>
            </div>

            {/* Skills Section */}
            <div className="mb-10">
              <motion.button
                className="w-full flex items-center justify-between p-4 bg-background-secondary/80 dark:bg-background-secondary-dark/80 
                         backdrop-blur-sm rounded-lg border border-border-primary/50 dark:border-border-primary-dark/50"
                onClick={() => setShowSkills(!showSkills)}
              >
                <span className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
                  Skills & Technologies
                </span>
                <motion.div
                  animate={{ rotate: showSkills ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-text-primary dark:text-text-primary-dark" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {showSkills && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {allSkills.map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-background-tertiary/50 dark:bg-background-tertiary-dark/50 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                            {skill.name}
                          </span>
                          <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="h-2 bg-background-tertiary dark:bg-background-tertiary-dark rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: skill.color }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Timeline Section */}
            <div className="flex flex-col lg:flex-row gap-">
              <div className="w-full lg:w-[380px] relative h-[calc(100vh-200px)]">
                <div className="h-full overflow-y-auto hide-scrollbar pr-2 lg:pr-4">
                  <div className="space-y-6 sm:space-y-[80px] relative pb-4">
                    {experiences.map((exp: ExperienceType, index: number) => (
                      <div key={exp.id} className="relative">
                        <TimelinePoint
                          experience={exp}
                          isActive={index === activeIndex}
                          onClick={() => handleExperienceClick(index)}
                          isLast={index === experiences.length - 1}
                        />

                        <AnimatePresence>
                          {activeIndex === index && (
                            <div className="block lg:hidden mt-4">
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="bg-background-secondary/80 dark:bg-background-secondary-dark/80 
                                       backdrop-blur-sm rounded-lg p-4 border border-border-primary/50 
                                       dark:border-border-primary-dark/50"
                              >
                                <div className="space-y-3">
                                  <div className="text-sm text-text-secondary dark:text-text-secondary-dark">
                                    <p className="mb-2">{exp.description}</p>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                      {exp.technologies
                                        ?.slice(0, 4)
                                        .map((tech) => (
                                          <span
                                            key={tech}
                                            className="px-2 py-1 text-xs rounded-full
                                                 bg-primary/10 dark:bg-primary-dark/10
                                                 text-primary dark:text-primary-dark
                                                 border border-primary/20 dark:border-primary-dark/20"
                                          >
                                            {tech}
                                          </span>
                                        ))}
                                    </div>
                                  </div>

                                  {/* Mobile Project Images Gallery */}
                                  {exp.projectImages &&
                                    exp.projectImages.length > 0 && (
                                      <motion.div
                                        className="mb-6 w-full"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                      >
                                        <h4 className="text-sm font-medium text-text-primary dark:text-text-primary-dark mb-3 flex items-center gap-2">
                                          <span>Project Gallery</span>
                                          <span className="text-xs text-text-tertiary dark:text-text-tertiary-dark">
                                            (Swipe to explore)
                                          </span>
                                        </h4>

                                        <div className="relative group">
                                          <div className="relative rounded-xl overflow-hidden">
                                            <div
                                              className="flex overflow-x-scroll hide-scrollbar snap-x snap-mandatory touch-pan-x"
                                              style={{
                                                WebkitOverflowScrolling:
                                                  "touch",
                                                scrollBehavior: "smooth",
                                              }}
                                            >
                                              {exp.projectImages.map(
                                                (image, idx) => {
                                                  const hasValidImage =
                                                    image.url &&
                                                    image.url.trim() !== "";

                                                  return (
                                                    <div
                                                      key={idx}
                                                      className="flex-none w-[calc(100vw-48px)] sm:w-[300px] px-1 first:pl-0 last:pr-0 snap-center"
                                                    >
                                                      <div className="relative aspect-video rounded-lg overflow-hidden bg-background-tertiary dark:bg-background-tertiary-dark">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />

                                                        {hasValidImage ? (
                                                          <SmartImage
                                                            src={image.url}
                                                            alt={
                                                              image.caption ||
                                                              `Project image ${
                                                                idx + 1
                                                              }`
                                                            }
                                                            fill
                                                            sizes="(max-width: 640px) 100vw, 300px"
                                                            className="object-cover"
                                                            onError={() => {
                                                              console.warn(
                                                                `Mobile project image failed: ${image.url}`
                                                              );
                                                            }}
                                                          />
                                                        ) : (
                                                          <PlaceholderImage
                                                            type="project"
                                                            className="rounded-lg"
                                                          />
                                                        )}

                                                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                                                          <p className="text-white text-sm font-medium line-clamp-2">
                                                            {image.caption ||
                                                              `Project Screenshot ${
                                                                idx + 1
                                                              }`}
                                                          </p>
                                                        </div>

                                                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                                                          <p className="text-white text-xs font-medium">
                                                            {idx + 1}/
                                                            {
                                                              exp.projectImages
                                                                ?.length
                                                            }
                                                          </p>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>

                                            <div className="absolute bottom-3 left-0 right-0 z-10">
                                              <div className="flex justify-center items-center gap-1">
                                                {exp.projectImages.map(
                                                  (_, idx) => (
                                                    <div
                                                      key={idx}
                                                      className={`h-1.5 rounded-full transition-all duration-300 ${
                                                        idx === 0
                                                          ? "w-4 bg-white"
                                                          : "w-1.5 bg-white/40"
                                                      }`}
                                                    />
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          </div>

                                          <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{
                                              duration: 2,
                                              repeat: 1,
                                              repeatType: "reverse",
                                              delay: 1,
                                            }}
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
                                          >
                                            <div className="text-white/90 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium">
                                              Swipe to view more
                                            </div>
                                          </motion.div>
                                        </div>
                                      </motion.div>
                                    )}

                                  <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                                      Key Achievements
                                    </h4>
                                    <ul className="space-y-2">
                                      {exp.achievements
                                        .slice(0, 3)
                                        .map((achievement, idx) => (
                                          <motion.li
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex items-start gap-2"
                                          >
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-primary-dark mt-1.5 shrink-0" />
                                            <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                                              {achievement}
                                            </span>
                                          </motion.li>
                                        ))}
                                    </ul>
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop Experience Info */}
              <div className="hidden lg:block flex-1" ref={infoRef}>
                <AnimatePresence mode="wait">
                  {activeIndex !== null && (
                    <motion.div
                      key={`info-${activeIndex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <TimelineInfo
                        experience={experiences[activeIndex]}
                        isVisible={true}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional render Resume Export */}
      {isExperienceVisible && (
        <ResumeExport
          onExport={(format) => {
            console.log("Exporting in format:", format);
          }}
        />
      )}
    </section>
  );
};

export default Experience;
