-- 001_create_users_table.sql
-- Postgres 13+ recommended

-- Optional: for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email               TEXT,                                 -- nullable for anonymous users
  email_verified_at   TIMESTAMPTZ,
  password_hash       TEXT,                                 -- nullable if SSO-only
  auth_provider       TEXT NOT NULL DEFAULT 'email',        -- 'email' | 'apple' | 'google' | 'anonymous'
  auth_provider_id    TEXT,                                 -- provider user id / sub
  display_name        TEXT,
  marketing_opt_in    BOOLEAN NOT NULL DEFAULT FALSE,
  privacy_consent_at  TIMESTAMPTZ,                          -- when user accepted privacy
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_auth_provider_chk
    CHECK (auth_provider IN ('email','apple','google','anonymous'))
);

-- Case-insensitive uniqueness for email (ignores NULLs)
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_ci
  ON users (lower(email))
  WHERE email IS NOT NULL AND deleted_at IS NULL;

-- Fast lookup by provider id
CREATE INDEX IF NOT EXISTS users_provider_idx
  ON users (auth_provider, auth_provider_id)
  WHERE auth_provider_id IS NOT NULL;

-- Soft-delete friendly queries
CREATE INDEX IF NOT EXISTS users_active_idx
  ON users (deleted_at)
  WHERE deleted_at IS NULL;

-- Touch updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated ON users;
CREATE TRIGGER trg_users_updated
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;




