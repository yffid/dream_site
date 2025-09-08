-- Initial content categories
INSERT INTO categories (slug) VALUES
  ('ai-solutions'),
  ('robotics'),
  ('case-studies'),
  ('company-news');

-- Category translations
INSERT INTO category_translations (category_id, language, name, description) 
SELECT 
  c.id,
  'en-US',
  CASE 
    WHEN c.slug = 'ai-solutions' THEN 'AI Solutions'
    WHEN c.slug = 'robotics' THEN 'Robotics'
    WHEN c.slug = 'case-studies' THEN 'Case Studies'
    WHEN c.slug = 'company-news' THEN 'Company News'
  END,
  CASE 
    WHEN c.slug = 'ai-solutions' THEN 'Enterprise AI solutions and innovations'
    WHEN c.slug = 'robotics' THEN 'Advanced robotics and automation'
    WHEN c.slug = 'case-studies' THEN 'Success stories and implementations'
    WHEN c.slug = 'company-news' THEN 'Latest updates from Momta'
  END
FROM categories c;

INSERT INTO category_translations (category_id, language, name, description)
SELECT 
  c.id,
  'ar-AE',
  CASE 
    WHEN c.slug = 'ai-solutions' THEN 'حلول الذكاء الاصطناعي'
    WHEN c.slug = 'robotics' THEN 'الروبوتات'
    WHEN c.slug = 'case-studies' THEN 'دراسات الحالة'
    WHEN c.slug = 'company-news' THEN 'أخبار الشركة'
  END,
  CASE 
    WHEN c.slug = 'ai-solutions' THEN 'حلول وابتكارات الذكاء الاصطناعي للمؤسسات'
    WHEN c.slug = 'robotics' THEN 'الروبوتات المتقدمة والأتمتة'
    WHEN c.slug = 'case-studies' THEN 'قصص النجاح والتنفيذ'
    WHEN c.slug = 'company-news' THEN 'آخر التحديثات من مومتا'
  END
FROM categories c;

-- Initial blog posts
INSERT INTO content (slug, type, status) VALUES
  ('future-of-ai-robotics', 'blog', 'published'),
  ('automation-revolution', 'blog', 'published'),
  ('industrial-solutions', 'product', 'published');

-- Content translations
INSERT INTO content_translations (content_id, language, title, description, content)
SELECT 
  c.id,
  'en-US',
  CASE 
    WHEN c.slug = 'future-of-ai-robotics' THEN 'The Future of AI and Robotics'
    WHEN c.slug = 'automation-revolution' THEN 'The Automation Revolution'
    WHEN c.slug = 'industrial-solutions' THEN 'Industrial Automation Solutions'
  END,
  CASE 
    WHEN c.slug = 'future-of-ai-robotics' THEN 'Exploring the future of AI and robotics in manufacturing'
    WHEN c.slug = 'automation-revolution' THEN 'How automation is transforming industries'
    WHEN c.slug = 'industrial-solutions' THEN 'Complete industrial automation solutions'
  END,
  CASE 
    WHEN c.slug = 'future-of-ai-robotics' THEN '{"blocks":[{"type":"paragraph","text":"The future of AI and robotics..."}]}'
    WHEN c.slug = 'automation-revolution' THEN '{"blocks":[{"type":"paragraph","text":"The automation revolution..."}]}'
    WHEN c.slug = 'industrial-solutions' THEN '{"blocks":[{"type":"paragraph","text":"Our industrial solutions..."}]}'
  END::jsonb
FROM content c;

INSERT INTO content_translations (content_id, language, title, description, content)
SELECT 
  c.id,
  'ar-AE',
  CASE 
    WHEN c.slug = 'future-of-ai-robotics' THEN 'مستقبل الذكاء الاصطناعي والروبوتات'
    WHEN c.slug = 'automation-revolution' THEN 'ثورة الأتمتة'
    WHEN c.slug = 'industrial-solutions' THEN 'حلول الأتمتة الصناعية'
  END,
  CASE 
    WHEN c.slug = 'future-of-ai-robotics' THEN 'استكشاف مستقبل الذكاء الاصطناعي والروبوتات في التصنيع'
    WHEN c.slug = 'automation-revolution' THEN 'كيف تغير الأتمتة الصناعات'
    WHEN c.slug = 'industrial-solutions' THEN 'حلول الأتمتة الصناعية الشاملة'
  END,
  CASE 
    WHEN c.slug = 'future-of-ai-robotics' THEN '{"blocks":[{"type":"paragraph","text":"مستقبل الذكاء الاصطناعي والروبوتات..."}]}'
    WHEN c.slug = 'automation-revolution' THEN '{"blocks":[{"type":"paragraph","text":"ثورة الأتمتة..."}]}'
    WHEN c.slug = 'industrial-solutions' THEN '{"blocks":[{"type":"paragraph","text":"حلولنا الصناعية..."}]}'
  END::jsonb
FROM content c;
