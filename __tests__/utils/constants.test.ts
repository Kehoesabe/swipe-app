/**
 * Utility Constants Tests
 * 
 * Tests for utility constants and helper functions
 */
import { APP_NAME, APP_VERSION, COLORS, SPACING, FONT_SIZES } from '@/utils/constants';

describe('Utility Constants', () => {
  describe('App constants', () => {
    test('APP_NAME is defined', () => {
      expect(APP_NAME).toBe('Swipe App');
      expect(typeof APP_NAME).toBe('string');
    });

    test('APP_VERSION is defined', () => {
      expect(APP_VERSION).toBe('1.0.0');
      expect(typeof APP_VERSION).toBe('string');
    });
  });

  describe('COLORS', () => {
    test('has all required color properties', () => {
      expect(COLORS).toHaveProperty('primary');
      expect(COLORS).toHaveProperty('secondary');
      expect(COLORS).toHaveProperty('success');
      expect(COLORS).toHaveProperty('warning');
      expect(COLORS).toHaveProperty('error');
      expect(COLORS).toHaveProperty('background');
      expect(COLORS).toHaveProperty('surface');
      expect(COLORS).toHaveProperty('text');
      expect(COLORS).toHaveProperty('textSecondary');
      expect(COLORS).toHaveProperty('border');
    });

    test('all colors are valid hex values', () => {
      Object.values(COLORS).forEach(color => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    test('primary color is correct', () => {
      expect(COLORS.primary).toBe('#007AFF');
    });

    test('background color is correct', () => {
      expect(COLORS.background).toBe('#f8f9fa');
    });
  });

  describe('SPACING', () => {
    test('has all required spacing properties', () => {
      expect(SPACING).toHaveProperty('xs');
      expect(SPACING).toHaveProperty('sm');
      expect(SPACING).toHaveProperty('md');
      expect(SPACING).toHaveProperty('lg');
      expect(SPACING).toHaveProperty('xl');
    });

    test('all spacing values are numbers', () => {
      Object.values(SPACING).forEach(spacing => {
        expect(typeof spacing).toBe('number');
        expect(spacing).toBeGreaterThan(0);
      });
    });

    test('spacing values are in ascending order', () => {
      const values = Object.values(SPACING);
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeGreaterThan(values[i - 1]);
      }
    });

    test('xs spacing is 4', () => {
      expect(SPACING.xs).toBe(4);
    });

    test('xl spacing is 32', () => {
      expect(SPACING.xl).toBe(32);
    });
  });

  describe('FONT_SIZES', () => {
    test('has all required font size properties', () => {
      expect(FONT_SIZES).toHaveProperty('xs');
      expect(FONT_SIZES).toHaveProperty('sm');
      expect(FONT_SIZES).toHaveProperty('md');
      expect(FONT_SIZES).toHaveProperty('lg');
      expect(FONT_SIZES).toHaveProperty('xl');
      expect(FONT_SIZES).toHaveProperty('xxl');
    });

    test('all font sizes are numbers', () => {
      Object.values(FONT_SIZES).forEach(size => {
        expect(typeof size).toBe('number');
        expect(size).toBeGreaterThan(0);
      });
    });

    test('font sizes are in ascending order', () => {
      const values = Object.values(FONT_SIZES);
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeGreaterThan(values[i - 1]);
      }
    });

    test('xs font size is 12', () => {
      expect(FONT_SIZES.xs).toBe(12);
    });

    test('xxl font size is 32', () => {
      expect(FONT_SIZES.xxl).toBe(32);
    });
  });

  describe('Constants structure', () => {
    test('COLORS has correct structure', () => {
      expect(Object.keys(COLORS)).toHaveLength(10);
    });

    test('SPACING has correct structure', () => {
      expect(Object.keys(SPACING)).toHaveLength(5);
    });

    test('FONT_SIZES has correct structure', () => {
      expect(Object.keys(FONT_SIZES)).toHaveLength(6);
    });
  });
});