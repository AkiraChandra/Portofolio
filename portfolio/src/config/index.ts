// src/config/index.ts
import { Variants } from "framer-motion";

export const config = {
  site: {
    title: "My Portfolio",
    description:
      "Passionate about creating beautiful, functional, and user-centered digital experiences. Specializing in modern web technologies and creative solutions.",
    author: "Akira Chandra",
    social: {
      github: "https://github.com/akirachandra",
      linkedin: "https://linkedin.com/in/akirachandra",
      instagram:
        "https://www.instagram.com/akira_chd?igsh=MTB1aWdnYmljdWt3aw%3D%3D&utm_source=qr",
    },
    navigation: {
      links: [
        { title: "Home", href: "#home", path: "/" },
        { title: "Projects", href: "#projects", path: "/projects" },
        { title: "Experience", href: "#experience", path: "/experience" },
        {
          title: "Certifications",
          href: "#certifications",
          path: "/certifications",
        },
        { title: "Skills", href: "#skills", path: "/skills" },
      ],
    },
  },

  theme: {
    colors: {
      primary: {
        light: "#F3EB00",
        dark: "#F6B00D",
      },
      background: {
        light: "#ffffff",
        dark: "#17082f",
        base: "#0a0a0a",
      },
      text: {
        light: "#171717",
        dark: "#ededed",
      },
      glow: {
        light: "rgba(243, 235, 0, 0.7)",
        dark: "rgba(246, 176, 13, 0.7)",
      },
    },
    effects: {
      glow: {
        outer: "rgba(2, 50, 126, 0.05)",
        middle: "rgba(132, 0, 255, 0.08)",
        inner: "rgba(96, 165, 250, 0.1)",
      },
      textShadow: {
        sm: "0 0 2px var(--glow-text), 0 0 4px var(--glow-text), 0 0 6px var(--glow-text)",
        md: "0 0 3px var(--glow-text), 0 0 8px var(--glow-text), 0 0 15px var(--glow-text)",
        lg: "0 0 5px var(--glow-text), 0 0 20px var(--glow-text), 0 0 25px var(--glow-text)",
      },
    },
  },

  animations: {
    transitions: {
      default: {
        duration: 0.3,
        ease: "easeInOut",
      },
      slow: {
        duration: 0.6,
        ease: "easeInOut",
      },
      fast: {
        duration: 0.15,
        ease: "easeInOut",
      },
    },

    effects: {
      slideInFromRight: {
        initial: { x: 100, rotate: 0, opacity: 0 },
        animate: {
          x: 0,
          rotate: [-10, 0],
          opacity: 1,
          transition: {
            x: { duration: 0.8, ease: "easeOut" },
            rotate: { duration: 0.3, delay: 0.8 },
            opacity: { duration: 0.5 },
          },
        },
      },
      bounce: {
        initial: { scale: 1 },
        hover: {
          scale: 1.05,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 10,
          },
        },
      },
    },

    menu: {
      mobile: {
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
      },
      item: {
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
      },
    },

    hero: {
      leftContent: {
        hidden: {
          x: -300,
          opacity: 0,
        },
        visible: {
          x: 0,
          opacity: 1,
          transition: {
            duration: 4,
            ease: "easeOut",
            delay: 0.1,
          },
        },
      },
      rightContent: {
        hidden: {
          x: 600,
          opacity: 0,
        },
        visible: {
          x: 0,
          opacity: 1,
          transition: {
            duration: 4,
            ease: "easeOut",
            delay: 0.1,
          },
        },
      },
      child: {
        hidden: {
          x: -20,
          opacity: 0,
        },
        visible: {
          x: 0,
          opacity: 1,
        },
      },
    },

    astronaut: {
      float: {
        animate: {
          y: [-15, 0, -15],
          rotate: [-3, 3, -3],
        },
        transition: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    },

    scroll: {
      indicator: {
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: { delay: 1 },
        },
      },
      arrow: {
        animate: {
          y: [0, 8, 0],
        },
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    },
    // Add to existing animations object
    timeline: {
      point: {
        initial: { scale: 1 },
        hover: {
          scale: 1.1,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 10,
          },
        },
      },
      info: {
        initial: {
          opacity: 0,
          x: 20,
          scale: 0.95,
        },
        animate: {
          opacity: 1,
          x: 0,
          scale: 1,
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        },
        exit: {
          opacity: 0,
          x: -20,
          scale: 0.95,
          transition: {
            duration: 0.2,
            ease: "easeIn",
          },
        },
      },
    },
    profile: {
      // 🚀 MAIN CONTAINER ANIMATION - Cinema Quality
      container: (fromLeft: boolean): Variants => ({
        initial: {
          x: fromLeft ? -350 : 350,    // More dramatic distance
          y: fromLeft ? -100 : 100,    // Arc trajectory  
          opacity: 0,
          scale: 0.2,                  // Start tiny for impact
          rotate: fromLeft ? -60 : 60, // More rotation for drama
          filter: "blur(15px)",        // Heavy blur start
          transformOrigin: "center",
        },
        animate: {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          rotate: 0,
          filter: "blur(0px)",
          transition: {
            // 🎭 CINEMATIC TIMING - Hollywood-grade smoothness
            duration: 2.2,              // Longer for epic feel
            ease: [0.16, 1, 0.3, 1],    // Apple's signature easing
            
            // 🎪 CHOREOGRAPHED SEQUENCE
            opacity: {
              duration: 1.5,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.2
            },
            scale: {
              duration: 2.0,
              ease: [0.34, 1.56, 0.64, 1],  // Slight overshoot
              delay: 0.3
            },
            rotate: {
              duration: 1.8,
              ease: [0.23, 1, 0.32, 1],     // Smooth settle
              delay: 0.25
            },
            filter: {
              duration: 1.3,
              ease: "easeOut",
              delay: 0.4
            },
            x: {
              duration: 2.2,
              ease: [0.16, 1, 0.3, 1],      // Perfect deceleration
            },
            y: {
              duration: 2.0,
              ease: [0.19, 1, 0.22, 1],     // Gentle arc landing
            },
            delay: 0.6  // Wait for page setup
          },
        },
      }),

      // 🌟 ENHANCED HOVER STATES
      hover: {
        initial: {
          y: 0,
          scale: 1,
          rotate: 0,
          filter: "brightness(1) saturate(1)"
        },
        animate: {
          y: -12,                           // More lift
          scale: 1.08,                      // Bigger scale
          rotate: 3,                        // Playful tilt
          filter: "brightness(1.1) saturate(1.2)", // Enhanced colors
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 25,
            mass: 0.8
          }
        }
      },

      // 💫 FLOATING RING ANIMATION
      ring: {
        initial: {
          scale: 0.7,
          opacity: 0,
          rotate: 0
        },
        animate: {
          scale: 1,
          opacity: 0.8,
          rotate: 360,
          transition: {
            scale: {
              duration: 1.8,
              ease: "easeOut",
              delay: 1.2
            },
            opacity: {
              duration: 1.2,
              ease: "easeOut",
              delay: 1.2
            },
            rotate: {
              duration: 25,      // Slow rotation
              repeat: Infinity,
              ease: "linear",
              delay: 2.5
            }
          }
        }
      },

      // 🔮 GLOW EFFECT ANIMATION
      glow: {
        initial: {
          opacity: 0,
          scale: 0.8
        },
        animate: {
          opacity: [0, 0.6, 0.4, 0.7, 0.5], // Breathing effect
          scale: [0.8, 1.1, 0.9, 1.2, 1.0],
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }
        }
      },

      // ✨ PARTICLE SYSTEM
      particles: {
        initial: {
          y: 0,
          opacity: 0,
          scale: 0
        },
        animate: {
          y: [-8, -20, -8],
          opacity: [0, 1, 0],
          scale: [0, 1.2, 0],
          transition: {
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.4, 1]  // Control animation timing points
          }
        }
      }
    },
  },
  projects: {
    planetAnimations: {
      container: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
          },
        },
      },
      item: {
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
        },
      },
    },
    previewAnimations: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.5 },
    },
  },
  star: {
    size: {
      width: 20,
      height: 20,
    },
    position: {
      top: "-8px",
      right: "0",
    },
    effects: {
      glow: "drop-shadow(0 0 3px #fff)",
      opacity: 0.75,
      rotate: "-45deg",
    },
    trail: {
      width: "50px",
      height: "1px",
      gradient: "linear-gradient(90deg, transparent, #ffffff, transparent)",
    },
    animation: {
      duration: "3s",
      delay: 0.8,
      fadeInDuration: "5%",
      fadeOutStart: "90%",
      keyframes: {
        "0%": {
          transform: "translateX(-100px) translateY(100px) rotate(-45deg)",
          opacity: 0,
        },
        "15%": {
          opacity: 0.5,
        },
        "85%": {
          opacity: 0.5,
        },
        "100%": {
          transform: "translateX(200px) translateY(-200px) rotate(-45deg)",
          opacity: 0,
        },
      },
    },
  },
};

// CSS Variables type for TypeScript
export interface CSSVariables {
  "--background": string;
  "--foreground": string;
  "--glow-text": string;
  "--glow-outer": string;
  "--glow-middle": string;
  "--glow-inner": string;
}

export type Config = typeof config;

// Helper function untuk mendapatkan CSS variables
export const getCssVariables = (isDark: boolean = false): CSSVariables => ({
  "--background": isDark
    ? config.theme.colors.background.dark
    : config.theme.colors.background.light,
  "--foreground": isDark
    ? config.theme.colors.text.dark
    : config.theme.colors.text.light,
  "--glow-text": isDark
    ? config.theme.colors.glow.dark
    : config.theme.colors.glow.light,
  "--glow-outer": config.theme.effects.glow.outer,
  "--glow-middle": config.theme.effects.glow.middle,
  "--glow-inner": config.theme.effects.glow.inner,
});

export const getGlowColor = (isDark: boolean) => {
  return isDark
    ? "rgba(246, 176, 13, var(--glow-opacity))"
    : "rgba(243, 235, 0, var(--glow-opacity))";
};

export const getProgressGradient = (isDark: boolean) => {
  return isDark
    ? "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary))"
    : "linear-gradient(90deg, var(--color-primary), var(--color-primary-dark))";
};
