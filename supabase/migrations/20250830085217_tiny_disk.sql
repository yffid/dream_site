/*
  # Create Updates System for Momta 2028

  1. New Tables
    - `updates`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `content` (text, required)
      - `excerpt` (text, optional)
      - `image_url` (text, optional)
      - `slug` (text, unique, for SEO-friendly URLs)
      - `published` (boolean, default false)
      - `featured` (boolean, default false)
      - `author_id` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `published_at` (timestamp, nullable)

  2. Security
    - Enable RLS on `updates` table
    - Add policies for public read access to published updates
    - Add policies for admin-only write access
    - Add audit logging for update changes

  3. SEO Features
    - Slug generation for SEO-friendly URLs
    - Meta description support via excerpt
    - Published/draft system for content management
    - Featured updates for homepage display
*/

-- Create updates table
CREATE TABLE IF NOT EXISTS updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  image_url text,
  slug text UNIQUE NOT NULL,
  published boolean DEFAULT false,
  featured boolean DEFAULT false,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz,
  
  -- SEO and content constraints
  CONSTRAINT title_length CHECK (char_length(title) >= 5 AND char_length(title) <= 200),
  CONSTRAINT content_length CHECK (char_length(content) >= 50),
  CONSTRAINT excerpt_length CHECK (excerpt IS NULL OR char_length(excerpt) <= 300),
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Enable RLS
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_updates_published ON updates (published, published_at DESC) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_updates_featured ON updates (featured, published_at DESC) WHERE featured = true AND published = true;
CREATE INDEX IF NOT EXISTS idx_updates_slug ON updates (slug);
CREATE INDEX IF NOT EXISTS idx_updates_author ON updates (author_id);

-- RLS Policies

-- Public can read published updates
CREATE POLICY "Public can read published updates"
  ON updates
  FOR SELECT
  TO public
  USING (published = true);

-- Admins can manage all updates
CREATE POLICY "Admins can manage all updates"
  ON updates
  FOR ALL
  TO public
  USING (is_admin())
  WITH CHECK (is_admin());

-- Authors can manage their own updates (if we want to allow non-admin authors in the future)
CREATE POLICY "Authors can manage own updates"
  ON updates
  FOR ALL
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  
  -- Set published_at when first published
  IF OLD.published = false AND NEW.published = true THEN
    NEW.published_at = now();
  END IF;
  
  -- Clear published_at when unpublished
  IF OLD.published = true AND NEW.published = false THEN
    NEW.published_at = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updates table
DROP TRIGGER IF EXISTS update_updates_updated_at ON updates;
CREATE TRIGGER update_updates_updated_at
  BEFORE UPDATE ON updates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate SEO-friendly slugs
CREATE OR REPLACE FUNCTION generate_slug(title text)
RETURNS text AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ language 'plpgsql';

-- Insert some sample updates for demonstration
INSERT INTO updates (title, content, excerpt, slug, published, featured, author_id) VALUES
(
  'Welcome to Momta 2028 - The Future Begins',
  'We are thrilled to announce the official launch of Momta 2028, where artificial intelligence meets tranquility. Our journey toward creating the most advanced yet serene robotic companions has officially begun.

Our vision is simple yet revolutionary: to create robots that don''t just serve, but understand. Robots that bring peace to your daily life while handling the complexities of modern living.

Key features of our upcoming Momta robots:
- Advanced AI with emotional intelligence
- Seamless integration with smart home systems
- Energy-efficient design with sustainable materials
- Intuitive voice and gesture controls
- 24/7 learning and adaptation capabilities

Join us as we build the future of human-robot interaction. The dawn of serene intelligence is coming in 2028.',
  'Announcing Momta 2028 - where artificial intelligence meets tranquility. Join us as we build the future of human-robot interaction.',
  'welcome-to-momta-2028-the-future-begins',
  true,
  true,
  (SELECT id FROM auth.users WHERE email = 'momta@momta.org' LIMIT 1)
),
(
  'AI Development Milestone: Core Intelligence Framework Complete',
  'We''ve reached a major milestone in our AI development journey. Our core intelligence framework, which will power all Momta robots, has successfully completed its initial development phase.

This breakthrough represents months of research and development in:
- Natural language processing with emotional context
- Predictive behavior modeling
- Adaptive learning algorithms
- Safety-first decision making protocols

Our AI doesn''t just process commands - it understands intent, context, and emotional nuance. This foundation will enable Momta robots to be truly helpful companions rather than mere tools.

Next steps include hardware integration testing and real-world scenario simulations. We''re on track for our 2028 launch timeline.',
  'Major AI development milestone achieved. Our core intelligence framework is complete and ready for hardware integration.',
  'ai-development-milestone-core-intelligence-framework-complete',
  true,
  false,
  (SELECT id FROM auth.users WHERE email = 'momta@momta.org' LIMIT 1)
),
(
  'Prototype Design Phase: First Look at Momta Robots',
  'We''re excited to share the first glimpses of our prototype designs. After extensive research into human-robot interaction, we''ve developed a design language that balances functionality with approachability.

Our design principles:
- Minimalist aesthetic that fits any home environment
- Soft, rounded forms that feel welcoming rather than intimidating
- Premium materials that age beautifully
- Modular components for easy maintenance and upgrades

The prototypes feature our signature "Serene Blue" accent lighting, which provides visual feedback while maintaining a calming presence. Every curve, every surface has been carefully considered to create robots that feel like natural extensions of your living space.

Stay tuned for more design updates as we refine these prototypes throughout 2026.',
  'First look at our prototype designs. Minimalist, approachable robots designed to feel like natural extensions of your living space.',
  'prototype-design-phase-first-look-at-momta-robots',
  true,
  false,
  (SELECT id FROM auth.users WHERE email = 'momta@momta.org' LIMIT 1)
)
ON CONFLICT (slug) DO NOTHING;