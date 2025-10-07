/**
 * Assessment Debug Logger
 * Comprehensive logging system for Swipe Type Assessment testing
 */

import { Question } from '../data/questions';
import { SwipeDirection } from './scoringAlgorithm';

export interface DebugResponse {
  questionId: number;
  questionText: string;
  framework: 'connection' | 'enneagram';
  category: string;
  direction: SwipeDirection;
  rawScore: number;
  finalScore: number;
  isReverse: boolean;
  timestamp: number;
}

export interface DebugScores {
  connectionStyles: {
    verbalAffirmation: number;
    qualityPresence: number;
    physicalCloseness: number;
    supportiveActions: number;
    thoughtfulGestures: number;
    sharedGrowth: number;
  };
  enneagramTypes: {
    type1: number;
    type2: number;
    type3: number;
    type4: number;
    type5: number;
    type6: number;
    type7: number;
    type8: number;
    type9: number;
  };
}

export interface DebugSummary {
  topConnectionStyles: Array<{ name: string; score: number; margin: number }>;
  topEnneagramTypes: Array<{ name: string; score: number; margin: number }>;
  reverseItems: Array<{ questionId: number; text: string; rawScore: number; finalScore: number }>;
  finalSwipeType: string;
  finalSwipeTypeName: string;
  primaryConnection: string;
  primaryEnneagram: string;
}

export class AssessmentDebugLogger {
  private responses: DebugResponse[] = [];
  private startTime: number = Date.now();

  /**
   * Log a user response to a question
   */
  logResponse(
    question: Question,
    direction: SwipeDirection,
    rawScore: number,
    finalScore: number
  ): void {
    const response: DebugResponse = {
      questionId: question.id,
      questionText: question.text,
      framework: question.framework,
      category: question.category,
      direction,
      rawScore,
      finalScore,
      isReverse: question.reverse,
      timestamp: Date.now()
    };

    this.responses.push(response);
    
    console.log(`🔍 DEBUG RESPONSE #${this.responses.length}:`, {
      question: `${question.id}: ${question.text.substring(0, 50)}...`,
      direction,
      rawScore,
      finalScore,
      isReverse: question.reverse,
      framework: question.framework,
      category: question.category
    });
  }

  /**
   * Log final assessment results
   */
  logFinalResults(
    scores: DebugScores,
    swipeType: string,
    swipeTypeName: string,
    primaryConnection: string,
    primaryEnneagram: string
  ): void {
    const summary = this.generateSummary(scores, swipeType, swipeTypeName, primaryConnection, primaryEnneagram);
    
    console.log('🎯 ASSESSMENT COMPLETE - FINAL RESULTS:', {
      totalQuestions: this.responses.length,
      duration: Date.now() - this.startTime,
      finalSwipeType: swipeType,
      finalSwipeTypeName: swipeTypeName,
      primaryConnection,
      primaryEnneagram
    });

    console.log('📊 DETAILED SCORING BREAKDOWN:', scores);
    console.log('🏆 TOP CONNECTION STYLES:', summary.topConnectionStyles);
    console.log('🎭 TOP ENNEAGRAM TYPES:', summary.topEnneagramTypes);
    console.log('🔄 REVERSE ITEMS:', summary.reverseItems);
    
    // Output as formatted JSON for easy copying
    console.log('📋 COMPLETE DEBUG DATA (JSON):', JSON.stringify({
      responses: this.responses,
      scores,
      summary,
      metadata: {
        totalQuestions: this.responses.length,
        duration: Date.now() - this.startTime,
        timestamp: new Date().toISOString()
      }
    }, null, 2));
  }

  /**
   * Generate summary statistics
   */
  private generateSummary(
    scores: DebugScores,
    swipeType: string,
    swipeTypeName: string,
    primaryConnection: string,
    primaryEnneagram: string
  ): DebugSummary {
    // Top 2 Connection Styles
    const connectionEntries = Object.entries(scores.connectionStyles)
      .map(([name, score]) => ({ name, score }))
      .sort((a, b) => b.score - a.score);
    
    const topConnectionStyles = connectionEntries.slice(0, 2).map((item, index) => ({
      ...item,
      margin: index === 0 ? 0 : connectionEntries[0].score - item.score
    }));

    // Top 2 Enneagram Types
    const enneagramEntries = Object.entries(scores.enneagramTypes)
      .map(([name, score]) => ({ name, score }))
      .sort((a, b) => b.score - a.score);
    
    const topEnneagramTypes = enneagramEntries.slice(0, 2).map((item, index) => ({
      ...item,
      margin: index === 0 ? 0 : enneagramEntries[0].score - item.score
    }));

    // All reverse items with score inversions
    const reverseItems = this.responses
      .filter(r => r.isReverse)
      .map(r => ({
        questionId: r.questionId,
        text: r.questionText,
        rawScore: r.rawScore,
        finalScore: r.finalScore
      }));

    return {
      topConnectionStyles,
      topEnneagramTypes,
      reverseItems,
      finalSwipeType: swipeType,
      finalSwipeTypeName: swipeTypeName,
      primaryConnection,
      primaryEnneagram
    };
  }

  /**
   * Get all logged responses
   */
  getResponses(): DebugResponse[] {
    return [...this.responses];
  }

  /**
   * Clear all logged data
   */
  clear(): void {
    this.responses = [];
    this.startTime = Date.now();
  }
}

// Global debug logger instance
export const debugLogger = new AssessmentDebugLogger();
