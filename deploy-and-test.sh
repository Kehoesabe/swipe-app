#!/bin/bash

# Supabase Edge Functions Deployment and Testing Script
echo "🚀 Supabase Edge Functions Deployment & Testing"
echo "=============================================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Check login status
echo "📋 Checking Supabase login status..."
if ! npx supabase status &> /dev/null; then
    echo "🔐 Please login to Supabase:"
    echo "Run: npx supabase login"
    echo "Then run this script again."
    exit 1
fi

echo "✅ Logged in to Supabase"

# Deploy functions
echo ""
echo "📦 Deploying Edge Functions..."

echo "Deploying create-checkout..."
npx supabase functions deploy create-checkout
if [ $? -eq 0 ]; then
    echo "✅ create-checkout deployed"
else
    echo "❌ create-checkout deployment failed"
    exit 1
fi

echo "Deploying stripe-webhook..."
npx supabase functions deploy stripe-webhook
if [ $? -eq 0 ]; then
    echo "✅ stripe-webhook deployed"
else
    echo "❌ stripe-webhook deployment failed"
    exit 1
fi

echo "Deploying check-premium..."
npx supabase functions deploy check-premium
if [ $? -eq 0 ]; then
    echo "✅ check-premium deployed"
else
    echo "❌ check-premium deployment failed"
    exit 1
fi

echo ""
echo "🎉 All Edge Functions deployed successfully!"
echo ""

# Get project info
echo "📊 Project Information:"
PROJECT_URL=$(npx supabase status | grep "API URL" | awk '{print $3}')
echo "Project URL: $PROJECT_URL"

echo ""
echo "🧪 Next Steps for Testing:"
echo "1. Configure Stripe webhook endpoint:"
echo "   $PROJECT_URL/functions/v1/stripe-webhook"
echo ""
echo "2. Test create-checkout:"
echo "   curl -X POST $PROJECT_URL/functions/v1/create-checkout \\"
echo "     -H 'Authorization: Bearer YOUR_ANON_KEY' \\"
echo "     -H 'apikey: YOUR_ANON_KEY' \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"userId\":\"test\",\"assessmentId\":\"123\",\"typeNumber\":1}'"
echo ""
echo "3. Test check-premium:"
echo "   curl '$PROJECT_URL/functions/v1/check-premium?userId=test&assessmentId=123' \\"
echo "     -H 'Authorization: Bearer YOUR_ANON_KEY' \\"
echo "     -H 'apikey: YOUR_ANON_KEY'"
echo ""
echo "4. Complete end-to-end test:"
echo "   - Frontend → create-checkout → Stripe URL"
echo "   - Complete test payment"
echo "   - Webhook → premium_access created"
echo "   - check-premium returns true"
echo ""
echo "📚 Full testing guide: docs/EDGE_FUNCTIONS_SMOKE_TEST.md"


