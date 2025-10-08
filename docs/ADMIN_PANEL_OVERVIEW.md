# Admin Panel — Overview (MVP)

## 1) Purpose & Users
The Admin Panel is an internal, web-based dashboard for:
- **Support**: Resolve user issues (results access, refunds, account help).
- **Product/Analytics**: Monitor assessment performance and content quality.
- **Founders/Admins**: Revenue, health, and operational oversight.

### Roles
- **Admin**: Full access, can perform refunds, delete data, manage roles.
- **Support**: Read-only on sensitive data + limited write actions (grant premium, resend emails).
- (Optional) **Analyst**: Read-only metrics/analytics.

> All privileged actions must be audit-logged.

---

## 2) Core Feature Areas
1. **Dashboard** — Key metrics (users, assessments, revenue, conversion).
2. **User Management** — Search → detail → actions (grant premium, reset password, delete).
3. **Assessment Analytics** — Distribution, drop-off, low-variance item flags.
4. **Payment Management** — Purchases, receipts, refunds, statuses.
5. **Support Tools** — Quick lookup, impersonated view, resend emails.
6. **System Health** — Error logs, service status, performance.

---

## 3) Technical Stack
- **Frontend**: Next.js (admin routes at `/admin/*`) sharing the app's design system.
- **Auth**: Supabase Auth with **role claims**. Admin UI guarded by:
  - Server-side role check (service role) + client guard.
  - Optional **IP allowlist** for `/admin/*`.
  - **2FA** for admin accounts recommended (Supabase OTP or TOTP).
- **Data**: Supabase Postgres. Admin API uses **service role** (bypass RLS) behind secure server routes.
- **UI**: Same tokens/components as app for consistency; utilitarian styling prioritized.

---

## 4) Security & Access Control
- **RLS** stays enabled for public app; Admin API uses service role in server-only environment.
- **Least privilege**: Support role cannot:
  - Delete accounts
  - Issue full refunds above threshold without Admin approval
  - Edit raw assessment responses
- **Audit Logging**: Every privileged action writes:
  - who (admin_user_id), when (ts), what (action), target (user_id/assessment_id/payment_id), why (reason), before/after (diff where applicable).
- **SSO (optional)**: Restrict admin access via Google Workspace domain.
- **Transport**: HTTPS only, HSTS, strict CSP on admin routes.

---

## 5) Navigation Structure
- `/admin`  → Dashboard
- `/admin/users` → User list
- `/admin/users/[userId]` → User detail (assessments, purchases, actions)
- `/admin/analytics` → Assessment analytics
- `/admin/payments` → Payment list
- `/admin/payments/[paymentId]` → Payment detail
- `/admin/support` → Quick lookup & common actions
- `/admin/health` → System health & logs

---

## 6) Permissions Matrix (MVP)

| Capability                                | Support | Admin |
|-------------------------------------------|:-------:|:-----:|
| View dashboard & analytics                 |   ✓     |  ✓    |
| Search/view users                          |   ✓     |  ✓    |
| View assessment results                     |   ✓     |  ✓    |
| Grant premium (manual unlock)               |   ✓     |  ✓    |
| Resend transactional emails                 |   ✓     |  ✓    |
| Process refund (<= $12, single transaction) |   ✱     |  ✓    |
| Process refund (> $12 or manual override)   |         |  ✓    |
| Delete account / GDPR erase                 |         |  ✓    |
| Edit roles                                  |         |  ✓    |
| Access raw error logs & env                 |         |  ✓    |

✱ = Allowed with reason + audit log; may require Admin approval toggle if you enable approvals.

---

## 7) Data & Privacy Considerations
- Display minimum necessary data (email only; never show card details).
- Provide single-click "Export user data" & "Delete user data" compliant with GDPR/CCPA (Admin only).
- Respect data retention policy; redaction of PII on deletion.

---

## 8) Observability & Health
- Integrate basic stats: DB connection, Stripe status, Email provider status, error count last 1h/24h.
- Link to external dashboards (Stripe, Supabase, Sentry/Logs).

---

## 9) Deployment & Access
- Gate admin routes with server-side role check (`getServerSideProps` or middleware).
- Separate environment variables for **service role** keys. Never expose to client.
- Optional basic IP allowlist via edge middleware.

---

## 10) Initial Deliverables (MVP scope)
- Read-focused panels with a few high-value actions:
  - Grant premium, refund single purchase, resend emails, delete account.
- Charts & tables backed by efficient queries and indexes already defined in Batch 7.
