-- Migration: Create purchases table for payment tracking
-- Date: 2025-01-10
-- Purpose: Store Stripe payment records and purchase history

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create purchases table
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL, -- Will reference assessments table when created
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  stripe_session_id TEXT,
  amount INTEGER NOT NULL, -- Amount in cents (1200 = $12.00)
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled', 'refunded')),
  receipt_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_assessment_id ON purchases(assessment_id);
CREATE INDEX idx_purchases_stripe_payment_intent ON purchases(stripe_payment_intent_id);
CREATE INDEX idx_purchases_stripe_session ON purchases(stripe_session_id);
CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_purchases_created_at ON purchases(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_purchases_updated_at 
  BEFORE UPDATE ON purchases 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own purchases
CREATE POLICY "Users can view own purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own purchases
CREATE POLICY "Users can insert own purchases"
  ON purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own purchases (for status changes)
CREATE POLICY "Users can update own purchases"
  ON purchases FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- System can insert purchases (for webhook processing)
CREATE POLICY "System can insert purchases"
  ON purchases FOR INSERT
  WITH CHECK (true);

-- System can update purchases (for webhook processing)
CREATE POLICY "System can update purchases"
  ON purchases FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE purchases IS 'Stores Stripe payment records and purchase history';
COMMENT ON COLUMN purchases.amount IS 'Amount in cents (1200 = $12.00)';
COMMENT ON COLUMN purchases.stripe_payment_intent_id IS 'Stripe PaymentIntent ID for tracking';
COMMENT ON COLUMN purchases.stripe_session_id IS 'Stripe Checkout Session ID';
COMMENT ON COLUMN purchases.metadata IS 'Additional payment metadata from Stripe';



