/**
 * SwipeCard Component
 * 
 * A reusable card component for displaying questions and collecting swipe responses.
 * Designed for the Swipe Platform MVP.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
  Linking
} from 'react-native';
import { Question } from '@/data/content';
import { SwipeResult } from '@/types/profile';
import { Colors, Spacing } from '@/constants';

export { SwipeResult };

// Get screen width safely (for testing compatibility)
const getScreenWidth = () => {
  try {
    return Dimensions.get('window').width;
  } catch {
    return 375; // Default mobile width for testing
  }
};

const screenWidth = getScreenWidth();
const SWIPE_THRESHOLD = 100;

export interface SwipeCardProps {
  question: Question;
  onSwipe: (result: SwipeResult) => void;
  style?: any;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ question, onSwipe, style }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const rotate = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value || 0,
          y: (pan.y as any)._value || 0,
        });
      },
      onPanResponderMove: (_, gesture) => {
        pan.setValue({ x: gesture.dx, y: gesture.dy });
        
        // Add rotation based on horizontal movement
        const rotationValue = gesture.dx / 10;
        rotate.setValue(rotationValue);
      },
      onPanResponderRelease: (_, gesture) => {
        pan.flattenOffset();
        
        const { dx, dy } = gesture;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        
        // Determine if it's a horizontal or vertical swipe
        if (absDx > absDy && absDx > SWIPE_THRESHOLD) {
          // Horizontal swipe
          const direction = dx > 0 ? 'right' : 'left';
          const intensity = Math.min(absDx / SWIPE_THRESHOLD, 2);
          
          let result: SwipeResult;
          if (direction === 'right') {
            result = intensity > 1.5 ? 'YES!' : 'Yes';
          } else {
            result = intensity > 1.5 ? 'NO!' : 'No';
          }
          
          handleSwipe(result);
        } else if (absDy > absDx && absDy > SWIPE_THRESHOLD) {
          // Vertical swipe
          const direction = dy > 0 ? 'down' : 'up';
          const intensity = Math.min(absDy / SWIPE_THRESHOLD, 2);
          
          let result: SwipeResult;
          if (direction === 'up') {
            result = intensity > 1.5 ? 'YES!' : 'Yes';
          } else {
            result = intensity > 1.5 ? 'NO!' : 'No';
          }
          
          handleSwipe(result);
        } else {
          // Snap back
          snapBack();
        }
      },
    })
  ).current;

  const handleSwipe = (result: SwipeResult) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    const direction = result === 'Yes' || result === 'YES!' ? 1 : -1;
    const exitX = direction * screenWidth * 1.5;
    
    Animated.parallel([
      Animated.timing(pan, {
        toValue: { x: exitX, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotate, {
        toValue: direction * 30,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      onSwipe(result);
      resetCard();
    });
  };

  const snapBack = () => {
    Animated.parallel([
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }),
      Animated.spring(rotate, {
        toValue: 0,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const resetCard = () => {
    pan.setValue({ x: 0, y: 0 });
    rotate.setValue(0);
    setIsAnimating(false);
  };

  const handleMediaPress = () => {
    if (question.media?.type === 'link' && question.media.url) {
      Linking.openURL(question.media.url);
    }
  };

  const renderMedia = () => {
    if (!question.media) return null;

    const { type, url, alt } = question.media;

    if (type === 'image') {
      return (
        <TouchableOpacity onPress={handleMediaPress} style={styles.mediaContainer}>
          <Image
            source={{ uri: url }}
            style={styles.mediaImage}
            resizeMode="cover"
            accessibilityLabel={alt}
          />
        </TouchableOpacity>
      );
    }

    if (type === 'link') {
      return (
        <TouchableOpacity onPress={handleMediaPress} style={styles.linkContainer}>
          <Text style={styles.linkText}>🔗 {question.metadata?.source || 'External Link'}</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  const panStyle = {
    transform: [
      { translateX: pan.x },
      { translateY: pan.y },
      { rotate: rotate.interpolate({
        inputRange: [-30, 0, 30],
        outputRange: ['-30deg', '0deg', '30deg'],
      })},
    ],
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[styles.card, panStyle]}
        {...panResponder.panHandlers}
      >
        <View style={styles.content}>
          <Text style={styles.questionText}>{question.text}</Text>
          
          {renderMedia()}
          
          {question.metadata?.context && (
            <Text style={styles.contextText}>{question.metadata.context}</Text>
          )}
        </View>
        
        <View style={styles.swipeHints}>
          <Text style={styles.hintText}>← Swipe left for No</Text>
          <Text style={styles.hintText}>Swipe right for Yes →</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.xl,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    alignItems: 'center',
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 28,
  },
  mediaContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  linkContainer: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
  },
  linkText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  contextText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  swipeHints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  hintText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});

export default SwipeCard;