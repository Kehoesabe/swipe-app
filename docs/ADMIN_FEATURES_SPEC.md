# Admin Features — Detailed Spec (MVP)

## Shared UI Components & Patterns
- Global search bar (email, userId, assessmentId, stripe_session_id).
- Table components with sort/filter/paginate; CSV export where noted.
- Confirmations for destructive actions, reason capture (textarea).
- Inline toasts for success/failure; error details hidden unless Admin.
- "Copy to clipboard" for IDs.

---

## 1) Dashboard
**Route:** `/admin`  
**Data:**
- Total users (all-time, last 30 days)
- Assessments completed (all-time, last 30 days)
- Completion rate = completed / (started)
- Premium purchases (count, revenue sum)
- Avg purchase rate = purchases / completed

**Charts (last 90 days):**
- Assessments over time (started vs completed)
- Revenue over time
- Type distribution (8 Swipe Types) — bar or donut
- Conversion funnel: started → completed → premium

**APIs / Queries (server-side)**
- `SELECT COUNT(*) FROM users WHERE created_at >= now()-interval '30 days'`
- Aggregations on `assessments` by status and date (date_trunc).
- Purchases via `payments WHERE status='paid'` grouped by date.
- Type distribution via `assessments.swipe_type`.

**Quick Actions:**
- Search user by email → route to `/admin/users?email=...`
- See recent support actions (audit log last 20)
- System status ping calls (Stripe, Email, DB).

**Security:** Read-only data to Support; charts hide raw PII.

---

## 2) User Management
### 2.1 User List
**Route:** `/admin/users`
**Filters:** email, displayName, signup date range, verified status, subscription tier  
**Columns:** email, display name, createdAt, lastSignIn, assessments count, purchases count, actions

**APIs:**
- List users with counts via lateral joins or follow-up queries.
- Pagination: `limit 50 offset n`.

### 2.2 User Detail
**Route:** `/admin/users/[userId]`  
**Sections:**
- **Profile**: email, display name, provider, verified, created/updated.
- **Assessments**: table (date, status, swipe_type, premium_unlocked, link).
- **Purchases**: table (amount, status, receipt_url, created, Stripe links).
- **Audit trail**: last 20 actions on this user.

**Actions (with confirmation + audit log):**
- **Grant Premium (Manual Unlock)**  
  - Input: assessment_id, reason (required).  
  - Effect: set `assessments.premium_unlocked=true`.
- **Resend Password Reset Email**  
  - Input: reason.  
  - Effect: trigger transactional email.
- **Delete Account (GDPR Erase)** [Admin only]  
  - Input: reason.  
  - Effect: anonymize/delete PII, detach assessments + payments; log.

**Security:** Support can't delete accounts or change roles.

---

## 3) Assessment Analytics
**Route:** `/admin/analytics`

**Overview:**
- Totals: assessments, completion rate, avg time to complete.
- Drop-off: % completed by question index; highlight the steepest drop.
- Low-variance item finder: items with >60% concentration on a single option.
- Type distribution (8 types), connection styles (6), enneagram (9).
- Blend frequency.

**APIs/Queries:**
- From `assessments.responses` (jsonb) derive timing and drop-off:
  - Count responses length per assessment.
  - Position-based counts (`questionId` order).
- Item distribution: aggregate `dir` per question id.
- Export CSV endpoints (server-only) for research.

**Flags & Notes:**
- Flag items with **>60%** single-option concentration.
- Flag items with **item-total corr < .20** (computed offline or via analytics job).

**Permissions:** Read-only to Support; exports available to Admin & Analyst.

---

## 4) Payment Management
**Route:** `/admin/payments`

### 4.1 Payment List
**Filters:** user email, assessmentId, status, date range, amount  
**Columns:** user email, assessmentId, amount, status, created, Stripe session link, actions (View)

**Status values:** `init`, `requires_payment_method`, `requires_action`, `processing`, `paid`, `failed`, `refunded`, `canceled`

### 4.2 Payment Detail
**Route:** `/admin/payments/[paymentId]`  
**Display:** amount, currency, created, status history, receipt_url, session_id, payment_intent_id, stripe_customer_id  
**Actions:**
- **Refund** (Admin; Support optional for <=$12 single transaction):  
  - Required: reason dropdown (technical issue, duplicate, user request, other) + notes  
  - Calls Stripe Refund API, updates DB (`status='refunded'`), flips `assessments.premium_unlocked=false`, logs audit.
- **Resend Receipt**: trigger email with `receipt_url`.
- **Open in Stripe** button (session/intent/customer).

**Error-handling:** Show meaningful admin messages; always write audit.

---

## 5) Support Tools
**Route:** `/admin/support`

**Widgets:**
- Quick Lookup: email OR assessmentId → jump to User Detail or Assessment View.
- View as user sees it: open read-only results (free/premium) for a given assessment.
- Common Actions:
  - Grant premium (select assessment)
  - Resend emails (verification, receipt, reset password)
  - Regenerate results (recompute with latest scoring if needed; Admin only).

**Audit requirements:** All actions require reason + write to audit.

---

## 6) System Health
**Route:** `/admin/health`

**Panels:**
- **Service Status**: DB, Stripe, Email provider; green/amber/red.
- **Recent Errors**: last 100 (timestamp, type, message, endpoint, userId nullable).
- **Performance**: avg API latency (last 1h/24h), slowest endpoints.
- **Jobs/Queues** (if used): email queue depth, failed jobs, retry.

**Links:** Stripe status page, Supabase status, Sentry/Log console.

**Permissions:** Read-only to Support; Admin can view deeper stack traces.

---

## 7) Audit Logging (Global)
**Schema:** `admin_audit_logs` (or reuse `payments.raw_event` pattern for events)
- Columns: id, admin_user_id, action, target_type (user|assessment|payment), target_id, reason, before_json, after_json, created_at.
- Every privileged action must log a record.

**Surfacing:**
- Show last 20 in Dashboard widget and User Detail.
- CSV export for Admins.

---

## 8) Non-Goals (MVP)
- No WYSIWYG content editing.
- No complex role editor in UI (use SQL or simple toggle for now).
- No full-featured error search UI (link to external tool).

---

## 9) Performance & Indexes
- Pagination everywhere; never load unbounded lists.
- Use indexes from Batch 7; add:
  - `idx_payments_created_status` on (status, created_at)
  - `idx_assessments_completed_at` on (completed_at) for time-slicing

---

## 10) Acceptance Criteria
- All listed screens render with live data.
- Privileged actions require confirmation + reason + audit record.
- Role gates enforced server-side and client-side.
- No secret keys ever exposed client-side.
