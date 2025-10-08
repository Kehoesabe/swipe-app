/**
 * SWIPE TYPE ASSESSMENT - COMPLETE QUESTION BANK
 * 
 * 57 Questions Total:
 * - 27 Connection Style questions (Q1-24, Q52-54)
 * - 30 Enneagram Type questions (Q25-51, Q55-57)
 * 
 * Version: 2.0
 * Date: October 7, 2025
 * Status: Production Ready
 */

export interface Question {
  id: number;
  text: string;
  framework: 'connection' | 'enneagram';
  category: string;
  reverse: boolean;
  weight: {
    up: number;    // YES!
    right: number; // Yes
    left: number;  // No
    down: number;  // NO!
  };
}

export const questions: Question[] = [
  // ============================================
  // CONNECTION STYLES (27 questions)
  // ============================================
  
  // VERBAL AFFIRMATION (Q1-4) - 4 questions
  {
    id: 1,
    text: "I feel most connected when my partner tells me what they appreciate about me",
    framework: 'connection',
    category: 'verbalAffirmation',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 2,
    text: "Hearing 'I love you' regularly is essential to me",
    framework: 'connection',
    category: 'verbalAffirmation',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 3,
    text: "Compliments make me feel valued in relationships",
    framework: 'connection',
    category: 'verbalAffirmation',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 4,
    text: "I notice when my partner doesn't verbally express appreciation",
    framework: 'connection',
    category: 'verbalAffirmation',
    reverse: true,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  
  // QUALITY PRESENCE (Q5-8, Q52) - 5 questions
  {
    id: 5,
    text: "I feel most loved when my partner gives me their full attention",
    framework: 'connection',
    category: 'qualityPresence',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 6,
    text: "Meaningful conversations matter more to me than gifts",
    framework: 'connection',
    category: 'qualityPresence',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 7,
    text: "I feel disconnected when my partner is distracted during our time together",
    framework: 'connection',
    category: 'qualityPresence',
    reverse: true,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 8,
    text: "Phone-free, face-to-face time is how I recharge with my partner",
    framework: 'connection',
    category: 'qualityPresence',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  
  // PHYSICAL CLOSENESS (Q9-12, Q53) - 5 questions
  {
    id: 9,
    text: "Physical touch is essential for me to feel connected",
    framework: 'connection',
    category: 'physicalCloseness',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 10,
    text: "I naturally reach out to touch or hold hands with my partner",
    framework: 'connection',
    category: 'physicalCloseness',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 11,
    text: "Physical proximity makes me feel secure without needing conversation",
    framework: 'connection',
    category: 'physicalCloseness',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 12,
    text: "I miss physical closeness most when apart from my partner",
    framework: 'connection',
    category: 'physicalCloseness',
    reverse: true,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  
  // SUPPORTIVE ACTIONS (Q13-16, Q54) - 5 questions
  {
    id: 13,
    text: "I feel most loved when my partner helps me without being asked",
    framework: 'connection',
    category: 'supportiveActions',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 14,
    text: "Actions speak louder than words to me",
    framework: 'connection',
    category: 'supportiveActions',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 15,
    text: "When my partner handles something I'm stressed about, I feel deeply cared for",
    framework: 'connection',
    category: 'supportiveActions',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 16,
    text: "Reliability matters more to me than romantic gestures",
    framework: 'connection',
    category: 'supportiveActions',
    reverse: true,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  
  // THOUGHTFUL GESTURES (Q17-20) - 4 questions
  {
    id: 17,
    text: "I feel loved when my partner surprises me with thoughtful tokens",
    framework: 'connection',
    category: 'thoughtfulGestures',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 18,
    text: "Small, meaningful gifts matter more to me than expensive ones",
    framework: 'connection',
    category: 'thoughtfulGestures',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 19,
    text: "I keep meaningful gifts because they represent our connection",
    framework: 'connection',
    category: 'thoughtfulGestures',
    reverse: true,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 20,
    text: "When my partner remembers small details, I feel truly seen",
    framework: 'connection',
    category: 'thoughtfulGestures',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  
  // SHARED GROWTH (Q21-24) - 4 questions
  {
    id: 21,
    text: "I feel closest when we're working toward goals together",
    framework: 'connection',
    category: 'sharedGrowth',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 22,
    text: "Supporting each other's growth is how I express love",
    framework: 'connection',
    category: 'sharedGrowth',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 23,
    text: "I value a partner who challenges me to become better",
    framework: 'connection',
    category: 'sharedGrowth',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 24,
    text: "Celebrating each other's progress matters deeply to me",
    framework: 'connection',
    category: 'sharedGrowth',
    reverse: true,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  
  // ============================================
  // ENNEAGRAM TYPES (30 questions)
  // ============================================
  
  // TYPE 1 - REFORMER (Q25-27, Q55) - 4 questions
  {
    id: 25,
    text: "I often feel responsible for improving things",
    framework: 'enneagram',
    category: 'type1',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 26,
    text: "I have a strong inner sense of right and wrong",
    framework: 'enneagram',
    category: 'type1',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 27,
    text: "I notice imperfections and feel compelled to fix them",
    framework: 'enneagram',
    category: 'type1',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  
  // TYPE 2 - HELPER (Q28-30, Q57) - 4 questions
  {
    id: 28,
    text: "I get satisfaction from meeting others' needs",
    framework: 'enneagram',
    category: 'type2',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 29,
    text: "Being needed and appreciated is very important to me",
    framework: 'enneagram',
    category: 'type2',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 30,
    text: "I sometimes struggle to express my own needs",
    framework: 'enneagram',
    category: 'type2',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  
  // TYPE 3 - ACHIEVER (Q31-33) - 3 questions
  {
    id: 31,
    text: "I'm aware of how I'm perceived and want to be seen as successful",
    framework: 'enneagram',
    category: 'type3',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 32,
    text: "Achieving goals gives me energy and purpose",
    framework: 'enneagram',
    category: 'type3',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 33,
    text: "I adapt easily to situations to achieve the best outcome",
    framework: 'enneagram',
    category: 'type3',
    reverse: true,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  
  // TYPE 4 - INDIVIDUALIST (Q34-36) - 3 questions
  {
    id: 34,
    text: "I feel things deeply and sometimes feel misunderstood",
    framework: 'enneagram',
    category: 'type4',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 35,
    text: "Being authentic is more important than fitting in",
    framework: 'enneagram',
    category: 'type4',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 36,
    text: "I'm drawn to depth rather than surface-level connections",
    framework: 'enneagram',
    category: 'type4',
    reverse: true,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  
  // TYPE 5 - INVESTIGATOR (Q37-38, Q49) - 3 questions
  {
    id: 37,
    text: "I need time alone to process my thoughts",
    framework: 'enneagram',
    category: 'type5',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 38,
    text: "I prefer to observe before engaging emotionally",
    framework: 'enneagram',
    category: 'type5',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  
  // TYPE 6 - LOYALIST (Q39-41) - 3 questions
  {
    id: 39,
    text: "I think through potential problems and plan for worst-case scenarios",
    framework: 'enneagram',
    category: 'type6',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 40,
    text: "Loyalty and dependability are among my strongest values",
    framework: 'enneagram',
    category: 'type6',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 41,
    text: "I seek reassurance when facing uncertainty",
    framework: 'enneagram',
    category: 'type6',
    reverse: true,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  
  // TYPE 7 - ENTHUSIAST (Q42-44, Q56) - 4 questions
  {
    id: 42,
    text: "I get excited about new possibilities and don't like feeling restricted",
    framework: 'enneagram',
    category: 'type7',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 43,
    text: "I prefer to stay positive and move past difficult emotions quickly",
    framework: 'enneagram',
    category: 'type7',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 44,
    text: "I have many interests and like to keep my options open",
    framework: 'enneagram',
    category: 'type7',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  
  // TYPE 8 - CHALLENGER (Q45-46, Q50) - 3 questions
  {
    id: 45,
    text: "I value honesty and directness, even when uncomfortable",
    framework: 'enneagram',
    category: 'type8',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 46,
    text: "I naturally take charge and protect those I care about",
    framework: 'enneagram',
    category: 'type8',
    reverse: true,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  
  // TYPE 9 - PEACEMAKER (Q47-48, Q51) - 3 questions
  {
    id: 47,
    text: "I prioritize keeping the peace and avoid conflict when possible",
    framework: 'enneagram',
    category: 'type9',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 48,
    text: "I adapt easily to others' preferences to maintain harmony",
    framework: 'enneagram',
    category: 'type9',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  
  // ============================================
  // NEW QUESTIONS (Q49-51) - Added October 7, 2025
  // ============================================
  
  {
    id: 49,
    text: "I recharge by spending time alone, even when I love someone",
    framework: 'enneagram',
    category: 'type5',
    reverse: true,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 50,
    text: "I step in decisively when situations feel unfair or unsafe",
    framework: 'enneagram',
    category: 'type8',
    reverse: false,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  {
    id: 51,
    text: "I downplay my own preferences to keep things comfortable",
    framework: 'enneagram',
    category: 'type9',
    reverse: true,
    weight: { up: 2, right: 1, left: -1, down: -2 }
  },
  
  // ============================================
  // REVERSE-CODED QUESTIONS (Q52-57)
  // ============================================
  
  {
    id: 52,
    text: "I can feel close to my partner even when we're both distracted",
    framework: 'connection',
    category: 'qualityPresence',
    reverse: true,
    weight: { up: -2, right: -1, left: 1, down: 2 } // INVERTED
  },
  {
    id: 53,
    text: "I feel connected without needing physical touch or proximity",
    framework: 'connection',
    category: 'physicalCloseness',
    reverse: true,
    weight: { up: -2, right: -1, left: 1, down: 2 } // INVERTED
  },
  {
    id: 54,
    text: "Words mean more to me than what someone actually does",
    framework: 'connection',
    category: 'supportiveActions',
    reverse: true,
    weight: { up: -2, right: -1, left: 1, down: 2 } // INVERTED
  },
  {
    id: 55,
    text: "I rarely feel responsible for fixing or improving things around me",
    framework: 'enneagram',
    category: 'type1',
    reverse: true,
    weight: { up: -2, right: -1, left: 1, down: 2 } // INVERTED
  },
  {
    id: 56,
    text: "I prefer having a few commitments rather than keeping many options open",
    framework: 'enneagram',
    category: 'type7',
    reverse: true,
    weight: { up: -2, right: -1, left: 1, down: 2 } // INVERTED
  },
  {
    id: 57,
    text: "I focus more on my own needs than on anticipating others' needs",
    framework: 'enneagram',
    category: 'type2',
    reverse: true,
    weight: { up: -2, right: -1, left: 1, down: 2 } // INVERTED
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getQuestionById(id: number): Question | undefined {
  return questions.find(q => q.id === id);
}

export function getQuestionsByFramework(framework: 'connection' | 'enneagram'): Question[] {
  return questions.filter(q => q.framework === framework);
}

export function getQuestionsByCategory(category: string): Question[] {
  return questions.filter(q => q.category === category);
}

export function getReverseQuestions(): Question[] {
  return questions.filter(q => q.reverse);
}

// ============================================
// VALIDATION
// ============================================

console.assert(questions.length === 57, "Should have exactly 57 questions");
console.assert(
  questions.filter(q => q.framework === 'connection').length === 27,
  "Should have 27 connection questions"
);
console.assert(
  questions.filter(q => q.framework === 'enneagram').length === 30,
  "Should have 30 enneagram questions"
);
console.assert(
  questions.filter(q => q.reverse).length === 18,
  "Should have 18 reverse-coded questions"
);
