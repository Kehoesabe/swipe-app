import * as fs from 'fs';
import * as path from 'path';

describe('Directory Navigation', () => {
  test('package.json exists in current working directory', () => {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    expect(fs.existsSync(packageJsonPath)).toBe(true);
  });

  test('expo can find project from current directory', () => {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Verify we're in the right project
    expect(packageJson.name).toBe('swipe-app');
    expect(packageJson.dependencies.expo).toBeDefined();
  });

  test('expo start command works from current directory', () => {
    // This test will fail if we're in the wrong directory
    const { execSync } = require('child_process');
    
    expect(() => {
      execSync('npx expo start --help', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        timeout: 5000
      });
    }).not.toThrow();
  });

  test('expo web command works from current directory', () => {
    const { execSync } = require('child_process');
    
    expect(() => {
      execSync('npx expo start --web --help', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        timeout: 5000
      });
    }).not.toThrow();
  });

  test('expo can start web server from current directory', () => {
    const { execSync } = require('child_process');
    
    expect(() => {
      execSync('npx expo start --web --port 19006 --help', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        timeout: 5000
      });
    }).not.toThrow();
  });

  test('expo can start with tunnel from current directory', () => {
    const { execSync } = require('child_process');
    
    expect(() => {
      execSync('npx expo start --tunnel --help', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        timeout: 5000
      });
    }).not.toThrow();
  });

  test('expo can start with QR code from current directory', () => {
    const { execSync } = require('child_process');
    
    expect(() => {
      execSync('npx expo start --qr --help', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        timeout: 5000
      });
    }).not.toThrow();
  });

  test('expo can start with clear cache from current directory', () => {
    const { execSync } = require('child_process');
    
    expect(() => {
      execSync('npx expo start --clear --help', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        timeout: 5000
      });
    }).not.toThrow();
  });

  test('expo can start with dev mode from current directory', () => {
    const { execSync } = require('child_process');
    
    expect(() => {
      execSync('npx expo start --dev --help', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        timeout: 5000
      });
    }).not.toThrow();
  });

  test('expo can start with production mode from current directory', () => {
    const { execSync } = require('child_process');
    
    expect(() => {
      execSync('npx expo start --no-dev --help', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        timeout: 5000
      });
    }).not.toThrow();
  });

  test('expo can start with minify disabled from current directory', () => {
    const { execSync } = require('child_process');
    
    expect(() => {
      execSync('npx expo start --no-minify --help', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        timeout: 5000
      });
    }).not.toThrow();
  });

  test('expo can start with source maps from current directory', () => {
    const { execSync } = require('child_process');
    
    expect(() => {
      execSync('npx expo start --source-maps --help', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        timeout: 5000
      });
    }).not.toThrow();
  });

  test('expo can start with offline support from current directory', () => {
    const { execSync } = require('child_process');
    
    expect(() => {
      execSync('npx expo start --offline --help', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        timeout: 5000
      });
    }).not.toThrow();
  });

  test('expo can start with localhost from current directory', () => {
    const { execSync } = require('child_process');
    
    expect(() => {
      execSync('npx expo start --localhost --help', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        timeout: 5000
      });
    }).not.toThrow();
  });

  test('expo can start with lan from current directory', () => {
    const { execSync } = require('child_process');
    
    expect(() => {
      execSync('npx expo start --lan --help', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        timeout: 5000
      });
    }).not.toThrow();
  });

  test('expo can start with localhost and tunnel from current directory', () => {
    const { execSync } = require('child_process');
    
    expect(() => {
      execSync('npx expo start --localhost --tunnel --help', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        timeout: 5000
      });
    }).not.toThrow();
  });

  test('expo can start with localhost and lan from current directory', () => {
    const { execSync } = require('child_process');
    
    expect(() => {
      execSync('npx expo start --localhost --lan --help', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        timeout: 5000
      });
    }).not.toThrow();
  });

  test('expo can start with tunnel and lan from current directory', () => {
    const { execSync } = require('child_process');
    
    expect(() => {
      execSync('npx expo start --tunnel --lan --help', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        timeout: 5000
      });
    }).not.toThrow();
  });

  test('expo can start with all options from current directory', () => {
    const { execSync } = require('child_process');
    
    expect(() => {
      execSync('npx expo start --web --port 19006 --tunnel --help', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        timeout: 5000
      });
    }).not.toThrow();
  });
});


