/**
 * Data Integrity Tests
 * 
 * Tests to ensure data consistency between UI interactions and backend results.
 * Validates that swipes, percentages, and questions are handled correctly.
 */

import { loveLanguageService } from '@/services/loveLanguageService';
import { SwipeResult } from '@/types/profile';

describe('Data Integrity Tests', () => {
  beforeEach(() => {
    // Clear all responses before each test
    loveLanguageService.clearResponses();
  });

  describe('Question Uniqueness', () => {
    test('ensures no duplicate question IDs', () => {
      const questions = loveLanguageService.getAllQuestions();
      const questionIds = questions.map(q => q.id);
      const uniqueIds = new Set(questionIds);
      
      expect(uniqueIds.size).toBe(questionIds.length);
      expect(questions.length).toBe(25);
    });

    test('ensures no duplicate question text', () => {
      const questions = loveLanguageService.getAllQuestions();
      const questionTexts = questions.map(q => q.text);
      const uniqueTexts = new Set(questionTexts);
      
      expect(uniqueTexts.size).toBe(questionTexts.length);
    });

    test('validates question structure', () => {
      const questions = loveLanguageService.getAllQuestions();
      
      questions.forEach(question => {
        expect(question).toHaveProperty('id');
        expect(question).toHaveProperty('text');
        expect(question).toHaveProperty('category');
        expect(question).toHaveProperty('weight');
        expect(question).toHaveProperty('positive');
        
        expect(typeof question.id).toBe('string');
        expect(typeof question.text).toBe('string');
        expect(typeof question.category).toBe('string');
        expect(typeof question.weight).toBe('number');
        expect(typeof question.positive).toBe('boolean');
        
        expect(question.id.length).toBeGreaterThan(0);
        expect(question.text.length).toBeGreaterThan(0);
        expect(question.weight).toBeGreaterThan(0);
      });
    });

    test('validates category distribution', () => {
      const questions = loveLanguageService.getAllQuestions();
      const categoryCounts = questions.reduce((acc, q) => {
        acc[q.category] = (acc[q.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Should have 5 questions per category
      expect(categoryCounts.words).toBe(5);
      expect(categoryCounts.acts).toBe(5);
      expect(categoryCounts.gifts).toBe(5);
      expect(categoryCounts.time).toBe(5);
      expect(categoryCounts.touch).toBe(5);
    });
  });

  describe('Swipe Count Validation', () => {
    test('tracks swipe counts correctly', () => {
      // Submit various responses
      loveLanguageService.submitResponse('words-1', 'Yes');
      loveLanguageService.submitResponse('words-2', 'YES!');
      loveLanguageService.submitResponse('words-3', 'No');
      loveLanguageService.submitResponse('words-4', 'NO!');
      loveLanguageService.submitResponse('acts-1', 'Yes');
      
      const responses = loveLanguageService.getAllResponses();
      expect(responses.length).toBe(5);
      
      // Count by response type
      const responseCounts = responses.reduce((acc, r) => {
        acc[r.response] = (acc[r.response] || 0) + 1;
        return acc;
      }, {} as Record<SwipeResult, number>);
      
      expect(responseCounts['Yes']).toBe(2);
      expect(responseCounts['YES!']).toBe(1);
      expect(responseCounts['No']).toBe(1);
      expect(responseCounts['NO!']).toBe(1);
    });

    test('validates swipe-to-score mapping', () => {
      // Test each swipe type
      loveLanguageService.submitResponse('words-1', 'Yes');
      loveLanguageService.submitResponse('words-2', 'YES!');
      loveLanguageService.submitResponse('words-3', 'No');
      loveLanguageService.submitResponse('words-4', 'NO!');
      
      const scores = loveLanguageService.calculateScores();
      
      // Yes = 2 points, YES! = 3 points, No = 0 points, NO! = -1 points
      expect(scores.words).toBe(2 + 3 + 0 + (-1)); // = 4
    });

    test('ensures response tracking matches submitted responses', () => {
      const testResponses = [
        { questionId: 'words-1', response: 'Yes' as SwipeResult },
        { questionId: 'words-2', response: 'YES!' as SwipeResult },
        { questionId: 'acts-1', response: 'No' as SwipeResult },
        { questionId: 'gifts-1', response: 'NO!' as SwipeResult },
      ];
      
      testResponses.forEach(({ questionId, response }) => {
        loveLanguageService.submitResponse(questionId, response);
      });
      
      const storedResponses = loveLanguageService.getAllResponses();
      expect(storedResponses.length).toBe(4);
      
      testResponses.forEach(({ questionId, response }, index) => {
        expect(storedResponses[index].questionId).toBe(questionId);
        expect(storedResponses[index].response).toBe(response);
        expect(storedResponses[index].timestamp).toBeInstanceOf(Date);
      });
    });
  });

  describe('Percentage Validation', () => {
    test('ensures percentages sum to 100%', () => {
      // Submit responses for all categories
      loveLanguageService.submitResponse('words-1', 'Yes');
      loveLanguageService.submitResponse('words-2', 'Yes');
      loveLanguageService.submitResponse('acts-1', 'Yes');
      loveLanguageService.submitResponse('gifts-1', 'Yes');
      loveLanguageService.submitResponse('time-1', 'Yes');
      loveLanguageService.submitResponse('touch-1', 'Yes');
      
      const result = loveLanguageService.generateResult();
      const percentageSum = Object.values(result.percentages).reduce((sum, p) => sum + p, 0);
      
      // Should be close to 100% (allowing for floating point precision)
      expect(percentageSum).toBeCloseTo(100, 1);
    });

    test('handles edge case of all equal scores', () => {
      // Submit same response for all categories
      loveLanguageService.submitResponse('words-1', 'Yes');
      loveLanguageService.submitResponse('acts-1', 'Yes');
      loveLanguageService.submitResponse('gifts-1', 'Yes');
      loveLanguageService.submitResponse('time-1', 'Yes');
      loveLanguageService.submitResponse('touch-1', 'Yes');
      
      const result = loveLanguageService.generateResult();
      const percentageSum = Object.values(result.percentages).reduce((sum, p) => sum + p, 0);
      
      expect(percentageSum).toBeCloseTo(100, 1);
      
      // All should be equal (20% each)
      Object.values(result.percentages).forEach(percentage => {
        expect(percentage).toBeCloseTo(20, 1);
      });
    });

    test('handles edge case of all negative scores', () => {
      // Submit all negative responses
      loveLanguageService.submitResponse('words-1', 'NO!');
      loveLanguageService.submitResponse('acts-1', 'NO!');
      loveLanguageService.submitResponse('gifts-1', 'NO!');
      loveLanguageService.submitResponse('time-1', 'NO!');
      loveLanguageService.submitResponse('touch-1', 'NO!');
      
      const result = loveLanguageService.generateResult();
      const percentageSum = Object.values(result.percentages).reduce((sum, p) => sum + p, 0);
      
      // Should still sum to 100% (normalized)
      expect(percentageSum).toBeCloseTo(100, 1);
    });

    test('validates percentage calculation consistency', () => {
      // Submit known responses
      loveLanguageService.submitResponse('words-1', 'YES!'); // 3 points
      loveLanguageService.submitResponse('words-2', 'YES!'); // 3 points
      loveLanguageService.submitResponse('acts-1', 'Yes');   // 2 points
      loveLanguageService.submitResponse('gifts-1', 'No');   // 0 points
      loveLanguageService.submitResponse('time-1', 'No');     // 0 points
      
      const result = loveLanguageService.generateResult();
      
      // Words should be highest (6 points), Acts second (2 points)
      expect(result.primary).toBe('words');
      expect(result.secondary).toBe('acts');
      
      // Percentages should reflect the score distribution
      expect(result.percentages.words).toBeGreaterThan(result.percentages.acts);
      expect(result.percentages.acts).toBeGreaterThan(result.percentages.gifts);
      expect(result.percentages.acts).toBeGreaterThan(result.percentages.time);
    });
  });

  describe('Data Consistency Between UI and Backend', () => {
    test('ensures UI swipe count matches backend responses', () => {
      // Simulate UI interactions
      const uiSwipes = [
        { questionId: 'words-1', direction: 'right' as const, response: 'Yes' as SwipeResult },
        { questionId: 'words-2', direction: 'right' as const, response: 'YES!' as SwipeResult },
        { questionId: 'acts-1', direction: 'left' as const, response: 'No' as SwipeResult },
        { questionId: 'gifts-1', direction: 'left' as const, response: 'NO!' as SwipeResult },
      ];
      
      // Submit responses as UI would
      uiSwipes.forEach(({ questionId, response }) => {
        loveLanguageService.submitResponse(questionId, response);
      });
      
      // Verify backend has correct data
      const responses = loveLanguageService.getAllResponses();
      expect(responses.length).toBe(uiSwipes.length);
      
      uiSwipes.forEach(({ questionId, response }, index) => {
        expect(responses[index].questionId).toBe(questionId);
        expect(responses[index].response).toBe(response);
      });
    });

    test('ensures dashboard percentages match calculated scores', () => {
      // Submit responses
      loveLanguageService.submitResponse('words-1', 'YES!');
      loveLanguageService.submitResponse('words-2', 'Yes');
      loveLanguageService.submitResponse('acts-1', 'Yes');
      loveLanguageService.submitResponse('gifts-1', 'No');
      loveLanguageService.submitResponse('time-1', 'No');
      
      const result = loveLanguageService.generateResult();
      const scores = loveLanguageService.calculateScores();
      
      // Verify that percentages are calculated from scores
      expect(result.scores).toEqual(scores);
      
      // Verify that percentages reflect the score distribution
      const scoreValues = Object.values(scores);
      const maxScore = Math.max(...scoreValues);
      const minScore = Math.min(...scoreValues);
      
      if (maxScore !== minScore) {
        // Find the category with max score
        const maxCategory = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0];
        const maxPercentage = result.percentages[maxCategory as keyof typeof result.percentages];
        
        // The highest scoring category should have the highest percentage
        expect(maxPercentage).toBeGreaterThan(0);
        
        // Verify that the highest percentage is indeed the highest
        const allPercentages = Object.values(result.percentages);
        const maxPercentageValue = Math.max(...allPercentages);
        expect(maxPercentage).toBe(maxPercentageValue);
      }
    });

    test('validates complete test flow data integrity', () => {
      // Simulate complete test flow with more balanced responses
      const questions = loveLanguageService.getAllQuestions();
      const testResponses: Array<{ questionId: string; response: SwipeResult }> = [];
      
      // Submit responses for all questions with balanced distribution
      questions.forEach((question, index) => {
        // Create a more balanced response pattern
        let response: SwipeResult;
        if (index < 5) response = 'YES!';      // First 5: strong positive
        else if (index < 10) response = 'Yes'; // Next 5: positive
        else if (index < 15) response = 'No';  // Next 5: negative
        else if (index < 20) response = 'NO!'; // Next 5: strong negative
        else response = 'Yes';                 // Last 5: positive
        
        testResponses.push({ questionId: question.id, response });
        loveLanguageService.submitResponse(question.id, response);
      });
      
      // Verify test completion
      expect(loveLanguageService.isTestCompleted()).toBe(true);
      
      // Verify all responses were recorded
      const storedResponses = loveLanguageService.getAllResponses();
      expect(storedResponses.length).toBe(25);
      
      // Verify response data integrity
      testResponses.forEach(({ questionId, response }, index) => {
        expect(storedResponses[index].questionId).toBe(questionId);
        expect(storedResponses[index].response).toBe(response);
      });
      
      // Verify percentages sum to 100%
      const result = loveLanguageService.generateResult();
      const percentageSum = Object.values(result.percentages).reduce((sum, p) => sum + p, 0);
      expect(percentageSum).toBeCloseTo(100, 1);
      
      // Verify scores are calculated correctly
      const scores = loveLanguageService.calculateScores();
      expect(result.scores).toEqual(scores);
      
      // Verify that we have a reasonable distribution (not all equal)
      const percentageValues = Object.values(result.percentages);
      const uniquePercentages = new Set(percentageValues.map(p => Math.round(p)));
      expect(uniquePercentages.size).toBeGreaterThan(1); // Should have some variation
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('handles invalid question IDs gracefully', () => {
      expect(() => {
        loveLanguageService.submitResponse('invalid-id', 'Yes');
      }).not.toThrow();
      
      // Should not affect scoring
      const scores = loveLanguageService.calculateScores();
      expect(Object.values(scores).every(score => score === 0)).toBe(true);
    });

    test('handles empty responses gracefully', () => {
      const result = loveLanguageService.generateResult();
      expect(result).toBeDefined();
      expect(result.primary).toBeDefined();
      expect(result.secondary).toBeDefined();
      
      // All percentages should be equal when no responses
      const percentageSum = Object.values(result.percentages).reduce((sum, p) => sum + p, 0);
      expect(percentageSum).toBeCloseTo(100, 1);
    });

    test('validates question weight consistency', () => {
      const questions = loveLanguageService.getAllQuestions();
      
      // All questions should have weight = 1
      questions.forEach(question => {
        expect(question.weight).toBe(1);
      });
    });

    test('validates question positive direction consistency', () => {
      const questions = loveLanguageService.getAllQuestions();
      
      // All questions should be positive (true)
      questions.forEach(question => {
        expect(question.positive).toBe(true);
      });
    });
  });
});
