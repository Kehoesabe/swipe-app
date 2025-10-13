/**
 * ContentService Tests
 * 
 * Tests for the content service that manages questions and responses.
 */

import { contentService, ContentService } from '@/services/contentService';
import { SwipeResult } from '@/types/profile';

describe('ContentService', () => {
  beforeEach(() => {
    // Clear responses before each test
    contentService.clearResponses();
    contentService.resetRotation();
  });

  describe('Content Management', () => {
    test('gets all questions', () => {
      const questions = contentService.getAllQuestions();
      expect(questions).toHaveLength(9);
      expect(questions[0]).toHaveProperty('id');
      expect(questions[0]).toHaveProperty('text');
      expect(questions[0]).toHaveProperty('category');
    });

    test('gets all categories', () => {
      const categories = contentService.getAllCategories();
      expect(categories).toHaveLength(3);
      expect(categories[0]).toHaveProperty('id');
      expect(categories[0]).toHaveProperty('name');
      expect(categories[0]).toHaveProperty('description');
    });

    test('gets questions by category', () => {
      const stockQuestions = contentService.getQuestionsByCategory('stocks');
      expect(stockQuestions).toHaveLength(3);
      expect(stockQuestions.every(q => q.category === 'stocks')).toBe(true);

      const brandQuestions = contentService.getQuestionsByCategory('brand-identity');
      expect(brandQuestions).toHaveLength(3);
      expect(brandQuestions.every(q => q.category === 'brand-identity')).toBe(true);

      const psychQuestions = contentService.getQuestionsByCategory('psychological-tests');
      expect(psychQuestions).toHaveLength(3);
      expect(psychQuestions.every(q => q.category === 'psychological-tests')).toBe(true);
    });

    test('gets current question', () => {
      const current = contentService.getCurrentQuestion();
      expect(current).toBeDefined();
      expect(current.id).toBe('stocks-1');
    });

    test('gets next question in rotation', () => {
      const next = contentService.getNextQuestion();
      expect(next).toBeDefined();
      expect(next.id).toBe('stocks-2');
    });

    test('cycles through all questions', () => {
      const questions = contentService.getAllQuestions();
      const seenIds = new Set();
      
      for (let i = 0; i < questions.length; i++) {
        const current = contentService.getCurrentQuestion();
        seenIds.add(current.id);
        contentService.getNextQuestion();
      }
      
      expect(seenIds.size).toBe(questions.length);
    });

    test('gets random question', () => {
      const random = contentService.getRandomQuestion();
      expect(random).toBeDefined();
      expect(random.id).toBeDefined();
    });
  });

  describe('Response Management', () => {
    test('submits response', () => {
      contentService.submitResponse('stocks-1', 'Yes');
      const responses = contentService.getAllResponses();
      expect(responses).toHaveLength(1);
      expect(responses[0].questionId).toBe('stocks-1');
      expect(responses[0].response).toBe('Yes');
    });

    test('gets responses for specific question', () => {
      contentService.submitResponse('stocks-1', 'Yes');
      contentService.submitResponse('stocks-1', 'No');
      contentService.submitResponse('stocks-2', 'YES!');
      
      const questionResponses = contentService.getQuestionResponses('stocks-1');
      expect(questionResponses).toHaveLength(2);
      expect(questionResponses.every(r => r.questionId === 'stocks-1')).toBe(true);
    });

    test('gets responses for specific category', () => {
      contentService.submitResponse('stocks-1', 'Yes');
      contentService.submitResponse('stocks-2', 'No');
      contentService.submitResponse('brand-1', 'YES!');
      
      const categoryResponses = contentService.getCategoryResponses('stocks');
      expect(categoryResponses).toHaveLength(2);
      expect(categoryResponses.every(r => r.questionId.startsWith('stocks-'))).toBe(true);
    });
  });

  describe('Statistics', () => {
    test('calculates question statistics', () => {
      contentService.submitResponse('stocks-1', 'Yes');
      contentService.submitResponse('stocks-1', 'No');
      contentService.submitResponse('stocks-1', 'YES!');
      
      const stats = contentService.getQuestionStats('stocks-1');
      expect(stats.questionId).toBe('stocks-1');
      expect(stats.totalResponses).toBe(3);
      expect(stats.responses.Yes).toBe(1);
      expect(stats.responses.No).toBe(1);
      expect(stats.responses['YES!']).toBe(1);
      expect(stats.responses['NO!']).toBe(0);
      expect(stats.percentage.Yes).toBeCloseTo(33.33, 1);
      expect(stats.percentage.No).toBeCloseTo(33.33, 1);
      expect(stats.percentage['YES!']).toBeCloseTo(33.33, 1);
    });

    test('calculates category statistics', () => {
      contentService.submitResponse('stocks-1', 'Yes');
      contentService.submitResponse('stocks-2', 'No');
      contentService.submitResponse('brand-1', 'YES!');
      
      const stats = contentService.getCategoryStats('stocks');
      expect(stats.categoryId).toBe('stocks');
      expect(stats.totalResponses).toBe(2);
      expect(stats.responses.Yes).toBe(1);
      expect(stats.responses.No).toBe(1);
      expect(stats.percentage.Yes).toBe(50);
      expect(stats.percentage.No).toBe(50);
    });

    test('calculates overall statistics', () => {
      contentService.submitResponse('stocks-1', 'Yes');
      contentService.submitResponse('stocks-2', 'No');
      contentService.submitResponse('brand-1', 'YES!');
      
      const overallStats = contentService.getOverallStats();
      expect(overallStats.totalResponses).toBe(3);
      expect(overallStats.categoryStats).toHaveLength(3);
      expect(overallStats.questionStats).toHaveLength(9);
    });

    test('handles empty responses', () => {
      const stats = contentService.getQuestionStats('stocks-1');
      expect(stats.totalResponses).toBe(0);
      expect(stats.responses.Yes).toBe(0);
      expect(stats.percentage.Yes).toBe(0);
    });
  });

  describe('Utility Functions', () => {
    test('clears all responses', () => {
      contentService.submitResponse('stocks-1', 'Yes');
      expect(contentService.getAllResponses()).toHaveLength(1);
      
      contentService.clearResponses();
      expect(contentService.getAllResponses()).toHaveLength(0);
    });

    test('resets rotation', () => {
      contentService.getNextQuestion();
      contentService.getNextQuestion();
      expect(contentService.getCurrentQuestion().id).toBe('stocks-3');
      
      contentService.resetRotation();
      expect(contentService.getCurrentQuestion().id).toBe('stocks-1');
    });
  });
});




