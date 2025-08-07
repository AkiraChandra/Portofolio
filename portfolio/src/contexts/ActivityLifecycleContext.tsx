// File: src/contexts/ActivityLifecycleContext.tsx - FINAL FIX FOR INFINITE LOOPS
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
  intervals: Set<NodeJS.Timeout>;
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

  // Refs for stable operations
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const performanceMonitorRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);
  const registeredSectionsRef = useRef<Set<string>>(new Set());

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

    try {
      // Clear timers
      section.resources.timers.forEach(timer => {
        clearTimeout(timer);
      });
      section.resources.timers.clear();

      // Clear intervals
      section.resources.intervals.forEach(interval => {
        clearTimeout(interval);
      });
      section.resources.intervals.clear();

      // Cancel animation frames
      section.resources.animationFrames.forEach(frame => {
        cancelAnimationFrame(frame);
      });
      section.resources.animationFrames.clear();

      // Disconnect observers
      section.resources.observers.forEach(observer => {
        observer.disconnect();
      });
      section.resources.observers.clear();

      // Pause GSAP timelines
      section.resources.gsapTimelines.forEach(timeline => {
        if (timeline && typeof timeline.pause === 'function') {
          timeline.pause();
        }
      });

      // Stop motion controls
      section.resources.motionControls.forEach(control => {
        if (control && typeof control.stop === 'function') {
          control.stop();
        }
      });

      // Remove event listeners
      section.resources.eventListeners.forEach((listeners, element) => {
        listeners.forEach(({ event, handler }) => {
          element.removeEventListener(event, handler);
        });
      });
      section.resources.eventListeners.clear();

      // Execute cleanup functions
      section.cleanupFunctions.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          console.warn(`Cleanup function failed for ${section.sectionId}:`, error);
        }
      });
      section.cleanupFunctions.clear();

      // Execute suspend callbacks
      section.suspendCallbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.warn(`Suspend callback failed for ${section.sectionId}:`, error);
        }
      });

    } catch (error) {
      console.error(`Error cleaning up section ${section.sectionId}:`, error);
    }
  }, [log]);

  const resumeSectionActivities = useCallback((section: SectionActivity) => {
    log(`▶️ Resuming activities for section: ${section.sectionId}`);

    try {
      // Resume GSAP timelines
      section.resources.gsapTimelines.forEach(timeline => {
        if (timeline && typeof timeline.play === 'function') {
          timeline.play();
        }
      });

      // Execute resume callbacks
      section.resumeCallbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.warn(`Resume callback failed for ${section.sectionId}:`, error);
        }
      });
    } catch (error) {
      console.error(`Error resuming section ${section.sectionId}:`, error);
    }
  }, [log]);

  // ===============================================================
  // SECTION MANAGEMENT - FIXED TO PREVENT DUPLICATE REGISTRATIONS
  // ===============================================================

  const registerSection = useCallback((sectionId: string) => {
    // CRITICAL FIX: Prevent duplicate registrations
    if (registeredSectionsRef.current.has(sectionId)) {
      log(`⚠️ Section ${sectionId} already registered, skipping`);
      return;
    }

    log(`📝 Registering section: ${sectionId}`);
    registeredSectionsRef.current.add(sectionId);
    
    setSections(prev => {
      if (prev.has(sectionId)) {
        return prev; // Already exists, don't update
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
      return updated;
    });

    setLoadedSections(prev => new Set([...prev, sectionId]));

    // Observe element after a delay to ensure DOM is ready
    requestAnimationFrame(() => {
      const element = document.getElementById(sectionId);
      if (element && intersectionObserverRef.current) {
        try {
          intersectionObserverRef.current.observe(element);
          log(`  👁️ Started observing section element: ${sectionId}`);
        } catch (error) {
          console.warn(`Failed to observe element ${sectionId}:`, error);
        }
      }
    });
  }, [activeSectionId, visibleSections, loadedSections, log]);

  const unregisterSection = useCallback((sectionId: string) => {
    if (!registeredSectionsRef.current.has(sectionId)) {
      return; // Not registered, skip
    }

    log(`🗑️ Unregistering section: ${sectionId}`);
    registeredSectionsRef.current.delete(sectionId);
    
    setSections(prev => {
      const section = prev.get(sectionId);
      if (section) {
        cleanupSectionResources(section);
      }

      // Stop observing element
      const element = document.getElementById(sectionId);
      if (element && intersectionObserverRef.current) {
        try {
          intersectionObserverRef.current.unobserve(element);
          log(`  👁️ Stopped observing section element: ${sectionId}`);
        } catch (error) {
          console.warn(`Failed to unobserve element ${sectionId}:`, error);
        }
      }

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
  }, [cleanupSectionResources, log]);

  const setActiveSection = useCallback((sectionId: string) => {
    if (sectionId === activeSectionId) return;

    log(`🎯 Switching active section from ${activeSectionId} to ${sectionId}`);

    setSections(prev => {
      const updated = new Map(prev);

      // Suspend current active section
      const currentSection = updated.get(activeSectionId);
      if (currentSection && currentSection.isActive) {
        currentSection.isActive = false;
        cleanupSectionResources(currentSection);
        log(`  🛑 Suspended section: ${activeSectionId}`);
      }

      // Suspend all other active sections
      updated.forEach((section, id) => {
        if (id !== sectionId && section.isActive) {
          section.isActive = false;
          cleanupSectionResources(section);
          log(`  🛑 Suspended background section: ${id}`);
        }
      });

      // Activate new section
      const newSection = updated.get(sectionId);
      if (newSection) {
        newSection.isActive = true;
        newSection.lastActiveTime = Date.now();
        resumeSectionActivities(newSection);
        log(`  ▶️ Activated section: ${sectionId}`);
      }

      return updated;
    });

    setActiveSectionIdState(sectionId);
  }, [activeSectionId, cleanupSectionResources, resumeSectionActivities, log]);

  // ===============================================================
  // RESOURCE TRACKING
  // ===============================================================

  const trackResource = useCallback((
    sectionId: string,
    type: keyof SectionResources,
    resource: any
  ) => {
    setSections(prev => {
      const updated = new Map(prev);
      const section = updated.get(sectionId);
      if (section) {
        if (type === 'eventListeners') {
          console.warn('Use addEventListenerResource for event listeners');
          return prev;
        }
        
        (section.resources[type] as Set<any>).add(resource);
        log(`📊 Tracked ${type} resource for section: ${sectionId}`);
      }
      return updated;
    });
  }, [log]);

  const addCleanup = useCallback((sectionId: string, cleanup: () => void) => {
    setSections(prev => {
      const updated = new Map(prev);
      const section = updated.get(sectionId);
      if (section) {
        section.cleanupFunctions.add(cleanup);
        log(`🔧 Added cleanup function for section: ${sectionId}`);
      }
      return updated;
    });
  }, [log]);

  const addSuspendCallback = useCallback((sectionId: string, callback: () => void) => {
    setSections(prev => {
      const updated = new Map(prev);
      const section = updated.get(sectionId);
      if (section) {
        section.suspendCallbacks.add(callback);
        log(`⏸️ Added suspend callback for section: ${sectionId}`);
      }
      return updated;
    });
  }, [log]);

  const addResumeCallback = useCallback((sectionId: string, callback: () => void) => {
    setSections(prev => {
      const updated = new Map(prev);
      const section = updated.get(sectionId);
      if (section) {
        section.resumeCallbacks.add(callback);
        log(`▶️ Added resume callback for section: ${sectionId}`);
      }
      return updated;
    });
  }, [log]);

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
  // INTERSECTION OBSERVER SETUP - ONE TIME ONLY
  // ===============================================================

  useEffect(() => {
    if (isInitializedRef.current) return; // Prevent multiple initializations
    
    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        let mostVisibleSection = '';
        let maxRatio = 0;

        entries.forEach(entry => {
          const sectionId = entry.target.id;
          if (!sectionId) return;

          // Throttle logging
          if (Math.random() < 0.1) { // Only log 10% of intersection changes
            log(`👁️ Intersection: ${sectionId} - ${entry.isIntersecting ? 'visible' : 'hidden'}`);
          }

          // Update visibility state
          setVisibleSections(prev => {
            const updated = new Set(prev);
            if (entry.isIntersecting) {
              updated.add(sectionId);
            } else {
              updated.delete(sectionId);
            }
            return updated;
          });

          // Find most visible section
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleSection = sectionId;
          }
        });

        // Auto-focus most visible section (throttled)
        if (mostVisibleSection && mostVisibleSection !== activeSectionId) {
          // Throttle section switching to prevent rapid changes
          requestAnimationFrame(() => {
            setActiveSection(mostVisibleSection);
          });
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1.0],
        rootMargin: '-10% 0px'
      }
    );

    isInitializedRef.current = true;

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, []); // Empty dependency array - only run once

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
    }, 3000); // Increased interval to reduce overhead

    return () => {
      if (performanceMonitorRef.current) {
        clearInterval(performanceMonitorRef.current);
      }
    };
  }, [debugMode, sections]);

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

      // Clear registration tracking
      registeredSectionsRef.current.clear();
      isInitializedRef.current = false;
    };
  }, []); // Empty dependency to prevent re-runs

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
// ACTIVITY-AWARE HOOKS - STABLE VERSIONS
// ===============================================================

export const useActiveEffect = (
  effect: () => (() => void) | void,
  deps: React.DependencyList,
  sectionId: string
) => {
  const { isActive, addCleanup } = useActivityLifecycle();
  
  React.useEffect(() => {
    if (!isActive(sectionId)) {
      return;
    }

    const cleanup = effect();
    
    if (cleanup) {
      addCleanup(sectionId, cleanup);
    }

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive(sectionId), sectionId, ...deps]);
};

export const useActiveTimeout = (
  callback: () => void,
  delay: number | null,
  sectionId: string
) => {
  const { isActive, trackResource } = useActivityLifecycle();
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (!isActive(sectionId) || delay === null) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      if (isActive(sectionId)) {
        callbackRef.current();
      }
    }, delay);

    trackResource(sectionId, 'timers', timeoutRef.current);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isActive(sectionId), delay, sectionId, trackResource]);

  return timeoutRef.current;
};

export const useActiveInterval = (
  callback: () => void,
  delay: number | null,
  sectionId: string
) => {
  const { isActive, trackResource } = useActivityLifecycle();
  const intervalRef = React.useRef<NodeJS.Timeout>();
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (!isActive(sectionId) || delay === null) {
      return;
    }

    intervalRef.current = setInterval(() => {
      if (isActive(sectionId)) {
        callbackRef.current();
      }
    }, delay);

    trackResource(sectionId, 'intervals', intervalRef.current);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive(sectionId), delay, sectionId, trackResource]);

  return intervalRef.current;
};

export const useActiveIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit,
  sectionId: string
) => {
  const { isActive, trackResource } = useActivityLifecycle();
  const observerRef = React.useRef<IntersectionObserver>();
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const observe = React.useCallback((element: Element) => {
    if (!isActive(sectionId)) return;

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(callbackRef.current, options);
      trackResource(sectionId, 'observers', observerRef.current);
    }

    observerRef.current.observe(element);
  }, [isActive(sectionId), options, sectionId, trackResource]);

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