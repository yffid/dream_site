import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name cannot exceed 50 characters' })
    .regex(/^[\p{L}\s'-]+$/u, { 
      message: 'Name can only contain letters, spaces, hyphens and apostrophes'
    }),
  
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .min(5, { message: 'Email must be at least 5 characters' })
    .max(100, { message: 'Email cannot exceed 100 characters' }),
  
  company: z
    .string()
    .max(100, { message: 'Company name cannot exceed 100 characters' })
    .optional(),
  
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(1000, { message: 'Message cannot exceed 1000 characters' }),
  
  // Honeypot field - should always be empty
  website: z
    .string()
    .max(0, { message: 'Invalid submission' })
    .optional(),
  
  // Timestamp validation to prevent rapid submissions
  timestamp: z
    .number()
    .min(Date.now() - 1000 * 60 * 60, { message: 'Invalid timestamp' })
    .max(Date.now(), { message: 'Invalid timestamp' })
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
