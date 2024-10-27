
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