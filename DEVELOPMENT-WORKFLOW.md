---
source_of_truth: process
hierarchy: 2
ownership: Eng Lead
project: SWIPE
last_review: 2025-10-17
---

# Development Workflow — SWIPE

## Branching & Commits
- Branch: `feat|fix|chore/<short-scope>` (e.g., `feat/scoring-quarters`)
- Commit format: `<type>(scope): summary` (Conventional Commits)
- Keep PRs small and focused.

## Local Setup
- Node version: use repo `.nvmrc` / `.tool-versions` if present.
- Install: `pnpm i` | `npm ci`
- PowerShell-first on Windows.

## Pre-push / Pre-merge
1. **Typecheck**: `pnpm typecheck` (or `npm run typecheck`)
2. **Tests**: `pnpm test` or `npx vitest run` (full suite)
3. **Lint/Format**: `pnpm lint && pnpm fmt`
4. **Build**: `pnpm build`
5. **Guardrails**: `pnpm run guardrails:check`

## PR Flow
- Link issues/ADRs and note any policy sections consulted.
- If `.env.local` changes are proposed → include **double-approval links**.
- Fill PR checklist (see repo PR template).

## Deploy
- Staging via CI on merge to `main`.
- Production via protected branch or release tag per CI config.

## References
- `.cursorrules` (policy)
- `SECURITY-GUIDELINES.md`
- `TESTING-GUIDELINES.md`
- ADRs in `docs/decisions/` or `adr/`
