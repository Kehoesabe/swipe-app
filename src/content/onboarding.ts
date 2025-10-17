// src/content/onboarding.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

export const ONBOARDING_FLAG = 'hasSeenOnboarding';

export type OnboardingStep = {
  id: string;
  title: string;
  subtitle?: string;
  body?: string;
  illustration?: string; // asset path or Lottie key
  ctaLabel?: string;
  secondaryCtaLabel?: string;
  skippable?: boolean;
  analyticsTag?: string;
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Discover Your Swipe Type',
    subtitle: '57 quick swipes. 5–7 minutes. Big aha moments.',
    body:
      "Find the relationship patterns that actually drive your connections—so you can date and love with more clarity.",
    illustration: 'illust_welcome',
    ctaLabel: 'Get Started',
    secondaryCtaLabel: 'How it works',
    skippable: true,
    analyticsTag: 'onboarding_welcome',
  },
  {
    id: 'how_it_works',
    title: 'How it works',
    body:
      'Swipe each card: ↑ YES!, → Yes, ← No, ↓ NO!\nWe measure your Connection Style and Enneagram signals.\nYour result maps to 1 of 8 Swipe Types.',
    illustration: 'illust_swipe',
    ctaLabel: 'Next',
    skippable: true,
    analyticsTag: 'onboarding_how',
  },
  {
    id: 'what_you_get',
    title: 'What you'll get',
    body:
      '• A free, shareable summary\n• Clear patterns in how you give/receive love\n• Growth tips that actually feel doable\n\nOptional: unlock a detailed report ($12).',
    illustration: 'illust_benefits',
    ctaLabel: 'Next',
    skippable: true,
    analyticsTag: 'onboarding_value',
  },
  {
    id: 'privacy',
    title: 'Your data, your call',
    body:
      'No sensitive personal info required. Your swipes are stored securely.\nYou control whether to save results to your profile.\nWe never sell your data.',
    illustration: 'illust_privacy',
    ctaLabel: 'Start the Assessment',
    secondaryCtaLabel: 'Skip tutorial',
    skippable: true,
    analyticsTag: 'onboarding_privacy',
  },
];

export async function getHasSeenOnboarding(): Promise<boolean> {
  try {
    const v = await AsyncStorage.getItem(ONBOARDING_FLAG);
    return v === 'true';
  } catch {
    return false;
  }
}

export async function setHasSeenOnboarding(seen: boolean = true): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_FLAG, seen ? 'true' : 'false');
  } catch {}
}

// Helper: route guard example
export async function shouldShowOnboarding(): Promise<boolean> {
  const seen = await getHasSeenOnboarding();
  return !seen;
}




