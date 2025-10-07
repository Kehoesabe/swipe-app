/**
 * PlatformScreen
 * 
 * Main screen for the Swipe Platform MVP.
 * Displays questions and collects responses using the content system.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { SwipeCard } from '@/components/SwipeCard';
import { useContent } from '@/hooks/useContent';
import { SwipeResult } from '@/types/profile';
import { Colors, Spacing } from '@/constants';

export const PlatformScreen: React.FC = () => {
  const {
    currentQuestion,
    allQuestions,
    allCategories,
    nextQuestion,
    getRandomQuestion,
    resetRotation,
    submitResponse,
    getOverallStats,
    loading,
    error
  } = useContent();

  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const handleSwipe = (result: SwipeResult) => {
    if (!currentQuestion) return;
    
    submitResponse(result);
    
    // Show feedback based on response
    const feedback = getFeedbackMessage(result);
    Alert.alert('Response Recorded', feedback);
  };

  const getFeedbackMessage = (result: SwipeResult): string => {
    switch (result) {
      case 'Yes':
        return '👍 You said Yes!';
      case 'No':
        return '👎 You said No!';
      case 'YES!':
        return '🔥 Super Yes!';
      case 'NO!':
        return '❌ Strong No!';
      default:
        return 'Response recorded!';
    }
  };

  const handleShowStats = () => {
    const overallStats = getOverallStats();
    setStats(overallStats);
    setShowStats(true);
  };

  const handleReset = () => {
    resetRotation();
    setShowStats(false);
    setStats(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading content...</Text>
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

  if (showStats && stats) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowStats(false)}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Platform Statistics</Text>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Overall Statistics</Text>
          <Text style={styles.statsText}>Total Responses: {stats.totalResponses}</Text>

          {stats.categoryStats.map((categoryStat: any) => (
            <View key={categoryStat.categoryId} style={styles.categoryStats}>
              <Text style={styles.categoryTitle}>
                {allCategories.find(c => c.id === categoryStat.categoryId)?.name || categoryStat.categoryId}
              </Text>
              <Text style={styles.categoryText}>Total: {categoryStat.totalResponses}</Text>
              <Text style={styles.categoryText}>Yes: {categoryStat.responses.Yes} ({categoryStat.percentage.Yes.toFixed(1)}%)</Text>
              <Text style={styles.categoryText}>No: {categoryStat.responses.No} ({categoryStat.percentage.No.toFixed(1)}%)</Text>
              <Text style={styles.categoryText}>YES!: {categoryStat.responses['YES!']} ({categoryStat.percentage['YES!'].toFixed(1)}%)</Text>
              <Text style={styles.categoryText}>NO!: {categoryStat.responses['NO!']} ({categoryStat.percentage['NO!'].toFixed(1)}%)</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleReset}>
            <Text style={styles.actionButtonText}>Reset & Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleShowStats}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Swipe Platform</Text>
      </View>

      <View style={styles.content}>
        {currentQuestion && (
          <SwipeCard
            question={currentQuestion}
            onSwipe={handleSwipe}
            style={styles.swipeCard}
          />
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={nextQuestion}>
          <Text style={styles.actionButtonText}>Next Question</Text>
        </TouchableOpacity>
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
  statsContainer: {
    padding: Spacing.lg,
  },
  statsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  statsText: {
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  categoryStats: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
});


