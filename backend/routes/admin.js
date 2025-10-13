/**
 * Admin API Routes
 * 
 * Backend routes for admin dashboard functionality including purchases,
 * refunds, and premium access management.
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { logAuditEvent } = require('../utils/audit');
const Stripe = require('stripe');

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * GET /api/admin/purchases
 * List purchases with filtering and pagination
 */
router.get('/purchases', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT 
        p.*,
        u.email as customer_email,
        u.name as customer_name,
        a.swipe_type,
        a.swipe_type_name,
        pa.granted_at as premium_granted_at,
        pa.expires_at as premium_expires_at
      FROM purchases p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN assessment_sessions a ON p.assessment_id = a.id
      LEFT JOIN premium_access pa ON p.assessment_id = pa.assessment_id AND p.user_id = pa.user_id
    `;
    
    const params = [];
    let paramCount = 0;
    
    if (status && status !== 'all') {
      query += ` WHERE p.status = $${++paramCount}`;
      params.push(status);
    }
    
    query += ` ORDER BY p.created_at DESC LIMIT $${++paramCount} OFFSET $${++paramCount}`;
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await req.db.query(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM purchases p';
    const countParams = [];
    let countParamCount = 0;
    
    if (status && status !== 'all') {
      countQuery += ` WHERE p.status = $${++countParamCount}`;
      countParams.push(status);
    }
    
    const countResult = await req.db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);
    
    res.json({
      purchases: result.rows,
      total,
      has_more: (parseInt(offset) + parseInt(limit)) < total,
      next_cursor: (parseInt(offset) + parseInt(limit)) < total ? 
        (parseInt(offset) + parseInt(limit)).toString() : null,
    });
  } catch (error) {
    console.error('Error fetching admin purchases:', error);
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
});

/**
 * GET /api/admin/purchase/:id
 * Get detailed information about a specific purchase
 */
router.get('/purchase/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await req.db.query(`
      SELECT 
        p.*,
        u.email as customer_email,
        u.name as customer_name,
        u.created_at as user_created_at,
        a.swipe_type,
        a.swipe_type_name,
        a.completed_at as assessment_completed_at,
        pa.id as premium_access_id,
        pa.granted_at as premium_granted_at,
        pa.expires_at as premium_expires_at,
        pa.reason as premium_reason
      FROM purchases p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN assessment_sessions a ON p.assessment_id = a.id
      LEFT JOIN premium_access pa ON p.assessment_id = pa.assessment_id AND p.user_id = pa.user_id
      WHERE p.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    
    const purchase = result.rows[0];
    
    // Format the response with nested objects
    const response = {
      ...purchase,
      user_info: {
        email: purchase.customer_email,
        name: purchase.customer_name,
        created_at: purchase.user_created_at,
      },
      assessment_info: {
        swipe_type: purchase.swipe_type,
        swipe_type_name: purchase.swipe_type_name,
        completed_at: purchase.assessment_completed_at,
      },
      premium_access: purchase.premium_access_id ? {
        id: purchase.premium_access_id,
        granted_at: purchase.premium_granted_at,
        expires_at: purchase.premium_expires_at,
        reason: purchase.premium_reason,
      } : null,
    };
    
    // Remove the individual fields that are now nested
    delete response.customer_email;
    delete response.customer_name;
    delete response.user_created_at;
    delete response.swipe_type;
    delete response.swipe_type_name;
    delete response.assessment_completed_at;
    delete response.premium_access_id;
    delete response.premium_granted_at;
    delete response.premium_expires_at;
    delete response.premium_reason;
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching purchase detail:', error);
    res.status(500).json({ error: 'Failed to fetch purchase detail' });
  }
});

/**
 * POST /api/admin/refund
 * Issue a refund for a purchase
 */
router.post('/refund', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { purchaseId, reason } = req.body;
    
    if (!purchaseId || !reason) {
      return res.status(400).json({ error: 'Purchase ID and reason are required' });
    }
    
    // Get purchase details
    const purchaseResult = await req.db.query(`
      SELECT * FROM purchases WHERE id = $1
    `, [purchaseId]);
    
    if (purchaseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    
    const purchase = purchaseResult.rows[0];
    
    if (purchase.status !== 'succeeded') {
      return res.status(400).json({ 
        error: 'Can only refund successful purchases' 
      });
    }
    
    if (purchase.refunded_at) {
      return res.status(400).json({ 
        error: 'Purchase has already been refunded' 
      });
    }
    
    // Issue refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: purchase.stripe_payment_intent_id,
      reason: 'requested_by_customer',
      metadata: {
        admin_refund: 'true',
        admin_id: req.user.id,
        reason: reason,
      },
    });
    
    // Update purchase status
    await req.db.query(`
      UPDATE purchases
      SET status = 'refunded', refunded_at = NOW()
      WHERE id = $1
    `, [purchaseId]);
    
    // Revoke premium access if it exists
    await req.db.query(`
      UPDATE premium_access
      SET revoked_at = NOW(), revoked_by = 'admin'
      WHERE assessment_id = $1 AND user_id = $2 AND revoked_at IS NULL
    `, [purchase.assessment_id, purchase.user_id]);
    
    // Log audit event
    await logAuditEvent(req.db, {
      user_id: req.user.id,
      action: 'admin_refund',
      resource_type: 'purchase',
      resource_id: purchaseId,
      new_values: {
        refund_id: refund.id,
        reason: reason,
        amount: purchase.amount,
        currency: purchase.currency,
      },
    });
    
    res.json({ 
      success: true, 
      refund_id: refund.id,
      amount: refund.amount,
      status: refund.status,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error issuing refund:', error);
    res.status(500).json({ error: 'Failed to issue refund' });
  }
});

/**
 * POST /api/admin/grant-access
 * Manually grant premium access to a user
 */
router.post('/grant-access', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { userId, assessmentId, reason, expiresAt } = req.body;
    
    if (!userId || !assessmentId || !reason) {
      return res.status(400).json({ 
        error: 'User ID, Assessment ID, and reason are required' 
      });
    }
    
    // Check if access already exists
    const existingResult = await req.db.query(`
      SELECT id FROM premium_access 
      WHERE user_id = $1 AND assessment_id = $2 AND revoked_at IS NULL
    `, [userId, assessmentId]);
    
    if (existingResult.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Premium access already granted for this user and assessment' 
      });
    }
    
    // Grant access
    const result = await req.db.query(`
      INSERT INTO premium_access (
        user_id, 
        assessment_id, 
        granted_by, 
        expires_at, 
        reason,
        notes
      )
      VALUES ($1, $2, 'admin', $3, $4, $5)
      RETURNING id, granted_at
    `, [
      userId, 
      assessmentId, 
      expiresAt || null, 
      'manual_grant',
      `Admin grant: ${reason}`
    ]);
    
    // Log audit event
    await logAuditEvent(req.db, {
      user_id: req.user.id,
      action: 'admin_grant_access',
      resource_type: 'premium_access',
      resource_id: result.rows[0].id,
      new_values: {
        target_user_id: userId,
        assessment_id: assessmentId,
        reason: reason,
        expires_at: expiresAt,
      },
    });
    
    res.json({ 
      success: true, 
      access_id: result.rows[0].id,
      granted_at: result.rows[0].granted_at,
      expires_at: expiresAt,
      reason: 'manual_grant',
    });
  } catch (error) {
    console.error('Error granting premium access:', error);
    res.status(500).json({ error: 'Failed to grant premium access' });
  }
});

/**
 * POST /api/admin/revoke-access
 * Revoke premium access for a user
 */
router.post('/revoke-access', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { userId, assessmentId, reason } = req.body;
    
    if (!userId || !assessmentId || !reason) {
      return res.status(400).json({ 
        error: 'User ID, Assessment ID, and reason are required' 
      });
    }
    
    // Check if access exists
    const existingResult = await req.db.query(`
      SELECT id FROM premium_access 
      WHERE user_id = $1 AND assessment_id = $2 AND revoked_at IS NULL
    `, [userId, assessmentId]);
    
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ 
        error: 'No active premium access found for this user and assessment' 
      });
    }
    
    // Revoke access
    await req.db.query(`
      UPDATE premium_access
      SET revoked_at = NOW(), revoked_by = 'admin', notes = $3
      WHERE user_id = $1 AND assessment_id = $2 AND revoked_at IS NULL
    `, [userId, assessmentId, `Admin revocation: ${reason}`]);
    
    // Log audit event
    await logAuditEvent(req.db, {
      user_id: req.user.id,
      action: 'admin_revoke_access',
      resource_type: 'premium_access',
      resource_id: existingResult.rows[0].id,
      new_values: {
        target_user_id: userId,
        assessment_id: assessmentId,
        reason: reason,
        revoked_at: new Date().toISOString(),
      },
    });
    
    res.json({ 
      success: true, 
      message: 'Premium access revoked successfully',
    });
  } catch (error) {
    console.error('Error revoking premium access:', error);
    res.status(500).json({ error: 'Failed to revoke premium access' });
  }
});

/**
 * GET /api/admin/stats
 * Get admin dashboard statistics
 */
router.get('/stats', requireAuth, requireAdmin, async (req, res) => {
  try {
    // Get purchase statistics
    const statsResult = await req.db.query(`
      SELECT 
        COUNT(*) as total_purchases,
        COUNT(CASE WHEN status = 'succeeded' THEN 1 END) as successful_purchases,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_purchases,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_purchases,
        COUNT(CASE WHEN status = 'refunded' THEN 1 END) as refunded_purchases,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as recent_purchases,
        COALESCE(SUM(CASE WHEN status = 'succeeded' THEN amount ELSE 0 END), 0) as total_revenue
      FROM purchases
    `);
    
    const stats = statsResult.rows[0];
    
    // Calculate conversion rate
    const conversionRate = stats.total_purchases > 0 ? 
      stats.successful_purchases / stats.total_purchases : 0;
    
    res.json({
      total_purchases: parseInt(stats.total_purchases),
      total_revenue: parseInt(stats.total_revenue) / 100, // Convert from cents
      successful_purchases: parseInt(stats.successful_purchases),
      failed_purchases: parseInt(stats.failed_purchases),
      pending_purchases: parseInt(stats.pending_purchases),
      refunded_purchases: parseInt(stats.refunded_purchases),
      recent_purchases: parseInt(stats.recent_purchases),
      conversion_rate: conversionRate,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin statistics' });
  }
});

/**
 * GET /api/admin/search
 * Search purchases by email, user ID, or payment intent ID
 */
router.get('/search', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }
    
    const searchTerm = `%${query.trim()}%`;
    
    const result = await req.db.query(`
      SELECT 
        p.*,
        u.email as customer_email,
        u.name as customer_name
      FROM purchases p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE 
        u.email ILIKE $1 OR 
        p.user_id::text ILIKE $1 OR 
        p.stripe_payment_intent_id ILIKE $1
      ORDER BY p.created_at DESC
      LIMIT 50
    `, [searchTerm]);
    
    res.json({
      purchases: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Error searching purchases:', error);
    res.status(500).json({ error: 'Failed to search purchases' });
  }
});

/**
 * POST /api/admin/export
 * Export purchase data for reporting
 */
router.post('/export', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { start_date, end_date, format = 'csv', status } = req.body;
    
    if (!start_date || !end_date) {
      return res.status(400).json({ 
        error: 'Start date and end date are required' 
      });
    }
    
    let query = `
      SELECT 
        p.*,
        u.email as customer_email,
        u.name as customer_name,
        a.swipe_type_name
      FROM purchases p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN assessment_sessions a ON p.assessment_id = a.id
      WHERE p.created_at >= $1 AND p.created_at <= $2
    `;
    
    const params = [start_date, end_date];
    let paramCount = 2;
    
    if (status && status !== 'all') {
      query += ` AND p.status = $${++paramCount}`;
      params.push(status);
    }
    
    query += ` ORDER BY p.created_at DESC`;
    
    const result = await req.db.query(query, params);
    
    // Generate export data
    const exportData = result.rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      customer_email: row.customer_email,
      customer_name: row.customer_name,
      amount: (row.amount / 100).toFixed(2),
      currency: row.currency,
      status: row.status,
      swipe_type: row.swipe_type_name,
      created_at: row.created_at,
      paid_at: row.paid_at,
      refunded_at: row.refunded_at,
    }));
    
    // For now, return the data directly
    // In production, you'd generate a file and return a download URL
    res.json({
      data: exportData,
      total: exportData.length,
      format: format,
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error exporting purchases:', error);
    res.status(500).json({ error: 'Failed to export purchase data' });
  }
});

module.exports = router;

