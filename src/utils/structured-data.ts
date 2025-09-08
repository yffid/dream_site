// Structured data for SEO and rich snippets
export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Momta Technology",
  "alternateName": "Momta 2028",
  "url": "https://momta.org",
  "logo": "https://momta.org/logo.png",
  "description": "Leading manufacturer of AI robots and friendly robotics technology. Specializing in affordable, intelligent robots for home automation and personal assistance.",
  "foundingDate": "2024",
  "industry": ["Artificial Intelligence", "Robotics", "Home Automation", "Consumer Electronics"],
  "keywords": "AI robots, friendly robots, cheap robots, best robots, future robotics, robot technology",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "support@momta.org",
    "contactType": "customer service",
    "availableLanguage": ["English"],
    "areaServed": "Worldwide"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  },
  "sameAs": [
    "https://twitter.com/momta2028",
    "https://linkedin.com/company/momta-technology"
  ]
};

export const productStructuredData = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Momta AI Robots - Friendly Home Automation Robots",
  "description": "Advanced AI robots designed for home automation and personal assistance. Affordable, intelligent, and user-friendly robots launching in 2028.",
  "category": ["Artificial Intelligence", "Robotics", "Home Automation", "Smart Home"],
  "keywords": "AI robots, friendly robots, cheap robots, best robots, home automation robots",
  "brand": {
    "@type": "Brand",
    "name": "Momta Technology"
  },
  "audience": {
    "@type": "Audience",
    "audienceType": "Consumers interested in AI robots and home automation"
  },
  "releaseDate": "2028-01-01",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/PreOrder",
    "priceValidUntil": "2028-01-01",
    "url": "https://momta.org",
    "discount": "20% early bird discount for waitlist members"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "1000",
    "bestRating": "5",
    "worstRating": "1"
  }
};

export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Momta 2028 - AI Robots & Robotics Technology",
  "url": "https://momta.org",
  "description": "Official website for Momta 2028 - Leading AI robots and friendly robotics technology for home automation.",
  "keywords": "AI robots, friendly robots, cheap robots, best robots, future robotics, Momta",
  "publisher": {
    "@type": "Organization",
    "name": "Momta Technology"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://momta.org/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "mainEntity": {
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are Momta AI robots?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Momta AI robots are friendly, intelligent home automation robots designed to assist with daily tasks while providing a calming, serene experience."
        }
      },
      {
        "@type": "Question", 
        "name": "When will Momta robots be available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Momta robots will launch in 2028. Join our waitlist for exclusive early access and a 20% discount."
        }
      },
      {
        "@type": "Question",
        "name": "Are Momta robots affordable?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Momta robots are designed to be accessible and affordable while maintaining premium quality and advanced AI capabilities."
        }
      }
    ]
  }
};

// Updates structured data
export const updateStructuredData = (updates: any[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Momta Technology Updates",
  "description": "Latest updates and news from Momta in AI robotics and technology development",
  "itemListElement": updates.map((update, index) => ({
    "@type": "Article",
    "position": index + 1,
    "headline": update.title,
    "description": update.excerpt || update.content?.substring(0, 200),
    "author": {
      "@type": "Organization",
      "name": "Momta Technology"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "Momta Technology",
      "logo": {
        "@type": "ImageObject",
        "url": "https://momta.org/logo.png"
      }
    },
    "datePublished": update.published_at,
    "dateModified": update.updated_at,
    "image": update.image_url || "https://momta.org/og-image.jpg",
    "url": `https://momta.org/updates/${update.slug}`,
    "keywords": update.keywords?.join(", ") || "AI, robotics, technology, momta"
  }))
});

