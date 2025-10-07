import { getSwipeType, getDisplayName } from '../src/data/swipeTypeMapping';
import { freeSummaries } from '../src/data/freeSummaries';
import { premiumReports } from '../src/data/premiumReports';

describe('Swipe Type Mapping Validation', () => {
  // Test valid combinations based on actual mapping
  const validCombinations = [
    // Solid Rock combinations
    { connection: 'verbalAffirmation', enneagram: 'type6', expected: 'solidRock' },
    { connection: 'verbalAffirmation', enneagram: 'type9', expected: 'solidRock' },
    { connection: 'qualityPresence', enneagram: 'type6', expected: 'solidRock' },
    { connection: 'qualityPresence', enneagram: 'type9', expected: 'solidRock' },
    { connection: 'physicalCloseness', enneagram: 'type9', expected: 'solidRock' },
    { connection: 'supportiveActions', enneagram: 'type6', expected: 'solidRock' },
    { connection: 'supportiveActions', enneagram: 'type9', expected: 'solidRock' },
    { connection: 'physicalCloseness', enneagram: 'type1', expected: 'solidRock' },
    
    // Watchful Guard combinations
    { connection: 'supportiveActions', enneagram: 'type8', expected: 'watchfulGuard' },
    { connection: 'physicalCloseness', enneagram: 'type8', expected: 'watchfulGuard' },
    { connection: 'physicalCloseness', enneagram: 'type6', expected: 'watchfulGuard' },
    { connection: 'verbalAffirmation', enneagram: 'type8', expected: 'watchfulGuard' },
    { connection: 'thoughtfulGestures', enneagram: 'type8', expected: 'watchfulGuard' },
    { connection: 'thoughtfulGestures', enneagram: 'type9', expected: 'watchfulGuard' },
    { connection: 'qualityPresence', enneagram: 'type8', expected: 'watchfulGuard' },
    
    // Warm Heart combinations
    { connection: 'physicalCloseness', enneagram: 'type2', expected: 'warmHeart' },
    { connection: 'thoughtfulGestures', enneagram: 'type2', expected: 'warmHeart' },
    { connection: 'verbalAffirmation', enneagram: 'type2', expected: 'warmHeart' },
    { connection: 'supportiveActions', enneagram: 'type2', expected: 'warmHeart' },
    { connection: 'qualityPresence', enneagram: 'type2', expected: 'warmHeart' },
    { connection: 'sharedGrowth', enneagram: 'type2', expected: 'warmHeart' },
    
    // Gentle Guide combinations
    { connection: 'verbalAffirmation', enneagram: 'type1', expected: 'gentleGuide' },
    { connection: 'qualityPresence', enneagram: 'type1', expected: 'gentleGuide' },
    { connection: 'thoughtfulGestures', enneagram: 'type1', expected: 'gentleGuide' },
    { connection: 'thoughtfulGestures', enneagram: 'type6', expected: 'gentleGuide' },
    { connection: 'thoughtfulGestures', enneagram: 'type9', expected: 'gentleGuide' },
    
    // Deep Connector combinations
    { connection: 'qualityPresence', enneagram: 'type4', expected: 'deepConnector' },
    { connection: 'qualityPresence', enneagram: 'type5', expected: 'deepConnector' },
    { connection: 'verbalAffirmation', enneagram: 'type4', expected: 'deepConnector' },
    { connection: 'verbalAffirmation', enneagram: 'type5', expected: 'deepConnector' },
    { connection: 'physicalCloseness', enneagram: 'type4', expected: 'deepConnector' },
    { connection: 'thoughtfulGestures', enneagram: 'type4', expected: 'deepConnector' },
    { connection: 'thoughtfulGestures', enneagram: 'type5', expected: 'deepConnector' },
    
    // Authentic Soul combinations
    { connection: 'physicalCloseness', enneagram: 'type5', expected: 'authenticSoul' },
    { connection: 'supportiveActions', enneagram: 'type4', expected: 'authenticSoul' },
    { connection: 'supportiveActions', enneagram: 'type5', expected: 'authenticSoul' },
    { connection: 'sharedGrowth', enneagram: 'type4', expected: 'authenticSoul' },
    { connection: 'sharedGrowth', enneagram: 'type5', expected: 'authenticSoul' },
    { connection: 'thoughtfulGestures', enneagram: 'type4', expected: 'authenticSoul' },
    
    // Progress Partner combinations
    { connection: 'sharedGrowth', enneagram: 'type3', expected: 'progressPartner' },
    { connection: 'sharedGrowth', enneagram: 'type8', expected: 'progressPartner' },
    { connection: 'supportiveActions', enneagram: 'type3', expected: 'progressPartner' },
    { connection: 'supportiveActions', enneagram: 'type8', expected: 'progressPartner' },
    { connection: 'qualityPresence', enneagram: 'type3', expected: 'progressPartner' },
    { connection: 'qualityPresence', enneagram: 'type8', expected: 'progressPartner' },
    { connection: 'physicalCloseness', enneagram: 'type3', expected: 'progressPartner' },
    
    // Free Spirit combinations
    { connection: 'qualityPresence', enneagram: 'type7', expected: 'freeSpirit' },
    { connection: 'thoughtfulGestures', enneagram: 'type7', expected: 'freeSpirit' },
    { connection: 'sharedGrowth', enneagram: 'type7', expected: 'freeSpirit' },
    { connection: 'verbalAffirmation', enneagram: 'type7', expected: 'freeSpirit' },
    { connection: 'physicalCloseness', enneagram: 'type7', expected: 'freeSpirit' },
    { connection: 'supportiveActions', enneagram: 'type7', expected: 'freeSpirit' }
  ];

  test('should map all valid combinations correctly', () => {
    validCombinations.forEach(({ connection, enneagram, expected }) => {
      const result = getSwipeType(connection, enneagram);
      expect(result).toBe(expected);
    });
  });

  test('should return valid display names for all swipe types', () => {
    const swipeTypes = [
      'solidRock', 'watchfulGuard', 'warmHeart', 'gentleGuide',
      'deepConnector', 'authenticSoul', 'progressPartner', 'freeSpirit'
    ];

    swipeTypes.forEach(swipeType => {
      const displayName = getDisplayName(swipeType);
      expect(displayName).toBeTruthy();
      expect(typeof displayName).toBe('string');
      expect(displayName.length).toBeGreaterThan(0);
    });
  });

  test('should have content for all swipe types', () => {
    const swipeTypes = [
      'solidRock', 'watchfulGuard', 'warmHeart', 'gentleGuide',
      'deepConnector', 'authenticSoul', 'progressPartner', 'freeSpirit'
    ];

    swipeTypes.forEach(swipeType => {
      // Test free summaries
      const summary = freeSummaries[swipeType];
      expect(summary).toBeDefined();
      expect(summary.length).toBeGreaterThan(50);
      
      // Test premium reports
      const report = premiumReports[swipeType];
      expect(report).toBeDefined();
      expect(report.introduction).toBeTruthy();
      expect(report.howYouLove).toBeTruthy();
      expect(report.whatYouNeed).toBeTruthy();
      expect(report.yourStrengths).toBeTruthy();
      expect(report.growthOpportunities).toBeTruthy();
      expect(report.inConflict).toBeTruthy();
      expect(report.adviceForPartners).toBeTruthy();
    });
  });

  test('should validate content quality and structure', () => {
    const swipeTypes = [
      'solidRock', 'watchfulGuard', 'warmHeart', 'gentleGuide',
      'deepConnector', 'authenticSoul', 'progressPartner', 'freeSpirit'
    ];

    swipeTypes.forEach(swipeType => {
      const summary = freeSummaries[swipeType];
      const report = premiumReports[swipeType];
      
      // Free summary should be concise but informative
      expect(summary.length).toBeGreaterThan(100);
      expect(summary.length).toBeLessThan(1000);
      
      // Should contain key elements
      expect(summary).toMatch(/You are a/);
      expect(summary).toMatch(/Your strength:/);
      expect(summary).toMatch(/Your growth edge:/);
      
      // Premium report should be comprehensive
      expect(report.introduction.length).toBeGreaterThan(200);
      expect(report.howYouLove.length).toBeGreaterThan(200);
      expect(report.whatYouNeed.length).toBeGreaterThan(200);
      expect(report.yourStrengths.length).toBeGreaterThan(200);
      expect(report.growthOpportunities.length).toBeGreaterThan(200);
      expect(report.inConflict.length).toBeGreaterThan(200);
      expect(report.adviceForPartners.length).toBeGreaterThan(200);
    });
  });

  test('should handle edge cases gracefully', () => {
    // Test with invalid inputs - should return a default or handle gracefully
    const invalidResult1 = getSwipeType('invalidConnection', 'type1');
    const invalidResult2 = getSwipeType('supportiveActions', 'invalidType');
    
    // Should return a valid swipe type or handle gracefully
    expect(invalidResult1).toBeTruthy();
    expect(invalidResult2).toBeTruthy();
    
    // Test with null/undefined inputs
    const nullResult1 = getSwipeType(null as any, 'type1');
    const nullResult2 = getSwipeType('supportiveActions', null as any);
    
    // Should handle gracefully
    expect(nullResult1).toBeTruthy();
    expect(nullResult2).toBeTruthy();
  });

  test('should maintain consistency across multiple calls', () => {
    // Test that the same input always produces the same output
    const testCases = [
      { connection: 'supportiveActions', enneagram: 'type1' },
      { connection: 'physicalCloseness', enneagram: 'type2' },
      { connection: 'qualityPresence', enneagram: 'type4' },
      { connection: 'sharedGrowth', enneagram: 'type3' }
    ];

    testCases.forEach(({ connection, enneagram }) => {
      const result1 = getSwipeType(connection, enneagram);
      const result2 = getSwipeType(connection, enneagram);
      const result3 = getSwipeType(connection, enneagram);
      
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });
  });

  test('should validate display names match expected format', () => {
    const expectedDisplayNames = {
      solidRock: 'Solid Rock',
      watchfulGuard: 'Watchful Guard',
      warmHeart: 'Warm Heart',
      gentleGuide: 'Gentle Guide',
      deepConnector: 'Deep Connector',
      authenticSoul: 'Authentic Soul',
      progressPartner: 'Progress Partner',
      freeSpirit: 'Free Spirit'
    };

    Object.entries(expectedDisplayNames).forEach(([swipeType, expectedName]) => {
      const displayName = getDisplayName(swipeType);
      expect(displayName).toBe(expectedName);
    });
  });
});
