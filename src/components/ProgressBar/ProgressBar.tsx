/**
 * ProgressBar Component - Animated progress indicator
 * 400ms smooth fill animation with haptic feedback
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { Colors, Spacing } from '../../theme';

interface ProgressBarProps {
  progress: number; // 0-100
  animated?: boolean;
  height?: number;
  testID?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  animated = true,
  height = 4,
  testID
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: Math.min(100, Math.max(0, progress)),
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(Math.min(100, Math.max(0, progress)));
    }
  }, [progress, animated]);

  return (
    <View 
      style={[styles.container, { height }]}
      testID={testID}
    >
      <View style={styles.track} />
      <Animated.View 
        style={[
          styles.fill,
          {
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
              extrapolate: 'clamp',
            }),
          }
        ]}
      />
    </View>
  );
};

const styles = {
  container: {
    width: '100%',
    position: 'relative' as const,
  },
  track: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.border,
    borderRadius: 2,
  },
  fill: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
};
