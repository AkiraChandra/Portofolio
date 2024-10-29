export const heroAnimations = {
    leftContent: {
      hidden: { 
        x: -300,
        opacity: 0 
      },
      visible: { 
        x: 0,
        opacity: 1,
        transition: {
          duration: 4,
          ease: "easeOut",
          delay: 0.1
        }
      }
    },
    rightContent: {
      hidden: { 
        x: 600,
        opacity: 0 
      },
      visible: { 
        x: 0,
        opacity: 1,
        transition: {
          duration: 4,
          ease: "easeOut",
          delay: 0.1
        }
      }
    }
  };
  