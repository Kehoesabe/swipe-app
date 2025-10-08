import seedrandom from 'seedrandom';
import { Question } from '../data/questions';

/**
 * Randomization utilities for question ordering
 * Implements seeded randomization with window rules
 */

export interface QuestionWithTags extends Question {
  tags: string[];
}

/**
 * Randomize questions with seeded RNG and window rules
 */
export function randomizeQuestions(
  questions: QuestionWithTags[],
  seed: string
): QuestionWithTags[] {
  const rng = seedrandom(seed);
  
  // Fisher-Yates shuffle with seeded RNG
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Apply window rule: max 2 consecutive from same framework
  return applyWindowRule(shuffled);
}

/**
 * Apply window rule: max 2 consecutive questions from same framework
 */
function applyWindowRule(questions: QuestionWithTags[]): QuestionWithTags[] {
  const result: QuestionWithTags[] = [];
  let lastFramework: string | null = null;
  let consecutiveCount = 0;
  
  const remaining = [...questions];
  
  while (remaining.length > 0) {
    // Find next question that doesn't violate window rule
    let foundIndex = -1;
    
    for (let i = 0; i < remaining.length; i++) {
      const q = remaining[i];
      
      if (q.framework !== lastFramework || consecutiveCount < 2) {
        foundIndex = i;
        break;
      }
    }
    
    // If no valid question found, reset and take first
    if (foundIndex === -1) {
      foundIndex = 0;
      lastFramework = null;
      consecutiveCount = 0;
    }
    
    const nextQuestion = remaining.splice(foundIndex, 1)[0];
    result.push(nextQuestion);
    
    // Update tracking
    if (nextQuestion.framework === lastFramework) {
      consecutiveCount++;
    } else {
      lastFramework = nextQuestion.framework;
      consecutiveCount = 1;
    }
  }
  
  return result;
}

/**
 * Apply onboarding placement: ~5 onboarding_easy questions in first 8 positions
 */
export function applyOnboardingPlacement(
  questions: QuestionWithTags[]
): QuestionWithTags[] {
  const onboardingEasy = questions.filter(q => 
    q.tags.includes('onboarding_easy')
  );
  const others = questions.filter(q => 
    !q.tags.includes('onboarding_easy')
  );
  
  // Place ~5 onboarding_easy in first 8 positions
  const firstEight: QuestionWithTags[] = [];
  const easyToPlace = [...onboardingEasy.slice(0, 5)];
  const easyRemaining = [...onboardingEasy.slice(5)];
  const othersCopy = [...others];
  
  // Interleave easy questions in first 8
  for (let i = 0; i < 8; i++) {
    if (i % 2 === 0 && easyToPlace.length > 0) {
      firstEight.push(easyToPlace.shift()!);
    } else if (othersCopy.length > 0) {
      firstEight.push(othersCopy.shift()!);
    } else if (easyToPlace.length > 0) {
      // If we run out of others, use remaining easy questions
      firstEight.push(easyToPlace.shift()!);
    }
  }
  
  // Combine all remaining questions
  const remaining = [...easyToPlace, ...easyRemaining, ...othersCopy];
  
  return [...firstEight, ...remaining];
}

/**
 * Get tags for a question based on question-tags.json
 */
export function getTagsForQuestion(questionId: number): string[] {
  const tags: string[] = [];
  
  // Load from question-tags.json
  const tagAssignments = require('../data/question-tags.json');
  
  const onboardingEasy = tagAssignments.onboarding_easy.map((t: any) => t.id);
  const highSignal = tagAssignments.high_signal.map((t: any) => t.id);
  
  if (onboardingEasy.includes(questionId)) {
    tags.push('onboarding_easy');
  }
  
  if (highSignal.includes(questionId)) {
    tags.push('high_signal');
  }
  
  return tags;
}

/**
 * Add tags to questions
 */
export function addTagsToQuestions(questions: Question[]): QuestionWithTags[] {
  return questions.map(q => ({
    ...q,
    tags: getTagsForQuestion(q.id)
  }));
}
