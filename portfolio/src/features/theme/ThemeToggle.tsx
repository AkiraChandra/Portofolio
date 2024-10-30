// src/features/theme/ThemeToggle.tsx

'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/theme/useTheme';
import themeConfig from '@/config/theme.config';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { colors } = themeConfig;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors"
      style={{
        backgroundColor: theme === 'dark' ? colors.background.dark.secondary : colors.background.light.secondary,
        color: theme === 'dark' ? colors.text.dark.primary : colors.text.light.primary,
      }}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </motion.button>
  );
};