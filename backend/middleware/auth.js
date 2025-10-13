/**
 * Authentication Middleware
 * 
 * Middleware for handling authentication and authorization in the admin API.
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

const jwt = require('jsonwebtoken');

/**
 * Require authentication middleware
 * Verifies JWT token and adds user to request object
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header required' });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Development mode: accept mock tokens
    if (process.env.NODE_ENV === 'development' && token === 'mock-auth-token') {
      req.user = {
        id: 'dev_user_123',
        email: 'dev@swipe-type.com',
        is_admin: false,
      };
      return next();
    }
    
    // Production mode: verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-jwt-secret');
    
    // Add user to request object
    req.user = {
      id: decoded.user_id,
      email: decoded.email,
      is_admin: decoded.is_admin || false,
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

/**
 * Require admin privileges middleware
 * Must be used after requireAuth
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (!req.user.is_admin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};

/**
 * Optional authentication middleware
 * Adds user to request if token is present, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // No token, continue without user
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      id: decoded.user_id,
      email: decoded.email,
      is_admin: decoded.is_admin || false,
    };
    
    next();
  } catch (error) {
    // Token invalid, continue without user
    next();
  }
};

/**
 * Generate JWT token for user
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      user_id: user.id,
      email: user.email,
      is_admin: user.is_admin || false,
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

/**
 * Verify admin token for development
 * This is a mock implementation for development/testing
 */
const verifyAdminToken = (token) => {
  // In development, accept a mock admin token
  if (token === 'mock-admin-token') {
    return {
      user_id: 'admin_123',
      email: 'admin@swipe-type.com',
      is_admin: true,
    };
  }
  
  // In production, verify the actual JWT
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  requireAuth,
  requireAdmin,
  optionalAuth,
  generateToken,
  verifyAdminToken,
};

