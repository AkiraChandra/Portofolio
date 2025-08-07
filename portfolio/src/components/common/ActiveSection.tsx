// File: src/components/common/ActiveSection.tsx - BUAT BARU
// ActiveSection wrapper component untuk automatic section registration dan management

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useActivityLifecycle } from '@/contexts/ActivityLifecycleContext';

// ===============================================================
// INTERFACES
// ===============================================================

interface ActiveSectionProps {
  sectionId: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
  lazy?: boolean;
  preload?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

// ===============================================================
// DEFAULT FALLBACK COMPONENT
// ===============================================================

const DefaultFallback: React.FC<{ sectionId: string }> = ({ sectionId }) => (
  <div className="min-h-screen flex items-center justify-center bg-background-primary dark:bg-background-primary-dark">
    <div className="text-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 dark:border-primary-dark/20 rounded-full"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-primary dark:border-primary-dark border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark">
          Loading {sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}
        </h3>
        <p className="text-text-secondary dark:text-text-secondary-dark">
          Preparing your experience...
        </p>
      </div>
      
      {/* Loading animation dots */}
      <div className="flex justify-center space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary dark:bg-primary-dark rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

// ===============================================================
// MAIN COMPONENT
// ===============================================================

const ActiveSection: React.FC<ActiveSectionProps> = ({
  sectionId,
  children,
  className = '',
  style = {},
  fallback,
  lazy = true,
  preload = false,
  priority = 'medium'
}) => {
  // Activity Lifecycle hooks
  const {
    registerSection,
    unregisterSection,
    isActive,
    isVisible,
    isLoaded,
    performanceMetrics
  } = useActivityLifecycle();

  // Local state
  const [isRegistered, setIsRegistered] = useState(false);
  const [shouldRender, setShouldRender] = useState(!lazy || preload);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  
  // Refs
  const sectionRef = useRef<HTMLElement>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout>();

  // ===============================================================
  // SECTION REGISTRATION
  // ===============================================================

  useEffect(() => {
    // Register section with activity lifecycle
    registerSection(sectionId);
    setIsRegistered(true);

    // Cleanup on unmount
    return () => {
      unregisterSection(sectionId);
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [sectionId, registerSection, unregisterSection]);

  // ===============================================================
  // LAZY LOADING LOGIC
  // ===============================================================

  useEffect(() => {
    if (!lazy || shouldRender) return;

    // Determine when to load content based on visibility and priority
    const shouldLoad = 
      isVisible(sectionId) || 
      isActive(sectionId) || 
      (priority === 'high' && isLoaded(sectionId));

    if (shouldLoad) {
      // Add small delay for smooth loading
      loadTimeoutRef.current = setTimeout(() => {
        setShouldRender(true);
      }, priority === 'high' ? 0 : 100);
    }

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [
    lazy, 
    shouldRender, 
    isVisible, 
    isActive, 
    isLoaded, 
    sectionId, 
    priority
  ]);

  // ===============================================================
  // CONTENT LOADED TRACKING
  // ===============================================================

  useEffect(() => {
    if (shouldRender && !isContentLoaded) {
      const timer = setTimeout(() => {
        setIsContentLoaded(true);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [shouldRender, isContentLoaded]);

  // ===============================================================
  // RENDER LOGIC
  // ===============================================================

  // Show fallback if not registered yet
  if (!isRegistered) {
    return (
      <section
        id={sectionId}
        className={`active-section-loading ${className}`}
        style={style}
      >
        {fallback || <DefaultFallback sectionId={sectionId} />}
      </section>
    );
  }

  // Show fallback if lazy loading and content not ready
  if (lazy && !shouldRender) {
    return (
      <section
        id={sectionId}
        ref={sectionRef}
        className={`active-section-lazy ${className}`}
        style={style}
        data-section-id={sectionId}
        data-priority={priority}
      >
        {fallback || <DefaultFallback sectionId={sectionId} />}
      </section>
    );
  }

  // Render main content
  return (
    <motion.section
      id={sectionId}
      ref={sectionRef}
      className={`
        active-section
        ${isActive(sectionId) ? 'section-active' : 'section-inactive'}
        ${isVisible(sectionId) ? 'section-visible' : 'section-hidden'}
        ${className}
      `}
      style={{
        ...style,
        contain: 'layout style paint',
      }}
      data-section-id={sectionId}
      data-priority={priority}
      data-active={isActive(sectionId)}
      data-visible={isVisible(sectionId)}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isVisible(sectionId) ? 1 : 0.3,
      }}
      transition={{ 
        duration: 0.4,
        ease: "easeOut"
      }}
    >
      {/* Content wrapper with loading state */}
      <motion.div
        className="h-full w-full relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isContentLoaded ? 1 : 0,
          y: isContentLoaded ? 0 : 20
        }}
        transition={{ 
          duration: 0.3,
          ease: "easeOut",
          delay: 0.1
        }}
      >
        {children}
      </motion.div>

      {/* Loading overlay for smooth transitions */}
      {!isContentLoaded && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-background-primary/80 dark:bg-background-primary-dark/80 backdrop-blur-sm"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          onAnimationComplete={() => setIsContentLoaded(true)}
        >
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary/30 dark:border-primary-dark/30 border-t-primary dark:border-t-primary-dark rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
              Loading content...
            </p>
          </div>
        </motion.div>
      )}

      {/* Performance indicator (development only) */}
      {process.env.NODE_ENV === 'development' && isActive(sectionId) && (
        <SectionPerformanceIndicator 
          sectionId={sectionId}
          metrics={performanceMetrics}
        />
      )}
    </motion.section>
  );
};

// ===============================================================
// SECTION PERFORMANCE INDICATOR
// ===============================================================

interface SectionPerformanceIndicatorProps {
  sectionId: string;
  metrics: {
    activeTimers: number;
    activeIntervals: number;
    activeObservers: number;
    memoryUsage: number;
  };
}

const SectionPerformanceIndicator: React.FC<SectionPerformanceIndicatorProps> = ({
  sectionId,
  metrics
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="fixed top-4 right-4 bg-black/90 text-white px-3 py-2 rounded-lg text-xs font-mono z-50 border border-white/20"
  >
    <div className="space-y-1">
      <div className="text-yellow-400 font-bold">
        {sectionId.toUpperCase()} - ACTIVE
      </div>
      <div className="flex space-x-4 text-xs">
        <span className="text-green-400">
          T:{metrics.activeTimers}
        </span>
        <span className="text-blue-400">
          I:{metrics.activeIntervals}
        </span>
        <span className="text-purple-400">
          O:{metrics.activeObservers}
        </span>
        <span className="text-orange-400">
          M:{metrics.memoryUsage}MB
        </span>
      </div>
    </div>
  </motion.div>
);

// ===============================================================
// EXPORT
// ===============================================================

export default ActiveSection;

// Additional utility exports
export { DefaultFallback, SectionPerformanceIndicator };