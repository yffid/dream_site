import { supabase } from '@/integrations/supabase/client';

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export const generateSitemap = async (): Promise<string> => {
  const baseUrl = 'https://momta.org';
  const urls: SitemapUrl[] = [];

  // Static pages
  const staticPages = [
    { path: '', changefreq: 'weekly' as const, priority: 1.0 },
    { path: '/updates', changefreq: 'daily' as const, priority: 0.9 },
    { path: '/research', changefreq: 'weekly' as const, priority: 0.9 },
    { path: '/auth', changefreq: 'monthly' as const, priority: 0.3 },
  ];

  staticPages.forEach(page => {
    urls.push({
      loc: `${baseUrl}${page.path}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: page.changefreq,
      priority: page.priority
    });
  });

  try {
    // Fetch updates
    const { data: updates } = await supabase
      .from('updates')
      .select('slug, updated_at')
      .eq('published', true);

    if (updates) {
      updates.forEach(update => {
        urls.push({
          loc: `${baseUrl}/updates/${update.slug}`,
          lastmod: new Date(update.updated_at).toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: 0.7
        });
      });
    }

    // Fetch research
    const { data: research } = await supabase
      .from('research')
      .select('slug, updated_at')
      .eq('published', true);

    if (research) {
      research.forEach(item => {
        urls.push({
          loc: `${baseUrl}/research/${item.slug}`,
          lastmod: new Date(item.updated_at).toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: 0.8
        });
      });
    }
  } catch (error) {
    console.error('Error fetching dynamic URLs for sitemap:', error);
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

export const downloadSitemap = async () => {
  try {
    const sitemapXml = await generateSitemap();
    
    const blob = new Blob([sitemapXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return false;
  }
};

// Generate robots.txt content
export const generateRobotsTxt = (): string => {
  return `User-agent: *
Allow: /

# Block admin areas
Disallow: /admin
Disallow: /auth

# Allow search engines to access important pages
Allow: /updates
Allow: /research

# Sitemap location
Sitemap: https://momta.org/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1

# Specific rules for common bots
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2`;
};