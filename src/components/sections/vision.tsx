"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Brain, Zap, Shield } from 'lucide-react';

const visionCards = [
  {
    icon: Brain,
    title: "Serene Intelligence",
    description: "AI that understands not just what you need, but when you need peace. Technology that amplifies human intuition rather than replacing it.",
    gradient: "from-momta-blue/20 to-momta-blue-light/20"
  },
  {
    icon: Zap,
    title: "Precision, Perfected",
    description: "Every interaction is purposeful. Every response is considered. In a world of noise, Momta 2028 delivers clarity.",
    gradient: "from-momta-blue-light/20 to-momta-slate/20"
  },
  {
    icon: Shield,
    title: "The 2028 Threshold",
    description: "The moment when artificial intelligence transcends mere computation to become a trusted companion in human progress.",
    gradient: "from-momta-slate/20 to-momta-blue/20"
  }
];

export function Vision() {
  return (
    <section id="vision" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-16"
        >
          {/* Section Header */}
          <div className="space-y-6">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="badge-2028"
            >
              Our Vision
            </motion.span>
            
            <h2 className="display-2 text-momta-slate-light max-w-4xl mx-auto">
              Where Technology Meets Tranquility
            </h2>
            
            <p className="body-lg text-momta-slate max-w-3xl mx-auto">
              Momta 2028 represents a paradigm shift. Not just artificial intelligence, 
              but <em className="text-momta-blue-light font-medium">calm prophecy</em> — 
              technology that anticipates, adapts, and elevates the human experience.
            </p>
          </div>

          {/* Vision Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {visionCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 50, rotateY: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ 
                  delay: index * 0.2, 
                  duration: 0.8,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  y: -10, 
                  rotateY: -5,
                  transition: { duration: 0.3 } 
                }}
                viewport={{ once: true }}
              >
                <GlassCard className="h-full space-y-6 text-center relative overflow-hidden group m-lens">
                  {/* Background Gradient */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  
                  {/* Content */}
                  <div className="relative z-10 space-y-4">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-momta-blue to-momta-blue-light flex items-center justify-center shadow-lg"
                    >
                      <card.icon size={24} className="text-white" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold font-poppins text-momta-slate-light">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-momta-slate leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Floating Particles */}
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5
                    }}
                    className="absolute top-4 right-4 w-1 h-1 rounded-full bg-momta-blue-light"
                  />
                  
                  <motion.div
                    animate={{
                      y: [0, 8, 0],
                      opacity: [0.4, 0.8, 0.4]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: index * 0.7 + 1
                    }}
                    className="absolute bottom-6 left-6 w-1.5 h-1.5 rounded-full bg-momta-blue"
                  />
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-4 max-w-2xl mx-auto"
          >
            <div className="h-px bg-gradient-to-r from-transparent via-momta-blue/50 to-transparent mb-8"></div>
            
            <p className="text-lg text-momta-slate-light font-medium">
              Ready to experience the dawn of serene intelligence?
            </p>
            
            <p className="text-momta-slate">
              Join thousands who are already preparing for the future. 
              The revolution starts with those who see it coming.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}