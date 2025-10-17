/**
 * Stripe Configuration Tests
 * 
 * Tests for Stripe configuration setup
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

import {
  STRIPE_CONFIG,
  PAYMENT_CONFIG,
  PAYMENT_STATUS,
  type PaymentStatus
} from '../../src/config/stripe';

describe('Stripe Configuration', () => {
  describe('STRIPE_CONFIG', () => {
    test('exports all required configuration', () => {
      expect(STRIPE_CONFIG).toBeDefined();
      expect(STRIPE_CONFIG.publishableKey).toBeDefined();
      expect(STRIPE_CONFIG.priceId).toBeDefined();
      expect(STRIPE_CONFIG.currency).toBe('usd');
      expect(STRIPE_CONFIG.amount).toBe(1200);
      expect(STRIPE_CONFIG.successUrl).toBeDefined();
      expect(STRIPE_CONFIG.cancelUrl).toBeDefined();
      expect(STRIPE_CONFIG.webhookSecret).toBeDefined();
    });

    test('has correct amount in cents', () => {
      expect(STRIPE_CONFIG.amount).toBe(1200); // $12.00
    });

    test('has correct currency', () => {
      expect(STRIPE_CONFIG.currency).toBe('usd');
    });

    test('has valid success URL', () => {
      expect(STRIPE_CONFIG.successUrl).toContain('payment=success');
    });

    test('has valid cancel URL', () => {
      expect(STRIPE_CONFIG.cancelUrl).toContain('payment=cancelled');
    });
  });

  describe('PAYMENT_CONFIG', () => {
    test('exports all required payment configuration', () => {
      expect(PAYMENT_CONFIG).toBeDefined();
      expect(PAYMENT_CONFIG.productName).toBeDefined();
      expect(PAYMENT_CONFIG.description).toBeDefined();
      expect(PAYMENT_CONFIG.price).toBe(12.00);
      expect(PAYMENT_CONFIG.currency).toBe('USD');
      expect(PAYMENT_CONFIG.isRecurring).toBe(false);
    });

    test('has correct price', () => {
      expect(PAYMENT_CONFIG.price).toBe(12.00);
    });

    test('is not recurring', () => {
      expect(PAYMENT_CONFIG.isRecurring).toBe(false);
    });
  });

  describe('PAYMENT_STATUS', () => {
    test('exports all payment status constants', () => {
      expect(PAYMENT_STATUS.PENDING).toBe('pending');
      expect(PAYMENT_STATUS.SUCCEEDED).toBe('succeeded');
      expect(PAYMENT_STATUS.FAILED).toBe('failed');
      expect(PAYMENT_STATUS.CANCELLED).toBe('cancelled');
      expect(PAYMENT_STATUS.REFUNDED).toBe('refunded');
    });

    test('PaymentStatus type works correctly', () => {
      const status: PaymentStatus = PAYMENT_STATUS.SUCCEEDED;
      expect(status).toBe('succeeded');
    });
  });

  describe('Configuration Validation', () => {
    test('publishable key has correct format', () => {
      const key = STRIPE_CONFIG.publishableKey;
      expect(key).toMatch(/^pk_(test_|live_)/);
    });

    test('price ID has correct format', () => {
      const priceId = STRIPE_CONFIG.priceId;
      expect(priceId).toMatch(/^price_/);
    });

    test('webhook secret has correct format', () => {
      const secret = STRIPE_CONFIG.webhookSecret;
      expect(secret).toMatch(/^whsec_/);
    });
  });
});



