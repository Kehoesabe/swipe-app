// src/ui/Button.tsx
import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Typography, Radius } from '../theme/tokens';

type Props = { title: string; onPress: () => void; variant?: 'primary'|'secondary'; style?: ViewStyle; disabled?: boolean; };

export default function Button({ title, onPress, variant='primary', style, disabled }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({pressed}) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        pressed && { opacity: 0.9 },
        disabled && { opacity: 0.6 },
        style,
      ]}
      onPress={() => { if (disabled) return; Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
    >
      <Text style={[styles.text, variant === 'primary' ? styles.textPrimary : styles.textSecondary]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 52, paddingHorizontal: Spacing.xl, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: Colors.primary },
  secondary: { borderWidth: 1, borderColor: Colors.secondary, backgroundColor: 'transparent' },
  text: { ...Typography.body, fontWeight: '600' },
  textPrimary: { color: Colors.text },
  textSecondary: { color: Colors.secondary },
});