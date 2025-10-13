/**
 * Payment Flow Integration Tests
 * 
 * Tests the complete payment flow from ResultsScreen to Stripe checkout
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

import { createCheckoutSession, checkPremiumAccess, handlePaymentSuccess } from '../../src/api/payment';

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Payment Flow Integration', () => {
  const mockParams = {
    assessmentId: 'assessment_123',
    userId: 'user_456',
    typeNumber: 1
  };

  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('Complete Payment Flow', () => {
    test('creates checkout session and handles payment success', async () => {
      // Mock successful checkout session creation
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          sessionId: 'cs_test_123456789',
          url: 'https://checkout.stripe.com/pay/cs_test_123456789'
        })
      });

      // Create checkout session
      const session = await createCheckoutSession(mockParams);
      
      expect(session).toBeDefined();
      expect(session.sessionId).toBe('cs_test_123456789');
      expect(session.url).toContain('checkout.stripe.com');

      // Mock premium access check (initially false)
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ hasAccess: false })
      });

      const initialAccess = await checkPremiumAccess(mockParams.userId, mockParams.assessmentId);
      expect(initialAccess.hasAccess).toBe(false);

      // Mock successful payment verification
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      const paymentSuccess = await handlePaymentSuccess(
        'pi_test_123456789',
        mockParams.assessmentId,
        mockParams.userId
      );
      
      expect(paymentSuccess).toBe(true);

      // Mock premium access check (now true)
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ hasAccess: true, grantedAt: '2025-01-10T10:00:00Z' })
      });

      const finalAccess = await checkPremiumAccess(mockParams.userId, mockParams.assessmentId);
      expect(finalAccess.hasAccess).toBe(true);
    });

    test('handles payment cancellation gracefully', async () => {
      // Mock successful checkout session creation
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          sessionId: 'cs_test_123456789',
          url: 'https://checkout.stripe.com/pay/cs_test_123456789'
        })
      });

      const session = await createCheckoutSession(mockParams);
      expect(session).toBeDefined();

      // Mock premium access check (still false after cancellation)
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ hasAccess: false })
      });

      const accessAfterCancel = await checkPremiumAccess(mockParams.userId, mockParams.assessmentId);
      expect(accessAfterCancel.hasAccess).toBe(false);
    });

    test('handles payment failure', async () => {
      // Mock successful checkout session creation
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          sessionId: 'cs_test_123456789',
          url: 'https://checkout.stripe.com/pay/cs_test_123456789'
        })
      });

      const session = await createCheckoutSession(mockParams);
      expect(session).toBeDefined();

      // Mock failed payment verification
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: false, error: 'Payment failed' })
      });

      const paymentFailure = await handlePaymentSuccess(
        'pi_test_failed_123',
        mockParams.assessmentId,
        mockParams.userId
      );
      
      expect(paymentFailure).toBe(false);

      // Mock premium access check (still false after failure)
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ hasAccess: false })
      });

      const accessAfterFailure = await checkPremiumAccess(mockParams.userId, mockParams.assessmentId);
      expect(accessAfterFailure.hasAccess).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('handles checkout session creation failure', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Failed to create session' })
      });

      await expect(createCheckoutSession(mockParams)).rejects.toThrow('Failed to create session');
    });

    test('handles premium access check failure', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      const access = await checkPremiumAccess(mockParams.userId, mockParams.assessmentId);
      expect(access.hasAccess).toBe(false);
    });

    test('handles payment verification failure', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Verification failed' })
      });

      const result = await handlePaymentSuccess(
        'pi_test_123',
        mockParams.assessmentId,
        mockParams.userId
      );
      
      expect(result).toBe(false);
    });
  });

  describe('URL Handling', () => {
    test('parses payment success URL correctly', () => {
      const { getPaymentStatusFromUrl } = require('../../src/api/payment');
      
      // Test with direct search string parameter
      const status = getPaymentStatusFromUrl('?payment=success&payment_intent=pi_test_123456789');
      expect(status.status).toBe('success');
      expect(status.paymentIntentId).toBe('pi_test_123456789');
    });

    test('parses payment cancellation URL correctly', () => {
      const { getPaymentStatusFromUrl } = require('../../src/api/payment');
      
      const status = getPaymentStatusFromUrl('?payment=cancelled');
      expect(status.status).toBe('cancelled');
      expect(status.paymentIntentId).toBe(null);
    });

    test('parses payment error URL correctly', () => {
      const { getPaymentStatusFromUrl } = require('../../src/api/payment');
      
      const status = getPaymentStatusFromUrl('?error=payment_failed&message=Card%20declined');
      expect(status.status).toBe('error');
      expect(status.error).toBe('payment_failed');
    });

    test('handles empty URL parameters', () => {
      const { getPaymentStatusFromUrl } = require('../../src/api/payment');
      
      const status = getPaymentStatusFromUrl('');
      expect(status.status).toBe(null);
      expect(status.paymentIntentId).toBe(null);
    });
  });
});
