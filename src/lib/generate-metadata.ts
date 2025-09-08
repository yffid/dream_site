import { Metadata } from 'next';
import { z } from 'zod';

// Type-safe locale configuration
const LocaleSchema = z.enum(['en-US', 'ar-AE']);
type Locale = z.infer<typeof LocaleSchema>;

// Type-safe page types
const PageTypeSchema = z.enum(['website', 'article', 'product', 'organization']);
type PageType = z.infer<typeof PageTypeSchema>;

interface MetadataConfig {
  title?: string;
  description?: string;
  path: string;
  locale: Locale;
  type?: PageType;
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  keywords?: string[];
}

const DEFAULT_CONFIG = {
  siteName: {
    'en-US': 'Momta Robotics',
    'ar-AE': 'مومتا للروبوتات'
  },
  description: {
    'en-US': 'Leading AI & Robotics Innovation | Enterprise Automation Solutions',
    'ar-AE': 'ريادة الابتكار في الذكاء الاصطناعي والروبوتات | حلول الأتمتة للمؤسسات'
  },
  keywords: {
    'en-US': ['momta', 'robotics', 'ai', 'automation', 'enterprise solutions'],
    'ar-AE': ['مومتا', 'روبوتات', 'ذكاء اصطناعي', 'أتمتة', 'حلول مؤسسات']
  }
} as const;

const SITE_URL = 'https://momta.ai';

export function generateMetadata({
  title,
  description,
  path,
  locale,
  type = 'website',
  image = '/og-image.jpg',
  publishedTime,
  modifiedTime,
  authors = [],
  keywords = []
}: MetadataConfig): Metadata {
  const isArabic = locale === 'ar-AE';
  const fullTitle = title 
    ? `${title} | ${DEFAULT_CONFIG.siteName[locale]}`
    : DEFAULT_CONFIG.siteName[locale];
    
  const metaDescription = description || DEFAULT_CONFIG.description[locale];
  const metaKeywords = [...DEFAULT_CONFIG.keywords[locale], ...keywords];
  const canonicalUrl = `${SITE_URL}${path}`;
  
  // Base metadata
  const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: fullTitle,
    description: metaDescription,
    keywords: metaKeywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': `${SITE_URL}/en-US${path}`,
        'ar-AE': `${SITE_URL}/ar-AE${path}`
      }
    },
    openGraph: {
      type,
      locale,
      url: canonicalUrl,
      siteName: DEFAULT_CONFIG.siteName[locale],
      title: fullTitle,
      description: metaDescription,
      images: [
        {
          url: image.startsWith('http') ? image : `${SITE_URL}${image}`,
          alt: fullTitle,
          width: 1200,
          height: 630
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDescription,
      images: [image],
      creator: '@MomtaRobotics'
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  };

  // Add article-specific metadata
  if (type === 'article' && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime: modifiedTime || publishedTime,
      authors: authors.length ? authors : [DEFAULT_CONFIG.siteName[locale]]
    };
  }

  return metadata;
}
