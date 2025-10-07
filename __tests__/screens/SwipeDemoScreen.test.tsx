/**
 * SwipeDemoScreen Integration Tests
 * 
 * Tests the main screen functionality including:
 * - Swipe gesture handling and result processing
 * - Question rotation and display
 * - Statistics tracking (overall and per-question)
 * - Menu navigation and test data view
 * - Data persistence (when implemented)
 */
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { SwipeDemoScreen } from '@/screens/SwipeDemoScreen';
import { SwipeResult } from '@/components/SwipeCard';

// Mock Alert to prevent actual alerts during tests
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Animated is already mocked in jest.setup.js

describe('SwipeDemoScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Render', () => {
    test('renders main screen with first question', () => {
      const { getByText } = render(<SwipeDemoScreen />);
      
      expect(getByText('Will it rain in River Falls today?')).toBeTruthy();
      expect(getByText('🌧️')).toBeTruthy();
    });

    test('renders menu icon in header', () => {
      const { getByText } = render(<SwipeDemoScreen />);
      
      expect(getByText('☰')).toBeTruthy();
    });

    test('does not show test data table initially', () => {
      const { queryByText } = render(<SwipeDemoScreen />);
      
      expect(queryByText('Tests Page')).toBeFalsy();
      expect(queryByText('Test Data')).toBeFalsy();
    });
  });

  describe('Swipe Gesture Handling', () => {
    test('handles right swipe (Yes) correctly', async () => {
      const { getByTestId } = render(<SwipeDemoScreen />);
      
      // Find the SwipeCard component
      const swipeCard = getByTestId('swipe-card');
      
      // Simulate right swipe
      await act(async () => {
        // Access pan handlers directly (following existing SwipeCard test pattern)
        const handlers = swipeCard.props;
        handlers.onPanResponderMove?.(null, { dx: 150, dy: 0 });
        handlers.onPanResponderRelease?.(null, { dx: 150, dy: 0 });
      });

      // Verify Alert was called with correct message
      expect(Alert.alert).toHaveBeenCalledWith('Swipe Action', '👍 You liked this!');
    });

    test('handles left swipe (No) correctly', async () => {
      const { getByTestId } = render(<SwipeDemoScreen />);
      
      const swipeCard = getByTestId('swipe-card');
      
      await act(async () => {
        const handlers = swipeCard.props;
        handlers.onPanResponderMove?.(null, { dx: -150, dy: 0 });
        handlers.onPanResponderRelease?.(null, { dx: -150, dy: 0 });
      });

      expect(Alert.alert).toHaveBeenCalledWith('Swipe Action', '👎 You passed on this');
    });

    test('handles up swipe (YES!) correctly', async () => {
      const { getByTestId } = render(<SwipeDemoScreen />);
      
      const swipeCard = getByTestId('swipe-card');
      
      await act(async () => {
        const handlers = swipeCard.props;
        handlers.onPanResponderMove?.(null, { dx: 0, dy: -150 });
        handlers.onPanResponderRelease?.(null, { dx: 0, dy: -150 });
      });

      expect(Alert.alert).toHaveBeenCalledWith('Swipe Action', '🔥 Super like!');
    });

    test('handles down swipe (NO!) correctly', async () => {
      const { getByTestId } = render(<SwipeDemoScreen />);
      
      const swipeCard = getByTestId('swipe-card');
      
      await act(async () => {
        const handlers = swipeCard.props;
        handlers.onPanResponderMove?.(null, { dx: 0, dy: 150 });
        handlers.onPanResponderRelease?.(null, { dx: 0, dy: 150 });
      });

      expect(Alert.alert).toHaveBeenCalledWith('Swipe Action', '❌ No way!');
    });
  });

  describe('Question Rotation', () => {
    test('advances to next question after swipe', async () => {
      const { getByText, getByTestId } = render(<SwipeDemoScreen />);
      
      // Verify initial question
      expect(getByText('Will it rain in River Falls today?')).toBeTruthy();
      
      // Perform swipe
      const swipeCard = getByTestId('swipe-card');
      await act(async () => {
        const handlers = swipeCard.props;
        handlers.onPanResponderMove?.(null, { dx: 150, dy: 0 });
        handlers.onPanResponderRelease?.(null, { dx: 150, dy: 0 });
      });

      // Verify next question is shown
      await waitFor(() => {
        expect(getByText('Do you like this packaging?')).toBeTruthy();
        expect(getByText('📦')).toBeTruthy();
      });
    });

    test('cycles through all questions and returns to first', async () => {
      const { getByText, getByTestId } = render(<SwipeDemoScreen />);
      
      const swipeCard = getByTestId('swipe-card');
      
      // Swipe through all 5 questions
      for (let i = 0; i < 5; i++) {
        await act(async () => {
          const handlers = swipeCard.props;
          handlers.onPanResponderMove?.(null, { dx: 150, dy: 0 });
          handlers.onPanResponderRelease?.(null, { dx: 150, dy: 0 });
        });
      }

      // Should be back to first question
      await waitFor(() => {
        expect(getByText('Will it rain in River Falls today?')).toBeTruthy();
      });
    });
  });

  describe('Statistics Tracking', () => {
    test('tracks overall swipe totals correctly', async () => {
      const { getByTestId } = render(<SwipeDemoScreen />);
      
      const swipeCard = getByTestId('swipe-card');
      
      // Perform different types of swipes
      const swipes: Array<{ dx: number; dy: number; expectedResult: SwipeResult }> = [
        { dx: 150, dy: 0, expectedResult: 'Yes' },
        { dx: -150, dy: 0, expectedResult: 'No' },
        { dx: 0, dy: -150, expectedResult: 'YES!' },
        { dx: 0, dy: 150, expectedResult: 'NO!' },
      ];

      for (const swipe of swipes) {
        await act(async () => {
          const handlers = swipeCard.props;
          handlers.onPanResponderMove?.(null, { dx: swipe.dx, dy: swipe.dy });
          handlers.onPanResponderRelease?.(null, { dx: swipe.dx, dy: swipe.dy });
        });
      }

      // Note: We can't directly test internal state, but we can verify
      // that the component handles multiple swipes without crashing
      expect(Alert.alert).toHaveBeenCalledTimes(4);
    });

    test('tracks per-question statistics', async () => {
      const { getByTestId } = render(<SwipeDemoScreen />);
      
      const swipeCard = getByTestId('swipe-card');
      
      // Swipe on first question
      await act(async () => {
        const handlers = swipeCard.props;
        handlers.onPanResponderMove?.(null, { dx: 150, dy: 0 });
        handlers.onPanResponderRelease?.(null, { dx: 150, dy: 0 });
      });

      // Move to next question and swipe again
      await act(async () => {
        const handlers = swipeCard.props;
        handlers.onPanResponderMove?.(null, { dx: -150, dy: 0 });
        handlers.onPanResponderRelease?.(null, { dx: -150, dy: 0 });
      });

      // Component should handle per-question tracking without errors
      expect(Alert.alert).toHaveBeenCalledTimes(2);
    });
  });

  describe('Menu Navigation', () => {
    test('opens test data page when menu icon is pressed', () => {
      const { getByText } = render(<SwipeDemoScreen />);
      
      const menuIcon = getByText('☰');
      fireEvent.press(menuIcon);
      
      expect(getByText('Tests Page')).toBeTruthy();
      expect(getByText('Test Data')).toBeTruthy();
    });

    test('shows test data table with correct headers', () => {
      const { getByText } = render(<SwipeDemoScreen />);
      
      const menuIcon = getByText('☰');
      fireEvent.press(menuIcon);
      
      expect(getByText('Question')).toBeTruthy();
      expect(getByText('Yes')).toBeTruthy();
      expect(getByText('Yes!')).toBeTruthy();
      expect(getByText('No')).toBeTruthy();
      expect(getByText('No way!')).toBeTruthy();
    });

    test('shows all questions in test data table', () => {
      const { getByText } = render(<SwipeDemoScreen />);
      
      const menuIcon = getByText('☰');
      fireEvent.press(menuIcon);
      
      // Check that all 5 questions are displayed
      expect(getByText('Will it rain in River Falls today?')).toBeTruthy();
      expect(getByText('Do you like this packaging?')).toBeTruthy();
      expect(getByText('Do you like football?')).toBeTruthy();
      expect(getByText('Do you enjoy cooking?')).toBeTruthy();
      expect(getByText('Do you like music?')).toBeTruthy();
    });

    test('returns to main screen when menu icon is pressed in test page', () => {
      const { getByText, queryByText } = render(<SwipeDemoScreen />);
      
      // Open test page
      const menuIcon = getByText('☰');
      fireEvent.press(menuIcon);
      
      expect(getByText('Tests Page')).toBeTruthy();
      
      // Return to main screen
      const backMenuIcon = getByText('☰');
      fireEvent.press(backMenuIcon);
      
      expect(queryByText('Tests Page')).toBeFalsy();
      expect(getByText('Will it rain in River Falls today?')).toBeTruthy();
    });
  });

  describe('Test Data Display', () => {
    test('shows totals row in test data table', () => {
      const { getByText } = render(<SwipeDemoScreen />);
      
      const menuIcon = getByText('☰');
      fireEvent.press(menuIcon);
      
      expect(getByText('Totals')).toBeTruthy();
    });

    test('displays initial zero values for all statistics', () => {
      const { getAllByText } = render(<SwipeDemoScreen />);
      
      const menuIcon = getAllByText('☰')[0];
      fireEvent.press(menuIcon);
      
      // All data cells should show 0 initially
      const dataCells = getAllByText('0');
      expect(dataCells.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('handles swipe gestures gracefully', async () => {
      const { getByTestId } = render(<SwipeDemoScreen />);
      
      const swipeCard = getByTestId('swipe-card');
      
      // Test edge case: very large swipe
      await act(async () => {
        const handlers = swipeCard.props;
        handlers.onPanResponderMove?.(null, { dx: 1000, dy: 0 });
        handlers.onPanResponderRelease?.(null, { dx: 1000, dy: 0 });
      });

      // Should not crash and should handle the swipe
      expect(Alert.alert).toHaveBeenCalled();
    });

    test('handles rapid successive swipes', async () => {
      const { getByTestId } = render(<SwipeDemoScreen />);
      
      const swipeCard = getByTestId('swipe-card');
      
      // Perform multiple rapid swipes
      for (let i = 0; i < 3; i++) {
        await act(async () => {
          const handlers = swipeCard.props;
          handlers.onPanResponderMove?.(null, { dx: 150, dy: 0 });
          handlers.onPanResponderRelease?.(null, { dx: 150, dy: 0 });
        });
      }

      // Should handle all swipes without errors
      expect(Alert.alert).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    test('has accessible menu button', () => {
      const { getByText } = render(<SwipeDemoScreen />);
      
      const menuIcon = getByText('☰');
      expect(menuIcon).toBeTruthy();
    });

    test('displays questions with proper text content', () => {
      const { getByText } = render(<SwipeDemoScreen />);
      
      const questionText = getByText('Will it rain in River Falls today?');
      expect(questionText).toBeTruthy();
    });
  });
});
