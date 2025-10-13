# CURSOR IMPLEMENTATION SPECS

## Architecture Overview
- **Data:**
  - `src/data/questions.ts` (57 items)
  - `src/data/categoriesMap.ts` (ID → scale lists)
  - `src/data/swipeTypes.ts` (8 types + 54→8 mapping)
  - `src/data/centroids.json` (tie-break reference)
  - `src/data/reverseItems.json` (QA sanity)
- **Logic:**
  - `src/utils/randomizeQuestions.ts` (seeded order)
  - `src/utils/scoring.ts` (enhanced scoring, blends, tie-breaks)
  - `src/utils/validationScenarios.ts` (test patterns)
  - `src/utils/validateTestResult.ts` (diff helper)
- **UI (MVP):**
  - Single assessment flow that reads ordered IDs and renders by `displayOrder`.

## Types
```ts
type Direction = 'up'|'right'|'left'|'down';

interface Question {
  id: number;
  text: string;
  framework: 'connection'|'enneagram';
  category: string;
  reverse: boolean;
  weight: { up:number; right:number; left:number; down:number };
  tags?: string[];
}
```

## Flow

### Randomize
```ts
import { randomizeQuestions } from '../utils/randomizeQuestions';
const order = randomizeQuestions(questions, { seed: sessionSeed });
```

### Render
- Drive UI from `order[i].id`.
- Persist progress in AsyncStorage (or localStorage on web).

### Score
```ts
import { scoreAssessment } from '../utils/scoring';
const result = scoreAssessment(answersMap); // { means, primarySwipeType, blendSwipeType, topStyle, topEnneagram }
```

### Analytics
- Emit events per `docs/ANALYTICS_SPEC.md`.

## Validation Checks (runtime dev builds)
- Ensure all 57 IDs present, unique.
- Ensure framework run ≤ 2.
- Ensure reverse flags in `questions.ts` match `reverseItems.json` (warn on mismatch).

## Error Handling
- **Missing answer** → block next navigation; show toast.
- **Corrupt storage** → allow "restart assessment" CTA.
- **Scoring fallback** → centroid nearest match if mapping missing or double-tie.

## Testing
- Use `validationScenarios.ts` to produce expected results.
- Compare with `validateTestResult.ts` diffs; fail tests on mismatch.


