import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockReset = jest.fn();

export const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  reset: mockReset,
  canGoBack: jest.fn(() => true),
  isFocused: jest.fn(() => true),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  dispatch: jest.fn(),
  setParams: jest.fn(),
  setOptions: jest.fn(),
};

// Mock navigation hook
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
  useRoute: () => ({
    params: {},
    key: 'test-key',
    name: 'TestScreen',
  }),
}));

// Mock SafeAreaView
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children, ...props }) => {
    const { View } = require('react-native');
    return <View {...props}>{children}</View>;
  },
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

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
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Alert: {
    alert: jest.fn(),
  },
}));

// Custom render function with navigation
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  navigation?: any;
}

export const renderWithNavigation = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { navigation = mockNavigation, ...renderOptions } = options;

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <NavigationContainer>
      {children}
    </NavigationContainer>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock user data for testing
export const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Software developer',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

// Mock profile form data
export const mockProfileFormData = {
  name: 'John Doe',
  bio: 'Software developer',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
};

// Helper to create mock navigation params
export const createMockRoute = (params: any = {}) => ({
  params,
  key: 'test-key',
  name: 'TestScreen',
});

// Helper to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// Mock console methods to avoid noise in tests
export const mockConsole = () => {
  const originalConsole = { ...console };
  
  beforeEach(() => {
    console.error = jest.fn();
    console.warn = jest.fn();
    console.log = jest.fn();
  });

  afterEach(() => {
    Object.assign(console, originalConsole);
  });
};

// Export everything
export * from '@testing-library/react-native';
export { renderWithNavigation as render };
