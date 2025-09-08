import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Initialize Supabase client
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SITE_URL = 'https://momta.ai';
const LOCALES = ['en-US', 'ar-AE'] as const;

interface Route {
  path: string;
  lastModified?: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  priority?: number;
}

// Static routes that should be in sitemap
const STATIC_ROUTES: Route[] = [
  { path: '/', priority: 1.0, changeFrequency: 'daily' },
  { path: '/products', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/solutions', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
];

async function getDynamicRoutes(): Promise<Route[]> {
  const routes: Route[] = [];

  // Get blog posts
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('status', 'published');

  if (posts) {
    posts.forEach((post) => {
      routes.push({
        path: `/blog/${post.slug}`,
        lastModified: post.updated_at,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  }

  // Get product pages
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('status', 'published');

  if (products) {
    products.forEach((product) => {
      routes.push({
        path: `/products/${product.slug}`,
        lastModified: product.updated_at,
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    });
  }

  return routes;
}

export async function generateSitemap(): Promise<string> {
  const dynamicRoutes = await getDynamicRoutes();
  const allRoutes = [...STATIC_ROUTES, ...dynamicRoutes];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${allRoutes
    .map((route) => {
      const loc = `${SITE_URL}${route.path}`;
      const lastmod = route.lastModified
        ? new Date(route.lastModified).toISOString()
        : new Date().toISOString();

      return `
    <url>
      <loc>${loc}</loc>
      <lastmod>${lastmod}</lastmod>
      ${
        route.changeFrequency
          ? `<changefreq>${route.changeFrequency}</changefreq>`
          : ''
      }
      ${route.priority ? `<priority>${route.priority}</priority>` : ''}
      ${LOCALES.map(
        (locale) => `
      <xhtml:link 
        rel="alternate"
        hreflang="${locale}"
        href="${SITE_URL}/${locale}${route.path}"/>`
      ).join('')}
    </url>`;
    })
    .join('')}
</urlset>`;
}

// Use in app/sitemap.ts
export async function GET() {
  const sitemap = await generateSitemap();
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    },
  });
}
