/**
 * Minimal SwipeCard test without test-utils
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import SwipeCard from '@/components/SwipeCard/SwipeCard';

// Simple test to verify component renders
describe('SwipeCard (minimal)', () => {
  test('renders without crashing', () => {
    const onSwipe = jest.fn();
    const { getByTestId } = render(
      <SwipeCard onSwipe={onSwipe} testID="swipe-card">
        <div>Test content</div>
      </SwipeCard>
    );
    
    expect(getByTestId('swipe-card')).toBeTruthy();
  });
});







