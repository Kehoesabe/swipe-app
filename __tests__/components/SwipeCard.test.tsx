/**
 * SwipeCard — gesture threshold & snapback tests
 *
 * Why we call pan handlers directly:
 * - Ideally we'd simulate real swipes, but React Native Testing Library
 *   cannot dispatch full PanResponder gesture sequences reliably.
 * - This pragmatic approach exercises the same event path that a user swipe
 *   triggers, validating threshold logic & callbacks.
 * - Documented exception to our "test behavior, not implementation" rule.
 *
 * If/when we add an on-device integration test, we can replace this with a true E2E swipe test.
 */
import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Animated } from 'react-native';
import SwipeCard, { SwipeResult } from '@/components/SwipeCard/SwipeCard';

// Make Animated complete immediately for deterministic tests
beforeAll(() => {
  jest.spyOn(Animated, 'timing').mockReturnValue({
    start: (cb?: Animated.EndCallback) => {
      cb?.({ finished: true } as any);
      return { stop: () => undefined } as any;
    },
  } as any);

  jest.spyOn(Animated, 'spring').mockReturnValue({
    start: (cb?: Animated.EndCallback) => {
      cb?.({ finished: true } as any);
      return { stop: () => undefined } as any;
    },
  } as any);
});

afterAll(() => {
  jest.restoreAllMocks();
});

const THRESHOLD = 100;

function getHandlers(el: any) {
  // Access the Animated.View props where panHandlers are spread.
  // This is the pragmatic escape hatch discussed above.
  return el.props;
}

describe('SwipeCard (gesture threshold & snapback)', () => {
  test('snapbacks when drag is under threshold (horizontal)', () => {
    const onSwipe = jest.fn();
    const { getByTestId } = render(
      <SwipeCard onSwipe={onSwipe} threshold={THRESHOLD} testID="swipe-card" />
    );
    const card = getByTestId('swipe-card');
    const handlers = getHandlers(card);

    act(() => {
      handlers.onPanResponderMove?.(null, { dx: 50, dy: 0 });
      handlers.onPanResponderRelease?.(null, { dx: 50, dy: 0 });
    });

    expect(onSwipe).not.toHaveBeenCalled();
  });

  test('calls "Yes" for right swipe beyond threshold', () => {
    const onSwipe = jest.fn();
    const { getByTestId } = render(
      <SwipeCard onSwipe={onSwipe} threshold={THRESHOLD} testID="swipe-card" />
    );
    const card = getByTestId('swipe-card');
    const handlers = getHandlers(card);

    act(() => {
      handlers.onPanResponderMove?.(null, { dx: 150, dy: 0 });
      handlers.onPanResponderRelease?.(null, { dx: 150, dy: 0 });
    });

    expect(onSwipe).toHaveBeenCalledWith<'Yes'>('Yes' as SwipeResult);
  });

  test('calls "No" for left swipe beyond threshold', () => {
    const onSwipe = jest.fn();
    const { getByTestId } = render(
      <SwipeCard onSwipe={onSwipe} threshold={THRESHOLD} testID="swipe-card" />
    );
    const card = getByTestId('swipe-card');
    const handlers = getHandlers(card);

    act(() => {
      handlers.onPanResponderMove?.(null, { dx: -150, dy: 0 });
      handlers.onPanResponderRelease?.(null, { dx: -150, dy: 0 });
    });

    expect(onSwipe).toHaveBeenCalledWith<'No'>('No' as SwipeResult);
  });

  test('calls "YES!" for up swipe beyond threshold', () => {
    const onSwipe = jest.fn();
    const { getByTestId } = render(
      <SwipeCard onSwipe={onSwipe} threshold={THRESHOLD} testID="swipe-card" />
    );
    const card = getByTestId('swipe-card');
    const handlers = getHandlers(card);

    act(() => {
      handlers.onPanResponderMove?.(null, { dx: 0, dy: -150 });
      handlers.onPanResponderRelease?.(null, { dx: 0, dy: -150 });
    });

    expect(onSwipe).toHaveBeenCalledWith<'YES!'>('YES!' as SwipeResult);
  });

  test('calls "NO!" for down swipe beyond threshold', () => {
    const onSwipe = jest.fn();
    const { getByTestId } = render(
      <SwipeCard onSwipe={onSwipe} threshold={THRESHOLD} testID="swipe-card" />
    );
    const card = getByTestId('swipe-card');
    const handlers = getHandlers(card);

    act(() => {
      handlers.onPanResponderMove?.(null, { dx: 0, dy: 150 });
      handlers.onPanResponderRelease?.(null, { dx: 0, dy: 150 });
    });

    expect(onSwipe).toHaveBeenCalledWith<'NO!'>('NO!' as SwipeResult);
  });
});





