// File: src/contexts/ActivityLifecycleContext.tsx - BUAT BARU
// Core Activity Lifecycle Manager untuk Portfolio Performance Enhancement

'use client';

import React, { 
  createContext, 
  useContext, 
  useState, 
  useRef, 
  useEffect, 
  useCallback,
  ReactNode 
} from 'react';

// ===============================================================
// TYPES & INTERFACES
// ===============================================================

interface SectionResources {
  timers: Set<NodeJS.Timeout>;
  intervals: Set<NodeJS.Timer>;
  animationFrames: Set<number>;
  observers: Set<IntersectionObserver | ResizeObserver>;
  gsapTimelines: Set<any>;
  motionControls: Set<any>;
  eventListeners: Map<Element, Array<{ event: string; handler: EventListener }>>;
}

interface SectionActivity {
  sectionId: string;
  isActive: boolean;
  isVisible: boolean;
  isLoaded: boolean;
  lastActiveTime: number;
  resources: SectionResources;
  cleanupFunctions: Set<() => void>;
  suspendCallbacks: Set<() => void>;
  resumeCallbacks: Set<() => void>;
}

interface ActivityContextType {
  // State
  activeSectionId: string;
  visibleSections: Set<string>;
  loadedSections: Set<string>;
  
  // Section Management
  registerSection: (sectionId: string) => void;
  unregisterSection: (sectionId: string) => void;
  setActiveSection: (sectionId: string) => void;
  
  // Resource Management
  trackResource: (sectionId: string, type: keyof SectionResources, resource: any) => void;
  addCleanup: (sectionId: string, cleanup: () => void) => void;
  addSuspendCallback: (sectionId: string, callback: () => void) => void;
  addResumeCallback: (sectionId: string, callback: () => void) => void;
  
  // Utilities
  isActive: (sectionId: string) => boolean;
  isVisible: (sectionId: string) => boolean;
  isLoaded: (sectionId: string) => boolean;
  getActivityState: (sectionId: string) => SectionActivity | undefined;
  
  // Performance Metrics
  performanceMetrics: {
    activeTimers: number;
    activeIntervals: number;
    activeObservers: number;
    memoryUsage: number;
  };
}

// ===============================================================
// CONTEXT CREATION
// ===============================================================

const ActivityLifecycleContext = createContext<ActivityContextType | null>(null);

// ===============================================================
// MAIN PROVIDER COMPONENT
// ===============================================================

interface ActivityLifecycleProviderProps {
  children: ReactNode;
  debugMode?: boolean;
}

export const ActivityLifecycleProvider: React.FC<ActivityLifecycleProviderProps> = ({
  children,
  debugMode = process.env.NODE_ENV === 'development'
}) => {
  // Core States
  const [activeSectionId, setActiveSectionIdState] = useState<string>('home');
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['home']));
  const [loadedSections, setLoadedSections] = useState<Set<string>>(new Set(['home']));
  const [sections, setSections] = useState<Map<string, SectionActivity>>(new Map());
  
  // Performance Metrics
  const [performanceMetrics, setPerformanceMetrics] = useState({
    activeTimers: 0,
    activeIntervals: 0,
    activeObservers: 0,
    memoryUsage: 0
  });

  // Refs
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const performanceMonitorRef = useRef<NodeJS.Timer | null>(null);

  // ===============================================================
  // UTILITY FUNCTIONS
  // ===============================================================

  const createEmptyResources = (): SectionResources => ({
    timers: new Set(),
    intervals: new Set(),
    animationFrames: new Set(),
    observers: new Set(),
    gsapTimelines: new Set(),
    motionControls: new Set(),
    eventListeners: new Map()
  });

  const log = useCallback((message: string, ...args: any[]) => {
    if (debugMode) {
      console.log(`[ActivityLifecycle] ${message}`, ...args);
    }
  }, [debugMode]);

  // ===============================================================
  // RESOURCE CLEANUP FUNCTIONS
  // ===============================================================

  const cleanupSectionResources = useCallback((section: SectionActivity) => {
    log(`🧹 Cleaning up resources for section: ${section.sectionId}`);

    // Clear timers
    section.resources.timers.forEach(timer => {
      clearTimeout(timer);
      log(`  ⏰ Cleared timer`);
    });
    section.resources.timers.clear();

    // Clear intervals
    section.resources.intervals.forEach(interval => {
      clearInterval(interval);
      log(`  ⏰ Cleared interval`);
    });
    section.resources.intervals.clear();

    // Cancel animation frames
    section.resources.animationFrames.forEach(frame => {
      cancelAnimationFrame(frame);
      log(`  🎬 Cancelled animation frame`);
    });
    section.resources.animationFrames.clear();

    // Disconnect observers
    section.resources.observers.forEach(observer => {
      observer.disconnect();
      log(`  👁️ Disconnected observer`);
    });
    section.resources.observers.clear();

    // Pause GSAP timelines
    section.resources.gsapTimelines.forEach(timeline => {
      if (timeline && typeof timeline.pause === 'function') {
        timeline.pause();
        log(`  🎭 Paused GSAP timeline`);
      }
    });

    // Stop motion controls
    section.resources.motionControls.forEach(control => {
      if (control && typeof control.stop === 'function') {
        control.stop();
        log(`  🎯 Stopped motion control`);
      }
    });

    // Remove event listeners
    section.resources.eventListeners.forEach((listeners, element) => {
      listeners.forEach(({ event, handler }) => {
        element.removeEventListener(event, handler);
        log(`  🎧 Removed ${event} listener`);
      });
    });
    section.resources.eventListeners.clear();

    // Execute cleanup functions
    section.cleanupFunctions.forEach(cleanup => {
      try {
        cleanup();
        log(`  🔧 Executed cleanup function`);
      } catch (error) {
        console.warn(`Cleanup function failed for ${section.sectionId}:`, error);
      }
    });
    section.cleanupFunctions.clear();

    // Execute suspend callbacks
    section.suspendCallbacks.forEach(callback => {
      try {
        callback();
        log(`  ⏸️ Executed suspend callback`);
      } catch (error) {
        console.warn(`Suspend callback failed for ${section.sectionId}:`, error);
      }
    });
  }, [log]);

  const resumeSectionActivities = useCallback((section: SectionActivity) => {
    log(`▶️ Resuming activities for section: ${section.sectionId}`);

    // Resume GSAP timelines
    section.resources.gsapTimelines.forEach(timeline => {
      if (timeline && typeof timeline.play === 'function') {
        timeline.play();
        log(`  🎭 Resumed GSAP timeline`);
      }
    });

    // Execute resume callbacks
    section.resumeCallbacks.forEach(callback => {
      try {
        callback();
        log(`  ▶️ Executed resume callback`);
      } catch (error) {
        console.warn(`Resume callback failed for ${section.sectionId}:`, error);
      }
    });
  }, [log]);

  // ===============================================================
  // SECTION MANAGEMENT
  // ===============================================================

  const registerSection = useCallback((sectionId: string) => {
    log(`📝 Registering section: ${sectionId}`);
    
    setSections(prev => {
      if (prev.has(sectionId)) {
        log(`  ⚠️ Section ${sectionId} already registered`);
        return prev;
      }

      const newSection: SectionActivity = {
        sectionId,
        isActive: sectionId === activeSectionId,
        isVisible: visibleSections.has(sectionId),
        isLoaded: loadedSections.has(sectionId),
        lastActiveTime: Date.now(),
        resources: createEmptyResources(),
        cleanupFunctions: new Set(),
        suspendCallbacks: new Set(),
        resumeCallbacks: new Set()
      };

      const updated = new Map(prev);
      updated.set(sectionId, newSection);

      // Start observing if element exists
      const element = document.getElementById(sectionId);
      if (element && intersectionObserverRef.current) {
        intersectionObserverRef.current.observe(element);
        log(`  👁️ Started observing section element`);
      }

      return updated;
    });

    setLoadedSections(prev => new Set([...prev, sectionId]));
  }, [activeSectionId, visibleSections, loadedSections, log]);

  const unregisterSection = useCallback((sectionId: string) => {
    log(`🗑️ Unregistering section: ${sectionId}`);
    
    const section = sections.get(sectionId);
    if (section) {
      cleanupSectionResources(section);

      // Stop observing element
      const element = document.getElementById(sectionId);
      if (element && intersectionObserverRef.current) {
        intersectionObserverRef.current.unobserve(element);
        log(`  👁️ Stopped observing section element`);
      }

      setSections(prev => {
        const updated = new Map(prev);
        updated.delete(sectionId);
        return updated;
      });

      setLoadedSections(prev => {
        const updated = new Set(prev);
        updated.delete(sectionId);
        return updated;
      });

      setVisibleSections(prev => {
        const updated = new Set(prev);
        updated.delete(sectionId);
        return updated;
      });
    }
  }, [sections, cleanupSectionResources, log]);

  const setActiveSection = useCallback((sectionId: string) => {
    if (sectionId === activeSectionId) return;

    log(`🎯 Switching active section from ${activeSectionId} to ${sectionId}`);

    // Suspend current active section
    const currentSection = sections.get(activeSectionId);
    if (currentSection && currentSection.isActive) {
      currentSection.isActive = false;
      cleanupSectionResources(currentSection);
      log(`  🛑 Suspended section: ${activeSectionId}`);
    }

    // Suspend all other active sections (safety measure)
    sections.forEach((section, id) => {
      if (id !== sectionId && section.isActive) {
        section.isActive = false;
        cleanupSectionResources(section);
        log(`  🛑 Suspended background section: ${id}`);
      }
    });

    // Activate new section
    const newSection = sections.get(sectionId);
    if (newSection) {
      newSection.isActive = true;
      newSection.lastActiveTime = Date.now();
      resumeSectionActivities(newSection);
      log(`  ▶️ Activated section: ${sectionId}`);
    }

    setActiveSectionIdState(sectionId);
  }, [activeSectionId, sections, cleanupSectionResources, resumeSectionActivities, log]);

  // ===============================================================
  // RESOURCE TRACKING
  // ===============================================================

  const trackResource = useCallback((
    sectionId: string,
    type: keyof SectionResources,
    resource: any
  ) => {
    const section = sections.get(sectionId);
    if (section) {
      section.resources[type].add(resource);
      log(`📊 Tracked ${type} resource for section: ${sectionId}`);
    }
  }, [sections, log]);

  const addCleanup = useCallback((sectionId: string, cleanup: () => void) => {
    const section = sections.get(sectionId);
    if (section) {
      section.cleanupFunctions.add(cleanup);
      log(`🔧 Added cleanup function for section: ${sectionId}`);
    }
  }, [sections, log]);

  const addSuspendCallback = useCallback((sectionId: string, callback: () => void) => {
    const section = sections.get(sectionId);
    if (section) {
      section.suspendCallbacks.add(callback);
      log(`⏸️ Added suspend callback for section: ${sectionId}`);
    }
  }, [sections, log]);

  const addResumeCallback = useCallback((sectionId: string, callback: () => void) => {
    const section = sections.get(sectionId);
    if (section) {
      section.resumeCallbacks.add(callback);
      log(`▶️ Added resume callback for section: ${sectionId}`);
    }
  }, [sections, log]);

  // ===============================================================
  // UTILITY FUNCTIONS
  // ===============================================================

  const isActive = useCallback((sectionId: string) => {
    return activeSectionId === sectionId;
  }, [activeSectionId]);

  const isVisible = useCallback((sectionId: string) => {
    return visibleSections.has(sectionId);
  }, [visibleSections]);

  const isLoaded = useCallback((sectionId: string) => {
    return loadedSections.has(sectionId);
  }, [loadedSections]);

  const getActivityState = useCallback((sectionId: string) => {
    return sections.get(sectionId);
  }, [sections]);

  // ===============================================================
  // INTERSECTION OBSERVER SETUP
  // ===============================================================

  useEffect(() => {
    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        let mostVisibleSection = '';
        let maxRatio = 0;

        entries.forEach(entry => {
          const sectionId = entry.target.id;
          if (!sectionId) return;

          log(`👁️ Intersection change: ${sectionId} - ${entry.isIntersecting ? 'visible' : 'hidden'}`);

          // Update visibility
          setVisibleSections(prev => {
            const updated = new Set(prev);
            if (entry.isIntersecting) {
              updated.add(sectionId);
            } else {
              updated.delete(sectionId);
            }
            return updated;
          });

          // Update section visibility state
          setSections(prev => {
            const updated = new Map(prev);
            const section = updated.get(sectionId);
            if (section) {
              section.isVisible = entry.isIntersecting;
              updated.set(sectionId, section);
            }
            return updated;
          });

          // Find most visible section for focus
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleSection = sectionId;
          }
        });

        // Auto-focus most visible section
        if (mostVisibleSection && mostVisibleSection !== activeSectionId) {
          log(`🎯 Auto-focusing most visible section: ${mostVisibleSection}`);
          setActiveSection(mostVisibleSection);
        }
      },
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1.0],
        rootMargin: '-5% 0px'
      }
    );

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, [activeSectionId, setActiveSection, log]);

  // ===============================================================
  // PERFORMANCE MONITORING
  // ===============================================================

  useEffect(() => {
    if (!debugMode) return;

    performanceMonitorRef.current = setInterval(() => {
      let totalTimers = 0;
      let totalIntervals = 0;
      let totalObservers = 0;

      sections.forEach(section => {
        totalTimers += section.resources.timers.size;
        totalIntervals += section.resources.intervals.size;
        totalObservers += section.resources.observers.size;
      });

      const memory = (performance as any).memory;
      const memoryUsage = memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0;

      setPerformanceMetrics({
        activeTimers: totalTimers,
        activeIntervals: totalIntervals,
        activeObservers: totalObservers,
        memoryUsage
      });
    }, 2000);

    return () => {
      if (performanceMonitorRef.current) {
        clearInterval(performanceMonitorRef.current);
      }
    };
  }, [sections, debugMode]);

  // ===============================================================
  // CLEANUP ON UNMOUNT
  // ===============================================================

  useEffect(() => {
    return () => {
      log('🧹 Cleaning up all sections on unmount');
      sections.forEach(section => {
        cleanupSectionResources(section);
      });
      
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
      
      if (performanceMonitorRef.current) {
        clearInterval(performanceMonitorRef.current);
      }
    };
  }, [sections, cleanupSectionResources, log]);

  // ===============================================================
  // CONTEXT VALUE
  // ===============================================================

  const contextValue: ActivityContextType = {
    // State
    activeSectionId,
    visibleSections,
    loadedSections,
    
    // Section Management
    registerSection,
    unregisterSection,
    setActiveSection,
    
    // Resource Management
    trackResource,
    addCleanup,
    addSuspendCallback,
    addResumeCallback,
    
    // Utilities
    isActive,
    isVisible,
    isLoaded,
    getActivityState,
    
    // Performance Metrics
    performanceMetrics
  };

  return (
    <ActivityLifecycleContext.Provider value={contextValue}>
      {children}
    </ActivityLifecycleContext.Provider>
  );
};

// ===============================================================
// CUSTOM HOOK
// ===============================================================

export const useActivityLifecycle = (): ActivityContextType => {
  const context = useContext(ActivityLifecycleContext);
  if (!context) {
    throw new Error('useActivityLifecycle must be used within ActivityLifecycleProvider');
  }
  return context;
};

// ===============================================================
// ACTIVITY-AWARE HOOKS
// ===============================================================

// Enhanced useEffect that only runs when section is active
export const useActiveEffect = (
  effect: () => (() => void) | void,
  deps: React.DependencyList,
  sectionId: string
) => {
  const { isActive, addCleanup } = useActivityLifecycle();
  
  React.useEffect(() => {
    if (!isActive(sectionId)) {
      return; // Skip effect if section is not active
    }

    const cleanup = effect();
    
    if (cleanup) {
      addCleanup(sectionId, cleanup);
    }

    return cleanup;
  }, [isActive(sectionId), ...deps]);
};

// Enhanced setTimeout that auto-manages with activity lifecycle
export const useActiveTimeout = (
  callback: () => void,
  delay: number | null,
  sectionId: string
) => {
  const { isActive, trackResource } = useActivityLifecycle();
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    if (!isActive(sectionId) || delay === null) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      if (isActive(sectionId)) {
        callback();
      }
    }, delay);

    trackResource(sectionId, 'timers', timeoutRef.current);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isActive(sectionId), delay, callback, sectionId, trackResource]);

  return timeoutRef.current;
};

// Enhanced setInterval that auto-manages with activity lifecycle
export const useActiveInterval = (
  callback: () => void,
  delay: number | null,
  sectionId: string
) => {
  const { isActive, trackResource } = useActivityLifecycle();
  const intervalRef = React.useRef<NodeJS.Timer>();

  React.useEffect(() => {
    if (!isActive(sectionId) || delay === null) {
      return;
    }

    intervalRef.current = setInterval(() => {
      if (isActive(sectionId)) {
        callback();
      }
    }, delay);

    trackResource(sectionId, 'intervals', intervalRef.current);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive(sectionId), delay, callback, sectionId, trackResource]);

  return intervalRef.current;
};

// Enhanced IntersectionObserver that integrates with activity lifecycle
export const useActiveIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit,
  sectionId: string
) => {
  const { isActive, trackResource } = useActivityLifecycle();
  const observerRef = React.useRef<IntersectionObserver>();

  const observe = React.useCallback((element: Element) => {
    if (!isActive(sectionId)) return;

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(callback, options);
      trackResource(sectionId, 'observers', observerRef.current);
    }

    observerRef.current.observe(element);
  }, [isActive(sectionId), callback, options, sectionId, trackResource]);

  const unobserve = React.useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element);
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { observe, unobserve, observer: observerRef.current };
};

export default ActivityLifecycleProvider;