# DATABASE SCHEMA — Swipe Type

## Overview
Compact Postgres schema for MVP:
- `users`: identities (email/SSO/anonymous).
- `assessment_sessions`: each 57-item run + results.
- `payments`: Stripe transactions unlocking premium reports.
- `audit_logs`: compliance trail incl. webhook events.

All tables use UUID PKs, timestamps, and soft-delete support for users.

---

## Entities

### users
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | gen_random_uuid() |
| email | text | nullable for anonymous |
| email_verified_at | timestamptz | |
| password_hash | text | nullable (SSO) |
| auth_provider | text | 'email' \| 'apple' \| 'google' \| 'anonymous' |
| auth_provider_id | text | provider subject id |
| display_name | text | |
| marketing_opt_in | boolean | default false |
| privacy_consent_at | timestamptz | |
| deleted_at | timestamptz | soft delete |
| created_at/updated_at | timestamptz | trigger updates |

**Indexes**
- `users_email_unique_ci` (unique lower(email), where email not null and active)
- `users_provider_idx` (provider, provider_id)
- `users_active_idx` (deleted_at is null)

---

### assessment_sessions
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| user_id | uuid FK → users.id | SET NULL |
| session_seed | int | deterministic order |
| device_platform | text | 'ios','android','web' |
| input_method_last | text | 'swipe','keyboard','buttons' |
| order/scoring/mapping_version | text | 'v1' defaults |
| status | text | 'in_progress','completed','abandoned' |
| answers | jsonb | array of {questionId, direction, msSinceRender} |
| means | jsonb | 15 normalized means (6+9) |
| top_style | text | e.g. 'qualityPresence' |
| top_enneagram | text | e.g. 'type4' |
| primary_swipe_type | text | 'Deep Connector' etc. |
| blend_swipe_type | text | nullable |
| margins | jsonb | {"style":0.23,"enneagram":0.18} |
| started_at/completed_at | timestamptz | |
| created_at/updated_at | timestamptz | |

**Indexes**
- `sessions_user_idx`, `sessions_status_idx`, `sessions_started_idx`, `sessions_completed_idx`
- `sessions_answers_gin` (jsonb_path_ops)

---

### payments
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| user_id | uuid FK → users.id | SET NULL |
| session_id | uuid FK → assessment_sessions.id | SET NULL |
| provider | text | 'stripe' |
| product_id | text | 'premium_report' |
| amount_cents | int | >= 0 |
| currency | char(3) | 'USD' |
| status | text | 'succeeded','processing','canceled','refunded','partial_refund','failed','requires_payment_method' |
| refund_amount_cents | int | >= 0 |
| stripe_payment_intent_id | text | unique |
| stripe_checkout_session_id | text | unique |
| stripe_customer_id | text | |
| stripe_receipt_url | text | |
| metadata | jsonb | |
| created_at/updated_at | timestamptz | |

**Indexes**
- `payments_user_idx`, `payments_session_idx`, `payments_status_idx`

---

### audit_logs
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| actor_type | text | 'system','user','admin','webhook' |
| actor_user_id | uuid FK → users.id | SET NULL |
| event | text | code e.g. 'stripe.webhook', 'assessment.completed' |
| entity_type | text | 'session','payment' |
| entity_id | uuid | |
| ip_address | inet | |
| user_agent | text | |
| details | jsonb | payload snapshot |
| created_at | timestamptz | |

**Indexes**
- `audit_event_idx`, `audit_entity_idx`, `audit_user_idx`

---

## Relationships
- `users 1—* assessment_sessions`
- `users 1—* payments`
- `assessment_sessions 1—* payments` (optional)
- `audit_logs` references any entity conceptually via `(entity_type, entity_id)`

---

## Privacy & Retention
- PII minimized (email only).
- Use `deleted_at` for soft deletion; schedule hard-delete after retention window.
- Stripe tokens/IDs stored; never store card PAN/CVV.

---

## Example Queries

**Has user unlocked premium for a session?**
```sql
SELECT EXISTS (
  SELECT 1 FROM payments
  WHERE user_id = $1 AND session_id = $2 AND status IN ('succeeded','refunded','partial_refund')
) AS unlocked;
```

**Latest completed session for user**
```sql
SELECT *
FROM assessment_sessions
WHERE user_id = $1 AND status = 'completed'
ORDER BY completed_at DESC
LIMIT 1;
```

**Insert audit log**
```sql
INSERT INTO audit_logs (actor_type, actor_user_id, event, entity_type, entity_id, details)
VALUES ('webhook', NULL, 'stripe.webhook', 'payment', $1, $2::jsonb);
```

---

## Migration Plan
1. `001_create_users_table.sql`
2. `002_create_sessions_table.sql`
3. `003_create_payments_table.sql`
4. `004_create_audit_logs_table.sql`

Rollback order is reverse (4 → 1). No data-destructive changes in MVP.
