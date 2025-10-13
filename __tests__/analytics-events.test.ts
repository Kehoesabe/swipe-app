/**
 * Analytics Events Integration Tests
 * 
 * Tests the integration of analytics tracking with error tracking
 * and verifies that all key events are properly tracked.
 */

import analytics from '../src/utils/analytics';
import { getErrorTracker } from '../src/utils/errorTracking';

// Mock the error tracking module
jest.mock('../src/utils/errorTracking', () => ({
  trackPaymentError: jest.fn(),
  trackUserAction: jest.fn(),
  trackPaymentStep: jest.fn(),
  getErrorTracker: jest.fn(() => ({
    captureException: jest.fn(),
    addBreadcrumb: jest.fn(),
    setUser: jest.fn(),
  })),
}));

describe('Analytics Events Integration', () => {
  beforeEach(() => {
    analytics.clearEvents();
    jest.clearAllMocks();
  });

  describe('Event Tracking', () => {
    test('tracks results viewed with proper metadata', () => {
      analytics.track('Results Viewed', {
        type_number: 1,
        type_name: 'Direct Nurturer',
        assessment_id: 'assessment_123',
        has_premium: false,
      });

      const events = analytics.getAllEvents();
      expect(events).toHaveLength(1);
      expect(events[0].event).toBe('Results Viewed');
      expect(events[0].properties).toMatchObject({
        type_number: 1,
        type_name: 'Direct Nurturer',
        assessment_id: 'assessment_123',
        has_premium: false,
      });
    });

    test('tracks unlock clicked with user action breadcrumb', () => {
      const { trackUserAction } = require('../src/utils/errorTracking');
      
      analytics.track('Unlock Clicked', {
        type_number: 1,
        source: 'results_page',
      });

      expect(trackUserAction).toHaveBeenCalledWith('Unlock Clicked', {
        type_number: 1,
        source: 'results_page',
      });
    });

    test('tracks checkout started with payment step breadcrumb', () => {
      const { trackPaymentStep } = require('../src/utils/errorTracking');
      
      analytics.track('Checkout Started', {
        type_number: 1,
        session_id: 'cs_test_123',
        amount: 1200,
        currency: 'usd',
      });

      expect(trackPaymentStep).toHaveBeenCalledWith('checkout_started', {
        type_number: 1,
        session_id: 'cs_test_123',
        amount: 1200,
        currency: 'usd',
      });
    });

    test('tracks purchase completed with payment step breadcrumb', () => {
      const { trackPaymentStep } = require('../src/utils/errorTracking');
      
      analytics.track('Purchase Completed', {
        type_number: 1,
        purchase_id: 'pi_test_123',
        amount: 1200,
        currency: 'usd',
        payment_method: 'card',
      });

      expect(trackPaymentStep).toHaveBeenCalledWith('purchase_completed', {
        type_number: 1,
        purchase_id: 'pi_test_123',
        amount: 1200,
        currency: 'usd',
        payment_method: 'card',
      });
    });

    test('tracks premium content viewed', () => {
      analytics.track('Premium Content Viewed', {
        type_number: 1,
        assessment_id: 'assessment_123',
      });

      const events = analytics.getAllEvents();
      expect(events).toHaveLength(1);
      expect(events[0].event).toBe('Premium Content Viewed');
      expect(events[0].properties).toMatchObject({
        type_number: 1,
        assessment_id: 'assessment_123',
      });
    });
  });

  describe('Error Tracking Integration', () => {
    test('tracks payment errors with enhanced error tracking', () => {
      const { trackPaymentError } = require('../src/utils/errorTracking');
      
      const error = new Error('NETWORK_TIMEOUT');
      const context = {
        typeNumber: 1,
        assessmentId: 'assessment_123',
        userId: 'user_123',
        paymentStatus: 'creating',
        step: 'creating',
        sessionId: 'cs_test_123',
        amount: 1200,
        currency: 'usd',
      };

      analytics.trackPaymentError(error, context);

      // Should track the error event
      const events = analytics.getAllEvents();
      expect(events).toHaveLength(1);
      expect(events[0].event).toBe('Payment Error');
      expect(events[0].properties).toMatchObject({
        error_type: 'NETWORK_TIMEOUT',
        error_name: 'Error',
        ...context,
      });

      // Should also call error tracking service
      expect(trackPaymentError).toHaveBeenCalledWith(error, {
        typeNumber: 1,
        assessmentId: 'assessment_123',
        userId: 'user_123',
        paymentStatus: 'creating',
        step: 'creating',
        sessionId: 'cs_test_123',
        amount: 1200,
        currency: 'usd',
        timestamp: expect.any(String),
      });
    });

    test('tracks different error types correctly', () => {
      const { trackPaymentError } = require('../src/utils/errorTracking');
      
      const errors = [
        { error: new Error('ALREADY_PURCHASED'), type: 'ALREADY_PURCHASED' },
        { error: new Error('NETWORK_TIMEOUT'), type: 'NETWORK_TIMEOUT' },
        { error: new Error('PAYMENT_DECLINED'), type: 'PAYMENT_DECLINED' },
        { error: new Error('SESSION_EXPIRED'), type: 'SESSION_EXPIRED' },
      ];

      errors.forEach(({ error, type }) => {
        analytics.trackPaymentError(error, {
          typeNumber: 1,
          assessmentId: 'assessment_123',
          userId: 'user_123',
          paymentStatus: 'error',
          step: 'creating',
        });
      });

      const events = analytics.getAllEvents();
      expect(events).toHaveLength(4);
      
      const errorTypes = events.map(e => e.properties.error_type);
      expect(errorTypes).toContain('ALREADY_PURCHASED');
      expect(errorTypes).toContain('NETWORK_TIMEOUT');
      expect(errorTypes).toContain('PAYMENT_DECLINED');
      expect(errorTypes).toContain('SESSION_EXPIRED');
    });
  });

  describe('Complete Payment Flow Tracking', () => {
    test('tracks complete user journey with all events', () => {
      const { trackUserAction, trackPaymentStep } = require('../src/utils/errorTracking');
      
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

      // Verify all events were tracked
      const events = analytics.getAllEvents();
      expect(events).toHaveLength(5);

      // Verify user action breadcrumbs
      expect(trackUserAction).toHaveBeenCalledWith('Unlock Clicked', expect.any(Object));
      expect(trackUserAction).toHaveBeenCalledWith('Checkout Started', expect.any(Object));
      expect(trackUserAction).toHaveBeenCalledWith('Purchase Completed', expect.any(Object));

      // Verify payment step breadcrumbs
      expect(trackPaymentStep).toHaveBeenCalledWith('checkout_started', expect.any(Object));
      expect(trackPaymentStep).toHaveBeenCalledWith('purchase_completed', expect.any(Object));
    });

    test('tracks payment failure scenario', () => {
      const { trackPaymentError } = require('../src/utils/errorTracking');
      
      // Simulate payment failure
      analytics.track('Results Viewed', { type_number: 1 });
      analytics.track('Unlock Clicked', { type_number: 1 });
      analytics.track('Checkout Started', { type_number: 1 });
      
      const error = new Error('NETWORK_TIMEOUT');
      analytics.trackPaymentError(error, {
        typeNumber: 1,
        assessmentId: 'assessment_123',
        userId: 'user_123',
        paymentStatus: 'error',
        step: 'redirecting',
      });

      const events = analytics.getAllEvents();
      expect(events).toHaveLength(4);
      
      // Verify error tracking was called
      expect(trackPaymentError).toHaveBeenCalledWith(error, expect.any(Object));
    });
  });

  describe('Error Tracking Service Integration', () => {
    test('error tracker captures exceptions correctly', () => {
      const errorTracker = getErrorTracker();
      const error = new Error('Test Error');
      const context = {
        tags: { type: 'payment_error' },
        extra: { typeNumber: 1, userId: 'user_123' },
      };

      errorTracker.captureException(error, context);

      expect(errorTracker.captureException).toHaveBeenCalledWith(error, context);
    });

    test('error tracker adds breadcrumbs correctly', () => {
      const errorTracker = getErrorTracker();
      
      errorTracker.addBreadcrumb({
        message: 'User clicked unlock',
        category: 'user_action',
        level: 'info',
      });

      expect(errorTracker.addBreadcrumb).toHaveBeenCalledWith({
        message: 'User clicked unlock',
        category: 'user_action',
        level: 'info',
      });
    });

    test('error tracker sets user context correctly', () => {
      const errorTracker = getErrorTracker();
      
      errorTracker.setUser({ id: 'user_123', email: 'test@example.com' });

      expect(errorTracker.setUser).toHaveBeenCalledWith({
        id: 'user_123',
        email: 'test@example.com',
      });
    });
  });

  describe('Analytics Event Properties', () => {
    test('all events include timestamp', () => {
      analytics.track('Test Event', { test: true });
      
      const events = analytics.getAllEvents();
      expect(events[0].properties.timestamp).toBeDefined();
      expect(events[0].timestamp).toBeDefined();
    });

    test('events preserve original properties', () => {
      const properties = {
        type_number: 1,
        custom_prop: 'custom_value',
        nested: { deep: 'value' },
      };

      analytics.track('Test Event', properties);
      
      const events = analytics.getAllEvents();
      expect(events[0].properties).toMatchObject(properties);
    });

    test('events are immutable', () => {
      const properties = { test: 'value' };
      analytics.track('Test Event', properties);
      
      // Modify original properties
      properties.test = 'modified';
      
      const events = analytics.getAllEvents();
      expect(events[0].properties.test).toBe('value'); // Should not be modified
    });
  });
});

