-- Custom Metrics Dashboard Queries
-- These SQL queries can be used with your analytics platform to create dashboards

-- ==============================================
-- DAILY REVENUE METRICS
-- ==============================================

-- Daily Revenue (Last 30 Days)
SELECT 
  DATE(created_at) as date,
  COUNT(*) as purchases,
  SUM(amount)/100 as revenue_usd,
  AVG(amount)/100 as avg_purchase_value,
  COUNT(DISTINCT user_id) as unique_customers
FROM purchases
WHERE status = 'succeeded'
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Weekly Revenue Summary
SELECT 
  DATE_TRUNC('week', created_at) as week_start,
  COUNT(*) as purchases,
  SUM(amount)/100 as revenue_usd,
  COUNT(DISTINCT user_id) as unique_customers
FROM purchases
WHERE status = 'succeeded'
  AND created_at >= NOW() - INTERVAL '12 weeks'
GROUP BY DATE_TRUNC('week', created_at)
ORDER BY week_start DESC;

-- Monthly Revenue Trends
SELECT 
  DATE_TRUNC('month', created_at) as month_start,
  COUNT(*) as purchases,
  SUM(amount)/100 as revenue_usd,
  COUNT(DISTINCT user_id) as unique_customers,
  ROUND(SUM(amount)/100.0 / COUNT(*), 2) as avg_purchase_value
FROM purchases
WHERE status = 'succeeded'
  AND created_at >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month_start DESC;

-- ==============================================
-- CONVERSION FUNNEL METRICS
-- ==============================================

-- Conversion Funnel (Last 7 Days)
SELECT 
  COUNT(DISTINCT CASE WHEN event = 'Results Viewed' THEN user_id END) as viewed_results,
  COUNT(DISTINCT CASE WHEN event = 'Unlock Clicked' THEN user_id END) as clicked_unlock,
  COUNT(DISTINCT CASE WHEN event = 'Checkout Started' THEN user_id END) as started_checkout,
  COUNT(DISTINCT CASE WHEN event = 'Purchase Completed' THEN user_id END) as completed_purchase,
  
  -- Conversion Rates
  ROUND(
    COUNT(DISTINCT CASE WHEN event = 'Unlock Clicked' THEN user_id END) * 100.0 / 
    NULLIF(COUNT(DISTINCT CASE WHEN event = 'Results Viewed' THEN user_id END), 0), 2
  ) as unlock_click_rate,
  
  ROUND(
    COUNT(DISTINCT CASE WHEN event = 'Checkout Started' THEN user_id END) * 100.0 / 
    NULLIF(COUNT(DISTINCT CASE WHEN event = 'Unlock Clicked' THEN user_id END), 0), 2
  ) as checkout_reach_rate,
  
  ROUND(
    COUNT(DISTINCT CASE WHEN event = 'Purchase Completed' THEN user_id END) * 100.0 / 
    NULLIF(COUNT(DISTINCT CASE WHEN event = 'Checkout Started' THEN user_id END), 0), 2
  ) as payment_complete_rate,
  
  ROUND(
    COUNT(DISTINCT CASE WHEN event = 'Purchase Completed' THEN user_id END) * 100.0 / 
    NULLIF(COUNT(DISTINCT CASE WHEN event = 'Results Viewed' THEN user_id END), 0), 2
  ) as overall_conversion_rate
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '7 days';

-- Conversion Funnel by Swipe Type (Last 7 Days)
SELECT 
  properties->>'type_number' as type_number,
  properties->>'type_name' as type_name,
  COUNT(DISTINCT CASE WHEN event = 'Results Viewed' THEN user_id END) as viewed_results,
  COUNT(DISTINCT CASE WHEN event = 'Unlock Clicked' THEN user_id END) as clicked_unlock,
  COUNT(DISTINCT CASE WHEN event = 'Checkout Started' THEN user_id END) as started_checkout,
  COUNT(DISTINCT CASE WHEN event = 'Purchase Completed' THEN user_id END) as completed_purchase,
  
  ROUND(
    COUNT(DISTINCT CASE WHEN event = 'Purchase Completed' THEN user_id END) * 100.0 / 
    NULLIF(COUNT(DISTINCT CASE WHEN event = 'Results Viewed' THEN user_id END), 0), 2
  ) as conversion_rate
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '7 days'
  AND event IN ('Results Viewed', 'Unlock Clicked', 'Checkout Started', 'Purchase Completed')
GROUP BY properties->>'type_number', properties->>'type_name'
ORDER BY conversion_rate DESC;

-- ==============================================
-- PAYMENT HEALTH METRICS
-- ==============================================

-- Payment Status Distribution (Last 7 Days)
SELECT 
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM purchases
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY status
ORDER BY count DESC;

-- Payment Health Trends (Daily)
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_purchases,
  COUNT(CASE WHEN status = 'succeeded' THEN 1 END) as successful,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
  COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
  ROUND(
    COUNT(CASE WHEN status = 'succeeded' THEN 1 END) * 100.0 / COUNT(*), 2
  ) as success_rate
FROM purchases
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Payment Error Analysis
SELECT 
  error_type,
  COUNT(*) as error_count,
  COUNT(DISTINCT user_id) as affected_users,
  ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - created_at))), 2) as avg_resolution_time_seconds
FROM purchases
WHERE status = 'failed'
  AND created_at >= NOW() - INTERVAL '7 days'
GROUP BY error_type
ORDER BY error_count DESC;

-- ==============================================
-- USER ENGAGEMENT METRICS
-- ==============================================

-- User Engagement by Swipe Type
SELECT 
  properties->>'type_number' as type_number,
  properties->>'type_name' as type_name,
  COUNT(DISTINCT CASE WHEN event = 'Results Viewed' THEN user_id END) as unique_viewers,
  COUNT(CASE WHEN event = 'Results Viewed' THEN 1 END) as total_views,
  COUNT(CASE WHEN event = 'Unlock Clicked' THEN 1 END) as unlock_clicks,
  COUNT(CASE WHEN event = 'Premium Content Viewed' THEN 1 END) as premium_views,
  
  ROUND(
    COUNT(CASE WHEN event = 'Unlock Clicked' THEN 1 END) * 100.0 / 
    NULLIF(COUNT(CASE WHEN event = 'Results Viewed' THEN 1 END), 0), 2
  ) as engagement_rate
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '7 days'
  AND event IN ('Results Viewed', 'Unlock Clicked', 'Premium Content Viewed')
GROUP BY properties->>'type_number', properties->>'type_name'
ORDER BY engagement_rate DESC;

-- User Journey Analysis
SELECT 
  user_id,
  COUNT(CASE WHEN event = 'Results Viewed' THEN 1 END) as results_views,
  COUNT(CASE WHEN event = 'Unlock Clicked' THEN 1 END) as unlock_clicks,
  COUNT(CASE WHEN event = 'Checkout Started' THEN 1 END) as checkout_attempts,
  COUNT(CASE WHEN event = 'Purchase Completed' THEN 1 END) as successful_purchases,
  MIN(created_at) as first_activity,
  MAX(created_at) as last_activity
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY user_id
HAVING COUNT(CASE WHEN event = 'Results Viewed' THEN 1 END) > 0
ORDER BY successful_purchases DESC, results_views DESC;

-- ==============================================
-- PERFORMANCE METRICS
-- ==============================================

-- Average Payment Processing Time
SELECT 
  DATE(created_at) as date,
  COUNT(*) as purchases,
  ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - created_at))), 2) as avg_processing_time_seconds,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (updated_at - created_at))), 2) as median_processing_time_seconds,
  ROUND(PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (updated_at - created_at))), 2) as p95_processing_time_seconds
FROM purchases
WHERE status = 'succeeded'
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Webhook Processing Performance
SELECT 
  DATE(created_at) as date,
  COUNT(*) as webhook_events,
  ROUND(AVG(EXTRACT(EPOCH FROM (processed_at - created_at))), 2) as avg_processing_time_seconds,
  COUNT(CASE WHEN processed_at - created_at > INTERVAL '5 minutes' THEN 1 END) as delayed_webhooks
FROM webhook_events
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- ==============================================
-- BUSINESS INTELLIGENCE QUERIES
-- ==============================================

-- Revenue by Swipe Type
SELECT 
  p.assessment_id,
  a.swipe_type,
  a.swipe_type_name,
  COUNT(*) as purchases,
  SUM(p.amount)/100 as revenue_usd,
  ROUND(AVG(p.amount)/100, 2) as avg_purchase_value
FROM purchases p
JOIN assessment_sessions a ON p.assessment_id = a.id
WHERE p.status = 'succeeded'
  AND p.created_at >= NOW() - INTERVAL '30 days'
GROUP BY p.assessment_id, a.swipe_type, a.swipe_type_name
ORDER BY revenue_usd DESC;

-- Customer Lifetime Value (CLV)
SELECT 
  user_id,
  COUNT(*) as total_purchases,
  SUM(amount)/100 as total_spent,
  ROUND(AVG(amount)/100, 2) as avg_purchase_value,
  MIN(created_at) as first_purchase,
  MAX(created_at) as last_purchase,
  ROUND(EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at)))/86400, 2) as customer_lifespan_days
FROM purchases
WHERE status = 'succeeded'
  AND created_at >= NOW() - INTERVAL '90 days'
GROUP BY user_id
HAVING COUNT(*) > 1
ORDER BY total_spent DESC;

-- Churn Analysis (Users who viewed results but didn't purchase)
SELECT 
  DATE(ae.created_at) as date,
  COUNT(DISTINCT ae.user_id) as users_viewed_results,
  COUNT(DISTINCT p.user_id) as users_purchased,
  ROUND(
    (COUNT(DISTINCT ae.user_id) - COUNT(DISTINCT p.user_id)) * 100.0 / 
    NULLIF(COUNT(DISTINCT ae.user_id), 0), 2
  ) as churn_rate
FROM analytics_events ae
LEFT JOIN purchases p ON ae.user_id = p.user_id 
  AND DATE(ae.created_at) = DATE(p.created_at)
  AND p.status = 'succeeded'
WHERE ae.event = 'Results Viewed'
  AND ae.created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(ae.created_at)
ORDER BY date DESC;



