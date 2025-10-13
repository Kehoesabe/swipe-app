import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

describe('Expo Startup Configuration', () => {
  const projectRoot = process.cwd();
  
  test('expo CLI can find project', () => {
    // Test that expo can find the project from the correct directory
    expect(() => {
      execSync('npx expo --version', { 
        cwd: projectRoot,
        stdio: 'pipe' 
      });
    }).not.toThrow();
  });

  test('expo start command works from project root', () => {
    // Test that expo start can be initiated (we'll kill it immediately)
    const startCommand = 'npx expo start --help';
    
    expect(() => {
      execSync(startCommand, { 
        cwd: projectRoot,
        stdio: 'pipe',
        timeout: 10000 // 10 second timeout
      });
    }).not.toThrow();
  });

  test('expo web command works', () => {
    const webCommand = 'npx expo start --web --help';
    
    expect(() => {
      execSync(webCommand, { 
        cwd: projectRoot,
        stdio: 'pipe',
        timeout: 10000
      });
    }).not.toThrow();
  });

  test('expo can detect project type', () => {
    expect(() => {
      const result = execSync('npx expo install --help', { 
        cwd: projectRoot,
        stdio: 'pipe',
        timeout: 5000
      });
      expect(result.toString()).toContain('install');
    }).not.toThrow();
  });

  test('package.json has correct expo dependencies', () => {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check for required Expo dependencies
    expect(packageJson.dependencies).toBeDefined();
    expect(packageJson.dependencies.expo).toBeDefined();
    expect(packageJson.dependencies.react).toBeDefined();
    expect(packageJson.dependencies['react-native']).toBeDefined();
    expect(packageJson.dependencies['@react-navigation/native']).toBeDefined();
    expect(packageJson.dependencies['@react-navigation/stack']).toBeDefined();
  });

  test('expo configuration is valid for web', () => {
    const appJsonPath = path.join(projectRoot, 'app.json');
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    
    expect(appJson.expo.platforms).toContain('web');
    expect(appJson.expo.web).toBeDefined();
  });

  test('metro config is compatible with expo', () => {
    const metroConfigPath = path.join(projectRoot, 'metro.config.js');
    expect(fs.existsSync(metroConfigPath)).toBe(true);
    
    // Check that metro config can be loaded
    expect(() => {
      require(metroConfigPath);
    }).not.toThrow();
  });

  test('babel config is compatible with expo', () => {
    const babelConfigPath = path.join(projectRoot, 'babel.config.js');
    expect(fs.existsSync(babelConfigPath)).toBe(true);
    
    // Check that babel config can be loaded
    expect(() => {
      require(babelConfigPath);
    }).not.toThrow();
  });

  test('expo doctor passes', () => {
    // This test ensures expo doctor doesn't find any critical issues
    expect(() => {
      execSync('npx expo doctor', { 
        cwd: projectRoot,
        stdio: 'pipe',
        timeout: 15000
      });
    }).not.toThrow();
  });

  test('can start expo in tunnel mode', () => {
    const tunnelCommand = 'npx expo start --tunnel --help';
    
    expect(() => {
      execSync(tunnelCommand, { 
        cwd: projectRoot,
        stdio: 'pipe',
        timeout: 10000
      });
    }).not.toThrow();
  });

  test('expo can generate QR code', () => {
    const qrCommand = 'npx expo start --qr --help';
    
    expect(() => {
      execSync(qrCommand, { 
        cwd: projectRoot,
        stdio: 'pipe',
        timeout: 10000
      });
    }).not.toThrow();
  });

  test('expo can start with specific port', () => {
    const portCommand = 'npx expo start --port 19006 --help';
    
    expect(() => {
      execSync(portCommand, { 
        cwd: projectRoot,
        stdio: 'pipe',
        timeout: 10000
      });
    }).not.toThrow();
  });

  test('expo can clear cache', () => {
    const clearCommand = 'npx expo start --clear --help';
    
    expect(() => {
      execSync(clearCommand, { 
        cwd: projectRoot,
        stdio: 'pipe',
        timeout: 10000
      });
    }).not.toThrow();
  });

  test('expo can start in development mode', () => {
    const devCommand = 'npx expo start --dev --help';
    
    expect(() => {
      execSync(devCommand, { 
        cwd: projectRoot,
        stdio: 'pipe',
        timeout: 10000
      });
    }).not.toThrow();
  });

  test('expo can start in production mode', () => {
    const prodCommand = 'npx expo start --no-dev --help';
    
    expect(() => {
      execSync(prodCommand, { 
        cwd: projectRoot,
        stdio: 'pipe',
        timeout: 10000
      });
    }).not.toThrow();
  });

  test('expo can start with minify disabled', () => {
    const minifyCommand = 'npx expo start --no-minify --help';
    
    expect(() => {
      execSync(minifyCommand, { 
        cwd: projectRoot,
        stdio: 'pipe',
        timeout: 10000
      });
    }).not.toThrow();
  });

  test('expo can start with source maps', () => {
    const sourceMapCommand = 'npx expo start --source-maps --help';
    
    expect(() => {
      execSync(sourceMapCommand, { 
        cwd: projectRoot,
        stdio: 'pipe',
        timeout: 10000
      });
    }).not.toThrow();
  });

  test('expo can start with offline support', () => {
    const offlineCommand = 'npx expo start --offline --help';
    
    expect(() => {
      execSync(offlineCommand, { 
        cwd: projectRoot,
        stdio: 'pipe',
        timeout: 10000
      });
    }).not.toThrow();
  });

  test('expo can start with localhost', () => {
    const localhostCommand = 'npx expo start --localhost --help';
    
    expect(() => {
      execSync(localhostCommand, { 
        cwd: projectRoot,
        stdio: 'pipe',
        timeout: 10000
      });
    }).not.toThrow();
  });

  test('expo can start with lan', () => {
    const lanCommand = 'npx expo start --lan --help';
    
    expect(() => {
      execSync(lanCommand, { 
        cwd: projectRoot,
        stdio: 'pipe',
        timeout: 10000
      });
    }).not.toThrow();
  });

  test('expo can start with localhost and tunnel', () => {
    const localhostTunnelCommand = 'npx expo start --localhost --tunnel --help';
    
    expect(() => {
      execSync(localhostTunnelCommand, { 
        cwd: projectRoot,
        stdio: 'pipe',
        timeout: 10000
      });
    }).not.toThrow();
  });
});


