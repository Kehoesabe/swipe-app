// constants/Colors.ts
// Unified color tokens with legacy alias for non-breaking upgrades.

export const Colors = {
  /** Surfaces */
  background: '#F6F7FB',
  surface: '#FFFFFF',
  backgroundSecondary: '#F0F2F5',

  /** Text */
  textPrimary: '#111111',
  textSecondary: '#666666',
  textTertiary: '#999999',

  /** Legacy alias (kept for compatibility) */
  text: '#111111', // alias of textPrimary — safe to remove once no longer used

  /** Brand Colors */
  primary: '#007AFF',
  secondary: '#34C759',
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',

  /** Borders */
  border: '#E5E5E7',
  borderLight: '#F2F2F7',

  /** Utility */
  white: '#FFFFFF',
  black: '#000000',

  /** Effects */
  shadow: 'rgba(0,0,0,0.25)',
} as const;

export type ColorKeys = keyof typeof Colors;

