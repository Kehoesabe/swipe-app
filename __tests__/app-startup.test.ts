import * as fs from 'fs';
import * as path from 'path';

describe('App Startup Configuration', () => {
  const projectRoot = process.cwd();
  
  test('package.json exists in correct location', () => {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    expect(fs.existsSync(packageJsonPath)).toBe(true);
    
    // Verify it's a valid package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    expect(packageJson.name).toBe('swipe-app');
    expect(packageJson.version).toBeDefined();
  });

  test('app.json exists and is valid', () => {
    const appJsonPath = path.join(projectRoot, 'app.json');
    expect(fs.existsSync(appJsonPath)).toBe(true);
    
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    expect(appJson.expo).toBeDefined();
    expect(appJson.expo.name).toBeDefined();
    expect(appJson.expo.slug).toBeDefined();
  });

  test('App.tsx exists and is valid', () => {
    const appTsxPath = path.join(projectRoot, 'App.tsx');
    expect(fs.existsSync(appTsxPath)).toBe(true);
    
    const appContent = fs.readFileSync(appTsxPath, 'utf8');
    expect(appContent).toContain('AppNavigator');
    expect(appContent).toContain('export default');
  });

  test('src directory structure is correct', () => {
    const srcPath = path.join(projectRoot, 'src');
    expect(fs.existsSync(srcPath)).toBe(true);
    
    // Check key directories
    expect(fs.existsSync(path.join(srcPath, 'screens'))).toBe(true);
    expect(fs.existsSync(path.join(srcPath, 'components'))).toBe(true);
    expect(fs.existsSync(path.join(srcPath, 'data'))).toBe(true);
    expect(fs.existsSync(path.join(srcPath, 'lib'))).toBe(true);
    expect(fs.existsSync(path.join(srcPath, 'navigation'))).toBe(true);
  });

  test('required data files exist', () => {
    const dataPath = path.join(projectRoot, 'src', 'data');
    
    // Check all required data files
    expect(fs.existsSync(path.join(dataPath, 'questions.ts'))).toBe(true);
    expect(fs.existsSync(path.join(dataPath, 'freeSummaries.ts'))).toBe(true);
    expect(fs.existsSync(path.join(dataPath, 'premiumReports.ts'))).toBe(true);
    expect(fs.existsSync(path.join(dataPath, 'swipeTypeMapping.ts'))).toBe(true);
  });

  test('navigation files exist', () => {
    const navigationPath = path.join(projectRoot, 'src', 'navigation');
    
    expect(fs.existsSync(path.join(navigationPath, 'AppNavigator.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(navigationPath, 'types.ts'))).toBe(true);
  });

  test('screen files exist', () => {
    const screensPath = path.join(projectRoot, 'src', 'screens');
    
    expect(fs.existsSync(path.join(screensPath, 'LandingScreen.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(screensPath, 'DirectInputScreen.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(screensPath, 'AssessmentScreen.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(screensPath, 'ResultsScreen.tsx'))).toBe(true);
  });

  test('lib files exist', () => {
    const libPath = path.join(projectRoot, 'src', 'lib');
    
    expect(fs.existsSync(path.join(libPath, 'types.ts'))).toBe(true);
    expect(fs.existsSync(path.join(libPath, 'scoringAlgorithm.ts'))).toBe(true);
  });

  test('expo configuration is valid', () => {
    const appJsonPath = path.join(projectRoot, 'app.json');
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    
    // Check required Expo fields
    expect(appJson.expo.name).toBeDefined();
    expect(appJson.expo.slug).toBeDefined();
    expect(appJson.expo.version).toBeDefined();
    expect(appJson.expo.platforms).toContain('ios');
    expect(appJson.expo.platforms).toContain('android');
    expect(appJson.expo.platforms).toContain('web');
  });

  test('TypeScript configuration is valid', () => {
    const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
    expect(fs.existsSync(tsconfigPath)).toBe(true);
    
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    expect(tsconfig.compilerOptions).toBeDefined();
    expect(tsconfig.compilerOptions.target).toBeDefined();
    expect(tsconfig.compilerOptions.module).toBeDefined();
  });

  test('metro configuration exists', () => {
    const metroConfigPath = path.join(projectRoot, 'metro.config.js');
    expect(fs.existsSync(metroConfigPath)).toBe(true);
  });

  test('babel configuration exists', () => {
    const babelConfigPath = path.join(projectRoot, 'babel.config.js');
    expect(fs.existsSync(babelConfigPath)).toBe(true);
  });

  test('jest configuration exists and is valid', () => {
    const jestConfigPath = path.join(projectRoot, 'jest.config.js');
    expect(fs.existsSync(jestConfigPath)).toBe(true);
    
    const jestConfig = require(jestConfigPath);
    expect(jestConfig.preset).toBeDefined();
    expect(jestConfig.setupFilesAfterEnv).toBeDefined();
  });

  test('node_modules exists (dependencies installed)', () => {
    const nodeModulesPath = path.join(projectRoot, 'node_modules');
    expect(fs.existsSync(nodeModulesPath)).toBe(true);
    
    // Check for key dependencies
    expect(fs.existsSync(path.join(nodeModulesPath, 'expo'))).toBe(true);
    expect(fs.existsSync(path.join(nodeModulesPath, 'react'))).toBe(true);
    expect(fs.existsSync(path.join(nodeModulesPath, 'react-native'))).toBe(true);
    expect(fs.existsSync(path.join(nodeModulesPath, '@react-navigation'))).toBe(true);
  });

  test('package-lock.json exists (dependencies locked)', () => {
    const packageLockPath = path.join(projectRoot, 'package-lock.json');
    expect(fs.existsSync(packageLockPath)).toBe(true);
  });

  test('can import main app component', () => {
    // This test ensures the app can be imported without errors
    expect(() => {
      require('../App.tsx');
    }).not.toThrow();
  });

  test('can import navigation', () => {
    expect(() => {
      require('../src/navigation/AppNavigator.tsx');
    }).not.toThrow();
  });

  test('can import data files', () => {
    expect(() => {
      require('../src/data/questions.ts');
      require('../src/data/freeSummaries.ts');
      require('../src/data/premiumReports.ts');
      require('../src/data/swipeTypeMapping.ts');
    }).not.toThrow();
  });

  test('can import screen components', () => {
    expect(() => {
      require('../src/screens/LandingScreen.tsx');
      require('../src/screens/DirectInputScreen.tsx');
      require('../src/screens/AssessmentScreen.tsx');
      require('../src/screens/ResultsScreen.tsx');
    }).not.toThrow();
  });

  test('can import lib modules', () => {
    expect(() => {
      require('../src/lib/types.ts');
      require('../src/lib/scoringAlgorithm.ts');
    }).not.toThrow();
  });
});
