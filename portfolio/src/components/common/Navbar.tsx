'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Linkedin, Facebook, Instagram } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { title: 'Home', href: '#home' },
    { title: 'Skills', href: '#skills' },
    { title: 'Experience', href: '#experience' },
    { title: 'Projects', href: '#projects' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-transparent py-6"> {}
      <div className="container mx-auto px-6 mr-1"> {}
        {}
        <div className="hidden md:flex justify-end items-center space-x-10"> {}
          <div className="flex items-center space-x-10"> {}
            {menuItems.map((item) => (
              <motion.a
                key={item.title}
                href={item.href}
                className="text-gray-300 hover:text-yellow-400 transition-colors text-lg font-medium" 
                whileHover={{ scale: 1.1 }}
              >
                {item.title}
              </motion.a>
            ))}
          </div>
          
          {}
          <div className="flex items-center space-x-6"> {}
            <a href="#" className="text-gray-400 hover:text-yellow-400">
              <Linkedin className="w-6 h-6" /> {}
            </a>
            <a href="#" className="text-gray-400 hover:text-yellow-400">
              <Instagram className="w-6 h-6" /> {}
            </a>
          </div>

          {}
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-8 py-3 border-2 border-white text-gray-100 rounded-lg hover:bg-yellow-400 hover:text-black transition-colors text-lg font-medium" 
          >
            Let's Connect
          </motion.button>
        </div>

        {}
        <div className="md:hidden flex justify-end">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white"
          >
            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />} {}
          </button>
        </div>
      </div>

      {}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#0B0B1F] border-t border-gray-800 mt-4"
        >
          <div className="container mx-auto px-6 py-6"> {}
            {menuItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="block py-3 text-right text-gray-300 hover:text-white text-xl font-medium" 
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </a>
            ))}
            {}
            <div className="mt-6 flex flex-col items-end space-y-6"> {}
              <div className="flex space-x-6"> {}
                <a href="#" className="text-gray-400 hover:text-white">
                  <Linkedin className="w-7 h-7" /> {}
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Instagram className="w-7 h-7" /> {}
                </a>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-3 border-2 border-white text-gray-100 rounded-lg hover:bg-yellow-400 hover:text-black transition-colors text-lg font-medium" 
              >
                Let's Connect
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;