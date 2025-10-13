# Admin UI — Text Wireframes (MVP)

## Screen: Dashboard
**Route:** /admin  
**Access:** Support, Admin

### Layout
[Header]
- Title: "Admin Dashboard"
- Global search (email / userId / assessmentId / stripe_session_id)
- User menu (role, sign out)

[Main]
- Row 1 (Cards):
  - Total Users | New (30d)
  - Assessments Completed | Completion Rate
  - Purchases | Revenue ($)
  - Purchase Rate
- Row 2 (Charts):
  - Assessments over time (line)
  - Revenue over time (line)
- Row 3 (Charts):
  - Type distribution (donut/bar)
  - Funnel (started → completed → premium)
- Row 4 (Widgets):
  - Recent support actions (audit log)
  - System status

### Components
- MetricCard, LineChart, DonutChart, Table, StatusPill

### Data Sources
- DB aggregates (users, assessments, payments)
- Audit log table
- Health pings (Stripe/Email/DB)

### Actions
- Click metric → deep link (users, payments)
- Search → route to User List/User Detail/Payment Detail

---

## Screen: User List
**Route:** /admin/users  
**Access:** Support, Admin

### Layout
[Filters]
- Email, Display name, Date range, Verified (yes/no), Subscription tier
[Table]
- Columns: Email | DisplayName | Created | LastSignIn | #Assessments | #Purchases | Actions(View)
[Footer]
- Pagination, CSV export (Admin)

### Components
- FiltersBar, DataTable, Pagination, ExportButton

### Data Sources
- `users` with computed counts

### Actions
- View → User Detail
- Export (Admin)

---

## Screen: User Detail
**Route:** /admin/users/[userId]  
**Access:** Support (limited), Admin

### Layout
[Header]
- Email, Display name, Verified badge, Provider, Created/Updated

[Tabs]
1) Assessments
   - Table: Date | Status | Swipe Type | Premium | Actions(View Results)
2) Purchases
   - Table: Date | Amount | Status | Session | Actions(View)
3) Actions
   - Grant Premium (assessment_id + reason) [Support/Admin]
   - Resend Password Reset [Support/Admin]
   - Delete Account (GDPR) [Admin only; reason + confirmation]
4) Audit
   - Last 50 audit records for this user

### Components
- ProfileCard, Tabs, DataTable, ConfirmModal

### Data Sources
- `users`, `assessments`, `payments`, `admin_audit_logs`

### Actions
- Grant Premium → flips flag on target assessment
- Delete Account → anonymize user, log action

---

## Screen: Assessment Analytics
**Route:** /admin/analytics  
**Access:** Support (read-only), Admin

### Layout
[Header] Date range selector

[Sections]
- Overview stats (cards)
- Drop-off by question index (bar)
- Low-variance items list (table)
- Type distribution (chart)
- Connection styles & enneagram distributions (charts)
- Export buttons (CSV)

### Components
- MetricCard, BarChart, DonutChart, DataTable, ExportButton

### Data Sources
- Aggregations across `assessments` and `responses` jsonb
- Precomputed metrics (optional materialized views)

### Actions
- Export flagged items (Admin)
- Link to content review doc (external)

---

## Screen: Payment List
**Route:** /admin/payments  
**Access:** Support, Admin

### Layout
[Filters]
- Email, AssessmentId, Status, Date range, Amount range
[Table]
- Email | Assessment | Amount | Status | Date | Stripe Session | Actions(View)

### Components
- FiltersBar, DataTable, Pagination

### Data Sources
- `payments` joined to `users` and `assessments`

### Actions
- View → Payment Detail

---

## Screen: Payment Detail
**Route:** /admin/payments/[paymentId]  
**Access:** Support (limited refund), Admin

### Layout
[Summary Card]
- Amount, Currency, Status, Created, Receipt URL

[Details]
- User: email, id
- Assessment: id, swipe type, completed date
- Stripe: session id, payment intent id, customer id

[Actions]
- Refund (reason dropdown + note) [Admin; Support if policy allows]
- Resend Receipt
- Open in Stripe

### Components
- SummaryCard, KeyValueList, ConfirmModal

### Data Sources
- `payments`, `assessments`, `users` + Stripe links

### Actions
- Refund → Stripe API + DB update + revoke premium + audit log

---

## Screen: Support Lookup
**Route:** /admin/support  
**Access:** Support, Admin

### Layout
[Search]
- Input: email or assessmentId
- Result tiles: User, Last assessment, Last purchase

[Common Actions]
- Grant premium (select assessment)
- Resend verification / receipt / reset password
- View as user (read-only result preview)

### Components
- SearchBar, ResultTile, ActionButtons

### Data Sources
- `users`, `assessments`, `payments`

### Actions
- Each action requires reason + writes audit log

---

## Screen: System Health
**Route:** /admin/health  
**Access:** Support (read-only), Admin

### Layout
[Service Status]
- DB | Stripe | Email | Queue (if any) — Green/Amber/Red

[Recent Errors]
- Table: ts | type | message | endpoint | userId | link to logs

[Performance]
- Avg latency (1h/24h), slowest endpoints

### Components
- StatusGrid, DataTable, MiniCharts

### Data Sources
- Health pings, error logs (SaaS or DB), perf metrics

### Actions
- Link-outs to Stripe status, Supabase status, Sentry/Logs


