"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-momta-slate-dark/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-8"
        >
          {/* Logo and Badge */}
          <div className="flex items-center justify-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-momta-blue to-momta-blue-light flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl font-poppins">M</span>
              </div>
              <div className="absolute inset-0 w-10 h-10 rounded-xl bg-momta-blue/30 animate-momta-pulse"></div>
            </div>
            
            <div className="text-left">
              <div className="text-xl font-semibold font-poppins text-momta-slate-light">
                Momta
              </div>
              <div className="flex items-center space-x-2">
                <span className="badge-2028 text-xs">
                  2028
                </span>
                <span className="text-xs text-momta-slate-dark">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <p className="text-momta-slate italic max-w-md mx-auto">
              "The future isn't just arriving — it's perfected."
            </p>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-momta-blue to-transparent mx-auto"></div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <div className="flex items-center justify-center space-x-2 text-momta-slate">
              <Mail size={16} />
              <a 
                href="mailto:support@momta.org" 
                className="hover:text-momta-blue-light transition-colors duration-200"
              >
                support@momta.org
              </a>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-momta-slate-dark/30 to-transparent"></div>

          {/* Copyright and Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {/* Year Range */}
            <div className="flex items-center justify-center space-x-2 text-sm text-momta-slate-dark">
              <span>{currentYear}</span>
              <div className="w-8 h-px bg-momta-slate-dark/50"></div>
              <span className="text-momta-blue-light font-medium">2028</span>
            </div>

            {/* Copyright */}
            <div className="flex items-center justify-center space-x-2 text-sm text-momta-slate-dark">
              <span>Copyright © {currentYear} Momta Technology.</span>
              <Heart size={12} className="text-momta-blue-light animate-pulse" />
              <span>Built for the future.</span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center justify-center space-x-6 text-xs text-momta-slate-dark">
              <a 
                href="#privacy" 
                className="hover:text-momta-slate-light transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <span>•</span>
              <a 
                href="#terms" 
                className="hover:text-momta-slate-light transition-colors duration-200"
              >
                Terms of Service
              </a>
              <span>•</span>
              <a 
                href="#cookies" 
                className="hover:text-momta-slate-light transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </div>
          </motion.div>

          {/* Future Vision Statement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            viewport={{ once: true }}
            className="pt-8"
          >
            <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r from-momta-blue/5 to-momta-blue-light/5 border border-momta-blue/10">
              <div className="w-2 h-2 rounded-full bg-momta-blue animate-momta-pulse"></div>
              <span className="text-sm font-medium text-momta-slate">
                Preparing the dawn of serene intelligence
              </span>
              <div className="w-2 h-2 rounded-full bg-momta-blue-light animate-momta-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}