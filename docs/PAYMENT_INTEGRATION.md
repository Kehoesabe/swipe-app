# Payment Integration — Stripe (MVP)

## Product & Price
- **Premium Report** — one-time purchase **$12.00**
  - Configure in Stripe:
    - Product: `premium_report`
    - Price: `unit_amount=1200`, `currency=usd`, `recurring=false`
- Use ENV for price:
  - `STRIPE_PRICE_ID` (authoritative)
  - Display price via env: `PUBLIC_PREMIUM_PRICE_USD=12`

## Checkout Approach
- Stripe Checkout (reduced PCI scope)
- Include metadata: `assessment_id`, `user_id`
- Success: `https://app.swipetype.com/report/premium/{ASSESSMENT_ID}?session_id={CHECKOUT_SESSION_ID}`
- Cancel:  `https://app.swipetype.com/assessment/{ASSESSMENT_ID}?canceled=true`

## Server Flow

### 1) Create Checkout Session
`POST /api/payment/checkout`
- Validate ownership and not already unlocked
- Create `payments` row `status='init'`, `amount_cents` from price object
- Checkout Session:
  - `mode: 'payment'`
  - `line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }]`
  - `client_reference_id: assessment_id`
  - `customer_email: user.email || undefined`
  - `metadata: { assessment_id, user_id }`
- Return `session.url`
- Use `Idempotency-Key`

### 2) Webhook Fulfillment
`POST /api/payment/webhook`
- Verify signature (`STRIPE_WEBHOOK_SECRET`)
- Handle:
  - `checkout.session.completed` → mark `payments.status='paid'`, set `assessments.premium_unlocked=true`
  - `payment_intent.succeeded` → idem (defensive)
  - `charge.refunded` → `payments.status='refunded'`, `premium_unlocked=false`
  - If Stripe sends intermediate states:
    - `requires_payment_method`, `processing`, `requires_action` → persist to `payments.status`
- Idempotent on `stripe_session_id`

### 3) Access Control
- `/api/report/premium/:id` → requires owner + `premium_unlocked=true`

## Error Handling
- Checkout creation failure → 502 generic; log details server-side
- Webhook signature error → 400
- Duplicates → return 200 (idempotent)

## Refunds
- Manual via Stripe dashboard or admin tool
- Webhook updates DB as above

## Receipts
- Use Stripe-hosted `receipt_url`
- Email purchase confirmation (transactional)

## Testing
- Test mode keys
- Stripe CLI: `stripe listen --forward-to localhost:3000/api/payment/webhook`
- Cards:
  - Success: `4242 4242 4242 4242`
  - 3DS: `4000 0027 6000 3184`
  - Insufficient: `4000 0000 0000 9995`

## Analytics
- Track: results_view → paywall_click → checkout_open → success/cancel
- Correlate by `assessment_id` + `session_id`


