/**
 * useProfile Hook Simple Tests
 * 
 * Tests for the useProfile custom hook functionality without complex async operations
 */
import { renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useProfile } from '@/hooks/useProfile';

// Mock Alert
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

describe('useProfile (Simple)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns initial state', () => {
    const { result } = renderHook(() => useProfile());

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.updating).toBe(false);
    expect(typeof result.current.updateProfile).toBe('function');
    expect(typeof result.current.uploadAvatar).toBe('function');
    expect(typeof result.current.refreshProfile).toBe('function');
  });

  test('handles update when no user is loaded', async () => {
    const { result } = renderHook(() => useProfile());

    // Don't wait for initial load, try to update immediately
    await result.current.updateProfile({ name: 'Test' });

    // Should not crash and should not call Alert
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  test('handles avatar upload when no user is loaded', async () => {
    const { result } = renderHook(() => useProfile());

    // Don't wait for initial load, try to upload immediately
    await result.current.uploadAvatar('https://example.com/avatar.jpg');

    // Should not crash and should not call Alert
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  test('hook functions are callable', () => {
    const { result } = renderHook(() => useProfile());

    // Test that functions exist and are callable
    expect(() => result.current.updateProfile({ name: 'Test' })).not.toThrow();
    expect(() => result.current.uploadAvatar('test.jpg')).not.toThrow();
    expect(() => result.current.refreshProfile()).not.toThrow();
  });
});


