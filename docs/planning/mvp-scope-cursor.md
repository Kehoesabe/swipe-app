# SWIPE TYPE MVP - CURRENT STATE & SCOPE

## PRODUCT DEFINITION
**Single Assessment Tool:**
- 57-question relationship personality assessment (expanding to 72)
- Swipe-based interaction (up/right/down/left = 4-point scale)
- 12 domains → 5 communication channels → 8 relationship types
- Free summary + $12 premium report unlock
- Admin panel for support/analytics

**Platform:** Expo (web/iOS/Android)

## USER FLOW
Launch → take assessment (72 swipes) → submit → see free summary → optional checkout → unlock premium report

## NOT IN MVP
❌ Couples/partner compatibility features
❌ Dynamic testing (mini-assessments over time)
❌ Digital personality assessment (DST)
❌ Advanced analytics/A/B testing
❌ Multi-language support

## CURRENT STATE (as of now)

### ✅ Complete
- Expo app runs; landing screen working
- Assessment screen renders all cards; swipe + buttons stable
- Haptics web-guard applied; pill messages stable
- 11 documentation batches complete
- Branching rules in place

### ⚠️ Partial
- Results/premium/checkout screens exist but not wired to data
- Supabase: project configured (env/docs exist), not integrated in runtime
- Answers live only in local React state

### ❌ Not Started
- No persistence to DB; no API client / repo layer wired
- No RLS policies/types used by app (no Supabase calls yet)
- No scoring algorithm running (no results calculation)
- Results navigation/theme guard not confirmed end-to-end
- Checkout not functional (test flow only mocked visually)
- No "premium unlocked" state persisted
- No E2E automation (Playwright/Detox not set up)
- No analytics (no event logging)

## WHAT REMAINS TO FINISH MVP

### 1) Persistence (answers + submission)
- Create data layer: responsesRepo with saveAnswer, saveBatch, finalizeAssessment
- Wire SwipeCard.onCommit → repo (buffer queue + retry; flush on submit)
- Tables: assessments, responses
- Acceptance: swipes store rows in Supabase; submit creates assessment record

### 2) Scoring v0 (interim)
- Implement normative scorer: reverse-key → domain sums → within-person z → POMP
- Map to 8 Swipe Types via two composite axes
- Include deltas, confidence, flags
- Acceptance: given fixed seed of answers, scorer returns stable type + numbers

### 3) Results navigation + theme guard
- On submit: calculate score → navigate to Results → render free summary
- Acceptance: end of Q72 → results screen shows computed data

### 4) Checkout (test) + premium unlock
- Implement test-mode checkout and set premium_unlocked = true
- Gate premium report behind flag
- Acceptance: free summary → checkout → premium report renders; persists on reload

### 5) Minimal analytics (MVP)
- Log 6 events: assessment_start, answer_committed, assessment_submit, results_view, checkout_start, checkout_success
- Acceptance: events appear with session_id and timestamps

### 6) E2E smoke (web first)
- Playwright: start → answer 72 → submit → see free summary → mock checkout → see premium
- Acceptance: CI job runs; produces GIF of flow

### 7) Polishing & docs
- Update README (env vars, feature flags, run scripts)
- Add feature flags: USE_PERSISTENCE, USE_SCORING_V0, ENABLE_CHECKOUT_TEST
- Add known-issues + rollback notes

## MVP EXIT CRITERIA
☐ Swipes persist and survive app reload
☐ Submit computes results and navigates to results screen
☐ Free summary shows type, top 2 channels, friction+repair, confidence
☐ Test checkout completes and unlocks premium report
☐ Playwright smoke passes locally
☐ Minimal analytics captured (6 events)
☐ README/env/flags updated; main remains stable
