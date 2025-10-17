# Deployment Guide — Swipe Type (MVP)

## Overview
**Recommended stack**
- **Frontend/Server**: Next.js on **Vercel** (API routes + web UI)
- **Database & Auth**: **Supabase** (PostgreSQL + Auth + RLS)
- **Payments**: **Stripe** (Checkout + Webhooks)
- **Email**: your ESP (e.g., Resend, Postmark, SES)
- **Analytics**: Plausible or PostHog

**Why this stack**
- Fast to ship, managed infra, serverless-by-default, PCI scope minimized via Stripe Checkout, strong DB security via RLS.

> See `docs/ENVIRONMENT_CONFIG.md` for all env vars.

---

## 1) Environment Variables (All Envs)
Populate the following (names mirror app usage):

- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server only)
- **App URLs**: `NEXT_PUBLIC_APP_URL`
- **Stripe**: `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`, `PUBLIC_PREMIUM_PRICE_USD=12`
- **Auth/Admin**: `ADMIN_EMAILS` (comma list), any OAuth client IDs/secrets if enabling Google/Apple
- **Analytics**: provider keys (optional)
- **Email**: ESP API key + domain/from address

> Never expose service-role or secrets to client code. Use Vercel's encrypted environment variables.

---

## 2) Database Setup (Supabase)
1. **Create project** at supabase.com → note `project URL` and `anon`/`service role` keys.
2. **Run schema/migrations**:
   - Apply SQL from **Batch 7 Revised** (`docs/DATABASE_SCHEMA.md`), or import migrations if split.
3. **Enable RLS**:
   - RLS on `users`, `assessments`, `payments`, `email_captures` as specified.
   - Create the policies from Batch 7 Revised.
4. **Auth providers** (optional at MVP):
   - Email/password default ON.
   - Google/Apple: configure credentials in Supabase Auth and set corresponding env vars in Vercel.
5. **Test DB connectivity**:
   - From local dev or Vercel preview API route (server-side only) with a simple `SELECT now()`.

---

## 3) Stripe Setup
1. **Create Product/Price** for Premium Report:
   - Product: `premium_report`
   - Price: one-time, USD, **$12**.
   - Record **`STRIPE_PRICE_ID`** (authoritative).
2. **Keys**:
   - Test & Live: `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`.
3. **Webhook**:
   - Add endpoint: `https://<YOUR_DOMAIN>/api/payment/webhook`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`, `charge.refunded`
   - Record **`STRIPE_WEBHOOK_SECRET`**.
4. **Stripe CLI (local test)**:
   ```bash
   stripe listen --forward-to localhost:3000/api/payment/webhook
   ```
5. **Success/Cancel URLs**:
   - Success: `${NEXT_PUBLIC_APP_URL}/report/premium/{ASSESSMENT_ID}?session_id={CHECKOUT_SESSION_ID}`
   - Cancel: `${NEXT_PUBLIC_APP_URL}/assessment/{ASSESSMENT_ID}?canceled=true`

---

## 4) Vercel Deployment
1. **Connect GitHub repo** → Vercel → Import.
2. **Set Environment Variables** (Project Settings → Environment Variables):
   - Add all required variables for Production and Preview.
3. **Domains**
   - Add `app.swipetype.com` (or chosen domain), set production Git branch.
4. **Vercel config** (optional):
   - `vercel.json` for redirects/headers if needed (e.g., HSTS).
5. **Deploy**
   - Trigger build. Confirm success on Preview, then Promote to Production.

---

## 5) Post-Deployment Verification (Smoke Test)
- [ ] Signup/login (if enabled).
- [ ] Start assessment → answer all 57 → submit → free summary appears.
- [ ] Paywall CTA → Stripe → test card → return to app → premium unlocked.
- [ ] Check `payments` row, `assessments.premium_unlocked = true`.
- [ ] Email: purchase confirmation sent (and verification email if applicable).
- [ ] Webhook logs show 2xx, no signature errors.

---

## 6) CI/CD (Optional, Recommended)
**GitHub Actions**: run tests on PR, prevent merge on fail.

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run build --if-present
      - run: npm test
```

**Staging**: A Vercel preview branch with separate env vars & Stripe test keys.

---

## 7) Rollback Plan
- **Vercel**: Re-deploy a previous successful build with one click.
- **DB Migrations**:
  - Keep forward/backward SQL. If a migration breaks prod, apply DOWN script to revert.
  - Back up DB before major changes (Supabase backup/snapshot).
- **Stripe**: No rollback needed; disable product/price if misconfigured.

---

## 8) Monitoring & Alerts
- Set up Sentry (errors) and Plausible/PostHog (usage).
- Configure UptimeRobot/Pingdom.
- Enable Supabase DB and auth alerts as available.
- See `docs/MONITORING_ALERTS.md` for full spec.

---

## 9) Security Best Practices
- HTTPS only, HSTS on production.
- Never log PII or secrets.
- Rotate keys if shared externally.
- Stripe secrets and Supabase service role never exposed client-side.
- Restrict admin routes with role checks + IP allowlist (optional).




