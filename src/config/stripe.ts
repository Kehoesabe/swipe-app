/**
 * Stripe Payment Configuration
 * 
 * Configuration for Stripe payment processing
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

export const STRIPE_CONFIG = {
  publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
  priceId: process.env.EXPO_PUBLIC_STRIPE_PRICE_ID || 'price_...',
  currency: 'usd',
  amount: 1200, // $12.00 in cents
  successUrl: '/results?payment=success',
  cancelUrl: '/results?payment=cancelled',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_...',
};

export const PAYMENT_CONFIG = {
  productName: 'Swipe Type Premium Profile',
  description: 'Unlock your complete personality profile with detailed insights, growth strategies, and relationship guidance.',
  price: 12.00,
  currency: 'USD',
  isRecurring: false,
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];



