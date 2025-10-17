/**
 * Love Language Test Content
 * 
 * Based on Dr. Gary Chapman's "The 5 Love Languages" concept.
 * Adapted for swipe-based interaction with Tinder-style interface.
 */

export interface LoveLanguageQuestion {
  id: string;
  text: string;
  category: 'words' | 'acts' | 'gifts' | 'time' | 'touch';
  weight: number;
  positive: boolean; // true = swipe right for this love language
}

export interface LoveLanguageResult {
  primary: LoveLanguageType;
  secondary: LoveLanguageType;
  scores: Record<LoveLanguageType, number>;
  percentages: Record<LoveLanguageType, number>;
  description: string;
  tips: string[];
}

export type LoveLanguageType = 'words' | 'acts' | 'gifts' | 'time' | 'touch';

export const LOVE_LANGUAGE_QUESTIONS: LoveLanguageQuestion[] = [
  // Words of Affirmation
  {
    id: 'words-1',
    text: 'I feel most loved when someone tells me how much they appreciate me.',
    category: 'words',
    weight: 1,
    positive: true
  },
  {
    id: 'words-2',
    text: 'Hearing "I love you" means more to me than any gift.',
    category: 'words',
    weight: 1,
    positive: true
  },
  {
    id: 'words-3',
    text: 'I value verbal encouragement more than physical touch.',
    category: 'words',
    weight: 1,
    positive: true
  },
  {
    id: 'words-4',
    text: 'A heartfelt compliment makes my day.',
    category: 'words',
    weight: 1,
    positive: true
  },
  {
    id: 'words-5',
    text: 'I prefer words of praise over acts of service.',
    category: 'words',
    weight: 1,
    positive: true
  },

  // Acts of Service
  {
    id: 'acts-1',
    text: 'I feel most loved when someone helps me with my tasks.',
    category: 'acts',
    weight: 1,
    positive: true
  },
  {
    id: 'acts-2',
    text: 'Actions speak louder than words to me.',
    category: 'acts',
    weight: 1,
    positive: true
  },
  {
    id: 'acts-3',
    text: 'I appreciate when someone takes care of things for me.',
    category: 'acts',
    weight: 1,
    positive: true
  },
  {
    id: 'acts-4',
    text: 'Doing something helpful for me shows you care.',
    category: 'acts',
    weight: 1,
    positive: true
  },
  {
    id: 'acts-5',
    text: 'I value practical help over romantic gestures.',
    category: 'acts',
    weight: 1,
    positive: true
  },

  // Receiving Gifts
  {
    id: 'gifts-1',
    text: 'I feel most loved when someone gives me a thoughtful gift.',
    category: 'gifts',
    weight: 1,
    positive: true
  },
  {
    id: 'gifts-2',
    text: 'A small surprise gift means the world to me.',
    category: 'gifts',
    weight: 1,
    positive: true
  },
  {
    id: 'gifts-3',
    text: 'I treasure gifts that show someone was thinking of me.',
    category: 'gifts',
    weight: 1,
    positive: true
  },
  {
    id: 'gifts-4',
    text: 'The thought behind a gift matters more than its cost.',
    category: 'gifts',
    weight: 1,
    positive: true
  },
  {
    id: 'gifts-5',
    text: 'I feel special when someone brings me something.',
    category: 'gifts',
    weight: 1,
    positive: true
  },

  // Quality Time
  {
    id: 'time-1',
    text: 'I feel most loved when someone spends focused time with me.',
    category: 'time',
    weight: 1,
    positive: true
  },
  {
    id: 'time-2',
    text: 'Undivided attention is the best gift I can receive.',
    category: 'time',
    weight: 1,
    positive: true
  },
  {
    id: 'time-3',
    text: 'I value deep conversations over physical intimacy.',
    category: 'time',
    weight: 1,
    positive: true
  },
  {
    id: 'time-4',
    text: 'Being present with me means more than any words.',
    category: 'time',
    weight: 1,
    positive: true
  },
  {
    id: 'time-5',
    text: 'I feel closest to someone when we\'re doing something together.',
    category: 'time',
    weight: 1,
    positive: true
  },

  // Physical Touch
  {
    id: 'touch-1',
    text: 'I feel most loved when someone hugs or holds me.',
    category: 'touch',
    weight: 1,
    positive: true
  },
  {
    id: 'touch-2',
    text: 'Physical affection is my primary way of feeling connected.',
    category: 'touch',
    weight: 1,
    positive: true
  },
  {
    id: 'touch-3',
    text: 'A gentle touch can communicate more than words.',
    category: 'touch',
    weight: 1,
    positive: true
  },
  {
    id: 'touch-4',
    text: 'I feel secure when someone is physically close to me.',
    category: 'touch',
    weight: 1,
    positive: true
  },
  {
    id: 'touch-5',
    text: 'Physical intimacy is essential for my emotional well-being.',
    category: 'touch',
    weight: 1,
    positive: true
  }
];

export const LOVE_LANGUAGE_DESCRIPTIONS: Record<LoveLanguageType, string> = {
  words: 'Words of Affirmation',
  acts: 'Acts of Service',
  gifts: 'Receiving Gifts',
  time: 'Quality Time',
  touch: 'Physical Touch'
};

export const LOVE_LANGUAGE_TIPS: Record<LoveLanguageType, string[]> = {
  words: [
    'Give yourself credit today.',
    'Speak kindly to yourself in the mirror.',
    'Write down three things you appreciate about yourself.',
    'Practice positive self-talk daily.',
    'Celebrate your achievements, big and small.'
  ],
  acts: [
    'Do something nice for yourself today.',
    'Take care of your future self by planning ahead.',
    'Create a self-care routine that serves you.',
    'Help someone else - it often helps us too.',
    'Organize one small area of your life.'
  ],
  gifts: [
    'Treat yourself to something small and meaningful.',
    'Create a gratitude jar for yourself.',
    'Buy yourself flowers or a small luxury.',
    'Make something beautiful for your space.',
    'Invest in something that brings you joy.'
  ],
  time: [
    'Spend quality time with yourself today.',
    'Practice mindfulness or meditation.',
    'Take a walk without your phone.',
    'Engage in a hobby you love.',
    'Schedule regular "me time" in your calendar.'
  ],
  touch: [
    'Give yourself a gentle self-massage.',
    'Take a warm bath or shower.',
    'Wear comfortable, soft clothing.',
    'Practice deep breathing with your hand on your heart.',
    'Get a good night\'s sleep in comfortable bedding.'
  ]
};

export const LOVE_LANGUAGE_POPULATION_DATA: Record<LoveLanguageType, number> = {
  words: 23,
  acts: 20,
  gifts: 19,
  time: 20,
  touch: 18
};






