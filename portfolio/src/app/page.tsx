// src/app/page.tsx (Back to original with simple routing)
'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Navbar from '@/components/common/navigations/Navbar';
import Hero from '@/components/sections/Hero/Hero';
import Projects from '@/components/sections/Projects/Projects';
import { useSmoothScroll } from '@/hooks/common/useSmoothScroll';
import Experience from '@/components/sections/Experience';
import { motion } from 'framer-motion';
import { Certifications } from '@/components/sections/Certifications';

export default function Home() {
  const isScrolling = useSmoothScroll(0.3);
  const router = useRouter();

  // Simple URL updates saat scroll - hanya update, tidak navigate
  useEffect(() => {
    const sections = [
      { id: 'home', path: '/' },
      { id: 'projects', path: '/projects' },
      { id: 'experience', path: '/experience' },
      { id: 'certifications', path: '/certifications' },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            const section = sections.find(s => s.id === sectionId);
            
            if (section) {
              // Cuma update URL tanpa navigate
              window.history.replaceState(null, '', section.path);
            }
          }
        });
      },
      {
        threshold: 0.5, // Lowered threshold for better detection
        rootMargin: '-20% 0px -20% 0px',
      }
    );

    // Add delay to ensure DOM is ready
    setTimeout(() => {
      sections.forEach(section => {
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
      
      {/* Container dengan scroll yang proper */}
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
    </main>
  );
}