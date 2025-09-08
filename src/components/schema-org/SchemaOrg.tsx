import { type Organization, type WebSite, type WithContext } from 'schema-dts';

interface SchemaOrgProps {
  type: 'Organization' | 'WebSite' | 'Product';
  data: Record<string, any>;
}

const DEFAULT_ORG_DATA = {
  name: 'Momta Robotics',
  alternateName: 'مومتا للروبوتات',
  url: 'https://momta.ai',
  logo: 'https://momta.ai/logo.png',
  sameAs: [
    'https://twitter.com/MomtaRobotics',
    'https://linkedin.com/company/momta',
    'https://github.com/momta'
  ]
} as const;

export function OrganizationSchema(): JSX.Element {
  const organizationData: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    ...DEFAULT_ORG_DATA,
    description: {
      '@language': 'en',
      '@value': 'Leading AI & Robotics Innovation'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contact@momta.ai',
      availableLanguage: ['English', 'Arabic']
    },
    foundingDate: '2024',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AE'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationData)
      }}
    />
  );
}

export function WebsiteSchema(): JSX.Element {
  const websiteData: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: DEFAULT_ORG_DATA.name,
    alternateName: DEFAULT_ORG_DATA.alternateName,
    url: DEFAULT_ORG_DATA.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://momta.ai/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(websiteData)
      }}
    />
  );
}

export function ProductSchema({
  name,
  description,
  image,
  category,
  applicationCategory,
  price,
  currency = 'USD'
}: {
  name: string;
  description: string;
  image: string;
  category: string;
  applicationCategory: string;
  price?: number;
  currency?: string;
}): JSX.Element {
  const productData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    image,
    applicationCategory,
    category,
    operatingSystem: 'All',
    ...(price && {
      offers: {
        '@type': 'Offer',
        price,
        priceCurrency: currency,
        priceValidUntil: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ).toISOString()
      }
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(productData)
      }}
    />
  );
}
