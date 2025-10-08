-- 003_create_payments_table.sql

BEGIN;

CREATE TABLE IF NOT EXISTS payments (
  id                           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                      UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id                   UUID REFERENCES assessment_sessions(id) ON DELETE SET NULL,
  provider                     TEXT NOT NULL DEFAULT 'stripe',    -- only 'stripe' for MVP
  product_id                   TEXT NOT NULL DEFAULT 'premium_report', -- logical product name
  amount_cents                 INTEGER NOT NULL CHECK (amount_cents >= 0),
  currency                     CHAR(3) NOT NULL DEFAULT 'USD',
  status                       TEXT NOT NULL DEFAULT 'processing', -- 'succeeded','processing','canceled','refunded','partial_refund','failed','requires_payment_method'
  refund_amount_cents          INTEGER NOT NULL DEFAULT 0 CHECK (refund_amount_cents >= 0),
  stripe_payment_intent_id     TEXT UNIQUE,
  stripe_checkout_session_id   TEXT UNIQUE,
  stripe_customer_id           TEXT,
  stripe_receipt_url           TEXT,
  metadata                     JSONB,                              -- arbitrary key/values
  created_at                   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT payments_status_chk
    CHECK (status IN ('succeeded','processing','canceled','refunded','partial_refund','failed','requires_payment_method'))
);

-- Common lookups
CREATE INDEX IF NOT EXISTS payments_user_idx
  ON payments (user_id);

CREATE INDEX IF NOT EXISTS payments_session_idx
  ON payments (session_id);

CREATE INDEX IF NOT EXISTS payments_status_idx
  ON payments (status);

-- Touch updated_at trigger
DROP TRIGGER IF EXISTS trg_payments_updated ON payments;
CREATE TRIGGER trg_payments_updated
BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;
