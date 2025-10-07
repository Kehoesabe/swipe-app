import { AssessmentScoring } from '../src/lib/scoringAlgorithm';
import { questions } from '../src/data/questions';

describe('Assessment Scoring', () => {
  let scoring: AssessmentScoring;

  beforeEach(() => {
    scoring = new AssessmentScoring(questions);
  });

  test('initializes with first question', () => {
    const currentQuestion = scoring.getCurrentQuestion();
    expect(currentQuestion).toBeDefined();
    expect(currentQuestion?.id).toBe(1);
  });

  test('tracks progress correctly', () => {
    const initialProgress = scoring.getProgress();
    expect(initialProgress.current).toBe(0);
    expect(initialProgress.total).toBe(57);
    expect(initialProgress.percentage).toBe(0);

    // Submit a response
    scoring.submitResponse(1, 'right');
    
    const progressAfterOne = scoring.getProgress();
    expect(progressAfterOne.current).toBe(1);
    expect(progressAfterOne.percentage).toBeCloseTo(1.75, 1);
  });

  test('calculates scores correctly', () => {
    // Submit responses for verbal affirmation
    scoring.submitResponse(1, 'right'); // Yes
    scoring.submitResponse(2, 'up');    // YES!
    scoring.submitResponse(3, 'right'); // Yes
    scoring.submitResponse(4, 'left');  // No

    const scores = scoring.calculateScores();
    
    // Verbal affirmation should have positive score
    expect(scores.connectionStyles.verbalAffirmation).toBeGreaterThan(0);
    
    // Other connection styles should be 0
    expect(scores.connectionStyles.qualityPresence).toBe(0);
    expect(scores.connectionStyles.physicalCloseness).toBe(0);
  });

  test('handles reverse-coded questions', () => {
    // Submit response to reverse-coded question (Q52)
    scoring.submitResponse(52, 'right'); // Yes on reverse-coded question
    
    const scores = scoring.calculateScores();
    
    // Should have negative score for qualityPresence (reverse-coded)
    expect(scores.connectionStyles.qualityPresence).toBeLessThan(0);
  });

  test('determines primary types correctly', () => {
    // Submit more responses for verbal affirmation than other styles
    scoring.submitResponse(1, 'up');    // YES! for verbal affirmation
    scoring.submitResponse(2, 'up');    // YES! for verbal affirmation
    scoring.submitResponse(5, 'right'); // Yes for quality presence
    scoring.submitResponse(9, 'right'); // Yes for physical closeness

    const scores = scoring.calculateScores();
    const primaryConnection = scoring.getPrimaryConnectionStyle(scores);
    
    expect(primaryConnection).toBe('verbalAffirmation');
  });

  test('completes assessment after all questions', () => {
    // Submit responses for all 57 questions
    for (let i = 1; i <= 57; i++) {
      scoring.submitResponse(i, 'right');
    }

    expect(scoring.isCompleted()).toBe(true);
  });

  test('generates result after completion', () => {
    // Submit responses for all questions
    for (let i = 1; i <= 57; i++) {
      scoring.submitResponse(i, 'right');
    }

    const result = scoring.generateResult();
    
    expect(result).toBeDefined();
    expect(result.method).toBe('assessment');
    expect(result.swipeType).toBeDefined();
    expect(result.primaryConnection).toBeDefined();
    expect(result.primaryEnneagram).toBeDefined();
    expect(result.scores).toBeDefined();
  });

  test('throws error when generating result before completion', () => {
    expect(() => scoring.generateResult()).toThrow('Assessment not completed');
  });

  test('resets assessment correctly', () => {
    scoring.submitResponse(1, 'right');
    scoring.submitResponse(2, 'up');
    
    scoring.reset();
    
    expect(scoring.getCurrentQuestion()?.id).toBe(1);
    expect(scoring.getAllResponses()).toHaveLength(0);
    expect(scoring.isCompleted()).toBe(false);
  });
});
