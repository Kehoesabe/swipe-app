-- Verification script for payment system tables
-- Run this after migrations to verify everything is working

-- Check if tables exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('purchases', 'premium_access', 'audit_log')
ORDER BY table_name;

-- Check RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('purchases', 'premium_access', 'audit_log');

-- Check indexes exist
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('purchases', 'premium_access', 'audit_log')
ORDER BY tablename, indexname;

-- Check RLS policies exist
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('purchases', 'premium_access', 'audit_log')
ORDER BY tablename, policyname;

-- Test data verification (if test data was inserted)
SELECT 
  'purchases' as table_name,
  COUNT(*) as record_count,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT stripe_payment_intent_id) as unique_payments
FROM purchases
UNION ALL
SELECT 
  'premium_access' as table_name,
  COUNT(*) as record_count,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT assessment_id) as unique_assessments
FROM premium_access
UNION ALL
SELECT 
  'audit_log' as table_name,
  COUNT(*) as record_count,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT action) as unique_actions
FROM audit_log;

-- Test RLS by checking if we can see test data
-- (This should work if RLS is properly configured)
SELECT 
  'RLS Test' as test_name,
  CASE 
    WHEN COUNT(*) > 0 THEN 'PASS - Can read test data'
    ELSE 'FAIL - Cannot read test data'
  END as result
FROM purchases 
WHERE stripe_payment_intent_id = 'pi_test_123456789';

