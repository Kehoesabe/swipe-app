-- Migration: Create premium_access table for access control
-- Date: 2025-01-10
-- Purpose: Track premium access grants and permissions

-- Create premium_access table
CREATE TABLE premium_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL, -- Will reference assessments table when created
  purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- NULL = lifetime access
  granted_by UUID REFERENCES auth.users(id), -- Admin who granted access
  reason TEXT, -- Reason for access grant (purchase, admin, promo, etc.)
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure unique access per user-assessment combination
  UNIQUE(user_id, assessment_id)
);

-- Create indexes for performance
CREATE INDEX idx_premium_access_user_id ON premium_access(user_id);
CREATE INDEX idx_premium_access_assessment_id ON premium_access(assessment_id);
CREATE INDEX idx_premium_access_purchase_id ON premium_access(purchase_id);
CREATE INDEX idx_premium_access_granted_at ON premium_access(granted_at);
CREATE INDEX idx_premium_access_expires_at ON premium_access(expires_at);
CREATE INDEX idx_premium_access_active ON premium_access(user_id, assessment_id) 
  WHERE expires_at IS NULL OR expires_at > NOW();

-- Create updated_at trigger
CREATE TRIGGER update_premium_access_updated_at 
  BEFORE UPDATE ON premium_access 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE premium_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own premium access
CREATE POLICY "Users can view own premium access"
  ON premium_access FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own premium access (for purchases)
CREATE POLICY "Users can insert own premium access"
  ON premium_access FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- System can insert premium access (for webhook processing)
CREATE POLICY "System can insert premium access"
  ON premium_access FOR INSERT
  WITH CHECK (true);

-- System can update premium access (for webhook processing)
CREATE POLICY "System can update premium access"
  ON premium_access FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE premium_access IS 'Tracks premium access grants and permissions';
COMMENT ON COLUMN premium_access.expires_at IS 'NULL means lifetime access';
COMMENT ON COLUMN premium_access.granted_by IS 'Admin who granted access (NULL for purchases)';
COMMENT ON COLUMN premium_access.reason IS 'Reason for access grant (purchase, admin, promo, etc.)';

