// src/components/sections/Experience/components/TimeLineInfo.tsx (Updated)
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronRight,
  Award,
  Code,
  Briefcase,
  PictureInPicture,
  Camera,
  Layers,
  Sparkles
} from "lucide-react";
import { TimelineInfoProps } from "@/types/experience";
import SmartImage from "@/components/common/SmartImage";
import PlaceholderImage from "@/components/common/PlaceholderImage";

const TimelineInfo: React.FC<TimelineInfoProps> = ({
  experience,
  isVisible,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "photos">("overview");

  // Helper function to get proper image source
  const getImageSrc = (
    imageUrl?: string,
    fallback: string = "/images/default-company.png"
  ) => {
    if (!imageUrl) return fallback;

    // If it's already a full URL (like Supabase bucket URL), use it directly
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    // If it's a relative path, assume it's a local asset
    return imageUrl;
  };

  const TabButton = ({
    tab,
    label,
    icon: Icon,
  }: {
    tab: typeof activeTab;
    label: string;
    icon: any;
  }) => (
    <motion.button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium 
                ${
                  activeTab === tab
                    ? "bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark"
                    : "text-text-secondary dark:text-text-secondary-dark hover:bg-background-tertiary/50 dark:hover:bg-background-tertiary-dark/50"
                }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon size={16} />
      {label}
    </motion.button>
  );

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative bg-background-secondary/90 dark:bg-background-secondary-dark/90 
                     backdrop-blur-lg rounded-2xl shadow-xl border border-border-primary/20 dark:border-border-primary-dark/20
                     overflow-hidden"
        >
          {/* Header */}
          <div className="relative px-6 py-4 bg-background-tertiary/0 dark:bg-background-tertiary-dark/0">
            <div className="flex gap-4">
              {/* Company Logo */}
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/20 backdrop-blur-lg">
                {experience.icon && experience.icon.trim() !== "" ? (
                  <SmartImage
                    src={experience.icon}
                    alt={`${experience.company} logo`}
                    fill
                    sizes="64px"
                    className="object-contain"
                    priority
                    onError={() => {
                      console.warn(
                        `Company logo failed: ${experience.company}`
                      );
                    }}
                  />
                ) : (
                  <PlaceholderImage
                    type="company"
                    className="rounded-lg"
                    width={64}
                    height={64}
                  />
                )}
              </div>
              {/* Company Info */}
              <div>
                <h3 className="text-xl font-bold text-primary dark:text-primary-dark">
                  {experience.company}
                </h3>
                <p className="text-sm text-white/90">{experience.role}</p>
                <div className="mt-1 text-xs text-white/60">
                  <span>{experience.period}</span>
                  {experience.location && (
                    <>
                      <span className="mx-1">•</span>
                      <span>{experience.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border-primary/20 dark:border-border-primary-dark/20">
            <TabButton tab="overview" label="Overview" icon={Briefcase} />
            <TabButton tab="photos" label="Photos" icon={Camera} />
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Description */}
                  <p className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed mb-6">
                    {experience.description}
                  </p>

                  {/* Technologies Used - New Design */}
                  {experience.technologies && experience.technologies.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Code className="w-5 h-5 text-primary dark:text-primary-dark" />
                        <h4 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
                          Technologies Used
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {experience.technologies.map((tech, index) => (
                          <motion.div
                            key={tech}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative"
                          >
                            <div className="relative overflow-hidden rounded-xl p-3 bg-gradient-to-br from-primary/5 to-yellow-400/5 dark:from-primary-dark/5 dark:to-yellow-400/5 border border-primary/10 dark:border-primary-dark/10 backdrop-blur-sm hover:from-primary/10 hover:to-yellow-400/10 dark:hover:from-primary-dark/10 dark:hover:to-yellow-400/10 transition-all duration-300">
                              {/* Subtle glow effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-yellow-400/5 dark:from-primary-dark/5 dark:to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              
                              {/* Tech name */}
                              <div className="relative z-10 flex items-center justify-between">
                                <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark group-hover:text-primary dark:group-hover:text-primary-dark transition-colors">
                                  {tech}
                                </span>
                                <div className="w-2 h-2 rounded-full bg-primary/30 dark:bg-primary-dark/30 group-hover:bg-primary dark:group-hover:bg-primary-dark transition-colors" />
                              </div>
                              
                              {/* Animated underline */}
                              <motion.div
                                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-yellow-400 dark:from-primary-dark dark:to-yellow-400"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Achievements */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-5 h-5 text-primary dark:text-primary-dark" />
                      <h4 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
                        Key Achievements
                      </h4>
                    </div>
                    <ul className="space-y-3">
                      {experience.achievements.map((achievement, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group flex items-start gap-3 text-sm text-text-secondary dark:text-text-secondary-dark p-3 rounded-lg hover:bg-background-tertiary/30 dark:hover:bg-background-tertiary-dark/30 transition-colors"
                        >
                          <div className="relative mt-1">
                            <div className="w-2 h-2 rounded-full bg-primary dark:bg-primary-dark group-hover:scale-125 transition-transform" />
                            <div className="absolute inset-0 w-2 h-2 rounded-full bg-primary/30 dark:bg-primary-dark/30 animate-ping group-hover:animate-none" />
                          </div>
                          <span className="leading-relaxed group-hover:text-text-primary dark:group-hover:text-text-primary-dark transition-colors">
                            {achievement}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeTab === "photos" && (
                <motion.div
                  key="photos"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {experience.projectImages &&
                  experience.projectImages.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {experience.projectImages.map((image, index) => {
                        const hasValidImageUrl =
                          image.url && image.url.trim() !== "";

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative aspect-square rounded-lg overflow-hidden bg-background-tertiary/50 dark:bg-background-tertiary-dark/50 group hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary-dark/10 transition-all duration-300"
                          >
                            {hasValidImageUrl ? (
                              <SmartImage
                                src={image.url}
                                alt={
                                  image.caption || `Project image ${index + 1}`
                                }
                                fill
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={() => {
                                  console.warn(
                                    `Project image failed: ${image.url}`
                                  );
                                }}
                              />
                            ) : (
                              <PlaceholderImage
                                type="project"
                                className="rounded-lg"
                              />
                            )}

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* Image caption */}
                            {image.caption && (
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-xs text-white font-medium">
                                  {image.caption}
                                </p>
                              </div>
                            )}

                            {/* Image number indicator */}
                            <div className="absolute top-2 right-2 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <span className="text-xs text-white font-medium">
                                {index + 1}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Camera
                        size={48}
                        className="mx-auto text-text-tertiary dark:text-text-tertiary-dark mb-4"
                      />
                      <p className="text-sm text-text-tertiary dark:text-text-tertiary-dark">
                        No project images available
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          {(experience.certificateUrl || experience.links) && (
            <div className="px-6 py-4 bg-background-tertiary/0 dark:bg-background-tertiary-dark/0 border-t border-border-primary/20 dark:border-border-primary-dark/20">
              <div className="flex flex-wrap gap-3">
                {experience.certificateUrl && (
                  <motion.a
                    href={experience.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 dark:bg-primary-dark/10 
                               text-primary dark:text-primary-dark hover:bg-primary/20 dark:hover:bg-primary-dark/20 
                               transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink size={16} />
                    <span>View Certificate</span>
                  </motion.a>
                )}
                {experience.links?.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 dark:bg-primary-dark/10 
                               text-primary dark:text-primary-dark hover:bg-primary/20 dark:hover:bg-primary-dark/20 
                               transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink size={16} />
                    <span>{link.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TimelineInfo;