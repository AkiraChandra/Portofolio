// src/components/common/buttons/Button.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/theme/useTheme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const { theme } = useTheme();

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-primary dark:bg-primary-dark text-background-primary dark:text-background-primary-dark hover:bg-primary-dark dark:hover:bg-primary',
    secondary: 'bg-background-secondary dark:bg-background-secondary-dark text-text-primary dark:text-text-primary-dark hover:bg-background-tertiary dark:hover:bg-background-tertiary-dark',
    outline: 'border border-text-primary/20 dark:border-text-primary-dark/20 text-primary dark:text-primary-dark hover:bg-background-secondary dark:hover:bg-background-secondary-dark'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-colors duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  );
};

export default Button;