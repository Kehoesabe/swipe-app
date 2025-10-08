-- 002_create_sessions_table.sql

BEGIN;

CREATE TABLE IF NOT EXISTS assessment_sessions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID REFERENCES users(id) ON DELETE SET NULL,
  session_seed         INTEGER NOT NULL DEFAULT 42,
  device_platform      TEXT NOT NULL DEFAULT 'web',      -- 'ios' | 'android' | 'web'
  input_method_last    TEXT,                              -- 'swipe' | 'keyboard' | 'buttons'
  order_version        TEXT NOT NULL DEFAULT 'v1',
  questions_version    TEXT NOT NULL DEFAULT 'v1',
  scoring_version      TEXT NOT NULL DEFAULT 'v1',
  mapping_version      TEXT NOT NULL DEFAULT 'v1',
  status               TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress' | 'completed' | 'abandoned'
  -- responses as array of {questionId, direction, msSinceRender}
  answers              JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- normalized means by 6 connection + 9 enneagram (15 total), e.g. {"verbalAffirmation":1.2, ...}
  means                JSONB,                              
  top_style            TEXT,                                -- e.g., 'qualityPresence'
  top_enneagram        TEXT,                                -- e.g., 'type4'
  primary_swipe_type   TEXT,                                -- e.g., 'Deep Connector'
  blend_swipe_type     TEXT,                                -- nullable
  margins              JSONB,                               -- {"style":0.23,"enneagram":0.18}
  started_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at         TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT sessions_platform_chk
    CHECK (device_platform IN ('ios','android','web')),
  CONSTRAINT sessions_input_method_chk
    CHECK (input_method_last IS NULL OR input_method_last IN ('swipe','keyboard','buttons')),
  CONSTRAINT sessions_status_chk
    CHECK (status IN ('in_progress','completed','abandoned'))
);

CREATE INDEX IF NOT EXISTS sessions_user_idx
  ON assessment_sessions (user_id);

CREATE INDEX IF NOT EXISTS sessions_status_idx
  ON assessment_sessions (status);

CREATE INDEX IF NOT EXISTS sessions_started_idx
  ON assessment_sessions (started_at);

CREATE INDEX IF NOT EXISTS sessions_completed_idx
  ON assessment_sessions (completed_at)
  WHERE completed_at IS NOT NULL;

-- GIN index for analytics on answers
CREATE INDEX IF NOT EXISTS sessions_answers_gin
  ON assessment_sessions USING GIN (answers jsonb_path_ops);

-- Touch updated_at trigger
DROP TRIGGER IF EXISTS trg_sessions_updated ON assessment_sessions;
CREATE TRIGGER trg_sessions_updated
BEFORE UPDATE ON assessment_sessions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;
