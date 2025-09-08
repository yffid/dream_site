import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight, Loader2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SEOHead } from '@/components/seo/SEOHead';
import { updateStructuredData } from '@/utils/structured-data';

interface Update {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  slug: string;
  published: boolean;
  featured: boolean;
  keywords: string[];
  meta_description: string | null;
  created_at: string;
  published_at: string | null;
}

export default function Updates() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setUpdates(data || []);
    } catch (error: any) {
      console.error('Error fetching updates:', error);
      toast({
        title: "Error loading updates",
        description: "Failed to load updates. Please try again.",
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

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  const featuredUpdate = updates.find(update => update.featured);
  const regularUpdates = updates.filter(update => !update.featured);

  if (isLoading) {
    return (
      <>
        <SEOHead
          title="Momta Updates - Latest AI Robot Development News | مومتا"
          description="Stay updated with the latest developments in Momta AI robot technology. Get insights into our progress, milestones, and breakthrough innovations in robotics and artificial intelligence."
          keywords="Momta updates, AI robot news, robotics development, artificial intelligence progress, مومتا أخبار, تطوير الروبوتات, ذكاء اصطناعي"
        />
        <div className="min-h-screen bg-gradient-to-br from-momta-night via-momta-night-dark to-momta-night flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-momta-blue mx-auto mb-4" />
            <p className="text-momta-slate text-lg">Loading updates...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Momta Updates - Latest AI Robot Development News | مومتا"
        description="Stay updated with the latest developments in Momta AI robot technology. Get insights into our progress, milestones, and breakthrough innovations in robotics and artificial intelligence."
        keywords="Momta updates, AI robot news, robotics development, artificial intelligence progress, مومتا أخبار, تطوير الروبوتات, ذكاء اصطناعي"
        structuredData={updateStructuredData(updates)}
        canonical="https://momta.org/updates"
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
                Latest Updates
              </motion.span>
              
              <h1 className="display-1 text-momta-slate-light max-w-4xl mx-auto">
                Progress Updates & Milestones
              </h1>
              
              <p className="body-lg text-momta-slate max-w-3xl mx-auto">
                Follow our journey as we develop revolutionary AI companions. 
                Stay informed about our latest breakthroughs, research findings, and development milestones.
              </p>
            </header>

            {/* Featured Update */}
            {featuredUpdate && (
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="relative"
              >
                <GlassCard className="relative overflow-hidden group m-lens">
                  <div className="absolute top-6 right-6 z-10">
                    <Badge className="bg-momta-blue/20 text-momta-blue-light border-momta-blue/30">
                      Featured
                    </Badge>
                  </div>
                  
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 text-sm text-momta-slate-dark">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={featuredUpdate.published_at!}>
                          {formatDate(featuredUpdate.published_at!)}
                        </time>
                      </div>
                      
                      <h2 className="display-3 text-momta-slate-light">
                        {featuredUpdate.title}
                      </h2>
                      
                      <p className="text-momta-slate leading-relaxed text-lg">
                        {featuredUpdate.excerpt || truncateContent(featuredUpdate.content, 250)}
                      </p>
                      
                      {featuredUpdate.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {featuredUpdate.keywords.slice(0, 4).map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <Button variant="glass" className="gap-2">
                        Read Full Update
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {featuredUpdate.image_url && (
                      <div className="relative">
                        <img
                          src={featuredUpdate.image_url}
                          alt={featuredUpdate.title}
                          className="w-full h-80 object-cover rounded-lg"
                          loading="eager"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-momta-night/30 to-transparent rounded-lg"></div>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.article>
            )}

            {/* Updates Grid */}
            {regularUpdates.length > 0 && (
              <section>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="display-3 text-momta-slate-light text-center mb-12"
                >
                  Recent Updates
                </motion.h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularUpdates.map((update, index) => (
                    <motion.article
                      key={update.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (index + 1) * 0.1, duration: 0.6 }}
                      whileHover={{ y: -5 }}
                      className="group"
                    >
                      <GlassCard className="h-full space-y-4 m-lens">
                        {update.image_url && (
                          <div className="relative -m-6 mb-4">
                            <img
                              src={update.image_url}
                              alt={update.title}
                              className="w-full h-48 object-cover rounded-t-momta-xl"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-momta-night/40 to-transparent rounded-t-momta-xl"></div>
                          </div>
                        )}
                        
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-xs text-momta-slate-dark">
                            <Calendar className="w-3 h-3" />
                            <time dateTime={update.published_at!}>
                              {formatDate(update.published_at!)}
                            </time>
                          </div>
                          
                          <h3 className="text-xl font-semibold font-poppins text-momta-slate-light group-hover:text-momta-blue-light transition-colors">
                            {update.title}
                          </h3>
                          
                          <p className="text-sm text-momta-slate leading-relaxed">
                            {update.excerpt || truncateContent(update.content, 150)}
                          </p>
                          
                          {update.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {update.keywords.slice(0, 3).map((keyword, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          <Button variant="ghost" size="sm" className="gap-2 text-momta-blue-light hover:text-momta-blue p-0">
                            Read More
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                        </div>
                      </GlassCard>
                    </motion.article>
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {updates.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-center py-20"
              >
                <h2 className="display-3 text-momta-slate-light mb-4">
                  Stay Tuned for Updates
                </h2>
                <p className="text-momta-slate mb-8">
                  We're working hard on exciting developments. Check back soon for the latest news.
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