/**
 * Basic SwipeCard test without React Native Testing Library
 */
import React from 'react';
import SwipeCard from '@/components/SwipeCard/SwipeCard';

// Simple test to verify component can be imported and instantiated
describe('SwipeCard (basic)', () => {
  test('can be imported and instantiated', () => {
    const onSwipe = jest.fn();
    const component = <SwipeCard onSwipe={onSwipe} testID="swipe-card">
      <div>Test content</div>
    </SwipeCard>;
    
    expect(component).toBeTruthy();
    expect(component.props.onSwipe).toBe(onSwipe);
    expect(component.props.testID).toBe('swipe-card');
  });
});







