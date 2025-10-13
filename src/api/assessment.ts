/**
 * Assessment API - Core Assessment Flow
 * 
 * Handles assessment session management, response capture, and scoring
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

import { questions } from '../data/questions';
import { AssessmentScoring } from '../lib/scoringAlgorithm';
import { SwipeDirection } from '../lib/scoringAlgorithm';

export interface AssessmentSession {
  id: string;
  userId?: string;
  startedAt: string;
  completedAt?: string;
  currentQuestion: number;
  responses: Record<number, SwipeDirection>;
  isComplete: boolean;
}

export interface AssessmentResponse {
  questionId: number;
  direction: SwipeDirection;
  timestamp: string;
}

export interface AssessmentResult {
  sessionId: string;
  swipeType: string;
  swipeTypeName: string;
  scores: {
    domains: Record<string, number>;
    channels: Record<string, number>;
    axes: {
      directness: number;
      tangibility: number;
    };
  };
  confidence: number;
  completedAt: string;
}

// In-memory storage for MVP (replace with database in production)
const sessions: Map<string, AssessmentSession> = new Map();
const responses: Map<string, AssessmentResponse[]> = new Map();

/**
 * Start a new assessment session
 */
export async function startAssessment(userId?: string): Promise<AssessmentSession> {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const session: AssessmentSession = {
    id: sessionId,
    userId,
    startedAt: new Date().toISOString(),
    currentQuestion: 1,
    responses: {},
    isComplete: false
  };
  
  sessions.set(sessionId, session);
  responses.set(sessionId, []);
  
  console.log(`📝 Assessment session started: ${sessionId}`);
  return session;
}

/**
 * Save assessment progress
 */
export async function saveProgress(
  sessionId: string, 
  questionId: number, 
  direction: SwipeDirection
): Promise<AssessmentSession> {
  // CRITICAL DEBUG: Track question 56 save attempts
  console.log(`🔍 saveProgress called for Q${questionId}, direction: ${direction}`);
  if (questionId === 56) {
    console.log(`🚨 CRITICAL: saveProgress called for Q56 - this is the missing question!`);
  }
  
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error(`Session ${sessionId} not found`);
  }
  
  // Update session
  session.responses[questionId] = direction;
  session.currentQuestion = Math.min(questionId + 1, questions.length);
  
  // CRITICAL DEBUG: Track session state after save
  console.log(`✅ Response saved for Q${questionId}. Session responses count: ${Object.keys(session.responses).length}`);
  if (questionId === 56) {
    console.log(`🚨 CRITICAL: After saving Q56 - session state:`, {
      questionId,
      responsesCount: Object.keys(session.responses).length,
      hasResponse: !!session.responses[questionId],
      allResponses: Object.keys(session.responses).map(id => parseInt(id)).sort((a, b) => a - b)
    });
  }
  
  // Save response
  const response: AssessmentResponse = {
    questionId,
    direction,
    timestamp: new Date().toISOString()
  };
  
  const sessionResponses = responses.get(sessionId) || [];
  sessionResponses.push(response);
  responses.set(sessionId, sessionResponses);
  
  console.log(`💾 Progress saved: Q${questionId} → ${direction}`);
  return session;
}

/**
 * Submit completed assessment
 */
export async function submitAssessment(sessionId: string): Promise<AssessmentResult> {
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error(`Session ${sessionId} not found`);
  }
  
  // Validate all questions answered
  const unansweredQuestions = [];
  
  for (let i = 1; i <= questions.length; i++) {
    if (!session.responses[i]) {
      unansweredQuestions.push(i);
    }
  }
  
  if (unansweredQuestions.length > 0) {
    throw new Error(`Assessment incomplete. Missing responses for questions: ${unansweredQuestions.join(', ')}`);
  }
  
  // Score the assessment
  const scoring = new AssessmentScoring(questions);
  
  // Submit all responses to the scoring system
  Object.entries(session.responses).forEach(([questionId, direction]) => {
    scoring.submitResponse(parseInt(questionId), direction);
  });
  
  const result = scoring.generateResult();
  
  // Update session
  session.isComplete = true;
  session.completedAt = new Date().toISOString();
  
  const assessmentResult: AssessmentResult = {
    sessionId,
    swipeType: result.swipeType,
    swipeTypeName: result.swipeTypeName,
    scores: {
      domains: result.scores.connectionStyles,
      channels: result.scores.enneagramTypes,
      axes: {
        directness: 0, // TODO: Calculate from scores
        tangibility: 0  // TODO: Calculate from scores
      }
    },
    confidence: 0.85, // TODO: Calculate actual confidence
    completedAt: session.completedAt
  };
  
  console.log(`✅ Assessment completed: ${result.swipeTypeName} (${result.swipeType})`);
  return assessmentResult;
}

/**
 * Resume a saved assessment session
 */
export async function resumeAssessment(sessionId: string): Promise<AssessmentSession> {
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error(`Session ${sessionId} not found`);
  }
  
  if (session.isComplete) {
    throw new Error(`Session ${sessionId} is already complete`);
  }
  
  console.log(`🔄 Assessment resumed: ${sessionId} (Q${session.currentQuestion})`);
  return session;
}

/**
 * Get assessment session by ID
 */
export async function getSession(sessionId: string): Promise<AssessmentSession | null> {
  return sessions.get(sessionId) || null;
}

/**
 * Get all responses for a session
 */
export async function getSessionResponses(sessionId: string): Promise<AssessmentResponse[]> {
  return responses.get(sessionId) || [];
}

/**
 * Delete assessment session
 */
export async function deleteSession(sessionId: string): Promise<boolean> {
  const deleted = sessions.delete(sessionId);
  responses.delete(sessionId);
  
  if (deleted) {
    console.log(`🗑️ Assessment session deleted: ${sessionId}`);
  }
  
  return deleted;
}

/**
 * Get assessment statistics
 */
export async function getAssessmentStats(): Promise<{
  totalSessions: number;
  completedSessions: number;
  averageCompletionTime: number;
}> {
  const allSessions = Array.from(sessions.values());
  const completedSessions = allSessions.filter(s => s.isComplete);
  
  const averageCompletionTime = completedSessions.reduce((acc, session) => {
    if (session.completedAt) {
      const start = new Date(session.startedAt).getTime();
      const end = new Date(session.completedAt).getTime();
      return acc + (end - start);
    }
    return acc;
  }, 0) / Math.max(completedSessions.length, 1);
  
  return {
    totalSessions: allSessions.length,
    completedSessions: completedSessions.length,
    averageCompletionTime: Math.round(averageCompletionTime / 1000 / 60) // minutes
  };
}
