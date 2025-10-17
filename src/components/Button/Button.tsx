/**
 * Button Component - Swipe Type Assessment App
 * Themed button component with multiple variants and states
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  testID,
}: ButtonProps) {
  const { theme } = useTheme();
  
  const isDisabled = disabled || loading;
  
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    { backgroundColor: getBackgroundColor(variant, theme, isDisabled) },
    { borderColor: getBorderColor(variant, theme, isDisabled) },
    style,
  ];
  
  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    isDisabled && styles.disabledText,
    { color: getTextColor(variant, theme, isDisabled) },
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      testID={testID}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={getTextColor(variant, theme, isDisabled)} 
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

// Helper functions for dynamic colors
function getBackgroundColor(variant: ButtonVariant, theme: any, isDisabled: boolean): string {
  if (isDisabled) return theme.colors.surfaceSecondary;
  
  switch (variant) {
    case 'primary':
      return theme.colors.primary;
    case 'secondary':
      return theme.colors.secondary;
    case 'outline':
    case 'ghost':
      return 'transparent';
    case 'danger':
      return theme.colors.error;
    default:
      return theme.colors.primary;
  }
}

function getBorderColor(variant: ButtonVariant, theme: any, isDisabled: boolean): string {
  if (isDisabled) return theme.colors.border;
  
  switch (variant) {
    case 'outline':
      return theme.colors.primary;
    case 'ghost':
      return 'transparent';
    default:
      return 'transparent';
  }
}

function getTextColor(variant: ButtonVariant, theme: any, isDisabled: boolean): string {
  if (isDisabled) return theme.colors.textTertiary;
  
  switch (variant) {
    case 'primary':
    case 'danger':
      return theme.colors.textInverse;
    case 'secondary':
      return theme.colors.textInverse;
    case 'outline':
      return theme.colors.primary;
    case 'ghost':
      return theme.colors.text;
    default:
      return theme.colors.textInverse;
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
  },
  
  // Variants
  primary: {
    // backgroundColor handled dynamically
  },
  secondary: {
    // backgroundColor handled dynamically
  },
  outline: {
    backgroundColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  danger: {
    // backgroundColor handled dynamically
  },
  
  // Sizes
  sm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 32,
  },
  md: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  lg: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 52,
  },
  xl: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    minHeight: 60,
  },
  
  // States
  disabled: {
    opacity: 0.6,
  },
  fullWidth: {
    width: '100%',
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Variant text styles
  primaryText: {},
  secondaryText: {},
  outlineText: {},
  ghostText: {},
  dangerText: {},
  
  // Size text styles
  smText: {
    fontSize: 12,
  },
  mdText: {
    fontSize: 14,
  },
  lgText: {
    fontSize: 16,
  },
  xlText: {
    fontSize: 18,
  },
  
  // State text styles
  disabledText: {
    opacity: 0.6,
  },
});




