"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';

interface TimeUnit {
  value: number;
  label: string;
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeUnit[]>([]);

  useEffect(() => {
    const targetDate = new Date('2028-01-01T00:00:00Z');

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        return [
          { value: days, label: 'Days' },
          { value: hours, label: 'Hours' },
          { value: minutes, label: 'Minutes' },
          { value: seconds, label: 'Seconds' },
        ];
      }

      return [
        { value: 0, label: 'Days' },
        { value: 0, label: 'Hours' },
        { value: 0, label: 'Minutes' },
        { value: 0, label: 'Seconds' },
      ];
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-12"
        >
          {/* Section Title */}
          <div className="space-y-4">
            <h2 className="display-2 text-momta-slate-light">
              The Dawn Approaches
            </h2>
            <p className="body-lg text-momta-slate max-w-2xl mx-auto">
              Countdown to the future. Be ready when the moment arrives.
            </p>
          </div>

          {/* Countdown Display */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {timeLeft.map((unit, index) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <GlassCard className="text-center space-y-2 m-lens animate-momta-pulse">
                  <motion.div
                    key={unit.value} // Re-trigger animation on value change
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl md:text-5xl font-bold font-poppins bg-gradient-to-b from-momta-blue-light to-momta-blue bg-clip-text text-transparent"
                  >
                    {unit.value.toString().padStart(2, '0')}
                  </motion.div>
                  
                  <div className="text-sm font-medium text-momta-slate-dark uppercase tracking-wider">
                    {unit.label}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Timeline Indicator */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.6, duration: 1.2 }}
            viewport={{ once: true }}
            className="relative mt-16"
          >
            <div className="h-px bg-gradient-to-r from-transparent via-momta-blue to-transparent max-w-md mx-auto"></div>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 rounded-full bg-momta-blue animate-momta-glow"></div>
            </div>
          </motion.div>

          {/* Future Vision Text */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto"
          >
            <p className="text-momta-slate-dark italic">
              "In the year 2028, technology and tranquility will converge. 
              The future isn't just arriving – it's perfected."
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}