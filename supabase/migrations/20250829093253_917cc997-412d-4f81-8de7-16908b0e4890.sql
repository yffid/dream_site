-- Create waitlist table for Momta 2028 early access
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined')),
  discount_code TEXT DEFAULT substring(md5(random()::text) from 1 for 8),
  source TEXT DEFAULT 'website'
);

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create policies for security
-- Allow anyone to insert (rate-limited by API)
CREATE POLICY "Anyone can register for waitlist" 
  ON public.waitlist 
  FOR INSERT 
  WITH CHECK (true);

-- Allow public read access (for admin dashboard counts, etc.)
CREATE POLICY "Public read access for waitlist" 
  ON public.waitlist 
  FOR SELECT 
  USING (true);

-- Create index for better performance on email lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist (email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist (created_at DESC);

-- Create a function to get waitlist stats
CREATE OR REPLACE FUNCTION public.get_waitlist_stats()
RETURNS JSON
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT json_build_object(
    'total', COUNT(*),
    'today', COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE),
    'this_week', COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days')
  )
  FROM public.waitlist;
$$;

-- Create notification function for new signups (optional webhook)
CREATE OR REPLACE FUNCTION public.notify_new_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create audit log table for tracking (optional but recommended)
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  event_type TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  details JSONB
);

-- Enable RLS on audit log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Only allow system to insert audit logs
CREATE POLICY "System only audit log access" 
  ON public.audit_log 
  FOR ALL 
  USING (false) 
  WITH CHECK (false);

-- Create the trigger (commented out for now, uncomment when audit_log is needed)
-- CREATE TRIGGER trigger_notify_new_signup
--   AFTER INSERT ON public.waitlist
--   FOR EACH ROW
--   EXECUTE FUNCTION public.notify_new_signup();