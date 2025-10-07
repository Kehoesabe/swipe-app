/**
 * Content Service
 * 
 * Manages content delivery, question rotation, and response collection
 * for the Swipe Platform MVP.
 */

import { Question, Category, QUESTIONS, CATEGORIES } from '@/data/content';
import { SwipeResult } from '@/types/profile';

export interface QuestionResponse {
  questionId: string;
  response: SwipeResult;
  timestamp: Date;
  userId?: string;
}

export interface CategoryStats {
  categoryId: string;
  totalResponses: number;
  responses: Record<SwipeResult, number>;
  percentage: Record<SwipeResult, number>;
}

export interface QuestionStats {
  questionId: string;
  totalResponses: number;
  responses: Record<SwipeResult, number>;
  percentage: Record<SwipeResult, number>;
}

export class ContentService {
  private responses: QuestionResponse[] = [];
  private currentQuestionIndex: number = 0;

  /**
   * Get all available questions
   */
  getAllQuestions(): Question[] {
    return QUESTIONS;
  }

  /**
   * Get all available categories
   */
  getAllCategories(): Category[] {
    return CATEGORIES;
  }

  /**
   * Get questions by category
   */
  getQuestionsByCategory(categoryId: string): Question[] {
    return QUESTIONS.filter(question => question.category === categoryId);
  }

  /**
   * Get current question (for rotation)
   */
  getCurrentQuestion(): Question {
    return QUESTIONS[this.currentQuestionIndex];
  }

  /**
   * Get next question in rotation
   */
  getNextQuestion(): Question {
    this.currentQuestionIndex = (this.currentQuestionIndex + 1) % QUESTIONS.length;
    return this.getCurrentQuestion();
  }

  /**
   * Get random question
   */
  getRandomQuestion(): Question {
    const randomIndex = Math.floor(Math.random() * QUESTIONS.length);
    this.currentQuestionIndex = randomIndex;
    return QUESTIONS[randomIndex];
  }

  /**
   * Submit a response to a question
   */
  submitResponse(questionId: string, response: SwipeResult, userId?: string): void {
    const questionResponse: QuestionResponse = {
      questionId,
      response,
      timestamp: new Date(),
      userId
    };

    this.responses.push(questionResponse);
  }

  /**
   * Get all responses
   */
  getAllResponses(): QuestionResponse[] {
    return this.responses;
  }

  /**
   * Get responses for a specific question
   */
  getQuestionResponses(questionId: string): QuestionResponse[] {
    return this.responses.filter(response => response.questionId === questionId);
  }

  /**
   * Get responses for a specific category
   */
  getCategoryResponses(categoryId: string): QuestionResponse[] {
    const categoryQuestions = this.getQuestionsByCategory(categoryId);
    const questionIds = categoryQuestions.map(q => q.id);
    return this.responses.filter(response => questionIds.includes(response.questionId));
  }

  /**
   * Get statistics for a specific question
   */
  getQuestionStats(questionId: string): QuestionStats {
    const questionResponses = this.getQuestionResponses(questionId);
    const totalResponses = questionResponses.length;

    const responses: Record<SwipeResult, number> = {
      'Yes': 0,
      'No': 0,
      'YES!': 0,
      'NO!': 0
    };

    questionResponses.forEach(response => {
      responses[response.response]++;
    });

    const percentage: Record<SwipeResult, number> = {
      'Yes': totalResponses > 0 ? (responses['Yes'] / totalResponses) * 100 : 0,
      'No': totalResponses > 0 ? (responses['No'] / totalResponses) * 100 : 0,
      'YES!': totalResponses > 0 ? (responses['YES!'] / totalResponses) * 100 : 0,
      'NO!': totalResponses > 0 ? (responses['NO!'] / totalResponses) * 100 : 0
    };

    return {
      questionId,
      totalResponses,
      responses,
      percentage
    };
  }

  /**
   * Get statistics for a specific category
   */
  getCategoryStats(categoryId: string): CategoryStats {
    const categoryResponses = this.getCategoryResponses(categoryId);
    const totalResponses = categoryResponses.length;

    const responses: Record<SwipeResult, number> = {
      'Yes': 0,
      'No': 0,
      'YES!': 0,
      'NO!': 0
    };

    categoryResponses.forEach(response => {
      responses[response.response]++;
    });

    const percentage: Record<SwipeResult, number> = {
      'Yes': totalResponses > 0 ? (responses['Yes'] / totalResponses) * 100 : 0,
      'No': totalResponses > 0 ? (responses['No'] / totalResponses) * 100 : 0,
      'YES!': totalResponses > 0 ? (responses['YES!'] / totalResponses) * 100 : 0,
      'NO!': totalResponses > 0 ? (responses['NO!'] / totalResponses) * 100 : 0
    };

    return {
      categoryId,
      totalResponses,
      responses,
      percentage
    };
  }

  /**
   * Get overall platform statistics
   */
  getOverallStats(): {
    totalResponses: number;
    categoryStats: CategoryStats[];
    questionStats: QuestionStats[];
  } {
    const totalResponses = this.responses.length;
    const categoryStats = CATEGORIES.map(category => this.getCategoryStats(category.id));
    const questionStats = QUESTIONS.map(question => this.getQuestionStats(question.id));

    return {
      totalResponses,
      categoryStats,
      questionStats
    };
  }

  /**
   * Clear all responses (for testing)
   */
  clearResponses(): void {
    this.responses = [];
  }

  /**
   * Reset question rotation
   */
  resetRotation(): void {
    this.currentQuestionIndex = 0;
  }
}

// Export singleton instance
export const contentService = new ContentService();


