---
source_of_truth: security
hierarchy: 2
ownership: Security Lead
project: SWIPE
last_review: 2025-10-17
---

# Security Guidelines — SWIPE

## Secrets & Env
- NEVER commit secrets or `.env*` files.
- `.env.local` is protected: changes REQUIRE **double approval** (two maintainers) and PR links.
- Rotate keys on suspicion; store in CI secrets manager.

## External APIs
- **No live API calls** in tests/CI.
- Live calls in dev ONLY with explicit, written approval and a recorded rationale.
- Feature flags must default to **off** in tests/CI (e.g., `VITE_SR_ENABLED=false`).

## Data Handling
- Log redaction for tokens/PII.
- Use least-privilege service accounts.
- Remove test data from prod systems.

## Packages & Supply Chain
- Pin/lock dependencies; run vulnerability scans in CI.
- No postinstall scripts unless vetted.

## Incident Process
- Immediately revoke/rotate exposed keys.
- File incident issue with timeline and remediation.
