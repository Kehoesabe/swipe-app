/**
 * Theme System Test
 * Tests the theme provider and token system
 */

import { tokens, lightTheme, darkTheme } from '../src/theme/tokens';

describe('Theme System', () => {
  test('should have valid token structure', () => {
    expect(tokens.colors).toBeDefined();
    expect(tokens.typography).toBeDefined();
    expect(tokens.spacing).toBeDefined();
    expect(tokens.borderRadius).toBeDefined();
    expect(tokens.shadows).toBeDefined();
  });

  test('should have light theme colors', () => {
    expect(lightTheme.colors.background).toBe('#ffffff');
    expect(lightTheme.colors.text).toBe('#171717');
    expect(lightTheme.colors.primary).toBe('#ef4444');
  });

  test('should have dark theme colors', () => {
    expect(darkTheme.colors.background).toBe('#0a0a0a');
    expect(darkTheme.colors.text).toBe('#fafafa');
    expect(darkTheme.colors.primary).toBe('#f87171');
  });

  test('should have relationship-specific colors', () => {
    expect(lightTheme.colors.love).toBe('#ec4899');
    expect(lightTheme.colors.trust).toBe('#3b82f6');
    expect(darkTheme.colors.love).toBe('#f472b6');
    expect(darkTheme.colors.trust).toBe('#60a5fa');
  });

  test('should have consistent color structure', () => {
    const lightKeys = Object.keys(lightTheme.colors);
    const darkKeys = Object.keys(darkTheme.colors);
    
    expect(lightKeys).toEqual(darkKeys);
    expect(lightKeys.length).toBeGreaterThan(10);
  });

  test('should have valid typography tokens', () => {
    expect(tokens.typography.fontSize.base).toBe(16);
    expect(tokens.typography.fontWeight.bold).toBe('700');
    expect(tokens.typography.lineHeight.normal).toBe(1.5);
  });

  test('should have valid spacing tokens', () => {
    expect(tokens.spacing[4]).toBe(16);
    expect(tokens.spacing[8]).toBe(32);
    expect(tokens.spacing[16]).toBe(64);
  });

  test('should have valid border radius tokens', () => {
    expect(tokens.borderRadius.sm).toBe(4);
    expect(tokens.borderRadius.base).toBe(8);
    expect(tokens.borderRadius.full).toBe(9999);
  });
});




