/**
 * MVP Content - 9 Questions across 3 Categories
 * 
 * This file contains the initial content for the Swipe Platform MVP.
 * Questions are organized by category and include metadata for display.
 */

export interface Question {
  id: string;
  category: string;
  text: string;
  media?: {
    type: 'image' | 'video' | 'link';
    url: string;
    alt?: string;
  };
  metadata?: {
    source?: string;
    context?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'stocks',
    name: 'Stock Market',
    description: 'Investment sentiment and market predictions',
    icon: '📈',
    color: '#00C853'
  },
  {
    id: 'brand-identity',
    name: 'Brand Identity',
    description: 'Brand perception and marketing effectiveness',
    icon: '🏷️',
    color: '#FF6F00'
  },
  {
    id: 'psychological-tests',
    name: 'Psychological Tests',
    description: 'Personality assessment and behavioral insights',
    icon: '🧠',
    color: '#9C27B0'
  }
];

export const QUESTIONS: Question[] = [
  // Stock Market Questions
  {
    id: 'stocks-1',
    category: 'stocks',
    text: 'Will AMD stock increase in value today?',
    media: {
      type: 'image',
      url: 'https://via.placeholder.com/300x200/00C853/FFFFFF?text=AMD+Logo',
      alt: 'AMD Logo'
    },
    metadata: {
      source: 'Yahoo Finance',
      context: 'Current AMD stock price and trends'
    }
  },
  {
    id: 'stocks-2',
    category: 'stocks',
    text: 'Will the DOW drop by at least 0.25% this week?',
    media: {
      type: 'image',
      url: 'https://via.placeholder.com/300x200/00C853/FFFFFF?text=Dow+Jones+Logo',
      alt: 'Dow Jones Logo'
    },
    metadata: {
      source: 'Yahoo Finance',
      context: 'Dow Jones Industrial Average performance'
    }
  },
  {
    id: 'stocks-3',
    category: 'stocks',
    text: 'Is Apple\'s stock price inflated?',
    media: {
      type: 'image',
      url: 'https://via.placeholder.com/300x200/00C853/FFFFFF?text=Apple+Stock+Price',
      alt: 'Apple Stock Price Chart'
    },
    metadata: {
      source: 'Yahoo Finance',
      context: 'Apple stock price analysis and valuation'
    }
  },

  // Brand Identity Questions
  {
    id: 'brand-1',
    category: 'brand-identity',
    text: 'Do you like this product label?',
    media: {
      type: 'image',
      url: 'https://via.placeholder.com/300x200/FF6F00/FFFFFF?text=Campbell\'s+Soup+Label',
      alt: 'Campbell\'s Soup Product Label'
    },
    metadata: {
      source: 'Campbell\'s Soup',
      context: 'Product packaging design evaluation'
    }
  },
  {
    id: 'brand-2',
    category: 'brand-identity',
    text: 'Will this new ad campaign meet established goals?',
    media: {
      type: 'image',
      url: 'https://via.placeholder.com/300x200/FF6F00/FFFFFF?text=Video+Player+Thumbnail',
      alt: 'Ad Campaign Video Thumbnail'
    },
    metadata: {
      source: 'Marketing Campaign',
      context: 'Advertising campaign effectiveness'
    }
  },
  {
    id: 'brand-3',
    category: 'brand-identity',
    text: 'Does this commercial make you feel happy?',
    media: {
      type: 'image',
      url: 'https://via.placeholder.com/300x200/FF6F00/FFFFFF?text=Sunny+Commercial+Scene',
      alt: 'Happy Commercial Scene'
    },
    metadata: {
      source: 'Commercial Content',
      context: 'Emotional response to advertising'
    }
  },

  // Psychological Tests Questions
  {
    id: 'psych-1',
    category: 'psychological-tests',
    text: 'People can\'t be trusted.',
    metadata: {
      source: 'Myers-Briggs Personality Assessment',
      context: 'Trust and interpersonal relationships'
    }
  },
  {
    id: 'psych-2',
    category: 'psychological-tests',
    text: 'Something good will happen to me today.',
    metadata: {
      source: 'Myers-Briggs Personality Assessment',
      context: 'Optimism and positive outlook'
    }
  },
  {
    id: 'psych-3',
    category: 'psychological-tests',
    text: 'Should you throw caution to the wind in life?',
    metadata: {
      source: 'Myers-Briggs Personality Assessment',
      context: 'Risk-taking and decision-making style'
    }
  }
];

// Helper functions for content management
export const getQuestionsByCategory = (categoryId: string): Question[] => {
  return QUESTIONS.filter(question => question.category === categoryId);
};

export const getQuestionById = (id: string): Question | undefined => {
  return QUESTIONS.find(question => question.id === id);
};

export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find(category => category.id === id);
};

export const getAllQuestions = (): Question[] => {
  return QUESTIONS;
};

export const getAllCategories = (): Category[] => {
  return CATEGORIES;
};


