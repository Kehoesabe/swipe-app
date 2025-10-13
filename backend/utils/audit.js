/**
 * Audit Logging Utilities
 * 
 * Utilities for logging admin actions and system events for audit trails.
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

/**
 * Log an audit event to the database
 * 
 * @param {Object} db - Database connection object
 * @param {Object} event - Audit event details
 * @param {string} event.user_id - User ID who performed the action
 * @param {string} event.action - Action performed (e.g., 'admin_refund', 'admin_grant_access')
 * @param {string} event.resource_type - Type of resource affected (e.g., 'purchase', 'premium_access')
 * @param {string} event.resource_id - ID of the resource affected
 * @param {Object} event.old_values - Previous values (optional)
 * @param {Object} event.new_values - New values (optional)
 * @param {string} event.ip_address - IP address of the user (optional)
 * @param {string} event.user_agent - User agent string (optional)
 */
const logAuditEvent = async (db, event) => {
  try {
    const {
      user_id,
      action,
      resource_type,
      resource_id,
      old_values = null,
      new_values = null,
      ip_address = null,
      user_agent = null,
    } = event;
    
    if (!user_id || !action || !resource_type || !resource_id) {
      throw new Error('Missing required audit event fields');
    }
    
    const result = await db.query(`
      INSERT INTO audit_log (
        user_id,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values,
        ip_address,
        user_agent,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING id
    `, [
      user_id,
      action,
      resource_type,
      resource_id,
      old_values ? JSON.stringify(old_values) : null,
      new_values ? JSON.stringify(new_values) : null,
      ip_address,
      user_agent,
    ]);
    
    console.log(`📝 Audit event logged: ${action} on ${resource_type}:${resource_id} by user:${user_id}`);
    
    return result.rows[0].id;
  } catch (error) {
    console.error('Error logging audit event:', error);
    // Don't throw error to avoid breaking the main operation
    // In production, you might want to use a separate audit service
  }
};

/**
 * Get audit log entries for a specific resource
 * 
 * @param {Object} db - Database connection object
 * @param {string} resource_type - Type of resource
 * @param {string} resource_id - ID of the resource
 * @param {number} limit - Maximum number of entries to return
 * @returns {Array} Array of audit log entries
 */
const getAuditLog = async (db, resource_type, resource_id, limit = 50) => {
  try {
    const result = await db.query(`
      SELECT 
        al.*,
        u.email as user_email
      FROM audit_log al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE al.resource_type = $1 AND al.resource_id = $2
      ORDER BY al.created_at DESC
      LIMIT $3
    `, [resource_type, resource_id, limit]);
    
    return result.rows;
  } catch (error) {
    console.error('Error fetching audit log:', error);
    return [];
  }
};

/**
 * Get audit log entries for a specific user
 * 
 * @param {Object} db - Database connection object
 * @param {string} user_id - User ID
 * @param {number} limit - Maximum number of entries to return
 * @returns {Array} Array of audit log entries
 */
const getUserAuditLog = async (db, user_id, limit = 50) => {
  try {
    const result = await db.query(`
      SELECT 
        al.*,
        u.email as user_email
      FROM audit_log al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE al.user_id = $1
      ORDER BY al.created_at DESC
      LIMIT $2
    `, [user_id, limit]);
    
    return result.rows;
  } catch (error) {
    console.error('Error fetching user audit log:', error);
    return [];
  }
};

/**
 * Get audit log entries for admin actions
 * 
 * @param {Object} db - Database connection object
 * @param {number} limit - Maximum number of entries to return
 * @returns {Array} Array of audit log entries
 */
const getAdminAuditLog = async (db, limit = 100) => {
  try {
    const result = await db.query(`
      SELECT 
        al.*,
        u.email as user_email
      FROM audit_log al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE al.action LIKE 'admin_%'
      ORDER BY al.created_at DESC
      LIMIT $1
    `, [limit]);
    
    return result.rows;
  } catch (error) {
    console.error('Error fetching admin audit log:', error);
    return [];
  }
};

/**
 * Clean up old audit log entries
 * 
 * @param {Object} db - Database connection object
 * @param {number} daysToKeep - Number of days to keep audit entries
 */
const cleanupAuditLog = async (db, daysToKeep = 365) => {
  try {
    const result = await db.query(`
      DELETE FROM audit_log 
      WHERE created_at < NOW() - INTERVAL '${daysToKeep} days'
    `);
    
    console.log(`🧹 Cleaned up ${result.rowCount} old audit log entries`);
    
    return result.rowCount;
  } catch (error) {
    console.error('Error cleaning up audit log:', error);
    return 0;
  }
};

/**
 * Audit event types for reference
 */
const AUDIT_EVENTS = {
  // Admin actions
  ADMIN_REFUND: 'admin_refund',
  ADMIN_GRANT_ACCESS: 'admin_grant_access',
  ADMIN_REVOKE_ACCESS: 'admin_revoke_access',
  ADMIN_LOGIN: 'admin_login',
  ADMIN_LOGOUT: 'admin_logout',
  
  // User actions
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_REGISTER: 'user_register',
  USER_UPDATE_PROFILE: 'user_update_profile',
  
  // Payment actions
  PAYMENT_CREATED: 'payment_created',
  PAYMENT_SUCCEEDED: 'payment_succeeded',
  PAYMENT_FAILED: 'payment_failed',
  PAYMENT_REFUNDED: 'payment_refunded',
  
  // Assessment actions
  ASSESSMENT_STARTED: 'assessment_started',
  ASSESSMENT_COMPLETED: 'assessment_completed',
  ASSESSMENT_ABANDONED: 'assessment_abandoned',
  
  // Premium access actions
  PREMIUM_ACCESS_GRANTED: 'premium_access_granted',
  PREMIUM_ACCESS_REVOKED: 'premium_access_revoked',
  PREMIUM_ACCESS_EXPIRED: 'premium_access_expired',
};

/**
 * Resource types for reference
 */
const RESOURCE_TYPES = {
  USER: 'user',
  PURCHASE: 'purchase',
  PREMIUM_ACCESS: 'premium_access',
  ASSESSMENT: 'assessment',
  PAYMENT: 'payment',
  SESSION: 'session',
};

module.exports = {
  logAuditEvent,
  getAuditLog,
  getUserAuditLog,
  getAdminAuditLog,
  cleanupAuditLog,
  AUDIT_EVENTS,
  RESOURCE_TYPES,
};

