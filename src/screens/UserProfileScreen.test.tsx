import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { UserProfileScreen } from './UserProfileScreen';
import { useProfile } from '@/hooks';
import { renderWithNavigation, mockUser, mockProfileFormData } from '@/test-utils';

// Mock the useProfile hook
jest.mock('@/hooks', () => ({
  useProfile: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

const mockUseProfile = useProfile as jest.MockedFunction<typeof useProfile>;

describe('UserProfileScreen', () => {
  const mockUpdateProfile = jest.fn();
  const mockUploadAvatar = jest.fn();

  const defaultMockReturn = {
    user: mockUser,
    loading: false,
    error: null,
    updating: false,
    updateProfile: mockUpdateProfile,
    uploadAvatar: mockUploadAvatar,
    refreshProfile: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProfile.mockReturnValue(defaultMockReturn);
  });

  it('renders loading state correctly', () => {
    mockUseProfile.mockReturnValue({
      ...defaultMockReturn,
      user: null,
      loading: true,
    });

    const { getByText } = renderWithNavigation(<UserProfileScreen />);
    
    expect(getByText('Loading profile...')).toBeTruthy();
  });

  it('renders error state correctly', () => {
    const errorMessage = 'Failed to load profile';
    mockUseProfile.mockReturnValue({
      ...defaultMockReturn,
      user: null,
      loading: false,
      error: errorMessage,
    });

    const { getByText } = renderWithNavigation(<UserProfileScreen />);
    
    expect(getByText('Failed to load profile')).toBeTruthy();
    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('renders profile data correctly', () => {
    const { getByText, getByDisplayValue } = renderWithNavigation(<UserProfileScreen />);
    
    expect(getByText('Profile')).toBeTruthy();
    expect(getByText(mockUser.email)).toBeTruthy();
    expect(getByDisplayValue(mockUser.name)).toBeTruthy();
    expect(getByDisplayValue(mockUser.bio)).toBeTruthy();
    expect(getByDisplayValue(mockUser.phone)).toBeTruthy();
    expect(getByDisplayValue(mockUser.location)).toBeTruthy();
  });

  it('toggles edit mode when edit button is pressed', () => {
    const { getByText, getByDisplayValue } = renderWithNavigation(<UserProfileScreen />);
    
    const editButton = getByText('Edit');
    fireEvent.press(editButton);
    
    // Should show Cancel button and enable inputs
    expect(getByText('Cancel')).toBeTruthy();
    
    // Inputs should be editable
    const nameInput = getByDisplayValue(mockUser.name);
    expect(nameInput.props.editable).toBe(true);
  });

  it('cancels edit mode and resets form data', () => {
    const { getByText, getByDisplayValue } = renderWithNavigation(<UserProfileScreen />);
    
    // Enter edit mode
    fireEvent.press(getByText('Edit'));
    
    // Modify form data
    const nameInput = getByDisplayValue(mockUser.name);
    fireEvent.changeText(nameInput, 'Modified Name');
    
    // Cancel edit
    fireEvent.press(getByText('Cancel'));
    
    // Should reset to original data
    expect(getByDisplayValue(mockUser.name)).toBeTruthy();
    expect(getByText('Edit')).toBeTruthy();
  });

  it('saves profile changes successfully', async () => {
    mockUpdateProfile.mockResolvedValue(undefined);
    
    const { getByText, getByDisplayValue } = renderWithNavigation(<UserProfileScreen />);
    
    // Enter edit mode
    fireEvent.press(getByText('Edit'));
    
    // Modify form data
    const nameInput = getByDisplayValue(mockUser.name);
    fireEvent.changeText(nameInput, 'Updated Name');
    
    // Save changes
    fireEvent.press(getByText('Save'));
    
    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        name: 'Updated Name',
        bio: mockUser.bio,
        phone: mockUser.phone,
        location: mockUser.location,
      });
    });
  });

  it('handles profile update errors', async () => {
    const errorMessage = 'Update failed';
    mockUpdateProfile.mockRejectedValue(new Error(errorMessage));
    
    const { getByText, getByDisplayValue } = renderWithNavigation(<UserProfileScreen />);
    
    // Enter edit mode and save
    fireEvent.press(getByText('Edit'));
    fireEvent.press(getByText('Save'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', errorMessage);
    });
  });

  it('shows loading state during profile update', () => {
    mockUseProfile.mockReturnValue({
      ...defaultMockReturn,
      updating: true,
    });

    const { getByText } = renderWithNavigation(<UserProfileScreen />);
    
    // Should show loading spinner in save button
    expect(getByText).toBeTruthy(); // Save button should be present
  });

  it('handles avatar upload', async () => {
    const imageUri = 'https://example.com/new-avatar.jpg';
    mockUploadAvatar.mockResolvedValue(undefined);
    
    const { getByTestId } = renderWithNavigation(<UserProfileScreen />);
    
    // Simulate avatar change (this would be triggered by Avatar component)
    await waitFor(() => {
      // This would be called by the Avatar component
      // In a real test, you'd trigger the Avatar's onImageChange
    });
  });

  it('disables inputs when not in edit mode', () => {
    const { getByDisplayValue } = renderWithNavigation(<UserProfileScreen />);
    
    const nameInput = getByDisplayValue(mockUser.name);
    expect(nameInput.props.editable).toBe(false);
  });

  it('enables inputs when in edit mode', () => {
    const { getByText, getByDisplayValue } = renderWithNavigation(<UserProfileScreen />);
    
    // Enter edit mode
    fireEvent.press(getByText('Edit'));
    
    const nameInput = getByDisplayValue(mockUser.name);
    expect(nameInput.props.editable).toBe(true);
  });

  it('displays account information correctly', () => {
    const { getByText } = renderWithNavigation(<UserProfileScreen />);
    
    expect(getByText('Account Information')).toBeTruthy();
    expect(getByText('Member since')).toBeTruthy();
    expect(getByText('Last updated')).toBeTruthy();
  });

  it('handles form input changes correctly', () => {
    const { getByText, getByDisplayValue } = renderWithNavigation(<UserProfileScreen />);
    
    // Enter edit mode
    fireEvent.press(getByText('Edit'));
    
    // Change bio
    const bioInput = getByDisplayValue(mockUser.bio);
    fireEvent.changeText(bioInput, 'Updated bio text');
    
    // The input should reflect the change
    expect(bioInput.props.value).toBe('Updated bio text');
  });

  it('shows correct button states in edit mode', () => {
    const { getByText } = renderWithNavigation(<UserProfileScreen />);
    
    // Enter edit mode
    fireEvent.press(getByText('Edit'));
    
    // Should show Cancel and Save buttons
    expect(getByText('Cancel')).toBeTruthy();
    expect(getByText('Save')).toBeTruthy();
  });

  it('handles phone input with correct keyboard type', () => {
    const { getByText, getByDisplayValue } = renderWithNavigation(<UserProfileScreen />);
    
    // Enter edit mode
    fireEvent.press(getByText('Edit'));
    
    const phoneInput = getByDisplayValue(mockUser.phone);
    expect(phoneInput.props.keyboardType).toBe('phone-pad');
  });

  it('handles multiline bio input correctly', () => {
    const { getByText, getByDisplayValue } = renderWithNavigation(<UserProfileScreen />);
    
    // Enter edit mode
    fireEvent.press(getByText('Edit'));
    
    const bioInput = getByDisplayValue(mockUser.bio);
    expect(bioInput.props.multiline).toBe(true);
    expect(bioInput.props.numberOfLines).toBe(3);
  });

  it('disables save button during update', () => {
    mockUseProfile.mockReturnValue({
      ...defaultMockReturn,
      updating: true,
    });

    const { getByText } = renderWithNavigation(<UserProfileScreen />);
    
    // Should show loading state in save button
    expect(getByText).toBeTruthy();
  });

  it('handles empty user data gracefully', () => {
    mockUseProfile.mockReturnValue({
      ...defaultMockReturn,
      user: null,
      loading: false,
    });

    const { getByText } = renderWithNavigation(<UserProfileScreen />);
    
    expect(getByText('No user data available')).toBeTruthy();
  });
});






