/**
 * Love Language Service
 * 
 * Manages Love Language test delivery, scoring, and result generation.
 * Adapted from the existing content service for Love Language focus.
 */

import { 
  LoveLanguageQuestion, 
  LoveLanguageResult, 
  LoveLanguageType, 
  LOVE_LANGUAGE_QUESTIONS,
  LOVE_LANGUAGE_DESCRIPTIONS,
  LOVE_LANGUAGE_TIPS,
  LOVE_LANGUAGE_POPULATION_DATA
} from '@/data/loveLanguageContent';
import { SwipeResult } from '@/types/profile';

export interface LoveLanguageResponse {
  questionId: string;
  response: SwipeResult;
  timestamp: Date;
  userId?: string;
}

export class LoveLanguageService {
  private responses: LoveLanguageResponse[] = [];
  private currentQuestionIndex: number = 0;
  private testCompleted: boolean = false;

  /**
   * Get all Love Language questions
   */
  getAllQuestions(): LoveLanguageQuestion[] {
    return LOVE_LANGUAGE_QUESTIONS;
  }

  /**
   * Get current question
   */
  getCurrentQuestion(): LoveLanguageQuestion | null {
    if (this.currentQuestionIndex >= LOVE_LANGUAGE_QUESTIONS.length) {
      return null;
    }
    return LOVE_LANGUAGE_QUESTIONS[this.currentQuestionIndex];
  }

  /**
   * Get next question
   */
  getNextQuestion(): LoveLanguageQuestion | null {
    this.currentQuestionIndex++;
    return this.getCurrentQuestion();
  }


  /**
   * Get random question
   */
  getRandomQuestion(): LoveLanguageQuestion {
    const randomIndex = Math.floor(Math.random() * LOVE_LANGUAGE_QUESTIONS.length);
    this.currentQuestionIndex = randomIndex;
    return LOVE_LANGUAGE_QUESTIONS[randomIndex];
  }

  /**
   * Submit a response
   */
  submitResponse(questionId: string, response: SwipeResult, userId?: string): void {
    const questionResponse: LoveLanguageResponse = {
      questionId,
      response,
      timestamp: new Date(),
      userId
    };

    this.responses.push(questionResponse);
    
    // Check if test is completed
    if (this.responses.length >= LOVE_LANGUAGE_QUESTIONS.length) {
      this.testCompleted = true;
    }
  }

  /**
   * Get test progress
   */
  getProgress(): { current: number; total: number; percentage: number } {
    return {
      current: this.responses.length,
      total: LOVE_LANGUAGE_QUESTIONS.length,
      percentage: (this.responses.length / LOVE_LANGUAGE_QUESTIONS.length) * 100
    };
  }

  /**
   * Check if test is completed
   */
  isTestCompleted(): boolean {
    // Test is completed when we have all 25 responses
    return this.responses.length >= LOVE_LANGUAGE_QUESTIONS.length;
  }

  /**
   * Calculate Love Language scores
   */
  calculateScores(): Record<LoveLanguageType, number> {
    const scores: Record<LoveLanguageType, number> = {
      words: 0,
      acts: 0,
      gifts: 0,
      time: 0,
      touch: 0
    };

    this.responses.forEach(response => {
      const question = LOVE_LANGUAGE_QUESTIONS.find(q => q.id === response.questionId);
      if (!question) return;

      let responseValue = 0;
      switch (response.response) {
        case 'Yes':
          responseValue = 2;
          break;
        case 'YES!':
          responseValue = 3;
          break;
        case 'No':
          responseValue = 0;
          break;
        case 'NO!':
          responseValue = -1;
          break;
      }

      // Apply question weight and positive direction
      const weightedValue = responseValue * question.weight;
      const finalValue = question.positive ? weightedValue : -weightedValue;
      
      // Add points to the category
      scores[question.category] += finalValue;
    });

    return scores;
  }

  /**
   * Generate Love Language result
   */
  generateResult(): LoveLanguageResult {
    const scores = this.calculateScores();
    
    // Find primary and secondary love languages
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const primary = sortedScores[0][0] as LoveLanguageType;
    const secondary = sortedScores[1][0] as LoveLanguageType;

    // Calculate percentages that sum to 100%
    // First, normalize to positive values by shifting all scores up
    const scoreValues = Object.values(scores);
    const minScore = Math.min(...scoreValues);
    const shiftedScores = {
      words: scores.words - minScore,
      acts: scores.acts - minScore,
      gifts: scores.gifts - minScore,
      time: scores.time - minScore,
      touch: scores.touch - minScore
    };
    
    // Calculate total of shifted scores
    const totalShiftedScore = Object.values(shiftedScores).reduce((sum, score) => sum + score, 0);
    
    // If all scores are the same (total is 0), distribute evenly
    if (totalShiftedScore === 0) {
      const percentages: Record<LoveLanguageType, number> = {
        words: 20,
        acts: 20,
        gifts: 20,
        time: 20,
        touch: 20
      };
      return {
        primary,
        secondary,
        scores,
        percentages,
        description: LOVE_LANGUAGE_DESCRIPTIONS[primary],
        tips: LOVE_LANGUAGE_TIPS[primary]
      };
    }
    
    // Calculate percentages that sum to 100%
    const percentages: Record<LoveLanguageType, number> = {
      words: (shiftedScores.words / totalShiftedScore) * 100,
      acts: (shiftedScores.acts / totalShiftedScore) * 100,
      gifts: (shiftedScores.gifts / totalShiftedScore) * 100,
      time: (shiftedScores.time / totalShiftedScore) * 100,
      touch: (shiftedScores.touch / totalShiftedScore) * 100
    };

    return {
      primary,
      secondary,
      scores,
      percentages,
      description: LOVE_LANGUAGE_DESCRIPTIONS[primary],
      tips: LOVE_LANGUAGE_TIPS[primary]
    };
  }

  /**
   * Get population comparison data
   */
  getPopulationData(): Record<LoveLanguageType, number> {
    return LOVE_LANGUAGE_POPULATION_DATA;
  }

  /**
   * Get all responses
   */
  getAllResponses(): LoveLanguageResponse[] {
    return this.responses;
  }

  /**
   * Clear all responses (for retaking test)
   */
  clearResponses(): void {
    this.responses = [];
    this.currentQuestionIndex = 0;
    this.testCompleted = false;
  }

  /**
   * Reset test progress
   */
  resetTest(): void {
    this.clearResponses();
  }

  /**
   * Get test statistics
   */
  getTestStats(): {
    totalQuestions: number;
    answeredQuestions: number;
    completionRate: number;
    averageResponseTime: number;
  } {
    const totalQuestions = LOVE_LANGUAGE_QUESTIONS.length;
    const answeredQuestions = this.responses.length;
    const completionRate = (answeredQuestions / totalQuestions) * 100;
    
    // Calculate average response time (placeholder - would need timestamps)
    const averageResponseTime = 0; // TODO: Implement response time tracking

    return {
      totalQuestions,
      answeredQuestions,
      completionRate,
      averageResponseTime
    };
  }
}

// Export singleton instance
export const loveLanguageService = new LoveLanguageService();
