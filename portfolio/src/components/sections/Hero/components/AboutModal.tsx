// src/components/sections/Hero/components/AboutModal.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Code, Coffee, Heart } from 'lucide-react';
import { config } from '@/config';
import { useMediaQuery } from '@/hooks/common/useMediaQuery';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close modal on Escape key press
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.3
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delay: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className={`relative w-full mx-4 ${
              isMobile 
                ? 'max-w-sm max-h-[85vh]' 
                : isTablet 
                ? 'max-w-lg max-h-[80vh]' 
                : 'max-w-2xl max-h-[75vh]'
            }`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Content */}
            <div className="bg-background-secondary/95 dark:bg-background-secondary-dark/95 
                          backdrop-blur-lg rounded-2xl border border-border-primary/30 dark:border-border-primary-dark/30 
                          shadow-2xl overflow-hidden">
              
              {/* Header */}
              <div className="relative p-6 pb-4 border-b border-border-primary/20 dark:border-border-primary-dark/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-yellow-400 dark:from-primary-dark dark:to-yellow-400 
                                  rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark">
                        About Me
                      </h2>
                      <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                        Get to know me better
                      </p>
                    </div>
                  </div>
                  
                  {/* Close Button */}
                  <motion.button
                    onClick={onClose}
                    className="p-2 rounded-lg bg-background-tertiary/50 dark:bg-background-tertiary-dark/50 
                             hover:bg-background-tertiary dark:hover:bg-background-tertiary-dark 
                             text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark
                             transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Scrollable Content */}
              <motion.div
                className={`${
                  isMobile ? 'max-h-[60vh]' : isTablet ? 'max-h-[55vh]' : 'max-h-[50vh]'
                } overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 dark:scrollbar-thumb-primary-dark/30 
                           scrollbar-track-transparent px-6 py-4`}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="space-y-6">
                  {/* Introduction */}
                  <motion.div variants={itemVariants} className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-primary dark:bg-primary-dark rounded-full"></div>
                      <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
                        Hello There! 👋
                      </h3>
                    </div>
                    <p className="text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                      I'm <span className="font-semibold text-primary dark:text-primary-dark">Akira Chandra</span>, 
                      currently working as a Junior Programmer at Bina Nusantara IT Division while pursuing my studies in Information Systems 
                      at Bina Nusantara University, where I am now in my fifth semester. I am passionate about 
                      <span className="font-medium text-text-primary dark:text-text-primary-dark"> coding, system analysis, and UI/UX design</span>, 
                      and I am dedicated to enhancing both my hard and soft skills through various experiences and projects beyond my academic curriculum.
                    </p>
                  </motion.div>

                  {/* Current Role & Skills */}
                  <motion.div variants={itemVariants} className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Code className="w-4 h-4 text-primary dark:text-primary-dark" />
                      <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
                        What I Do
                      </h3>
                    </div>
                    <p className="text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                      As a Junior Programmer in the Software Solution Group 1 (SSG1), I work on various projects related to web development, 
                      both Front-End and Back-End, using <span className="font-medium text-text-primary dark:text-text-primary-dark">
                      ASP.NET, JavaScript, and Kotlin for Android development</span>. I also have hands-on experience with 
                      <span className="font-medium text-text-primary dark:text-text-primary-dark"> CI/CD pipelines through Microsoft Azure DevOps services</span>, 
                      expanding my knowledge in modern development practices.
                    </p>
                  </motion.div>

                  {/* Academic & Competitive Spirit */}
                  <motion.div variants={itemVariants} className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
                        Academic Excellence & Competition
                      </h3>
                    </div>
                    <p className="text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                      While pursuing my degree, I prioritize maintaining strong academic performance, consistently striving for excellence in my coursework. 
                      I enjoy participating in competitions such as <span className="font-medium text-text-primary dark:text-text-primary-dark">
                      business case challenges, UI/UX contests, and hackathons</span>, which allow me to apply my skills in real-world scenarios 
                      and collaborate with peers. I'm also a finalist in the Ignite Mini Case Challenge 2024.
                    </p>
                  </motion.div>

                  {/* Leadership & Community */}
                  <motion.div variants={itemVariants} className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="w-4 h-4 text-red-500" />
                      <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
                        Leadership & Community Impact
                      </h3>
                    </div>
                    <p className="text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                      I have a wealth of experiences, including my time as an activist in the <span className="font-medium text-text-primary dark:text-text-primary-dark">
                      Bina Nusantara Computer Club (BNCC)</span>, which helped me develop my leadership and teamwork skills. 
                      My experiences as a <span className="font-medium text-text-primary dark:text-text-primary-dark">Freshmen Leader and Freshmen Partner</span> 
                      have allowed me to guide new students in adapting to university life, enhancing my communication and mentoring abilities.
                    </p>
                  </motion.div>

                  {/* Tech Journey & Growth */}
                  <motion.div variants={itemVariants} className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Coffee className="w-4 h-4 text-amber-600" />
                      <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
                        Continuous Learning Journey
                      </h3>
                    </div>
                    <p className="text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                      My journey started with the Algorithm Bootcamp and progressed through various intensive training programs, 
                      including the AMJS 2024 Bootcamp where I worked on challenging projects like CRUD-based web warehouses, 
                      React applications, and mobile apps. I have experience with <span className="font-medium text-text-primary dark:text-text-primary-dark">
                      Java, C++, Laravel, React Native, and SQL</span>, always seeking opportunities for growth and learning.
                    </p>
                  </motion.div>

                  {/* Call to Action */}
                  <motion.div 
                    variants={itemVariants} 
                    className="bg-gradient-to-r from-primary/5 to-yellow-400/5 dark:from-primary-dark/5 dark:to-yellow-400/5 
                             rounded-xl p-4 border border-primary/20 dark:border-primary-dark/20"
                  >
                    <p className="text-text-primary dark:text-text-primary-dark font-medium text-center">
                      I am committed to leveraging my technical expertise to make a positive impact in the tech industry 
                      while continuously seeking opportunities for growth and learning.
                      <br />
                      <span className="text-primary dark:text-primary-dark">Let's connect and explore potential collaborations!</span>
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Footer */}
              <div className="p-6 pt-4 border-t border-border-primary/20 dark:border-border-primary-dark/20">
                <motion.div 
                  className="flex justify-center"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.a
                    href={config.site.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-yellow-400 
                             dark:from-primary-dark dark:to-yellow-400 text-white rounded-lg 
                             hover:shadow-lg hover:shadow-primary/25 dark:hover:shadow-primary-dark/25 
                             transition-all duration-300 font-medium"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Let's Connect</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AboutModal;