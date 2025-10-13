import { createClient } from '@supabase/supabase-js';
import { runtimeEnv } from '../config/runtime-env';

// Use runtime environment configuration with fallbacks
const { SUPABASE_URL, SUPABASE_ANON_KEY } = runtimeEnv;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to call Supabase Functions with the required Authorization header
export async function callFn<T = unknown>(
  name: string,
  opts?: { body?: any; headers?: Record<string, string> }
): Promise<{ data: T | null; error: any }> {
  const { data, error } = await supabase.functions.invoke<T>(name, {
    body: opts?.body,
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      ...opts?.headers,
    },
  });
  return { data, error };
}
