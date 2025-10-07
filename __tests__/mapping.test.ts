import { getSwipeType, getDisplayName } from '../src/data/swipeTypeMapping';

describe('Swipe Type Mapping', () => {
  test('maps specific combinations correctly', () => {
    // Test key combinations from the spec
    expect(getSwipeType('verbalAffirmation', 'type6')).toBe('solidRock');
    expect(getSwipeType('supportiveActions', 'type8')).toBe('watchfulGuard');
    expect(getSwipeType('physicalCloseness', 'type2')).toBe('warmHeart');
    expect(getSwipeType('verbalAffirmation', 'type1')).toBe('gentleGuide');
    expect(getSwipeType('qualityPresence', 'type4')).toBe('deepConnector');
    expect(getSwipeType('physicalCloseness', 'type5')).toBe('authenticSoul');
    expect(getSwipeType('sharedGrowth', 'type3')).toBe('progressPartner');
    expect(getSwipeType('thoughtfulGestures', 'type7')).toBe('freeSpirit');
  });

  test('returns fallback for unknown combinations', () => {
    expect(getSwipeType('unknownStyle', 'type1')).toBe('solidRock');
  });

  test('displays correct names', () => {
    expect(getDisplayName('solidRock')).toBe('Solid Rock');
    expect(getDisplayName('watchfulGuard')).toBe('Watchful Guard');
    expect(getDisplayName('warmHeart')).toBe('Warm Heart');
    expect(getDisplayName('gentleGuide')).toBe('Gentle Guide');
    expect(getDisplayName('deepConnector')).toBe('Deep Connector');
    expect(getDisplayName('authenticSoul')).toBe('Authentic Soul');
    expect(getDisplayName('progressPartner')).toBe('Progress Partner');
    expect(getDisplayName('freeSpirit')).toBe('Free Spirit');
  });
});
