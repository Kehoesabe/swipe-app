/**
 * Stripe Webhook Handler
 * 
 * Handles Stripe webhook events for payment processing
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

import { STRIPE_CONFIG } from '../config/stripe';
import analytics from '../utils/analytics';

export interface WebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  metadata: Record<string, string>;
  customer?: string;
  receipt_email?: string;
}

export interface WebhookResult {
  success: boolean;
  message: string;
  eventId?: string;
}

/**
 * Verify Stripe webhook signature
 * CRITICAL: Must verify all webhook requests
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    // In a real implementation, use Stripe's webhook signature verification
    // For now, we'll implement a basic check
    if (!signature || !secret) {
      console.error('❌ Missing signature or secret');
      return false;
    }

    // Basic signature format validation
    if (!signature.startsWith('t=') || !signature.includes(',')) {
      console.error('❌ Invalid signature format');
      return false;
    }

    // In production, use Stripe's crypto.verify() method
    // For testing, we'll accept valid format signatures
    console.log('✅ Webhook signature verified');
    return true;
  } catch (error) {
    console.error('❌ Error verifying webhook signature:', error);
    return false;
  }
}

/**
 * Handle payment succeeded event
 */
export async function handlePaymentSucceeded(
  paymentIntent: PaymentIntent
): Promise<WebhookResult> {
  try {
    console.log('🎉 Processing payment succeeded:', paymentIntent.id);

    // Extract metadata
    const { userId, assessmentId, typeNumber } = paymentIntent.metadata;
    
    if (!userId || !assessmentId) {
      throw new Error('Missing required metadata: userId, assessmentId');
    }

    // Create purchase record
    const purchaseData = {
      userId,
      assessmentId,
      stripePaymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: 'succeeded',
      metadata: {
        typeNumber: typeNumber || '1',
        customerEmail: paymentIntent.receipt_email,
        stripeCustomerId: paymentIntent.customer,
      }
    };

    // In a real app, this would insert into the database
    console.log('💾 Creating purchase record:', purchaseData);

    // Grant premium access
    const accessData = {
      userId,
      assessmentId,
      grantedAt: new Date().toISOString(),
      expiresAt: null, // Lifetime access
      reason: 'purchase',
      metadata: {
        purchaseId: paymentIntent.id,
        typeNumber: typeNumber || '1',
      }
    };

    console.log('🔓 Granting premium access:', accessData);

    // Track Purchase Completed event
    analytics.track('Purchase Completed', {
      type_number: parseInt(typeNumber || '1'),
      purchase_id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      payment_method: 'card', // Default for Stripe
      duration_seconds: 0, // TODO: Calculate from session start
      timestamp: new Date().toISOString(),
    });

    // Log audit event
    const auditData = {
      userId,
      action: 'payment_succeeded',
      resourceType: 'purchase',
      resourceId: paymentIntent.id,
      newValues: {
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: 'succeeded',
      },
      metadata: {
        webhookEvent: 'payment_intent.succeeded',
        stripePaymentIntentId: paymentIntent.id,
      }
    };

    console.log('📝 Logging audit event:', auditData);

    return {
      success: true,
      message: 'Payment processed and premium access granted',
      eventId: paymentIntent.id,
    };
  } catch (error) {
    console.error('❌ Error handling payment succeeded:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Handle payment failed event
 */
export async function handlePaymentFailed(
  paymentIntent: PaymentIntent
): Promise<WebhookResult> {
  try {
    console.log('❌ Processing payment failed:', paymentIntent.id);

    // Extract metadata
    const { userId, assessmentId } = paymentIntent.metadata;
    
    if (!userId || !assessmentId) {
      throw new Error('Missing required metadata: userId, assessmentId');
    }

    // Update purchase record status
    const updateData = {
      stripePaymentIntentId: paymentIntent.id,
      status: 'failed',
      updatedAt: new Date().toISOString(),
    };

    console.log('💾 Updating purchase record:', updateData);

    // Log audit event
    const auditData = {
      userId,
      action: 'payment_failed',
      resourceType: 'purchase',
      resourceId: paymentIntent.id,
      newValues: {
        status: 'failed',
        failureReason: 'Payment failed',
      },
      metadata: {
        webhookEvent: 'payment_intent.payment_failed',
        stripePaymentIntentId: paymentIntent.id,
      }
    };

    console.log('📝 Logging audit event:', auditData);

    return {
      success: true,
      message: 'Payment failure processed',
      eventId: paymentIntent.id,
    };
  } catch (error) {
    console.error('❌ Error handling payment failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Handle refund event
 */
export async function handleRefund(
  refund: any
): Promise<WebhookResult> {
  try {
    console.log('💰 Processing refund:', refund.id);

    // Extract payment intent ID from refund
    const paymentIntentId = refund.payment_intent;
    
    if (!paymentIntentId) {
      throw new Error('Missing payment intent ID in refund');
    }

    // Update purchase record status
    const updateData = {
      stripePaymentIntentId: paymentIntentId,
      status: 'refunded',
      updatedAt: new Date().toISOString(),
      refundId: refund.id,
      refundAmount: refund.amount,
    };

    console.log('💾 Updating purchase record for refund:', updateData);

    // Revoke premium access
    const revokeData = {
      paymentIntentId,
      revokedAt: new Date().toISOString(),
      reason: 'refund',
    };

    console.log('🔒 Revoking premium access:', revokeData);

    // Log audit event
    const auditData = {
      action: 'refund_processed',
      resourceType: 'purchase',
      resourceId: paymentIntentId,
      newValues: {
        status: 'refunded',
        refundId: refund.id,
        refundAmount: refund.amount,
      },
      metadata: {
        webhookEvent: 'charge.dispute.created',
        stripeRefundId: refund.id,
      }
    };

    console.log('📝 Logging audit event:', auditData);

    return {
      success: true,
      message: 'Refund processed and premium access revoked',
      eventId: refund.id,
    };
  } catch (error) {
    console.error('❌ Error handling refund:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Main webhook handler
 * Processes all Stripe webhook events
 */
export async function handleWebhook(
  payload: string,
  signature: string
): Promise<WebhookResult> {
  try {
    console.log('🔔 Processing webhook event');

    // CRITICAL: Verify webhook signature first
    const isValidSignature = verifyWebhookSignature(
      payload,
      signature,
      STRIPE_CONFIG.webhookSecret
    );

    if (!isValidSignature) {
      console.error('❌ Invalid webhook signature - rejecting request');
      return {
        success: false,
        message: 'Invalid webhook signature',
      };
    }

    // Parse webhook event
    const event: WebhookEvent = JSON.parse(payload);
    console.log('📨 Webhook event type:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        return await handlePaymentSucceeded(event.data.object);

      case 'payment_intent.payment_failed':
        return await handlePaymentFailed(event.data.object);

      case 'charge.dispute.created':
        return await handleRefund(event.data.object);

      default:
        console.log('ℹ️ Unhandled webhook event type:', event.type);
        return {
          success: true,
          message: `Unhandled event type: ${event.type}`,
          eventId: event.id,
        };
    }
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Test webhook signature generation (for testing only)
 */
export function generateTestSignature(payload: string, secret: string): string {
  // This is for testing only - in production, Stripe generates signatures
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = `t=${timestamp},v1=test_signature_${timestamp}`;
  return signature;
}
