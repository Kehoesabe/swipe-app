/**
 * Theme Provider - Swipe Type Assessment App
 * Context provider for theme switching and design tokens
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { tokens, lightTheme, darkTheme, Theme } from './tokens';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
  tokens: typeof tokens;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: 'light' | 'dark' | 'system';
}

export function ThemeProvider({ children, initialTheme = 'system' }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (initialTheme === 'system') {
      return Appearance.getColorScheme() === 'dark';
    }
    return initialTheme === 'dark';
  });

  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
      if (initialTheme === 'system') {
        setIsDark(colorScheme === 'dark');
      }
    });

    return () => subscription?.remove();
  }, [initialTheme]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const setTheme = (dark: boolean) => {
    setIsDark(dark);
  };

  const theme = isDark ? darkTheme : lightTheme;

  const contextValue: ThemeContextType = {
    theme,
    isDark,
    toggleTheme,
    setTheme,
    tokens: tokens as typeof tokens,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook for accessing just the theme object
export function useThemeColors() {
  const { theme } = useTheme();
  return theme.colors;
}

// Hook for accessing design tokens
export function useTokens() {
  const { tokens } = useTheme();
  return tokens;
}

// Utility function to get theme-aware styles
export function createThemedStyles<T>(
  styleCreator: (theme: Theme, tokens: typeof tokens) => T
) {
  return styleCreator;
}
