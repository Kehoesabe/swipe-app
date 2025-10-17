/**
 * PaymentButton Component
 * 
 * Handles premium unlock payment flow
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Colors, Typography, Spacing } from '../theme';

export interface PaymentButtonProps {
  onUnlock: () => void;
  isProcessing: boolean;
  disabled?: boolean;
  price?: number;
  currency?: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  onUnlock,
  isProcessing,
  disabled = false,
  price = 12,
  currency = 'USD',
}) => {
  const handlePress = () => {
    if (isProcessing || disabled) {
      return;
    }

    Alert.alert(
      'Unlock Premium Profile',
      `Get your complete personality profile with detailed insights, growth strategies, and relationship guidance for $${price}.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',
          onPress: onUnlock,
          style: 'default',
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || isProcessing}
      style={[
        styles.button,
        (disabled || isProcessing) && styles.buttonDisabled,
      ]}
      activeOpacity={0.8}
    >
      {isProcessing ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={styles.buttonText}>
          Unlock Premium - ${price}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default PaymentButton;



