// src/components/transitions/PageTransition.tsx

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
  currentSection: 'home' | 'projects' | 'experience' | 'certifications';
}

const SECTIONS = ['home', 'projects', 'experience', 'certifications'];

const getTransitionDirection = (currentPath: string, previousPath?: string) => {
  if (!previousPath) return { y: 0 };
  
  const currentIndex = SECTIONS.findIndex(section => {
    return currentPath.includes(section === 'home' ? '/' : `/${section}`);
  });
  
  const previousIndex = SECTIONS.findIndex(section => {
    return previousPath.includes(section === 'home' ? '/' : `/${section}`);
  });
  
  // Scroll down (next section)
  if (currentIndex > previousIndex) {
    return { y: 100 }; // Come from bottom
  }
  // Scroll up (previous section)
  else if (currentIndex < previousIndex) {
    return { y: -100 }; // Come from top
  }
  
  return { y: 0 };
};

export default function PageTransition({ children, currentSection }: PageTransitionProps) {
  const pathname = usePathname();
  const [previousPath, setPreviousPath] = React.useState<string>('');
  
  React.useEffect(() => {
    setPreviousPath(pathname);
  }, [pathname]);
  
  const direction = getTransitionDirection(pathname, previousPath);
  
  return (
    <motion.div
      key={pathname}
      initial={{ 
        opacity: 0, 
        y: `${direction.y}vh`,
        scale: 0.95
      }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: 1
      }}
      exit={{ 
        opacity: 0, 
        y: `${-direction.y}vh`,
        scale: 0.95
      }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.25, 0, 1], // Custom easing for smooth feel
        opacity: { duration: 0.6 },
        scale: { duration: 0.8 }
      }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
