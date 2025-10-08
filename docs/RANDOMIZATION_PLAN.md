# RANDOMIZATION PLAN

## Goals
- Reduce yes-set and order effects.
- Keep assessment coherent (not chaotic).
- Guarantee reproducibility with a seed for debugging.

## Strategy (Semi-Structured)
1. **Warm-up cluster:** Take up to 6 items tagged `onboarding_easy`.
2. **Middle:** Deterministic shuffle of remaining items.
3. **Finale cluster:** Take up to 6 items tagged `high_signal`.
4. **Window rule:** Max run of 2 from the same framework (connection vs enneagram).
5. **Reverse distribution:** Reverse-coded items are naturally dispersed by the window rule + shuffle.

## Implementation
- File: `src/utils/randomizeQuestions.ts`
- API:
  ```ts
  randomizeQuestions(questions, {
    seed?: number,        // default 42
    maxRun?: number,      // default 2
    warmupCount?: number, // default 6
    finaleCount?: number  // default 6
  }) => Array<{ id, displayOrder }>
  ```

## Why This Works
- **Alternation guard (maxRun=2)** avoids long same-framework runs.
- **Warm-up** uses simple, low-stakes items to build momentum.
- **Finale** uses high-discrimination items to sharpen signal near the end.
- **Deterministic RNG** enables exact reproduction of any user's order during QA.

## Validation
Unit tests ensure:
- All 57 IDs appear exactly once.
- No framework run > 2.
- Warm-up/finale quotas respected when tags exist.
- Stable order given the same seed.

## Operations Notes
- If tags are absent, algorithm still produces a high-quality order using window rule.
- To A/B test different seeds, vary seed per user hash (e.g., userId mod 100).
