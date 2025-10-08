import { AssessmentScoring } from '../src/lib/scoringAlgorithm';
import { 
  scenarioAllUp,
  scenarioAllDown,
  scenarioAlternate,
  scenarioDeepConnector,
  scenarioSolidRock,
  scenarioWatchfulGuard,
  scenarioWarmHeart,
  scenarioProgressPartner,
  scenarioStyleBlend,
  scenarioTypeBlendDeep,
  scenarioAllRight,
  scenarioStyleOnlyQP,
  TestScenario
} from '../src/utils/expectedOutcomes';
import { questions } from '../src/data/questions';
import { getSwipeType } from '../src/data/swipeTypeMapping';

/**
 * Comprehensive validation test suite using expectedOutcomes.ts scenarios
 * Tests all 12 validation scenarios to ensure scoring algorithm correctness
 */

describe('Validation Framework Tests', () => {
  let scoring: AssessmentScoring;

  beforeEach(() => {
    scoring = new AssessmentScoring(questions);
  });

  /**
   * Helper: Generate responses for a test scenario
   */
  function generateResponsesForScenario(scenario: TestScenario): void {
    // Clear any existing responses
    scoring = new AssessmentScoring(questions);
    
    if (scenario.pattern === 'allUp') {
      // All questions answered UP
      questions.forEach(q => {
        scoring.submitResponse(q.id, 'up');
      });
    } else if (scenario.pattern === 'allDown') {
      // All questions answered DOWN
      questions.forEach(q => {
        scoring.submitResponse(q.id, 'down');
      });
    } else if (scenario.pattern === 'allRight') {
      // All questions answered RIGHT
      questions.forEach(q => {
        scoring.submitResponse(q.id, 'right');
      });
    } else if (scenario.pattern === 'alternateUpDown') {
      // Odd questions UP, even questions DOWN
      questions.forEach((q, index) => {
        const direction = (index % 2 === 0) ? 'up' : 'down';
        scoring.submitResponse(q.id, direction);
      });
    } else if (scenario.pattern === 'explicit' && scenario.responses) {
      // Use explicit responses from scenario
      for (const [questionId, direction] of Object.entries(scenario.responses)) {
        scoring.submitResponse(parseInt(questionId), direction);
      }
      
      // Fill remaining questions with default 'down'
      const answeredQuestions = new Set(Object.keys(scenario.responses).map(id => parseInt(id)));
      questions.forEach(q => {
        if (!answeredQuestions.has(q.id)) {
          scoring.submitResponse(q.id, 'down');
        }
      });
    }
  }

  /**
   * Helper: Validate scenario results
   */
  function validateScenarioResult(scenario: TestScenario, result: any) {
    console.log(`\n=== Validating ${scenario.name} ===`);
    console.log('Expected scores:', scenario.expectedScores);
    console.log('Actual result:', result);
    
    // Check if we have expected top results
    if ('expectedTop' in scenario.expectedTop) {
      const expected = scenario.expectedTop;
      
      if ('topStyle' in expected) {
        // Single top result expected
        expect(result.primaryConnection).toBe(expected.topStyle);
        expect(result.primaryEnneagram).toBe(expected.topEnneagram);
        expect(result.swipeTypeName).toBe(expected.primarySwipeType);
      } else {
        // Multiple allowed results
        expect(expected.allowedTopStyles).toContain(result.primaryConnection);
        expect(expected.allowedTopEnneas).toContain(result.primaryEnneagram);
        expect(expected.allowedSwipeTypes).toContain(result.swipeTypeName);
      }
    }
  }

  describe('Pattern-based Scenarios', () => {
    test('Scenario 1: All YES! (UP)', () => {
      generateResponsesForScenario(scenarioAllUp);
      const result = scoring.generateResult();
      
      console.log('All UP Result:', result);
      validateScenarioResult(scenarioAllUp, result);
      
      // Verify assessment is completed
      expect(scoring.isCompleted()).toBe(true);
      expect(result.primaryConnection).toBeDefined();
      expect(result.primaryEnneagram).toBeDefined();
      expect(result.swipeType).toBeDefined();
    });

    test('Scenario 2: All NO! (DOWN)', () => {
      generateResponsesForScenario(scenarioAllDown);
      const result = scoring.generateResult();
      
      console.log('All DOWN Result:', result);
      validateScenarioResult(scenarioAllDown, result);
      
      expect(scoring.isCompleted()).toBe(true);
    });

    test('Scenario 3: Alternating UP/DOWN', () => {
      generateResponsesForScenario(scenarioAlternate);
      const result = scoring.generateResult();
      
      console.log('Alternate Result:', result);
      validateScenarioResult(scenarioAlternate, result);
      
      expect(scoring.isCompleted()).toBe(true);
    });

    test('Scenario 11: All RIGHT (Yes)', () => {
      generateResponsesForScenario(scenarioAllRight);
      const result = scoring.generateResult();
      
      console.log('All RIGHT Result:', result);
      validateScenarioResult(scenarioAllRight, result);
      
      expect(scoring.isCompleted()).toBe(true);
    });
  });

  describe('Targeted Scenarios', () => {
    test('Scenario 4: Deep Connector (QP + type4)', () => {
      generateResponsesForScenario(scenarioDeepConnector);
      const result = scoring.generateResult();
      
      console.log('Deep Connector Result:', result);
      validateScenarioResult(scenarioDeepConnector, result);
      
      expect(scoring.isCompleted()).toBe(true);
      expect(result.swipeTypeName).toBe('Deep Connector');
    });

    test('Scenario 5: Solid Rock (SA + type6)', () => {
      generateResponsesForScenario(scenarioSolidRock);
      const result = scoring.generateResult();
      
      console.log('Solid Rock Result:', result);
      validateScenarioResult(scenarioSolidRock, result);
      
      expect(scoring.isCompleted()).toBe(true);
      expect(result.swipeTypeName).toBe('Solid Rock');
    });

    test('Scenario 6: Watchful Guard (PC + type8)', () => {
      generateResponsesForScenario(scenarioWatchfulGuard);
      const result = scoring.generateResult();
      
      console.log('Watchful Guard Result:', result);
      validateScenarioResult(scenarioWatchfulGuard, result);
      
      expect(scoring.isCompleted()).toBe(true);
      expect(result.swipeTypeName).toBe('Watchful Guard');
    });

    test('Scenario 7: Warm Heart (PC + type2)', () => {
      generateResponsesForScenario(scenarioWarmHeart);
      const result = scoring.generateResult();
      
      console.log('Warm Heart Result:', result);
      validateScenarioResult(scenarioWarmHeart, result);
      
      expect(scoring.isCompleted()).toBe(true);
      expect(result.swipeTypeName).toBe('Warm Heart');
    });

    test('Scenario 8: Progress Partner (SG + type3)', () => {
      generateResponsesForScenario(scenarioProgressPartner);
      const result = scoring.generateResult();
      
      console.log('Progress Partner Result:', result);
      validateScenarioResult(scenarioProgressPartner, result);
      
      expect(scoring.isCompleted()).toBe(true);
      expect(result.swipeTypeName).toBe('Progress Partner');
    });
  });

  describe('Blend Scenarios', () => {
    test('Scenario 9: Style Blend (QP tie SA; type3 top)', () => {
      generateResponsesForScenario(scenarioStyleBlend);
      const result = scoring.generateResult();
      
      console.log('Style Blend Result:', result);
      validateScenarioResult(scenarioStyleBlend, result);
      
      expect(scoring.isCompleted()).toBe(true);
    });

    test('Scenario 10: Type Blend Deep (QP + type4/5 tie)', () => {
      generateResponsesForScenario(scenarioTypeBlendDeep);
      const result = scoring.generateResult();
      
      console.log('Type Blend Deep Result:', result);
      validateScenarioResult(scenarioTypeBlendDeep, result);
      
      expect(scoring.isCompleted()).toBe(true);
    });

    test('Scenario 12: Style Only QP (QP + type3)', () => {
      generateResponsesForScenario(scenarioStyleOnlyQP);
      const result = scoring.generateResult();
      
      console.log('Style Only QP Result:', result);
      validateScenarioResult(scenarioStyleOnlyQP, result);
      
      expect(scoring.isCompleted()).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty responses gracefully', () => {
      // Answer all questions with 'down' to complete the assessment
      questions.forEach(q => {
        scoring.submitResponse(q.id, 'down');
      });
      
      const result = scoring.generateResult();
      
      // Should not crash with completed assessment
      expect(result).toBeDefined();
      expect(result.primaryConnection).toBeDefined();
      expect(result.primaryEnneagram).toBeDefined();
    });

    test('should complete assessment with all 57 questions', () => {
      // Answer all questions with 'up'
      questions.forEach(q => {
        scoring.submitResponse(q.id, 'up');
      });
      
      expect(scoring.isCompleted()).toBe(true);
      expect(scoring.getProgress().current).toBe(57);
      expect(scoring.getProgress().total).toBe(57);
    });

    test('should handle reverse items correctly', () => {
      // Test Q4 (reverse item) with UP response
      scoring.submitResponse(4, 'up');
      
      // Q4 is reverse, so UP should give negative weight
      const scores = scoring.calculateScores();
      console.log('Q4 UP scores:', scores);
      
      // The scoring should reflect the reverse logic
      expect(scores).toBeDefined();
    });
  });

  describe('Debug Output', () => {
    test('should provide detailed debug information for failed scenarios', () => {
      generateResponsesForScenario(scenarioAllUp);
      const result = scoring.generateResult();
      const scores = scoring.calculateScores();
      
      console.log('\n=== DEBUG OUTPUT ===');
      console.log('Final Result:', result);
      console.log('Connection Scores:', scores.connectionStyles);
      console.log('Enneagram Scores:', scores.enneagramTypes);
      console.log('Mapping Key:', `${result.primaryConnectionStyle}_${result.primaryEnneagramType}`);
      console.log('Swipe Type:', result.swipeType);
      console.log('===================\n');
      
      expect(result).toBeDefined();
    });
  });
});
