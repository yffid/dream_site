import { Metadata } from 'next';

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  locale?: 'en-US' | 'ar-AE';
  path?: string;
  type?: 'website' | 'article' | 'product';
  image?: string;
}

const DEFAULT_META = {
  title: {
    'en-US': 'Momta Robotics - Leading AI & Robotics Innovation',
    'ar-AE': 'مومتا للروبوتات - رواد الابتكار في الذكاء الاصطناعي والروبوتات'
  },
  description: {
    'en-US': 'Momta Robotics pioneers the future of AI and robotics with enterprise-grade automation solutions. Join us in shaping tomorrow's technology.',
    'ar-AE': 'مومتا للروبوتات تقود مستقبل الذكاء الاصطناعي والروبوتات مع حلول الأتمتة المتطورة للشركات. انضم إلينا في تشكيل تكنولوجيا الغد.'
  },
  keywords: {
    'en-US': ['momta', 'robotics', 'ai', 'automation', 'enterprise solutions'],
    'ar-AE': ['مومتا', 'روبوتات', 'ذكاء اصطناعي', 'أتمتة', 'حلول للشركات']
  }
};

export function generateMetadata({
  title,
  description,
  keywords = [],
  locale = 'ar-AE',
  path = '/',
  type = 'website',
  image = '/og-image.jpg'
}: GenerateMetadataProps): Metadata {
  const isArabic = locale.startsWith('ar');
  const fullTitle = title 
    ? `${title} | ${isArabic ? 'مومتا للروبوتات' : 'Momta Robotics'}`
    : DEFAULT_META.title[locale];

  const metaDescription = description || DEFAULT_META.description[locale];
  const metaKeywords = [...DEFAULT_META.keywords[locale], ...keywords];
  const canonicalUrl = `https://momta.ai${path}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type === 'website' ? 'WebSite' : type,
    name: 'Momta Robotics',
    alternateName: 'مومتا للروبوتات',
    url: canonicalUrl,
    logo: 'https://momta.ai/logo.png',
    sameAs: [
      'https://twitter.com/momtarobotics',
      'https://linkedin.com/company/momta'
    ]
  };

  return {
    title: fullTitle,
    description: metaDescription,
    keywords: metaKeywords.join(', '),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': `https://momta.ai/en-US${path}`,
        'ar-AE': `https://momta.ai/ar-AE${path}`
      }
    },
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: isArabic ? 'مومتا للروبوتات' : 'Momta Robotics',
      images: [{ url: image }],
      locale: locale,
      type: type
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDescription,
      images: [image],
      creator: '@momtarobotics'
    },
    other: {
      'google-site-verification': 'your-verification-code',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large'
      }
    }
  };
}
