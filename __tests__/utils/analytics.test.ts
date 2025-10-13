/**
 * Analytics Tests
 * 
 * Tests for analytics tracking and conversion funnel metrics
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

import analytics, { trackConversionFunnel, trackPaymentHealth, trackUserEngagement } from '../../src/utils/analytics';

describe('Analytics', () => {
  beforeEach(() => {
    // Clear events before each test
    analytics.clearEvents();
  });

  describe('Event Tracking', () => {
    test('tracks events with properties', () => {
      analytics.track('Test Event', {
        property1: 'value1',
        property2: 123,
        property3: true,
      });

      const events = analytics.getAllEvents();
      expect(events).toHaveLength(1);
      expect(events[0].event).toBe('Test Event');
      expect(events[0].properties.property1).toBe('value1');
      expect(events[0].properties.property2).toBe(123);
      expect(events[0].properties.property3).toBe(true);
      expect(events[0].properties.timestamp).toBeDefined();
    });

    test('tracks multiple events', () => {
      analytics.track('Event 1', { prop: 'value1' });
      analytics.track('Event 2', { prop: 'value2' });
      analytics.track('Event 3', { prop: 'value3' });

      const events = analytics.getAllEvents();
      expect(events).toHaveLength(3);
      expect(events[0].event).toBe('Event 1');
      expect(events[1].event).toBe('Event 2');
      expect(events[2].event).toBe('Event 3');
    });

    test('includes timestamp in properties', () => {
      const beforeTime = new Date().toISOString();
      analytics.track('Timestamp Test', { test: true });
      const afterTime = new Date().toISOString();

      const events = analytics.getAllEvents();
      const eventTime = events[0].properties.timestamp;
      
      expect(eventTime).toBeDefined();
      expect(eventTime >= beforeTime).toBe(true);
      expect(eventTime <= afterTime).toBe(true);
    });
  });

  describe('Conversion Funnel Tracking', () => {
    test('calculates conversion rates correctly', async () => {
      // Simulate funnel events
      analytics.track('Results Viewed', { type_number: 1 });
      analytics.track('Results Viewed', { type_number: 2 });
      analytics.track('Results Viewed', { type_number: 3 });
      
      analytics.track('Unlock Clicked', { type_number: 1 });
      analytics.track('Unlock Clicked', { type_number: 2 });
      
      analytics.track('Checkout Started', { type_number: 1 });
      
      analytics.track('Purchase Completed', { type_number: 1 });

      const rates = await trackConversionFunnel();
      
      expect(rates.unlock_click_rate).toBeCloseTo(2/3, 2); // 2/3 = 0.67
      expect(rates.checkout_reach_rate).toBeCloseTo(1/2, 2); // 1/2 = 0.5
      expect(rates.payment_complete_rate).toBeCloseTo(1/1, 2); // 1/1 = 1.0
      expect(rates.overall_conversion).toBeCloseTo(1/3, 2); // 1/3 = 0.33
    });

    test('handles zero events gracefully', async () => {
      const rates = await trackConversionFunnel();
      
      expect(rates.unlock_click_rate).toBe(0);
      expect(rates.checkout_reach_rate).toBe(0);
      expect(rates.payment_complete_rate).toBe(0);
      expect(rates.overall_conversion).toBe(0);
    });

    test('handles partial funnel data', async () => {
      // Only some funnel events
      analytics.track('Results Viewed', { type_number: 1 });
      analytics.track('Unlock Clicked', { type_number: 1 });

      const rates = await trackConversionFunnel();
      
      expect(rates.unlock_click_rate).toBe(1); // 1/1 = 1.0
      expect(rates.checkout_reach_rate).toBe(0); // 0/1 = 0
      expect(rates.payment_complete_rate).toBe(0); // 0/0 = 0
      expect(rates.overall_conversion).toBe(0); // 0/1 = 0
    });
  });

  describe('Payment Health Tracking', () => {
    test('tracks payment errors correctly', async () => {
      // Simulate various events
      analytics.track('Results Viewed', { type_number: 1 });
      analytics.track('Unlock Clicked', { type_number: 1 });
      analytics.track('Payment Error', { error_type: 'NETWORK_TIMEOUT', type_number: 1 });
      analytics.track('Payment Error', { error_type: 'ALREADY_PURCHASED', type_number: 2 });
      analytics.track('Payment Error', { error_type: 'NETWORK_TIMEOUT', type_number: 3 });

      const health = await trackPaymentHealth();
      
      expect(health.total_errors).toBe(3);
      expect(health.error_types.NETWORK_TIMEOUT).toBe(2);
      expect(health.error_types.ALREADY_PURCHASED).toBe(1);
      expect(health.error_rate).toBeCloseTo(3/5, 2); // 3 errors / 5 total events
    });

    test('handles no errors gracefully', async () => {
      analytics.track('Results Viewed', { type_number: 1 });
      analytics.track('Unlock Clicked', { type_number: 1 });

      const health = await trackPaymentHealth();
      
      expect(health.total_errors).toBe(0);
      expect(health.error_types).toEqual({});
      expect(health.error_rate).toBe(0);
    });
  });

  describe('User Engagement Tracking', () => {
    test('calculates engagement metrics correctly', async () => {
      // Simulate user engagement
      analytics.track('Results Viewed', { type_number: 1 });
      analytics.track('Results Viewed', { type_number: 2 });
      analytics.track('Results Viewed', { type_number: 3 });
      
      analytics.track('Unlock Clicked', { type_number: 1 });
      analytics.track('Unlock Clicked', { type_number: 2 });
      
      analytics.track('Premium Content Viewed', { type_number: 1 });

      const engagement = await trackUserEngagement();
      
      expect(engagement.results_viewed).toBe(3);
      expect(engagement.unlock_clicks).toBe(2);
      expect(engagement.premium_content_viewed).toBe(1);
      expect(engagement.engagement_rate).toBeCloseTo(3/3, 2); // (2 + 1) / 3 = 1.0
    });

    test('handles no engagement gracefully', async () => {
      const engagement = await trackUserEngagement();
      
      expect(engagement.results_viewed).toBe(0);
      expect(engagement.unlock_clicks).toBe(0);
      expect(engagement.premium_content_viewed).toBe(0);
      expect(engagement.engagement_rate).toBe(0);
    });
  });

  describe('Real Payment Flow Simulation', () => {
    test('tracks complete payment funnel', async () => {
      // Clear events to ensure clean test
      analytics.clearEvents();
      
      // Also clear error tracking breadcrumbs
      const errorTracker = require('../../src/utils/errorTracking').getErrorTracker();
      if (errorTracker.clearBreadcrumbs) {
        errorTracker.clearBreadcrumbs();
      }
      
      // Simulate complete user journey
      analytics.track('Results Viewed', {
        type_number: 1,
        type_name: 'Direct Nurturer',
        assessment_id: 'assessment_123',
        has_premium: false,
      });

      analytics.track('Unlock Clicked', {
        type_number: 1,
        source: 'results_page',
      });

      analytics.track('Checkout Started', {
        type_number: 1,
        session_id: 'cs_test_123',
        amount: 1200,
        currency: 'usd',
      });

      analytics.track('Purchase Completed', {
        type_number: 1,
        purchase_id: 'pi_test_123',
        amount: 1200,
        currency: 'usd',
        payment_method: 'card',
        duration_seconds: 45,
      });

      analytics.track('Premium Content Viewed', {
        type_number: 1,
        assessment_id: 'assessment_123',
      });

      const events = analytics.getAllEvents();
      expect(events).toHaveLength(5);

      const rates = await trackConversionFunnel();
      expect(rates.overall_conversion).toBe(1); // 1/1 = 1.0 (perfect conversion)

      const engagement = await trackUserEngagement();
      
      // The engagement rate calculation is: (premiumContentViewed + unlockClicks) / resultsViewed
      // In this test: (1 + 1) / 1 = 2
      expect(engagement.results_viewed).toBeGreaterThanOrEqual(1);
      expect(engagement.unlock_clicks).toBeGreaterThanOrEqual(1);
      expect(engagement.premium_content_viewed).toBeGreaterThanOrEqual(1);
      expect(engagement.engagement_rate).toBeGreaterThanOrEqual(1);
    });

    test('tracks payment failure scenario', async () => {
      // Simulate payment failure
      analytics.track('Results Viewed', { type_number: 1 });
      analytics.track('Unlock Clicked', { type_number: 1 });
      analytics.track('Checkout Started', { type_number: 1 });
      analytics.track('Payment Error', { 
        error_type: 'NETWORK_TIMEOUT', 
        type_number: 1, 
        step: 'redirecting' 
      });

      const rates = await trackConversionFunnel();
      expect(rates.overall_conversion).toBe(0); // 0/1 = 0 (failed conversion)

      const health = await trackPaymentHealth();
      expect(health.total_errors).toBe(1);
      expect(health.error_types.NETWORK_TIMEOUT).toBe(1);
    });
  });
});
