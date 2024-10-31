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
      instagram: "https://instagram.com/akirachandra",
    },
    navigation: {
      links: [
        { title: "Home", href: "#home" },
        { title: "Skills", href: "#skills" },
        { title: "Experience", href: "#experience" },
        { title: "Projects", href: "#projects" },
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

    profile: {
      container: (fromLeft: boolean): Variants => ({
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
            delay: 3,
          },
        },
      }),
      wave: {
        variants: {
          initial: {
            opacity: 0,
            scale: 1,
          },
          animate: {
            scale: [1, 1.3, 1.3],
            opacity: [0.5, 0.1, 0],
          },
        },
        transition: (delay: number = 0) => ({
          duration: 2.5,
          repeat: Infinity,
          delay: 3 + delay,
          ease: "easeOut",
          times: [0, 0.8, 1],
          repeatDelay: 0.5,
          repeatType: "loop" as const,
        }),
      },
      ring: {
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: {
            delay: 3.5,
            duration: 0.5,
          },
        },
      },
      gradient: {
        variants: {
          initial: { x: "-100%" },
          animate: {
            x: ["200%"],
          },
        },
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop" as const,
          delay: 3.5,
        },
      },
      hover: {
        initial: { rotate: 0 },
        hover: {
          rotate: [0, -5, 5, 0],
          transition: {
            duration: 0.6,
            ease: "easeInOut",
            times: [0, 0.3, 0.6, 3],
          },
        },
      },
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
