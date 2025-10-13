import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { UserCard } from './UserCard';
import { Colors } from '@/constants';

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://example.com/avatar.jpg',
};

const mockUserWithoutAvatar = {
  id: '2',
  name: 'Jane Smith',
  email: 'jane@example.com',
};

describe('UserCard Component', () => {
  it('renders with user data correctly', () => {
    const { getByText, getByTestId } = render(
      <UserCard user={mockUser} />
    );

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('john@example.com')).toBeTruthy();
    expect(getByTestId('user-card')).toBeTruthy();
  });

  it('renders with avatar image when provided', () => {
    const { getByLabelText } = render(
      <UserCard user={mockUser} />
    );

    expect(getByLabelText("John Doe's profile picture")).toBeTruthy();
  });

  it('renders placeholder avatar when no avatar provided', () => {
    const { getByLabelText } = render(
      <UserCard user={mockUserWithoutAvatar} />
    );

    expect(getByLabelText('Default profile picture')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <UserCard user={mockUser} onPress={mockOnPress} />
    );

    fireEvent.press(getByTestId('user-card'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <UserCard user={mockUser} onPress={mockOnPress} disabled={true} />
    );

    fireEvent.press(getByTestId('user-card'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('renders as TouchableOpacity when onPress is provided', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <UserCard user={mockUser} onPress={mockOnPress} />
    );

    const touchable = getByTestId('user-card');
    expect(touchable.type).toBe('TouchableOpacity');
  });

  it('renders as View when no onPress is provided', () => {
    const { getByTestId } = render(
      <UserCard user={mockUser} />
    );

    const view = getByTestId('user-card');
    expect(view.type).toBe('View');
  });

  it('applies disabled styles when disabled', () => {
    const { getByTestId } = render(
      <UserCard user={mockUser} disabled={true} />
    );

    const container = getByTestId('user-card');
    expect(container.props.style).toContainEqual(
      expect.objectContaining({ opacity: 0.5 })
    );
  });

  describe('Variants', () => {
    it('renders default variant correctly', () => {
      const { getByText } = render(
        <UserCard user={mockUser} variant="default" />
      );

      expect(getByText('John Doe')).toBeTruthy();
      expect(getByText('john@example.com')).toBeTruthy();
    });

    it('renders compact variant correctly', () => {
      const { getByText } = render(
        <UserCard user={mockUser} variant="compact" />
      );

      expect(getByText('John Doe')).toBeTruthy();
      expect(getByText('john@example.com')).toBeTruthy();
    });

    it('renders detailed variant correctly', () => {
      const { getByText } = render(
        <UserCard user={mockUser} variant="detailed" />
      );

      expect(getByText('John Doe')).toBeTruthy();
      expect(getByText('john@example.com')).toBeTruthy();
      expect(getByText('ID: 1')).toBeTruthy();
    });
  });

  describe('Email Display', () => {
    it('shows email by default', () => {
      const { getByText } = render(
        <UserCard user={mockUser} />
      );

      expect(getByText('john@example.com')).toBeTruthy();
    });

    it('hides email when showEmail is false', () => {
      const { queryByText } = render(
        <UserCard user={mockUser} showEmail={false} />
      );

      expect(queryByText('john@example.com')).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility labels for touchable', () => {
      const mockOnPress = jest.fn();
      const { getByLabelText } = render(
        <UserCard user={mockUser} onPress={mockOnPress} />
      );

      expect(getByLabelText("View John Doe's profile")).toBeTruthy();
    });

    it('has correct accessibility labels for non-touchable', () => {
      const { getByLabelText } = render(
        <UserCard user={mockUser} />
      );

      expect(getByLabelText('User card for John Doe')).toBeTruthy();
    });

    it('has correct accessibility hint for touchable', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <UserCard user={mockUser} onPress={mockOnPress} />
      );

      const touchable = getByTestId('user-card');
      expect(touchable.props.accessibilityHint).toBe('Double tap to view user details');
    });

    it('has correct accessibility role for touchable', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <UserCard user={mockUser} onPress={mockOnPress} />
      );

      const touchable = getByTestId('user-card');
      expect(touchable.props.accessibilityRole).toBe('button');
    });
  });

  describe('Text Truncation', () => {
    it('truncates long names', () => {
      const longNameUser = {
        ...mockUser,
        name: 'This is a very long name that should be truncated',
      };

      const { getByText } = render(
        <UserCard user={longNameUser} />
      );

      const nameText = getByText(longNameUser.name);
      expect(nameText.props.numberOfLines).toBe(1);
    });

    it('truncates long emails', () => {
      const longEmailUser = {
        ...mockUser,
        email: 'this.is.a.very.long.email.address@example.com',
      };

      const { getByText } = render(
        <UserCard user={longEmailUser} />
      );

      const emailText = getByText(longEmailUser.email);
      expect(emailText.props.numberOfLines).toBe(1);
    });
  });

  describe('Custom TestID', () => {
    it('uses custom testID when provided', () => {
      const { getByTestId } = render(
        <UserCard user={mockUser} testID="custom-user-card" />
      );

      expect(getByTestId('custom-user-card')).toBeTruthy();
    });
  });

  describe('Chevron Icon', () => {
    it('shows chevron icon when onPress is provided', () => {
      const mockOnPress = jest.fn();
      const { getByLabelText } = render(
        <UserCard user={mockUser} onPress={mockOnPress} />
      );

      expect(getByLabelText('View user details')).toBeTruthy();
    });

    it('does not show chevron icon when no onPress', () => {
      const { queryByLabelText } = render(
        <UserCard user={mockUser} />
      );

      expect(queryByLabelText('View user details')).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty name gracefully', () => {
      const emptyNameUser = {
        ...mockUser,
        name: '',
      };

      const { getByTestId } = render(
        <UserCard user={emptyNameUser} />
      );

      expect(getByTestId('user-card')).toBeTruthy();
    });

    it('handles empty email gracefully', () => {
      const emptyEmailUser = {
        ...mockUser,
        email: '',
      };

      const { getByTestId } = render(
        <UserCard user={emptyEmailUser} />
      );

      expect(getByTestId('user-card')).toBeTruthy();
    });
  });
});








