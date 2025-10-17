import { getSwipeType, getDisplayName } from '../src/data/swipeTypeMapping';
import { freeSummaries } from '../src/data/freeSummaries';
import { premiumReports } from '../src/data/premiumReports';

describe('Swipe Type Simple Validation', () => {
  test('should return valid swipe types for known combinations', () => {
    // Test a few key combinations that should work
    const testCases = [
      { connection: 'supportiveActions', enneagram: 'type8', expected: 'watchfulGuard' },
      { connection: 'physicalCloseness', enneagram: 'type2', expected: 'warmHeart' },
      { connection: 'qualityPresence', enneagram: 'type4', expected: 'deepConnector' },
      { connection: 'sharedGrowth', enneagram: 'type3', expected: 'progressPartner' },
      { connection: 'qualityPresence', enneagram: 'type7', expected: 'freeSpirit' }
    ];

    testCases.forEach(({ connection, enneagram, expected }) => {
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

  test('should validate content quality', () => {
    const swipeTypes = [
      'solidRock', 'watchfulGuard', 'warmHeart', 'gentleGuide',
      'deepConnector', 'authenticSoul', 'progressPartner', 'freeSpirit'
    ];

    swipeTypes.forEach(swipeType => {
      const summary = freeSummaries[swipeType];
      const report = premiumReports[swipeType];
      
      // Free summary should have key elements
      expect(summary).toMatch(/You are a/);
      expect(summary).toMatch(/Your strength:/);
      expect(summary).toMatch(/Your growth edge:/);
      
      // Premium report should be substantial
      expect(report.introduction.length).toBeGreaterThan(200);
      expect(report.howYouLove.length).toBeGreaterThan(200);
      expect(report.whatYouNeed.length).toBeGreaterThan(200);
      expect(report.yourStrengths.length).toBeGreaterThan(200);
      expect(report.growthOpportunities.length).toBeGreaterThan(200);
      expect(report.inConflict.length).toBeGreaterThan(200);
      expect(report.adviceForPartners.length).toBeGreaterThan(200);
    });
  });

  test('should maintain consistency', () => {
    // Test that the same input always produces the same output
    const testCases = [
      { connection: 'supportiveActions', enneagram: 'type8' },
      { connection: 'physicalCloseness', enneagram: 'type2' },
      { connection: 'qualityPresence', enneagram: 'type4' }
    ];

    testCases.forEach(({ connection, enneagram }) => {
      const result1 = getSwipeType(connection, enneagram);
      const result2 = getSwipeType(connection, enneagram);
      const result3 = getSwipeType(connection, enneagram);
      
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });
  });

  test('should handle invalid inputs gracefully', () => {
    // Test with invalid inputs - should return fallback
    const invalidResult1 = getSwipeType('invalidConnection', 'type1');
    const invalidResult2 = getSwipeType('supportiveActions', 'invalidType');
    
    // Should return a valid swipe type (fallback to solidRock)
    expect(invalidResult1).toBeTruthy();
    expect(invalidResult2).toBeTruthy();
  });
});




