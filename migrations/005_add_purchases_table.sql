-- Migration: Add Purchases and Premium Access Tables
-- Date: January 10, 2025
-- Purpose: Support payment processing and premium access management

-- Purchases table
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  stripe_session_id TEXT UNIQUE,
  amount INTEGER NOT NULL, -- in cents (1200 = $12.00)
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled', 'refunded')),
  receipt_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Premium access tracking
CREATE TABLE premium_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- NULL = lifetime access
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, assessment_id)
);

-- Indexes for performance
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_assessment_id ON purchases(assessment_id);
CREATE INDEX idx_purchases_stripe_payment_intent_id ON purchases(stripe_payment_intent_id);
CREATE INDEX idx_purchases_stripe_session_id ON purchases(stripe_session_id);
CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_purchases_created_at ON purchases(created_at);

CREATE INDEX idx_premium_access_user_id ON premium_access(user_id);
CREATE INDEX idx_premium_access_assessment_id ON premium_access(assessment_id);
CREATE INDEX idx_premium_access_purchase_id ON premium_access(purchase_id);
CREATE INDEX idx_premium_access_user_assessment ON premium_access(user_id, assessment_id);
CREATE INDEX idx_premium_access_is_active ON premium_access(is_active);
CREATE INDEX idx_premium_access_granted_at ON premium_access(granted_at);

-- Row Level Security (RLS)
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies for purchases
CREATE POLICY "Users can view own purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases"
  ON purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own purchases"
  ON purchases FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for premium_access
CREATE POLICY "Users can view own premium access"
  ON premium_access FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own premium access"
  ON premium_access FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own premium access"
  ON premium_access FOR UPDATE
  USING (auth.uid() = user_id);

-- Functions for premium access management
CREATE OR REPLACE FUNCTION grant_premium_access(
  p_user_id UUID,
  p_assessment_id UUID,
  p_purchase_id UUID,
  p_expires_at TIMESTAMPTZ DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  access_id UUID;
BEGIN
  -- Insert or update premium access
  INSERT INTO premium_access (user_id, assessment_id, purchase_id, expires_at)
  VALUES (p_user_id, p_assessment_id, p_purchase_id, p_expires_at)
  ON CONFLICT (user_id, assessment_id) 
  DO UPDATE SET 
    purchase_id = EXCLUDED.purchase_id,
    granted_at = NOW(),
    expires_at = EXCLUDED.expires_at,
    is_active = true,
    updated_at = NOW()
  RETURNING id INTO access_id;
  
  RETURN access_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION revoke_premium_access(
  p_user_id UUID,
  p_assessment_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE premium_access 
  SET is_active = false, updated_at = NOW()
  WHERE user_id = p_user_id 
    AND assessment_id = p_assessment_id 
    AND is_active = true;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION check_premium_access(
  p_user_id UUID,
  p_assessment_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN := false;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM premium_access 
    WHERE user_id = p_user_id 
      AND assessment_id = p_assessment_id 
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > NOW())
  ) INTO has_access;
  
  RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update trigger for purchases table
CREATE OR REPLACE FUNCTION update_purchases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_purchases_updated_at
  BEFORE UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_purchases_updated_at();

-- Update trigger for premium_access table
CREATE OR REPLACE FUNCTION update_premium_access_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_premium_access_updated_at
  BEFORE UPDATE ON premium_access
  FOR EACH ROW
  EXECUTE FUNCTION update_premium_access_updated_at();

-- Comments for documentation
COMMENT ON TABLE purchases IS 'Stores payment information for premium profile purchases';
COMMENT ON TABLE premium_access IS 'Tracks which users have premium access to which assessments';
COMMENT ON FUNCTION grant_premium_access IS 'Grants premium access to a user for a specific assessment';
COMMENT ON FUNCTION revoke_premium_access IS 'Revokes premium access for a user and assessment';
COMMENT ON FUNCTION check_premium_access IS 'Checks if a user has active premium access for an assessment';

