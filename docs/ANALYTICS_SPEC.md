# ANALYTICS SPEC

## Principles
- No raw free-text PII in analytics payloads.
- Question text is never logged; use `questionId`, `framework`, `category`.
- Respect "Do Not Track" and in-app privacy toggle.

## Core Events

### 1) `assessment_start`
**When:** User starts assessment  
**Props:**
- `sessionId` (string, uuid)
- `seed` (number)
- `platform` ('ios'|'android'|'web')
- `orderVersion` ('v1')
- `abBucket` (string)

### 2) `assessment_response`
**When:** User answers a question  
**Props:**
- `sessionId`
- `questionId` (number)
- `framework` ('connection'|'enneagram')
- `category` (string)
- `reverse` (boolean)
- `direction` ('up'|'right'|'left'|'down')
- `displayOrder` (1..57)
- `msSinceRender` (number)
- `inputMethod` ('swipe'|'keyboard'|'buttons')
- `tags` (string[] | null)
- `errored` (boolean)

### 3) `assessment_undo`
**When:** Undo pressed  
**Props:** `sessionId`, `questionId`, `displayOrder`

### 4) `assessment_complete`
**When:** Last answer submitted  
**Props:**
- `sessionId`
- `durationMs`
- `answersCount` (should be 57)
- `topStyle` (string), `topEnneagram` (string)
- `primarySwipeType` (string)
- `blendSwipeType` (string|null)
- `margins` ({ style:number, enneagram:number })

### 5) `paywall_view`
**When:** Free results screen shows paywall  
**Props:**
- `sessionId`
- `variant` ('A'|'B'|'C')
- `price` (number)
- `ctaCopy` (string)

### 6) `purchase_attempt`
**Props:** `sessionId`, `provider` ('stripe'), `productId`, `price`

### 7) `purchase_success`
**Props:** `sessionId`, `provider`, `productId`, `price`, `receiptId`

### 8) `purchase_failure`
**Props:** `sessionId`, `provider`, `productId`, `price`, `code`, `messageHash`

### 9) `share_click`
**Props:** `sessionId`, `destination` ('twitter'|'instagram'|'link'|...)

## Derived KPIs
- Completion rate, median duration, speeding %, longstring %, undo rate
- Paywall view → purchase conversion
- Blend rate and margin distributions
