/**
 * Verification Tests - Isolate and debug specific issues
 * 
 * These tests focus on specific problems:
 * 1. Q4 reverse item test
 * 2. Response count verification
 * 3. Scoring algorithm debugging
 */

import { AssessmentScoring } from '../src/lib/scoringAlgorithm';
import { questions } from '../src/data/questions';

describe('Verification Tests', () => {
  let scoring: AssessmentScoring;

  beforeEach(() => {
    scoring = new AssessmentScoring(questions);
  });

  /**
   * Test 1: Q4 Reverse Item Verification
   * Q4 should be inverted: UP = -2, DOWN = +2
   */
  test('Q4 reverse item should invert correctly', () => {
    console.log('\n=== Q4 REVERSE ITEM TEST ===');
    
    // Test Q4 UP (should give -2)
    scoring.submitResponse(4, 'up');
    const scoresUp = scoring.calculateScores();
    console.log('Q4 UP - VA Score:', scoresUp.connectionStyles.verbalAffirmation);
    expect(scoresUp.connectionStyles.verbalAffirmation).toBe(-2);
    
    // Reset and test Q4 DOWN (should give +2)
    scoring = new AssessmentScoring(questions);
    scoring.submitResponse(4, 'down');
    const scoresDown = scoring.calculateScores();
    console.log('Q4 DOWN - VA Score:', scoresDown.connectionStyles.verbalAffirmation);
    expect(scoresDown.connectionStyles.verbalAffirmation).toBe(2);
  });

  /**
   * Test 2: Response Count Verification
   * Ensure we can answer all 57 questions
   */
  test('should handle all 57 questions', () => {
    console.log('\n=== RESPONSE COUNT TEST ===');
    
    // Answer all 57 questions with 'down'
    for (let i = 1; i <= 57; i++) {
      scoring.submitResponse(i, 'down');
    }
    
    console.log('Total responses:', scoring.responses.length);
    console.log('Is completed:', scoring.isCompleted());
    
    expect(scoring.responses.length).toBe(57);
    expect(scoring.isCompleted()).toBe(true);
  });

  /**
   * Test 3: Deep Connector Scenario Debug
   * Test the specific scenario that should produce Deep Connector
   */
  test('Deep Connector scenario debug', () => {
    console.log('\n=== DEEP CONNECTOR DEBUG ===');
    
    // Answer all questions with 'down' first
    for (let i = 1; i <= 57; i++) {
      scoring.submitResponse(i, 'down');
    }
    
    // Now override specific questions for Deep Connector
    const deepConnectorResponses = {
      5: 'up', 6: 'up', 8: 'up', 7: 'left', 52: 'left',  // QP max
      34: 'up', 35: 'up', 36: 'left',  // Type4 max
    };
    
    // Reset and apply Deep Connector responses
    scoring = new AssessmentScoring(questions);
    
    // Answer all with 'down' first
    for (let i = 1; i <= 57; i++) {
      scoring.submitResponse(i, 'down');
    }
    
    // Override specific questions
    Object.entries(deepConnectorResponses).forEach(([questionId, direction]) => {
      // Find the response and update it
      const responseIndex = scoring.responses.findIndex(r => r.questionId === parseInt(questionId));
      if (responseIndex !== -1) {
        scoring.responses[responseIndex].direction = direction as any;
        scoring.responses[responseIndex].result = scoring.getSwipeResult(direction as any);
      }
    });
    
    const scores = scoring.calculateScores();
    const result = scoring.generateResult();
    
    console.log('Deep Connector Scores:');
    console.log('QP Score:', scores.connectionStyles.qualityPresence);
    console.log('Type4 Score:', scores.enneagramTypes.type4);
    console.log('Primary Connection:', result.primaryConnection);
    console.log('Primary Enneagram:', result.primaryEnneagram);
    console.log('Swipe Type:', result.swipeTypeName);
    
    expect(result.primaryConnection).toBe('qualityPresence');
    expect(result.primaryEnneagram).toBe('type4');
    expect(result.swipeTypeName).toBe('Deep Connector');
  });

  /**
   * Test 4: First 10 Questions Debug
   * Debug the scoring for the first 10 questions
   */
  test('First 10 questions debug', () => {
    console.log('\n=== FIRST 10 QUESTIONS DEBUG ===');
    
    // Answer first 10 questions with 'up'
    for (let i = 1; i <= 10; i++) {
      scoring.submitResponse(i, 'up');
      const scores = scoring.calculateScores();
      console.log(`Q${i} UP - VA: ${scores.connectionStyles.verbalAffirmation}, QP: ${scores.connectionStyles.qualityPresence}`);
    }
    
    const finalScores = scoring.calculateScores();
    console.log('Final scores after Q10:');
    console.log('VA:', finalScores.connectionStyles.verbalAffirmation);
    console.log('QP:', finalScores.connectionStyles.qualityPresence);
    console.log('PC:', finalScores.connectionStyles.physicalCloseness);
  });

  /**
   * Test 5: Reverse Items List
   * Verify which questions are marked as reverse
   */
  test('Reverse items identification', () => {
    console.log('\n=== REVERSE ITEMS IDENTIFICATION ===');
    
    const reverseItems = questions.filter(q => q.reverse);
    console.log('Reverse items found:', reverseItems.length);
    console.log('Reverse item IDs:', reverseItems.map(q => q.id));
    
    reverseItems.forEach(q => {
      console.log(`Q${q.id} (${q.category}): ${q.text.substring(0, 50)}...`);
    });
    
    expect(reverseItems.length).toBeGreaterThan(0);
  });
});


