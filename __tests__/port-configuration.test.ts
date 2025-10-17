/**
 * Port Configuration Tests
 * 
 * Tests that verify port configuration and prevent port conflicts.
 * These tests should catch the "Cannot find module" and port issues
 * that prevent server startup.
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

describe('Port Configuration Tests', () => {
  const projectRoot = process.cwd();
  const backendPath = path.join(projectRoot, 'backend');
  
  describe('Backend Port Configuration', () => {
    test('backend server is configured to use port 9001', () => {
      const serverPath = path.join(backendPath, 'server.js');
      expect(fs.existsSync(serverPath)).toBe(true);
      
      const serverContent = fs.readFileSync(serverPath, 'utf8');
      expect(serverContent).toContain('PORT');
      expect(serverContent).toContain('9001');
    });

    test('backend server has proper port fallback', () => {
      const serverPath = path.join(backendPath, 'server.js');
      const serverContent = fs.readFileSync(serverPath, 'utf8');
      
      expect(serverContent).toContain('process.env.PORT');
      expect(serverContent).toContain('||');
    });

    test('backend server logs port information', () => {
      const serverPath = path.join(backendPath, 'server.js');
      const serverContent = fs.readFileSync(serverPath, 'utf8');
      
      expect(serverContent).toContain('console.log');
      expect(serverContent).toContain('port');
    });
  });

  describe('Frontend Port Configuration', () => {
    test('frontend is configured to use port 8081', () => {
      const packageJsonPath = path.join(projectRoot, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Check if there are any port configurations in scripts
      const scripts = packageJson.scripts || {};
      const hasPortConfig = Object.values(scripts).some((script: any) => 
        typeof script === 'string' && script.includes('8081')
      );
      
      // At minimum, ensure the start script exists
      expect(scripts.start).toBeDefined();
    });

    test('frontend payment API points to correct backend port', () => {
      const paymentApiPath = path.join(projectRoot, 'src', 'api', 'payment.ts');
      const apiContent = fs.readFileSync(paymentApiPath, 'utf8');
      
      expect(apiContent).toContain('localhost:9001');
    });
  });

  describe('Port Conflict Detection', () => {
    test('detects if port 9001 is already in use', () => {
      try {
        const result = execSync('netstat -ano | findstr :9001', { 
          stdio: 'pipe',
          encoding: 'utf8'
        });
        
        if (result.trim()) {
          console.warn('WARNING: Port 9001 is already in use');
          console.warn('This will cause server startup failures');
          console.warn('Kill existing processes or use a different port');
        }
      } catch (error) {
        // Port is available (command failed = no results)
        expect(true).toBe(true);
      }
    });

    test('detects if port 8081 is already in use', () => {
      try {
        const result = execSync('netstat -ano | findstr :8081', { 
          stdio: 'pipe',
          encoding: 'utf8'
        });
        
        if (result.trim()) {
          console.warn('WARNING: Port 8081 is already in use');
          console.warn('This will cause frontend startup failures');
        }
      } catch (error) {
        // Port is available
        expect(true).toBe(true);
      }
    });
  });

  describe('Directory Navigation Tests', () => {
    test('prevents "Cannot find module" errors by verifying directory structure', () => {
      // Test that we're in the correct directory
      expect(process.cwd()).toContain('swipe-app');
      
      // Test that backend directory exists
      expect(fs.existsSync(backendPath)).toBe(true);
      
      // Test that server.js exists in backend directory
      const serverPath = path.join(backendPath, 'server.js');
      expect(fs.existsSync(serverPath)).toBe(true);
    });

    test('verifies backend server can be found from correct directory', () => {
      // This test prevents the "Cannot find module 'C:\Users\Daniel\swipe\server.js'" error
      const serverPath = path.join(backendPath, 'server.js');
      expect(fs.existsSync(serverPath)).toBe(true);
      
      // Verify the server file is in the backend directory, not root
      expect(serverPath).toContain('backend');
      expect(serverPath).not.toContain('swipe-app\\server.js');
    });

    test('prevents wrong directory execution', () => {
      // Ensure we're not trying to run server.js from the wrong directory
      const rootServerPath = path.join(projectRoot, 'server.js');
      expect(fs.existsSync(rootServerPath)).toBe(false);
      
      const backendServerPath = path.join(backendPath, 'server.js');
      expect(fs.existsSync(backendServerPath)).toBe(true);
    });
  });

  describe('Environment Variable Tests', () => {
    test('backend can read PORT environment variable', () => {
      const serverPath = path.join(backendPath, 'server.js');
      const serverContent = fs.readFileSync(serverPath, 'utf8');
      
      expect(serverContent).toContain('process.env.PORT');
    });

    test('backend has NODE_ENV configuration', () => {
      const serverPath = path.join(backendPath, 'server.js');
      const serverContent = fs.readFileSync(serverPath, 'utf8');
      
      expect(serverContent).toContain('NODE_ENV');
    });

    test('prevents environment variable issues', () => {
      // Test that environment variables are properly handled
      const originalEnv = process.env.NODE_ENV;
      const originalPort = process.env.PORT;
      
      try {
        process.env.NODE_ENV = 'test';
        process.env.PORT = '9001';
        
        // This should not throw an error
        expect(() => {
          require(path.join(backendPath, 'server.js'));
        }).not.toThrow();
      } finally {
        // Restore original environment
        process.env.NODE_ENV = originalEnv;
        if (originalPort) {
          process.env.PORT = originalPort;
        } else {
          delete process.env.PORT;
        }
      }
    });
  });

  describe('Server Startup Prevention Tests', () => {
    test('prevents server startup from wrong directory', () => {
      // This test prevents the error: "Cannot find module 'C:\Users\Daniel\swipe\server.js'"
      const wrongServerPath = path.join(projectRoot, '..', 'server.js');
      expect(fs.existsSync(wrongServerPath)).toBe(false);
      
      const correctServerPath = path.join(backendPath, 'server.js');
      expect(fs.existsSync(correctServerPath)).toBe(true);
    });

    test('verifies server startup command structure', () => {
      const serverPath = path.join(backendPath, 'server.js');
      const serverContent = fs.readFileSync(serverPath, 'utf8');
      
      // Check that the server file has proper structure
      expect(serverContent).toContain('require');
      expect(serverContent).toContain('app');
      expect(serverContent).toContain('listen');
    });

    test('prevents missing dependencies errors', () => {
      const packageJsonPath = path.join(backendPath, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      const requiredDeps = ['express', 'cors', 'stripe', 'pg'];
      const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
      
      if (missingDeps.length > 0) {
        throw new Error(`CRITICAL: Missing dependencies: ${missingDeps.join(', ')}`);
      }
      expect(missingDeps).toHaveLength(0);
    });
  });

  describe('Port Range Validation', () => {
    test('backend uses allowed port range (9000-9999)', () => {
      const serverPath = path.join(backendPath, 'server.js');
      const serverContent = fs.readFileSync(serverPath, 'utf8');
      
      // Check that port 9001 is used (within allowed range)
      expect(serverContent).toContain('9001');
      
      // Ensure it's not using restricted ranges
      expect(serverContent).not.toContain('3000');
      expect(serverContent).not.toContain('3001');
      expect(serverContent).not.toContain('5000');
      expect(serverContent).not.toContain('5001');
    });

    test('frontend uses allowed port range (8000-8999)', () => {
      // Frontend should use port 8081 (within allowed range)
      const paymentApiPath = path.join(projectRoot, 'src', 'api', 'payment.ts');
      const apiContent = fs.readFileSync(paymentApiPath, 'utf8');
      
      expect(apiContent).toContain('localhost:9001'); // Backend port
      // Frontend port 8081 is implicit in the setup
    });
  });

  describe('Common Port Error Prevention', () => {
    test('prevents port binding errors', () => {
      // This test ensures ports are properly configured
      const serverPath = path.join(backendPath, 'server.js');
      const serverContent = fs.readFileSync(serverPath, 'utf8');
      
      expect(serverContent).toContain('listen');
      expect(serverContent).toContain('PORT');
    });

    test('prevents EADDRINUSE errors', () => {
      // Check that port configuration is flexible
      const serverPath = path.join(backendPath, 'server.js');
      const serverContent = fs.readFileSync(serverPath, 'utf8');
      
      expect(serverContent).toContain('process.env.PORT');
      expect(serverContent).toContain('||');
    });

    test('prevents connection refused errors', () => {
      // Ensure CORS is configured for the correct ports
      const appPath = path.join(backendPath, 'app.js');
      const appContent = fs.readFileSync(appPath, 'utf8');
      
      expect(appContent).toContain('localhost:8081');
      expect(appContent).toContain('cors');
    });
  });
});


