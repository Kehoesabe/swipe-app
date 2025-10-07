/**
 * useContent Hook Tests
 * 
 * Tests for the useContent hook that manages content delivery and responses.
 */

import { renderHook, act } from '@testing-library/react-native';
import { useContent } from '@/hooks/useContent';
import { SwipeResult } from '@/types/profile';

// Mock the content service
jest.mock('@/services/contentService', () => ({
  contentService: {
    getAllQuestions: jest.fn(() => [
      { id: 'test-1', category: 'stocks', text: 'Test question 1' },
      { id: 'test-2', category: 'stocks', text: 'Test question 2' }
    ]),
    getAllCategories: jest.fn(() => [
      { id: 'stocks', name: 'Stock Market', description: 'Test category' }
    ]),
    getCurrentQuestion: jest.fn(() => ({ id: 'test-1', category: 'stocks', text: 'Test question 1' })),
    getNextQuestion: jest.fn(() => ({ id: 'test-2', category: 'stocks', text: 'Test question 2' })),
    getRandomQuestion: jest.fn(() => ({ id: 'test-1', category: 'stocks', text: 'Test question 1' })),
    submitResponse: jest.fn(),
    getQuestionResponses: jest.fn(() => []),
    getCategoryResponses: jest.fn(() => []),
    getQuestionStats: jest.fn(() => ({
      questionId: 'test-1',
      totalResponses: 0,
      responses: { Yes: 0, No: 0, 'YES!': 0, 'NO!': 0 },
      percentage: { Yes: 0, No: 0, 'YES!': 0, 'NO!': 0 }
    })),
    getCategoryStats: jest.fn(() => ({
      categoryId: 'stocks',
      totalResponses: 0,
      responses: { Yes: 0, No: 0, 'YES!': 0, 'NO!': 0 },
      percentage: { Yes: 0, No: 0, 'YES!': 0, 'NO!': 0 }
    })),
    getOverallStats: jest.fn(() => ({
      totalResponses: 0,
      categoryStats: [],
      questionStats: []
    })),
    resetRotation: jest.fn()
  }
}));

describe('useContent Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns initial state', () => {
    const { result } = renderHook(() => useContent());

    expect(result.current.currentQuestion).toBeDefined();
    expect(result.current.allQuestions).toHaveLength(2);
    expect(result.current.allCategories).toHaveLength(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('provides navigation functions', () => {
    const { result } = renderHook(() => useContent());

    expect(typeof result.current.nextQuestion).toBe('function');
    expect(typeof result.current.getRandomQuestion).toBe('function');
    expect(typeof result.current.resetRotation).toBe('function');
  });

  test('provides response functions', () => {
    const { result } = renderHook(() => useContent());

    expect(typeof result.current.submitResponse).toBe('function');
    expect(typeof result.current.getQuestionResponses).toBe('function');
    expect(typeof result.current.getCategoryResponses).toBe('function');
  });

  test('provides statistics functions', () => {
    const { result } = renderHook(() => useContent());

    expect(typeof result.current.getQuestionStats).toBe('function');
    expect(typeof result.current.getCategoryStats).toBe('function');
    expect(typeof result.current.getOverallStats).toBe('function');
  });

  test('calls nextQuestion', () => {
    const { result } = renderHook(() => useContent());

    act(() => {
      result.current.nextQuestion();
    });

    expect(require('@/services/contentService').contentService.getNextQuestion).toHaveBeenCalled();
  });

  test('calls getRandomQuestion', () => {
    const { result } = renderHook(() => useContent());

    act(() => {
      result.current.getRandomQuestion();
    });

    expect(require('@/services/contentService').contentService.getRandomQuestion).toHaveBeenCalled();
  });

  test('calls resetRotation', () => {
    const { result } = renderHook(() => useContent());

    act(() => {
      result.current.resetRotation();
    });

    expect(require('@/services/contentService').contentService.resetRotation).toHaveBeenCalled();
  });

  test('calls submitResponse', () => {
    const { result } = renderHook(() => useContent());

    act(() => {
      result.current.submitResponse('Yes' as SwipeResult);
    });

    expect(require('@/services/contentService').contentService.submitResponse).toHaveBeenCalledWith(
      'test-1',
      'Yes'
    );
  });

  test('calls getQuestionResponses', () => {
    const { result } = renderHook(() => useContent());

    act(() => {
      result.current.getQuestionResponses('test-1');
    });

    expect(require('@/services/contentService').contentService.getQuestionResponses).toHaveBeenCalledWith('test-1');
  });

  test('calls getCategoryResponses', () => {
    const { result } = renderHook(() => useContent());

    act(() => {
      result.current.getCategoryResponses('stocks');
    });

    expect(require('@/services/contentService').contentService.getCategoryResponses).toHaveBeenCalledWith('stocks');
  });

  test('calls getQuestionStats', () => {
    const { result } = renderHook(() => useContent());

    act(() => {
      result.current.getQuestionStats('test-1');
    });

    expect(require('@/services/contentService').contentService.getQuestionStats).toHaveBeenCalledWith('test-1');
  });

  test('calls getCategoryStats', () => {
    const { result } = renderHook(() => useContent());

    act(() => {
      result.current.getCategoryStats('stocks');
    });

    expect(require('@/services/contentService').contentService.getCategoryStats).toHaveBeenCalledWith('stocks');
  });

  test('calls getOverallStats', () => {
    const { result } = renderHook(() => useContent());

    act(() => {
      result.current.getOverallStats();
    });

    expect(require('@/services/contentService').contentService.getOverallStats).toHaveBeenCalled();
  });
});


