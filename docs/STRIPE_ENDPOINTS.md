# STRIPE ENDPOINTS — Swipe Type

## Overview
- Use **Stripe Checkout** for PCI-safe payments (no card data on our servers).
- Price: **$12.00 USD** for `premium_report`.
- Mobile: open Checkout in webview / in-app browser; web: redirect.

---

## Environment
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PRICE_PREMIUM_REPORT` (e.g., price_12345)
- `APP_BASE_URL` (e.g., https://app.swipetype.com)

---

## 1) Create Checkout Session
**POST** `/api/payments/checkout`

**Request (JSON)**
```json
{
  "userId": "uuid-or-null",
  "sessionId": "uuid",        // assessment_sessions.id
  "email": "optional@example.com"
}
```

**Behavior**
- Idempotency key: `checkout:{sessionId}`
- Creates/reuses Stripe Customer by email/userId.
- Line item: `PRICE_PREMIUM_REPORT` quantity 1.
- Mode: `payment`
- Success URL: `${APP_BASE_URL}/results?sessionId={sessionId}&paid=1`
- Cancel URL: `${APP_BASE_URL}/results?sessionId={sessionId}&canceled=1`
- Metadata: `{ userId, sessionId, productId: 'premium_report' }`

**Response (200)**
```json
{ "checkoutSessionId": "cs_test_...", "checkoutUrl": "https://checkout.stripe.com/c/pay_..." }
```

**Errors**
- `400` invalid session
- `409` already purchased (optional pre-check)
- `500` stripe error (message hash only)

---

## 2) Stripe Webhook
**POST** `/api/payments/webhook`

Verify `Stripe-Signature` with `STRIPE_WEBHOOK_SECRET`.

**Handle events:**
- `checkout.session.completed`
  - Fetch PaymentIntent
  - Upsert `payments` row:
    - `status`: 'succeeded' or PI status
    - `amount_cents`, `currency`
    - stripe ids (intent, session, customer)
    - `session_id`, `user_id` (from metadata)
  - Add `audit_logs` row: `stripe.webhook`

- `payment_intent.succeeded` (redundant safety)

- `charge.refunded` / `charge.refund.updated`
  - Update `payments.status` to 'refunded'/'partial_refund'
  - Set `refund_amount_cents`

**Response**
- `200` with empty body on success.
- `400/401` on signature verification failure.

**Idempotency**
- Upserts keyed by `stripe_payment_intent_id` / `stripe_checkout_session_id`.

---

## 3) Customer Portal (optional)
**POST** `/api/payments/portal`

Returns a billing portal URL if we later add subscriptions.

---

## 4) Refund API (admin only)
**POST** `/api/payments/refund`

**Request**
```json
{ "paymentId": "uuid", "amountCents": 1200 } // amount optional; full refund if omitted
```

**Behavior**
- Verify admin auth.
- Call `stripe.refunds.create({ payment_intent, amount })`.
- Update `payments.refund_amount_cents` and `status`.

**Response**
```json
{ "status": "refunded", "refundId": "re_..." }
```

---

## Security & Compliance
- **PCI:** Use Checkout (hosted); never send PAN/CVV through our servers.
- **AuthZ:** Only owner of `sessionId` can initiate Checkout.
- **Idempotency:** Key every create with `checkout:{sessionId}`.
- **Webhooks:** Verify signatures; log to `audit_logs`.
- **PII:** Store only email and Stripe IDs; no card details.

---

## Pseudo-code (TypeScript / Node)
```typescript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function createCheckoutSession(req, res) {
  const { userId, sessionId, email } = req.body;
  // 1) Validate sessionId exists and is completed or eligible
  // 2) Optionally ensure not already purchased
  const session = await db.one('SELECT * FROM assessment_sessions WHERE id=$1', [sessionId]);

  const customer = email
    ? (await findOrCreateCustomerByEmail(email))
    : undefined;

  const cs = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer: customer?.id,
    line_items: [{ price: process.env.PRICE_PREMIUM_REPORT!, quantity: 1 }],
    success_url: `${process.env.APP_BASE_URL}/results?sessionId=${sessionId}&paid=1`,
    cancel_url: `${process.env.APP_BASE_URL}/results?sessionId=${sessionId}&canceled=1`,
    metadata: { userId: userId ?? '', sessionId, productId: 'premium_report' }
  }, { idempotencyKey: `checkout:${sessionId}` });

  res.json({ checkoutSessionId: cs.id, checkoutUrl: cs.url });
}

export async function stripeWebhook(req, res) {
  const sig = req.headers['stripe-signature']!;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (e) {
    return res.status(400).send('invalid signature');
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const cs = event.data.object as Stripe.Checkout.Session;
      const pi = await stripe.paymentIntents.retrieve(cs.payment_intent as string);
      await upsertPaymentFromStripe(cs, pi);
      await insertAudit('webhook', null, 'stripe.webhook', 'payment', null, { type: event.type, csId: cs.id });
      break;
    }
    case 'charge.refunded': { /* update status + refund_amount_cents */ break; }
  }
  res.sendStatus(200);
}
```

---

## Unlock Logic
Unlock premium report if any `payments.status IN ('succeeded','refunded','partial_refund')` for `(user_id, session_id, product_id='premium_report')`.




