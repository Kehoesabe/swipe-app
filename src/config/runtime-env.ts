/**
 * Runtime environment configuration for Vercel deployments
 * This handles the case where environment variables are not available at build time
 */

// Try to get environment variables from multiple sources
function getEnvVar(key: string): string | undefined {
  // 1. Try process.env (standard)
  if (process.env[key]) return process.env[key];
  
  // 2. Try window object (for browser runtime)
  if (typeof window !== 'undefined' && (window as any).__ENV__?.[key]) {
    return (window as any).__ENV__[key];
  }
  
  // 3. Try global object (fallback)
  if (typeof global !== 'undefined' && (global as any).__ENV__?.[key]) {
    return (global as any).__ENV__[key];
  }
  
  return undefined;
}

// Get Supabase configuration
const supabaseUrl = getEnvVar('EXPO_PUBLIC_SUPABASE_URL') || 
                   getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || 
                   'https://ciodftgvmnphuhvjnmis.supabase.co'; // Fallback to your known URL

const supabaseAnonKey = getEnvVar('EXPO_PUBLIC_SUPABASE_ANON_KEY') || 
                       getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') || 
                       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpb2RmdGd2bW5waHVodmpubWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMDk2MTAsImV4cCI6MjA3NTU4NTYxMH0.lGgrd6IzkIkwrPtgxE9TPqaLWcmvepZTrBNFleTFfOQ'; // Fallback to your known key

export const runtimeEnv = {
  SUPABASE_URL: supabaseUrl,
  SUPABASE_ANON_KEY: supabaseAnonKey,
  HAS_SUPABASE: Boolean(supabaseUrl && supabaseAnonKey),
};

console.log('🔧 Runtime Env Config:', {
  url: supabaseUrl.slice(0, 20) + '...',
  hasKey: Boolean(supabaseAnonKey),
  hasSupabase: runtimeEnv.HAS_SUPABASE
});


