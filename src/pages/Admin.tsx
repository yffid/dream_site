import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UpdateForm } from '@/components/admin/UpdateForm';
import { ResearchForm } from '@/components/admin/ResearchForm';
import { downloadSitemap } from '@/utils/sitemap';
import { BarChart3, Users, Download, Settings, LogOut, FileText, Search, Globe } from 'lucide-react';

interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
  status: string;
}

export default function Admin() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [waitlistData, setWaitlistData] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    this_week: 0
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchWaitlistData();
    fetchStats();
  }, [refreshKey]);

  const fetchWaitlistData = async () => {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWaitlistData(data || []);
    } catch (error: any) {
      console.error('Error fetching waitlist:', error);
      toast({
        title: "Error",
        description: "Failed to fetch waitlist data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_waitlist_stats');
      if (error) throw error;
      
      // Type the response properly
      const statsData = data as any;
      setStats({
        total: statsData?.total || 0,
        today: statsData?.today || 0,
        this_week: statsData?.this_week || 0
      });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch statistics",
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = async () => {
    try {
      const csvContent = [
        ['Name', 'Email', 'Phone', 'Status', 'Date'].join(','),
        ...waitlistData.map(entry => [
          entry.name,
          entry.email,
          entry.phone || '',
          entry.status,
          new Date(entry.created_at).toLocaleDateString()
        ].map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `waitlist-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: "Waitlist data exported to CSV",
      });
    } catch (error: any) {
      console.error('Error exporting CSV:', error);
      toast({
        title: "Export failed",
        description: "Failed to export CSV file",
        variant: "destructive",
      });
    }
  };

  const handleDownloadSitemap = async () => {
    const success = await downloadSitemap();
    toast({
      title: success ? "Sitemap downloaded" : "Download failed",
      description: success ? "sitemap.xml has been downloaded" : "Failed to generate sitemap",
      variant: success ? "default" : "destructive",
    });
  };

  const handleFormSuccess = () => {
    setRefreshKey(prev => prev + 1); // Trigger refresh of data
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-momta-night via-momta-night-dark to-momta-night flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 animate-pulse text-momta-blue mx-auto mb-4" />
          <p className="text-momta-slate text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-momta-night via-momta-night-dark to-momta-night">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="display-2 text-momta-slate-light">Admin Dashboard</h1>
              <p className="text-momta-slate">Welcome back, {user?.email}</p>
            </div>
            <Button onClick={handleSignOut} variant="outline" className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <GlassCard className="p-6 text-center m-lens">
              <h3 className="text-2xl font-bold text-momta-blue-light">{stats.total}</h3>
              <p className="text-momta-slate">Total Signups</p>
            </GlassCard>
            <GlassCard className="p-6 text-center m-lens">
              <h3 className="text-2xl font-bold text-momta-blue-light">{stats.today}</h3>
              <p className="text-momta-slate">Today</p>
            </GlassCard>
            <GlassCard className="p-6 text-center m-lens">
              <h3 className="text-2xl font-bold text-momta-blue-light">{stats.this_week}</h3>
              <p className="text-momta-slate">This Week</p>
            </GlassCard>
          </div>

          <Tabs defaultValue="waitlist" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-momta-night-dark/50">
              <TabsTrigger value="waitlist" className="gap-2">
                <Users className="w-4 h-4" />
                Waitlist
              </TabsTrigger>
              <TabsTrigger value="updates" className="gap-2">
                <FileText className="w-4 h-4" />
                Updates
              </TabsTrigger>
              <TabsTrigger value="research" className="gap-2">
                <Search className="w-4 h-4" />
                Research
              </TabsTrigger>
              <TabsTrigger value="seo" className="gap-2">
                <Globe className="w-4 h-4" />
                SEO
              </TabsTrigger>
            </TabsList>

            <TabsContent value="waitlist">
              <GlassCard className="p-6 m-lens">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-momta-slate-light">Waitlist Management</h2>
                  <Button onClick={handleExportCSV} className="gap-2">
                    <Download className="w-4 h-4" />
                    Export CSV
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-momta-blue/20">
                        <th className="text-left p-3 text-momta-slate-light">Name</th>
                        <th className="text-left p-3 text-momta-slate-light">Email</th>
                        <th className="text-left p-3 text-momta-slate-light">Phone</th>
                        <th className="text-left p-3 text-momta-slate-light">Status</th>
                        <th className="text-left p-3 text-momta-slate-light">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {waitlistData.map((entry) => (
                        <tr key={entry.id} className="border-b border-momta-blue/10">
                          <td className="p-3 text-momta-slate">{entry.name}</td>
                          <td className="p-3 text-momta-slate">{entry.email}</td>
                          <td className="p-3 text-momta-slate">{entry.phone || 'N/A'}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              entry.status === 'subscribed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {entry.status}
                            </span>
                          </td>
                          <td className="p-3 text-momta-slate">
                            {new Date(entry.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="updates">
              <UpdateForm onSuccess={handleFormSuccess} />
            </TabsContent>

            <TabsContent value="research">
              <ResearchForm onSuccess={handleFormSuccess} />
            </TabsContent>

            <TabsContent value="seo">
              <GlassCard className="p-8 m-lens">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold font-poppins text-momta-slate-light">
                    SEO & Site Management
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-momta-slate-light">Sitemap</h3>
                      <p className="text-momta-slate text-sm">
                        Generate and download an XML sitemap for Google Search Console submission.
                      </p>
                      <Button onClick={handleDownloadSitemap} className="gap-2">
                        <Download className="w-4 h-4" />
                        Download Sitemap
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-momta-slate-light">Quick Links</h3>
                      <div className="space-y-2">
                        <Button variant="outline" asChild>
                          <a href="/updates" target="_blank" className="gap-2">
                            <FileText className="w-4 h-4" />
                            View Updates Page
                          </a>
                        </Button>
                        <Button variant="outline" asChild>
                          <a href="/research" target="_blank" className="gap-2">
                            <Search className="w-4 h-4" />
                            View Research Page
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-momta-slate-light">SEO Status</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-momta-night-dark/30 rounded-lg">
                        <h4 className="font-medium text-momta-blue-light">Arabic Keywords</h4>
                        <p className="text-sm text-momta-slate">مومتا، روبوت، ذكاء اصطناعي، تقنية</p>
                      </div>
                      <div className="p-4 bg-momta-night-dark/30 rounded-lg">
                        <h4 className="font-medium text-momta-blue-light">English Keywords</h4>
                        <p className="text-sm text-momta-slate">Momta, AI robots, robotics, technology</p>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}