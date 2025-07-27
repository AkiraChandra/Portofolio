// src/components/common/navigations/Navbar.tsx (Simplified)
"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Instagram } from 'lucide-react';
import { usePathname } from 'next/navigation';
import MenuButton from '@/components/common/buttons/MenuButton';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { config } from '@/config';

const Navbar = () => {
  const { site } = config;
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  
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

  // Detect active section dengan better timing
  useEffect(() => {
    const sections = ['home', 'projects', 'experience', 'certifications'];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.5, // Lowered threshold
        rootMargin: '-20% 0px -20% 0px',
      }
    );

    // Add delay to ensure DOM is ready
    setTimeout(() => {
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          observer.observe(element);
        }
      });
    }, 100);

    return () => {
      observer.disconnect();
    };
  }, []);

  const menuItems = site.navigation.links;
  const toggleMenu = () => setIsOpen(!isOpen);

  // Handle navigation - Allow di semua halaman
  const handleNavClick = (item: typeof menuItems[0], e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    
    const sectionId = item.href.replace('#', '');
    const section = document.getElementById(sectionId);
    
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const backgroundColor = `rgba(var(--color-background-primary), ${scrollProgress * 0.95})`;
  const backdropBlur = `blur(${scrollProgress * 8}px)`;

  // Determine if navbar should be interactive - Always interactive
  const isHome = true; // Always allow interaction

  return (
    <motion.nav 
      className="fixed w-full z-50 py-4 lg:py-6"
      style={{
        backgroundColor,
        backdropFilter: backdropBlur,
        borderBottom: scrollProgress > 0 ? 
          '1px solid rgba(var(--color-border-primary), 0.1)' : 'none'
      }}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center relative">
          <ThemeToggle />
          
          <div className="flex items-center">
            {!isMobile && (
              <div className="flex items-center space-x-6 lg:space-x-8">
                {menuItems.map((item) => {
                  const sectionId = item.href.replace('#', '');
                  const isActive = isHome && activeSection === sectionId;
                  
                  return (
                    <motion.a
                      key={item.title}
                      href={item.href}
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
                    >
                      {item.title}
                      
                      {/* Active indicator - selalu bisa tampil */}
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
                    </motion.a>
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
                  Let's Connect
                </motion.button>
              </div>
            )}

            {isMobile && (
              <MenuButton
                isOpen={isOpen}
                toggle={toggleMenu}
                className="lg:hidden"
              />
            )}
          </div>
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
              className="bg-background-primary/95 dark:bg-background-primary-dark/95 backdrop-blur-lg 
                         border-t border-border-primary/10 dark:border-border-primary-dark/10"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
            >
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col space-y-4">
                  {menuItems.map((item) => {
                    const sectionId = item.href.replace('#', '');
                    const isActive = isHome && activeSection === sectionId;
                    
                    return (
                      <motion.a
                        key={item.title}
                        href={item.href}
                        onClick={(e) => handleNavClick(item, e)}
                        className={`
                          relative text-base font-medium py-2 transition-all duration-300 cursor-pointer
                          ${isActive 
                            ? 'text-primary dark:text-primary-dark' 
                            : 'text-text-primary dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark'
                          }
                        `}
                        whileHover={{ x: 10 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {item.title}
                        
                        {/* Active indicator for mobile - selalu bisa tampil */}
                        {isActive && (
                          <motion.div
                            className="absolute left-0 top-0 bottom-0 w-1 bg-primary dark:bg-primary-dark rounded-r-full"
                            layoutId="mobile-navbar-indicator"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          />
                        )}
                      </motion.a>
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
                    Let's Connect
                  </motion.button>
                </div>
              </div>
              
              <div 
                className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-b from-transparent to-background-primary/30 dark:to-background-primary-dark/30 backdrop-blur-sm"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;