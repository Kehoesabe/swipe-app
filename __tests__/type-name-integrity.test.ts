import { getSwipeType, getDisplayName } from '../src/data/swipeTypeMapping';
import { SwipeTypeName } from '../src/lib/types';

describe('Type Name Integrity Tests', () => {
  describe('Active Caregiver → Steady Helper Migration', () => {
    test('Steady Helper type exists and maps correctly', () => {
      // Test that Steady Helper maps to the correct combinations
      expect(getSwipeType('sharedGrowth', 'type1')).toBe('steadyHelper');
      expect(getSwipeType('sharedGrowth', 'type3')).toBe('steadyHelper');
      expect(getSwipeType('sharedGrowth', 'type8')).toBe('steadyHelper');
      expect(getSwipeType('supportiveActions', 'type1')).toBe('steadyHelper');
      expect(getSwipeType('supportiveActions', 'type3')).toBe('steadyHelper');
      expect(getSwipeType('qualityPresence', 'type3')).toBe('steadyHelper');
      expect(getSwipeType('verbalAffirmation', 'type3')).toBe('steadyHelper');
      expect(getSwipeType('physicalCloseness', 'type3')).toBe('steadyHelper');
    });

    test('Steady Helper displays correct name', () => {
      expect(getDisplayName('steadyHelper')).toBe('Steady Helper');
    });

    test('No legacy Active Caregiver references remain', () => {
      // Ensure no old type names are returned
      const allTypes: SwipeTypeName[] = [
        'directNurturer', 'directPlanner', 'clearCommunicator', 'gentleGiver',
        'thoughtfulSupporter', 'harmonizer', 'steadyHelper', 'strategicPartner'
      ];
      
      allTypes.forEach(type => {
        expect(getDisplayName(type)).not.toBe('Active Caregiver');
        expect(getDisplayName(type)).not.toContain('Active Caregiver');
      });
    });
  });

  describe('Complete Type System Validation', () => {
    test('All 8 Profile Standards types are present', () => {
      const expectedTypes: SwipeTypeName[] = [
        'directNurturer', 'directPlanner', 'clearCommunicator', 'gentleGiver',
        'thoughtfulSupporter', 'harmonizer', 'steadyHelper', 'strategicPartner'
      ];

      expectedTypes.forEach(type => {
        expect(getDisplayName(type)).toBeDefined();
        expect(getDisplayName(type)).not.toBe(type); // Should return display name, not key
      });
    });

    test('Type display names match Profile Standards', () => {
      expect(getDisplayName('directNurturer')).toBe('Direct Nurturer');
      expect(getDisplayName('directPlanner')).toBe('Direct Planner');
      expect(getDisplayName('clearCommunicator')).toBe('Clear Communicator');
      expect(getDisplayName('gentleGiver')).toBe('Gentle Giver');
      expect(getDisplayName('thoughtfulSupporter')).toBe('Thoughtful Supporter');
      expect(getDisplayName('harmonizer')).toBe('Harmonizer');
      expect(getDisplayName('steadyHelper')).toBe('Steady Helper');
      expect(getDisplayName('strategicPartner')).toBe('Strategic Partner');
    });

    test('Type mapping covers all expected combinations', () => {
      // Test that each type has appropriate combinations mapped
      const typeCombinations = {
        'directNurturer': ['verbalAffirmation_type6', 'supportiveActions_type6'],
        'directPlanner': ['supportiveActions_type8', 'physicalCloseness_type8'],
        'clearCommunicator': ['physicalCloseness_type2', 'verbalAffirmation_type2'],
        'gentleGiver': ['verbalAffirmation_type1', 'qualityPresence_type1'],
        'thoughtfulSupporter': ['qualityPresence_type4', 'verbalAffirmation_type4'],
        'harmonizer': ['physicalCloseness_type5', 'supportiveActions_type4'],
        'steadyHelper': ['sharedGrowth_type1', 'supportiveActions_type1'],
        'strategicPartner': ['thoughtfulGestures_type7', 'qualityPresence_type7']
      };

      Object.entries(typeCombinations).forEach(([type, combinations]) => {
        combinations.forEach(combo => {
          const [style, enneagram] = combo.split('_');
          expect(getSwipeType(style, enneagram)).toBe(type as SwipeTypeName);
        });
      });
    });
  });

  describe('Backward Compatibility', () => {
    test('Fallback type is appropriate', () => {
      expect(getSwipeType('unknownStyle', 'type1')).toBe('directNurturer');
    });

    test('Unknown type names return themselves', () => {
      // This tests the fallback behavior in getDisplayName
      expect(getDisplayName('unknownType' as SwipeTypeName)).toBe('unknownType');
    });
  });
});



