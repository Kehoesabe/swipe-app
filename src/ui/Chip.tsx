// src/ui/Chip.tsx
import React from 'react';
import { Text, View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Typography, Radius } from '../theme/tokens';

export default function Chip({ label, color, style }: { label: string; color?: string; style?: ViewStyle }) {
  return (
    <View style={[styles.chip, { backgroundColor: color ?? Colors.card }, style]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  chip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.lg, alignSelf: 'flex-start' },
  text: { ...Typography.caption, color: Colors.text },
});