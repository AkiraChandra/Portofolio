export const animationConfig = {
    transitions: {
      default: {
        duration: 0.3,
        ease: 'easeInOut'
      },
      slow: {
        duration: 0.6,
        ease: 'easeInOut'
      },
      fast: {
        duration: 0.15,
        ease: 'easeInOut'
      }
    },
    variants: {
      fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 }
      },
      slideIn: {
        initial: { x: -20, opacity: 0 },
        animate: { x: 0, opacity: 1 }
      }
    }
  };