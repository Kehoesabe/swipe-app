/**
 * Card Component - Swipe Type Assessment App
 * Themed card component for content display
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  style?: ViewStyle;
  testID?: string;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  style,
  testID,
}: CardProps) {
  const { theme } = useTheme();
  
  const cardStyles = [
    styles.base,
    styles[variant],
    styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
    {
      backgroundColor: getBackgroundColor(variant, theme),
      borderColor: getBorderColor(variant, theme),
      ...getShadowStyle(variant),
    },
    style,
  ];

  return (
    <View style={cardStyles} testID={testID}>
      {children}
    </View>
  );
}

// Helper functions for dynamic styling
function getBackgroundColor(variant: CardVariant, theme: any): string {
  switch (variant) {
    case 'default':
      return theme.colors.surface;
    case 'elevated':
      return theme.colors.surface;
    case 'outlined':
      return theme.colors.surface;
    case 'filled':
      return theme.colors.surfaceSecondary;
    default:
      return theme.colors.surface;
  }
}

function getBorderColor(variant: CardVariant, theme: any): string {
  switch (variant) {
    case 'outlined':
      return theme.colors.border;
    default:
      return 'transparent';
  }
}

function getShadowStyle(variant: CardVariant) {
  switch (variant) {
    case 'elevated':
      return {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      };
    default:
      return {};
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  
  // Variants
  default: {
    // Basic card styling
  },
  elevated: {
    // Shadow handled dynamically
  },
  outlined: {
    borderWidth: 1,
  },
  filled: {
    // Background handled dynamically
  },
  
  // Padding variants
  paddingNone: {
    padding: 0,
  },
  paddingSm: {
    padding: 12,
  },
  paddingMd: {
    padding: 16,
  },
  paddingLg: {
    padding: 24,
  },
});




