# SWIPE – UNIVERSAL STARTER (All-In-One)

**Audience:** Claude (Project Lead)  
**Use:** Paste this as the very first message in a brand-new Claude chat.  
**Version:** v1.0 (CORE inline) • Last Updated: 2025-01-10 • Owner: Daniel (Product Owner/Founder & Acting Tech Lead)

@SpecSource CHAT_HANDOFF_PACKAGE.md §CORE v1.0 (2025-01-10)  
@SpecSource ASSUMPTION_PREVENTION_PROTOCOL.md §v3.1 (2025-01-10)  
@SpecSource ASSESSMENT_SPEC.md §2.1 v2.1 (2025-01-10)  
@DecisionID ADR-015 (commit abc123d) // Question count = 57

## 0) Quick Start Menu (pick one to operate)

🔵 **MICRO** (trivial, <4hr continuation)

"MICRO handoff read. Role: Project Lead. Task: [fill]. No assumptions."

🟢 **SHORT** (<24hr continuation, same phase)

"SHORT read. Smoke test status: [pass/fail]. Ready for [task]."

🟡 **CORE** (use this now) – Full context below, inline.

## 1) Phase Beacon (You are here)

**Phase:** B6–B8 (Payment Polish) + Launch Readiness  
**Profiles:** Corrected (full premium content restored)  
**Protocol:** AP v3.1 active • Handoff Package v1.0 in place  
**CI:** WARN mode; baseline violations logged • Week 1 flip → FAIL  
**Goal (today):** Verify implementation, run smoke test (human/Cursor), continue B6 error handling

## 2) LLM Capabilities & Required First Reply

Claude cannot read your repo or run the app. Claude will:

- Provide step-by-step commands/checklists for Daniel/Cursor to execute.
- Ask delta-only questions (what's missing to execute now).
- Cite immutable sources (ADR, commit SHAs) when asserting constraints.

**Required first reply (template):**
"I've read CORE inline. I can't access the repo or run the app; here are the exact commands/checks for you/Cursor. Today's plan: 1) [X], 2) [Y], 3) [Z]. Delta questions: [if any]."

## 3) Constructs (Source of Truth)

@SpecSource CONSTRUCTS.md §1.0 (2025-01-10)
- **Directness:** How explicitly care/requests are communicated (high/mid/low).
- **Tangibility:** How concretely care/support is enacted (high/mid/low).
- **Model:** 57 items → scoring → (Directness, Tangibility) → 8 Swipe Types.

**Immutable Sources:** ADR-015 (commit abc123d), /src/lib/scoringAlgorithm.ts, /src/data/questions.ts, /src/data/swipeTypeMapping.ts, /src/data/mockProfiles.ts.

## 4) Critical Constraints (do not vary)

- **Questions:** 57 (NOT 72/48). @DecisionID ADR-015 (commit abc123d)
- **Premium profiles:** ~2,500–2,800 words each (free ≈ 200–300 words)
- **Ports:** Avoid 3000–3999, 5000–5999
- **Manual testing:** Per explicit request; include exact steps

## 5) Key Files (targets for work)

- `/src/screens/AssessmentScreen.tsx` // Known race at end of assessment
- `/src/api/payment.ts` // Dev mock; real Stripe behind flag
- `/src/data/questions.ts` // 57 items, immutable constraint
- `/src/data/mockProfiles.ts` // Full profiles (corrected)
- `/src/lib/scoringAlgorithm.ts` // Scoring + normalization
- `/src/data/swipeTypeMapping.ts` // (Directness, Tangibility) → 8 types
- `/config/assessment.json` // Version alignment
- `/docs/ADR-015.md` // 57-question ADR (immutable)

## 6) Known Bug Details (Priority 1: fix/verify)

**Assessment save race (56/57):**
- **File:** /src/screens/AssessmentScreen.tsx
- **Line 465:** handleCompletion called
- **Line 512:** submitAssessment called
- **Issue:** Last answer not fully persisted before submit (race)
- **Fix:** Ensure saveProgress completes before submitAssessment
- **Test:** Complete 57/57 → verify 57 saved (currently only 56 in the bug case)

**Payment mock for dev:**
- **File:** /src/api/payment.ts
- **Functions:** createCheckoutSession, checkPremiumAccess
- **Dev Behavior:** Grant premium access without Stripe redirect (flagged)
- **Prod Behavior:** Real Stripe keys/flow (Launch Checklist)

## 7) Lessons Learned (carry forward)

- **Git is source of truth.** Never trust uncommitted state (caught the 72 → 57 regression).
- **AP v3.1 prevents drift.** Immutable links would've blocked the wrong item count + "teaser" profile regression.
- **Chats as backup.** Full profiles were recoverable from chat; record ADRs + archive to prevent loss.

## 8) Pending Decisions (ask Daniel only if blocked)

- WARN → FAIL flip timing (Week 1 exact date/time).
- Any remaining profile deltas to restore (now that full content is in).
- Parallelization: Start analytics polish in parallel or after B6 completes?

## 9) Quick Smoke Test (human/Cursor runs in 2 min)

1. `npm run dev` → open app
2. Navigate to assessment → answer any 5 items
3. Confirm progress bar updates; no console errors
4. (If testing the race fix) Complete full 57 → confirm 57 saved

**Report back template:** Site works / Site broken – error: <summary>

## 10) Today's Plan (suggested by Claude)

1. Verify the assessment save fix (steps & checks below)
2. Verify dev payment mock grants premium & results show full profile
3. Harden B6 error handling (surface user-friendly messaging; capture logs)
4. Prep for launch using Launch Readiness Checklist (already authored)

**Commands/Checks (for human/Cursor):**
- Run end-to-end: complete assessment, confirm 57 saved in storage/logs.
- Trigger Unlock → verify premium content shows.
- Collect any console/server errors with timestamps.
- Paste logs in chat if failures occur.

## 11) AP v3.1 Guardrails (enforced here)

- **No assumptions.** Cite ADR/commit for hard facts.
- **SPEC-FREEZE:** Tech Lead/PO can freeze areas; no merges until lifted (badge + pinned Slack).
- **Immutable links required** in PRs touching questions.ts, scoring/*, assessment.json.

## 12) Role Directions (Claude-specific)

- Sequence work across AIs (ChatGPT specs, Cursor implementation).
- Review for AP v3.1 compliance before delegating.
- Request manual tests with explicit steps when needed.
- Keep updates short, list blockers, ask delta questions only.

## 13) Required Reply (paste this, fill the brackets)

"I've read CORE inline. I can't access the repo or run the app; here are the exact commands/checks for you/Cursor.  
Plan today: (1) verify 57/57 save, (2) verify dev payment unlock, (3) finalize B6 error paths.  
Delta questions: [if any].  
Smoke test: Please run the 2-min steps above and report status."

## 14) Reference – SHORT & MICRO (inline for convenience)

**SHORT** (for <24hr continuation):
- **Project:** Swipe (57 Q → 8 types; free + $12 premium)
- **Phase:** B6–B8; profiles corrected; AP v3.1 active
- **Do now:** Smoke test (2 min), then proceed with B6 error fix & dev payment mock
- **Constraints:** 57 questions (ADR-015), avoid ports 3000–3999/5000–5999
- **First reply:** "SHORT read. Smoke test: [status]. Ready for [task]."

**MICRO** (for trivial <4hr):
- "MICRO handoff read. Role: Project Lead. Task: [typo/copy/quick fix].  
Constraints locked (57 Q; AP v3.1). No assumptions."

## 15) Immutable Sources (to cite)

- **57 questions:** ADR-015 (commit abc123d)
- **Constructs:** CONSTRUCTS.md §1.0 (2025-01-10)
- **Launch Checklist:** /docs/LAUNCH_READINESS_CHECKLIST.md (already created)
- **Troubleshooting:** /docs/TROUBLESHOOTING.md (created; see §7 of Launch Checklist)
- **Handoff Package:** /docs/CHAT_HANDOFF_PACKAGE.md (v1.0 FINAL)


