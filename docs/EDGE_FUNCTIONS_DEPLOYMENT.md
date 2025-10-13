# Supabase Edge Functions Deployment Guide

**Date:** January 10, 2025  
**Status:** Ready for Deployment  
**Purpose:** Migrate from local backend to Supabase Edge Functions

---

## 🎯 OVERVIEW

This guide migrates the Swipe Type payment system from a local Node.js backend to Supabase Edge Functions, solving port conflicts and environment issues.

### **Benefits:**
- ✅ No port conflicts (serverless)
- ✅ Automatic scaling
- ✅ Built-in CORS handling
- ✅ Integrated with Supabase database
- ✅ No local server management

---

## 📋 PREREQUISITES

### **Required Setup:**
1. **Supabase Project** - Already configured
2. **Stripe Account** - Test mode keys needed
3. **Environment Variables** - Configured in Supabase

### **Stripe Keys Needed:**
- `STRIPE_SECRET_KEY` (sk_test_...)
- `STRIPE_WEBHOOK_SECRET` (whsec_...)
- `STRIPE_PRICE_ID` (price_...)

---

## 🚀 DEPLOYMENT STEPS

### **STEP 1: Configure Supabase Secrets**

```bash
# Login to Supabase
npx supabase login

# Set Stripe secrets
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_your_key_here
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
npx supabase secrets set STRIPE_PRICE_ID=price_your_price_id_here
npx supabase secrets set APP_BASE_URL=https://your-app-domain.com
```

### **STEP 2: Deploy Edge Functions**

```bash
# Deploy all functions
npx supabase functions deploy create-checkout
npx supabase functions deploy stripe-webhook
npx supabase functions deploy check-premium

# Or deploy all at once
npx supabase functions deploy
```

### **STEP 3: Configure Stripe Webhook**

1. **Go to Stripe Dashboard** → Webhooks
2. **Add endpoint:** `https://your-project.supabase.co/functions/v1/stripe-webhook`
3. **Select events:**
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. **Copy webhook secret** to Supabase secrets

### **STEP 4: Update Frontend Environment**

```env
# .env file
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
EXPO_PUBLIC_STRIPE_PRICE_ID=price_your_price_id
```

---

## 🔧 EDGE FUNCTIONS OVERVIEW

### **1. create-checkout**
- **Endpoint:** `/functions/v1/create-checkout`
- **Method:** POST
- **Input:** `{ userId, assessmentId, typeNumber }`
- **Output:** `{ sessionId, url, purchaseId }`
- **Purpose:** Creates Stripe checkout session

### **2. stripe-webhook**
- **Endpoint:** `/functions/v1/stripe-webhook`
- **Method:** POST (Stripe webhook)
- **Input:** Stripe webhook events
- **Output:** `{ received: true }`
- **Purpose:** Handles payment events, grants/revokes access

### **3. check-premium**
- **Endpoint:** `/functions/v1/check-premium`
- **Method:** GET/POST
- **Input:** `{ userId, assessmentId }`
- **Output:** `{ hasAccess, grantedAt, expiresAt, purchaseId }`
- **Purpose:** Checks if user has premium access

---

## 🧪 TESTING

### **Test Checkout Flow:**
```bash
# Test create-checkout
curl -X POST https://your-project.supabase.co/functions/v1/create-checkout \
  -H "Authorization: Bearer your_anon_key" \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user","assessmentId":"test-assessment","typeNumber":1}'
```

### **Test Premium Check:**
```bash
# Test check-premium
curl "https://your-project.supabase.co/functions/v1/check-premium?userId=test-user&assessmentId=test-assessment" \
  -H "Authorization: Bearer your_anon_key"
```

### **Test Webhook:**
```bash
# Use Stripe CLI to test webhooks
stripe listen --forward-to https://your-project.supabase.co/functions/v1/stripe-webhook
```

---

## 📊 MONITORING

### **View Function Logs:**
```bash
# View logs for specific function
npx supabase functions logs create-checkout
npx supabase functions logs stripe-webhook
npx supabase functions logs check-premium
```

### **Monitor in Supabase Dashboard:**
1. Go to **Functions** section
2. View **Logs** and **Metrics**
3. Check **Error rates** and **Response times**

---

## 🔄 MIGRATION CHECKLIST

### **Pre-Migration:**
- [ ] Supabase project configured
- [ ] Database tables created (purchases, premium_access)
- [ ] Stripe test account set up
- [ ] Environment variables ready

### **Migration:**
- [ ] Edge Functions deployed
- [ ] Stripe webhook configured
- [ ] Frontend updated to use Edge Functions
- [ ] Test checkout flow
- [ ] Test premium access check
- [ ] Test webhook processing

### **Post-Migration:**
- [ ] Remove local backend server
- [ ] Update documentation
- [ ] Monitor function performance
- [ ] Set up alerts for errors

---

## 🚨 TROUBLESHOOTING

### **Common Issues:**

**1. Function Not Found (404)**
- Check function deployment: `npx supabase functions list`
- Verify function name matches endpoint

**2. CORS Errors**
- Edge Functions handle CORS automatically
- Check if request includes proper headers

**3. Authentication Errors**
- Verify Supabase anon key is correct
- Check Authorization header format

**4. Stripe Webhook Failures**
- Verify webhook secret matches
- Check Stripe dashboard for webhook delivery status
- Review function logs for errors

### **Debug Commands:**
```bash
# Check function status
npx supabase functions list

# View recent logs
npx supabase functions logs --follow

# Test function locally
npx supabase functions serve
```

---

## 📈 PERFORMANCE

### **Expected Performance:**
- **Cold start:** ~200-500ms
- **Warm requests:** ~50-100ms
- **Concurrent requests:** Auto-scaling
- **Timeout:** 30 seconds max

### **Optimization Tips:**
- Use connection pooling for database
- Cache Stripe client initialization
- Minimize function dependencies

---

## 🔒 SECURITY

### **Security Features:**
- ✅ Webhook signature verification
- ✅ CORS protection
- ✅ Environment variable isolation
- ✅ Database RLS policies
- ✅ Input validation

### **Best Practices:**
- Rotate secrets regularly
- Monitor for unusual activity
- Use least-privilege access
- Log all payment events

---

## 📞 SUPPORT

### **Resources:**
- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Function Logs](https://supabase.com/docs/guides/functions/logs)

### **Emergency Contacts:**
- Supabase Support: support@supabase.com
- Stripe Support: support@stripe.com

---

**Migration Status:** ✅ Ready for Production  
**Next Steps:** Deploy functions and test payment flow  
**Estimated Time:** 30-60 minutes
