// src/lib/animations/profile.animations.ts
export const profileAnimations = {
    container: (fromLeft: boolean) => ({
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
          delay: 3
        }
      }
    }),
    wave: {
      initial: { 
        opacity: 0, 
        scale: 1 
      },
      animate: {
        scale: [1, 1.3, 1.3],
        opacity: [0.5, 0, 0],
      }
    }
  };