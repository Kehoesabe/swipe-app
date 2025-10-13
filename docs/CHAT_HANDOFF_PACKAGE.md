# SWIPE – UNIVERSAL STARTER v1.2 (One-Paste, LLM-Safe)
**Protocol:** AP v3.1 (no assumptions; immutable links required)  
**Protocol owner:** Daniel (Product Owner/Founder; Acting Tech Lead)  
**Classification:** Internal – Project Team Only

**New chat:** Read the CORE section inside this message (no repo access needed), run the LLM-safe handshake, then reply with the Required First Reply at the end.

## A) Quick Usage (for the human who's starting the chat)
Paste this entire message to start any new chat (Claude, ChatGPT, etc.).

The model will find CORE inline below and proceed.

If it's a trivial continuation, use the MICRO snippet in Appendix 1.

## B) Project Context (Today)
**Phase B6–B8 Payment Polish, Week 0 (Dry-run)**

- AP v3.1 + Handoff Package v1.0 authored
- CI set to WARN mode (collect baseline)
- Priority: Finish B6 (error handling) → proceed B7/B8

## C) CORE HANDOFF (inline, required reading)

### 1) What broke / what's fixed
- **57→72 questions regression:** Reverted to 57; decision documented as ADR-015 (immutable link required in PRs).
- **Profiles regression:** Premium profiles currently short teasers; the correct ~2.5k-word profiles exist (from prior chat) but not yet restored to codebase.

### 2) Critical constraints
- **Question count = 57** (NOT 72 / NOT 48). Source: ADR-015 (immutable)
- **Ports:** avoid 3000–3999 and 5000–5999
- **Constraint copy** ("57 questions", "3–4 minutes") must include @SpecSource
- **If uncertain → STOP & ASK (AP v3.1)**

### 3) Known bug details (Priority 1)
**Assessment saves 56/57 (race condition)**
- File: `/src/screens/AssessmentScreen.tsx`
- Focus region: Lines 440–530
- ~465: handleCompletion invoked
- ~512: submitAssessment called
- Issue: last selection not persisted before submit; saveProgress not awaited
- Fix: ensure saveProgress(...) completes (await/then) before submitAssessment(...)
- Test: full 57-question run → 57/57 saved (no off-by-one)

**Dev payment mock (needed to test premium path)**
- File: `/src/api/payment.ts`
- Functions to mock in dev: createCheckoutSession, checkPremiumAccess
- Guard behind flag (e.g., ENABLE_PAYMENT=false or NODE_ENV==='development')

### 4) Key files (touch with care)
- `/docs/ADR-015.md` — 57-question decision (immutable source)
- `/config/assessment.json` — version alignment (itemCount: 57, versions)
- `/src/data/questions.ts` — 57 items only
- `/src/data/mockProfiles.ts` — currently teasers; restore full profiles
- `/src/screens/AssessmentScreen.tsx` — race fix region L440–530
- `/src/api/payment.ts` — add dev mock; keep real Stripe behind flag

### 5) Lessons learned (prevent repeats)
**Went wrong:**
1. Uncommitted changes treated as production → verify git log/show first
2. Assumption cascade (72) nearly cemented wrong spec → immutable sources only
3. Silent content regressions (profiles → teasers) → AP v3.1 would have blocked this

**Worked well:** Methodical git investigation; chat history preserved all 8 profiles; collaborative debugging.

### 6) Pending decisions (ask Daniel)
- **Profile restoration method:** A) Manual copy from Google Docs → repo, B) Extract from prior chat, C) Cursor scrapes chat
- **Flip CI WARN→FAIL:** confirm Week-1 date + calendar reminder
- **ChatGPT parallel work:** expand free/premium copy now or after site passes smoke?

### 7) Immutable sources to cite in PRs
- ADR-015 (57 questions) → link file path or commit SHA
- Scoring/analytics changes → ADR + commit SHA
- Constraint copy → @SpecSource header

### 8) Today's plan (execution order)
1. Fix assessment race (Priority 1)
2. Add dev payment mock (flag-guarded)
3. Restore full profiles (validate with 1 type, then all 8)
4. AP v3.1 guardrails in repo (docs, CI WARN checks, templates)
5. Manual verification (end-to-end smoke)

### 9) Roles
- **Claude:** Project lead; review specs; sequence work; enforce AP v3.1
- **ChatGPT:** Senior analyst/dev; write specs, PR checklist, content; no final arch decisions
- **Cursor:** Implementation; build to exact specs; report completion; no assumptions

### 10) LLM-Safe Handshake (no repo access required)
You (human) paste back these artifacts so the model can act:

**2-min Smoke Test**
```
SMOKE_TEST
status: [OK|BROKEN]
errors (if any): [console/network lines or "none"]
platform/env: [expo|web|ios|android] / [dev|prod]
```

**Config snapshot (from /config/assessment.json)**
```
CONFIG_SNAPSHOT
itemCount: [number]
itemBankVersion: [vX.Y]
modelVersion: [vX.Y]
assessmentVersion: [vX.Y]
```

**Immutable anchors**
```
SOURCES
adr_015_link: [/docs/ADR-015.md OR commit <SHA>]
git_head: [abcdef1]
```

**Targeted code (no truncation)**
- `/src/screens/AssessmentScreen.tsx` lines 440–530
- `/src/api/payment.ts`
- `/src/data/mockProfiles.ts` (paste one full type object)

```
CODE_SNIPPETS
AssessmentScreen.tsx (L440–530):
[PASTE]

payment.ts:
[PASTE]

mockProfiles.ts (one type object):
[PASTE]
```

**Model will return:**
- Minimal bug-fix spec/patch (awaiting saveProgress) + tests
- Dev payment mock spec (flag, stubs, acceptance criteria)
- Profiles restore plan (shape + word-count checks, @SpecSource)
- A ready-to-paste Cursor task, PR checklist, and manual test script

*(If you can't run smoke now, reply SMOKE_TEST status: DEFERRED and the model works in Spec-Only mode; manual testing required before merge.)*

### 11) AP v3.1 guardrails (must be in PR/spec)
- SPEC VERIFICATION CHECKLIST completed
- Immutable links cited (ADR IDs and/or commit SHAs)
- @SpecSource headers in changed files (assessment/scoring/analytics + constraint-copy)
- No magic numbers in assessment/scoring paths
- CI currently WARN (Week-0); flip to FAIL in Week-1

### 12) Required first reply (from the model)
"I've read CORE, received the LLM-safe artifacts (or DEFERRED), completed the SPEC VERIFICATION CHECKLIST for new work, and I'm ready."

### 13) Success criteria
- Assessment race fixed → 57/57 saved reliably
- Dev payment mock functioning behind a flag
- At least one full premium profile renders (then all 8)
- PR includes AP v3.1 artifacts (immutable links, @SpecSource, checklist)
- Manual smoke passes end-to-end

## D) Manual Testing (2-min Smoke)
1. Run dev server → open app → navigate to assessment
2. Answer ~5 items → verify progress bar updates
3. Check console for errors
4. Report with the SMOKE_TEST block in §10

## E) Immutable Source & Docs Map (save later as files)
- `/docs/ASSUMPTION_PREVENTION_PROTOCOL.md` (AP v3.1)
- `/docs/CHAT_HANDOFF_PACKAGE.md` (this content; versions in Appendix)
- `/docs/DECISION_LOG.md` + ADR-015 (57 questions)
- `/docs/templates/*` (checklist, AI handoff, waiver)
- `/config/assessment.json` (version alignment schema)
- CI: `.github/workflows/*` (AP checks in WARN mode)

## F) Appendix 1 — MICRO & SHORT first-message snippets (copy when needed)

### MICRO (trivial, <4hr):
```
Starting Swipe chat. MICRO handoff: continuing same task (<4hr).
Context: [1 sentence].
AP v3.1 active (no assumptions, immutable links).
I'll provide SMOKE_TEST + CODE_SNIPPETS if needed. Ready for next step.
```

### SHORT (<24hr, same phase):
```
Starting Swipe chat. Please read SHORT handoff (below CORE, if present).
Context: continuing same phase (<24hr). AP v3.1 active.
I'll run the 2-min smoke test now and reply with SMOKE_TEST + CONFIG_SNAPSHOT.
```

## G) Appendix 2 — SHORT handoff (inline)
Continuing work from <24 hours ago; same phase; simple tasks

**Constraints:** 57 questions (ADR-015), ports 3000–3999/5000–5999 avoided, @SpecSource on constraint copy

**First action:** Run Smoke Test → reply with SMOKE_TEST & CONFIG_SNAPSHOT (see §10)

If awaiting instruction → "SHORT read; ready."

## H) Appendix 3 — Cursor Implementation Task (drop in when ready)
```markdown
# CURSOR TASK: Implement AP v3.1 + Handoff v1.0 (WARN mode)

## Objective
Add AP Protocol v3.1 and Chat Handoff Package (MICRO/SHORT/CORE/FULL) to docs; enable CI in WARN.

## Create
/docs/ASSUMPTION_PREVENTION_PROTOCOL.md
/docs/ASSUMPTION_PREVENTION_PROTOCOL_CHANGELOG.md
/docs/CHAT_HANDOFF_PACKAGE.md
/docs/templates/SPEC_VERIFICATION_CHECKLIST.md
/docs/templates/AI_HANDOFF_TEMPLATE.md
/docs/templates/AP_WAIVER_REQUEST.md
/docs/templates/HANDOFF_MICRO.md
/docs/templates/HANDOFF_SHORT.md
/docs/templates/HANDOFF_CORE.md
/docs/templates/HANDOFF_FULL.md
/docs/archive/INDEX.md
/config/schema/assessment.schema.json
/scripts/validate-config-versions.js
.github/workflows/assumption-prevention.yml
.github/workflows/ap-bot.yml
.github/workflows/immutable-link-check.yml
.github/workflows/config-validation.yml

## Update
/docs/README.md (prominent links)
/docs/DEVELOPMENT_WORKFLOW.md (AP references)
/.github/PULL_REQUEST_TEMPLATE.md (v3.1 checklist)
/config/assessment.json (itemCount:57 + versions)

## Backfill
Add @SpecSource headers to:
src/assessment/*.{ts,tsx}
src/scoring/*.{ts,tsx}
src/analytics/*.{ts,tsx}

## CI Mode
WARN only (log, don't fail). Collect baseline. Plan to flip to FAIL in Week-1.

## Acceptance
All docs present; templates available; WARN checks run; baseline logged; README links set; config schema validates; @SpecSource backfill issues opened.
```

## I) Appendix 4 — "For AI Passing Off to New Chat" (built-in)
**Before closing any chat, update in your reply:**

### For AI Passing Off to New Chat

**Before closing this chat:**
1. Update "Last Completed" section
2. Update "Active Work" section  
3. Update "Pending Decisions" list
4. Add any new lessons learned
5. Update "Last Updated" date

State which version the next chat should read (MICRO/SHORT/CORE/FULL).

*(These lines become the first lines of the next chat's context.)*

## J) Required First Reply (copy verbatim)
"I've read CORE, received the LLM-safe artifacts (or DEFERRED), completed the SPEC VERIFICATION CHECKLIST for new work, and I'm ready."

---

**Done.** Paste this entire block to start any new chat.
