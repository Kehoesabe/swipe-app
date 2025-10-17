import { getSwipeType, getDisplayName } from '../data/swipeTypeMapping';

// Test all 54 combinations to ensure they map correctly
export function testAllMappings() {
  const connectionStyles = [
    'verbalAffirmation',
    'qualityPresence', 
    'physicalCloseness',
    'supportiveActions',
    'thoughtfulGestures',
    'sharedGrowth'
  ];

  const enneagramTypes = [
    'type1', 'type2', 'type3', 'type4', 'type5',
    'type6', 'type7', 'type8', 'type9'
  ];

  const results: Record<string, number> = {};
  let totalCombinations = 0;

  console.log('Testing all 54 combinations...\n');

  connectionStyles.forEach(connectionStyle => {
    enneagramTypes.forEach(enneagramType => {
      totalCombinations++;
      const swipeType = getSwipeType(connectionStyle, enneagramType);
      const displayName = getDisplayName(swipeType);
      
      results[swipeType] = (results[swipeType] || 0) + 1;
      
      console.log(`${connectionStyle} + ${enneagramType} = ${displayName}`);
    });
  });

  console.log(`\nTotal combinations tested: ${totalCombinations}`);
  console.log('\nDistribution of Swipe Types:');
  Object.entries(results).forEach(([type, count]) => {
    console.log(`${getDisplayName(type as any)}: ${count} combinations`);
  });

  return results;
}

// Test specific combinations mentioned in the spec
export function testSpecificCombinations() {
  const testCases = [
    { connection: 'verbalAffirmation', enneagram: 'type6', expected: 'solidRock' },
    { connection: 'supportiveActions', enneagram: 'type8', expected: 'watchfulGuard' },
    { connection: 'physicalCloseness', enneagram: 'type2', expected: 'warmHeart' },
    { connection: 'verbalAffirmation', enneagram: 'type1', expected: 'gentleGuide' },
    { connection: 'qualityPresence', enneagram: 'type4', expected: 'deepConnector' },
    { connection: 'physicalCloseness', enneagram: 'type5', expected: 'authenticSoul' },
    { connection: 'sharedGrowth', enneagram: 'type3', expected: 'progressPartner' },
    { connection: 'thoughtfulGestures', enneagram: 'type7', expected: 'freeSpirit' },
  ];

  console.log('Testing specific combinations from spec...\n');
  
  testCases.forEach(({ connection, enneagram, expected }) => {
    const result = getSwipeType(connection, enneagram);
    const displayName = getDisplayName(result);
    const passed = result === expected;
    
    console.log(`${connection} + ${enneagram} = ${displayName} ${passed ? '✅' : '❌'}`);
    if (!passed) {
      console.log(`  Expected: ${expected}, Got: ${result}`);
    }
  });
}




