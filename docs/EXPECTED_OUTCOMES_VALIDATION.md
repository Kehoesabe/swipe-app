# EXPECTED OUTCOMES VALIDATION

## What This Covers
- Confirms mapping (54→8) and reverse coding are correct.
- Prevents regressions in scoring logic and blend rules.

## Artifacts
- `src/utils/validationScenarios.ts` — deterministic patterns w/ expected results
- `src/utils/validateTestResult.ts` — comparator with float tolerance
- `src/utils/scoring.ts` — enhanced scorer

## How to Run (example)
```ts
import { testScenarios } from '../src/utils/validationScenarios';
import { scoreAssessment } from '../src/utils/scoring';
import { validateTestResult } from '../src/utils/validateTestResult';

testScenarios.forEach(s => {
  const actual = scoreAssessment(s.pattern);
  const { pass, errors } = validateTestResult(
    {
      primarySwipeType: actual.primarySwipeType,
      topStyle: actual.topStyle,
      topEnneagram: actual.topEnneagram,
      means: actual.means,
      blend: actual.blendSwipeType ?? null
    },
    s.expected
  );
  if (!pass) {
    console.error(`FAILED: ${s.name}\n` + errors.join('\n'));
  }
});
```

## Scenarios Included
- **All YES! (UP)**
- **All NO! (DOWN)**
- **Alternating UP/DOWN**
- **Deep Connector target (qualityPresence + type4)**
- **Solid Rock target (supportiveActions + type6)**
- **Watchful Guard target (physicalCloseness + type8)**
- **Warm Heart target (thoughtfulGestures + type2)**
- **Progress Partner target (sharedGrowth + type3)**

## Pass Criteria
- All scenarios produce expected primary type, top style/type, and identical normalized means (ε ≤ 1e−6).
- Blend present only when margins < 0.20 per framework.
- Centroid tie-break invoked only when both margins < 0.05 or mapping key missing.


