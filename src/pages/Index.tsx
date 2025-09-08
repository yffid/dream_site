import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/sections/navbar';
import { Hero } from '@/components/sections/hero';
import { Countdown } from '@/components/sections/countdown';
import { Vision } from '@/components/sections/vision';
import { Timeline } from '@/components/sections/timeline';
import { Updates } from '@/components/sections/updates';
import { SubscribeForm } from '@/components/sections/subscribe-form';
import { Footer } from '@/components/sections/footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { Preload } from '@/components/seo/Preload';
import { LazyRobotAnimation, LazyWrapper } from '@/components/seo/PerformanceOptimizer';
import { Button } from '@/components/ui/button';
import { Search, FileText } from 'lucide-react';
import { organizationStructuredData, productStructuredData, websiteStructuredData } from '@/utils/structured-data';

const Index = () => {
  const [isSubscribeFormOpen, setIsSubscribeFormOpen] = useState(false);

  const handleJoinWaitlist = () => {
    setIsSubscribeFormOpen(true);
  };

  const handleCloseSubscribeForm = () => {
    setIsSubscribeFormOpen(false);
  };

  // Combine structured data for the homepage
  const combinedStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      organizationStructuredData,
      productStructuredData,
      websiteStructuredData
    ]
  };

  return (
    <>
      <Preload />
      <SEOHead
        title="Momta - AI & Robotics Innovation | مومتا تقنية الذكاء الاصطناعي"
        description="Momta: Forward-thinking technology company driving innovation in AI, robotics, and emerging technologies. Research, updates, and breakthrough solutions. مومتا للذكاء الاصطناعي والروبوتات."
        canonical="https://momta.org"
        keywords="Momta, مومتا, AI, artificial intelligence, ذكاء اصطناعي, robotics, روبوتات, robots, تقنية, technology, innovation, research, بحوث, updates, تحديثات"
        structuredData={combinedStructuredData}
      />
      
      <div className="min-h-screen bg-momta-night text-foreground overflow-x-hidden">
        {/* Navigation */}
        <Navbar onJoinWaitlist={handleJoinWaitlist} />

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <Hero onJoinWaitlist={handleJoinWaitlist} />

          {/* Prominent Navigation to Research & Updates */}
          <section className="py-16 bg-momta-night-dark/20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center space-y-8"
              >
                <h2 className="text-3xl font-bold text-momta-slate-light">
                  Explore Our Content
                </h2>
                <p className="text-lg text-momta-slate max-w-2xl mx-auto">
                  Discover our latest research breakthroughs and stay updated with technological innovations
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="glass" size="lg" asChild className="gap-3 text-lg px-8 py-4">
                      <a href="/research">
                        <Search className="w-5 h-5" />
                        Research Publications
                      </a>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="lg" asChild className="gap-3 text-lg px-8 py-4">
                      <a href="/updates">
                        <FileText className="w-5 h-5" />
                        Latest Updates
                      </a>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Countdown Section */}
          <Countdown />

          {/* Vision Section */}
          <Vision />

          {/* Future Section */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center space-y-12"
              >
                <div className="space-y-6">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="display-2 text-momta-slate-light"
                  >
                    The Future is Being Built Today
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="body-lg text-momta-slate max-w-4xl mx-auto"
                  >
                    Every milestone brings us closer to a world where technology serves humanity with grace, intelligence, and purpose. Join us on this extraordinary journey.
                  </motion.p>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="h-px bg-gradient-to-r from-transparent via-momta-blue/50 to-transparent"
                />
                
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-xl font-semibold text-momta-slate-light"
                >
                  Progress:
                </motion.h3>
              </motion.div>
            </div>
          </section>

          {/* Timeline Section */}
          <Timeline />

          {/* Updates Section */}
          <Updates />

          {/* About Us Section */}
          <section className="py-20 bg-momta-night-dark/30">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-12"
              >
                <div className="text-center space-y-6">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="badge-2028"
                  >
                    About Momta
                  </motion.span>
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="display-2 text-momta-slate-light"
                  >
                    About Us
                  </motion.h2>
                  <p className="text-lg text-momta-slate max-w-3xl mx-auto">
                    Shaping the Future of Technology Through Innovation and Community
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <p className="body-lg text-momta-slate leading-relaxed">
                      <strong className="text-momta-blue-light">Momta</strong> is a forward-thinking technology company dedicated to driving innovation in artificial intelligence, robotics, and emerging technologies. Founded with a vision to make advanced tech accessible and impactful, Momta combines research, development, and community engagement to shape the future of technology.
                    </p>
                    
                    <p className="text-momta-slate leading-relaxed">
                      At Momta, we believe that innovation should empower people. Our platform is built to support and publish cutting-edge research, share regular updates on the latest breakthroughs, and provide a trusted hub for knowledge in AI, robotics, and technology trends.
                    </p>

                    <div className="space-y-4">
                      <div className="p-4 bg-momta-night/50 rounded-lg border border-momta-blue/20">
                        <h3 className="font-semibold text-momta-blue-light mb-2">Mission</h3>
                        <p className="text-sm text-momta-slate">
                          To make artificial intelligence and robotics accessible, practical, and beneficial for individuals, businesses, and communities worldwide.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-momta-night/50 rounded-lg border border-momta-blue/20">
                        <h3 className="font-semibold text-momta-blue-light mb-2">Vision</h3>
                        <p className="text-sm text-momta-slate">
                          To be a global leader in AI-driven innovation, inspiring the next generation of researchers, developers, and thinkers.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-momta-slate-light">Our Values</h3>
                    <div className="grid gap-4">
                      <div className="flex gap-4 p-4 bg-momta-night/30 rounded-lg">
                        <div className="w-2 h-2 bg-momta-blue rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-medium text-momta-blue-light">Innovation</h4>
                          <p className="text-sm text-momta-slate">Pushing the boundaries of what technology can achieve</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 p-4 bg-momta-night/30 rounded-lg">
                        <div className="w-2 h-2 bg-momta-blue rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-medium text-momta-blue-light">Collaboration</h4>
                          <p className="text-sm text-momta-slate">Building with and for the community</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 p-4 bg-momta-night/30 rounded-lg">
                        <div className="w-2 h-2 bg-momta-blue rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-medium text-momta-blue-light">Integrity</h4>
                          <p className="text-sm text-momta-slate">Ensuring trust, transparency, and ethical practices</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 p-4 bg-momta-night/30 rounded-lg">
                        <div className="w-2 h-2 bg-momta-blue rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-medium text-momta-blue-light">Impact</h4>
                          <p className="text-sm text-momta-slate">Creating technology that improves lives and drives progress</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Spacer for Visual Breathing Room */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              {/* Robot Animation Demo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <LazyWrapper>
                  <LazyRobotAnimation size="lg" className="mx-auto mb-4" />
                </LazyWrapper>
                <p className="text-momta-slate-dark text-sm italic">
                  A glimpse of our friendly robot companions
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 1.2 }}
                viewport={{ once: true }}
                className="h-px bg-gradient-to-r from-transparent via-momta-blue/30 to-transparent"
              />
            </div>
          </section>
        </main>

        {/* Footer */}
        <Footer />

        {/* Subscribe Form Modal */}
        <SubscribeForm 
          isOpen={isSubscribeFormOpen} 
          onClose={handleCloseSubscribeForm} 
        />

        {/* SEO and Meta Content */}
        <div className="sr-only">
          <h1>Momta - AI & Robotics Innovation</h1>
          <p>Explore cutting-edge research in artificial intelligence and robotics. Stay updated with breakthrough technologies and innovations from Momta.</p>
          <div itemScope itemType="https://schema.org/Organization">
            <span itemProp="name">Momta Technology</span>
            <span itemProp="url">https://momta.org</span>
            <span itemProp="email">support@momta.org</span>
            <span itemProp="description">Forward-thinking technology company driving innovation in AI, robotics, and emerging technologies</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;