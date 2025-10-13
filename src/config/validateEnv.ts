import { runtimeEnv } from './runtime-env';

export function validateEnv() {
  const { SUPABASE_URL, SUPABASE_ANON_KEY, HAS_SUPABASE } = runtimeEnv;
  
  if (!HAS_SUPABASE) {
    throw new Error(`❌ Missing environment variables: EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY`);
  }
  
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(SUPABASE_URL)) {
    throw new Error(`❌ EXPO_PUBLIC_SUPABASE_URL looks wrong: ${SUPABASE_URL}`);
  }
  
  console.log('✅ Env validated');
}