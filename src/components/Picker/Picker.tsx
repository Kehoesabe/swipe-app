/**
 * Picker Component - Swipe Type Assessment App
 * Themed picker component for dropdown selections
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  Modal,
  FlatList,
  Dimensions
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export type PickerVariant = 'default' | 'outlined' | 'filled';
export type PickerSize = 'sm' | 'md' | 'lg';

interface PickerOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface PickerProps {
  options: PickerOption[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  errorText?: string;
  variant?: PickerVariant;
  size?: PickerSize;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export function Picker({
  options,
  selectedValue,
  onValueChange,
  placeholder = 'Select an option',
  label,
  helperText,
  errorText,
  variant = 'default',
  size = 'md',
  disabled = false,
  style,
  testID,
}: PickerProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  const isError = !!errorText;
  const selectedOption = options.find(option => option.value === selectedValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;
  
  const containerStyles = [
    styles.container,
    style,
  ];
  
  const pickerStyles = [
    styles.picker,
    styles[variant],
    styles[size],
    {
      backgroundColor: getBackgroundColor(variant, theme, disabled),
      borderColor: getBorderColor(theme, isError, disabled),
    },
    isError && styles.error,
    disabled && styles.disabled,
  ];
  
  const textStyles = [
    styles.text,
    {
      color: selectedOption ? theme.colors.text : theme.colors.textTertiary,
    },
    disabled && { color: theme.colors.textTertiary },
  ];

  const handleSelect = (value: string) => {
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <View style={containerStyles} testID={testID}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        style={pickerStyles}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        testID={testID ? `${testID}-trigger` : undefined}
      >
        <Text style={textStyles}>{displayText}</Text>
        <Text style={[styles.arrow, { color: theme.colors.textTertiary }]}>
          ▼
        </Text>
      </TouchableOpacity>
      
      {(helperText || errorText) && (
        <Text style={[
          styles.helperText,
          { color: isError ? theme.colors.error : theme.colors.textSecondary }
        ]}>
          {errorText || helperText}
        </Text>
      )}
      
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    { 
                      backgroundColor: item.value === selectedValue 
                        ? theme.colors.primary 
                        : 'transparent',
                    },
                    item.disabled && styles.disabledOption,
                  ]}
                  onPress={() => !item.disabled && handleSelect(item.value)}
                  disabled={item.disabled}
                >
                  <Text style={[
                    styles.optionText,
                    {
                      color: item.value === selectedValue 
                        ? theme.colors.textInverse 
                        : theme.colors.text,
                    },
                    item.disabled && { color: theme.colors.textTertiary },
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.optionsList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// Helper functions
function getBackgroundColor(variant: PickerVariant, theme: any, disabled: boolean): string {
  if (disabled) return theme.colors.surfaceSecondary;
  if (variant === 'filled') return theme.colors.surfaceSecondary;
  return theme.colors.surface;
}

function getBorderColor(theme: any, isError: boolean, disabled: boolean): string {
  if (disabled) return theme.colors.border;
  if (isError) return theme.colors.error;
  return theme.colors.border;
}

const { height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  
  picker: {
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
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
  error: {
    // Border color handled dynamically
  },
  disabled: {
    opacity: 0.6,
  },
  
  text: {
    flex: 1,
    fontSize: 16,
  },
  
  arrow: {
    fontSize: 12,
    marginLeft: 8,
  },
  
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    width: '80%',
    maxHeight: screenHeight * 0.6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  
  optionsList: {
    maxHeight: screenHeight * 0.4,
  },
  
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  
  disabledOption: {
    opacity: 0.5,
  },
  
  optionText: {
    fontSize: 16,
  },
});


