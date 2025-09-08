"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Rocket, Bot, Wrench, TrendingUp, Globe } from 'lucide-react';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  details: string;
  icon: React.ComponentType<any>;
  gradient: string;
  status: 'completed' | 'current' | 'future';
}

const timelineData: TimelineItem[] = [
  {
    year: '2024',
    title: 'The Beginning',
    description: 'The idea was born.',
    details: 'Initial planning and defining the vision.',
    icon: Rocket,
    gradient: 'from-momta-blue/30 to-momta-blue-light/30',
    status: 'completed'
  },
  {
    year: '2025',
    title: 'Building the AI',
    description: 'Developing the core AI system.',
    details: 'Preparing the intelligence that will power Momta\'s robots.',
    icon: Bot,
    gradient: 'from-momta-blue-light/30 to-momta-slate/30',
    status: 'current'
  },
  {
    year: '2026',
    title: 'Prototypes & Design',
    description: 'Creating the first prototypes of our robots.',
    details: 'Designing the look and structure. Starting to search for investors.',
    icon: Wrench,
    gradient: 'from-momta-slate/30 to-momta-blue/30',
    status: 'future'
  },
  {
    year: '2027',
    title: 'Investment & Growth',
    description: 'Continuing the search for investors and strategic partners.',
    details: 'Preparing for the launch stage.',
    icon: TrendingUp,
    gradient: 'from-momta-blue/30 to-momta-blue-light/30',
    status: 'future'
  },
  {
    year: '2028',
    title: 'First Launch',
    description: 'Initial launch of Momta\'s first robots.',
    details: 'Official entry of Momta Robotics into the world.',
    icon: Globe,
    gradient: 'from-momta-blue-light/30 to-momta-blue/30',
    status: 'future'
  }
];

export function Timeline() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-momta-blue/5 via-transparent to-transparent blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
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
              Our Journey
            </motion.span>
            
            <h2 className="display-2 text-momta-slate-light max-w-4xl mx-auto">
              The Path to Serene Intelligence
            </h2>
            
            <p className="body-lg text-momta-slate max-w-3xl mx-auto">
              From vision to reality. Follow our journey as we build the future of 
              <em className="text-momta-blue-light font-medium"> robotics and AI</em>.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative max-w-6xl mx-auto">
            {/* Central Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-momta-blue via-momta-blue-light to-momta-blue opacity-30 hidden lg:block"></div>
            
            {/* Mobile Timeline Line */}
            <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-momta-blue via-momta-blue-light to-momta-blue opacity-30 lg:hidden"></div>

            <div className="space-y-12 lg:space-y-20">
              {timelineData.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.2, 
                    duration: 0.8,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } flex-col lg:gap-16 gap-8`}
                >
                  {/* Timeline Node */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ 
                      delay: index * 0.2 + 0.3, 
                      duration: 0.6,
                      type: "spring",
                      stiffness: 200
                    }}
                    viewport={{ once: true }}
                    className="absolute left-1/2 transform -translate-x-1/2 lg:relative lg:left-auto lg:transform-none z-20 hidden lg:block"
                  >
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.gradient} border-2 border-momta-blue/50 flex items-center justify-center shadow-lg`}>
                        <item.icon size={24} className="text-momta-blue-light" />
                      </div>
                      
                      {/* Glow Effect */}
                      <div className={`absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-br ${item.gradient} animate-momta-pulse opacity-50`}></div>
                      
                      {/* Status Indicator */}
                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-momta-night ${
                        item.status === 'completed' ? 'bg-green-500' :
                        item.status === 'current' ? 'bg-momta-blue animate-momta-pulse' :
                        'bg-momta-slate-dark'
                      }`}></div>
                    </div>
                  </motion.div>

                  {/* Mobile Timeline Node */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ 
                      delay: index * 0.2 + 0.3, 
                      duration: 0.6,
                      type: "spring",
                      stiffness: 200
                    }}
                    viewport={{ once: true }}
                    className="absolute left-8 transform -translate-x-1/2 z-20 lg:hidden"
                  >
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.gradient} border-2 border-momta-blue/50 flex items-center justify-center shadow-lg`}>
                        <item.icon size={18} className="text-momta-blue-light" />
                      </div>
                      <div className={`absolute inset-0 w-12 h-12 rounded-full bg-gradient-to-br ${item.gradient} animate-momta-pulse opacity-50`}></div>
                    </div>
                  </motion.div>

                  {/* Content Card */}
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: index * 0.2 + 0.5, 
                      duration: 0.8,
                      ease: "easeOut"
                    }}
                    whileHover={{ 
                      y: -5,
                      transition: { duration: 0.3 }
                    }}
                    viewport={{ once: true }}
                    className="flex-1 max-w-md lg:max-w-lg ml-20 lg:ml-0"
                  >
                    <GlassCard className="text-left space-y-4 m-lens group relative overflow-hidden">
                      {/* Background Gradient */}
                      <div 
                        className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      />
                      
                      {/* Content */}
                      <div className="relative z-10 space-y-3">
                        {/* Year Badge */}
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold font-poppins bg-gradient-to-r from-momta-blue to-momta-blue-light bg-clip-text text-transparent">
                            {item.year}
                          </span>
                          
                          {/* Mobile Icon */}
                          <div className="lg:hidden">
                            <item.icon size={20} className="text-momta-blue-light" />
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-semibold font-poppins text-momta-slate-light flex items-center gap-2">
                          {item.title}
                          <span className="text-lg">{
                            item.year === '2024' ? '🚀' :
                            item.year === '2025' ? '🤖' :
                            item.year === '2026' ? '🛠️' :
                            item.year === '2027' ? '📈' :
                            '🌍✨'
                          }</span>
                        </h3>

                        {/* Description */}
                        <p className="text-momta-slate font-medium">
                          {item.description}
                        </p>

                        {/* Details */}
                        <p className="text-momta-slate-dark text-sm leading-relaxed">
                          {item.details}
                        </p>

                        {/* Status Badge */}
                        <div className="pt-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            item.status === 'current' ? 'bg-momta-blue/20 text-momta-blue-light border border-momta-blue/30 animate-momta-pulse' :
                            'bg-momta-slate-dark/20 text-momta-slate border border-momta-slate-dark/30'
                          }`}>
                            {item.status === 'completed' ? '✓ Completed' :
                             item.status === 'current' ? '⚡ In Progress' :
                             '⏳ Planned'}
                          </span>
                        </div>
                      </div>

                      {/* Floating Particles */}
                      <motion.div
                        animate={{
                          y: [0, -8, 0],
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
                          y: [0, 6, 0],
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

                  {/* Spacer for opposite side on desktop */}
                  <div className="flex-1 hidden lg:block"></div>
                </motion.div>
              ))}
            </div>

            {/* Timeline End Indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="relative mt-16 flex justify-center"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-momta-blue to-momta-blue-light flex items-center justify-center shadow-2xl">
                  <Globe size={32} className="text-white" />
                </div>
                
                {/* Pulsing Rings */}
                <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-momta-blue/30 animate-ping"></div>
                <div className="absolute inset-0 w-20 h-20 rounded-full border border-momta-blue-light/50 animate-momta-pulse"></div>
                
                {/* Orbital Elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-20 h-20"
                >
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-momta-blue-light"></div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-momta-blue"></div>
                </motion.div>
              </div>
            </motion.div>

            {/* Future Vision Statement */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mt-12 space-y-4"
            >
              <div className="h-px bg-gradient-to-r from-transparent via-momta-blue/50 to-transparent max-w-md mx-auto mb-8"></div>
              
              <p className="text-lg font-medium text-momta-slate-light">
                The Future is Being Built Today
              </p>
              
              <p className="text-momta-slate max-w-2xl mx-auto">
                Every milestone brings us closer to a world where technology serves humanity 
                with grace, intelligence, and purpose. Join us on this extraordinary journey.
              </p>

              {/* Progress Indicator */}
              <div className="flex items-center justify-center space-x-2 mt-8">
                <div className="text-sm text-momta-slate-dark">Progress:</div>
                <div className="w-32 h-2 bg-momta-night-light rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '40%' }}
                    transition={{ delay: 2, duration: 1.5, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="h-full bg-gradient-to-r from-momta-blue to-momta-blue-light rounded-full"
                  />
                </div>
                <div className="text-sm text-momta-blue-light font-medium">2025</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Floating Background Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 w-4 h-4 rounded-full bg-momta-blue/20 blur-sm"
      />
      
      <motion.div
        animate={{
          y: [0, 15, 0],
          rotate: [0, -3, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-32 right-16 w-3 h-3 rounded-full bg-momta-blue-light/30 blur-sm"
      />
      
      <motion.div
        animate={{
          y: [0, -10, 0],
          x: [0, 5, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
        className="absolute top-1/2 right-8 w-2 h-2 rounded-full bg-momta-blue/40 blur-sm"
      />
    </section>
  );
}