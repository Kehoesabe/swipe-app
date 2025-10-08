// src/features/results/ResultsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Screen from '../../ui/Screen';
import { Colors, Typography, Spacing, Radius } from '../../theme/tokens';
import Chip from '../../ui/Chip';
import Button from '../../ui/Button';

export default function ResultsScreen({
  typeName,
  typeColor,
  summary,
  onBuy,
}: {
  typeName: string;
  typeColor: string;
  summary: string;
  onBuy: () => void;
}) {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.wrap}>
        <Text style={styles.header}>Your Swipe Type:</Text>
        <View style={[styles.card, { backgroundColor: typeColor }]}>
          <Text style={styles.type}>{typeName}</Text>
        </View>
        <Text style={styles.section}>Core Essence</Text>
        <Text style={styles.summary}>{summary}</Text>

        <View style={styles.chips}>
          <Chip label="Primary Style" />
          <Chip label="Enneagram" style={{ marginLeft: Spacing.sm }} />
        </View>

        <View style={styles.paywall}>
          <Text style={styles.payTitle}>Unlock your full 750-word report</Text>
          <Text style={styles.payList}>• conflict de-escalation scripts{'\n'}• partner advice{'\n'}• growth plan</Text>
          <Button title="Unlock Full Report – $12" onPress={onBuy} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', padding: Spacing.lg },
  header: { ...Typography.h2, color: Colors.text, marginBottom: Spacing.md },
  card: { width: '90%', aspectRatio: 3/1, borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  type: { ...Typography.h1, color: Colors.text },
  section: { ...Typography.h3, color: Colors.highlight, marginBottom: Spacing.sm },
  summary: { ...Typography.body, color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing.lg },
  chips: { flexDirection: 'row', marginBottom: Spacing.lg },
  paywall: { width: '90%', backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.lg },
  payTitle: { ...Typography.h3, color: Colors.text, marginBottom: Spacing.sm },
  payList: { ...Typography.body, color: Colors.textMuted, marginBottom: Spacing.lg },
});
