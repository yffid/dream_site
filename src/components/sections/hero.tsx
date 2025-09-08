"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LazyNeuralCore, LazyWrapper } from '@/components/seo/PerformanceOptimizer';

interface HeroProps {
  onJoinWaitlist: () => void;
}

export function Hero({ onJoinWaitlist }: HeroProps) {
  return (
    <section className="min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4">
        <div className="layout-2-3 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* 2028 Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="badge-2028">
                2028
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="display-1 bg-gradient-to-r from-momta-slate-light to-white bg-clip-text text-transparent">
                Momta 2028
              </h1>
              
              <p className="body-lg text-momta-slate max-w-2xl">
                The future is in sight. Join the waitlist for an exclusive{' '}
                <span className="text-momta-blue-light font-semibold">20% launch discount</span> 
                {' '}and be among the first to experience the dawn of serene intelligence.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Button
                onClick={onJoinWaitlist}
                size="lg"
                className="bg-gradient-to-r from-momta-blue to-momta-blue-light hover:from-momta-blue-dark hover:to-momta-blue text-white font-semibold px-8 py-4 rounded-momta-xl shadow-lg hover:shadow-xl transition-all duration-300 m-lens"
              >
                Join the Future
              </Button>
            </motion.div>

            {/* Subtle Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex items-center space-x-6 text-sm text-momta-slate-dark"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-momta-blue animate-momta-pulse"></div>
                <span>Launching 2028</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-momta-blue-light animate-momta-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span>Early Access Available</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Neural Core */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
            className="relative h-96 lg:h-[500px]"
          >
            {/* Glow Effect Background */}
            <div className="absolute inset-0 bg-gradient-radial from-momta-blue/20 via-transparent to-transparent blur-3xl"></div>
            
            {/* Neural Core Component */}
            <div className="relative z-10 w-full h-full rounded-momta-xl overflow-hidden">
              <LazyWrapper fallback={
                <div className="w-full h-full bg-gradient-to-br from-momta-blue/10 to-momta-blue-light/10 rounded-momta-xl flex items-center justify-center">
                  <div className="w-12 h-12 border-2 border-momta-blue border-t-transparent rounded-full animate-spin"></div>
                </div>
              }>
                <LazyNeuralCore className="w-full h-full" />
              </LazyWrapper>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-4 right-4 w-3 h-3 rounded-full bg-momta-blue-light/60 blur-sm"
            />
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-8 left-8 w-2 h-2 rounded-full bg-momta-blue/60 blur-sm"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}