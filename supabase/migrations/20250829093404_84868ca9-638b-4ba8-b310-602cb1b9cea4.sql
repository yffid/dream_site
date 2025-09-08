-- Fix search_path security issues for functions
-- This prevents potential security vulnerabilities from search_path manipulation

-- Update get_waitlist_stats function with secure search_path
CREATE OR REPLACE FUNCTION public.get_waitlist_stats()
RETURNS JSON
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'total', COUNT(*),
    'today', COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE),
    'this_week', COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days')
  )
  FROM public.waitlist;
$$;

-- Update notify_new_signup function with secure search_path
CREATE OR REPLACE FUNCTION public.notify_new_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- You can add webhook logic here later
  -- For now, just log the event
  INSERT INTO public.audit_log (event_type, table_name, record_id, details)
  VALUES ('INSERT', 'waitlist', NEW.id, json_build_object('email', NEW.email, 'name', NEW.name));
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Don't fail the insert if audit log fails
    RETURN NEW;
END;
$$;