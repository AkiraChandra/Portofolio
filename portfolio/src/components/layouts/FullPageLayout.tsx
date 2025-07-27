// src/components/layouts/FullPageLayout.tsx

'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Navbar from '@/components/common/navigations/Navbar';
import Hero from '@/components/sections/Hero/Hero';
import Projects from '@/components/sections/Projects/Projects';
import Experience from '@/components/sections/Experience';
import { Certifications } from '@/components/sections/Certifications';
import { motion } from 'framer-motion';
import { useSectionDetection } from '@/hooks/common/useSectionDetection';

const SECTIONS = [
  { id: 'home', path: '/', component: 'hero' },
  { id: 'projects', path: '/projects', component: 'projects' },
  { id: 'experience', path: '/experience', component: 'experience' },
  { id: 'certifications', path: '/certifications', component: 'certifications' },
];

export default function FullPageLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Use the enhanced section detection hook
  const { activeSection, setIsScrolling } = useSectionDetection(scrollContainerRef);

  // Scroll to correct section based on pathname (navbar navigation)
  useEffect(() => {
    const currentSection = SECTIONS.find(section => section.path === pathname);
    if (currentSection && scrollContainerRef.current) {
      const sectionElement = document.getElementById(currentSection.id);
      
      if (sectionElement) {
        setIsScrolling(true);
        
        sectionElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        // Reset scroll lock after animation
        setTimeout(() => {
          setIsScrolling(false);
        }, 1000);
      }
    }
  }, [pathname, setIsScrolling]);

  // Handle navbar clicks - smooth scroll to section
  const handleNavigation = (targetPath: string) => {
    const targetSection = SECTIONS.find(section => section.path === targetPath);
    
    if (targetSection) {
      const sectionElement = document.getElementById(targetSection.id);
      
      if (sectionElement) {
        setIsScrolling(true);
        
        // Update URL immediately
        router.replace(targetPath);
        
        // Smooth scroll to section
        sectionElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        // Reset scroll lock
        setTimeout(() => {
          setIsScrolling(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar onNavigate={handleNavigation} />
      
      {/* Main scroll container with all sections */}
      <div 
        ref={scrollContainerRef}
        className="h-screen overflow-y-auto snap-y snap-mandatory"
      >
        
        {/* Hero Section */}
        <motion.section 
          id="home" 
          className="snap-start h-screen w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Hero />
        </motion.section>
        
        {/* Projects Section */}
        <motion.section 
          id="projects"
          className="snap-start h-screen w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          <Projects />
        </motion.section>
        
        {/* Experience Section */}
        <motion.section 
          id="experience"
          className="snap-start min-h-screen w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          <Experience />
        </motion.section>
        
        {/* Certifications Section */}
        <motion.section 
          id="certifications"
          className="snap-start min-h-screen w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          <Certifications />
        </motion.section>
        
      </div>

      {/* Section Indicators */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40">
        <div className="flex flex-col gap-3">
          {SECTIONS.map((section) => {
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => handleNavigation(section.path)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-primary dark:bg-primary-dark scale-125'
                    : 'bg-gray-400/50 dark:bg-gray-600/50 hover:bg-gray-600 dark:hover:bg-gray-400'
                }`}
                aria-label={`Go to ${section.id}`}
              />
            );
          })}
        </div>
      </div>

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-20 left-4 bg-black/80 text-white p-2 rounded text-xs z-50">
          <div>Active: {activeSection}</div>
          <div>Path: {pathname}</div>
        </div>
      )}
    </div>
  );
}