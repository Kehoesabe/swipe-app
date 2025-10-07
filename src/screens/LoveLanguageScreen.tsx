/**
 * LoveLanguageScreen
 * 
 * Main screen for the Love Language test.
 * Adapted from PlatformScreen with Love Language focus and Tinder-style interface.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Animated
} from 'react-native';
import { SwipeCard } from '@/components/SwipeCard';
import { useLoveLanguage } from '@/hooks/useLoveLanguage';
import { SwipeResult } from '@/types/profile';
import { Colors, Spacing } from '@/constants';
import { loveLanguageService } from '@/services/loveLanguageService';

const { width: screenWidth } = Dimensions.get('window');

export const LoveLanguageScreen: React.FC = () => {
  const {
    currentQuestion,
    progress,
    isTestCompleted,
    getRandomQuestion,
    resetTest,
    submitResponse,
    generateResult,
    getPopulationData,
    getTestStats,
    loading,
    error
  } = useLoveLanguage();

  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [preloadedQuestions, setPreloadedQuestions] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({
    startTime: Date.now(),
    questionTimes: [] as number[],
    completionRate: 0,
    retakeCount: 0
  });

  // Love Language gradient colors
  const loveLanguageGradients = {
    words: ['#FF6B6B', '#FF8E8E'], // Warm reds for Words of Affirmation
    acts: ['#4ECDC4', '#7EDDD6'], // Teals for Acts of Service
    gifts: ['#45B7D1', '#6BC5D8'], // Blues for Receiving Gifts
    time: ['#96CEB4', '#A8D5BA'], // Greens for Quality Time
    touch: ['#FFEAA7', '#FFF2CC'] // Yellows for Physical Touch
  };

  const handleSwipe = (response: SwipeResult) => {
    if (!currentQuestion) return;
    
    // Track analytics
    const questionTime = Date.now() - analytics.startTime;
    setAnalytics(prev => ({
      ...prev,
      questionTimes: [...prev.questionTimes, questionTime],
      startTime: Date.now() // Reset for next question
    }));
    
    submitResponse(response);
    
    // Show feedback based on response
    const feedback = getFeedbackMessage(response);
    Alert.alert('Response Recorded', feedback);
  };

  const getFeedbackMessage = (response: SwipeResult): string => {
    switch (response) {
      case 'Yes':
        return '👍 You said Yes!';
      case 'No':
        return '👎 You said No!';
      case 'YES!':
        return '🔥 Strong Yes!';
      case 'NO!':
        return '❌ Strong No!';
      default:
        return 'Response recorded!';
    }
  };

  const handleShowResults = () => {
    if (isTestCompleted) {
      const testResult = generateResult();
      setResult(testResult);
      setShowResults(true);
      
      // Track completion analytics
      const totalTime = Date.now() - analytics.startTime;
      const avgQuestionTime = analytics.questionTimes.reduce((a, b) => a + b, 0) / analytics.questionTimes.length;
      setAnalytics(prev => ({
        ...prev,
        completionRate: 100,
        totalTime,
        avgQuestionTime
      }));
      
      // Animate results reveal
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleRetakeTest = () => {
    resetTest();
    setShowResults(false);
    setResult(null);
    // Reset animations
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);
    // Track retake analytics
    setAnalytics(prev => ({
      ...prev,
      retakeCount: prev.retakeCount + 1,
      startTime: Date.now(),
      questionTimes: [],
      completionRate: 0
    }));
  };

  // Pre-load next 3 questions for smoother swiping
  useEffect(() => {
    const preloadQuestions = () => {
      const questions = loveLanguageService.getAllQuestions().slice(0, 3);
      setPreloadedQuestions(questions);
    };
    
    preloadQuestions();
  }, [currentQuestion]);

  // Keyboard arrow support for desktop users
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!currentQuestion) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          handleSwipe('No');
          break;
        case 'ArrowRight':
          handleSwipe('Yes');
          break;
        case 'ArrowUp':
          handleSwipe('YES!');
          break;
        case 'ArrowDown':
          handleSwipe('NO!');
          break;
      }
    };

    // Only add keyboard listeners on web
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [currentQuestion]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading Love Language Test...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => window.location.reload()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showResults && result) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowResults(false)}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Love Language</Text>
        </View>

        <Animated.View 
          style={[
            styles.resultsContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              backgroundColor: loveLanguageGradients[result.primary as keyof typeof loveLanguageGradients]?.[0] || Colors.surface,
            }
          ]}
        >
          <Text style={styles.resultsTitle}>Your Primary Love Language</Text>
          <Text style={styles.primaryLanguage}>{result.description}</Text>
          
          <View style={styles.scoresContainer}>
            <Text style={styles.scoresTitle}>Your Love Language Scores</Text>
            {Object.entries(result.percentages).map(([language, percentage]) => (
              <View key={language} style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>{language.charAt(0).toUpperCase() + language.slice(1)}</Text>
                <View style={styles.scoreBar}>
                  <View 
                    style={[
                      styles.scoreFill, 
                      { width: `${percentage as number}%` },
                      language === result.primary ? styles.primaryScore : styles.secondaryScore
                    ]} 
                  />
                </View>
                <Text style={styles.scorePercentage}>{(percentage as number).toFixed(1)}%</Text>
              </View>
            ))}
          </View>

          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Tips for Your Love Language</Text>
            {result.tips.map((tip: string, index: number) => (
              <Text key={index} style={styles.tipText}>• {tip}</Text>
            ))}
          </View>

          <View style={styles.populationContainer}>
            <Text style={styles.populationTitle}>How You Compare</Text>
            <Text style={styles.populationText}>
              {result.percentages[result.primary].toFixed(1)}% of people share your primary love language
            </Text>
          </View>
        </Animated.View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleRetakeTest}>
            <Text style={styles.actionButtonText}>Retake Test</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Share', 'Sharing feature coming soon!')}>
            <Text style={styles.actionButtonText}>Share Results</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleShowResults}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Love Language Test</Text>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {progress.current} of {progress.total} answered
        </Text>
        <Text style={styles.progressSubtext}>
          {progress.total - progress.current} questions remaining
        </Text>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { 
                width: `${progress.percentage}%`,
                opacity: fadeAnim
              }
            ]} 
          />
        </View>
      </View>

      <View style={styles.content}>
        {currentQuestion && (
          <SwipeCard
            question={{
              id: currentQuestion.id,
              category: currentQuestion.category,
              text: currentQuestion.text,
              media: undefined,
              metadata: {
                source: 'Love Language Test',
                context: 'Understanding how you give and receive love'
              }
            }}
            onSwipe={handleSwipe}
            style={styles.swipeCard}
          />
        )}
        
        {/* Keyboard hints for desktop users */}
        <View style={styles.keyboardHints}>
          <Text style={styles.keyboardHintsText}>
            💡 Use arrow keys: ← No | → Yes | ↑ YES! | ↓ NO!
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={getRandomQuestion}>
          <Text style={styles.actionButtonText}>Random Question</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIcon: {
    fontSize: 24,
    color: Colors.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  progressContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  progressSubtext: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeCard: {
    width: '100%',
    maxWidth: 400,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  actionButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    padding: Spacing.lg,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    margin: Spacing.md,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  primaryLanguage: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  scoresContainer: {
    marginBottom: Spacing.xl,
  },
  scoresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  scoreLabel: {
    width: 80,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  scoreBar: {
    flex: 1,
    height: 20,
    backgroundColor: Colors.border,
    borderRadius: 10,
    marginHorizontal: Spacing.sm,
  },
  scoreFill: {
    height: '100%',
    borderRadius: 10,
  },
  primaryScore: {
    backgroundColor: Colors.primary,
  },
  secondaryScore: {
    backgroundColor: Colors.secondary,
  },
  scorePercentage: {
    width: 50,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  tipsContainer: {
    marginBottom: Spacing.xl,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  tipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  populationContainer: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.lg,
  },
  populationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  populationText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  keyboardHints: {
    marginTop: Spacing.md,
    padding: Spacing.sm,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    alignItems: 'center',
  },
  keyboardHintsText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
