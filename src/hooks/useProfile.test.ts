import { renderHook, act, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useProfile } from './useProfile';
import { User, ProfileUpdateRequest } from '@/types/profile';

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('useProfile Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error to avoid noise in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns initial state correctly', () => {
    const { result } = renderHook(() => useProfile());

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.updating).toBe(false);
    expect(typeof result.current.updateProfile).toBe('function');
    expect(typeof result.current.uploadAvatar).toBe('function');
    expect(typeof result.current.refreshProfile).toBe('function');
  });

  it('loads user profile successfully', async () => {
    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: undefined,
      bio: 'Software developer passionate about mobile apps',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    });
    expect(result.current.error).toBeNull();
  });

  it('updates profile successfully', async () => {
    const { result } = renderHook(() => useProfile());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const updateData: ProfileUpdateRequest = {
      name: 'Jane Doe',
      bio: 'Updated bio',
    };

    await act(async () => {
      await result.current.updateProfile(updateData);
    });

    expect(result.current.user?.name).toBe('Jane Doe');
    expect(result.current.user?.bio).toBe('Updated bio');
    expect(result.current.user?.updatedAt).not.toBe('2024-01-01T00:00:00Z');
    expect(Alert.alert).toHaveBeenCalledWith('Success', 'Profile updated successfully');
  });

  it('uploads avatar successfully', async () => {
    const { result } = renderHook(() => useProfile());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const imageUri = 'https://example.com/new-avatar.jpg';

    await act(async () => {
      await result.current.uploadAvatar(imageUri);
    });

    expect(result.current.user?.avatar).toBe(imageUri);
    expect(result.current.user?.updatedAt).not.toBe('2024-01-01T00:00:00Z');
    expect(Alert.alert).toHaveBeenCalledWith('Success', 'Avatar updated successfully');
  });

  it('handles profile update errors', async () => {
    // Mock console.error to avoid noise
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useProfile());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Mock a scenario where update fails
    const originalUpdateProfile = result.current.updateProfile;
    result.current.updateProfile = jest.fn().mockRejectedValue(new Error('Update failed'));

    await act(async () => {
      try {
        await result.current.updateProfile({ name: 'New Name' });
      } catch (error) {
        // Expected to throw
      }
    });

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Update failed');
    expect(consoleSpy).toHaveBeenCalledWith('Error updating profile:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('handles avatar upload errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useProfile());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Mock a scenario where upload fails
    const originalUploadAvatar = result.current.uploadAvatar;
    result.current.uploadAvatar = jest.fn().mockRejectedValue(new Error('Upload failed'));

    await act(async () => {
      try {
        await result.current.uploadAvatar('test-image.jpg');
      } catch (error) {
        // Expected to throw
      }
    });

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Upload failed');
    expect(consoleSpy).toHaveBeenCalledWith('Error uploading avatar:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('sets updating state correctly during operations', async () => {
    const { result } = renderHook(() => useProfile());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Test updateProfile updating state
    const updatePromise = act(async () => {
      await result.current.updateProfile({ name: 'New Name' });
    });

    expect(result.current.updating).toBe(true);

    await updatePromise;

    expect(result.current.updating).toBe(false);
  });

  it('refreshes profile data', async () => {
    const { result } = renderHook(() => useProfile());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialUser = result.current.user;

    await act(async () => {
      await result.current.refreshProfile();
    });

    // Should have the same user data (mocked)
    expect(result.current.user).toEqual(initialUser);
  });

  it('does not update profile when user is null', async () => {
    const { result } = renderHook(() => useProfile());

    // Don't wait for load, try to update immediately
    await act(async () => {
      await result.current.updateProfile({ name: 'New Name' });
    });

    // Should not have called Alert.alert for success
    expect(Alert.alert).not.toHaveBeenCalledWith('Success', 'Profile updated successfully');
  });

  it('does not upload avatar when user is null', async () => {
    const { result } = renderHook(() => useProfile());

    // Don't wait for load, try to upload immediately
    await act(async () => {
      await result.current.uploadAvatar('test-image.jpg');
    });

    // Should not have called Alert.alert for success
    expect(Alert.alert).not.toHaveBeenCalledWith('Success', 'Avatar updated successfully');
  });

  it('handles network errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock fetch to throw an error
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.user).toBeNull();

    consoleSpy.mockRestore();
  });
});
