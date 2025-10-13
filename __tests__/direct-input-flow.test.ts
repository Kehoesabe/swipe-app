/**
 * Direct Input Flow Integration Test
 * Tests the complete 3-screen flow for Milestone B MVP
 */

import { getSwipeType, getDisplayName } from '../src/data/swipeTypeMapping';
import { freeSummaries } from '../src/data/freeSummaries';

describe('Direct Input Flow - Milestone B MVP', () => {
  test('should map connection style and enneagram type to swipe type', () => {
    // Test a few key combinations
    const testCases = [
      { connection: 'supportiveActions', enneagram: 'type6', expected: 'solidRock' },
      { connection: 'qualityPresence', enneagram: 'type4', expected: 'deepConnector' },
      { connection: 'physicalCloseness', enneagram: 'type2', expected: 'warmHeart' },
      { connection: 'verbalAffirmation', enneagram: 'type1', expected: 'gentleGuide' },
    ];

    testCases.forEach(({ connection, enneagram, expected }) => {
      const swipeType = getSwipeType(connection, enneagram);
      expect(swipeType).toBe(expected);
      
      const displayName = getDisplayName(swipeType);
      expect(displayName).toBeTruthy();
      expect(typeof displayName).toBe('string');
    });
  });

  test('should have free summaries for all swipe types', () => {
    const swipeTypes = [
      'solidRock', 'watchfulGuard', 'warmHeart', 'gentleGuide',
      'deepConnector', 'authenticSoul', 'progressPartner', 'freeSpirit'
    ];

    swipeTypes.forEach(swipeType => {
      const summary = freeSummaries[swipeType];
      expect(summary).toBeDefined();
      expect(summary.length).toBeGreaterThan(100); // Should be substantial content
      expect(summary).toContain('You are a'); // Should start with profile description
    });
  });

  test('should create valid result object for direct input', () => {
    const connectionStyle = 'supportiveActions';
    const enneagramType = 'type6';
    
    const result = {
      sessionId: Date.now().toString(),
      swipeType: getSwipeType(connectionStyle, enneagramType),
      swipeTypeName: getDisplayName(getSwipeType(connectionStyle, enneagramType)),
      primaryConnection: connectionStyle,
      primaryEnneagram: enneagramType,
      detailedCombo: `${connectionStyle}_${enneagramType}`,
      method: 'direct_input' as const,
      calculatedAt: new Date(),
    };

    // Validate result structure
    expect(result.sessionId).toBeTruthy();
    expect(result.swipeType).toBe('solidRock');
    expect(result.swipeTypeName).toBe('Solid Rock');
    expect(result.primaryConnection).toBe('supportiveActions');
    expect(result.primaryEnneagram).toBe('type6');
    expect(result.detailedCombo).toBe('supportiveActions_type6');
    expect(result.method).toBe('direct_input');
    expect(result.calculatedAt).toBeInstanceOf(Date);
  });

  test('should handle all valid connection styles', () => {
    const connectionStyles = [
      'verbalAffirmation', 'qualityPresence', 'physicalCloseness',
      'supportiveActions', 'thoughtfulGestures', 'sharedGrowth'
    ];

    connectionStyles.forEach(style => {
      const swipeType = getSwipeType(style, 'type1');
      expect(swipeType).toBeTruthy();
      expect(typeof swipeType).toBe('string');
    });
  });

  test('should handle all valid enneagram types', () => {
    const enneagramTypes = [
      'type1', 'type2', 'type3', 'type4', 'type5',
      'type6', 'type7', 'type8', 'type9'
    ];

    enneagramTypes.forEach(type => {
      const swipeType = getSwipeType('verbalAffirmation', type);
      expect(swipeType).toBeTruthy();
      expect(typeof swipeType).toBe('string');
    });
  });
});


