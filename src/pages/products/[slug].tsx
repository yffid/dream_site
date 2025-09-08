import { Suspense } from 'react';
import { generateMetadata } from '@/utils/metadata';
import Image from 'next/image';
import { GlassCard } from '@/components/ui/glass-card';
import { NeuralCore } from '@/components/ui/neural-core';

interface ProductPageProps {
  params: {
    lang: 'en-US' | 'ar-AE';
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { lang, slug } = params;
  
  return generateMetadata({
    title: lang === 'ar-AE' ? 'حلول الروبوتات المتقدمة' : 'Advanced Robotics Solutions',
    description: lang === 'ar-AE' 
      ? 'اكتشف حلول الروبوتات المتطورة من مومتا. حلول مبتكرة تجمع بين الذكاء الاصطناعي والأتمتة لتحسين كفاءة عملك.'
      : 'Discover Momta's advanced robotics solutions. Innovative solutions combining AI and automation to optimize your business efficiency.',
    keywords: ['robotics', 'automation', 'AI solutions'],
    locale: lang,
    path: `/products/${slug}`,
    type: 'product',
    image: `/products/${slug}/hero.jpg`
  });
}

export default function ProductPage({ params }: ProductPageProps) {
  const { lang } = params;
  const isArabic = lang === 'ar-AE';

  return (
    <main className={`flex min-h-screen flex-col ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="relative h-[70vh] overflow-hidden rounded-2xl">
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-full" />}>
            <Image
              src="/product-hero.jpg"
              alt={isArabic ? "حلول الروبوتات المتقدمة" : "Advanced Robotics Solutions"}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </Suspense>
        </section>

        {/* Product Features */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <GlassCard className="p-6">
            <h3 className="text-2xl font-bold mb-4">
              {isArabic ? "الذكاء الاصطناعي المتقدم" : "Advanced AI"}
            </h3>
            <p>
              {isArabic 
                ? "خوارزميات متطورة للتعلم العميق وتحسين الأداء"
                : "Advanced deep learning algorithms for performance optimization"}
            </p>
          </GlassCard>
          
          {/* Add more feature cards */}
        </section>

        {/* Interactive Demo */}
        <section className="mt-16">
          <Suspense fallback={<div className="h-96 animate-pulse bg-gray-200" />}>
            <NeuralCore />
          </Suspense>
        </section>

        {/* Technical Specifications */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8">
            {isArabic ? "المواصفات التقنية" : "Technical Specifications"}
          </h2>
          {/* Add specifications table */}
        </section>

        {/* Call to Action */}
        <section className="mt-16 text-center">
          <h2 className="text-4xl font-bold mb-8">
            {isArabic ? "ابدأ مع مومتا اليوم" : "Get Started with Momta Today"}
          </h2>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all">
            {isArabic ? "تواصل معنا" : "Contact Us"}
          </button>
        </section>
      </div>
    </main>
  );
}
