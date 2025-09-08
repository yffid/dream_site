import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ExternalLink, FileText, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SEOHead } from '@/components/seo/SEOHead';

interface Research {
  id: string;
  title: string;
  description: string;
  research_url: string | null;
  file_url: string | null;
  slug: string;
  published: boolean;
  keywords: string[];
  meta_description: string | null;
  created_at: string;
  published_at: string | null;
}

export default function Research() {
  const [research, setResearch] = useState<Research[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchResearch();
  }, []);

  const fetchResearch = async () => {
    try {
      const { data, error } = await supabase
        .from('research')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setResearch(data || []);
    } catch (error: any) {
      console.error('Error fetching research:', error);
      toast({
        title: "Error loading research",
        description: "Failed to load research. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateDescription = (description: string, maxLength: number = 200) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength).trim() + '...';
  };

  const getResourceIcon = (item: Research) => {
    if (item.file_url) return <FileText className="w-5 h-5" />;
    if (item.research_url) return <ExternalLink className="w-5 h-5" />;
    return null;
  };

  const getResourceLink = (item: Research) => {
    return item.file_url || item.research_url || '#';
  };

  const researchStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Momta Research Publications",
    "description": "Scientific research and publications from Momta in AI, robotics, and automation technology",
    "itemListElement": research.map((item, index) => ({
      "@type": "ScholarlyArticle",
      "position": index + 1,
      "name": item.title,
      "description": item.description,
      "author": {
        "@type": "Organization",
        "name": "Momta Technology"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Momta Technology"
      },
      "datePublished": item.published_at,
      "url": `https://momta.org/research/${item.slug}`,
      "keywords": item.keywords.join(", ")
    }))
  };

  if (isLoading) {
    return (
      <>
        <SEOHead
          title="Momta Research - AI & Robotics Publications | مومتا البحوث"
          description="Explore Momta's cutting-edge research in artificial intelligence, robotics, and automation. Access our scientific publications, whitepapers, and technical documentation."
          keywords="Momta research, AI research, robotics research, artificial intelligence papers, مومتا البحوث, بحوث الذكاء الاصطناعي, أوراق علمية"
        />
        <div className="min-h-screen bg-gradient-to-br from-momta-night via-momta-night-dark to-momta-night flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-momta-blue mx-auto mb-4" />
            <p className="text-momta-slate text-lg">Loading research...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Momta Research - AI & Robotics Publications | مومتا البحوث"
        description="Explore Momta's cutting-edge research in artificial intelligence, robotics, and automation. Access our scientific publications, whitepapers, and technical documentation."
        keywords="Momta research, AI research, robotics research, artificial intelligence papers, مومتا البحوث, بحوث الذكاء الاصطناعي, أوراق علمية"
        structuredData={researchStructuredData}
        canonical="https://momta.org/research"
      />
      
      <main className="min-h-screen bg-gradient-to-br from-momta-night via-momta-night-dark to-momta-night">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-16"
          >
            {/* Header */}
            <header className="text-center space-y-6">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="badge-2028"
              >
                Research & Publications
              </motion.span>
              
              <h1 className="display-1 text-momta-slate-light max-w-4xl mx-auto">
                Scientific Research & Innovation
              </h1>
              
              <p className="body-lg text-momta-slate max-w-3xl mx-auto">
                Explore our cutting-edge research in artificial intelligence, robotics, and automation. 
                Access our scientific publications, whitepapers, and technical documentation.
              </p>
            </header>

            {/* Research Grid */}
            {research.length > 0 ? (
              <section>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {research.map((item, index) => (
                    <motion.article
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      whileHover={{ y: -5 }}
                      className="group h-full"
                    >
                      <GlassCard className="h-full space-y-6 m-lens p-8">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 text-xs text-momta-slate-dark">
                            <Calendar className="w-3 h-3" />
                            <time dateTime={item.published_at!}>
                              {formatDate(item.published_at!)}
                            </time>
                          </div>
                          {getResourceIcon(item) && (
                            <div className="text-momta-blue-light">
                              {getResourceIcon(item)}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold font-poppins text-momta-slate-light group-hover:text-momta-blue-light transition-colors leading-tight">
                            {item.title}
                          </h3>
                          
                          <p className="text-sm text-momta-slate leading-relaxed">
                            {truncateDescription(item.description)}
                          </p>
                          
                          {item.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {item.keywords.slice(0, 3).map((keyword, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between pt-4">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-2 text-momta-blue-light hover:text-momta-blue p-0"
                            asChild
                          >
                            <a 
                              href={getResourceLink(item)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              {item.file_url ? 'Download' : 'View Research'}
                              <ArrowRight className="w-3 h-3" />
                            </a>
                          </Button>
                        </div>
                      </GlassCard>
                    </motion.article>
                  ))}
                </div>
              </section>
            ) : (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-center py-20"
              >
                <h2 className="display-3 text-momta-slate-light mb-4">
                  Research Coming Soon
                </h2>
                <p className="text-momta-slate mb-8">
                  We're preparing groundbreaking research publications. Stay tuned for our latest findings.
                </p>
                <Button variant="glass" asChild>
                  <a href="/">Return Home</a>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </>
  );
}