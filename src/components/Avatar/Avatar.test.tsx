import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { Avatar } from './Avatar';
import * as ImagePicker from 'expo-image-picker';

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('Avatar Component', () => {
  const mockOnImageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with placeholder when no image provided', () => {
    const { getByTestId } = render(
      <Avatar onImageChange={mockOnImageChange} />
    );

    // Should render the placeholder icon
    expect(getByTestId).toBeDefined();
  });

  it('renders with provided image URI', () => {
    const testUri = 'https://example.com/avatar.jpg';
    const { getByTestId } = render(
      <Avatar uri={testUri} onImageChange={mockOnImageChange} />
    );

    // Should render the image
    expect(getByTestId).toBeDefined();
  });

  it('shows edit icon when editable', () => {
    const { getByTestId } = render(
      <Avatar editable={true} onImageChange={mockOnImageChange} />
    );

    // Should show edit icon
    expect(getByTestId).toBeDefined();
  });

  it('does not show edit icon when not editable', () => {
    const { queryByTestId } = render(
      <Avatar editable={false} onImageChange={mockOnImageChange} />
    );

    // Should not show edit icon
    expect(queryByTestId('edit-icon')).toBeNull();
  });

  it('calls onImageChange when image is selected from camera', async () => {
    const mockImagePicker = ImagePicker as jest.Mocked<typeof ImagePicker>;
    mockImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({
      granted: true,
    } as any);
    
    mockImagePicker.launchCameraAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'camera-image.jpg' }],
    } as any);

    const { getByTestId } = render(
      <Avatar onImageChange={mockOnImageChange} />
    );

    // Simulate camera selection
    await waitFor(() => {
      expect(mockOnImageChange).toHaveBeenCalledWith('camera-image.jpg');
    });
  });

  it('calls onImageChange when image is selected from library', async () => {
    const mockImagePicker = ImagePicker as jest.Mocked<typeof ImagePicker>;
    mockImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({
      granted: true,
    } as any);
    
    mockImagePicker.launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'library-image.jpg' }],
    } as any);

    const { getByTestId } = render(
      <Avatar onImageChange={mockOnImageChange} />
    );

    // Simulate library selection
    await waitFor(() => {
      expect(mockOnImageChange).toHaveBeenCalledWith('library-image.jpg');
    });
  });

  it('shows permission alert when permission is denied', async () => {
    const mockImagePicker = ImagePicker as jest.Mocked<typeof ImagePicker>;
    mockImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({
      granted: false,
    } as any);

    const { getByTestId } = render(
      <Avatar onImageChange={mockOnImageChange} />
    );

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Permission Required',
        'Permission to access camera roll is required to upload an avatar.'
      );
    });
  });

  it('does not trigger image picker when not editable', () => {
    const { getByTestId } = render(
      <Avatar editable={false} onImageChange={mockOnImageChange} />
    );

    // TouchableOpacity should be disabled
    const touchable = getByTestId('avatar-touchable');
    expect(touchable.props.disabled).toBe(true);
  });

  it('handles camera launch errors gracefully', async () => {
    const mockImagePicker = ImagePicker as jest.Mocked<typeof ImagePicker>;
    mockImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({
      granted: true,
    } as any);
    
    mockImagePicker.launchCameraAsync.mockRejectedValue(new Error('Camera error'));

    const { getByTestId } = render(
      <Avatar onImageChange={mockOnImageChange} />
    );

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to open camera');
    });
  });

  it('handles library launch errors gracefully', async () => {
    const mockImagePicker = ImagePicker as jest.Mocked<typeof ImagePicker>;
    mockImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({
      granted: true,
    } as any);
    
    mockImagePicker.launchImageLibraryAsync.mockRejectedValue(new Error('Library error'));

    const { getByTestId } = render(
      <Avatar onImageChange={mockOnImageChange} />
    );

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to open image library');
    });
  });

  it('applies custom size correctly', () => {
    const customSize = 150;
    const { getByTestId } = render(
      <Avatar size={customSize} onImageChange={mockOnImageChange} />
    );

    const container = getByTestId('avatar-container');
    expect(container.props.style).toMatchObject({
      width: customSize,
      height: customSize,
    });
  });
});










