import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { User, ProfileUpdateRequest, AvatarUploadResponse } from '@/types/profile';

interface UseProfileReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  updateProfile: (data: ProfileUpdateRequest) => Promise<void>;
  uploadAvatar: (imageUri: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock API call - replace with actual API
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: undefined,
        bio: 'Software developer passionate about mobile apps',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(mockUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: ProfileUpdateRequest) => {
    if (!user) return;

    try {
      setUpdating(true);
      setError(null);

      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser: User = {
        ...user,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      setUser(updatedUser);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      console.error('Error updating profile:', err);
    } finally {
      setUpdating(false);
    }
  }, [user]);

  const uploadAvatar = useCallback(async (imageUri: string) => {
    if (!user) return;

    try {
      setUpdating(true);
      setError(null);

      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const updatedUser: User = {
        ...user,
        avatar: imageUri,
        updatedAt: new Date().toISOString(),
      };

      setUser(updatedUser);
      Alert.alert('Success', 'Avatar updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload avatar';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      console.error('Error uploading avatar:', err);
    } finally {
      setUpdating(false);
    }
  }, [user]);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    user,
    loading,
    error,
    updating,
    updateProfile,
    uploadAvatar,
    refreshProfile,
  };
};










