import { Variants } from 'framer-motion';

export const timelineVariants = {
  container: {
    hidden: { 
      opacity: 0 
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
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
        type: 'spring',
        stiffness: 260,
        damping: 20
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
        type: 'spring',
        stiffness: 100,
        damping: 20
      }
    },
    exit: {
      x: -50,
      opacity: 0,
      transition: {
        duration: 0.2
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
        duration: 0.8,
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
      opacity: 1
    }
  },

  glow: {
    initial: { 
      opacity: 0.3 
    },
    animate: {
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }
} as const;

export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: 'easeIn'
    }
  }
};

export const floatingAnimation = {
  y: {
    duration: 2.5,
    repeat: Infinity,
    ease: 'easeInOut',
    repeatType: 'reverse' as const,
    values: [0, -10, 0]
  },
  rotate: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut',
    repeatType: 'reverse' as const,
    values: [0, -3, 0, 3, 0]
  }
};