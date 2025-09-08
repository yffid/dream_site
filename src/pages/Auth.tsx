import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/ui/glass-card';
import { SEOHead } from '@/components/seo/SEOHead';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, AlertCircle } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isLoading: authLoading, isAdmin } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      const from = (location.state as any)?.from?.pathname || '/';
      
      if (isAdmin && from === '/admin') {
        navigate('/admin');
      } else if (from === '/admin' && !isAdmin) {
        toast({
          title: "Access denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        navigate('/');
      } else {
        navigate(from);
      }
    }
  }, [user, isAdmin, authLoading, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          // Check if user is admin
          const { data: userRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', data.user.id)
            .eq('role', 'admin')
            .single();

          const from = (location.state as any)?.from?.pathname || '/';
          
          if (from === '/admin') {
            if (userRole) {
              toast({
                title: "Welcome back",
                description: "Successfully signed in as admin.",
              });
              navigate('/admin');
            } else {
              toast({
                title: "Access denied",
                description: "You don't have admin privileges.",
                variant: "destructive",
              });
              await supabase.auth.signOut();
              navigate('/');
            }
          } else {
            toast({
              title: "Welcome back",
              description: "Successfully signed in.",
            });
            navigate(from);
          }
        }
      } else {
        // Sign up
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`
          }
        });

        if (error) throw error;

        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link.",
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-momta-night flex items-center justify-center">
        <div className="flex items-center space-x-3 text-momta-blue">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Admin Login - Momta 2028"
        description="Secure admin access to Momta 2028 dashboard. Authorized personnel only."
        canonical="https://momta.org/auth"
        noIndex={true}
      />
      
      <div className="min-h-screen bg-momta-night flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {isLogin ? 'Admin Login' : 'Create Account'}
              </h1>
              <p className="text-muted-foreground">
                {isLogin ? 'Access the Momta 2028 admin dashboard' : 'Sign up for admin access'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 bg-momta-night-light/50 border-momta-slate-dark/30 text-momta-slate-light placeholder:text-momta-slate-dark focus:border-momta-blue"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 bg-momta-night-light/50 border-momta-slate-dark/30 text-momta-slate-light placeholder:text-momta-slate-dark focus:border-momta-blue"
                  placeholder="Enter your password"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-momta-blue to-momta-blue-light hover:from-momta-blue-dark hover:to-momta-blue"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  isLogin ? 'Sign In' : 'Sign Up'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-momta-blue hover:text-momta-blue-light transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-momta-blue/5 rounded-lg border border-momta-blue/10">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-momta-blue-light mt-0.5 flex-shrink-0" />
                <p className="text-xs text-momta-slate-dark">
                  This is a secure admin portal. All access attempts are logged and monitored.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </>
  );
};

export default Auth;