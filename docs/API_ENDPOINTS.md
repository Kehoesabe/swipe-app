# API Endpoints (MVP)

**Base URL**: `/api`  
**Auth**: Supabase JWT (Bearer) for protected routes; anonymous allowed for start/answer/submit with ownership token.  
**Idempotency**: Use `Idempotency-Key` on payment + submit.

**Rate Limits (suggested)**
- Auth: 10 req/min/IP
- Assessment writes: 60 req/min/user
- Payment: 10 req/min/user
- Reports: 60 req/min/user

---

## Assessment

### POST `/api/assessment/start`
**Auth:** Optional  
**Body:**
```json
{ "userId": "uuid | null" }
```

**Response:**
```json
{ "assessmentId": "uuid", "status": "started", "createdAt": "iso-8601" }
```

### POST `/api/assessment/answer`
**Auth:** Optional (must own assessment via cookie/session)  
**Body:**
```json
{ "assessmentId":"uuid","questionId":12,"direction":"up|right|left|down","at":"iso-8601" }
```

**Response:**
```json
{ "ok": true, "savedCount": 1 }
```

### POST `/api/assessment/submit`
**Auth:** Optional (must own assessment)  
**Body:**
```json
{ "assessmentId": "uuid" }
```

**Response:**
```json
{
  "assessmentId": "uuid",
  "scores": { "...": 0.0 },
  "topConnectionStyle": "qualityPresence",
  "topEnneagramType": "type4",
  "mappingKey": "qualityPresence_type4",
  "swipeType": "Deep Connector",
  "blend": { "connectionStyle": null, "enneagramType": null },
  "completedAt": "iso-8601"
}
```

**Errors:** 400 (<57 answers), 409 (already submitted), 500 (compute error)

### GET `/api/assessment/:id`
**Auth:** Owner (JWT or signed public token for anonymous)  
**Response:**
```json
{
  "assessmentId":"uuid",
  "status":"completed",
  "swipeType":"Deep Connector",
  "freeSummary": { "title":"...", "body":"..." },
  "premiumUnlocked": false
}
```

---

## Auth

### POST `/api/auth/signup`
**Body:**
```json
{ "email":"string","password":"string","displayName":"string" }
```

**Response:**
```json
{ "userId":"uuid","emailVerificationSent":true }
```

### POST `/api/auth/login`
**Body:**
```json
{ "email":"string","password":"string" }
```

**Response:**
```json
{ "accessToken":"jwt","refreshToken":"jwt","user":{"id":"uuid","email":"..."} }
```

### POST `/api/auth/logout`
**Response:** 204

### GET `/api/user/profile`
**Auth:** Required  
**Response:**
```json
{ "id":"uuid","email":"...","displayName":"...","avatarUrl":null,"subscriptionTier":"free" }
```

### PATCH `/api/user/profile`
**Body:**
```json
{ "displayName":"string","avatarUrl":"string" }
```

**Response:** Updated profile.

---

## Payment

### POST `/api/payment/checkout`
**Auth:** Required (or anonymous → temp user)  
**Body:**
```json
{ "assessmentId":"uuid","productCode":"premium_report" }
```

**Response:**
```json
{ "checkoutUrl":"https://checkout.stripe.com/...","sessionId":"cs_test_..." }
```

**Errors:** 400 invalid assessment, 409 already unlocked

### POST `/api/payment/webhook`
**Auth:** Stripe signature  
**Events:** `checkout.session.completed`, `payment_intent.succeeded`, `charge.refunded`  
**Response:** 200 on success

**Payment status values (DB & API):**  
`init`, `requires_payment_method`, `requires_action`, `processing`, `paid`, `failed`, `refunded`, `canceled`

### GET `/api/user/purchases`
**Auth:** Required  
**Response:**
```json
[{ "id":"uuid","assessmentId":"uuid","status":"paid","amountCents":1200,"createdAt":"iso-8601" }]
```

---

## Content Delivery

### GET `/api/report/free/:assessment_id`
**Auth:** Owner (or signed token)  
**Response:** Free summary payload

### GET `/api/report/premium/:assessment_id`
**Auth:** Owner + `premium_unlocked=true`  
**Response:** Full premium report payload
