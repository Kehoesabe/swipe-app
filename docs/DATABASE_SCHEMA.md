# Swipe Type — Database Schema (PostgreSQL/Supabase)

## Overview
Supports:
- Users & auth state
- Assessment sessions (57 responses, normalized scores, result)
- Payments (Stripe) — one-time premium report
- Email captures (pre-launch / marketing)

**Conventions**
- PKs: `uuid` via `gen_random_uuid()` (or Supabase `uuid_generate_v4()`)
- Timestamps: `timestamptz` with `DEFAULT now()`
- JSON payloads: `jsonb`
- Minimal PII (email only). No card data stored (Stripe only).

---

## Entity Relationship Diagram (text)

```
users (1) ──< assessments (many)
users (1) ──< payments (many)
email_captures (independent)
assessments (1) ──< payments (0..many) [optional link via assessment_id]
```

---

## Tables

### 1) `users`
```sql
CREATE TABLE IF NOT EXISTS public.users (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email             citext UNIQUE NOT NULL,
  email_verified_at timestamptz,
  display_name      text,
  avatar_url        text,
  auth_provider     text CHECK (auth_provider IN ('password','google','apple','github')) DEFAULT 'password',
  subscription_tier text CHECK (subscription_tier IN ('free','premium','none')) DEFAULT 'free',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  last_sign_in_at   timestamptz,
  country_code      text
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users (created_at);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

**Notes**
- If using Supabase Auth, this table stores app-profile fields; auth core remains in `auth.users`.

### 2) `assessments`
```sql
CREATE TABLE IF NOT EXISTS public.assessments (
  id                         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                    uuid REFERENCES public.users(id) ON DELETE SET NULL,
  status                     text CHECK (status IN ('started','completed','abandoned')) NOT NULL DEFAULT 'started',
  responses                  jsonb NOT NULL DEFAULT '[]'::jsonb,  -- array of {id, dir, at}
  scores                     jsonb,                                -- 15 normalized means
  top_connection_style       text,
  top_enneagram_type         text,
  secondary_connection_style text,
  secondary_enneagram_type   text,
  connection_margin          numeric,
  enneagram_margin           numeric,
  mapping_key                text,                                 -- e.g., 'qualityPresence_type4'
  swipe_type                 text,                                 -- e.g., 'Deep Connector'
  blend_swipe_type           text,
  centroid_applied           boolean DEFAULT false,
  premium_unlocked           boolean DEFAULT false,
  created_at                 timestamptz NOT NULL DEFAULT now(),
  completed_at               timestamptz
);

CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments (user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON public.assessments (status);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON public.assessments (created_at);
-- Helpful analytics/reporting (optional):
-- CREATE INDEX IF NOT EXISTS idx_assessments_swipe_type ON public.assessments (swipe_type);
-- CREATE INDEX IF NOT EXISTS idx_assessments_premium ON public.assessments (premium_unlocked);
```

**Notes**
- `responses` example: `[{"id":1,"dir":"up","at":"2025-10-08T02:31:00Z"}]`
- `scores` holds 6+9 category means.

### 3) `payments`

Add new Stripe-like statuses `requires_payment_method`, `processing`.

```sql
CREATE TABLE IF NOT EXISTS public.payments (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   uuid REFERENCES public.users(id) ON DELETE SET NULL,
  assessment_id             uuid REFERENCES public.assessments(id) ON DELETE SET NULL,
  product_code              text NOT NULL,         -- 'premium_report'
  amount_cents              integer NOT NULL,      -- e.g., 1200 for $12.00
  currency                  text NOT NULL DEFAULT 'usd',
  stripe_price_id           text,                  -- price_xxx
  stripe_product_id         text,                  -- prod_xxx
  stripe_session_id         text UNIQUE,           -- cs_test_xxx
  stripe_payment_intent_id  text,
  status text CHECK (status IN (
    'init',
    'requires_payment_method',
    'requires_action',
    'processing',
    'paid',
    'failed',
    'refunded',
    'canceled'
  )) NOT NULL DEFAULT 'init',
  receipt_url               text,
  raw_event                 jsonb,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_assessment ON public.payments (assessment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments (status);
```

**Notes**
- Entitlement: when `status='paid'` → set `assessments.premium_unlocked=true`.

### 4) `email_captures`
```sql
CREATE TABLE IF NOT EXISTS public.email_captures (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email        citext NOT NULL,
  source       text, -- 'landing', 'waitlist', 'post-results', etc.
  utm_medium   text,
  utm_campaign text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email, source)
);

CREATE INDEX IF NOT EXISTS idx_email_captures_email ON public.email_captures (email);
```

---

## Sample JSON Structures

### `assessments.responses`
```json
[
  {"id":1,"dir":"up","at":"2025-10-08T02:31:00Z"},
  {"id":2,"dir":"left","at":"2025-10-08T02:31:07Z"}
]
```

### `assessments.scores`
```json
{
  "verbalAffirmation": 0.85,
  "qualityPresence": 1.60,
  "physicalCloseness": 0.20,
  "supportiveActions": 1.05,
  "thoughtfulGestures": -0.30,
  "sharedGrowth": 0.90,
  "type1": 0.75,
  "type2": 1.20,
  "type3": 0.15,
  "type4": 1.80,
  "type5": -0.10,
  "type6": 0.55,
  "type7": 0.40,
  "type8": 0.25,
  "type9": 0.90
}
```

---

## Supabase RLS (Row Level Security) — Examples

Enable RLS on all tables and create least-privilege policies.

```sql
ALTER TABLE public.users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_captures ENABLE ROW LEVEL SECURITY;

-- Helper policy: users can view/update themselves
CREATE POLICY users_self_select ON public.users
FOR SELECT USING (id = auth.uid());

CREATE POLICY users_self_update ON public.users
FOR UPDATE USING (id = auth.uid());

-- assessments: owner-only access
CREATE POLICY assessments_owner_select ON public.assessments
FOR SELECT USING (user_id IS NOT NULL AND user_id = auth.uid());

CREATE POLICY assessments_owner_insert ON public.assessments
FOR INSERT WITH CHECK (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY assessments_owner_update ON public.assessments
FOR UPDATE USING (user_id = auth.uid());

-- payments: owner-only access (except server-side webhooks via service role)
CREATE POLICY payments_owner_select ON public.payments
FOR SELECT USING (user_id = auth.uid());

-- email captures: allow insert for any authenticated (or via service-role); read restricted
CREATE POLICY email_captures_insert ON public.email_captures
FOR INSERT WITH CHECK (true);

-- Admin role (optional): create a PostgREST/JWT claim check, e.g. auth.jwt() ->> 'role' = 'admin'
-- Then add policies that permit admin access across tables.
```

**Note:** Anonymous assessments should be created/updated via server (service role) endpoints so they bypass RLS until linked to a user.

---

## Prelaunch Index Checklist (Notes)

High-volume reads:
- `assessments` (`premium_unlocked`)
- `assessments` (`swipe_type`)
- `assessments` (`created_at DESC`) for dashboards

Payment lookups:
- `payments` (`stripe_session_id`) already unique
- `payments` (`status, created_at`) composite (optional)

JSONB GIN (only if needed):
```sql
CREATE INDEX idx_assessments_scores_gin ON public.assessments USING GIN (scores);
-- Consider path ops for top_style/type aggregations
```