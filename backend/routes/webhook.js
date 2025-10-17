/**
 * Webhook API Routes
 * 
 * Backend routes for handling Stripe webhooks including payment events,
 * refunds, and premium access management.
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

const express = require('express');
const { logAuditEvent } = require('../utils/audit');
const Stripe = require('stripe');

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /api/webhook/stripe
 * Handle Stripe webhook events
 */
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!sig || !webhookSecret) {
      console.error('Missing Stripe signature or webhook secret');
      return res.status(400).json({ error: 'Missing signature or webhook secret' });
    }
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    console.log(`🔔 Received Stripe webhook: ${event.type}`);
    
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(req.db, event.data.object);
        break;
        
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(req.db, event.data.object);
        break;
        
      case 'charge.dispute.created':
        await handleDisputeCreated(req.db, event.data.object);
        break;
        
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(req.db, event.data.object);
        break;
        
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(req.db, event.data.object);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(db, paymentIntent) {
  try {
    const { metadata } = paymentIntent;
    
    if (!metadata.user_id || !metadata.assessment_id) {
      console.error('Missing required metadata in payment intent');
      return;
    }
    
    // Check if already processed (idempotency)
    const existingAccess = await db.query(`
      SELECT id FROM premium_access 
      WHERE user_id = $1 AND assessment_id = $2 AND revoked_at IS NULL
    `, [metadata.user_id, metadata.assessment_id]);
    
    if (existingAccess.rows.length > 0) {
      console.log('Access already granted, skipping');
      return;
    }
    
    // Update purchase status
    await db.query(`
      UPDATE purchases 
      SET status = 'succeeded', paid_at = NOW()
      WHERE stripe_payment_intent_id = $1
    `, [paymentIntent.id]);
    
    // Grant premium access
    const accessResult = await db.query(`
      INSERT INTO premium_access (
        user_id,
        assessment_id,
        granted_at,
        reason
      ) VALUES ($1, $2, NOW(), 'purchase')
      RETURNING id
    `, [metadata.user_id, metadata.assessment_id]);
    
    // Log audit event
    await logAuditEvent(db, {
      user_id: metadata.user_id,
      action: 'premium_access_granted',
      resource_type: 'premium_access',
      resource_id: accessResult.rows[0].id,
      new_values: {
        assessment_id: metadata.assessment_id,
        type_number: metadata.type_number,
        type_name: metadata.type_name,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      },
    });
    
    console.log(`✅ Premium access granted for user ${metadata.user_id}, assessment ${metadata.assessment_id}`);
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(db, paymentIntent) {
  try {
    const { metadata } = paymentIntent;
    
    if (!metadata.user_id || !metadata.assessment_id) {
      console.error('Missing required metadata in payment intent');
      return;
    }
    
    // Update purchase status
    await db.query(`
      UPDATE purchases 
      SET status = 'failed'
      WHERE stripe_payment_intent_id = $1
    `, [paymentIntent.id]);
    
    // Log audit event
    await logAuditEvent(db, {
      user_id: metadata.user_id,
      action: 'payment_failed',
      resource_type: 'purchase',
      resource_id: paymentIntent.id,
      new_values: {
        assessment_id: metadata.assessment_id,
        failure_reason: paymentIntent.last_payment_error?.message,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      },
    });
    
    console.log(`❌ Payment failed for user ${metadata.user_id}, assessment ${metadata.assessment_id}`);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

/**
 * Handle dispute created
 */
async function handleDisputeCreated(db, dispute) {
  try {
    const paymentIntentId = dispute.payment_intent;
    
    // Get purchase details
    const purchaseResult = await db.query(`
      SELECT * FROM purchases WHERE stripe_payment_intent_id = $1
    `, [paymentIntentId]);
    
    if (purchaseResult.rows.length === 0) {
      console.error('Purchase not found for dispute');
      return;
    }
    
    const purchase = purchaseResult.rows[0];
    
    // Update purchase status
    await db.query(`
      UPDATE purchases 
      SET status = 'disputed'
      WHERE id = $1
    `, [purchase.id]);
    
    // Revoke premium access
    await db.query(`
      UPDATE premium_access
      SET revoked_at = NOW(), revoked_by = 'stripe_dispute'
      WHERE user_id = $1 AND assessment_id = $2 AND revoked_at IS NULL
    `, [purchase.user_id, purchase.assessment_id]);
    
    // Log audit event
    await logAuditEvent(db, {
      user_id: purchase.user_id,
      action: 'dispute_created',
      resource_type: 'purchase',
      resource_id: purchase.id,
      new_values: {
        dispute_id: dispute.id,
        dispute_reason: dispute.reason,
        dispute_amount: dispute.amount,
        dispute_currency: dispute.currency,
      },
    });
    
    console.log(`⚠️ Dispute created for purchase ${purchase.id}, dispute ${dispute.id}`);
  } catch (error) {
    console.error('Error handling dispute created:', error);
  }
}

/**
 * Handle invoice payment succeeded
 */
async function handleInvoicePaymentSucceeded(db, invoice) {
  try {
    console.log(`Invoice payment succeeded: ${invoice.id}`);
    // Handle subscription payments if needed
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}

/**
 * Handle invoice payment failed
 */
async function handleInvoicePaymentFailed(db, invoice) {
  try {
    console.log(`Invoice payment failed: ${invoice.id}`);
    // Handle subscription payment failures if needed
  } catch (error) {
    console.error('Error handling invoice payment failed:', error);
  }
}

module.exports = router;



