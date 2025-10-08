import { 
  randomizeQuestions, 
  applyOnboardingPlacement, 
  getTagsForQuestion,
  addTagsToQuestions,
  QuestionWithTags 
} from '../src/utils/randomization';
import { questions } from '../src/data/questions';

describe('Randomization Tests', () => {
  let questionsWithTags: QuestionWithTags[];

  beforeEach(() => {
    questionsWithTags = addTagsToQuestions(questions);
  });

  describe('randomizeQuestions', () => {
    test('should be deterministic with same seed', () => {
      const order1 = randomizeQuestions(questionsWithTags, 'test-seed-123');
      const order2 = randomizeQuestions(questionsWithTags, 'test-seed-123');
      
      expect(order1.map(q => q.id)).toEqual(order2.map(q => q.id));
    });

    test('should produce different order with different seeds', () => {
      const order1 = randomizeQuestions(questionsWithTags, 'seed-1');
      const order2 = randomizeQuestions(questionsWithTags, 'seed-2');
      
      expect(order1.map(q => q.id)).not.toEqual(order2.map(q => q.id));
    });

    test('should maintain all questions', () => {
      const randomized = randomizeQuestions(questionsWithTags, 'test-seed');
      
      expect(randomized.length).toBe(57);
      
      const originalIds = questionsWithTags.map(q => q.id).sort();
      const randomizedIds = randomized.map(q => q.id).sort();
      
      expect(randomizedIds).toEqual(originalIds);
    });

    test('should apply window rule: max 2 consecutive from same framework', () => {
      const randomized = randomizeQuestions(questionsWithTags, 'test-seed');
      
      let consecutiveCount = 1;
      let lastFramework = randomized[0].framework;
      
      for (let i = 1; i < randomized.length; i++) {
        if (randomized[i].framework === lastFramework) {
          consecutiveCount++;
          expect(consecutiveCount).toBeLessThanOrEqual(2);
        } else {
          consecutiveCount = 1;
          lastFramework = randomized[i].framework;
        }
      }
    });
  });

  describe('applyOnboardingPlacement', () => {
    test('should place onboarding_easy questions in first 8 positions', () => {
      const withOnboarding = applyOnboardingPlacement(questionsWithTags);
      
      const firstEight = withOnboarding.slice(0, 8);
      const easyCount = firstEight.filter(q => 
        q.tags.includes('onboarding_easy')
      ).length;
      
      expect(easyCount).toBeGreaterThanOrEqual(4);
      expect(easyCount).toBeLessThanOrEqual(6);
    });

    test('should maintain all questions', () => {
      const withOnboarding = applyOnboardingPlacement(questionsWithTags);
      
      expect(withOnboarding.length).toBe(57);
      
      const originalIds = questionsWithTags.map(q => q.id).sort();
      const onboardingIds = withOnboarding.map(q => q.id).sort();
      
      expect(onboardingIds).toEqual(originalIds);
    });
  });

  describe('getTagsForQuestion', () => {
    test('should return onboarding_easy tags for correct questions', () => {
      // Test specific questions from question-tags.json
      expect(getTagsForQuestion(5)).toContain('onboarding_easy');
      expect(getTagsForQuestion(6)).toContain('onboarding_easy');
      expect(getTagsForQuestion(10)).toContain('onboarding_easy');
      expect(getTagsForQuestion(18)).toContain('onboarding_easy');
      expect(getTagsForQuestion(21)).toContain('onboarding_easy');
    });

    test('should return high_signal tags for correct questions', () => {
      // Test specific questions from question-tags.json
      expect(getTagsForQuestion(27)).toContain('high_signal');
      expect(getTagsForQuestion(45)).toContain('high_signal');
      expect(getTagsForQuestion(46)).toContain('high_signal');
      expect(getTagsForQuestion(49)).toContain('high_signal');
      expect(getTagsForQuestion(39)).toContain('high_signal');
    });

    test('should return empty array for questions without tags', () => {
      expect(getTagsForQuestion(1)).toEqual([]);
      expect(getTagsForQuestion(2)).toEqual([]);
      expect(getTagsForQuestion(3)).toEqual([]);
    });
  });

  describe('addTagsToQuestions', () => {
    test('should add tags to all questions', () => {
      const questionsWithTags = addTagsToQuestions(questions);
      
      expect(questionsWithTags.length).toBe(57);
      
      questionsWithTags.forEach(q => {
        expect(q).toHaveProperty('tags');
        expect(Array.isArray(q.tags)).toBe(true);
      });
    });

    test('should preserve all original question properties', () => {
      const questionsWithTags = addTagsToQuestions(questions);
      
      questionsWithTags.forEach((q, index) => {
        const original = questions[index];
        
        expect(q.id).toBe(original.id);
        expect(q.text).toBe(original.text);
        expect(q.framework).toBe(original.framework);
        expect(q.category).toBe(original.category);
        expect(q.reverse).toBe(original.reverse);
        expect(q.weight).toEqual(original.weight);
      });
    });
  });
});
