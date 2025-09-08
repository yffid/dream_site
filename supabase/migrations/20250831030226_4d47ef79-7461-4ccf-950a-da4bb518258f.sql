-- Create updates table
CREATE TABLE public.updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  image_url text,
  slug text UNIQUE NOT NULL,
  published boolean DEFAULT true,
  featured boolean DEFAULT false,
  keywords text[] DEFAULT '{}',
  meta_description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  published_at timestamp with time zone DEFAULT now()
);

-- Create research table
CREATE TABLE public.research (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  research_url text,
  file_url text,
  slug text UNIQUE NOT NULL,
  published boolean DEFAULT true,
  keywords text[] DEFAULT '{}',
  meta_description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  published_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research ENABLE ROW LEVEL SECURITY;

-- RLS policies for updates
CREATE POLICY "Anyone can view published updates" 
ON public.updates 
FOR SELECT 
USING (published = true);

CREATE POLICY "Admins can manage all updates" 
ON public.updates 
FOR ALL 
USING (is_admin());

-- RLS policies for research
CREATE POLICY "Anyone can view published research" 
ON public.research 
FOR SELECT 
USING (published = true);

CREATE POLICY "Admins can manage all research" 
ON public.research 
FOR ALL 
USING (is_admin());

-- Create storage bucket for updates images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('updates', 'updates', true);

-- Create storage policies for updates
CREATE POLICY "Public read access for updates images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'updates');

CREATE POLICY "Admins can upload updates images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'updates' AND is_admin());

CREATE POLICY "Admins can update updates images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'updates' AND is_admin());

CREATE POLICY "Admins can delete updates images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'updates' AND is_admin());

-- Create storage bucket for research files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('research', 'research', true);

-- Create storage policies for research
CREATE POLICY "Public read access for research files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'research');

CREATE POLICY "Admins can upload research files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'research' AND is_admin());

CREATE POLICY "Admins can update research files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'research' AND is_admin());

CREATE POLICY "Admins can delete research files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'research' AND is_admin());

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_updates_updated_at 
BEFORE UPDATE ON public.updates 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_research_updated_at 
BEFORE UPDATE ON public.research 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate slug
CREATE OR REPLACE FUNCTION generate_slug(title_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        TRIM(title_text),
        '[^a-zA-Z0-9\s\-_]', '', 'g'
      ),
      '\s+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Function to extract keywords automatically
CREATE OR REPLACE FUNCTION extract_keywords(title_text TEXT, content_text TEXT)
RETURNS TEXT[] AS $$
DECLARE
  tech_keywords TEXT[] := ARRAY[
    'AI', 'artificial intelligence', 'robot', 'robotics', 'technology', 'momta', 'مومتا',
    'تقنية', 'روبوت', 'ذكاء اصطناعي', 'تكنولوجيا', 'automation', 'machine learning',
    'deep learning', 'neural network', 'smart', 'intelligent', 'autonomous'
  ];
  extracted_keywords TEXT[] := ARRAY[]::TEXT[];
  keyword TEXT;
  full_text TEXT;
BEGIN
  full_text := LOWER(title_text || ' ' || COALESCE(content_text, ''));
  
  FOREACH keyword IN ARRAY tech_keywords
  LOOP
    IF full_text LIKE '%' || LOWER(keyword) || '%' THEN
      extracted_keywords := extracted_keywords || keyword;
    END IF;
  END LOOP;
  
  RETURN extracted_keywords;
END;
$$ LANGUAGE plpgsql;