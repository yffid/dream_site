import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { ContactFormData, contactFormSchema } from '@/lib/validations/contact-form';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ContactFormProps {
  locale?: 'en-US' | 'ar-AE';
}

const translations = {
  'en-US': {
    name: 'Full Name',
    email: 'Email Address',
    company: 'Company (Optional)',
    message: 'Your Message',
    submit: 'Send Message',
    success: 'Thank you! We will get back to you soon.',
    error: 'An error occurred. Please try again.'
  },
  'ar-AE': {
    name: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    company: 'الشركة (اختياري)',
    message: 'رسالتك',
    submit: 'إرسال الرسالة',
    success: 'شكراً لك! سنتواصل معك قريباً.',
    error: 'حدث خطأ. يرجى المحاولة مرة أخرى.'
  }
};

export function ContactForm({ locale = 'en-US' }: ContactFormProps) {
  const t = translations[locale];
  const isRTL = locale === 'ar-AE';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      timestamp: Date.now()
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);

      // Spam prevention checks
      if (data.website || Date.now() - data.timestamp > 1000 * 60 * 60) {
        throw new Error('Invalid submission');
      }

      // Additional spam prevention - check for common spam patterns
      const spamPatterns = [
        /\[url=/i,
        /\[link=/i,
        /https?:\/\//i,
        /www\./i,
        /viagra/i,
        /casino/i
      ];

      if (spamPatterns.some(pattern => pattern.test(data.message))) {
        throw new Error('Spam detected');
      }

      // Submit to Supabase
      const { error } = await supabase
        .from('contacts')
        .insert([
          {
            name: data.name,
            email: data.email,
            company: data.company,
            message: data.message
          }
        ]);

      if (error) throw error;

      setSubmitStatus('success');
      reset();

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);

    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-2xl mx-auto ${isRTL ? 'rtl' : 'ltr'}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Hidden honeypot field */}
        <div className="hidden">
          <input
            type="text"
            {...register('website')}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Name field */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            {t.name}
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.name && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-500"
            >
              {errors.name.message}
            </motion.p>
          )}
        </div>

        {/* Email field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            {t.email}
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.email && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-500"
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>

        {/* Company field */}
        <div className="space-y-2">
          <label htmlFor="company" className="block text-sm font-medium">
            {t.company}
          </label>
          <input
            type="text"
            id="company"
            {...register('company')}
            className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>

        {/* Message field */}
        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium">
            {t.message}
          </label>
          <textarea
            id="message"
            {...register('message')}
            rows={5}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.message ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-500"
            >
              {errors.message.message}
            </motion.p>
          )}
        </div>

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-6 py-3 text-white rounded-lg transition-all ${
            isSubmitting
              ? 'bg-gray-400'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }`}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        >
          {isSubmitting ? (
            <motion.div
              className="flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </motion.div>
          ) : (
            t.submit
          )}
        </motion.button>

        {/* Status messages */}
        <AnimatePresence mode="wait">
          {submitStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-lg text-center ${
                submitStatus === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {submitStatus === 'success' ? t.success : t.error}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}
