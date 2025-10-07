import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { HelloUserScreen } from './HelloUserScreen';
import { renderWithNavigation, mockNavigation } from '@/test-utils';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

describe('HelloUserScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    const { getByText } = renderWithNavigation(<HelloUserScreen />);
    
    expect(getByText('Loading user data...')).toBeTruthy();
  });

  it('renders user greeting after loading', async () => {
    const { getByText } = renderWithNavigation(<HelloUserScreen />);
    
    await waitFor(() => {
      expect(getByText('Hello, John Doe!')).toBeTruthy();
    });
  });

  it('displays welcome message and features', async () => {
    const { getByText } = renderWithNavigation(<HelloUserScreen />);
    
    await waitFor(() => {
      expect(getByText('Welcome to your personalized dashboard')).toBeTruthy();
      expect(getByText('Profile management')).toBeTruthy();
      expect(getByText('Secure authentication')).toBeTruthy();
      expect(getByText('Cross-platform support')).toBeTruthy();
    });
  });

  it('navigates to profile when View Profile button is pressed', async () => {
    const { getByText } = renderWithNavigation(<HelloUserScreen />);
    
    await waitFor(() => {
      expect(getByText('View Profile')).toBeTruthy();
    });
    
    fireEvent.press(getByText('View Profile'));
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('UserProfile');
  });

  it('navigates back when Back to Home button is pressed', async () => {
    const { getByText } = renderWithNavigation(<HelloUserScreen />);
    
    await waitFor(() => {
      expect(getByText('Back to Home')).toBeTruthy();
    });
    
    fireEvent.press(getByText('Back to Home'));
    
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('has proper accessibility labels', async () => {
    const { getByLabelText } = renderWithNavigation(<HelloUserScreen />);
    
    await waitFor(() => {
      expect(getByLabelText('Go back')).toBeTruthy();
      expect(getByLabelText('View your profile')).toBeTruthy();
      expect(getByLabelText('Go back to home')).toBeTruthy();
    });
  });

  it('shows back button in header', async () => {
    const { getByLabelText } = renderWithNavigation(<HelloUserScreen />);
    
    await waitFor(() => {
      const backButton = getByLabelText('Go back');
      expect(backButton).toBeTruthy();
    });
  });

  it('handles back button press', async () => {
    const { getByLabelText } = renderWithNavigation(<HelloUserScreen />);
    
    await waitFor(() => {
      const backButton = getByLabelText('Go back');
      fireEvent.press(backButton);
      
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  it('displays user name in greeting', async () => {
    const { getByText } = renderWithNavigation(<HelloUserScreen />);
    
    await waitFor(() => {
      expect(getByText('Hello, John Doe!')).toBeTruthy();
    });
  });

  it('shows feature list with checkmarks', async () => {
    const { getByText } = renderWithNavigation(<HelloUserScreen />);
    
    await waitFor(() => {
      // Check that all features are displayed
      expect(getByText('Profile management')).toBeTruthy();
      expect(getByText('Secure authentication')).toBeTruthy();
      expect(getByText('Cross-platform support')).toBeTruthy();
    });
  });

  it('has proper button accessibility roles', async () => {
    const { getByText } = renderWithNavigation(<HelloUserScreen />);
    
    await waitFor(() => {
      const viewProfileButton = getByText('View Profile');
      const backButton = getByText('Back to Home');
      
      expect(viewProfileButton.props.accessibilityRole).toBe('button');
      expect(backButton.props.accessibilityRole).toBe('button');
    });
  });

  it('handles loading state correctly', () => {
    const { getByText, queryByText } = renderWithNavigation(<HelloUserScreen />);
    
    // Should show loading initially
    expect(getByText('Loading user data...')).toBeTruthy();
    expect(queryByText('Hello, John Doe!')).toBeNull();
  });

  it('transitions from loading to content', async () => {
    const { getByText, queryByText } = renderWithNavigation(<HelloUserScreen />);
    
    // Initially loading
    expect(getByText('Loading user data...')).toBeTruthy();
    
    // After loading completes
    await waitFor(() => {
      expect(getByText('Hello, John Doe!')).toBeTruthy();
      expect(queryByText('Loading user data...')).toBeNull();
    });
  });
});






