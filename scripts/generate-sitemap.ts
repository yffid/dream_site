import fs from 'fs';
import { createClient } from '@/integrations/supabase/client';

const SITE_URL = 'https://momta.ai';

async function generateSitemap() {
  const supabase = createClient();
  
  // Get dynamic routes from database if needed
  const { data: updates } = await supabase
    .from('updates')
    .select('slug')
    .order('created_at', { ascending: false });

  const staticPages = [
    '',
    '/research',
    '/updates',
    '/ar',
    '/ar/research',
    '/ar/updates',
  ];

  const dynamicPages = updates?.map(update => `/updates/${update.slug}`) || [];
  const arDynamicPages = updates?.map(update => `/ar/updates/${update.slug}`) || [];

  const pages = [...staticPages, ...dynamicPages, ...arDynamicPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xhtml="http://www.w3.org/1999/xhtml">
      ${pages.map(page => `
        <url>
          <loc>${SITE_URL}${page}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>${page === '' ? '1.0' : '0.8'}</priority>
          ${page.startsWith('/ar') ? `
          <xhtml:link 
            rel="alternate" 
            hreflang="en" 
            href="${SITE_URL}${page.replace('/ar', '')}"
          />` : `
          <xhtml:link 
            rel="alternate" 
            hreflang="ar" 
            href="${SITE_URL}/ar${page}"
          />`}
        </url>
      `).join('')}
    </urlset>`;

  fs.writeFileSync('./public/sitemap.xml', sitemap);
  console.log('Sitemap generated successfully');
}

generateSitemap();