// src/ui/Progress.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { Colors, Spacing, Typography, Motion } from '../theme/tokens';

export default function Progress({ current, total }: { current: number; total: number }) {
  const v = useSharedValue(current/total);
  React.useEffect(()=>{ v.value = withTiming(current/total, { duration: Motion.progressMs }); }, [current, total]);

  const fill = useAnimatedStyle(()=>({ width: `${v.value*100}%` }));

  return (
    <View style={styles.wrap}>
      <View style={styles.track}><Animated.View style={[styles.fill, fill]} /></View>
      <Text style={styles.txt}>{`Question ${current} / ${total}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  track: { height: 6, backgroundColor: Colors.card, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: Colors.primary },
  txt: { ...Typography.caption, color: Colors.textMuted, textAlign: 'right', marginTop: Spacing.sm },
});