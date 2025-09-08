import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    // Create floating particles
    const createParticles = () => {
      const container = document.getElementById('particles-container');
      if (!container) return;

      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute rounded-full opacity-30 pointer-events-none';
        particle.style.background = 'linear-gradient(45deg, hsl(var(--primary)), hsl(var(--primary-foreground)))';
        
        const size = Math.random() * 100 + 50;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animation = `pulse ${Math.random() * 10 + 5}s infinite ease-in-out`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(particle);
      }
    };

    createParticles();
  }, []);

  const goHome = () => {
    navigate('/');
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div id="particles-container" className="absolute inset-0 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-card/60 backdrop-blur-md rounded-3xl p-8 border border-border/50 text-center relative overflow-hidden">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center items-center mb-6"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mr-3">
              <Rocket className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Momta
            </span>
          </motion.div>

          {/* Error Code */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            className="text-8xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-4 relative"
          >
            404
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 blur-2xl -z-10" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-2xl font-semibold text-foreground mb-3"
          >
            Page Not Found
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-muted-foreground mb-6 leading-relaxed"
          >
            The future you're looking for doesn't exist yet. But don't worry, we're building it.
          </motion.p>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-r from-primary/10 to-primary/20 rounded-xl p-4 mb-6 border border-primary/20"
          >
            <p className="text-foreground italic text-sm">
              "Innovation is seeing what everybody has seen and thinking what nobody has thought." - Momta
            </p>
          </motion.div>

          {/* Path Display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="bg-muted/50 rounded-xl p-3 mb-6 border border-border/50"
          >
            <p className="text-xs text-muted-foreground mb-1">Requested path:</p>
            <code className="text-primary text-sm font-mono break-all">
              {window.location.pathname}
            </code>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="space-y-3"
          >
            <Button
              onClick={goHome}
              className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground"
            >
              <Home className="w-4 h-4 mr-2" />
              Return to Momta
            </Button>
            
            <Button
              onClick={goBack}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-6 text-xs text-muted-foreground space-y-1"
          >
            <p>Lost in space? Contact us at support@momta.org</p>
            <p>The future is still being written. Join us in creating it.</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Astronaut */}
      <motion.div
        className="absolute top-1/2 right-8 text-4xl pointer-events-none hidden lg:block"
        animate={{
          y: [-10, 10, -10],
          rotate: [-5, 5, -5]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        👨‍🚀
      </motion.div>

    </div>
  );
}