import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

// Mock the navigation to avoid issues
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: ({ children }: { children: React.ReactNode }) => children,
  }),
}));

describe('App', () => {
  test('renders without crashing', () => {
    expect(() => render(<App />)).not.toThrow();
  });
});
