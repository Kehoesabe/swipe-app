/**
 * LoveLanguageService Tests
 * 
 * Tests for the Love Language service that manages test delivery and scoring.
 */

import { loveLanguageService, LoveLanguageService } from '@/services/loveLanguageService';
import { SwipeResult } from '@/types/profile';

describe('LoveLanguageService', () => {
  beforeEach(() => {
    // Clear responses before each test
    loveLanguageService.clearResponses();
  });

  describe('Test Management', () => {
    test('gets all questions', () => {
      const questions = loveLanguageService.getAllQuestions();
      expect(questions).toHaveLength(25);
      expect(questions[0]).toHaveProperty('id');
      expect(questions[0]).toHaveProperty('text');
      expect(questions[0]).toHaveProperty('category');
      expect(questions[0]).toHaveProperty('weight');
      expect(questions[0]).toHaveProperty('positive');
    });

    test('gets current question', () => {
      const current = loveLanguageService.getCurrentQuestion();
      expect(current).toBeDefined();
      expect(current?.id).toBe('words-1');
    });

    test('gets next question', () => {
      const next = loveLanguageService.getNextQuestion();
      expect(next).toBeDefined();
      expect(next?.id).toBe('words-2');
    });

    test('gets random question', () => {
      const random = loveLanguageService.getRandomQuestion();
      expect(random).toBeDefined();
      expect(random.id).toBeDefined();
    });

    test('tracks test progress', () => {
      const progress = loveLanguageService.getProgress();
      expect(progress.current).toBe(0);
      expect(progress.total).toBe(25);
      expect(progress.percentage).toBe(0);
    });

    test('detects test completion', () => {
      expect(loveLanguageService.isTestCompleted()).toBe(false);
      
      // Submit all 25 responses to complete the test
      for (let i = 0; i < 25; i++) {
        loveLanguageService.submitResponse(`question-${i}`, 'Yes');
      }
      
      expect(loveLanguageService.isTestCompleted()).toBe(true);
    });
  });

  describe('Response Management', () => {
    test('submits response', () => {
      loveLanguageService.submitResponse('words-1', 'Yes');
      const responses = loveLanguageService.getAllResponses();
      expect(responses).toHaveLength(1);
      expect(responses[0].questionId).toBe('words-1');
      expect(responses[0].response).toBe('Yes');
    });

    test('tracks multiple responses', () => {
      loveLanguageService.submitResponse('words-1', 'Yes');
      loveLanguageService.submitResponse('words-2', 'No');
      loveLanguageService.submitResponse('acts-1', 'YES!');
      
      const responses = loveLanguageService.getAllResponses();
      expect(responses).toHaveLength(3);
    });

    test('clears all responses', () => {
      loveLanguageService.submitResponse('words-1', 'Yes');
      expect(loveLanguageService.getAllResponses()).toHaveLength(1);
      
      loveLanguageService.clearResponses();
      expect(loveLanguageService.getAllResponses()).toHaveLength(0);
    });

    test('resets test progress', () => {
      loveLanguageService.submitResponse('words-1', 'Yes');
      loveLanguageService.getNextQuestion();
      
      loveLanguageService.resetTest();
      
      const progress = loveLanguageService.getProgress();
      expect(progress.current).toBe(0);
      expect(loveLanguageService.isTestCompleted()).toBe(false);
    });
  });

  describe('Scoring System', () => {
    test('calculates scores correctly', () => {
      // Submit responses for words category
      loveLanguageService.submitResponse('words-1', 'Yes');
      loveLanguageService.submitResponse('words-2', 'YES!');
      loveLanguageService.submitResponse('words-3', 'No');
      
      const scores = loveLanguageService.calculateScores();
      expect(scores.words).toBe(5); // 2 + 3 + 0 = 5
      expect(scores.acts).toBe(0);
      expect(scores.gifts).toBe(0);
      expect(scores.time).toBe(0);
      expect(scores.touch).toBe(0);
    });

    test('handles negative responses', () => {
      loveLanguageService.submitResponse('words-1', 'No');
      loveLanguageService.submitResponse('words-2', 'NO!');
      
      const scores = loveLanguageService.calculateScores();
      expect(scores.words).toBe(-1); // 0 + (-1) = -1
    });

    test('calculates percentages correctly', () => {
      // Submit responses for multiple categories
      loveLanguageService.submitResponse('words-1', 'YES!');
      loveLanguageService.submitResponse('acts-1', 'YES!');
      
      // Complete the test by submitting all 25 responses
      for (let i = 0; i < 23; i++) {
        loveLanguageService.submitResponse(`question-${i}`, 'Yes');
      }
      
      const result = loveLanguageService.generateResult();
      expect(result).toBeDefined();
      // When scores are equal, both should be 50% (sum to 100%)
      expect(result.percentages.words).toBe(50);
      expect(result.percentages.acts).toBe(50);
      
      // Verify percentages sum to 100%
      const percentageSum = Object.values(result.percentages).reduce((sum, p) => sum + p, 0);
      expect(percentageSum).toBeCloseTo(100, 1);
    });

    test('identifies primary and secondary love languages', () => {
      // Submit more responses for words than acts
      loveLanguageService.submitResponse('words-1', 'YES!');
      loveLanguageService.submitResponse('words-2', 'YES!');
      loveLanguageService.submitResponse('acts-1', 'Yes');
      
      // Complete the test by submitting all 25 responses
      for (let i = 0; i < 22; i++) {
        loveLanguageService.submitResponse(`question-${i}`, 'Yes');
      }
      
      const result = loveLanguageService.generateResult();
      expect(result.primary).toBe('words');
      expect(result.secondary).toBe('acts');
    });
  });

  describe('Result Generation', () => {
    test('generates complete result', () => {
      // Submit responses for all categories
      loveLanguageService.submitResponse('words-1', 'Yes');
      loveLanguageService.submitResponse('acts-1', 'Yes');
      loveLanguageService.submitResponse('gifts-1', 'Yes');
      loveLanguageService.submitResponse('time-1', 'Yes');
      loveLanguageService.submitResponse('touch-1', 'Yes');
      
      // Complete the test by submitting all 25 responses
      for (let i = 0; i < 20; i++) {
        loveLanguageService.submitResponse(`question-${i}`, 'Yes');
      }
      
      const result = loveLanguageService.generateResult();
      expect(result).toBeDefined();
      expect(result.primary).toBeDefined();
      expect(result.secondary).toBeDefined();
      expect(result.scores).toBeDefined();
      expect(result.percentages).toBeDefined();
      expect(result.description).toBeDefined();
      expect(result.tips).toBeDefined();
      expect(Array.isArray(result.tips)).toBe(true);
    });

    test('provides population data', () => {
      const populationData = loveLanguageService.getPopulationData();
      expect(populationData.words).toBeDefined();
      expect(populationData.acts).toBeDefined();
      expect(populationData.gifts).toBeDefined();
      expect(populationData.time).toBeDefined();
      expect(populationData.touch).toBeDefined();
    });
  });

  describe('Test Statistics', () => {
    test('provides test statistics', () => {
      loveLanguageService.submitResponse('words-1', 'Yes');
      loveLanguageService.submitResponse('words-2', 'No');
      
      const stats = loveLanguageService.getTestStats();
      expect(stats.totalQuestions).toBe(25);
      expect(stats.answeredQuestions).toBe(2);
      expect(stats.completionRate).toBe(8); // 2/25 * 100
      expect(stats.averageResponseTime).toBe(0); // Placeholder
    });
  });
});
