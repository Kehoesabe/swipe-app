---
source_of_truth: testing
hierarchy: 2
ownership: QA Lead
project: SWIPE
last_review: 2025-10-17
---

# Testing Guidelines — SWIPE

## Requirements
- MUST have unit and integration tests for new/changed logic.
- MUST run full test suite before push to `origin`.
- MUST ensure `jest-dom` (or equivalent) is available in test setup where UI tests require it.
- MUST gate PRs on CI test success.

## Cadence
- During dev: focused tests for changed areas.
- Pre-push: full suite (`pnpm test` or `npx vitest run`).
- "One Red Before Many Greens" applies to spec-driven scoring or rules changes.

## Types
- Unit: functions, hooks, services.
- Integration: API routes, adapters.
- E2E (if present): happy paths only; **no live external calls**.

## Commands
- `pnpm test` / `npm run test`
- `pnpm test:watch` (local)
- `pnpm coverage` (if configured)

## References
- `.cursorrules`
- `DEVELOPMENT-WORKFLOW.md`
- `SECURITY-GUIDELINES.md`
- ADRs (e.g., ADR-015 for immutable constraints)

