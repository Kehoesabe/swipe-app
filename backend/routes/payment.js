/**
 * Payment API Routes
 * 
 * Backend routes for payment processing including checkout sessions,
 * payment verification, and premium access management.
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

const express = require('express');
const { requireAuth } = require('../middleware/auth');
const Stripe = require('stripe');

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /api/payment/create-checkout
 * Create a Stripe checkout session
 */
router.post('/create-checkout', requireAuth, async (req, res) => {
  try {
    const { assessmentId, typeNumber, typeName } = req.body;
    
    if (!assessmentId || !typeNumber || !typeName) {
      return res.status(400).json({ 
        error: 'Assessment ID, type number, and type name are required' 
      });
    }
    
    // Check if user already has premium access
    const existingAccess = await req.db.query(`
      SELECT id FROM premium_access 
      WHERE user_id = $1 AND assessment_id = $2 AND revoked_at IS NULL
    `, [req.user.id, assessmentId]);
    
    if (existingAccess.rows.length > 0) {
      return res.status(400).json({ 
        error: 'ALREADY_PURCHASED',
        message: 'You already have premium access for this assessment' 
      });
    }
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Swipe Type Premium - ${typeName}`,
            description: `Premium insights for ${typeName} personality type`,
          },
          unit_amount: 1200, // $12.00 in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.APP_BASE_URL}/results?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_BASE_URL}/results?cancelled=true`,
      customer_email: req.user.email,
      metadata: {
        user_id: req.user.id,
        assessment_id: assessmentId,
        type_number: typeNumber.toString(),
        type_name: typeName,
      },
    });
    
    // Store pending purchase
    await req.db.query(`
      INSERT INTO purchases (
        user_id,
        assessment_id,
        stripe_payment_intent_id,
        amount,
        currency,
        status,
        metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      req.user.id,
      assessmentId,
      session.payment_intent,
      1200,
      'usd',
      'pending',
      JSON.stringify({ type_number: typeNumber, type_name: typeName }),
    ]);
    
    res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

/**
 * POST /api/payment/verify-unlock
 * Verify payment and unlock premium content
 */
router.post('/verify-unlock', requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ 
        error: 'Payment not completed',
        payment_status: session.payment_status 
      });
    }
    
    // Get purchase record
    const purchaseResult = await req.db.query(`
      SELECT * FROM purchases 
      WHERE stripe_payment_intent_id = $1 AND user_id = $2
    `, [session.payment_intent, req.user.id]);
    
    if (purchaseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    
    const purchase = purchaseResult.rows[0];
    
    // Update purchase status
    await req.db.query(`
      UPDATE purchases 
      SET status = 'succeeded', paid_at = NOW()
      WHERE id = $1
    `, [purchase.id]);
    
    // Grant premium access
    await req.db.query(`
      INSERT INTO premium_access (
        user_id,
        assessment_id,
        purchase_id,
        granted_at,
        reason
      ) VALUES ($1, $2, $3, NOW(), 'purchase')
    `, [req.user.id, purchase.assessment_id, purchase.id]);
    
    res.json({ 
      success: true,
      hasAccess: true,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

/**
 * GET /api/payment/check-access
 * Check if user has premium access for an assessment
 */
router.get('/check-access', requireAuth, async (req, res) => {
  try {
    const { assessmentId } = req.query;
    
    if (!assessmentId) {
      return res.status(400).json({ error: 'Assessment ID is required' });
    }
    
    const result = await req.db.query(`
      SELECT 
        pa.*,
        p.status as purchase_status,
        p.amount,
        p.currency
      FROM premium_access pa
      LEFT JOIN purchases p ON pa.purchase_id = p.id
      WHERE pa.user_id = $1 AND pa.assessment_id = $2 AND pa.revoked_at IS NULL
    `, [req.user.id, assessmentId]);
    
    const hasAccess = result.rows.length > 0;
    
    res.json({
      hasAccess,
      access: hasAccess ? result.rows[0] : null,
    });
  } catch (error) {
    console.error('Error checking access:', error);
    res.status(500).json({ error: 'Failed to check premium access' });
  }
});

/**
 * GET /api/payment/receipt
 * Get receipt information for a purchase
 */
router.get('/receipt', requireAuth, async (req, res) => {
  try {
    const { purchaseId } = req.query;
    
    if (!purchaseId) {
      return res.status(400).json({ error: 'Purchase ID is required' });
    }
    
    const result = await req.db.query(`
      SELECT 
        p.*,
        u.email as customer_email,
        a.swipe_type_name
      FROM purchases p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN assessment_sessions a ON p.assessment_id = a.id
      WHERE p.id = $1 AND p.user_id = $2
    `, [purchaseId, req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    
    const purchase = result.rows[0];
    
    res.json({
      id: purchase.id,
      amount: purchase.amount,
      currency: purchase.currency,
      status: purchase.status,
      created_at: purchase.created_at,
      paid_at: purchase.paid_at,
      customer_email: purchase.customer_email,
      swipe_type: purchase.swipe_type_name,
      receipt_url: purchase.receipt_url,
    });
  } catch (error) {
    console.error('Error fetching receipt:', error);
    res.status(500).json({ error: 'Failed to fetch receipt' });
  }
});

module.exports = router;



