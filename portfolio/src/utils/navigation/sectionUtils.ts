// src/utils/navigation/sectionUtils.ts

export interface SectionConfig {
  id: string;
  path: string;
  title: string;
  href: string;
}

// Section configuration that matches the config
export const SECTIONS: SectionConfig[] = [
  {
    id: 'home',
    path: '/',
    title: 'Home',
    href: '#home'
  },
  {
    id: 'projects',
    path: '/projects',
    title: 'Projects',
    href: '#projects'
  },
  {
    id: 'experience',
    path: '/experience',
    title: 'Experience',
    href: '#experience'
  },
  {
    id: 'certifications',
    path: '/certifications',
    title: 'Certifications',
    href: '#certifications'
  }
];

/**
 * Get section config by ID
 */
export const getSectionById = (id: string): SectionConfig | undefined => {
  return SECTIONS.find(section => section.id === id);
};

/**
 * Get section config by path
 */
export const getSectionByPath = (path: string): SectionConfig | undefined => {
  return SECTIONS.find(section => section.path === path);
};

/**
 * Get next section in sequence
 */
export const getNextSection = (currentId: string): SectionConfig | undefined => {
  const currentIndex = SECTIONS.findIndex(section => section.id === currentId);
  if (currentIndex === -1 || currentIndex === SECTIONS.length - 1) {
    return undefined;
  }
  return SECTIONS[currentIndex + 1];
};

/**
 * Get previous section in sequence
 */
export const getPreviousSection = (currentId: string): SectionConfig | undefined => {
  const currentIndex = SECTIONS.findIndex(section => section.id === currentId);
  if (currentIndex <= 0) {
    return undefined;
  }
  return SECTIONS[currentIndex - 1];
};

/**
 * Smooth scroll to section with options
 */
export interface ScrollToSectionOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
  offset?: number;
}

export const scrollToSection = (
  sectionId: string, 
  options: ScrollToSectionOptions = {}
): boolean => {
  const { 
    behavior = 'smooth', 
    block = 'start', 
    inline = 'nearest',
    offset = 0 
  } = options;

  const element = document.getElementById(sectionId);
  if (!element) {
    console.warn(`Section with id "${sectionId}" not found`);
    return false;
  }

  if (offset !== 0) {
    // Custom scroll with offset
    const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementTop + offset;

    window.scrollTo({
      top: offsetPosition,
      behavior
    });
  } else {
    // Standard scroll
    element.scrollIntoView({
      behavior,
      block,
      inline
    });
  }

  return true;
};

/**
 * Check if section is currently in viewport
 */
export const isSectionInViewport = (
  sectionId: string, 
  threshold: number = 0.5
): boolean => {
  const element = document.getElementById(sectionId);
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  
  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const elementHeight = rect.height;
  
  return (visibleHeight / elementHeight) >= threshold;
};

/**
 * Get current active section based on scroll position
 */
export const getCurrentActiveSection = (threshold: number = 0.5): string | null => {
  for (const section of SECTIONS) {
    if (isSectionInViewport(section.id, threshold)) {
      return section.id;
    }
  }
  return null;
};

/**
 * Create section observer for intersection detection
 */
export const createSectionObserver = (
  callback: (sectionId: string, isIntersecting: boolean) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.5,
    rootMargin: '-20% 0px -20% 0px',
    ...options
  };

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        callback(entry.target.id, entry.isIntersecting);
      });
    },
    defaultOptions
  );
};

/**
 * Debounce utility for scroll events
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle utility for scroll events
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};