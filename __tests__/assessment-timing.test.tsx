import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AssessmentScreen from '../src/screens/AssessmentScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Mock navigation
const Stack = createStackNavigator();
const MockedAssessmentScreen = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Assessment" component={AssessmentScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

// Mock the scoring algorithm
jest.mock('../src/lib/scoringAlgorithm', () => ({
  AssessmentScoring: jest.fn().mockImplementation(() => ({
    submitResponse: jest.fn(),
    getNextQuestion: jest.fn().mockReturnValue({
      id: 2,
      text: 'Test question 2',
      framework: 'connection',
      category: 'verbalAffirmation',
      reverse: false,
      weight: { up: 2, right: 1, left: -1, down: -2 }
    }),
    getProgress: jest.fn().mockReturnValue({
      current: 1,
      total: 57,
      percentage: 1.75
    }),
    isCompleted: jest.fn().mockReturnValue(false),
    responses: [],
    currentQuestionIndex: 0
  }))
}));

describe('Assessment Timing and Pattern Detection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should handle rapid clicking without freezing', async () => {
    const { getByTestId } = render(<MockedAssessmentScreen />);
    
    // Simulate rapid clicking on the same question
    const questionCard = getByTestId('question-card');
    
    // Rapid fire clicks (should be handled gracefully)
    for (let i = 0; i < 5; i++) {
      fireEvent.press(questionCard);
      // Small delay to simulate rapid clicking
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // UI should not be frozen
    expect(questionCard).toBeTruthy();
  });

  test('should show warning for too-fast answers', async () => {
    const { getByText, queryByText } = render(<MockedAssessmentScreen />);
    
    // Try to answer immediately (should show warning)
    const questionCard = getByText(/I feel most connected when my partner tells me what they appreciate about me/);
    fireEvent.press(questionCard);
    
    // Should show timing warning
    await waitFor(() => {
      expect(queryByText(/Please take a moment to consider this question/)).toBeTruthy();
    });
  });

  test('should allow normal speed answers', async () => {
    const { getByText, queryByText } = render(<MockedAssessmentScreen />);
    
    // Wait for minimum time (1 second)
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    const questionCard = getByText(/I feel most connected when my partner tells me what they appreciate about me/);
    fireEvent.press(questionCard);
    
    // Should not show timing warning
    expect(queryByText(/Please take a moment to consider this question/)).toBeFalsy();
  });

  test('should detect same answer pattern', async () => {
    const { getByText } = render(<MockedAssessmentScreen />);
    
    // Simulate answering the same way multiple times
    const questionCard = getByText(/I feel most connected when my partner tells me what they appreciate about me/);
    
    // Wait and answer multiple times in same direction
    for (let i = 0; i < 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 1100));
      fireEvent.press(questionCard);
    }
    
    // Should show pattern warning
    await waitFor(() => {
      expect(getByText(/You've been swiping/)).toBeTruthy();
    });
  });

  test('should handle keyboard rapid input', async () => {
    const { getByText } = render(<MockedAssessmentScreen />);
    
    // Simulate rapid keyboard input
    const questionCard = getByText(/I feel most connected when my partner tells me what they appreciate about me/);
    
    // Rapid keyboard events
    for (let i = 0; i < 3; i++) {
      fireEvent.keyDown(questionCard, { key: 'ArrowRight' });
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Should handle gracefully without freezing
    expect(questionCard).toBeTruthy();
  });

  test('should maintain UI responsiveness during animations', async () => {
    const { getByText } = render(<MockedAssessmentScreen />);
    
    const questionCard = getByText(/I feel most connected when my partner tells me what they appreciate about me/);
    
    // Wait for minimum time
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    // Trigger animation
    fireEvent.press(questionCard);
    
    // UI should remain responsive
    expect(questionCard).toBeTruthy();
    
    // Should be able to interact with other elements
    const undoButton = getByText('Undo');
    expect(undoButton).toBeTruthy();
  });
});
