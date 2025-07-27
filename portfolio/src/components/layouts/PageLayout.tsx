// src/components/layouts/PageLayout.tsx (ENHANCED VERSION)
'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/common/navigations/Navbar';
import Hero from '@/components/sections/Hero/Hero';
import Projects from '@/components/sections/Projects/Projects';
import Experience from '@/components/sections/Experience';
import Certifications from '@/components/sections/Certifications/Certifications';
import { useSmoothScroll } from '@/hooks/common/useSmoothScroll';

interface PageLayoutProps {
  defaultSection?: 'home' | 'projects' | 'experience' | 'certifications';
}

const SECTIONS = [
  { id: 'home', path: '/' },
  { id: 'projects', path: '/projects' },
  { id: 'experience', path: '/experience' },
  { id: 'certifications', path: '/certifications' },
];

export default function PageLayout({ defaultSection = 'home' }: PageLayoutProps) {
  const isScrolling = useSmoothScroll(0.3);

  // Enhanced auto scroll logic with multiple attempts
  useEffect(() => {
    if (defaultSection !== 'home') {
      const scrollToSection = (attempt = 0) => {
        const targetSection = document.getElementById(defaultSection);
        if (targetSection) {
          // For experience section with overflow content, use different scroll behavior
          if (defaultSection === 'experience') {
            // Get the scroll container
            const scrollContainer = document.querySelector('.h-screen.overflow-y-auto') as HTMLElement;
            if (scrollContainer) {
              // Calculate the exact scroll position for experience section
              const rect = targetSection.getBoundingClientRect();
              const containerRect = scrollContainer.getBoundingClientRect();
              const currentScrollTop = scrollContainer.scrollTop;
              
              // Calculate target scroll position (top of experience section)
              const targetScrollTop = currentScrollTop + rect.top - containerRect.top;
              
              // Smooth scroll to the calculated position
              scrollContainer.scrollTo({
                top: targetScrollTop,
                behavior: 'smooth'
              });
            }
          } else {
            // For other sections, use normal scroll behavior
            targetSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        } else if (attempt < 5) {
          // Retry if element not found (DOM might not be ready)
          setTimeout(() => scrollToSection(attempt + 1), 100 * (attempt + 1));
        }
      };

      // Initial attempt with delay
      const timer = setTimeout(() => scrollToSection(), 100);
      return () => clearTimeout(timer);
    }
  }, [defaultSection]);

  // URL updates saat scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            const section = SECTIONS.find(s => s.id === sectionId);
            
            if (section) {
              window.history.replaceState(null, '', section.path);
            }
          }
        });
      },
      {
        threshold: 0.3, // Reduced threshold for better detection of overflow sections
        rootMargin: '-10% 0px -10% 0px', // Adjusted margin for better experience detection
      }
    );

    setTimeout(() => {
      SECTIONS.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          observer.observe(element);
        }
      });
    }, 100);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      
      <div className="h-screen overflow-y-auto snap-y snap-mandatory">
        
        {/* Hero Section */}
        <section id="home" className="snap-start h-screen w-full">
          <Hero />
        </section>
        
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
        
        {/* Experience Section - Enhanced snap behavior for overflow content */}
        <motion.section 
          id="experience"
          className="snap-start min-h-screen w-full"
          style={{
            // Add specific scroll margin for better positioning on reload
            scrollMarginTop: '0px',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always'
          }}
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
    </main>
  );
}