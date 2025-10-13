/**
 * Typography Component - Swipe Type Assessment App
 * Themed text components with consistent styling
 */

import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export type TypographyVariant = 
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'body1' | 'body2' | 'caption' | 'overline'
  | 'button' | 'label';

export type TypographyColor = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'error' | 'success';

interface TypographyProps {
  children: React.ReactNode;
  variant?: TypographyVariant;
  color?: TypographyColor;
  align?: 'left' | 'center' | 'right';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  style?: TextStyle;
  testID?: string;
}

export function Typography({
  children,
  variant = 'body1',
  color = 'primary',
  align = 'left',
  weight,
  style,
  testID,
}: TypographyProps) {
  const { theme } = useTheme();
  
  const textStyles = [
    styles.base,
    styles[variant],
    { color: getTextColor(color, theme) },
    { textAlign: align },
    weight && { fontWeight: getFontWeight(weight) },
    style,
  ];

  return (
    <Text style={textStyles} testID={testID}>
      {children}
    </Text>
  );
}

// Helper functions
function getTextColor(color: TypographyColor, theme: any): string {
  switch (color) {
    case 'primary':
      return theme.colors.text;
    case 'secondary':
      return theme.colors.textSecondary;
    case 'tertiary':
      return theme.colors.textTertiary;
    case 'inverse':
      return theme.colors.textInverse;
    case 'error':
      return theme.colors.error;
    case 'success':
      return theme.colors.success;
    default:
      return theme.colors.text;
  }
}

function getFontWeight(weight: string): string {
  switch (weight) {
    case 'light':
      return '300';
    case 'normal':
      return '400';
    case 'medium':
      return '500';
    case 'semibold':
      return '600';
    case 'bold':
      return '700';
    default:
      return '400';
  }
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'Inter',
  },
  
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  h6: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  
  // Body text
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  
  // Small text
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  overline: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  // Interactive text
  button: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
});


