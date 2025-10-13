/**
 * Profile Type Definitions
 * 
 * Defines the structure for Swipe Type profiles based on Profile Standards v2.1
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

export interface SwipeTypeProfile {
  typeNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  typeName: string;
  directness: 'Low' | 'Mid' | 'High';
  tangibility: 'Low' | 'Mid' | 'High';
  
  // Free content (always visible)
  freeSummary: string; // ~200 words
  
  // Premium content (behind paywall initially)
  premium: {
    fullNarrative: string;          // 400-500 words
    strengths: ProfileStrength[];    // 3 items
    growthAreas: ProfileGrowth[];    // 2 items
    communicationStyle: string;      // ~300 words
    frictionPoints: string;          // ~400 words
    partnerTranslation: string;      // ~300 words
    growthPathway: string;           // ~200 words
    kpis: string[];                  // 3-5 items
    signatureLexicon: LexiconTerm[]; // 10-20 terms
  };
}

export interface ProfileStrength {
  title: string;
  content: string; // ~150 words with Scene/Script/Why/Practice
}

export interface ProfileGrowth {
  title: string;
  content: string; // ~200 words with Pattern/Why/Practice/PartnerView
}

export interface LexiconTerm {
  term: string;
  definition: string;
}

export interface ProfileDisplayProps {
  profile: SwipeTypeProfile;
  isPremiumUnlocked: boolean;
  onUnlockClick: () => void;
  isProcessingPayment?: boolean;
  paymentError?: string | null;
}

export interface TypeHeaderProps {
  typeNumber: number;
  typeName: string;
  directness: 'Low' | 'Mid' | 'High';
  tangibility: 'Low' | 'Mid' | 'High';
}

export interface ResultsScreenParams {
  typeNumber: number;
  typeName: string;
  directness: 'Low' | 'Mid' | 'High';
  tangibility: 'Low' | 'Mid' | 'High';
}