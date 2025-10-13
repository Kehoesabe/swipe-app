/**
 * useContent Hook
 * 
 * Manages content delivery, question rotation, and response collection
 * for the Swipe Platform MVP.
 */

import { useState, useEffect, useCallback } from 'react';
import { Question, Category } from '@/data/content';
import { contentService, QuestionResponse, QuestionStats, CategoryStats } from '@/services/contentService';
import { SwipeResult } from '@/types/profile';

export interface UseContentReturn {
  // Content
  currentQuestion: Question | null;
  allQuestions: Question[];
  allCategories: Category[];
  
  // Navigation
  nextQuestion: () => void;
  getRandomQuestion: () => void;
  resetRotation: () => void;
  
  // Responses
  submitResponse: (response: SwipeResult) => void;
  getQuestionResponses: (questionId: string) => QuestionResponse[];
  getCategoryResponses: (categoryId: string) => QuestionResponse[];
  
  // Statistics
  getQuestionStats: (questionId: string) => QuestionStats;
  getCategoryStats: (categoryId: string) => CategoryStats;
  getOverallStats: () => {
    totalResponses: number;
    categoryStats: CategoryStats[];
    questionStats: QuestionStats[];
  };
  
  // State
  loading: boolean;
  error: string | null;
}

export const useContent = (): UseContentReturn => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize content
  useEffect(() => {
    try {
      const questions = contentService.getAllQuestions();
      const categories = contentService.getAllCategories();
      
      setAllQuestions(questions);
      setAllCategories(categories);
      setCurrentQuestion(questions[0] || null);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
      setLoading(false);
    }
  }, []);

  // Navigation functions
  const nextQuestion = useCallback(() => {
    try {
      const next = contentService.getNextQuestion();
      setCurrentQuestion(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get next question');
    }
  }, []);

  const getRandomQuestion = useCallback(() => {
    try {
      const random = contentService.getRandomQuestion();
      setCurrentQuestion(random);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get random question');
    }
  }, []);

  const resetRotation = useCallback(() => {
    try {
      contentService.resetRotation();
      const first = contentService.getCurrentQuestion();
      setCurrentQuestion(first);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset rotation');
    }
  }, []);

  // Response functions
  const submitResponse = useCallback((response: SwipeResult) => {
    if (!currentQuestion) return;
    
    try {
      contentService.submitResponse(currentQuestion.id, response);
      // Move to next question after response
      nextQuestion();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit response');
    }
  }, [currentQuestion, nextQuestion]);

  const getQuestionResponses = useCallback((questionId: string): QuestionResponse[] => {
    return contentService.getQuestionResponses(questionId);
  }, []);

  const getCategoryResponses = useCallback((categoryId: string): QuestionResponse[] => {
    return contentService.getCategoryResponses(categoryId);
  }, []);

  // Statistics functions
  const getQuestionStats = useCallback((questionId: string): QuestionStats => {
    return contentService.getQuestionStats(questionId);
  }, []);

  const getCategoryStats = useCallback((categoryId: string): CategoryStats => {
    return contentService.getCategoryStats(categoryId);
  }, []);

  const getOverallStats = useCallback(() => {
    return contentService.getOverallStats();
  }, []);

  return {
    // Content
    currentQuestion,
    allQuestions,
    allCategories,
    
    // Navigation
    nextQuestion,
    getRandomQuestion,
    resetRotation,
    
    // Responses
    submitResponse,
    getQuestionResponses,
    getCategoryResponses,
    
    // Statistics
    getQuestionStats,
    getCategoryStats,
    getOverallStats,
    
    // State
    loading,
    error
  };
};




