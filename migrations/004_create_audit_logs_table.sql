-- 004_create_audit_logs_table.sql

BEGIN;

CREATE TABLE IF NOT EXISTS audit_logs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_type     TEXT NOT NULL,                      -- 'system' | 'user' | 'admin' | 'webhook'
  actor_user_id  UUID REFERENCES users(id) ON DELETE SET NULL,
  event          TEXT NOT NULL,                      -- e.g., 'assessment.completed', 'stripe.webhook'
  entity_type    TEXT,                               -- 'session' | 'payment' | ...
  entity_id      UUID,                               -- optional id of the entity
  ip_address     INET,
  user_agent     TEXT,
  details        JSONB,                              -- free-form payload
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT audit_actor_type_chk
    CHECK (actor_type IN ('system','user','admin','webhook'))
);

CREATE INDEX IF NOT EXISTS audit_event_idx
  ON audit_logs (event, created_at DESC);

CREATE INDEX IF NOT EXISTS audit_entity_idx
  ON audit_logs (entity_type, entity_id);

CREATE INDEX IF NOT EXISTS audit_user_idx
  ON audit_logs (actor_user_id);

COMMIT;
