import { useState, useCallback } from 'react';
import { z } from 'zod';

interface ValidationError {
  path: string[];
  message: string;
}

interface UseFormValidationProps<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void>;
}

export function useFormValidation<T>({ schema, onSubmit }: UseFormValidationProps<T>) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback(async (data: unknown) => {
    try {
      const validData = await schema.parseAsync(data);
      setErrors([]);
      return { success: true, data: validData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.errors);
        return { success: false, errors: error.errors };
      }
      return { success: false, errors: [{ path: [], message: 'Validation failed' }] };
    }
  }, [schema]);

  const handleSubmit = useCallback(async (data: unknown) => {
    setIsSubmitting(true);
    try {
      const validation = await validate(data);
      if (validation.success && validation.data) {
        await onSubmit(validation.data as T);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors([{ path: [], message: 'Submission failed' }]);
    } finally {
      setIsSubmitting(false);
    }
  }, [validate, onSubmit]);

  return {
    errors,
    isSubmitting,
    validate,
    handleSubmit,
    getFieldError: (field: string) => errors.find(error => error.path[0] === field)?.message
  };
}
