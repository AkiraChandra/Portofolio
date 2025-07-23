import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/theme/useTheme';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="p-2 md:p-2.5 rounded-lg bg-background-tertiary dark:bg-background-tertiary-dark
                  text-text-primary dark:text-text-primary-dark transition-all duration-300
                  hover:ring-2 hover:ring-primary dark:hover:ring-primary-dark
                  backdrop-blur-sm fixed md:relative top-4 left-4 md:top-0 md:left-0
                  shadow-lg md:shadow-none"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 md:w-5 md:h-5" />
        ) : (
          <Moon className="w-4 h-4 md:w-5 md:h-5" />
        )}
      </motion.button>
    </div>
  );
};

export default ThemeToggle;