import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  lang?: 'en' | 'ar';
}

export function SEOHead({
  title = 'Momta - AI & Robotics Innovation | مومتا للذكاء الاصطناعي',
  description = 'Momta: Forward-thinking technology company driving innovation in AI, robotics, and emerging technologies. مومتا: شركة تقنية رائدة في مجال الذكاء الاصطناعي والروبوتات.',
  lang = 'en'
}: SEOHeadProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://momta.ai/#organization',
        name: 'Momta',
        alternateName: 'مومتا',
        url: 'https://momta.ai',
        logo: 'https://momta.ai/logo.png',
        sameAs: [
          'https://twitter.com/momtaai',
          'https://linkedin.com/company/momta'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': 'https://momta.ai/#website',
        url: 'https://momta.ai',
        name: 'Momta',
        publisher: { '@id': 'https://momta.ai/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://momta.ai/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  };

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="مومتا,momta,robotics,روبوتات,ai,artificial intelligence,ذكاء اصطناعي" />
      
      <link rel="canonical" href="https://momta.ai" />
      <link rel="alternate" hrefLang="ar" href="https://momta.ai/ar" />
      <link rel="alternate" hrefLang="en" href="https://momta.ai" />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://momta.ai" />
      <meta property="og:image" content="https://momta.ai/og-image.png" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@momtaai" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://momta.ai/twitter-image.png" />
      
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
