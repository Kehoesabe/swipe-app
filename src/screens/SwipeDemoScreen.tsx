import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, TouchableOpacity } from 'react-native';
import { SwipeCard, SwipeResult } from '@/components/SwipeCard';
import { Colors, Spacing } from '@/constants';

const { width: screenWidth } = Dimensions.get('window');

const MESSAGES = [
  { text: "Will it rain in River Falls today?", icon: "🌧️" },
  { text: "Do you like this packaging?", icon: "📦" },
  { text: "Do you like football?", icon: "⚽" },
  { text: "Do you enjoy cooking?", icon: "👨‍🍳" },
  { text: "Do you like music?", icon: "🎵" }
];

export const SwipeDemoScreen: React.FC = () => {
  const [swipeHistory, setSwipeHistory] = useState<SwipeResult[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [swipeTotals, setSwipeTotals] = useState({
    'Yes': 0,
    'No': 0,
    'YES!': 0,
    'NO!': 0
  });
  const [showTestsPage, setShowTestsPage] = useState(false);
  const [perQuestionStats, setPerQuestionStats] = useState<Record<number, Record<SwipeResult, number>>>({});

  const handleSwipe = (result: SwipeResult) => {
    // Update swipe history
    setSwipeHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 swipes
    
    // Update overall totals
    setSwipeTotals(prev => ({
      ...prev,
      [result]: prev[result] + 1
    }));
    
    // Update per-question stats
    setPerQuestionStats(prev => ({
      ...prev,
      [currentMessageIndex]: {
        ...prev[currentMessageIndex],
        [result]: (prev[currentMessageIndex]?.[result] || 0) + 1
      }
    }));
    
    // Move to next message
    setCurrentMessageIndex(prev => (prev + 1) % MESSAGES.length);
    
    // Show different messages based on swipe direction
    let actionMessage = '';
    switch (result) {
      case 'Yes':
        actionMessage = '👍 You liked this!';
        break;
      case 'No':
        actionMessage = '👎 You passed on this';
        break;
      case 'YES!':
        actionMessage = '🔥 Super like!';
        break;
      case 'NO!':
        actionMessage = '❌ No way!';
        break;
    }
    
    Alert.alert('Swipe Action', actionMessage);
  };

  if (showTestsPage) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowTestsPage(false)}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tests Page</Text>
        </View>
        
        <Text style={styles.testDataTitle}>Test Data</Text>
        
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Question</Text>
            <Text style={styles.headerCell}>Yes</Text>
            <Text style={styles.headerCell}>Yes!</Text>
            <Text style={styles.headerCell}>No</Text>
            <Text style={styles.headerCell}>No way!</Text>
          </View>
          {MESSAGES.map((message, index) => {
            const stats = perQuestionStats[index] || { 'Yes': 0, 'No': 0, 'YES!': 0, 'NO!': 0 };
            return (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.questionCell}>{message.text}</Text>
                <Text style={styles.dataCell}>{stats['Yes']}</Text>
                <Text style={styles.dataCell}>{stats['YES!']}</Text>
                <Text style={styles.dataCell}>{stats['No']}</Text>
                <Text style={styles.dataCell}>{stats['NO!']}</Text>
              </View>
            );
          })}
          <View style={styles.tableRow}>
            <Text style={styles.questionCell}>Totals</Text>
            <Text style={styles.dataCell}>{swipeTotals['Yes']}</Text>
            <Text style={styles.dataCell}>{swipeTotals['YES!']}</Text>
            <Text style={styles.dataCell}>{swipeTotals['No']}</Text>
            <Text style={styles.dataCell}>{swipeTotals['NO!']}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowTestsPage(true)}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.swipeContainer}>
        <SwipeCard
          onSwipe={handleSwipe}
          threshold={100}
          style={styles.swipeCard}
        >
          <View style={styles.cardContent}>
            <Text style={styles.questionText}>
              {MESSAGES[currentMessageIndex].text}
            </Text>
            <Text style={styles.questionIcon}>
              {MESSAGES[currentMessageIndex].icon}
            </Text>
          </View>
        </SwipeCard>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  menuIcon: {
    fontSize: 24,
    color: Colors.textPrimary,
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    flex: 1,
  },
  swipeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  swipeCard: {
    width: Math.min(screenWidth - 40, 350),
    height: 400,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 32,
  },
  questionIcon: {
    fontSize: 80,
    textAlign: 'center',
  },
  testDataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    marginTop: Spacing.lg,
  },
  tableContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.shadow,
    marginHorizontal: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: Spacing.sm,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.shadow,
    paddingVertical: Spacing.sm,
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.surface,
    fontSize: 12,
    borderRightWidth: 1,
    borderRightColor: Colors.shadow,
    paddingHorizontal: 4,
  },
  questionCell: {
    flex: 2,
    paddingLeft: Spacing.sm,
    fontSize: 12,
    color: Colors.textPrimary,
    borderRightWidth: 1,
    borderRightColor: Colors.shadow,
    paddingHorizontal: 4,
  },
  dataCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
    borderRightWidth: 1,
    borderRightColor: Colors.shadow,
    paddingHorizontal: 4,
  },
});

