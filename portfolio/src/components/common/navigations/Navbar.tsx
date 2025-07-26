"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Instagram } from 'lucide-react';
import MenuButton from '@/components/common/buttons/MenuButton';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { config } from '@/config';

const Navbar = () => {
  const { site } = config;
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const updateLayout = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = 100;
      const progress = Math.min(scrollPosition / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = site.navigation.links;
  const toggleMenu = () => setIsOpen(!isOpen);

  const backgroundColor = `rgba(var(--color-background-primary), ${scrollProgress * 0.95})`;
  const backdropBlur = `blur(${scrollProgress * 8}px)`;

  return (
    <motion.nav 
      className="fixed w-full z-50 py-4 lg:py-6"
      style={{
        backgroundColor,
        backdropFilter: backdropBlur,
        borderBottom: scrollProgress > 0 ? '1px solid rgba(var(--color-border-primary), 0.1)' : 'none'
      }}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center relative">
          <ThemeToggle />
          
          <div className="flex items-center">
            {!isMobile && (
              <div className="flex items-center space-x-6 lg:space-x-8">
                {menuItems.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    className="text-text-primary dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark transition-colors text-sm lg:text-base font-medium"
                  >
                    {item.title}
                  </a>
                ))}
                
                <div className="flex items-center space-x-4 lg:space-x-6">
                  <a 
                    href={site.social.linkedin} 
                    className="text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a 
                    href={site.social.instagram} 
                    className="text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>

                <motion.a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 lg:px-6 py-2 bg-primary dark:bg-primary-dark text-background-primary dark:text-background-primary-dark 
                           rounded-lg hover:bg-primary-dark dark:hover:bg-primary transition-colors text-sm lg:text-base font-medium 
                           whitespace-nowrap min-w-[120px] lg:min-w-[140px]"
                >
                  Let's Connect
                </motion.a>
              </div>
            )}

            {isMobile && (
              <MenuButton 
                isOpen={isOpen} 
                toggle={toggleMenu}
                className="text-text-primary dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
              />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative"
          >
            <motion.div 
              className="bg-background-secondary/70 dark:bg-background-secondary-dark/70 border-t border-gray-800/50 backdrop-blur-md"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col items-end space-y-4">
                  {menuItems.map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      className="text-text-primary dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark text-base font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </a>
                  ))}
                  
                  <div className="flex space-x-6 pt-2">
                    <a 
                      href={site.social.linkedin} 
                      className="text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a 
                      href={site.social.instagram}
                      className="text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  </div>
                  
                </div>
              </div>
            </motion.div>
            <div 
              className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-b from-transparent to-background-primary/30 dark:to-background-primary-dark/30 backdrop-blur-lg"
              style={{
                transform: 'translateY(100%)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;