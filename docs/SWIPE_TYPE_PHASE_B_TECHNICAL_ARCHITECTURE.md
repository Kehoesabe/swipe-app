# SWIPE TYPE - PHASE B: COMPLETE TECHNICAL ARCHITECTURE

**Document Version:** 1.0  
**Date:** January 10, 2025  
**Status:** Production Specification  
**Author:** Claude (Technical Architect)

## TABLE OF CONTENTS
1. [System Architecture Overview](#1-system-architecture-overview)
2. [Payment Flow Architecture](#2-payment-flow-architecture)
3. [Security & Compliance Framework](#3-security--compliance-framework)
4. [Database Schema Deep Dive](#4-database-schema-deep-dive)
5. [API Specifications](#5-api-specifications)
6. [Edge Cases & Error Handling](#6-edge-cases--error-handling)
7. [Monitoring & Analytics](#7-monitoring--analytics)
8. [Admin Dashboard Requirements](#8-admin-dashboard-requirements)
9. [Post-Launch Operations](#9-post-launch-operations)
10. [Testing Strategy](#10-testing-strategy)
11. [Deployment Checklist](#11-deployment-checklist)
12. [Future Enhancements](#12-future-enhancements)

## 1. SYSTEM ARCHITECTURE OVERVIEW

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (React Native)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Assessment  │  │   Results    │  │   Payment    │      │
│  │    Screen    │→ │    Screen    │→ │   Screen     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────┬────────────────┬────────────────┬──────────────┘
             │                │                │
             ↓                ↓                ↓
┌────────────────────────────────────────────────────────────┐
│                   API LAYER (Node.js/Express)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Assessment   │  │   Profile    │  │   Payment    │    │
│  │     API      │  │     API      │  │     API      │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└────────────┬────────────────┬────────────────┬────────────┘
             │                │                │
             ↓                ↓                ↓
┌────────────────────────────────────────────────────────────┐
│                    DATA LAYER (Supabase)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Assessments  │  │  Purchases   │  │   Premium    │    │
│  │   Table      │  │    Table     │  │   Access     │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└────────────────────────────────────────────────────────────┘
             │
             ↓
┌────────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                              │
│                 ┌──────────────┐                            │
│                 │    STRIPE    │                            │
│                 │   Payment    │                            │
│                 │  Processing  │                            │
│                 └──────────────┘                            │
└────────────────────────────────────────────────────────────┘
```

### Data Flow
**Successful Payment:**
1. User clicks "Unlock Premium" → createCheckoutSession()
2. API creates Stripe session → Returns checkout URL
3. User completes payment on Stripe → Stripe processes
4. Stripe sends webhook → /api/payment/webhook
5. Webhook validates → Updates purchase status → Grants premium_access
6. User returns to app → Premium content unlocked

## 2. PAYMENT FLOW ARCHITECTURE

### State Machine
```
┌──────────────┐
│   Initial    │
│  (No Access) │
└──────┬───────┘
       │ User clicks "Unlock"
       ↓
┌──────────────┐
│   Creating   │
│   Session    │
└──────┬───────┘
       │ Session created
       ↓
┌──────────────┐
│  Redirecting │
│  to Stripe   │
└──────┬───────┘
       │ Payment completed
       ↓
┌──────────────┐
│  Processing  │
│   Webhook    │
└──────┬───────┘
       │ Webhook verified
       ↓
┌──────────────┐
│   Premium    │
│   Unlocked   │
└──────────────┘
```

### Purchase States
| State | Description | User Action | System Action |
|-------|-------------|-------------|----------------|
| pending | Session created, awaiting payment | Complete Stripe checkout | Monitor webhook |
| processing | Payment received, validating | Wait | Verify payment, grant access |
| succeeded | Payment confirmed, access granted | View premium content | None |
| failed | Payment declined/error | Retry payment | Log error, notify support |
| refunded | Purchase refunded | Content locked again | Revoke access |
| disputed | Chargeback filed | Contact support | Hold access, investigate |

## 3. SECURITY & COMPLIANCE FRAMEWORK

### A. Payment Security

#### PCI Compliance
- ✅ Never store card data - Stripe handles all card information
- ✅ Use Stripe Elements - Pre-built, PCI-compliant UI components
- ✅ Tokenization - Card data converted to tokens before transmission
- ✅ TLS 1.2+ - All API calls encrypted in transit

#### Webhook Security
```typescript
// Verify webhook signature
import Stripe from 'stripe';

const verifyWebhook = (payload: string, signature: string): boolean => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    return true;
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return false;
  }
};
```

**Critical:**
- Reject unsigned webhooks immediately
- Log all verification failures
- Rate limit webhook endpoint (100/hour max)
- Monitor for replay attacks

#### API Authentication
```typescript
// Require auth for all payment endpoints
const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Verify user owns the assessment
const requireAssessmentOwnership = async (req, res, next) => {
  const { assessmentId } = req.body;
  const assessment = await getAssessment(assessmentId);
  
  if (assessment.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  next();
};
```

### B. GDPR Compliance

#### Data Rights
| Right | Implementation | API Endpoint |
|-------|---------------|--------------|
| Right to Access | User can download all data | GET /api/user/export |
| Right to Deletion | Delete all user data + purchases | DELETE /api/user/account |
| Right to Portability | Export in JSON format | GET /api/user/export?format=json |
| Right to Rectification | User can update profile | PATCH /api/user/profile |

#### Data Retention Policy
```sql
-- Auto-delete abandoned assessments after 90 days
CREATE OR REPLACE FUNCTION cleanup_old_assessments()
RETURNS void AS $$
BEGIN
  DELETE FROM assessments
  WHERE completed_at IS NULL
    AND created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule daily cleanup
SELECT cron.schedule(
  'cleanup-assessments',
  '0 2 * * *', -- 2 AM daily
  $$ SELECT cleanup_old_assessments(); $$
);
```

#### Privacy Policy Requirements
Must disclose:
- What data we collect (assessment responses, payment info)
- How we use it (generate results, process payments)
- Who we share with (Stripe for payments only)
- How long we keep it (indefinitely unless deleted)
- User rights (access, delete, export)
- Contact for data requests

## 4. DATABASE SCHEMA DEEP DIVE

### Complete Schema with Relationships
```sql
-- Users table (existing, assumed)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Assessments table (existing, assumed)
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type_number INTEGER CHECK (type_number BETWEEN 1 AND 8),
  directness_score DECIMAL(5,2),
  tangibility_score DECIMAL(5,2),
  responses JSONB NOT NULL, -- Array of question responses
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Purchases table (NEW)
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  
  -- Stripe identifiers
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  stripe_checkout_session_id TEXT UNIQUE,
  
  -- Payment details
  amount INTEGER NOT NULL, -- in cents (1200 = $12.00)
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN (
    'pending', 'processing', 'succeeded', 'failed', 'refunded', 'disputed'
  )),
  
  -- Receipt & metadata
  receipt_url TEXT,
  receipt_number TEXT, -- Human-readable receipt number
  customer_email TEXT,
  metadata JSONB, -- Additional Stripe metadata
  
  -- Timestamps
  paid_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Indexes
  CONSTRAINT unique_assessment_purchase UNIQUE(assessment_id)
);

CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_stripe_payment_intent ON purchases(stripe_payment_intent_id);
CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_purchases_created_at ON purchases(created_at DESC);

-- Premium access table (NEW)
CREATE TABLE premium_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL,
  
  -- Access details
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- NULL = lifetime access
  revoked_at TIMESTAMPTZ, -- If access revoked (e.g., refund)
  
  -- Metadata
  granted_by TEXT DEFAULT 'payment', -- or 'admin', 'promo', etc.
  notes TEXT, -- For admin reference
  
  -- Constraints
  CONSTRAINT unique_user_assessment_access UNIQUE(user_id, assessment_id)
);

CREATE INDEX idx_premium_access_user_assessment ON premium_access(user_id, assessment_id);
CREATE INDEX idx_premium_access_status ON premium_access(revoked_at) 
  WHERE revoked_at IS NULL; -- Active access only

-- Audit log (NEW - for compliance)
CREATE TABLE purchase_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_id UUID NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'created', 'succeeded', 'refunded', etc.
  event_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_purchase_id ON purchase_audit_log(purchase_id);
CREATE INDEX idx_audit_created_at ON purchase_audit_log(created_at DESC);
```

### Row-Level Security (RLS) Policies
```sql
-- Enable RLS
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_audit_log ENABLE ROW LEVEL SECURITY;

-- Users can view their own purchases
CREATE POLICY "Users view own purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view their own premium access
CREATE POLICY "Users view own premium access"
  ON premium_access FOR SELECT
  USING (auth.uid() = user_id);

-- Users cannot view audit logs (admin only)
CREATE POLICY "Audit logs admin only"
  ON purchase_audit_log FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Service role can do everything (for webhooks)
-- Configure this in Supabase dashboard
```

## 5. API SPECIFICATIONS

### Endpoint: Create Checkout Session
**POST /api/payment/create-checkout**

**Request:**
```typescript
{
  assessmentId: string; // UUID
  userId: string; // UUID
  typeNumber: number; // 1-8
  priceId: string; // Stripe price ID
  successUrl: string; // Return URL after success
  cancelUrl: string; // Return URL after cancellation
}
```

**Response (200 OK):**
```typescript
{
  sessionId: string; // Stripe session ID
  url: string; // Stripe checkout URL
  purchaseId: string; // Our internal purchase ID
}
```

**Response (400 Bad Request):**
```typescript
{
  error: string;
  code: 'INVALID_ASSESSMENT' | 'ALREADY_PURCHASED' | 'VALIDATION_ERROR';
}
```

**Implementation:**
```typescript
async function createCheckout(req, res) {
  const { assessmentId, userId, typeNumber, priceId, successUrl, cancelUrl } = req.body;
  
  // 1. Validate assessment exists and belongs to user
  const assessment = await getAssessment(assessmentId);
  if (!assessment || assessment.user_id !== userId) {
    return res.status(400).json({ 
      error: 'Invalid assessment',
      code: 'INVALID_ASSESSMENT'
    });
  }
  
  // 2. Check for existing purchase
  const existingPurchase = await checkExistingPurchase(assessmentId);
  if (existingPurchase && existingPurchase.status === 'succeeded') {
    return res.status(400).json({
      error: 'Assessment already purchased',
      code: 'ALREADY_PURCHASED'
    });
  }
  
  // 3. Create purchase record (status: 'pending')
  const purchase = await createPurchase({
    user_id: userId,
    assessment_id: assessmentId,
    amount: 1200, // $12.00
    currency: 'usd',
    status: 'pending',
  });
  
  // 4. Create Stripe checkout session
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price: priceId,
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    client_reference_id: purchase.id, // Link back to our purchase
    metadata: {
      purchase_id: purchase.id,
      assessment_id: assessmentId,
      type_number: typeNumber,
    },
  });
  
  // 5. Update purchase with Stripe session ID
  await updatePurchase(purchase.id, {
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id: session.payment_intent,
  });
  
  // 6. Log audit event
  await logAuditEvent(purchase.id, 'checkout_created', { session_id: session.id });
  
  return res.status(200).json({
    sessionId: session.id,
    url: session.url,
    purchaseId: purchase.id,
  });
}
```

### Endpoint: Webhook Handler
**POST /api/payment/webhook**

**Critical:** This endpoint MUST verify webhook signatures

**Implementation:**
```typescript
async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  const payload = req.body;
  
  // 1. Verify signature
  let event;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // 2. Handle event
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;
      
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
      
    case 'charge.refunded':
      await handleRefund(event.data.object);
      break;
      
    case 'charge.dispute.created':
      await handleDispute(event.data.object);
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  
  // 3. Return 200 OK (acknowledges receipt)
  return res.status(200).json({ received: true });
}

async function handlePaymentSucceeded(paymentIntent) {
  const { id: paymentIntentId, metadata } = paymentIntent;
  const { purchase_id, assessment_id } = metadata;
  
  // 1. Update purchase status
  await updatePurchase(purchase_id, {
    status: 'succeeded',
    paid_at: new Date(),
    stripe_payment_intent_id: paymentIntentId,
  });
  
  // 2. Grant premium access
  await grantPremiumAccess({
    user_id: paymentIntent.metadata.user_id,
    assessment_id: assessment_id,
    purchase_id: purchase_id,
    granted_by: 'payment',
  });
  
  // 3. Log audit event
  await logAuditEvent(purchase_id, 'payment_succeeded', { payment_intent_id: paymentIntentId });
  
  // 4. Send confirmation email (optional)
  // await sendConfirmationEmail(user_id, assessment_id);
}

async function handlePaymentFailed(paymentIntent) {
  const { metadata } = paymentIntent;
  
  await updatePurchase(metadata.purchase_id, {
    status: 'failed',
  });
  
  await logAuditEvent(metadata.purchase_id, 'payment_failed', {
    reason: paymentIntent.last_payment_error?.message,
  });
}

async function handleRefund(charge) {
  const paymentIntentId = charge.payment_intent;
  
  // 1. Find purchase by payment intent ID
  const purchase = await getPurchaseByPaymentIntent(paymentIntentId);
  
  if (!purchase) {
    console.error(`Purchase not found for payment intent: ${paymentIntentId}`);
    return;
  }
  
  // 2. Update purchase status
  await updatePurchase(purchase.id, {
    status: 'refunded',
    refunded_at: new Date(),
  });
  
  // 3. Revoke premium access
  await revokePremiumAccess(purchase.assessment_id, purchase.user_id);
  
  // 4. Log audit event
  await logAuditEvent(purchase.id, 'refunded', { charge_id: charge.id });
}
```

### Endpoint: Check Premium Access
**GET /api/payment/check-access?userId={uuid}&assessmentId={uuid}**

**Response (200 OK):**
```typescript
{
  hasAccess: boolean;
  grantedAt?: string; // ISO timestamp
  expiresAt?: string | null; // ISO timestamp or null
}
```

**Implementation:**
```typescript
async function checkPremiumAccess(req, res) {
  const { userId, assessmentId } = req.query;
  
  // Query premium_access table
  const access = await db.query(`
    SELECT 
      granted_at,
      expires_at,
      revoked_at
    FROM premium_access
    WHERE user_id = $1
      AND assessment_id = $2
      AND revoked_at IS NULL
      AND (expires_at IS NULL OR expires_at > NOW())
  `, [userId, assessmentId]);
  
  if (access.rows.length === 0) {
    return res.status(200).json({ hasAccess: false });
  }
  
  return res.status(200).json({
    hasAccess: true,
    grantedAt: access.rows[0].granted_at,
    expiresAt: access.rows[0].expires_at,
  });
}
```

## 6. EDGE CASES & ERROR HANDLING

### Edge Case Matrix
| Scenario | System Behavior | User Experience |
|----------|----------------|-----------------|
| Duplicate purchase attempt | Check existing purchase, return error | "You've already unlocked this profile" |
| Payment during webhook delay | Show "Processing..." state | Wait for webhook confirmation |
| User closes Stripe before paying | Purchase stays 'pending' for 24h, then expires | Can retry anytime |
| Webhook arrives before user returns | Premium already unlocked when they return | Seamless experience |
| Webhook never arrives | Manual verification after 5 min | "Verifying purchase..." then unlock |
| Network failure during checkout | Session creation fails, no charge | "Network error, please retry" |
| Card declined | Stripe handles, user stays on payment page | Stripe's error message shown |
| Refund requested | Admin processes in Stripe, webhook revokes access | Access removed, explained via email |
| Chargeback filed | Stripe notifies, access held pending investigation | Support contact required |
| Assessment deleted after purchase | CASCADE DELETE removes premium_access | Graceful: "Assessment no longer available" |
| User deletes account | CASCADE DELETE removes all data | GDPR compliant |

### Webhook Failure Recovery
**Problem:** Webhook doesn't arrive (network issue, Stripe downtime)  
**Solution:** Polling backup

```typescript
// After user returns from Stripe, if status still 'pending'
async function verifyPendingPurchase(purchaseId: string) {
  const purchase = await getPurchase(purchaseId);
  
  if (purchase.status !== 'pending') {
    return purchase.status;
  }
  
  // Poll Stripe directly
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const paymentIntent = await stripe.paymentIntents.retrieve(
    purchase.stripe_payment_intent_id
  );
  
  if (paymentIntent.status === 'succeeded') {
    // Manually trigger success flow
    await handlePaymentSucceeded(paymentIntent);
    return 'succeeded';
  }
  
  return paymentIntent.status;
}
```

## 7. MONITORING & ANALYTICS

### Key Metrics to Track

#### Payment Funnel
```typescript
// Track conversion at each step
{
  step_1_viewed_results: number,          // Saw "Unlock" button
  step_2_clicked_unlock: number,          // Clicked button
  step_3_reached_stripe: number,          // Stripe checkout loaded
  step_4_completed_payment: number,       // Payment succeeded
  
  // Conversion rates
  unlock_click_rate: step_2 / step_1,
  stripe_reach_rate: step_3 / step_2,
  payment_complete_rate: step_4 / step_3,
  overall_conversion: step_4 / step_1,
}
```

**Target:** 5-10% overall conversion (industry standard for $12 product)

#### Payment Health
```sql
-- Daily payment metrics
SELECT 
  DATE(created_at) as date,
  COUNT(*) FILTER (WHERE status = 'succeeded') as successful_payments,
  COUNT(*) FILTER (WHERE status = 'failed') as failed_payments,
  COUNT(*) FILTER (WHERE status = 'refunded') as refunds,
  SUM(amount) FILTER (WHERE status = 'succeeded') as revenue_cents,
  AVG(EXTRACT(EPOCH FROM (paid_at - created_at))) FILTER (WHERE status = 'succeeded') as avg_payment_duration_seconds
FROM purchases
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Monitoring Alerts
Set up alerts for:
- Payment failure rate >10% (investigate Stripe issues)
- Webhook delivery delay >5 min (check webhook endpoint health)
- Refund rate >5% (investigate product quality)
- Webhook verification failures (potential security issue)
- Duplicate purchase attempts >1% of traffic (UX issue)

### Analytics Events
Track in your analytics tool (Mixpanel, Amplitude, etc.):

```typescript
// User viewed results
analytics.track('Results Viewed', {
  type_number: number,
  assessment_id: string,
  has_premium: boolean,
});

// User clicked unlock
analytics.track('Unlock Clicked', {
  type_number: number,
  source: 'results_page' | 'profile_section',
});

// Checkout session created
analytics.track('Checkout Started', {
  type_number: number,
  amount: 1200,
});

// Payment succeeded
analytics.track('Purchase Completed', {
  type_number: number,
  amount: 1200,
  duration_seconds: number, // time from click to success
});

// User viewed premium content
analytics.track('Premium Content Viewed', {
  type_number: number,
  section: string, // 'strengths', 'growth', etc.
});
```

## 8. ADMIN DASHBOARD REQUIREMENTS

### Admin Dashboard Features

#### A. Payment Overview Dashboard
```
┌─────────────────────────────────────────────────────────┐
│  SWIPE TYPE ADMIN - PAYMENT OVERVIEW                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  TODAY'S METRICS                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Revenue  │  │ Payments │  │ Conv Rate│             │
│  │  $348    │  │   29     │  │  7.2%    │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                          │
│  RECENT PURCHASES                                        │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Time  │ User Email      │ Type │ Amount │ Status  │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ 14:23 │ user@email.com  │  3   │ $12.00 │ Success │ │
│  │ 14:20 │ test@test.com   │  1   │ $12.00 │ Success │ │
│  │ 14:15 │ jane@email.com  │  7   │ $12.00 │ Pending │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ALERTS                                                  │
│  🔴 3 payments pending >10 min - Webhook delay?         │
│  🟡 Refund request from user@email.com                  │
└─────────────────────────────────────────────────────────────┘
```

#### B. Purchase Management
- View all purchases (filterable by status, date, user)
- Search by email, purchase ID, or payment intent ID
- View purchase details (timestamp, amount, Stripe links)
- Manual refund (with reason + notes)
- Grant/revoke premium access manually
- View audit log for each purchase

#### C. User Management
- Search user by email
- View user's assessments + purchases
- Manually grant premium access (promo, support, etc.)
- Export user data (GDPR compliance)
- Delete user + all data

#### D. Analytics & Reports
- Revenue charts (daily, weekly, monthly)
- Conversion funnel visualization
- Top-performing types (by purchases)
- Refund rate over time
- Payment method breakdown
- Geographic distribution

### Admin API Endpoints

#### GET /api/admin/purchases (Admin only)
```typescript
// Query params: status, startDate, endDate, limit, offset
{
  purchases: Purchase[],
  total: number,
  page: number,
}
```

#### POST /api/admin/refund (Admin only)
```typescript
// Request
{
  purchaseId: string,
  reason: string,
  amount?: number, // partial refund (optional)
}

// Response
{
  success: boolean,
  refund_id: string,
}
```

#### POST /api/admin/grant-access (Admin only)
```typescript
// Request
{
  userId: string,
  assessmentId: string,
  reason: string, // 'promo', 'support', 'partner', etc.
  expiresAt?: string, // ISO timestamp (optional)
}

// Response
{
  success: boolean,
  access_id: string,
}
```

## 9. POST-LAUNCH OPERATIONS

### Week 1: Launch Monitoring
**Daily Tasks:**
- Check payment success rate (target: >90%)
- Monitor webhook delivery (target: <1 min delay)
- Review refund requests (investigate if >2% rate)
- Check for failed payments (follow up if needed)
- Monitor error logs for payment API

**Weekly Tasks:**
- Revenue report (compare to projections)
- Conversion funnel analysis (identify drop-off points)
- User feedback review (any payment complaints?)
- Security audit (any suspicious activity?)

### Month 1: Optimization
**A/B Test Ideas:**
- Price point ($9 vs $12 vs $15)
- Button copy ("Unlock Premium" vs "Get Full Report" vs "See Everything")
- Placement (top vs bottom of results page)
- Preview content (show 1 strength vs teaser only)

**Optimization Targets:**
- Increase conversion rate by 20-30%
- Reduce checkout abandonment
- Minimize refund rate (<3%)

### Ongoing Maintenance
**Monthly:**
- Review refund requests and identify patterns
- Update FAQs based on support tickets
- Check for Stripe API changes
- Review security logs

**Quarterly:**
- Financial reconciliation (Stripe vs database)
- User survey (satisfaction with premium content)
- Feature prioritization (based on user feedback)
- Compliance audit (GDPR, PCI)

## 10. TESTING STRATEGY

### A. Unit Tests
```typescript
describe('Payment API', () => {
  describe('createCheckoutSession', () => {
    it('creates session for valid assessment', async () => {
      const result = await createCheckoutSession({
        assessmentId: 'valid-uuid',
        userId: 'user-uuid',
        typeNumber: 1,
        priceId: 'price_test',
        successUrl: 'https://app.com/success',
        cancelUrl: 'https://app.com/cancel',
      });
      
      expect(result.sessionId).toBeDefined();
      expect(result.url).toContain('checkout.stripe.com');
    });
    
    it('prevents duplicate purchases', async () => {
      // Create first purchase
      await createCheckoutSession(params);
      
      // Attempt second purchase
      await expect(
        createCheckoutSession(params)
      ).rejects.toThrow('already purchased');
    });
    
    it('validates assessment ownership', async () => {
      const result = createCheckoutSession({
        assessmentId: 'other-user-assessment',
        userId: 'current-user',
        // ...
      });
      
      await expect(result).rejects.toThrow('Invalid assessment');
    });
  });
  
  describe('webhook verification', () => {
    it('verifies valid signatures', () => {
      const isValid = verifyWebhook(validPayload, validSignature);
      expect(isValid).toBe(true);
    });
    
    it('rejects invalid signatures', () => {
      const isValid = verifyWebhook(validPayload, 'bad-signature');
      expect(isValid).toBe(false);
    });
  });
  
  describe('premium access checks', () => {
    it('grants access after successful payment', async () => {
      await handlePaymentSucceeded(paymentIntent);
      
      const hasAccess = await checkPremiumAccess(userId, assessmentId);
      expect(hasAccess).toBe(true);
    });
    
    it('revokes access after refund', async () => {
      await handleRefund(charge);
      
      const hasAccess = await checkPremiumAccess(userId, assessmentId);
      expect(hasAccess).toBe(false);
    });
  });
});
```

### B. Integration Tests
```typescript
describe('End-to-End Payment Flow', () => {
  it('completes full payment journey', async () => {
    // 1. Complete assessment
    const assessment = await completeAssessment();
    
    // 2. Create checkout session
    const session = await createCheckoutSession({
      assessmentId: assessment.id,
      // ...
    });
    
    // 3. Simulate successful Stripe payment
    await stripe.checkout.sessions.complete(session.sessionId);
    
    // 4. Trigger webhook
    await triggerWebhook('payment_intent.succeeded', {
      metadata: { assessment_id: assessment.id },
    });
    
    // 5. Verify premium access granted
    const hasAccess = await checkPremiumAccess(userId, assessment.id);
    expect(hasAccess).toBe(true);
    
    // 6. Verify user can view premium content
    const profile = await getProfile(assessment.type_number, userId);
    expect(profile.premium).toBeDefined();
  });
});
```

### C. Manual Test Plan
**Before Launch:**
- Test in Stripe test mode with test cards
- Test successful payment (4242 4242 4242 4242)
- Test declined card (4000 0000 0000 0002)
- Test card requiring 3D Secure (4000 0025 0000 3155)
- Test webhook delivery
- Test premium content unlock
- Test duplicate purchase prevention
- Test cancellation flow
- Test receipt generation
- Test admin dashboard

**After Launch (Small Payment):**
- Complete real $12 payment
- Verify funds appear in Stripe
- Test refund process
- Verify receipt email
- Check all analytics events fire

## 11. DEPLOYMENT CHECKLIST

### Pre-Launch Checklist

#### Stripe Configuration:
- [ ] Create Stripe account
- [ ] Switch to live mode
- [ ] Create product + price ($12 one-time)
- [ ] Configure webhook endpoint (production URL)
- [ ] Add live API keys to environment variables
- [ ] Test webhook delivery to production
- [ ] Set up Stripe dashboard alerts

#### Database:
- [ ] Run all migrations
- [ ] Set up RLS policies
- [ ] Configure backup schedule
- [ ] Test data export (GDPR compliance)

#### Application:
- [ ] Deploy payment API endpoints
- [ ] Deploy updated ResultsScreen
- [ ] Configure environment variables
- [ ] Set up error monitoring (Sentry)
- [ ] Set up analytics (Mixpanel/Amplitude)
- [ ] Test on production with Stripe test mode

#### Legal & Compliance:
- [ ] Privacy policy updated (payment data disclosure)
- [ ] Terms of service include refund policy
- [ ] GDPR compliance verified
- [ ] Refund policy posted (30-day guarantee?)

#### Monitoring:
- [ ] Payment success rate alert (>90%)
- [ ] Webhook delivery alert (<5 min)
- [ ] Refund rate alert (>5%)
- [ ] Error rate alert (>1%)

#### Documentation:
- [ ] Admin dashboard user guide
- [ ] Support team training (refund process)
- [ ] FAQ updated (payment questions)
- [ ] Troubleshooting guide

## 12. FUTURE ENHANCEMENTS (Post-MVP)

### Phase C: Advanced Features

#### Subscription Model
- Monthly access to all 8 profiles
- Annual discount (20%)
- Family plan (2-4 users)

#### Bundles & Upsells
- Couples package (2 assessments + compatibility report)
- Team package (5+ assessments + team dynamics)
- Coach package (unlimited assessments + analytics)

#### Promotional Features
- Gift codes
- Referral program (give $5, get $5)
- Limited-time discounts
- Free trial period (7 days)

#### Payment Options
- Apple Pay / Google Pay
- PayPal
- Buy now, pay later (Klarna, Afterpay)
- International currencies

#### Advanced Analytics
- Cohort analysis (payment by acquisition channel)
- Lifetime value (LTV) tracking
- Churn prediction
- A/B test platform integration

---

## APPENDIX A: STRIPE TEST CARDS
| Card Number | Scenario |
|------------|----------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Card declined |
| 4000 0000 0000 9995 | Insufficient funds |
| 4000 0000 0000 9987 | Lost card |
| 4000 0000 0000 9979 | Stolen card |
| 4000 0025 0000 3155 | 3D Secure required |

## APPENDIX B: ENVIRONMENT VARIABLES
```env
# Stripe (Test Mode)
STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# Stripe (Live Mode)
STRIPE_PUBLISHABLE_KEY_LIVE=pk_live_51...
STRIPE_SECRET_KEY_LIVE=sk_live_51...
STRIPE_WEBHOOK_SECRET_LIVE=whsec_...
STRIPE_PRICE_ID_LIVE=price_...

# Database
SUPABASE_URL=https://...supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Analytics
MIXPANEL_TOKEN=...
SENTRY_DSN=https://...

# Application
APP_URL=https://swipe-type.com
ADMIN_EMAIL=admin@swipe-type.com
SUPPORT_EMAIL=support@swipe-type.com
```

---

**END OF PHASE B TECHNICAL ARCHITECTURE DOCUMENT**

**DOCUMENT COMPLETE ✅**  
**Total Time:** 2 hours  
**Pages:** 25+ (if printed)  
**Sections:** 12 major + 2 appendices  

This document provides:
✅ Complete system architecture  
✅ Detailed API specifications  
✅ Security & GDPR compliance  
✅ Database schema with RLS  
✅ Edge case handling  
✅ Monitoring & analytics strategy  
✅ Admin dashboard requirements  
✅ Testing strategy  
✅ Deployment checklist  
✅ Future enhancement roadmap  

**Ready for Cursor implementation! 🚀**


