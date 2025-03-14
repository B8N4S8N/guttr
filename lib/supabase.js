import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client-side Supabase client (with anonymous key)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (with service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Helper function to get user from client-side
export const getCurrentUser = async () => {
  const { data: { user } } = await supabaseClient.auth.getUser();
  return user;
};

// Helper function for uploading files
export const uploadFile = async (bucket, filePath, file) => {
  const { data, error } = await supabaseClient.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw error;
  }

  return data;
};

// Helper function for getting a public URL for a file
export const getPublicUrl = (bucket, filePath) => {
  const { data } = supabaseClient.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}; 