// src/components/sections/Experience/components/TimeLineInfo.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Building2, MapPin, Calendar, ExternalLink, ChevronRight, Award, Code, Briefcase, PictureInPicture, Camera } from 'lucide-react';
import { TimelineInfoProps } from '@/types/experience';

const TimelineInfo: React.FC<TimelineInfoProps> = ({ experience, isVisible }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'photos'>('overview');
  
  const skillLevels = experience.technologies?.map((tech, index) => ({
    name: tech,
    level: Math.floor(Math.random() * 30) + 70,
    color: `hsl(${index * (360 / (experience.technologies?.length || 1))}, 70%, 60%)`
  }));

  // Helper function to get proper image source
  const getImageSrc = (imageUrl?: string, fallback: string = '/images/default-company.png') => {
    if (!imageUrl) return fallback;
    
    // If it's already a full URL (like Supabase bucket URL), use it directly
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If it's a relative path, assume it's a local asset
    return imageUrl;
  };

  const TabButton = ({ tab, label, icon: Icon }: { tab: typeof activeTab, label: string, icon: any }) => (
    <motion.button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium 
                ${activeTab === tab 
                  ? 'bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark' 
                  : 'text-text-secondary dark:text-text-secondary-dark hover:bg-background-tertiary/50 dark:hover:bg-background-tertiary-dark/50'}`}
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
                <Image
                  src={getImageSrc(experience.icon)}
                  alt={`${experience.company} logo`}
                  fill
                  sizes="64px"
                  className="object-contain"
                  onError={(e) => {
                    // Fallback to default image if the URL fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/default-company.png';
                  }}
                  priority
                />
              </div>
              {/* Company Info */}
              <div>
                <h3 className="text-xl font-bold text-primary dark:text-primary-dark">{experience.company}</h3>
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
            <TabButton tab="skills" label="Skills" icon={Code} />
            <TabButton tab="photos" label="Photos" icon={Camera} />
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Description */}
                  <p className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed mb-4">
                    {experience.description}
                  </p>

                  {/* Achievements */}
                  <div>
                    <h4 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-2">
                      Key Achievements
                    </h4>
                    <ul className="space-y-2">
                      {experience.achievements.map((achievement, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-2 text-sm text-text-secondary dark:text-text-secondary-dark"
                        >
                          <Award size={16} className="mt-0.5 flex-shrink-0 text-primary dark:text-primary-dark" />
                          <span>{achievement}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeTab === 'skills' && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    {skillLevels?.map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                            {skill.name}
                          </span>
                          <span className="text-xs text-text-tertiary dark:text-text-tertiary-dark">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="h-2 bg-background-tertiary/50 dark:bg-background-tertiary-dark/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: skill.color }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'photos' && (
                <motion.div
                  key="photos"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {experience.projectImages && experience.projectImages.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {experience.projectImages.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative aspect-square rounded-lg overflow-hidden bg-background-tertiary/50 dark:bg-background-tertiary-dark/50"
                        >
                          <Image
                            src={getImageSrc(image.url, '/images/placeholder-project.png')}
                            alt={image.caption || `Project image ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder-project.png';
                            }}
                          />
                          {image.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2">
                              <p className="text-xs text-white truncate">{image.caption}</p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Camera size={48} className="mx-auto text-text-tertiary dark:text-text-tertiary-dark mb-4" />
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