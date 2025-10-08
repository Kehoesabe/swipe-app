/**
 * Swipe Type Project - Turnkey Handoff
 * Complete design system with exact color palette and specifications
 */

export const Colors = {
  // Primary Brand Colors
  primary: '#A78BFA',        // Warm Purple - Primary Accent, CTA
  secondary: '#7DD3FC',      // Sky Blue - Secondary Accent, Links
  success: '#34D399',        // Lighter Green - Success, Positive Feedback
  highlight: '#FBBF24',      // Sunny Yellow - Highlights, Accents
  
  // Background & Surface Colors
  background: '#1A1A2E',     // Charcoal Black - Main Background
  card: '#2D3748',          // Light Charcoal - Card Backgrounds
  
  // Text Colors
  text: '#FFFFFF',          // Primary Text
  secondaryText: '#9BA5B4', // Warm Gray - Secondary Text, Disabled States
  
  // UI States
  border: '#4A5568',        // Subtle borders
  shadow: 'rgba(0,0,0,0.25)', // Card shadows
  overlay: 'rgba(0,0,0,0.5)',  // Modal overlays
};

export const Radii = { 
  xs: 8, 
  sm: 12, 
  md: 16, 
  lg: 24, 
  xl: 28, 
  pill: 999 
};

export const Space = { 
  xs: 8, 
  sm: 12, 
  md: 16, 
  lg: 24, 
  xl: 32, 
  xxl: 40 
};

// Typography System - Sans-serif like Inter or Plus Jakarta Sans
export const Typography = {
  h1: { 
    fontSize: 32, 
    lineHeight: 40, 
    fontWeight: '700' as const,
    fontFamily: 'Inter-Bold'
  },
  h2: { 
    fontSize: 24, 
    lineHeight: 32, 
    fontWeight: '600' as const,
    fontFamily: 'Inter-SemiBold'
  },
  body: { 
    fontSize: 16, 
    lineHeight: 24, 
    fontWeight: '400' as const,
    fontFamily: 'Inter-Regular'
  },
  caption: { 
    fontSize: 13, 
    lineHeight: 18, 
    fontWeight: '400' as const,
    fontFamily: 'Inter-Regular'
  },
};

// Spacing System - Consistent 8px grid
export const Spacing = {
  xs: 4,    // 0.25rem
  sm: 8,    // 0.5rem
  md: 16,   // 1rem
  lg: 24,   // 1.5rem
  xl: 32,   // 2rem
  xxl: 48,  // 3rem
  xxxl: 64, // 4rem
};
