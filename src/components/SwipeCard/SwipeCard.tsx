/**
 * SwipeCard Component - Core assessment interaction
 * Supports swipe, keyboard, and button inputs with haptic feedback
 */

import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  Animated,
  Dimensions,
  Vibration
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Colors, Typography, Spacing, Radii } from '../../theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100;

export type SwipeDirection = 'up' | 'down' | 'left' | 'right';

interface SwipeCardProps {
  children: React.ReactNode;
  onSwipe: (direction: SwipeDirection) => void;
  disabled?: boolean;
  testID?: string;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  children,
  onSwipe,
  disabled = false,
  testID
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const resetCard = () => {
    Animated.parallel([
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
      Animated.spring(rotate, { toValue: 0, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const handleSwipe = (direction: SwipeDirection) => {
    if (disabled) return;

    // Haptic feedback
    Vibration.vibrate(50);

    // Animate card fly-out (250ms duration, ease-out easing)
    const exitDistance = screenWidth * 1.5;
    let targetX = 0;
    let targetY = 0;
    let targetRotate = 0;

    switch (direction) {
      case 'up':
        targetY = -exitDistance;
        targetRotate = -15;
        break;
      case 'down':
        targetY = exitDistance;
        targetRotate = 15;
        break;
      case 'left':
        targetX = -exitDistance;
        targetRotate = -30;
        break;
      case 'right':
        targetX = exitDistance;
        targetRotate = 30;
        break;
    }

    Animated.timing(
      Animated.parallel([
        translateX,
        translateY,
        rotate,
        scale
      ]),
      {
        toValue: { x: targetX, y: targetY, rotate: targetRotate, scale: 0.8 },
        duration: 250,
        useNativeDriver: true,
      }
    ).start(() => {
      onSwipe(direction);
      resetCard();
    });
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (disabled) return;

    if (event.nativeEvent.state === State.END) {
      const { translationX, translationY, velocityX, velocityY } = event.nativeEvent;
      
      const absX = Math.abs(translationX);
      const absY = Math.abs(translationY);
      const absVelocityX = Math.abs(velocityX);
      const absVelocityY = Math.abs(velocityY);

      // Determine swipe direction based on distance and velocity
      if (absX > absY && (absX > SWIPE_THRESHOLD || absVelocityX > 500)) {
        handleSwipe(translationX > 0 ? 'right' : 'left');
      } else if (absY > absX && (absY > SWIPE_THRESHOLD || absVelocityY > 500)) {
        handleSwipe(translationY > 0 ? 'down' : 'up');
      } else {
        // Reset if not a clear swipe
        resetCard();
      }
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          handleSwipe('up');
          break;
        case 'ArrowDown':
          event.preventDefault();
          handleSwipe('down');
          break;
        case 'ArrowLeft':
          event.preventDefault();
          handleSwipe('left');
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleSwipe('right');
          break;
        case ' ':
        case 'Enter':
          event.preventDefault();
          handleSwipe('up'); // Default to "YES!" for space/enter
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [disabled]);

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      enabled={!disabled}
    >
      <Animated.View
        style={{
          transform: [
            { translateX },
            { translateY },
            { 
              rotate: rotate.interpolate({
                inputRange: [-180, 180],
                outputRange: ['-180deg', '180deg'],
              })
            },
            { scale }
          ],
        }}
        testID={testID}
      >
        <View style={styles.card}>
          {children}
          
          {/* Visual Direction Hints */}
          <View style={styles.directionHints}>
            <View style={[styles.hint, styles.hintUp]}>
              <Text style={styles.hintText}>↑ YES!</Text>
            </View>
            <View style={[styles.hint, styles.hintRight]}>
              <Text style={styles.hintText}>→ Yes</Text>
            </View>
            <View style={[styles.hint, styles.hintLeft]}>
              <Text style={styles.hintText}>← No</Text>
            </View>
            <View style={[styles.hint, styles.hintDown]}>
              <Text style={styles.hintText}>↓ NO!</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = {
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radii.lg,
    padding: Spacing.xl,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    minHeight: 200,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  directionHints: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none' as const,
  },
  hint: {
    position: 'absolute' as const,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.sm,
    opacity: 0.8,
  },
  hintUp: {
    top: Spacing.md,
    left: '50%',
    transform: [{ translateX: -30 }],
  },
  hintRight: {
    right: Spacing.md,
    top: '50%',
    transform: [{ translateY: -15 }],
  },
  hintLeft: {
    left: Spacing.md,
    top: '50%',
    transform: [{ translateY: -15 }],
  },
  hintDown: {
    bottom: Spacing.md,
    left: '50%',
    transform: [{ translateX: -30 }],
  },
  hintText: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: '600' as const,
  },
};