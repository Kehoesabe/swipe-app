import { Question } from '../data/questions';
import { ConnectionStyle, EnneagramType, SwipeTypeName } from './types';
import { getSwipeType } from '../data/swipeTypeMapping';

export type SwipeDirection = 'up' | 'right' | 'left' | 'down';
export type SwipeResult = 'YES!' | 'Yes' | 'No' | 'NO!';

export interface AssessmentResponse {
  questionId: number;
  direction: SwipeDirection;
  result: SwipeResult;
  timestamp: Date;
}

export interface AssessmentScores {
  connectionStyles: Record<ConnectionStyle, number>;
  enneagramTypes: Record<EnneagramType, number>;
}

export interface AssessmentResult {
  sessionId: string;
  swipeType: SwipeTypeName;
  swipeTypeName: string;
  primaryConnection: ConnectionStyle;
  primaryEnneagram: EnneagramType;
  detailedCombo: string;
  method: 'assessment' | 'direct_input';
  calculatedAt: Date;
  scores: AssessmentScores;
}

export class AssessmentScoring {
  private responses: AssessmentResponse[] = [];
  private currentQuestionIndex: number = 0;
  private questions: Question[];

  constructor(questions: Question[]) {
    this.questions = questions;
  }

  /**
   * Submit a response to a question
   */
  submitResponse(questionId: number, direction: SwipeDirection): void {
    const question = this.questions.find(q => q.id === questionId);
    if (!question) {
      throw new Error(`Question with id ${questionId} not found`);
    }

    const result = this.getSwipeResult(direction);
    const response: AssessmentResponse = {
      questionId,
      direction,
      result,
      timestamp: new Date()
    };

    this.responses.push(response);
    
    // Only increment if we haven't reached the end
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  /**
   * Get current question
   */
  getCurrentQuestion(): Question | null {
    if (this.currentQuestionIndex >= this.questions.length) {
      return null;
    }
    return this.questions[this.currentQuestionIndex];
  }

  /**
   * Get next question
   */
  getNextQuestion(): Question | null {
    this.currentQuestionIndex++;
    // Check bounds before returning
    if (this.currentQuestionIndex >= this.questions.length) {
      return null;
    }
    return this.questions[this.currentQuestionIndex];
  }

  /**
   * Undo last response and go back to previous question
   */
  undoLastResponse(): Question | null {
    if (this.responses.length > 0) {
      // Remove the last response
      this.responses.pop();
    }
    
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
    
    return this.getCurrentQuestion();
  }

  /**
   * Check if assessment is completed
   */
  isCompleted(): boolean {
    const responsesComplete = this.responses.length >= this.questions.length;
    const indexComplete = this.currentQuestionIndex >= this.questions.length;
    const isCompleted = responsesComplete || indexComplete;
    
    console.log('🔍 SCORING COMPLETION CHECK:', {
      responsesLength: this.responses.length,
      questionsLength: this.questions.length,
      currentIndex: this.currentQuestionIndex,
      responsesComplete,
      indexComplete,
      isCompleted
    });
    
    return isCompleted;
  }

  /**
   * Get progress information
   */
  getProgress(): { current: number; total: number; percentage: number } {
    const current = this.responses.length;
    const total = this.questions.length;
    const percentage = (current / total) * 100;
    
    return { current, total, percentage };
  }

  /**
   * Calculate scores for all categories
   */
  calculateScores(): AssessmentScores {
    const connectionStyles: Record<ConnectionStyle, number> = {
      verbalAffirmation: 0,
      qualityPresence: 0,
      physicalCloseness: 0,
      supportiveActions: 0,
      thoughtfulGestures: 0,
      sharedGrowth: 0
    };

    const enneagramTypes: Record<EnneagramType, number> = {
      type1: 0, type2: 0, type3: 0, type4: 0, type5: 0,
      type6: 0, type7: 0, type8: 0, type9: 0
    };

    // Process each response
    this.responses.forEach(response => {
      const question = this.questions.find(q => q.id === response.questionId);
      if (!question) return;

      // Get the weight for this direction
      const weight = question.weight[response.direction];
      
      // Apply the weight to the appropriate category
      if (question.framework === 'connection') {
        const category = question.category as ConnectionStyle;
        if (category in connectionStyles) {
          connectionStyles[category] += weight;
        }
      } else if (question.framework === 'enneagram') {
        const category = question.category as EnneagramType;
        if (category in enneagramTypes) {
          enneagramTypes[category] += weight;
        }
      }
    });

    return { connectionStyles, enneagramTypes };
  }

  /**
   * Determine primary connection style
   */
  getPrimaryConnectionStyle(scores: AssessmentScores): ConnectionStyle {
    const connectionScores = Object.entries(scores.connectionStyles);
    const sorted = connectionScores.sort((a, b) => b[1] - a[1]);
    return sorted[0][0] as ConnectionStyle;
  }

  /**
   * Determine primary enneagram type
   */
  getPrimaryEnneagramType(scores: AssessmentScores): EnneagramType {
    const enneagramScores = Object.entries(scores.enneagramTypes);
    const sorted = enneagramScores.sort((a, b) => b[1] - a[1]);
    return sorted[0][0] as EnneagramType;
  }

  /**
   * Generate final assessment result
   */
  generateResult(): AssessmentResult {
    if (!this.isCompleted()) {
      throw new Error('Assessment not completed');
    }

    const scores = this.calculateScores();
    const primaryConnection = this.getPrimaryConnectionStyle(scores);
    const primaryEnneagram = this.getPrimaryEnneagramType(scores);
    const swipeType = getSwipeType(primaryConnection, primaryEnneagram);

    return {
      sessionId: Date.now().toString(),
      swipeType,
      swipeTypeName: this.getSwipeTypeDisplayName(swipeType),
      primaryConnection,
      primaryEnneagram,
      detailedCombo: `${primaryConnection}_${primaryEnneagram}`,
      method: 'assessment',
      calculatedAt: new Date(),
      scores
    };
  }

  /**
   * Get all responses
   */
  getAllResponses(): AssessmentResponse[] {
    return [...this.responses];
  }

  /**
   * Reset assessment
   */
  reset(): void {
    this.responses = [];
    this.currentQuestionIndex = 0;
  }

  /**
   * Convert swipe direction to result
   */
  private getSwipeResult(direction: SwipeDirection): SwipeResult {
    switch (direction) {
      case 'up': return 'YES!';
      case 'right': return 'Yes';
      case 'left': return 'No';
      case 'down': return 'NO!';
    }
  }

  /**
   * Get display name for swipe type
   */
  private getSwipeTypeDisplayName(swipeType: SwipeTypeName): string {
    const names: Record<SwipeTypeName, string> = {
      solidRock: 'Solid Rock',
      watchfulGuard: 'Watchful Guard',
      warmHeart: 'Warm Heart',
      gentleGuide: 'Gentle Guide',
      deepConnector: 'Deep Connector',
      authenticSoul: 'Authentic Soul',
      progressPartner: 'Progress Partner',
      freeSpirit: 'Free Spirit',
    };
    return names[swipeType] || swipeType;
  }
}
