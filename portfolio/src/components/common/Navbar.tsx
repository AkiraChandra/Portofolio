'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Linkedin, Instagram } from 'lucide-react';
import MenuButton from '@/components/ui/MenuButton';
import { mobileMenuVariants, menuItemVariants } from '@/lib/animations';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle viewport size changes
  useEffect(() => {
    const updateLayout = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  // Handle scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50); // Adjust this value as needed
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { title: 'Home', href: '#home' },
    { title: 'Skills', href: '#skills' },
    { title: 'Experience', href: '#experience' },
    { title: 'Projects', href: '#projects' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants: Variants = {
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hidden: {
      x: 100,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const hamburgerVariants: Variants = {
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      }
    },
    hidden: {
      x: 100,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  // Only show hamburger menu when:
  // 1. Not on mobile viewport
  // 2. Page has been scrolled down
  const shouldShowHamburger = !isMobile && isScrolled;

  return (
    <motion.nav className="fixed w-full z-50 py-4 sm:py-6">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-end items-center relative">
          <div className="flex items-center">
            {/* Full Menu */}
            <AnimatePresence mode="wait">
              {(!shouldShowHamburger || isMobile) && (
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
                    <a href="#" className="text-gray-400 hover:text-yellow-400">
                      <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-yellow-400">
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
                  variants={hamburgerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="flex justify-end"
                >
                  <MenuButton 
                    isOpen={isOpen} 
                    toggle={toggleMenu}
                    className="text-gray-200 hover:text-yellow-400"
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
            className="bg-[#0B0B1F] border-t border-gray-800/50"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col items-end space-y-4">
                {menuItems.map((item) => (
                  <motion.a
                    key={item.title}
                    href={item.href}
                    variants={menuItemVariants}
                    className="text-gray-300 hover:text-yellow-400 text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </motion.a>
                ))}
                
                <motion.div 
                  variants={menuItemVariants}
                  className="flex space-x-6 pt-2"
                >
                  <a href="#" className="text-gray-400 hover:text-yellow-400">
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-yellow-400">
                    <Instagram className="w-6 h-6" />
                  </a>
                </motion.div>
                
                <motion.button
                  variants={menuItemVariants}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 border-2 border-white text-gray-100 rounded-lg hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-colors text-lg font-medium mt-2"
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