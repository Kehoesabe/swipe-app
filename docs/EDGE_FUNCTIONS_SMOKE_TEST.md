# Edge Functions Smoke Test Guide

**Date:** January 10, 2025  
**Purpose:** End-to-end testing of Supabase Edge Functions payment system  
**Status:** Ready for Production Testing

---

## 🎯 SMOKE TEST OVERVIEW

This guide tests the complete payment flow using Supabase Edge Functions:

1. **Frontend** → **create-checkout** → **Stripe URL**
2. **Complete test payment** in Stripe
3. **Webhook fires** → **premium_access record created**
4. **check-premium** returns **true**

---

## 📋 PREREQUISITES

### **Required Setup:**
- [ ] Supabase project configured
- [ ] Stripe test account with keys
- [ ] Edge Functions deployed
- [ ] Stripe webhook configured
- [ ] Frontend updated to use Edge Functions

### **Environment Variables:**
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
EXPO_PUBLIC_STRIPE_PRICE_ID=price_your_price_id
```

---

## 🚀 DEPLOYMENT STEPS

### **Step 1: Login to Supabase**
```bash
npx supabase login
```

### **Step 2: Set Secrets**
```bash
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_your_key
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
npx supabase secrets set STRIPE_PRICE_ID=price_your_price_id
npx supabase secrets set APP_BASE_URL=https://your-app-domain.com
```

### **Step 3: Deploy Functions**
```bash
npx supabase functions deploy create-checkout
npx supabase functions deploy stripe-webhook
npx supabase functions deploy check-premium
```

### **Step 4: Configure Stripe Webhook**
1. Go to **Stripe Dashboard** → **Developers** → **Webhooks**
2. Add endpoint: `https://your-project.supabase.co/functions/v1/stripe-webhook`
3. Select events:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
   - ✅ `charge.refunded`
4. Copy webhook secret to Supabase secrets

---

## 🧪 SMOKE TEST PROCEDURE

### **Test 1: Create Checkout Session**

**Frontend Call:**
```javascript
// In your app, trigger the unlock button
const result = await createCheckoutSession({
  userId: 'test-user-123',
  assessmentId: 'test-assessment-456',
  typeNumber: 1
});

console.log('Checkout URL:', result.url);
```

**Expected Result:**
- ✅ Function returns `{ sessionId, url, purchaseId }`
- ✅ URL points to Stripe checkout
- ✅ Purchase record created in database

**Manual Test:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/create-checkout \
  -H "Authorization: Bearer your_anon_key" \
  -H "apikey: your_anon_key" \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user","assessmentId":"test-123","typeNumber":1}'
```

### **Test 2: Complete Test Payment**

**Stripe Test Cards:**
- **Success:** `4242 4242 4242 4242`
- **Declined:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`

**Steps:**
1. Click checkout URL from Test 1
2. Use test card `4242 4242 4242 4242`
3. Complete payment in Stripe
4. Get redirected back to app

**Expected Result:**
- ✅ Stripe processes payment successfully
- ✅ Webhook fires to Edge Function
- ✅ Premium access granted

### **Test 3: Verify Webhook Processing**

**Check Function Logs:**
```bash
npx supabase functions logs stripe-webhook
```

**Expected Logs:**
```
Received webhook event: checkout.session.completed
Processing checkout.session.completed: cs_test_...
✅ Premium access granted for user: test-user-123
```

**Check Database:**
```sql
-- Check premium_access table
SELECT * FROM premium_access WHERE user_id = 'test-user-123';

-- Check purchases table
SELECT * FROM purchases WHERE user_id = 'test-user-123';
```

### **Test 4: Check Premium Access**

**Frontend Call:**
```javascript
const access = await checkPremiumAccess('test-user-123', 'test-assessment-456');
console.log('Has access:', access.hasAccess);
```

**Expected Result:**
- ✅ `hasAccess: true`
- ✅ `grantedAt` timestamp present
- ✅ `purchaseId` matches

**Manual Test:**
```bash
curl "https://your-project.supabase.co/functions/v1/check-premium?userId=test-user-123&assessmentId=test-assessment-456" \
  -H "Authorization: Bearer your_anon_key" \
  -H "apikey: your_anon_key"
```

---

## 🔍 TROUBLESHOOTING

### **Common Issues:**

**1. Function Not Found (404)**
```bash
# Check deployed functions
npx supabase functions list

# Redeploy if needed
npx supabase functions deploy create-checkout
```

**2. Authentication Errors**
```bash
# Check if logged in
npx supabase status

# Re-login if needed
npx supabase login
```

**3. Webhook Not Firing**
- Check Stripe Dashboard → Webhooks → Recent deliveries
- Verify webhook secret matches Supabase secret
- Check function logs for errors

**4. Database Errors**
```sql
-- Check if tables exist
SELECT * FROM information_schema.tables 
WHERE table_name IN ('purchases', 'premium_access');

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'premium_access';
```

### **Debug Commands:**
```bash
# View all function logs
npx supabase functions logs

# Check specific function
npx supabase functions logs create-checkout --follow

# Test function locally (if Docker available)
npx supabase functions serve create-checkout
```

---

## 📊 SUCCESS CRITERIA

### **✅ Complete Flow Test:**
1. **Frontend** calls `createCheckoutSession()` → **Stripe URL returned**
2. **User** completes payment in Stripe → **Payment successful**
3. **Webhook** fires to `stripe-webhook` → **Premium access granted**
4. **Frontend** calls `checkPremiumAccess()` → **Returns true**

### **✅ Database Verification:**
- `purchases` table has new record with `status: 'succeeded'`
- `premium_access` table has new record with `granted_at` timestamp
- No duplicate records created

### **✅ Error Handling:**
- Duplicate purchase attempts blocked
- Failed payments don't grant access
- Network errors handled gracefully

---

## 🚨 ROLLBACK PLAN

If Edge Functions fail:

### **Immediate Rollback:**
1. **Revert frontend** to use local backend
2. **Start local server** on port 9001
3. **Update environment** to point to localhost

### **Code Changes:**
```typescript
// In src/api/payment.ts
const getBaseUrl = () => 'http://localhost:9001';
```

### **Start Local Backend:**
```bash
cd swipe-app/backend
npm install
PORT=9001 npm run dev
```

---

## 📈 MONITORING

### **Key Metrics to Watch:**
- **Function response times** (< 1 second)
- **Error rates** (< 5%)
- **Webhook delivery success** (> 95%)
- **Payment completion rate** (track in Stripe Dashboard)

### **Alerts to Set Up:**
- Function errors > 10%
- Webhook failures > 5%
- Payment failures > 15%
- Database connection errors

---

## 🎉 SUCCESS CONFIRMATION

**Smoke test passes when:**
- ✅ All 4 test steps complete successfully
- ✅ No errors in function logs
- ✅ Database records created correctly
- ✅ Frontend shows premium content
- ✅ Payment appears in Stripe Dashboard

**Next Steps:**
- Monitor for 24 hours
- Set up production monitoring
- Document any issues found
- Plan for production deployment

---

**Test Status:** 🟡 Ready for Execution  
**Estimated Time:** 30-45 minutes  
**Risk Level:** Low (rollback plan available)


