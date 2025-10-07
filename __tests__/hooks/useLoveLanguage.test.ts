/**
 * useLoveLanguage Hook Tests
 * 
 * Tests for the useLoveLanguage hook that manages Love Language test state.
 */

import { renderHook, act } from '@testing-library/react-native';
import { useLoveLanguage } from '@/hooks/useLoveLanguage';
import { SwipeResult } from '@/types/profile';

// Mock the love language service
jest.mock('@/services/loveLanguageService', () => ({
  loveLanguageService: {
    getCurrentQuestion: jest.fn(() => ({ 
      id: 'words-1', 
      text: 'Test question', 
      category: 'words', 
      weight: 1, 
      positive: true 
    })),
    getNextQuestion: jest.fn(() => ({ 
      id: 'words-2', 
      text: 'Next question', 
      category: 'words', 
      weight: 1, 
      positive: true 
    })),
    getRandomQuestion: jest.fn(() => ({ 
      id: 'words-1', 
      text: 'Random question', 
      category: 'words', 
      weight: 1, 
      positive: true 
    })),
    getProgress: jest.fn(() => ({ current: 0, total: 25, percentage: 0 })),
    isTestCompleted: jest.fn(() => false),
    submitResponse: jest.fn(),
    getAllResponses: jest.fn(() => []),
    generateResult: jest.fn(() => ({
      primary: 'words',
      secondary: 'acts',
      scores: { words: 5, acts: 3, gifts: 1, time: 2, touch: 1 },
      percentages: { words: 50, acts: 30, gifts: 10, time: 20, touch: 10 },
      description: 'Words of Affirmation',
      tips: ['Give yourself credit today.']
    })),
    getPopulationData: jest.fn(() => ({
      words: 23,
      acts: 20,
      gifts: 19,
      time: 20,
      touch: 18
    })),
    getTestStats: jest.fn(() => ({
      totalQuestions: 25,
      answeredQuestions: 0,
      completionRate: 0,
      averageResponseTime: 0
    })),
    resetTest: jest.fn()
  }
}));

describe('useLoveLanguage Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns initial state', () => {
    const { result } = renderHook(() => useLoveLanguage());

    expect(result.current.currentQuestion).toBeDefined();
    expect(result.current.progress).toEqual({ current: 0, total: 25, percentage: 0 });
    expect(result.current.isTestCompleted).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('provides navigation functions', () => {
    const { result } = renderHook(() => useLoveLanguage());

    expect(typeof result.current.nextQuestion).toBe('function');
    expect(typeof result.current.getRandomQuestion).toBe('function');
    expect(typeof result.current.resetTest).toBe('function');
  });

  test('provides response functions', () => {
    const { result } = renderHook(() => useLoveLanguage());

    expect(typeof result.current.submitResponse).toBe('function');
    expect(typeof result.current.getAllResponses).toBe('function');
  });

  test('provides results functions', () => {
    const { result } = renderHook(() => useLoveLanguage());

    expect(typeof result.current.generateResult).toBe('function');
    expect(typeof result.current.getPopulationData).toBe('function');
  });

  test('provides statistics functions', () => {
    const { result } = renderHook(() => useLoveLanguage());

    expect(typeof result.current.getTestStats).toBe('function');
  });

  test('calls nextQuestion', () => {
    const { result } = renderHook(() => useLoveLanguage());

    act(() => {
      result.current.nextQuestion();
    });

    expect(require('@/services/loveLanguageService').loveLanguageService.getNextQuestion).toHaveBeenCalled();
  });

  test('calls getRandomQuestion', () => {
    const { result } = renderHook(() => useLoveLanguage());

    act(() => {
      result.current.getRandomQuestion();
    });

    expect(require('@/services/loveLanguageService').loveLanguageService.getRandomQuestion).toHaveBeenCalled();
  });

  test('calls resetTest', () => {
    const { result } = renderHook(() => useLoveLanguage());

    act(() => {
      result.current.resetTest();
    });

    expect(require('@/services/loveLanguageService').loveLanguageService.resetTest).toHaveBeenCalled();
  });

  test('calls submitResponse', () => {
    const { result } = renderHook(() => useLoveLanguage());

    act(() => {
      result.current.submitResponse('Yes' as SwipeResult);
    });

    expect(require('@/services/loveLanguageService').loveLanguageService.submitResponse).toHaveBeenCalledWith(
      'words-1',
      'Yes'
    );
  });

  test('calls getAllResponses', () => {
    const { result } = renderHook(() => useLoveLanguage());

    act(() => {
      result.current.getAllResponses();
    });

    expect(require('@/services/loveLanguageService').loveLanguageService.getAllResponses).toHaveBeenCalled();
  });

  test('calls generateResult', () => {
    // Mock isTestCompleted to return true so generateResult can be called
    const mockService = require('@/services/loveLanguageService').loveLanguageService;
    mockService.isTestCompleted.mockReturnValue(true);

    const { result } = renderHook(() => useLoveLanguage());

    act(() => {
      result.current.generateResult();
    });

    expect(mockService.generateResult).toHaveBeenCalled();
  });

  test('calls getPopulationData', () => {
    const { result } = renderHook(() => useLoveLanguage());

    act(() => {
      result.current.getPopulationData();
    });

    expect(require('@/services/loveLanguageService').loveLanguageService.getPopulationData).toHaveBeenCalled();
  });

  test('calls getTestStats', () => {
    const { result } = renderHook(() => useLoveLanguage());

    act(() => {
      result.current.getTestStats();
    });

    expect(require('@/services/loveLanguageService').loveLanguageService.getTestStats).toHaveBeenCalled();
  });
});
