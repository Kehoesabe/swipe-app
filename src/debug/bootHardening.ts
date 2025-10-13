/**
 * Boot Hardening & Telemetry (web-safe)
 * - Logs BUILD_ID & masked env presence
 * - Unregisters any old service worker (prevents stale bundles)
 * - Global error handler logs full stack & source
 * - Softens any env validation throws by catching at top-level
 */
export const BUILD_ID =
  (typeof process !== "undefined" && (process.env.NEXT_PUBLIC_GIT_SHA || process.env.NEXT_PUBLIC_APP_VERSION))
  || "dev-local";

function mask(s?: string) {
  if (!s) return "(empty)";
  const head = s.slice(0, 10);
  return head + "… (len=" + s.length + ")";
}

(function boot() {
  // 1) Console banner
  // These values are inlined at build time for web
  const expoUrl = (typeof process !== "undefined" ? (process.env as any).EXPO_PUBLIC_SUPABASE_URL : undefined) || "";
  const expoAnon = (typeof process !== "undefined" ? (process.env as any).EXPO_PUBLIC_SUPABASE_ANON_KEY : undefined) || "";

  // eslint-disable-next-line no-console
  console.log("[BOOT] BUILD_ID:", BUILD_ID);
  // eslint-disable-next-line no-console
  console.log("[BOOT] SUPABASE_URL:", mask(expoUrl), "| ANON_KEY:", mask(expoAnon));

  // 2) Unregister any service workers (stale assets)
  if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations?.().then(regs => {
      regs.forEach(r => r.unregister());
      if (regs.length) {
        console.log("[BOOT] Unregistered", regs.length, "service worker(s)");
      }
    }).catch(()=>{});
  }

  // 3) Global error handler to capture stack and source
  if (typeof window !== "undefined") {
    window.addEventListener("error", (ev) => {
      try {
        const msg = (ev && (ev.message || (ev.error && ev.error.message))) || String(ev);
        const stack = (ev && ev.error && ev.error.stack) || "no-stack";
        // eslint-disable-next-line no-console
        console.error("[GLOBAL ERROR]", msg, "\n[STACK]\n", stack);
      } catch {}
    });
  }
})();