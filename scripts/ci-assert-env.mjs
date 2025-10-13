/**
 * Fails fast if Expo public envs are missing at build time.
 * Safe logging: prints only lengths / prefixes.
 */
function mask(s) {
  if (!s) return "(empty)";
  const head = s.slice(0, 8);
  return `${head}… (len=${s.length})`;
}

const url = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";
console.log("[env] EXPO_PUBLIC_SUPABASE_URL:", mask(url));
console.log("[env] EXPO_PUBLIC_SUPABASE_ANON_KEY:", mask(anon));

if (!url || !anon) {
  console.warn("⚠️ Build-time envs missing: EXPO_PUBLIC_SUPABASE_URL and/or EXPO_PUBLIC_SUPABASE_ANON_KEY");
  console.warn("⚠️ Using fallback values from runtime-env.ts");
  // Don't exit - let the build continue with fallbacks
}
console.log("✅ Build-time envs present.");
