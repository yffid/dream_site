import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  locale?: 'ar' | 'en';
}

export default function SEOHead({
  title = 'Momta Robotics - مومتا للروبوتات',
  description = 'Momta Robotics - Leading the future of robotics and AI technology | مومتا للروبوتات - نقود مستقبل الروبوتات والذكاء الاصطناعي',
  keywords = 'momta,مومتا,robotics,روبوتات,AI,ذكاء اصطناعي,technology,تكنولوجيا',
  image = '/og-image.jpg',
  url = 'https://momta.ai',
  locale = 'ar'
}: SEOProps) {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* OpenGraph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={locale} />
      <meta property="og:locale:alternate" content={locale === 'ar' ? 'en' : 'ar'} />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Language and Direction */}
      <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} />

      {/* Alternate Language Links */}
      <link 
        rel="alternate" 
        hrefLang="ar" 
        href={`${url}/ar`}
      />
      <link 
        rel="alternate" 
        hrefLang="en" 
        href={`${url}/en`}
      />
      <link 
        rel="canonical" 
        href={url} 
      />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Momta Robotics",
          "alternateName": "مومتا للروبوتات",
          "url": "https://momta.ai",
          "logo": "https://momta.ai/logo.png",
          "sameAs": [
            "https://twitter.com/momtarobotics",
            "https://linkedin.com/company/momta"
          ]
        })}
      </script>
    </Helmet>
  );
}
