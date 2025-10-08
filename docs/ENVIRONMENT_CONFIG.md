# Environment Configuration

> Use Vercel's encrypted env management. Never commit `.env` to git.
> For local dev, use `.env.local` (never committed).

---

## NEXT_PUBLIC_APP_URL
- **Required:** Yes
- **Environment:** All
- **Description:** Base URL for the app used in redirects/links.
- **Example:** `https://app.swipetype.com`
- **How to get:** Your production domain or localhost for dev.
- **Security:** Public

## NEXT_PUBLIC_SUPABASE_URL
- **Required:** Yes
- **Environment:** All
- **Description:** Supabase project URL (public).
- **Example:** `https://abcxyz.supabase.co`
- **How to get:** Supabase project settings.
- **Security:** Public

## SUPABASE_ANON_KEY
- **Required:** Yes
- **Environment:** All
- **Description:** Public anon key for client SDK.
- **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6...`
- **How to get:** Supabase project API keys.
- **Security:** Public (but treat with care; permissions gated by RLS)

## SUPABASE_SERVICE_ROLE_KEY
- **Required:** Yes
- **Environment:** Server only (Vercel)
- **Description:** Elevated key for server-side operations & webhooks (bypass RLS).
- **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6...`
- **How to get:** Supabase project API keys.
- **Security:** **Secret (server-only)**

## STRIPE_PUBLISHABLE_KEY
- **Required:** Yes
- **Environment:** All
- **Description:** Stripe pk for client-side Checkout initialization.
- **Example:** `pk_test_123`
- **How to get:** Stripe Dashboard → Developers → API keys.
- **Security:** Public

## STRIPE_SECRET_KEY
- **Required:** Yes
- **Environment:** Server only (Vercel)
- **Description:** Stripe sk for server-side session creation/refunds.
- **Example:** `sk_test_123`
- **How to get:** Stripe Dashboard → Developers → API keys.
- **Security:** **Secret (server-only)**

## STRIPE_WEBHOOK_SECRET
- **Required:** Yes
- **Environment:** Server only (Vercel)
- **Description:** Signature secret for verifying webhook events.
- **Example:** `whsec_abc123`
- **How to get:** From webhook endpoint in Stripe after creation.
- **Security:** **Secret (server-only)**

## STRIPE_PRICE_ID
- **Required:** Yes
- **Environment:** All
- **Description:** Price ID for Premium Report (one-time, $12).
- **Example:** `price_1QabcXYZ`
- **How to get:** Stripe → Products → Price ID.
- **Security:** Public

## PUBLIC_PREMIUM_PRICE_USD
- **Required:** No (recommended)
- **Environment:** All
- **Description:** Display price for UI. Source of truth is Stripe price object.
- **Example:** `12`
- **How to get:** Manual entry.
- **Security:** Public

## ADMIN_EMAILS
- **Required:** Yes (prod)
- **Environment:** All
- **Description:** Comma-separated list of admin emails for role-gating.
- **Example:** `founder@company.com,ops@company.com`
- **How to get:** Internal.
- **Security:** Secret-ish (non-sensitive, but don't expose widely)

## RESEND_API_KEY / POSTMARK_SERVER_TOKEN (one)
- **Required:** If sending emails
- **Environment:** Server only
- **Description:** ESP key for transactional emails.
- **Example:** `re_xxx` or `POSTMARK_API_TEST`
- **How to get:** ESP dashboard.
- **Security:** **Secret (server-only)**

## NEXT_PUBLIC_ANALYTICS_KEY (provider-specific)
- **Required:** No
- **Environment:** All
- **Description:** Key for Plausible/PostHog or similar.
- **Example:** `phc_xxx`
- **How to get:** Analytics provider.
- **Security:** Public

---

## Security Best Practices
- **Never** commit `.env*` to git.
- Use distinct keys per environment (Dev/Staging/Prod).
- Rotate keys periodically and on personnel changes.
- Do not log secrets or PII.
- Keep Supabase service role strictly server-side.
