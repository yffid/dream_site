import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Update {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  slug: string;
  published: boolean;
  featured: boolean;
  created_at: string;
  published_at: string | null;
}

export function Updates() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .eq('status', 'subscribed')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      // Mock updates data since the table doesn't exist yet
      const mockUpdates: Update[] = [
        {
          id: '1',
          title: 'AI Development Milestone Reached',
          content: 'We have successfully completed the first phase of our AI development, achieving breakthrough results in natural language processing and machine learning algorithms.',
          excerpt: 'Breakthrough results in AI development with advanced algorithms.',
          image_url: null,
          slug: 'ai-development-milestone',
          published: true,
          featured: true,
          created_at: new Date().toISOString(),
          published_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Robotics Platform Progress',
          content: 'Our team has made significant progress on the robotics platform that will power Momta robots.',
          excerpt: 'Major progress on our core robotics platform.',
          image_url: null,
          slug: 'robotics-platform-progress',
          published: true,
          featured: false,
          created_at: new Date().toISOString(),
          published_at: new Date().toISOString()
        }
      ];
      setUpdates(mockUpdates);
    } catch (error: any) {
      console.error('Error fetching updates:', error);
      toast({
        title: "Error loading updates",
        description: "Failed to load latest updates. Please try again.",
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

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-momta-blue mx-auto" />
            <p className="text-momta-slate mt-4">Loading updates...</p>
          </div>
        </div>
      </section>
    );
  }

  if (updates.length === 0) {
    return null; // Don't show section if no updates
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-16"
        >
          {/* Section Header */}
          <div className="text-center space-y-6">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="badge-2028"
            >
              Latest Updates
            </motion.span>
            
            <h2 className="display-2 text-momta-slate-light max-w-4xl mx-auto">
              Building the Future, One Step at a Time
            </h2>
            
            <p className="body-lg text-momta-slate max-w-3xl mx-auto">
              Follow our progress as we develop the most advanced robotic companions. 
              Stay informed about our latest breakthroughs and milestones.
            </p>
          </div>

          {/* Featured Update */}
          {updates.find(update => update.featured) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
            >
              {(() => {
                const featuredUpdate = updates.find(update => update.featured)!;
                return (
                  <GlassCard className="relative overflow-hidden group m-lens">
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-momta-blue/20 text-momta-blue-light border-momta-blue/30">
                        Featured
                      </Badge>
                    </div>
                    
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-momta-slate-dark">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(featuredUpdate.published_at!)}</span>
                        </div>
                        
                        <h3 className="text-2xl font-semibold font-poppins text-momta-slate-light">
                          {featuredUpdate.title}
                        </h3>
                        
                        <p className="text-momta-slate leading-relaxed">
                          {featuredUpdate.excerpt || truncateContent(featuredUpdate.content, 200)}
                        </p>
                        
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
                            className="w-full h-64 object-cover rounded-lg"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-momta-night/20 to-transparent rounded-lg"></div>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                );
              })()}
            </motion.div>
          )}

          {/* Updates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {updates.filter(update => !update.featured).map((update, index) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
              >
                <GlassCard className="h-full space-y-4 group m-lens">
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
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-momta-slate-dark">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(update.published_at!)}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold font-poppins text-momta-slate-light group-hover:text-momta-blue-light transition-colors">
                      {update.title}
                    </h3>
                    
                    <p className="text-sm text-momta-slate leading-relaxed">
                      {update.excerpt || truncateContent(update.content)}
                    </p>
                    
                    <Button variant="ghost" size="sm" className="gap-2 text-momta-blue-light hover:text-momta-blue p-0">
                      Read More
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* View All Updates Button */}
          {updates.length >= 6 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Button variant="glass" size="lg" className="gap-2">
                View All Updates
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}