-- Migration: Create audit_log table for payment tracking
-- Date: 2025-01-10
-- Purpose: Audit trail for payment events and system actions

-- Create audit_log table
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'payment_created', 'payment_succeeded', 'access_granted', etc.
  resource_type TEXT NOT NULL, -- 'purchase', 'premium_access', 'user', etc.
  resource_id UUID, -- ID of the affected resource
  old_values JSONB, -- Previous state (for updates)
  new_values JSONB, -- New state (for creates/updates)
  metadata JSONB DEFAULT '{}', -- Additional context
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_resource_type ON audit_log(resource_type);
CREATE INDEX idx_audit_log_resource_id ON audit_log(resource_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX idx_audit_log_user_action ON audit_log(user_id, action);

-- Enable Row Level Security
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own audit logs
CREATE POLICY "Users can view own audit logs"
  ON audit_log FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert audit logs (for webhook processing)
CREATE POLICY "System can insert audit logs"
  ON audit_log FOR INSERT
  WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE audit_log IS 'Audit trail for payment events and system actions';
COMMENT ON COLUMN audit_log.action IS 'Action performed (payment_created, payment_succeeded, etc.)';
COMMENT ON COLUMN audit_log.resource_type IS 'Type of resource affected (purchase, premium_access, etc.)';
COMMENT ON COLUMN audit_log.resource_id IS 'ID of the affected resource';
COMMENT ON COLUMN audit_log.old_values IS 'Previous state (for updates)';
COMMENT ON COLUMN audit_log.new_values IS 'New state (for creates/updates)';



