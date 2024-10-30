'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Linkedin, Instagram } from 'lucide-react';
import MenuButton from '@/components/common/buttons/MenuButton';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { config } from '@/config';

const Navbar = () => {
  const { site, theme, animations } = config;
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle viewport size changes
  useEffect(() => {
    const updateLayout = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  // Handle scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = site.navigation.links;
  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants: Variants = {
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        ...animations.transitions.default,
        ease: "easeOut"
      }
    },
    hidden: {
      x: 100,
      opacity: 0,
      transition: {
        ...animations.transitions.fast,
        ease: "easeIn"
      }
    }
  };

  const mobileMenuVariants: Variants = animations.menu.mobile;
  const menuItemVariants: Variants = animations.menu.item;

  const shouldShowFullMenu = !isMobile && !isScrolled;
  const shouldShowHamburger = isMobile || isScrolled;

  return (
    <motion.nav 
      className="fixed w-full z-50 py-4 sm:py-6 transition-colors duration-300"
      style={{
        backgroundColor: isScrolled ? 'rgb(var(--color-background-primary))' : 'transparent'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center relative">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          <div className="flex items-center">
            {/* Full Menu */}
            <AnimatePresence mode="wait">
              {shouldShowFullMenu && (
                <motion.div
                  key="full-menu"
                  variants={menuVariants}
                  initial="visible"
                  animate="visible"
                  exit="hidden"
                  className="flex items-center space-x-8 sm:space-x-10"
                >
                  {menuItems.map((item) => (
                    <motion.a
                      key={item.title}
                      href={item.href}
                      className="text-gray-300 hover:text-yellow-400 transition-colors text-base sm:text-lg font-medium"
                    >
                      {item.title}
                    </motion.a>
                  ))}
                  
                  <div className="flex items-center space-x-6">
                    <a 
                      href={site.social.linkedin} 
                      className="text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                    </a>
                    <a 
                      href={site.social.instagram} 
                      className="text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                    </a>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-6 sm:px-8 py-2 sm:py-3 border-2 border-white text-gray-100 rounded-lg hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-colors text-base sm:text-lg font-medium whitespace-nowrap"
                  >
                    Let's Connect
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hamburger Menu Button */}
            <AnimatePresence mode="wait">
              {shouldShowHamburger && (
                <motion.div
                  key="hamburger"
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="flex justify-end"
                >
                  <MenuButton 
                    isOpen={isOpen} 
                    toggle={toggleMenu}
                    className="text-gray-200 hover:text-yellow-400 transition-colors"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && shouldShowHamburger && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="bg-background-secondary dark:bg-background-secondary-dark border-t border-gray-800/50"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col items-end space-y-4">
                {menuItems.map((item) => (
                  <motion.a
                    key={item.title}
                    href={item.href}
                    variants={menuItemVariants}
                    className="text-text-primary dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </motion.a>
                ))}
                
                <motion.div 
                  variants={menuItemVariants}
                  className="flex space-x-6 pt-2"
                >
                  <a 
                    href={site.social.linkedin} 
                    className="text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a 
                    href={site.social.instagram}
                    className="text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                </motion.div>
                
                <motion.button
                  variants={menuItemVariants}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-primary dark:bg-primary-dark text-background-primary dark:text-background-primary-dark rounded-lg hover:bg-primary-dark dark:hover:bg-primary transition-colors text-lg font-medium mt-2"
                >
                  Let's Connect
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;