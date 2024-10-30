// src/components/common/buttons/MenuButton.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/theme/useTheme';

interface MenuButtonProps {
  isOpen: boolean;
  toggle: () => void;
  className?: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({ isOpen, toggle, className = '' }) => {
  const { theme } = useTheme();

  const variant = {
    opened: {
      backgroundColor: 'rgb(var(--color-background-secondary))',
    },
    closed: {
      backgroundColor: 'rgb(var(--color-background-secondary))',
    },
  };

  const topVariant = {
    opened: {
      rotate: 45,
      translateY: 6,
    },
    closed: {
      rotate: 0,
      translateY: 0,
    },
  };

  const centerVariant = {
    opened: {
      opacity: 0,
      width: 0,
    },
    closed: {
      opacity: 1,
      width: "24px",
    },
  };

  const bottomVariant = {
    opened: {
      rotate: -45,
      translateY: -6,
    },
    closed: {
      rotate: 0,
      translateY: 0,
    },
  };

  return (
    <motion.button
      className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${className}`}
      onClick={toggle}
      animate={isOpen ? 'opened' : 'closed'}
      initial="closed"
      variants={variant}
      transition={{ duration: 0.3 }}
      aria-label="Menu"
    >
      <div className="relative w-6 h-5 flex flex-col justify-center items-center">
        <motion.span
          className="absolute top-0 w-6 h-0.5 bg-text-primary dark:bg-text-primary-dark rounded-full transition-colors duration-300"
          variants={topVariant}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="absolute w-6 h-0.5 bg-text-primary dark:bg-text-primary-dark rounded-full transition-colors duration-300"
          variants={centerVariant}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="absolute bottom-0 w-6 h-0.5 bg-text-primary dark:bg-text-primary-dark rounded-full transition-colors duration-300"
          variants={bottomVariant}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.button>
  );
};

export default MenuButton;