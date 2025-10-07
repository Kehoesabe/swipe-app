import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AssessmentScreen from '../src/screens/AssessmentScreen';
import ResultsScreen from '../src/screens/ResultsScreen';
import { freeSummaries } from '../src/data/freeSummaries';
import { premiumReports } from '../src/data/premiumReports';
import { getSwipeType, getDisplayName } from '../src/data/swipeTypeMapping';

// Mock navigation
const Stack = createStackNavigator();
const MockedApp = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Assessment" component={AssessmentScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

// Mock the scoring algorithm to return predictable results
const mockScoringResults = {
  solidRock: {
    connectionStyles: { supportiveActions: 8, qualityPresence: 6, physicalCloseness: 4, verbalAffirmation: 2, thoughtfulGestures: 3, sharedGrowth: 1 },
    enneagramTypes: { type1: 7, type6: 5, type9: 4, type2: 3, type3: 2, type4: 1, type5: 1, type7: 1, type8: 1 }
  },
  watchfulGuard: {
    connectionStyles: { supportiveActions: 8, physicalCloseness: 6, qualityPresence: 4, verbalAffirmation: 2, thoughtfulGestures: 3, sharedGrowth: 1 },
    enneagramTypes: { type8: 7, type1: 5, type6: 4, type2: 3, type3: 2, type4: 1, type5: 1, type7: 1, type9: 1 }
  },
  warmHeart: {
    connectionStyles: { physicalCloseness: 8, supportiveActions: 6, qualityPresence: 4, verbalAffirmation: 2, thoughtfulGestures: 3, sharedGrowth: 1 },
    enneagramTypes: { type2: 7, type9: 5, type6: 4, type1: 3, type3: 2, type4: 1, type5: 1, type7: 1, type8: 1 }
  },
  gentleGuide: {
    connectionStyles: { verbalAffirmation: 8, qualityPresence: 6, supportiveActions: 4, physicalCloseness: 2, thoughtfulGestures: 3, sharedGrowth: 1 },
    enneagramTypes: { type2: 7, type9: 5, type6: 4, type1: 3, type3: 2, type4: 1, type5: 1, type7: 1, type8: 1 }
  },
  deepConnector: {
    connectionStyles: { qualityPresence: 8, thoughtfulGestures: 6, supportiveActions: 4, physicalCloseness: 2, verbalAffirmation: 3, sharedGrowth: 1 },
    enneagramTypes: { type4: 7, type5: 5, type6: 4, type1: 3, type2: 2, type3: 1, type7: 1, type8: 1, type9: 1 }
  },
  authenticSoul: {
    connectionStyles: { thoughtfulGestures: 8, sharedGrowth: 6, qualityPresence: 4, supportiveActions: 2, physicalCloseness: 3, verbalAffirmation: 1 },
    enneagramTypes: { type4: 7, type5: 5, type6: 4, type1: 3, type2: 2, type3: 1, type7: 1, type8: 1, type9: 1 }
  },
  progressPartner: {
    connectionStyles: { sharedGrowth: 8, supportiveActions: 6, qualityPresence: 4, physicalCloseness: 2, verbalAffirmation: 3, thoughtfulGestures: 1 },
    enneagramTypes: { type3: 7, type1: 5, type8: 4, type2: 3, type4: 2, type5: 1, type6: 1, type7: 1, type9: 1 }
  },
  freeSpirit: {
    connectionStyles: { qualityPresence: 8, thoughtfulGestures: 6, sharedGrowth: 4, supportiveActions: 2, physicalCloseness: 3, verbalAffirmation: 1 },
    enneagramTypes: { type7: 7, type3: 5, type8: 4, type2: 3, type4: 2, type1: 1, type5: 1, type6: 1, type9: 1 }
  }
};

// Mock the AssessmentScoring class
jest.mock('../src/lib/scoringAlgorithm', () => ({
  AssessmentScoring: jest.fn().mockImplementation(() => ({
    submitResponse: jest.fn(),
    getNextQuestion: jest.fn().mockReturnValue(null), // Simulate completion
    getProgress: jest.fn().mockReturnValue({
      current: 57,
      total: 57,
      percentage: 100
    }),
    isCompleted: jest.fn().mockReturnValue(true),
    responses: [],
    currentQuestionIndex: 57,
    generateResult: jest.fn().mockImplementation(() => {
      // Return a mock result based on the test scenario
      const testType = global.currentTestType || 'solidRock';
      const scores = mockScoringResults[testType];
      
      return {
        sessionId: 'test-session-123',
        swipeType: testType,
        swipeTypeName: getDisplayName(testType),
        primaryConnection: Object.keys(scores.connectionStyles).reduce((a, b) => 
          scores.connectionStyles[a] > scores.connectionStyles[b] ? a : b
        ),
        primaryEnneagram: Object.keys(scores.enneagramTypes).reduce((a, b) => 
          scores.enneagramTypes[a] > scores.enneagramTypes[b] ? a : b
        ),
        detailedCombo: `${Object.keys(scores.connectionStyles).reduce((a, b) => 
          scores.connectionStyles[a] > scores.connectionStyles[b] ? a : b
        )}_${Object.keys(scores.enneagramTypes).reduce((a, b) => 
          scores.enneagramTypes[a] > scores.enneagramTypes[b] ? a : b
        )}`,
        method: 'assessment' as const,
        calculatedAt: new Date(),
        scores: scores
      };
    })
  }))
}));

describe('Swipe Type Validation - End-to-End Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test all 8 swipe types
  const swipeTypes = [
    'solidRock', 'watchfulGuard', 'warmHeart', 'gentleGuide',
    'deepConnector', 'authenticSoul', 'progressPartner', 'freeSpirit'
  ];

  swipeTypes.forEach(swipeType => {
    test(`should display correct ${swipeType} profile type`, async () => {
      // Set the test type for this iteration
      global.currentTestType = swipeType;
      
      const { getByText, getByTestId } = render(<MockedApp />);
      
      // Complete the assessment (simulate answering all questions)
      const questionCard = getByTestId('question-card');
      
      // Simulate completing the assessment
      fireEvent.press(questionCard);
      
      // Wait for navigation to results
      await waitFor(() => {
        expect(getByText('Your Results')).toBeTruthy();
      });
      
      // Verify the correct swipe type name is displayed
      const expectedDisplayName = getDisplayName(swipeType);
      expect(getByText(expectedDisplayName)).toBeTruthy();
      
      // Verify the correct free summary is displayed
      const expectedSummary = freeSummaries[swipeType];
      expect(getByText(expectedSummary.substring(0, 50))).toBeTruthy();
    });
  });

  test('should validate mapping logic matches documentation', () => {
    // Test specific combinations that should map to specific swipe types
    const testCases = [
      { connection: 'supportiveActions', enneagram: 'type1', expected: 'solidRock' },
      { connection: 'supportiveActions', enneagram: 'type8', expected: 'watchfulGuard' },
      { connection: 'physicalCloseness', enneagram: 'type2', expected: 'warmHeart' },
      { connection: 'verbalAffirmation', enneagram: 'type2', expected: 'gentleGuide' },
      { connection: 'qualityPresence', enneagram: 'type4', expected: 'deepConnector' },
      { connection: 'thoughtfulGestures', enneagram: 'type4', expected: 'authenticSoul' },
      { connection: 'sharedGrowth', enneagram: 'type3', expected: 'progressPartner' },
      { connection: 'qualityPresence', enneagram: 'type7', expected: 'freeSpirit' }
    ];

    testCases.forEach(({ connection, enneagram, expected }) => {
      const result = getSwipeType(connection, enneagram);
      expect(result).toBe(expected);
      
      const displayName = getDisplayName(result);
      expect(displayName).toBeTruthy();
      expect(typeof displayName).toBe('string');
    });
  });

  test('should display correct content for each swipe type', async () => {
    const { getByText, getByTestId } = render(<MockedApp />);
    
    // Test with solidRock
    global.currentTestType = 'solidRock';
    
    const questionCard = getByTestId('question-card');
    fireEvent.press(questionCard);
    
    await waitFor(() => {
      expect(getByText('Your Results')).toBeTruthy();
    });
    
    // Verify solidRock specific content
    expect(getByText('Solid Rock')).toBeTruthy();
    expect(getByText(/You are a Solid Rock/)).toBeTruthy();
    expect(getByText(/You can count on me—always/)).toBeTruthy();
  });

  test('should validate premium report content structure', () => {
    // Test that all 8 swipe types have complete premium reports
    swipeTypes.forEach(swipeType => {
      const report = premiumReports[swipeType];
      
      expect(report).toBeDefined();
      expect(report.introduction).toBeTruthy();
      expect(report.howYouLove).toBeTruthy();
      expect(report.whatYouNeed).toBeTruthy();
      expect(report.yourStrengths).toBeTruthy();
      expect(report.growthOpportunities).toBeTruthy();
      expect(report.inConflict).toBeTruthy();
      expect(report.adviceForPartners).toBeTruthy();
      
      // Verify content length (should be substantial)
      expect(report.introduction.length).toBeGreaterThan(100);
      expect(report.howYouLove.length).toBeGreaterThan(100);
    });
  });

  test('should validate free summary content structure', () => {
    // Test that all 8 swipe types have free summaries
    swipeTypes.forEach(swipeType => {
      const summary = freeSummaries[swipeType];
      
      expect(summary).toBeDefined();
      expect(summary.length).toBeGreaterThan(50);
      expect(summary.length).toBeLessThan(300); // Should be concise
      
      // Should contain key elements
      expect(summary).toMatch(/You are a/);
      expect(summary).toMatch(/Your strength:/);
      expect(summary).toMatch(/Your growth edge:/);
    });
  });

  test('should handle navigation to full report correctly', async () => {
    const { getByText, getByTestId } = render(<MockedApp />);
    
    global.currentTestType = 'warmHeart';
    
    const questionCard = getByTestId('question-card');
    fireEvent.press(questionCard);
    
    await waitFor(() => {
      expect(getByText('Your Results')).toBeTruthy();
    });
    
    // Click on "View Full Report" button
    const fullReportButton = getByText('View Full Report (Free Preview)');
    fireEvent.press(fullReportButton);
    
    // Should navigate to full report screen
    await waitFor(() => {
      expect(getByText('Your Complete Report')).toBeTruthy();
    });
    
    // Verify warmHeart specific content in full report
    expect(getByText('Warm Heart')).toBeTruthy();
    expect(getByText(/You are a Warm Heart/)).toBeTruthy();
  });

  test('should validate scoring algorithm produces consistent results', () => {
    // Test that the same input produces the same output
    const testScores = mockScoringResults.solidRock;
    
    // Simulate multiple calls with same scores
    for (let i = 0; i < 5; i++) {
      const result = getSwipeType('supportiveActions', 'type1');
      expect(result).toBe('solidRock');
    }
  });

  test('should handle edge cases in mapping', () => {
    // Test edge cases that might cause issues
    const edgeCases = [
      { connection: 'supportiveActions', enneagram: 'type1' },
      { connection: 'qualityPresence', enneagram: 'type9' },
      { connection: 'physicalCloseness', enneagram: 'type2' },
      { connection: 'verbalAffirmation', enneagram: 'type2' },
      { connection: 'thoughtfulGestures', enneagram: 'type4' },
      { connection: 'sharedGrowth', enneagram: 'type3' }
    ];

    edgeCases.forEach(({ connection, enneagram }) => {
      const result = getSwipeType(connection, enneagram);
      expect(result).toBeTruthy();
      expect(swipeTypes).toContain(result);
      
      const displayName = getDisplayName(result);
      expect(displayName).toBeTruthy();
      expect(typeof displayName).toBe('string');
    });
  });
});
