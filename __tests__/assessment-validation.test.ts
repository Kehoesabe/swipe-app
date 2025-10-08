/**
 * Automated Assessment Validation Test Suite
 * 
 * Tests all 12 scenarios from expectedOutcomes.ts to validate:
 * - Scoring algorithm correctness
 * - Reverse item handling
 * - Swipe type mapping accuracy
 * - Tie resolution logic
 */

import { AssessmentScoring } from '../src/lib/scoringAlgorithm';
import { questions } from '../src/data/questions';
import { 
  testScenarios, 
  validateTestResult, 
  mapping54to8,
  questionCategories,
  reverseItemIds,
  type TestScenario,
  type ActualResult,
  type Direction
} from '../src/utils/expectedOutcomes';

describe('Assessment Validation Suite', () => {
  let scoring: AssessmentScoring;

  beforeEach(() => {
    scoring = new AssessmentScoring(questions);
  });

  /**
   * Helper: Generate responses for pattern-based scenarios
   * FIXED: Now fills ALL 57 questions with default 'down' for unspecified questions
   */
  function generateResponsesForPattern(scenario: TestScenario): Record<number, Direction> {
    const responses: Record<number, Direction> = {};
    
    // First, fill ALL questions with default 'down'
    questions.forEach(q => {
      responses[q.id] = 'down';
    });
    
    // Then override based on pattern
    if (scenario.pattern === 'allUp') {
      // All questions answered UP
      questions.forEach(q => {
        responses[q.id] = 'up';
      });
    } else if (scenario.pattern === 'allDown') {
      // All questions answered DOWN (already set above)
      // No changes needed
    } else if (scenario.pattern === 'alternateUpDown') {
      // Odd questions UP, even questions DOWN
      questions.forEach((q, index) => {
        responses[q.id] = (index % 2 === 0) ? 'up' : 'down';
      });
    } else if (scenario.pattern === 'allRight') {
      // All questions answered RIGHT (Yes)
      questions.forEach(q => {
        responses[q.id] = 'right';
      });
    }
    
    console.log(`Generated ${Object.keys(responses).length} responses for pattern: ${scenario.pattern}`);
    return responses;
  }

  /**
   * Helper: Submit all responses to scoring algorithm
   */
  function submitAllResponses(responses: Record<number, Direction>) {
    Object.entries(responses).forEach(([questionId, direction]) => {
      scoring.submitResponse(parseInt(questionId), direction as Direction);
    });
  }

  /**
   * Helper: Extract actual results from scoring
   */
  function extractActualResults(): ActualResult {
    const result = scoring.generateResult();
    const scores = scoring.calculateScores();
    
    // Find top connection style
    const connectionScores = scores.connectionStyles;
    const topStyle = Object.entries(connectionScores)
      .sort(([,a], [,b]) => b - a)[0][0] as keyof typeof questionCategories.connectionStyles;
    const topStyleScore = connectionScores[topStyle];
    
    // Find second connection style
    const secondStyle = Object.entries(connectionScores)
      .sort(([,a], [,b]) => b - a)[1][0] as keyof typeof questionCategories.connectionStyles;
    const secondStyleScore = connectionScores[secondStyle];
    
    // Find top enneagram type
    const enneagramScores = scores.enneagramTypes;
    const topEnneagram = Object.entries(enneagramScores)
      .sort(([,a], [,b]) => b - a)[0][0] as keyof typeof questionCategories.enneagramTypes;
    const topEnneagramScore = enneagramScores[topEnneagram];
    
    // Find second enneagram type
    const secondEnneagram = Object.entries(enneagramScores)
      .sort(([,a], [,b]) => b - a)[1][0] as keyof typeof questionCategories.enneagramTypes;
    const secondEnneagramScore = enneagramScores[secondEnneagram];
    
    // Calculate margins
    const styleMargin = Math.abs(topStyleScore - secondStyleScore);
    const enneaMargin = Math.abs(topEnneagramScore - secondEnneagramScore);
    
    return {
      topStyle,
      topStyleScore,
      secondStyle,
      topEnneagram,
      topEnneagramScore,
      secondEnneagram,
      primarySwipeType: result.swipeTypeName as any,
      styleMargin,
      enneaMargin,
      scores
    };
  }

  /**
   * Test all scenarios
   */
  testScenarios.forEach((scenario, index) => {
    test(`Scenario ${index + 1}: ${scenario.name}`, () => {
      // Reset scoring for each test
      scoring = new AssessmentScoring(questions);
      
      // Generate responses based on scenario pattern
      let responses: Record<number, Direction>;
      if (scenario.pattern === 'explicit') {
        responses = scenario.responses!;
      } else {
        responses = generateResponsesForPattern(scenario);
      }
      
      // Submit all responses
      submitAllResponses(responses);
      
      // Extract actual results
      const actual = extractActualResults();
      
      // Validate against expected
      const validation = validateTestResult(actual, scenario.expectedTop, 0.05);
      
      // Log detailed results for debugging
      console.log(`\n=== SCENARIO ${index + 1}: ${scenario.name} ===`);
      console.log('Expected Scores:', JSON.stringify(scenario.expectedScores, null, 2));
      console.log('Actual Scores:', JSON.stringify(actual.scores, null, 2));
      console.log('Validation Result:', validation.details);
      
      expect(validation.pass).toBe(true);
    });
  });

  /**
   * Test reverse item handling
   */
  describe('Reverse Item Validation', () => {
    test('should handle reverse items correctly', () => {
      // Test with a specific reverse item (Q4 - verbalAffirmation)
      scoring = new AssessmentScoring(questions);
      
      // Answer Q4 with UP (should be inverted to -2)
      scoring.submitResponse(4, 'up');
      
      const scores = scoring.calculateScores();
      const verbalAffirmationScore = scores.connectionStyles.verbalAffirmation;
      
      // With only Q4 answered UP, VA should be -2 (inverted)
      expect(verbalAffirmationScore).toBe(-2);
    });

    test('should validate all reverse items exist', () => {
      const reverseItemsInQuestions = questions.filter(q => q.reverse);
      expect(reverseItemsInQuestions.length).toBeGreaterThan(0);
      
      const reverseIds = reverseItemsInQuestions.map(q => q.id);
      reverseIds.forEach(id => {
        expect(reverseItemIds.has(id)).toBe(true);
      });
    });
  });

  /**
   * Test mapping accuracy
   */
  describe('Mapping Validation', () => {
    test('should have correct number of mappings', () => {
      const mappingCount = Object.keys(mapping54to8).length;
      expect(mappingCount).toBe(54);
    });

    test('should map all 8 Swipe Types', () => {
      const swipeTypes = new Set(Object.values(mapping54to8));
      expect(swipeTypes.size).toBe(8);
      
      const expectedTypes = [
        'Solid Rock', 'Watchful Guard', 'Warm Heart', 'Gentle Guide',
        'Deep Connector', 'Authentic Soul', 'Progress Partner', 'Free Spirit'
      ];
      
      expectedTypes.forEach(type => {
        expect(swipeTypes.has(type as any)).toBe(true);
      });
    });

    test('should have balanced distribution', () => {
      const typeCounts = Object.values(mapping54to8).reduce((acc, type) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Each type should have 6-8 mappings
      Object.values(typeCounts).forEach(count => {
        expect(count).toBeGreaterThanOrEqual(6);
        expect(count).toBeLessThanOrEqual(8);
      });
    });
  });

  /**
   * Test edge cases
   */
  describe('Edge Cases', () => {
    test('should handle empty responses', () => {
      scoring = new AssessmentScoring(questions);
      const result = scoring.generateResult();
      
      // Should not crash with empty responses
      expect(result).toBeDefined();
    });

    test('should handle all questions answered', () => {
      scoring = new AssessmentScoring(questions);
      
      // Answer all 57 questions
      questions.forEach(q => {
        scoring.submitResponse(q.id, 'up');
      });
      
      expect(scoring.isCompleted()).toBe(true);
      expect(scoring.responses.length).toBe(57);
    });

    test('should handle tie scenarios', () => {
      // Test scenario with known ties
      scoring = new AssessmentScoring(questions);
      
      // Create a scenario that should produce ties
      const tieResponses: Record<number, Direction> = {};
      questions.forEach(q => {
        tieResponses[q.id] = 'right'; // All RIGHT should create ties
      });
      
      submitAllResponses(tieResponses);
      const actual = extractActualResults();
      
      // Should handle ties gracefully
      expect(actual.topStyle).toBeDefined();
      expect(actual.topEnneagram).toBeDefined();
      expect(actual.primarySwipeType).toBeDefined();
    });
  });

  /**
   * Test scoring algorithm consistency
   */
  describe('Scoring Consistency', () => {
    test('should produce consistent results for same inputs', () => {
      const responses: Record<number, Direction> = {
        1: 'up', 2: 'up', 3: 'up', 4: 'down',
        5: 'up', 6: 'up', 7: 'down', 8: 'up'
      };
      
      // Run same scenario twice
      scoring = new AssessmentScoring(questions);
      submitAllResponses(responses);
      const result1 = extractActualResults();
      
      scoring = new AssessmentScoring(questions);
      submitAllResponses(responses);
      const result2 = extractActualResults();
      
      expect(result1.topStyle).toBe(result2.topStyle);
      expect(result1.topEnneagram).toBe(result2.topEnneagram);
      expect(result1.primarySwipeType).toBe(result2.primarySwipeType);
    });

    test('should handle undo correctly', () => {
      scoring = new AssessmentScoring(questions);
      
      // Submit a few responses
      scoring.submitResponse(1, 'up');
      scoring.submitResponse(2, 'up');
      scoring.submitResponse(3, 'up');
      
      expect(scoring.responses.length).toBe(3);
      
      // Undo last response
      const currentQuestion = scoring.undoLastResponse();
      expect(scoring.responses.length).toBe(2);
      expect(currentQuestion).toBeDefined();
    });
  });
});
