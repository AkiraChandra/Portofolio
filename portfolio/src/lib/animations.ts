
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