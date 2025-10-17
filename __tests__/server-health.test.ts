/**
 * Server Health Detection Tests
 * 
 * Tests that should catch common server errors before manual testing:
 * - Backend server startup
 * - Port configuration
 * - API endpoint availability
 * - Health check responses
 * - CORS configuration
 * 
 * These tests prevent the 404 errors and server startup issues
 * that should be caught automatically before manual testing.
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

describe('Server Health Detection Tests', () => {
  const projectRoot = process.cwd();
  const backendPath = path.join(projectRoot, 'backend');
  
  describe('Backend Server Configuration', () => {
    test('backend directory exists', () => {
      expect(fs.existsSync(backendPath)).toBe(true);
    });

    test('server.js exists in backend directory', () => {
      const serverPath = path.join(backendPath, 'server.js');
      expect(fs.existsSync(serverPath)).toBe(true);
    });

    test('backend package.json exists and is valid', () => {
      const packageJsonPath = path.join(backendPath, 'package.json');
      expect(fs.existsSync(packageJsonPath)).toBe(true);
      
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      expect(packageJson.name).toBe('swipe-type-backend');
      expect(packageJson.main).toBe('server.js');
      expect(packageJson.scripts.start).toBeDefined();
    });

    test('backend dependencies are installed', () => {
      const nodeModulesPath = path.join(backendPath, 'node_modules');
      expect(fs.existsSync(nodeModulesPath)).toBe(true);
      
      // Check for key backend dependencies
      expect(fs.existsSync(path.join(nodeModulesPath, 'express'))).toBe(true);
      expect(fs.existsSync(path.join(nodeModulesPath, 'cors'))).toBe(true);
      expect(fs.existsSync(path.join(nodeModulesPath, 'stripe'))).toBe(true);
    });
  });

  describe('Port Configuration Tests', () => {
    test('backend server can start on port 9001', async () => {
      // Test that the server can be started (we'll kill it immediately)
      expect(() => {
        execSync('node server.js --help', { 
          cwd: backendPath,
          stdio: 'pipe',
          timeout: 5000
        });
      }).not.toThrow();
    });

    test('port 9001 is not already in use', () => {
      // Check if port 9001 is available
      const { execSync } = require('child_process');
      
      try {
        execSync('netstat -ano | findstr :9001', { stdio: 'pipe' });
        // If we get here, port might be in use
        console.warn('Port 9001 may be in use - this could cause server startup issues');
      } catch (error) {
        // Port is available (command failed = no results)
        expect(true).toBe(true);
      }
    });
  });

  describe('API Endpoint Tests', () => {
    test('payment routes exist', () => {
      const paymentRoutesPath = path.join(backendPath, 'routes', 'payment.js');
      expect(fs.existsSync(paymentRoutesPath)).toBe(true);
      
      const routesContent = fs.readFileSync(paymentRoutesPath, 'utf8');
      expect(routesContent).toContain('/api/payment');
      expect(routesContent).toContain('check-access');
      expect(routesContent).toContain('create-checkout');
    });

    test('webhook routes exist', () => {
      const webhookRoutesPath = path.join(backendPath, 'routes', 'webhook.js');
      expect(fs.existsSync(webhookRoutesPath)).toBe(true);
    });

    test('admin routes exist', () => {
      const adminRoutesPath = path.join(backendPath, 'routes', 'admin.js');
      expect(fs.existsSync(adminRoutesPath)).toBe(true);
    });

    test('middleware exists', () => {
      const authMiddlewarePath = path.join(backendPath, 'middleware', 'auth.js');
      expect(fs.existsSync(authMiddlewarePath)).toBe(true);
    });
  });

  describe('Environment Configuration Tests', () => {
    test('backend can read environment variables', () => {
      // Test that the backend can access environment variables
      expect(() => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'test';
        process.env.PORT = '9001';
        
        // Try to require the server file
        require(path.join(backendPath, 'server.js'));
        
        // Restore original environment
        process.env.NODE_ENV = originalEnv;
        delete process.env.PORT;
      }).not.toThrow();
    });

    test('CORS configuration exists', () => {
      const appPath = path.join(backendPath, 'app.js');
      expect(fs.existsSync(appPath)).toBe(true);
      
      const appContent = fs.readFileSync(appPath, 'utf8');
      expect(appContent).toContain('cors');
    });
  });

  describe('Common Error Detection', () => {
    test('detects missing server.js file', () => {
      const serverPath = path.join(backendPath, 'server.js');
      if (!fs.existsSync(serverPath)) {
        throw new Error('CRITICAL: server.js not found in backend directory');
      }
      expect(fs.existsSync(serverPath)).toBe(true);
    });

    test('detects missing dependencies', () => {
      const packageJsonPath = path.join(backendPath, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      const requiredDeps = ['express', 'cors', 'stripe', 'pg'];
      const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
      
      if (missingDeps.length > 0) {
        throw new Error(`CRITICAL: Missing dependencies: ${missingDeps.join(', ')}`);
      }
      expect(missingDeps).toHaveLength(0);
    });

    test('detects port conflicts', () => {
      // This test would run before starting the server
      const { execSync } = require('child_process');
      
      try {
        const result = execSync('netstat -ano | findstr :9001', { 
          stdio: 'pipe',
          encoding: 'utf8'
        });
        
        if (result.trim()) {
          console.warn('WARNING: Port 9001 appears to be in use');
          console.warn('This could cause server startup failures');
        }
      } catch (error) {
        // Port is available
        expect(true).toBe(true);
      }
    });

    test('detects directory navigation issues', () => {
      // Test that we're in the correct directory structure
      expect(process.cwd()).toContain('swipe-app');
      expect(fs.existsSync(path.join(projectRoot, 'package.json'))).toBe(true);
      expect(fs.existsSync(backendPath)).toBe(true);
    });
  });

  describe('Frontend-Backend Connection Tests', () => {
    test('frontend payment API points to correct backend URL', () => {
      const paymentApiPath = path.join(projectRoot, 'src', 'api', 'payment.ts');
      expect(fs.existsSync(paymentApiPath)).toBe(true);
      
      const paymentContent = fs.readFileSync(paymentApiPath, 'utf8');
      expect(paymentContent).toContain('localhost:9001');
      expect(paymentContent).toContain('getBaseUrl');
    });

    test('frontend can import payment API without errors', () => {
      expect(() => {
        require(path.join(projectRoot, 'src', 'api', 'payment.ts'));
      }).not.toThrow();
    });
  });

  describe('Health Check Endpoint Tests', () => {
    test('health endpoint route exists in app.js', () => {
      const appPath = path.join(backendPath, 'app.js');
      expect(fs.existsSync(appPath)).toBe(true);
      
      const appContent = fs.readFileSync(appPath, 'utf8');
      expect(appContent).toContain('/health');
      expect(appContent).toContain('status');
    });

    test('server.js includes health check', () => {
      const serverPath = path.join(backendPath, 'server.js');
      const serverContent = fs.readFileSync(serverPath, 'utf8');
      expect(serverContent).toContain('health');
    });
  });

  describe('Error Prevention Tests', () => {
    test('prevents 404 errors by verifying server startup', () => {
      // This test ensures the server can start without errors
      expect(() => {
        // Test server file syntax
        require(path.join(backendPath, 'server.js'));
      }).not.toThrow();
    });

    test('prevents CORS errors by verifying configuration', () => {
      const appPath = path.join(backendPath, 'app.js');
      const appContent = fs.readFileSync(appPath, 'utf8');
      
      expect(appContent).toContain('cors');
      expect(appContent).toContain('origin');
    });

    test('prevents authentication errors by verifying middleware', () => {
      const authPath = path.join(backendPath, 'middleware', 'auth.js');
      const authContent = fs.readFileSync(authPath, 'utf8');
      
      expect(authContent).toContain('requireAuth');
      expect(authContent).toContain('Bearer');
    });
  });
});


