import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAdmin: false,
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setAuthState({ user: null, isLoading: false, isAdmin: false });
          return;
        }

        if (session?.user) {
          const isAdmin = await checkAdminRole(session.user.id);
          setAuthState({
            user: session.user,
            isLoading: false,
            isAdmin,
          });
        } else {
          setAuthState({ user: null, isLoading: false, isAdmin: false });
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setAuthState({ user: null, isLoading: false, isAdmin: false });
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session?.user) {
            const isAdmin = await checkAdminRole(session.user.id);
            setAuthState({
              user: session.user,
              isLoading: false,
              isAdmin,
            });
          } else {
            setAuthState({ user: null, isLoading: false, isAdmin: false });
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          setAuthState({ user: null, isLoading: false, isAdmin: false });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking admin role:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in checkAdminRole:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Error in signOut:', error);
    }
  };

  return {
    ...authState,
    signOut,
  };
}