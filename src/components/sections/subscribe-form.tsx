"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/ui/glass-card';
import { X, CheckCircle, AlertCircle, Loader2, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { checkFormSubmissionLimit } from '@/middleware/rate-limiter';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Please enter a valid email address').max(255, 'Email too long'),
  phone: z.string()
    .min(10, 'Please enter a valid phone number')
    .max(20, 'Phone number too long')
    .optional()
    .or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

interface SubscribeFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscribeForm({ isOpen, onClose }: SubscribeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Client-side rate limiting check
      const userIdentifier = data.email.toLowerCase();
      const rateLimitCheck = checkFormSubmissionLimit(userIdentifier);
      
      if (!rateLimitCheck.allowed) {
        toast({
          title: "Slow down!",
          description: "Too many attempts. Please try again in a few minutes.",
          variant: "destructive",
        });
        return;
      }

      // Use the edge function for secure, rate-limited subscription
      const { data: result, error } = await supabase.functions.invoke('subscribe', {
        body: {
          name: data.name.trim(),
          email: data.email.toLowerCase().trim(),
          phone: data.phone?.trim() || null,
        }
      });

      if (error) {
        console.error('Error calling subscribe function:', error);
        toast({
          title: "Network Error",
          description: "Please check your connection and try again.",
          variant: "destructive",
        });
        return;
      }

      if (result.error) {
        if (result.error.includes('already registered') || result.error.includes('Email already registered')) {
          toast({
            title: "Already registered!",
            description: "You're already on our waitlist. Check your email for your discount code.",
            variant: "default",
          });
        } else if (result.error.includes('Too many requests')) {
          toast({
            title: "Rate limit exceeded",
            description: "Too many requests. Please try again in a few minutes.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
        }
        return;
      }

      setDiscountCode(result.discount_code);
      setIsSuccess(true);
      reset();

      // Track success for analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'waitlist_signup', {
          event_category: 'engagement',
          event_label: 'momta_2028_waitlist'
        });
      }

      console.log('New waitlist subscriber:', data.email);

    } catch (error: any) {
      console.error('Subscription error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support@momta.org if the issue persists.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setDiscountCode('');
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-momta-night/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard variant="elevated" className="relative">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-momta-slate-dark hover:text-momta-slate-light transition-colors z-10"
                aria-label="Close form"
              >
                <X size={20} />
              </button>

              {/* Success State */}
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-6"
                >
                  <div className="flex justify-center">
                    <CheckCircle size={48} className="text-momta-blue-light animate-momta-glow" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold font-poppins text-momta-slate-light">
                      You're in! The future awaits.
                    </h3>
                    <p className="text-momta-slate">
                      Your 20% discount is secured for 2028.
                    </p>
                  </div>

                  {discountCode && (
                    <div className="p-4 bg-momta-blue/10 rounded-lg border border-momta-blue/20">
                      <p className="text-sm text-momta-slate-dark mb-2">Your exclusive discount code:</p>
                      <code className="text-lg font-mono font-semibold text-momta-blue-light">
                        {discountCode}
                      </code>
                      <p className="text-xs text-momta-slate-dark mt-2">
                        Save this code - you'll need it in 2028!
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleClose}
                    className="w-full bg-gradient-to-r from-momta-blue to-momta-blue-light hover:from-momta-blue-dark hover:to-momta-blue"
                  >
                    Continue to the Future
                  </Button>
                </motion.div>
              ) : (
                /* Form State */
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold font-poppins text-momta-slate-light">
                      Join the Future
                    </h3>
                    <p className="text-sm text-momta-slate">
                      Secure your 20% discount for Momta 2028
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-momta-slate-light">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        {...register('name')}
                        placeholder="Enter your full name"
                        className="bg-momta-night-light/50 border-momta-slate-dark/30 text-momta-slate-light placeholder:text-momta-slate-dark focus:border-momta-blue"
                        maxLength={100}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-400 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-momta-slate-light">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="Enter your email"
                        className="bg-momta-night-light/50 border-momta-slate-dark/30 text-momta-slate-light placeholder:text-momta-slate-dark focus:border-momta-blue"
                        maxLength={255}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-400 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone Field (Optional) */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-momta-slate-light">
                        Phone Number <span className="text-momta-slate-dark text-xs">(Optional)</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        placeholder="Enter your phone number"
                        className="bg-momta-night-light/50 border-momta-slate-dark/30 text-momta-slate-light placeholder:text-momta-slate-dark focus:border-momta-blue"
                        maxLength={20}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-400 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-momta-blue to-momta-blue-light hover:from-momta-blue-dark hover:to-momta-blue disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin mr-2" />
                          Securing Your Future...
                        </>
                      ) : (
                        'Claim Your 20% Discount'
                      )}
                    </Button>
                  </form>

                  {/* Trust Indicators */}
                  <div className="text-center space-y-2 pt-2 border-t border-momta-slate-dark/20">
                    <div className="flex items-center justify-center gap-2 text-xs text-momta-slate-dark">
                      <Shield className="w-3 h-3" />
                      <span>Secure & encrypted. GDPR compliant.</span>
                    </div>
                    <p className="text-xs text-momta-slate-dark">
                      We respect your privacy. No spam, ever.
                    </p>
                    <p className="text-xs text-momta-slate-dark">
                      Questions? Contact us at <span className="text-momta-blue-light">support@momta.org</span>
                    </p>
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}