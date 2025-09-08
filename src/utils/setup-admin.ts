import { supabase } from '@/integrations/supabase/client';

export const setupAdminUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('setup-admin', {
      body: { email, password }
    });

    if (error) {
      throw error;
    }

    if (data.error) {
      throw new Error(data.error);
    }

    return { success: true, message: data.message };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Call this function once to set up your admin user
// setupAdminUser('admin.momta@gmail.com', '01090081223ali@A1');