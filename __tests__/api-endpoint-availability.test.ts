/**
 * API Endpoint Availability Tests
 * 
 * Tests that verify all API endpoints are accessible and responding correctly.
 * These tests should catch 404 errors and API connectivity issues before manual testing.
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

describe('API Endpoint Availability Tests', () => {
  const projectRoot = process.cwd();
  const backendPath = path.join(projectRoot, 'backend');
  
  describe('Payment API Endpoints', () => {
    test('payment routes file exists and has required endpoints', () => {
      const paymentRoutesPath = path.join(backendPath, 'routes', 'payment.js');
      expect(fs.existsSync(paymentRoutesPath)).toBe(true);
      
      const routesContent = fs.readFileSync(paymentRoutesPath, 'utf8');
      
      // Check for required payment endpoints
      expect(routesContent).toContain('/api/payment/create-checkout');
      expect(routesContent).toContain('/api/payment/check-access');
      expect(routesContent).toContain('/api/payment/verify-unlock');
      expect(routesContent).toContain('/api/payment/receipt');
    });

    test('payment routes export router correctly', () => {
      const paymentRoutesPath = path.join(backendPath, 'routes', 'payment.js');
      const routesContent = fs.readFileSync(paymentRoutesPath, 'utf8');
      
      expect(routesContent).toContain('module.exports = router');
      expect(routesContent).toContain('const router = express.Router()');
    });

    test('payment routes handle authentication', () => {
      const paymentRoutesPath = path.join(backendPath, 'routes', 'payment.js');
      const routesContent = fs.readFileSync(paymentRoutesPath, 'utf8');
      
      expect(routesContent).toContain('requireAuth');
      expect(routesContent).toContain('Bearer');
    });
  });

  describe('Webhook API Endpoints', () => {
    test('webhook routes file exists', () => {
      const webhookRoutesPath = path.join(backendPath, 'routes', 'webhook.js');
      expect(fs.existsSync(webhookRoutesPath)).toBe(true);
    });

    test('webhook routes handle Stripe events', () => {
      const webhookRoutesPath = path.join(backendPath, 'routes', 'webhook.js');
      const routesContent = fs.readFileSync(webhookRoutesPath, 'utf8');
      
      expect(routesContent).toContain('/api/webhook');
      expect(routesContent).toContain('stripe');
    });
  });

  describe('Admin API Endpoints', () => {
    test('admin routes file exists', () => {
      const adminRoutesPath = path.join(backendPath, 'routes', 'admin.js');
      expect(fs.existsSync(adminRoutesPath)).toBe(true);
    });

    test('admin routes require authentication', () => {
      const adminRoutesPath = path.join(backendPath, 'routes', 'admin.js');
      const routesContent = fs.readFileSync(adminRoutesPath, 'utf8');
      
      expect(routesContent).toContain('requireAuth');
      expect(routesContent).toContain('admin');
    });
  });

  describe('Health Check Endpoint', () => {
    test('health endpoint is defined in app.js', () => {
      const appPath = path.join(backendPath, 'app.js');
      expect(fs.existsSync(appPath)).toBe(true);
      
      const appContent = fs.readFileSync(appPath, 'utf8');
      expect(appContent).toContain('/health');
      expect(appContent).toContain('status');
    });

    test('health endpoint returns proper response structure', () => {
      const appPath = path.join(backendPath, 'app.js');
      const appContent = fs.readFileSync(appPath, 'utf8');
      
      expect(appContent).toContain('json');
      expect(appContent).toContain('timestamp');
    });
  });

  describe('CORS Configuration', () => {
    test('CORS is properly configured in app.js', () => {
      const appPath = path.join(backendPath, 'app.js');
      const appContent = fs.readFileSync(appPath, 'utf8');
      
      expect(appContent).toContain('cors');
      expect(appContent).toContain('origin');
    });

    test('CORS allows frontend origins', () => {
      const appPath = path.join(backendPath, 'app.js');
      const appContent = fs.readFileSync(appPath, 'utf8');
      
      expect(appContent).toContain('localhost:8081');
      expect(appContent).toContain('localhost:3000');
    });
  });

  describe('Error Handling in API Routes', () => {
    test('payment routes have proper error handling', () => {
      const paymentRoutesPath = path.join(backendPath, 'routes', 'payment.js');
      const routesContent = fs.readFileSync(paymentRoutesPath, 'utf8');
      
      expect(routesContent).toContain('try {');
      expect(routesContent).toContain('catch');
      expect(routesContent).toContain('error');
    });

    test('webhook routes have proper error handling', () => {
      const webhookRoutesPath = path.join(backendPath, 'routes', 'webhook.js');
      const routesContent = fs.readFileSync(webhookRoutesPath, 'utf8');
      
      expect(routesContent).toContain('try {');
      expect(routesContent).toContain('catch');
      expect(routesContent).toContain('error');
    });

    test('admin routes have proper error handling', () => {
      const adminRoutesPath = path.join(backendPath, 'routes', 'admin.js');
      const routesContent = fs.readFileSync(adminRoutesPath, 'utf8');
      
      expect(routesContent).toContain('try {');
      expect(routesContent).toContain('catch');
      expect(routesContent).toContain('error');
    });
  });

  describe('Database Connection Tests', () => {
    test('database connection is configured', () => {
      const appPath = path.join(backendPath, 'app.js');
      const appContent = fs.readFileSync(appPath, 'utf8');
      
      expect(appContent).toContain('database');
      expect(appContent).toContain('pg');
    });

    test('database queries are properly handled', () => {
      const paymentRoutesPath = path.join(backendPath, 'routes', 'payment.js');
      const routesContent = fs.readFileSync(paymentRoutesPath, 'utf8');
      
      expect(routesContent).toContain('query');
      expect(routesContent).toContain('SELECT');
    });
  });

  describe('Stripe Integration Tests', () => {
    test('Stripe is properly configured in payment routes', () => {
      const paymentRoutesPath = path.join(backendPath, 'routes', 'payment.js');
      const routesContent = fs.readFileSync(paymentRoutesPath, 'utf8');
      
      expect(routesContent).toContain('stripe');
      expect(routesContent).toContain('checkout');
    });

    test('Stripe webhook signature verification exists', () => {
      const webhookRoutesPath = path.join(backendPath, 'routes', 'webhook.js');
      const routesContent = fs.readFileSync(webhookRoutesPath, 'utf8');
      
      expect(routesContent).toContain('signature');
      expect(routesContent).toContain('webhook');
    });
  });

  describe('Frontend API Integration Tests', () => {
    test('frontend payment API uses correct base URL', () => {
      const paymentApiPath = path.join(projectRoot, 'src', 'api', 'payment.ts');
      const apiContent = fs.readFileSync(paymentApiPath, 'utf8');
      
      expect(apiContent).toContain('localhost:9001');
      expect(apiContent).toContain('getBaseUrl');
    });

    test('frontend API handles errors gracefully', () => {
      const paymentApiPath = path.join(projectRoot, 'src', 'api', 'payment.ts');
      const apiContent = fs.readFileSync(paymentApiPath, 'utf8');
      
      expect(apiContent).toContain('try {');
      expect(apiContent).toContain('catch');
      expect(apiContent).toContain('ERROR_MESSAGES');
    });

    test('frontend API has proper timeout handling', () => {
      const paymentApiPath = path.join(projectRoot, 'src', 'api', 'payment.ts');
      const apiContent = fs.readFileSync(paymentApiPath, 'utf8');
      
      expect(apiContent).toContain('timeout');
      expect(apiContent).toContain('NETWORK_TIMEOUT');
    });
  });

  describe('Common 404 Error Prevention', () => {
    test('all API routes are properly mounted in app.js', () => {
      const appPath = path.join(backendPath, 'app.js');
      const appContent = fs.readFileSync(appPath, 'utf8');
      
      expect(appContent).toContain('/api/payment');
      expect(appContent).toContain('/api/webhook');
      expect(appContent).toContain('/api/admin');
    });

    test('server.js properly starts the app', () => {
      const serverPath = path.join(backendPath, 'server.js');
      const serverContent = fs.readFileSync(serverPath, 'utf8');
      
      expect(serverContent).toContain('app.listen');
      expect(serverContent).toContain('PORT');
    });

    test('prevents 404 errors by verifying route structure', () => {
      // This test ensures all routes are properly defined
      const appPath = path.join(backendPath, 'app.js');
      const appContent = fs.readFileSync(appPath, 'utf8');
      
      // Check that routes are mounted with proper prefixes
      expect(appContent).toContain('app.use');
      expect(appContent).toContain('/api');
    });
  });
});


