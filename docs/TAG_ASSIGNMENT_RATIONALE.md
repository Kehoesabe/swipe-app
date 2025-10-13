# TAG ASSIGNMENT RATIONALE

These tags shape the warm-up and finale clusters in the randomized order.

## Principles
- **onboarding_easy:** Welcoming, low-stakes, concrete trade-offs. Minimal identity threat.
- **high_signal:** Strongly discriminating items; include reverses to counter acquiescence.

---

## Proposed Tags (v1)

### onboarding_easy (9 items)
- **Q1** — Simple post-stress preference (words vs task). Clear trade-off.
- **Q5** — Weeknight choice (talk vs show). Everyday scenario.
- **Q6** — Birthday hour talk vs present. Concrete, relatable.
- **Q10** — Casual touch while watching a movie. Low-stakes behavior check.
- **Q13** — Stressed: handled task vs encouragement. Clear A/B.
- **Q17** — Surprise gift vs quality time. Classic love-language split.
- **Q21** — Shared task vs relaxing. Action vs rest, non-threatening.
- **Q32** — Weekend finish project vs wander. Goal vs exploration.
- **Q42** — Vacation: new place vs familiar. Novelty tolerance.

### high_signal (10 items)
- **Q52 (reverse, Quality Presence)** — Comfort with distraction; strong QP discriminator.
- **Q53 (reverse, Physical Closeness)** — Connection without touch; strong PC discriminator.
- **Q54 (reverse, Supportive Actions)** — Words over deeds; flips SA.
- **Q55 (reverse, Type 1)** — Low sense of responsibility; flips Type1.
- **Q56 (reverse, Type 7)** — Few commitments vs options open; flips Type7.
- **Q57 (reverse, Type 2)** — Self-focus vs anticipating others; flips Type2.
- **Q35 (Type 4)** — Authenticity over fitting-in; clean Type4 signal.
- **Q39 (Type 6)** — Worst-case planning; strong Type6.
- **Q46 (Type 8)** — Takes charge; strong Type8.
- **Q23 (Shared Growth)** — Goals together vs time together; sharp SG discriminator.

> Note: Tag application occurs in `src/data/questions.ts` via a `tags?: string[]` field on each item.

---

## Operational Guidance
- Warm-up quota default: 6 (random subset of the 9 above).
- Finale quota default: 6 (random subset of the 10 above).
- It is safe to update tag lists without changing code; randomizer adapts.


