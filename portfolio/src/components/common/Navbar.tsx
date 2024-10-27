// /src/components/common/Navbar.tsx

'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Instagram } from 'lucide-react';
import MenuButton from '@/components/ui/MenuButton';
import { mobileMenuVariants, menuItemVariants } from '@/lib/animations';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { title: 'Home', href: '#home' },
    { title: 'Skills', href: '#skills' },
    { title: 'Experience', href: '#experience' },
    { title: 'Projects', href: '#projects' },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed w-full z-50 bg-transparent py-4 sm:py-6">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Desktop Menu */}
        <div className="hidden md:flex justify-end items-center space-x-8 sm:space-x-10">
          <div className="flex items-center space-x-8 sm:space-x-10">
            {menuItems.map((item) => (
              <motion.a
                key={item.title}
                href={item.href}
                className="text-gray-300 hover:text-yellow-400 transition-colors text-base sm:text-lg font-medium"
                whileHover={{ scale: 1.1 }}
              >
                {item.title}
              </motion.a>
            ))}
          </div>
          
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
            className="px-6 sm:px-8 py-2 sm:py-3 border-2 border-white text-gray-100 rounded-lg hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-colors text-base sm:text-lg font-medium"
          >
            Let's Connect
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex justify-end">
          <MenuButton 
            isOpen={isOpen} 
            toggle={toggleMenu}
            className="text-gray-200 hover:text-yellow-400"
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={mobileMenuVariants}
        className="md:hidden bg-[#0B0B1F]/95 backdrop-blur-sm border-t border-gray-800/50"
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
    </nav>
  );
};

export default Navbar;