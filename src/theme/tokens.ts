// src/theme/tokens.ts
export const Colors = {
  primary: '#A78BFA',        // Warm Purple (CTA, progress)
  secondary: '#7DD3FC',      // Sky Blue (links, accents)
  success: '#34D399',
  highlight: '#FBBF24',

  background: '#1A1A2E',     // App background (no white screens)
  card: '#2D3748',           // Question/utility cards
  text: '#FFFFFF',
  textMuted: '#9BA5B4',

  // Directional feedback (pending action). Only these use red/green:
  agree: '#22C55E',          // Slightly Agree (→)
  agreeStrong: '#16A34A',    // Strongly Agree (↑)
  disagree: '#9CA3AF',       // Slightly Disagree (←) neutral gray
  disagreeStrong: '#EF4444', // Strongly Disagree (↓)
};

export const Typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '600' as const, lineHeight: 30 },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
};

export const Spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32,
};

export const Radius = {
  lg: 24, xl: 28,
};

export const Motion = {
  commitMs: 250,
  progressMs: 400,
  easing: { // cubic-bezier(0.2, 0.8, 0.2, 1) approximation
    damping: 18, stiffness: 160, mass: 1,
  },
  hardPx: 140,
  softPx: 80,
  tiltMaxDeg: 8,
};