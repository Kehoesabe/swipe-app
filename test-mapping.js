// Quick test script to verify the mapping works
const { getSwipeType, getDisplayName } = require('./src/data/swipeTypeMapping.ts');

console.log('Testing Swipe Type Mapping...\n');

// Test a few key combinations
const testCases = [
  { connection: 'verbalAffirmation', enneagram: 'type6', expected: 'solidRock' },
  { connection: 'supportiveActions', enneagram: 'type8', expected: 'watchfulGuard' },
  { connection: 'physicalCloseness', enneagram: 'type2', expected: 'warmHeart' },
  { connection: 'sharedGrowth', enneagram: 'type3', expected: 'progressPartner' },
];

testCases.forEach(({ connection, enneagram, expected }) => {
  const result = getSwipeType(connection, enneagram);
  const displayName = getDisplayName(result);
  const passed = result === expected;
  
  console.log(`${connection} + ${enneagram} = ${displayName} ${passed ? '✅' : '❌'}`);
});

console.log('\nMapping test complete!');
