/**
 * Runtime environment configuration for Expo web builds on Vercel
 * This file handles environment variables that may not be available at build time
 */

// @SpecSource: AP v3.1 / Env Hardening v1
const expoUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const expoAnon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Backward-compat: accept NEXT_PUBLIC_* if EXPO_* missing (web-only)
const nextUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const nextAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const url = expoUrl || nextUrl;
const anon = expoAnon || nextAnon;

export const env = {
  SUPABASE_URL: url,
  SUPABASE_ANON_KEY: anon,
  HAS_SUPABASE: Boolean(url && anon),
};

export function requireEnvOrExplain() {
  if (!env.HAS_SUPABASE) {
    console.warn("Missing Supabase envs: EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY.");
  }
  return env;
}
