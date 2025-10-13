# Monitoring & Alerts — Swipe Type (MVP)

## Metrics to Monitor

### Application Health
- **Uptime** (target 99.9%+)
- **API latency**: p50, p95, p99
- **Error rate**: 4xx/5xx by endpoint
- **DB connectivity** and pool saturation

### Business Metrics
- Assessments started/completed (hourly/daily)
- Completion rate %
- Purchases (count, revenue)
- Conversion (purchases / completed)
- Refund rate

### Infrastructure
- DB CPU/IO/storage usage
- Stripe webhook **delivery success rate**
- API rate limits / throttling events

---

## Recommended Tools
- **Vercel Analytics**: latency, errors
- **Sentry**: error tracking + releases
- **Supabase**: DB + auth dashboards
- **UptimeRobot/Pingdom**: external uptime
- **Custom Admin Dashboard** (Batch 10): business KPIs
- **Stripe Dashboard**: payments, webhook logs

---

## Alert Policies (Initial Thresholds)

### Critical (page immediately)
- Uptime below 99% over 15 min (consecutive failures > 2 min)
- DB connection failures or migrations failing
- Stripe webhook failures > **10%** in rolling 60 min
- API error rate > **5%** for 5 min
- Payment checkout errors spike > **3%** of attempts over 10 min

### Warning (respond within 1 hour)
- p95 latency > **2000 ms** for 10 min
- Error rate > **1%** for 15 min
- Completion rate day-over-day drop > **20%**
- Email delivery failures > **5%** in 1h

### Info (daily digest)
- Daily users, assessments, purchases, revenue
- New signups
- Top errors by frequency

---

## Alert Channels
- **Email**: all alerts
- **Slack/Discord**: Critical & Warning
- **SMS**: Critical uptime only

---

## On-Call & Runbooks
- **Primary on-call:** <name/role/email>
- **Escalation:** <backup contact>
- **SLA:** Critical acknowledge ≤ 10 min; Warning ≤ 60 min
- **Runbooks:** (link)
  - Site down: verify Vercel status → roll back last deploy → check DB connectivity
  - Webhooks failing: check Stripe status, rotate webhook secret if compromised
  - Elevated errors: check Sentry release, feature-flag or revert change

---

## Logging Strategy
- **What to log**: endpoint, status, latency, request id, user/assessment id (non-PII), error stack
- **Levels**:
  - `debug`: dev only
  - `info`: significant business events (assessment submit, payment paid)
  - `warn`: recoverable issues (retryable failures)
  - `error`: exceptions
- **Retention**: 30 days MVP (evaluate cost)
- **Redaction**: never log secrets, tokens, or cardholder data; avoid free-text PII.

---

## Dashboards (Initial)
- **Ops**: uptime, latency, error rate, webhooks success
- **Growth**: assessments started/completed, conversion, revenue, refunds
- **Content**: type distribution, item variance (from Admin Analytics)

---

## Periodic Reviews
- Weekly: KPI review and top errors
- Monthly: Threshold tuning, incident postmortems
- Quarterly: Key rotation, dependency upgrades, DR/backup test


