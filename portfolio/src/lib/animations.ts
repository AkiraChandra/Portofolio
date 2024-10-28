import { delay, Variants } from "framer-motion";

export const slideInFromRight = {
  initial: { x: 100, rotate: 0, opacity: 0 },
  animate: { 
    x: 0,
    rotate: [-10, 0],
    opacity: 1,
    transition: {
      x: { duration: 0.8, ease: "easeOut" },
      rotate: { duration: 0.3, delay: 0.8 },
      opacity: { duration: 0.5 }
    }
  }
};
  
export const bounceEffect = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

export const mobileMenuVariants = {
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.4,
      ease: "easeInOut",
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};
  
export const menuItemVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  closed: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

// Hero Section Animations
export const heroLeftContentVariants = {
  hidden: { 
    x: -100,
    opacity: 0 
  },
  visible: { 
    x: 0,
    opacity: 1,
    transition: {
      duration: 3,
      ease: "easeOut",
      delay: 0.5,
      // staggerChildren: 0.8
    }
  }
};

export const heroRightContentVariants = {
  hidden: { 
    x: 100,
    opacity: 0 
  },
  visible: { 
    x: 0,
    opacity: 1,
    transition: {
      duration: 4,
      ease: "easeOut",
      delay: 0.5
    }
  }
};

export const heroChildVariants = {
  hidden: { 
    x: -20,
    opacity: 0 
  },
  visible: { 
    x: 0,
    opacity: 1
  }
};

export const astronautFloatVariants = {
  animate: {
    y: [-15, 0, -15],
    rotate: [-3, 3, -3],
  },
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut",
  }
};

export const scrollIndicatorVariants = {
  initial: { 
    opacity: 0 
  },
  animate: { 
    opacity: 1,
    transition: { 
      delay: 1 
    }
  }
};

export const scrollArrowVariants = {
  animate: {
    y: [0, 8, 0],
  },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut",
  }
};

export const getProfileContainerVariants = (fromLeft: boolean): Variants => ({
  initial: {
    x: fromLeft ? -200 : 200,
    opacity: 0,
    scale: 0.5,
    rotate: fromLeft ? -180 : 180,
  },
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 1.2,
      ease: [0.68, -0.6, 0.32, 1.6],
      opacity: { duration: 0.3, delay: 3 },
      scale: {
        duration: 0.8,
        ease: "easeOut",
        delay: 3,
      },
      rotate: {
        duration: 1,
        ease: "easeOut",
        delay: 2.9,
      },
      delay: 3
    },
  },
});

export const profileWaveVariants: Variants = {
  initial: { 
    opacity: 0, 
    scale: 1 
  },
  animate: {
    scale: [1, 1.3, 1.3],
    opacity: [0.5, 0, 0],
  },
};

export const profileWaveTransition = (delay: number = 0) => ({
  duration: 2.5,
  repeat: Infinity,
  delay: 3 + delay,
  ease: "easeOut",
  times: [0, 0.8, 1],
  repeatDelay: 0.5,
  repeatType: "loop" as const,
});

export const profileRingVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { 
      delay: 3.5,
      duration: 0.5 
    },
  },
};

export const profileGradientVariants: Variants = {
  initial: { x: "-100%" },
  animate: {
    x: ["200%"],
  },
};

export const profileGradientTransition = {
  duration: 3,
  repeat: Infinity,
  ease: "linear",
  repeatType: "loop" as const,
  delay: 3.5,
};

export const profileHoverVariants: Variants = {
  initial: { rotate: 0 }, // Changed from false to an object with initial state
  hover: {
    rotate: [0, -5, 5, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut",
      times: [0, 0.3, 0.6, 3]
    }
  }
};