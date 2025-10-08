// src/features/assessment/AssessmentCard.tsx
import React, { useEffect } from 'react';
import { Text, StyleSheet, Platform } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Typography, Radius, Motion } from '../../theme/tokens';

type Dir = 'up'|'right'|'left'|'down';

export default function AssessmentCard({
  text,
  onCommit,
}: {
  text: string;
  onCommit: (dir: Dir) => void;
}) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  // Keyboard parity (web/desktop)
  useEffect(() => {
    if (Platform.OS === 'web') {
      const onKey = (e: KeyboardEvent) => {
        let d: Dir | null = null;
        if (e.key === 'ArrowUp') d = 'up';
        if (e.key === 'ArrowRight') d = 'right';
        if (e.key === 'ArrowLeft') d = 'left';
        if (e.key === 'ArrowDown') d = 'down';
        if (!d) return;
        e.preventDefault();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        animateOff(d);
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
  }, []);

  const animateOff = (dir: Dir) => {
    'worklet';
    const dx = dir === 'right' ? 900 : dir === 'left' ? -900 : 0;
    const dy = dir === 'up' ? -900 : dir === 'down' ? 900 : 0;
    x.value = withTiming(dx, { duration: Motion.commitMs });
    y.value = withTiming(dy, { duration: Motion.commitMs }, () => runOnJS(onCommit)(dir));
  };

  const pan = Gesture.Pan()
    .onChange((e) => {
      'worklet';
      x.value = e.translationX;
      y.value = e.translationY;
    })
    .onEnd(() => {
      'worklet';
      const ax = Math.abs(x.value), ay = Math.abs(y.value);
      const major = ax > ay ? 'x' : 'y';
      const mag = Math.max(ax, ay);
      if (mag < Motion.softPx) {
        x.value = withSpring(0); y.value = withSpring(0);
        return;
      }
      let dir: Dir = 'right';
      if (major === 'x') dir = x.value > 0 ? 'right' : 'left';
      else dir = y.value < 0 ? 'up' : 'down';
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      animateOff(dir);
    });

  // Main card
  const main = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { rotate: `${Math.max(-Motion.tiltMaxDeg, Math.min(Motion.tiltMaxDeg, x.value / 20))}deg` },
    ],
  }));

  // Ghost card: slight lag + fade by distance
  const ghost = useAnimatedStyle(() => {
    const gx = x.value * 0.85;
    const gy = y.value * 0.85;
    const m = Math.hypot(x.value, y.value);
    const o = Math.max(0, Math.min(0.6, (m - 20) / (Motion.hardPx - 20) * 0.6));
    return { transform: [{ translateX: gx }, { translateY: gy }], opacity: o };
  });

  // Pending label selection
  const badge = useAnimatedStyle(() => {
    const ax = Math.abs(x.value), ay = Math.abs(y.value);
    const majorX = ax > ay;
    const mag = Math.max(ax, ay);
    const strong = mag > Motion.hardPx;
    let bg = 'transparent', px = 0, py = 0, label = '';

    if (majorX && mag > Motion.softPx) {
      if (x.value > 0) { label = strong ? 'Strongly Agree' : 'Slightly Agree'; bg = strong ? Colors.agreeStrong : Colors.agree; px = 110; }
      else { label = strong ? 'Strongly Disagree' : 'Slightly Disagree'; bg = strong ? Colors.disagreeStrong : Colors.disagree; px = -110; }
    } else if (!majorX && mag > Motion.softPx) {
      if (y.value < 0) { label = strong ? 'Strongly Agree' : 'Slightly Agree'; bg = strong ? Colors.agreeStrong : Colors.agree; py = -110; }
      else { label = strong ? 'Strongly Disagree' : 'Slightly Disagree'; bg = strong ? Colors.disagreeStrong : Colors.disagree; py = 110; }
    }
    return {
      backgroundColor: label ? bg : 'transparent',
      transform: [{ translateX: px }, { translateY: py }],
      opacity: label ? 1 : 0,
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={styles.center}>
        <Animated.View style={[styles.cardGhost, ghost]} />
        <Animated.View style={[styles.card, main]} accessibilityLabel="Question Card">
          <Text style={styles.prompt}>{text}</Text>
          <Animated.Text
            accessibilityLiveRegion="polite"
            style={[styles.badge, badge]}
          />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  card: {
    width: '88%',
    aspectRatio: 1/1.25,
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8,
  },
  cardGhost: {
    position: 'absolute',
    width: '88%',
    aspectRatio: 1/1.25,
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    opacity: 0.3,
  },
  prompt: { ...Typography.h3, color: Colors.text, textAlign: 'center' },
  badge: {
    position: 'absolute',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.lg,
    color: Colors.text,
    ...Typography.caption,
    overflow: 'hidden',
  },
});