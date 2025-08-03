// src/components/common/navigations/Navbar.tsx (Updated - No Blur/Transparent)
"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Instagram } from 'lucide-react';
import { usePathname } from 'next/navigation';
import MenuButton from '@/components/common/buttons/MenuButton';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { config } from '@/config';

interface NavbarProps {
  onNavigate?: (path: string) => void;
}

const Navbar = ({ onNavigate }: NavbarProps = {}) => {
  const { site } = config;
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const updateLayout = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  // Simple scroll detection for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('.h-screen.overflow-y-auto') as HTMLElement;
      if (scrollContainer) {
        setIsScrolled(scrollContainer.scrollTop > 0);
      } else {
        setIsScrolled(window.scrollY > 0);
      }
    };

    const scrollContainer = document.querySelector('.h-screen.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const menuItems = site.navigation.links;
  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavClick = (item: typeof menuItems[0], e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (onNavigate) {
      onNavigate(item.path);
    } else {
      const sectionId = item.href.replace('#', '');
      const section = document.getElementById(sectionId);
      
      if (section) {
        section.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  };

  return (
    <motion.nav 
      className="fixed w-full z-50 py-4 lg:py-6"
      style={{
        backgroundColor: isScrolled 
          ? 'rgba(var(--color-background-primary), 0.95)' 
          : 'rgba(var(--color-background-primary), 0.0)',
        borderBottom: isScrolled ? 
          '1px solid rgba(var(--color-border-primary), 0.1)' : 'none'
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center relative">
          <ThemeToggle />
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center space-x-6 lg:space-x-8">
              {menuItems.map((item, index) => {
                const isActive = pathname === item.path;
                
                return (
                  <motion.button
                    key={item.title}
                    onClick={(e) => handleNavClick(item, e)}
                    className={`
                      relative text-sm lg:text-base font-medium transition-all duration-300 cursor-pointer
                      ${isActive 
                        ? 'text-primary dark:text-primary-dark' 
                        : 'text-text-primary dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {item.title}
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary dark:bg-primary-dark rounded-full"
                        layoutId="navbar-indicator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                );
              })}
              
              <div className="flex items-center space-x-4 lg:space-x-6">
                <motion.a 
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
                <motion.a 
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Instagram className="w-5 h-5" />
                </motion.a>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 lg:px-8 lg:py-3 bg-primary dark:bg-primary-dark text-background-primary dark:text-background-primary-dark 
                         rounded-lg hover:bg-primary-dark dark:hover:bg-primary transition-colors text-sm lg:text-base font-medium 
                         whitespace-nowrap min-w-[120px]"
              >
                Let&apos;s Connect
              </motion.button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <MenuButton
              isOpen={isOpen}
              toggle={toggleMenu}
              className="lg:hidden"
            />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            className="lg:hidden absolute top-full left-0 w-full"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-background-primary/95 dark:bg-background-primary-dark/95 
                         border-t border-border-primary/10 dark:border-border-primary-dark/10"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
            >
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col space-y-4">
                  {menuItems.map((item, index) => {
                    const isActive = pathname === item.path;
                    
                    return (
                      <motion.button
                        key={item.title}
                        onClick={(e) => handleNavClick(item, e)}
                        className={`
                          relative text-base font-medium py-2 transition-all duration-300 cursor-pointer text-left
                          ${isActive 
                            ? 'text-primary dark:text-primary-dark' 
                            : 'text-text-primary dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark'
                          }
                        `}
                        whileHover={{ x: 10 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {item.title}
                        
                        {/* Active indicator for mobile */}
                        {isActive && (
                          <motion.div
                            className="absolute left-0 top-0 bottom-0 w-1 bg-primary dark:bg-primary-dark rounded-r-full"
                            layoutId="mobile-navbar-indicator"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                  
                  <div className="flex space-x-6 pt-2">
                    <motion.a 
                      href={site.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Linkedin className="w-5 h-5" />
                    </motion.a>
                    <motion.a 
                      href={site.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Instagram className="w-5 h-5" />
                    </motion.a>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 bg-primary dark:bg-primary-dark text-background-primary dark:text-background-primary-dark 
                             rounded-lg hover:bg-primary-dark dark:hover:bg-primary transition-colors text-base font-medium 
                             whitespace-nowrap min-w-[120px]"
                  >
                    Let&apos;s Connect
                  </motion.button>
                </div>
              </div>
              
              <div 
                className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-b from-transparent to-background-primary/30 dark:to-background-primary-dark/30"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;