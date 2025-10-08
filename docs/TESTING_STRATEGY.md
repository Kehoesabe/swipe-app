# Testing Strategy — Swipe Type (MVP)

## Testing Pyramid
1) **Unit** — utils, scoring, components with logic
2) **Integration** — API routes + DB (Supabase) + Stripe mocks
3) **E2E** — critical user flows (browser + mobile viewport)
4) **Manual QA** — pre-launch checklist and exploratory testing

---

## Tooling
- **Unit/Integration**: Jest, React Testing Library, MSW (API mocks)
- **E2E**: Playwright (recommended) or Cypress
- **API**: Postman/Insomnia collections (optional)
- **Load (optional)**: k6/Artillery for hot paths

---

## Scope & Critical Paths

### 1) Assessment Flow (E2E)
- Anonymous user → start assessment
- Render all 57 questions in sequence
- Swipe + keyboard + button input work
- Submit with 57 responses → computes scores
- Free summary shows correct **Swipe Type** (use known seed scenarios)

### 2) Purchase Flow (E2E)
- From results → "Unlock Full Report"
- Stripe Checkout opens
- Complete with test card
- Redirect back with success
- **Premium unlocked** = true → full report accessible
- Receipt email is sent (mock or sandbox)

### 3) Auth & Profile
- Sign-up (email/password), email verification link
- Login & logout
- Password reset (email link path)
- (Optional) OAuth (Google/Apple)

### 4) Admin Panel
- Admin login guard works
- User search/detail
- Manual premium unlock (with reason) → audit log entry
- Refund process updates DB + revokes premium → audit log

---

## Unit Tests (Examples)
- **Scoring**: verify reverse-coded items invert, normalized means, blend margins, centroid tie-break (if configured).
- **Utilities**: seeded randomizer deterministic output.
- **Components**: AssessmentCard interactions stubbed; Progress bar animation updates.

**Command**:
```bash
npm run test
```

---

## Integration Tests (Examples)
- **API**: `/api/assessment/submit` computes expected mapping from known response fixtures.
- **DB**: Insert an assessment, POST submit → expect scores + mapping persisted.
- **Payments**: webhook handler given `checkout.session.completed` payload → marks paid, flips `premium_unlocked`.
- Use Stripe test fixtures; verify signature using test secret.

---

## E2E Tests (Playwright)
**Scenarios**:
- All YES pattern → expect [Type X]
- All NO pattern → expect [Type Y]
- Deep Connector pattern (qualityPresence + type4) → expect Deep Connector
- Purchase happy path → premium visible

**Non-ideal**:
- Abandon & resume assessment
- Payment cancel/return → still locked
- Network slow/failed → friendly errors

**Command**:
```bash
npx playwright test
```

---

## Test Data & Seeding
- **Users**: 1 admin, 3 test users
- **Assessments**: 8 fixtures (one per Swipe Type)
- **Payments**: 2 paid, 1 refunded, 1 failed
- Provide SQL or API seed scripts for local/staging.

---

## Manual QA Checklist (Pre-Launch)
- [ ] Landing loads fast on 3G, LCP < 2.5s
- [ ] Assessment renders 57/57 questions; gestures smooth @ 60fps
- [ ] Keyboard & button inputs work; undo works
- [ ] All reverse-coded items correctly invert (spot-check)
- [ ] Results → correct Swipe Type across 8 canned scenarios
- [ ] Paywall copy correct; price shows $12
- [ ] Stripe Checkout success → premium unlocked
- [ ] Stripe refund → premium revoked
- [ ] Emails: welcome, verification, completion, purchase, reset, deletion (content + links)
- [ ] Admin routes locked to admins; role-gates enforced
- [ ] Privacy/Terms/Cookie/Accessibility pages accessible
- [ ] Accessibility: focus states, screen reader labels, contrast AA
- [ ] Error/empty/loading states present and clear
- [ ] No console errors; no PII in logs

---

## Reporting & Gates
- CI must pass unit & integration tests on PR.
- Staging E2E must pass core flows before production promotion.
- A sign-off checklist stored in repo (`/docs/QA_CHECKLIST.md`).

---

## Maintenance
- Add regression tests for each production bug fixed.
- Record flaky tests and stabilize within 48h.
