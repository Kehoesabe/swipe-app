# Auth & Authorization Strategy (MVP)

## Stack
- Supabase Auth (email/password + Google/Apple). JWT-based across web and mobile.

## User States
1) **Anonymous** — can take test, see free result
2) **Registered** — history saved, multi-device
3) **Premium** — purchased full report for a specific assessment

## Flows

### Sign-up
- Email + password (min 8, 1 letter, 1 number)
- Email verification → `email_verified_at` set on confirm
- Mobile deep link: `swipetype://auth/verify`

### Login
- Email/password or OAuth
- Tokens:
  - **Web:** HTTP-only secure cookies (SameSite=Lax/Strict)
  - **Mobile (Expo):** SecureStore

### Anonymous → Registered Linking
- Anonymous completes assessment → starts checkout
- On payment success:
  - Create/link user with `customer_email` from Stripe if needed
  - Link `assessments.user_id` and `payments.user_id`
  - Send set-password email if new

### Session
- Access token ~1h, refresh with rotation
- Revoke on logout or suspicious activity

## Authorization & RLS
- Enable RLS on `users`, `assessments`, `payments`, `email_captures`
- Owner-only policies (see DATABASE_SCHEMA.md)
- Anonymous creation/updates should go through service-role endpoints that bypass RLS

## Security
- CSRF: SameSite cookies + double-submit token (web)
- CORS: Restrict to known origins
- Rate limits on auth/submit/payment
- Secrets: Stripe keys & webhook secrets server-only
- PII Minimization: Store only email & optional display_name

## Compliance
- GDPR/CCPA basics: export/delete
- Email: separate transactional vs marketing (double opt-in for marketing)
