/**
 * useProfile Hook Tests
 * 
 * Tests for the useProfile custom hook functionality
 */
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useProfile } from '@/hooks/useProfile';

// Mock Alert
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

describe('useProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
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

  test('loads user profile on mount', async () => {
    const { result } = renderHook(() => useProfile());

    // Fast-forward timers to complete the async operation
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeDefined();
    expect(result.current.user?.name).toBe('John Doe');
    expect(result.current.user?.email).toBe('john@example.com');
    expect(result.current.error).toBeNull();
  });

  test('handles profile update', async () => {
    const { result } = renderHook(() => useProfile());

    // Wait for initial load
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(result.current.user).toBeDefined();
    });

    const updateData = {
      name: 'Jane Doe',
      bio: 'Updated bio',
    };

    await act(async () => {
      await result.current.updateProfile(updateData);
    });

    // Fast-forward timers for update operation
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(result.current.updating).toBe(false);
    });

    expect(result.current.user?.name).toBe('Jane Doe');
    expect(result.current.user?.bio).toBe('Updated bio');
    expect(Alert.alert).toHaveBeenCalledWith('Success', 'Profile updated successfully');
  });

  test('handles avatar upload', async () => {
    const { result } = renderHook(() => useProfile());

    // Wait for initial load
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(result.current.user).toBeDefined();
    });

    const imageUri = 'https://example.com/new-avatar.jpg';

    await act(async () => {
      await result.current.uploadAvatar(imageUri);
    });

    // Fast-forward timers for upload operation
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    await waitFor(() => {
      expect(result.current.updating).toBe(false);
    });

    expect(result.current.user?.avatar).toBe(imageUri);
    expect(Alert.alert).toHaveBeenCalledWith('Success', 'Avatar updated successfully');
  });

  test('handles refresh profile', async () => {
    const { result } = renderHook(() => useProfile());

    // Wait for initial load
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(result.current.user).toBeDefined();
    });

    // Call refresh
    await act(async () => {
      await result.current.refreshProfile();
    });

    // Fast-forward timers for refresh operation
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeDefined();
  });

  test('handles update when no user is loaded', async () => {
    const { result } = renderHook(() => useProfile());

    // Don't wait for initial load, try to update immediately
    await act(async () => {
      await result.current.updateProfile({ name: 'Test' });
    });

    // Should not crash and should not call Alert
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  test('handles avatar upload when no user is loaded', async () => {
    const { result } = renderHook(() => useProfile());

    // Don't wait for initial load, try to upload immediately
    await act(async () => {
      await result.current.uploadAvatar('https://example.com/avatar.jpg');
    });

    // Should not crash and should not call Alert
    expect(Alert.alert).not.toHaveBeenCalled();
  });
});
