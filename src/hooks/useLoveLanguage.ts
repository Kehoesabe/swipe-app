/**
 * useLoveLanguage Hook
 * 
 * Manages Love Language test delivery, scoring, and result generation.
 * Adapted from the existing useContent hook for Love Language focus.
 */

import { useState, useEffect, useCallback } from 'react';
import { LoveLanguageQuestion, LoveLanguageResult, LoveLanguageType } from '@/data/loveLanguageContent';
import { loveLanguageService, LoveLanguageResponse } from '@/services/loveLanguageService';
import { SwipeResult } from '@/types/profile';

export interface UseLoveLanguageReturn {
  // Test State
  currentQuestion: LoveLanguageQuestion | null;
  progress: { current: number; total: number; percentage: number };
  isTestCompleted: boolean;
  
  // Navigation
  getRandomQuestion: () => void;
  resetTest: () => void;
  
  // Responses
  submitResponse: (response: SwipeResult) => void;
  getAllResponses: () => LoveLanguageResponse[];
  
  // Results
  generateResult: () => LoveLanguageResult | null;
  getPopulationData: () => Record<LoveLanguageType, number>;
  
  // Statistics
  getTestStats: () => {
    totalQuestions: number;
    answeredQuestions: number;
    completionRate: number;
    averageResponseTime: number;
  };
  
  // State
  loading: boolean;
  error: string | null;
}

export const useLoveLanguage = (): UseLoveLanguageReturn => {
  const [currentQuestion, setCurrentQuestion] = useState<LoveLanguageQuestion | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0, percentage: 0 });
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize test
  useEffect(() => {
    try {
      const firstQuestion = loveLanguageService.getCurrentQuestion();
      const progressData = loveLanguageService.getProgress();
      const completed = loveLanguageService.isTestCompleted();
      
      setCurrentQuestion(firstQuestion);
      setProgress(progressData);
      setIsTestCompleted(completed);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Love Language test');
      setLoading(false);
    }
  }, []);

  // Navigation functions

  const getRandomQuestion = useCallback(() => {
    try {
      const random = loveLanguageService.getRandomQuestion();
      setCurrentQuestion(random);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get random question');
    }
  }, []);

  const resetTest = useCallback(() => {
    try {
      loveLanguageService.resetTest();
      const firstQuestion = loveLanguageService.getCurrentQuestion();
      const progressData = loveLanguageService.getProgress();
      const completed = loveLanguageService.isTestCompleted();
      
      setCurrentQuestion(firstQuestion);
      setProgress(progressData);
      setIsTestCompleted(completed);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset test');
    }
  }, []);

  // Response functions
  const submitResponse = useCallback((response: SwipeResult) => {
    if (!currentQuestion) return;
    
    try {
      loveLanguageService.submitResponse(currentQuestion.id, response);
      const progressData = loveLanguageService.getProgress();
      const completed = loveLanguageService.isTestCompleted();
      
      setProgress(progressData);
      setIsTestCompleted(completed);
      
      // Move to next question after response
      const next = loveLanguageService.getNextQuestion();
      setCurrentQuestion(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit response');
    }
  }, [currentQuestion]);

  const getAllResponses = useCallback((): LoveLanguageResponse[] => {
    return loveLanguageService.getAllResponses();
  }, []);

  // Results functions
  const generateResult = useCallback((): LoveLanguageResult | null => {
    if (!isTestCompleted) return null;
    
    try {
      return loveLanguageService.generateResult();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate result');
      return null;
    }
  }, [isTestCompleted]);

  const getPopulationData = useCallback(() => {
    return loveLanguageService.getPopulationData();
  }, []);

  // Statistics functions
  const getTestStats = useCallback(() => {
    return loveLanguageService.getTestStats();
  }, []);

  return {
    // Test State
    currentQuestion,
    progress,
    isTestCompleted,
    
    // Navigation
    getRandomQuestion,
    resetTest,
    
    // Responses
    submitResponse,
    getAllResponses,
    
    // Results
    generateResult,
    getPopulationData,
    
    // Statistics
    getTestStats,
    
    // State
    loading,
    error
  };
};
