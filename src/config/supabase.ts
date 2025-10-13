/**
 * Supabase Configuration
 * 
 * Configuration for Supabase client and Edge Functions
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

export const SUPABASE_CONFIG = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://itjmtjsipawahtlfcicu.supabase.co',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
};

export const SUPABASE_URL = SUPABASE_CONFIG.url;
export const SUPABASE_ANON_KEY = SUPABASE_CONFIG.anonKey;

// Edge Functions base URL
export const EDGE_FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;

// Validate configuration
if (!SUPABASE_ANON_KEY) {
  console.warn('⚠️ EXPO_PUBLIC_SUPABASE_ANON_KEY not found in environment variables');
}

if (!SUPABASE_URL.includes('supabase.co')) {
  console.warn('⚠️ Invalid Supabase URL format');
}
