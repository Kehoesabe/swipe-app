import { getSwipeType, getDisplayName } from '../src/data/swipeTypeMapping';

describe('Swipe Type Mapping', () => {
  test('maps specific combinations correctly', () => {
    // Test key combinations from the spec
    expect(getSwipeType('verbalAffirmation', 'type6')).toBe('directNurturer');
    expect(getSwipeType('supportiveActions', 'type8')).toBe('directPlanner');
    expect(getSwipeType('physicalCloseness', 'type2')).toBe('clearCommunicator');
    expect(getSwipeType('verbalAffirmation', 'type1')).toBe('gentleGiver');
    expect(getSwipeType('qualityPresence', 'type4')).toBe('thoughtfulSupporter');
    expect(getSwipeType('physicalCloseness', 'type5')).toBe('harmonizer');
    expect(getSwipeType('sharedGrowth', 'type3')).toBe('steadyHelper');
    expect(getSwipeType('thoughtfulGestures', 'type7')).toBe('strategicPartner');
  });

  test('returns fallback for unknown combinations', () => {
    expect(getSwipeType('unknownStyle', 'type1')).toBe('directNurturer');
  });

  test('displays correct names', () => {
    expect(getDisplayName('directNurturer')).toBe('Direct Nurturer');
    expect(getDisplayName('directPlanner')).toBe('Direct Planner');
    expect(getDisplayName('clearCommunicator')).toBe('Clear Communicator');
    expect(getDisplayName('gentleGiver')).toBe('Gentle Giver');
    expect(getDisplayName('thoughtfulSupporter')).toBe('Thoughtful Supporter');
    expect(getDisplayName('harmonizer')).toBe('Harmonizer');
    expect(getDisplayName('steadyHelper')).toBe('Steady Helper');
    expect(getDisplayName('strategicPartner')).toBe('Strategic Partner');
  });
});

