import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Building2, MapPin, Calendar, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { TimelineInfoProps } from '@/types/experience';

const TimelineInfo: React.FC<TimelineInfoProps> = ({ experience, isVisible }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Example project images array - in practice, this would come from your experience data
  const projectImages = [
    '/project-preview1.jpg',
    '/project-preview2.jpg',
    '/project-preview3.jpg',
    '/project-preview4.jpg',
    '/project-preview5.jpg',
    '/project-preview6.jpg',
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    const gallery = document.getElementById('image-gallery');
    if (gallery) {
      const scrollAmount = 320; // Adjust based on your image container width + gap
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min((projectImages.length - 1) * scrollAmount, scrollPosition + scrollAmount);
      
      gallery.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative -ml-[42px] mb-20 max-h-[720px] overflow-y-auto hide-scrollbar"
        >
          <div className="bg-background-secondary/80 dark:bg-background-secondary-dark/80 
                       backdrop-blur-lg rounded-lg shadow-lg overflow-hidden
                       border border-border-primary dark:border-border-primary-dark">
            {/* Header Section with Cover Image */}
            <div className="relative w-full h-14 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-700 dark:to-purple-700">
              <div className="absolute -bottom-10 left-8 w-20 h-20">
                <div className="relative w-full h-full rounded-lg overflow-hidden border-4 border-background-secondary dark:border-background-secondary-dark shadow-lg">
                  <Image
                    src={experience.icon}
                    alt={`${experience.company} logo`}
                    layout="fill"
                    objectFit="cover"
                    className="bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 pt-14">
              {/* Title Section */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark">
                  {experience.role}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 text-text-secondary dark:text-text-secondary-dark">
                    <Building2 size={16} />
                    <span className="text-sm">{experience.company}</span>
                  </div>
                  {experience.location && (
                    <div className="flex items-center gap-1.5 text-text-secondary dark:text-text-secondary-dark">
                      <MapPin size={16} />
                      <span className="text-sm">{experience.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-text-secondary dark:text-text-secondary-dark">
                    <Calendar size={16} />
                    <span className="text-sm">{experience.period}</span>
                  </div>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Overview Section */}
                <div>
                  <h4 className="text-lg font-medium text-text-primary dark:text-text-primary-dark mb-3">
                    Overview
                  </h4>
                  <p className="text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed">
                    {experience.description}
                  </p>

                  {/* Gallery Section */}
                  <div className="mt-6 relative group">
                    <h4 className="text-sm font-medium text-text-primary dark:text-text-primary-dark mb-3">
                      Project Gallery
                    </h4>
                    
                    {/* Scroll Buttons */}
                    <button
                      onClick={() => handleScroll('left')}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full 
                               bg-background-primary/80 dark:bg-background-primary-dark/80 
                               text-text-primary dark:text-text-primary-dark
                               opacity-0 group-hover:opacity-100 transition-opacity duration-300
                               hover:bg-background-primary dark:hover:bg-background-primary-dark
                               disabled:opacity-0"
                      disabled={scrollPosition <= 0}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    <button
                      onClick={() => handleScroll('right')}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full 
                               bg-background-primary/80 dark:bg-background-primary-dark/80 
                               text-text-primary dark:text-text-primary-dark
                               opacity-0 group-hover:opacity-100 transition-opacity duration-300
                               hover:bg-background-primary dark:hover:bg-background-primary-dark
                               disabled:opacity-0"
                      disabled={scrollPosition >= (projectImages.length - 1) * 320}
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* Image Gallery */}
                    <div 
                      id="image-gallery"
                      className="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory"
                    >
                      {projectImages.map((image, index) => (
                        <div 
                          key={index}
                          className="relative flex-none w-72 h-48 rounded-lg overflow-hidden snap-start
                                   bg-background-tertiary dark:bg-background-tertiary-dark
                                   hover:ring-2 ring-primary dark:ring-primary-dark transition-all duration-300"
                        >
                          <Image
                            src={image}
                            alt={`Project preview ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className="hover:scale-110 transition-transform duration-300"
                          />
                          {/* Optional Image Caption */}
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 backdrop-blur-sm
                                      text-white text-xs opacity-0 hover:opacity-100 transition-opacity">
                            Project Screenshot {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Achievements Section */}
                <div>
                  <h4 className="text-lg font-medium text-text-primary dark:text-text-primary-dark mb-3">
                    Key Achievements
                  </h4>
                  <ul className="space-y-3">
                    {experience.achievements.map((achievement, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start gap-3"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-primary-dark mt-2 shrink-0" />
                        <span className="text-sm text-text-secondary dark:text-text-secondary-dark">
                          {achievement}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Skills/Technologies Section */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2">
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'PostgreSQL'].map((tech, index) => (
                        <span
                          key={index}
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
                </div>
              </div>

              {/* Certificate Link - Only shown if certificateUrl exists */}
              {experience.certificateUrl && (
                <div className="mt-6 pt-6 border-t border-border-primary dark:border-border-primary-dark">
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={experience.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary dark:text-primary-dark hover:underline"
                    >
                      <ExternalLink size={16} />
                      View Certificate
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TimelineInfo;