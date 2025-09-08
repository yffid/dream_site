"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onJoinWaitlist: () => void;
}

export function Navbar({ onJoinWaitlist }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navVariants = {
    top: {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      backdropFilter: 'blur(0px)',
    },
    scrolled: {
      backgroundColor: 'rgba(10, 10, 15, 0.8)',
      backdropFilter: 'blur(24px)',
    },
  };

  const logoVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
  };

  const navItems = [
    { label: 'Vision', href: '#vision' },
    { label: 'Research Publications', href: '/research' },
    { label: 'Latest Updates', href: '/updates' },
  ];

  return (
    <>
      <motion.nav
        variants={navVariants}
        animate={isScrolled ? 'scrolled' : 'top'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-40 border-b border-white/5"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              variants={logoVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center space-x-3"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-momta-blue to-momta-blue-light flex items-center justify-center">
                  <span className="text-white font-bold text-lg font-poppins">M</span>
                </div>
                <div className="absolute inset-0 w-8 h-8 rounded-lg bg-momta-blue/30 animate-momta-pulse"></div>
              </div>
              
              <div className="hidden sm:block">
                <span className="text-lg font-semibold font-poppins text-momta-slate-light">
                  Momta
                </span>
                <span className="badge-2028 ml-2 text-[10px] px-2 py-0.5">
                  2028
                </span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="hidden md:flex items-center space-x-8"
            >
              {navItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index + 0.5 }}
                  className="text-momta-slate hover:text-momta-slate-light transition-colors duration-200 text-sm font-medium relative group"
                >
                  {item.label}
                  <span className="absolute inset-x-0 -bottom-1 h-px bg-momta-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
                </motion.a>
              ))}
              
              <Button
                onClick={onJoinWaitlist}
                size="sm"
                className="bg-gradient-to-r from-momta-blue to-momta-blue-light hover:from-momta-blue-dark hover:to-momta-blue text-white font-medium px-4 py-2 rounded-full transition-all duration-200 m-lens"
              >
                Join Waitlist
              </Button>
              
              <ThemeToggle />
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-momta-slate-light hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-16 left-0 right-0 z-30 md:hidden"
        >
          <div className="bg-momta-night/95 backdrop-blur-24 border-b border-white/5 p-4">
            <div className="space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-momta-slate hover:text-momta-slate-light transition-colors text-sm font-medium py-2"
                >
                  {item.label}
                </a>
              ))}
              
              <Button
                onClick={() => {
                  onJoinWaitlist();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-momta-blue to-momta-blue-light hover:from-momta-blue-dark hover:to-momta-blue text-white font-medium py-2 rounded-full"
              >
                Join Waitlist
              </Button>
              
              <div className="flex justify-center pt-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}