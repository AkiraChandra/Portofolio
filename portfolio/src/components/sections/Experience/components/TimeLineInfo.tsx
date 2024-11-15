import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Building2, MapPin, Calendar, ExternalLink, ChevronRight, Award, Code, Briefcase, PictureInPicture, Camera } from 'lucide-react';
import { TimelineInfoProps } from '@/types/experience';

const TimelineInfo: React.FC<TimelineInfoProps> = ({ experience, isVisible }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'photos'>('overview');
  
  // Generate skill levels with custom colors
  const skillLevels = experience.technologies?.map((tech, index) => ({
    name: tech,
    level: Math.floor(Math.random() * 30) + 70,
    color: `hsl(${index * (360 / (experience.technologies?.length || 1))}, 70%, 60%)`
  }));

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
          className="relative -ml-[42px]"
        >
            <div className="bg-background-secondary/80 dark:bg-background-secondary-dark/80 
                   backdrop-blur-lg rounded-lg shadow-lg border border-border-primary/10 dark:border-border-primary-dark/10
                   overflow-hidden">
            {/* Glowing Header Effect */}
            <div className="relative h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                    dark:from-blue-700 dark:via-purple-700 dark:to-pink-700
                    overflow-hidden">
              {/* Animated glow effects */}
              <motion.div
              className="absolute inset-0 opacity-50"
              animate={{
                background: [
                'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)'
                ]
              }}
              transition={{ duration: 5, repeat: Infinity }}
              />
              {/* Company logo and info */}
              <div className="relative flex items-center gap-4 h-full px-6">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-primary/20 dark:border-primary-dark/20">
                  <Image
                    src={experience.icon}
                    alt={`${experience.company} logo`}
                    layout="fill"
                    objectFit="cover"
                    className="bg-white"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
                    {experience.role}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-text-secondary dark:text-text-secondary-dark">
                    <span className="font-medium">{experience.company}</span>
                    <span>•</span>
                    <span>{experience.period}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 px-4 py-2 border-b border-border-primary/10 dark:border-border-primary-dark/10">
              <TabButton tab="overview" label="Overview" icon={Briefcase} />
              <TabButton tab="skills" label="Skills" icon={Code} />
              <TabButton tab="photos" label="Photos" icon={Camera} />
            </div>

            {/* Content Area */}
            <div className="p-4">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="space-y-4">
                      {/* Description */}
                      <p className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                        {experience.description}
                      </p>

                      {/* Achievements */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-text-primary dark:text-text-primary-dark">
                          Key Achievements
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {experience.achievements.map((achievement, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start gap-2 bg-background-tertiary/30 dark:bg-background-tertiary-dark/30 
                                       rounded-lg p-2"
                            >
                              <ChevronRight 
                                size={14} 
                                className="mt-1 text-primary dark:text-primary-dark flex-shrink-0" 
                              />
                              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                                {achievement}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
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
                    className="grid grid-cols-2 gap-4"
                  >
                    {skillLevels?.map((skill, idx) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative"
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
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className="h-full rounded-full relative"
                            style={{ backgroundColor: skill.color }}
                          >
                            {/* Animated gradient overlay */}
                            <motion.div
                              className="absolute inset-0"
                              animate={{
                                background: [
                                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)'
                                ],
                                backgroundPosition: ['200% 0', '-200% 0']
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'linear'
                              }}
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
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
                      <div className="grid grid-cols-3 gap-3">
                        {experience.projectImages.map((image, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative aspect-video rounded-lg overflow-hidden"
                          >
                            <Image
                              src={image.url}
                              alt={image.caption || `Project image ${idx + 1}`}
                              layout="fill"
                              objectFit="cover"
                              className="transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                              {image.caption && (
                                <div className="absolute bottom-0 left-0 right-0 p-2">
                                  <p className="text-white text-xs">
                                    {image.caption}
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-text-tertiary dark:text-text-tertiary-dark text-center py-4">
                        No project images available
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer with Links */}
            {(experience.certificateUrl || experience.links) && (
              <div className="px-4 py-3 border-t border-border-primary/10 dark:border-border-primary-dark/10 
                           bg-background-tertiary/30 dark:bg-background-tertiary-dark/30">
                <div className="flex flex-wrap gap-3">
                  {experience.certificateUrl && (
                    <motion.a
                      href={experience.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs
                               bg-primary/10 dark:bg-primary-dark/10 
                               text-primary dark:text-primary-dark
                               hover:bg-primary/20 dark:hover:bg-primary-dark/20
                               transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink size={12} />
                      View Certificate
                    </motion.a>
                  )}
                  {experience.links?.map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs
                               bg-primary/10 dark:bg-primary-dark/10 
                               text-primary dark:text-primary-dark
                               hover:bg-primary/20 dark:hover:bg-primary-dark/20
                               transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink size={12} />
                      {link.label}
                    </motion.a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TimelineInfo;