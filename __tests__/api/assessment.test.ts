import { 
  startAssessment, 
  saveProgress, 
  submitAssessment, 
  getSession,
  deleteSession,
  getAssessmentStats 
} from '../../src/api/assessment';
import { SwipeDirection } from '../../src/lib/scoringAlgorithm';

describe('Assessment API', () => {
  let sessionId: string;

  beforeEach(() => {
    // Clear any existing sessions
    jest.clearAllMocks();
  });

  afterEach(async () => {
    // Clean up session
    if (sessionId) {
      await deleteSession(sessionId);
    }
  });

  describe('Session Management', () => {
    test('starts a new assessment session', async () => {
      const session = await startAssessment();
      
      expect(session).toBeDefined();
      expect(session.id).toBeDefined();
      expect(session.startedAt).toBeDefined();
      expect(session.currentQuestion).toBe(1);
      expect(session.responses).toEqual({});
      expect(session.isComplete).toBe(false);
      
      sessionId = session.id;
    });

    test('starts session with user ID', async () => {
      const userId = 'user_123';
      const session = await startAssessment(userId);
      
      expect(session.userId).toBe(userId);
      sessionId = session.id;
    });

    test('gets session by ID', async () => {
      const session = await startAssessment();
      sessionId = session.id;
      
      const retrievedSession = await getSession(sessionId);
      
      expect(retrievedSession).toEqual(session);
    });

    test('returns null for non-existent session', async () => {
      const session = await getSession('non-existent');
      expect(session).toBeNull();
    });
  });

  describe('Progress Management', () => {
    beforeEach(async () => {
      const session = await startAssessment();
      sessionId = session.id;
    });

    test('saves progress for a question', async () => {
      const direction: SwipeDirection = 'right';
      const questionId = 1;
      
      const updatedSession = await saveProgress(sessionId, questionId, direction);
      
      expect(updatedSession.responses[questionId]).toBe(direction);
      expect(updatedSession.currentQuestion).toBe(2);
    });

    test('saves multiple responses', async () => {
      const responses = [
        { questionId: 1, direction: 'right' as SwipeDirection },
        { questionId: 2, direction: 'up' as SwipeDirection },
        { questionId: 3, direction: 'left' as SwipeDirection }
      ];
      
      let session = await getSession(sessionId);
      
      for (const response of responses) {
        session = await saveProgress(sessionId, response.questionId, response.direction);
      }
      
      expect(session.responses[1]).toBe('right');
      expect(session.responses[2]).toBe('up');
      expect(session.responses[3]).toBe('left');
      expect(session.currentQuestion).toBe(4);
    });

    test('throws error for non-existent session', async () => {
      await expect(saveProgress('non-existent', 1, 'right')).rejects.toThrow('Session non-existent not found');
    });
  });

  describe('Assessment Submission', () => {
    beforeEach(async () => {
      const session = await startAssessment();
      sessionId = session.id;
    });

    test('submits assessment with all responses', async () => {
      // Answer all 57 questions
      for (let i = 1; i <= 57; i++) {
        const direction: SwipeDirection = i % 4 === 0 ? 'up' : 
                                        i % 4 === 1 ? 'right' : 
                                        i % 4 === 2 ? 'down' : 'left';
        await saveProgress(sessionId, i, direction);
      }
      
      const result = await submitAssessment(sessionId);
      
      expect(result).toBeDefined();
      expect(result.sessionId).toBe(sessionId);
      expect(result.swipeType).toBeDefined();
      expect(result.swipeTypeName).toBeDefined();
      expect(result.scores).toBeDefined();
      expect(result.scores.domains).toBeDefined();
      expect(result.scores.channels).toBeDefined();
      expect(result.scores.axes).toBeDefined();
      expect(result.confidence).toBeDefined();
      expect(result.completedAt).toBeDefined();
    });

    test('throws error for incomplete assessment', async () => {
      // Only answer first 10 questions
      for (let i = 1; i <= 10; i++) {
        await saveProgress(sessionId, i, 'right');
      }
      
      await expect(submitAssessment(sessionId)).rejects.toThrow('Assessment incomplete');
    });

    test('throws error for non-existent session', async () => {
      await expect(submitAssessment('non-existent')).rejects.toThrow('Session non-existent not found');
    });
  });

  describe('Session Cleanup', () => {
    test('deletes session', async () => {
      const session = await startAssessment();
      sessionId = session.id;
      
      const deleted = await deleteSession(sessionId);
      expect(deleted).toBe(true);
      
      const retrievedSession = await getSession(sessionId);
      expect(retrievedSession).toBeNull();
    });

    test('returns false for non-existent session', async () => {
      const deleted = await deleteSession('non-existent');
      expect(deleted).toBe(false);
    });
  });

  describe('Statistics', () => {
    test('returns assessment statistics', async () => {
      // Create and complete a session
      const session = await startAssessment();
      sessionId = session.id;
      
      // Answer all questions
      for (let i = 1; i <= 57; i++) {
        await saveProgress(sessionId, i, 'right');
      }
      
      await submitAssessment(sessionId);
      
      const stats = await getAssessmentStats();
      
      expect(stats.totalSessions).toBeGreaterThanOrEqual(1);
      expect(stats.completedSessions).toBeGreaterThanOrEqual(1);
      expect(stats.averageCompletionTime).toBeGreaterThanOrEqual(0);
    });
  });
});
