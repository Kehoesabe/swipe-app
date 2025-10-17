-- Migration: Test data for payment system
-- Date: 2025-01-10
-- Purpose: Insert test data to verify tables and RLS policies work

-- Insert test purchases (only if not in production)
DO $$
BEGIN
  -- Only insert test data if we're in development
  IF current_setting('app.environment', true) = 'development' OR current_setting('app.environment', true) IS NULL THEN
    
    -- Insert test purchase
    INSERT INTO purchases (
      user_id,
      assessment_id,
      stripe_payment_intent_id,
      stripe_session_id,
      amount,
      currency,
      status,
      receipt_url,
      metadata
    ) VALUES (
      '00000000-0000-0000-0000-000000000001'::uuid, -- Test user ID
      '00000000-0000-0000-0000-000000000002'::uuid, -- Test assessment ID
      'pi_test_123456789',
      'cs_test_123456789',
      1200, -- $12.00
      'usd',
      'succeeded',
      'https://pay.stripe.com/receipts/test_receipt_123',
      '{"test": true, "source": "migration"}'::jsonb
    );
    
    -- Insert test premium access
    INSERT INTO premium_access (
      user_id,
      assessment_id,
      purchase_id,
      granted_at,
      expires_at,
      reason,
      metadata
    ) VALUES (
      '00000000-0000-0000-0000-000000000001'::uuid, -- Test user ID
      '00000000-0000-0000-0000-000000000002'::uuid, -- Test assessment ID
      (SELECT id FROM purchases WHERE stripe_payment_intent_id = 'pi_test_123456789'),
      NOW(),
      NULL, -- Lifetime access
      'Test purchase',
      '{"test": true, "source": "migration"}'::jsonb
    );
    
    -- Insert test audit log
    INSERT INTO audit_log (
      user_id,
      action,
      resource_type,
      resource_id,
      new_values,
      metadata
    ) VALUES (
      '00000000-0000-0000-0000-000000000001'::uuid, -- Test user ID
      'payment_succeeded',
      'purchase',
      (SELECT id FROM purchases WHERE stripe_payment_intent_id = 'pi_test_123456789'),
      '{"amount": 1200, "currency": "usd", "status": "succeeded"}'::jsonb,
      '{"test": true, "source": "migration"}'::jsonb
    );
    
    RAISE NOTICE 'Test data inserted successfully';
  ELSE
    RAISE NOTICE 'Skipping test data insertion - not in development environment';
  END IF;
END $$;



