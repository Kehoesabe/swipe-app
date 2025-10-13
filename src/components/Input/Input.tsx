/**
 * Input Component - Swipe Type Assessment App
 * Themed input component with validation states
 */

import React, { useState } from 'react';
import { 
  TextInput, 
  View, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  TouchableOpacity 
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export type InputVariant = 'default' | 'outlined' | 'filled';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputState = 'default' | 'error' | 'success' | 'disabled';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  errorText?: string;
  variant?: InputVariant;
  size?: InputSize;
  state?: InputState;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  testID?: string;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  label,
  helperText,
  errorText,
  variant = 'default',
  size = 'md',
  state = 'default',
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  testID,
  rightIcon,
  onRightIconPress,
}: InputProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  
  const isError = state === 'error' || !!errorText;
  const isSuccess = state === 'success';
  const isDisabled = disabled || state === 'disabled';
  
  const containerStyles = [
    styles.container,
    style,
  ];
  
  const inputContainerStyles = [
    styles.inputContainer,
    styles[variant],
    styles[size],
    {
      backgroundColor: getBackgroundColor(variant, theme, isFocused, isError, isSuccess, isDisabled),
      borderColor: getBorderColor(theme, isFocused, isError, isSuccess, isDisabled),
    },
    isFocused && styles.focused,
    isError && styles.error,
    isSuccess && styles.success,
    isDisabled && styles.disabled,
  ];
  
  const inputStyles = [
    styles.input,
    styles[`${size}Input`],
    {
      color: isDisabled ? theme.colors.textTertiary : theme.colors.text,
    },
    inputStyle,
  ];

  return (
    <View style={containerStyles} testID={testID}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {label}
        </Text>
      )}
      
      <View style={inputContainerStyles}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textTertiary}
          editable={!isDisabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={inputStyles}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          testID={testID ? `${testID}-input` : undefined}
        />
        
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIcon}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {(helperText || errorText) && (
        <Text style={[
          styles.helperText,
          { color: isError ? theme.colors.error : theme.colors.textSecondary }
        ]}>
          {errorText || helperText}
        </Text>
      )}
    </View>
  );
}

// Helper functions
function getBackgroundColor(
  variant: InputVariant, 
  theme: any, 
  isFocused: boolean, 
  isError: boolean, 
  isSuccess: boolean, 
  isDisabled: boolean
): string {
  if (isDisabled) return theme.colors.surfaceSecondary;
  if (variant === 'filled') return theme.colors.surfaceSecondary;
  return theme.colors.surface;
}

function getBorderColor(
  theme: any, 
  isFocused: boolean, 
  isError: boolean, 
  isSuccess: boolean, 
  isDisabled: boolean
): string {
  if (isDisabled) return theme.colors.border;
  if (isError) return theme.colors.error;
  if (isSuccess) return theme.colors.success;
  if (isFocused) return theme.colors.primary;
  return theme.colors.border;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  
  inputContainer: {
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Variants
  default: {
    backgroundColor: 'transparent',
  },
  outlined: {
    backgroundColor: 'transparent',
  },
  filled: {
    // Background handled dynamically
  },
  
  // Sizes
  sm: {
    minHeight: 36,
    paddingHorizontal: 12,
  },
  md: {
    minHeight: 44,
    paddingHorizontal: 16,
  },
  lg: {
    minHeight: 52,
    paddingHorizontal: 20,
  },
  
  // States
  focused: {
    // Border color handled dynamically
  },
  error: {
    // Border color handled dynamically
  },
  success: {
    // Border color handled dynamically
  },
  disabled: {
    opacity: 0.6,
  },
  
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  
  // Size-specific input styles
  smInput: {
    fontSize: 14,
  },
  mdInput: {
    fontSize: 16,
  },
  lgInput: {
    fontSize: 18,
  },
  
  rightIcon: {
    padding: 8,
    marginLeft: 8,
  },
  
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
});


