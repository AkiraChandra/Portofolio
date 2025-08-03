// src/components/sections/Experience/animation.ts
export const timelineVariants = {
  container: {
    hidden: { 
      opacity: 0 
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // was 0.2
        delayChildren: 0.1     // was 0.3
      }
    }
  },

  point: {
    hidden: { 
      scale: 0,
      opacity: 0 
    },
    visible: { 
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  },

  info: {
    hidden: { 
      x: 50,
      opacity: 0 
    },
    visible: { 
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
        // ❌ REMOVED: type: 'spring', stiffness: 100, damping: 20
      }
    },
    exit: {
      x: -50,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: 'easeIn'
      }
    }
  },

  line: {
    hidden: { 
      scaleY: 0,
      opacity: 0 
    },
    visible: { 
      scaleY: 1,
      opacity: 1,
      transition: {
        // ✅ PERFORMANCE FIX: Reduce duration for faster animation
        duration: 0.5, // was 0.8
        ease: 'easeOut'
      }
    }
  },

  achievement: {
    hidden: { 
      x: -20,
      opacity: 0 
    },
    visible: { 
      x: 0,
      opacity: 1,
      transition: {
        // ✅ PERFORMANCE FIX: Add simple ease transition
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  }
};

// ✅ PERFORMANCE FIX: Add optimized hover animations
export const timelineHoverVariants = {
  point: {
    initial: { scale: 1 },
    hover: {
      scale: 1.05, // was 1.1 - reduced for lighter animation
      transition: {
        duration: 0.2,
        ease: 'easeOut'
        // ❌ REMOVED: expensive spring with stiffness: 400
      }
    }
  }
};

// ✅ PERFORMANCE FIX: Simplified skill animation
export const skillVariants = {
  hidden: {
    opacity: 0,
    y: 10
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};