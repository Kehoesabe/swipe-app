# Supabase Edge Functions Deployment and Testing Script
Write-Host "🚀 Supabase Edge Functions Deployment & Testing" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

# Check if Supabase CLI is installed
try {
    npx supabase --version | Out-Null
    Write-Host "✅ Supabase CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI not found. Installing..." -ForegroundColor Red
    npm install -g supabase
}

# Check login status
Write-Host "📋 Checking Supabase login status..." -ForegroundColor Yellow
try {
    npx supabase status | Out-Null
    Write-Host "✅ Logged in to Supabase" -ForegroundColor Green
} catch {
    Write-Host "🔐 Please login to Supabase:" -ForegroundColor Red
    Write-Host "Run: npx supabase login" -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📦 Deploying Edge Functions..." -ForegroundColor Yellow

# Deploy create-checkout
Write-Host "Deploying create-checkout..." -ForegroundColor Cyan
try {
    npx supabase functions deploy create-checkout
    Write-Host "✅ create-checkout deployed" -ForegroundColor Green
} catch {
    Write-Host "❌ create-checkout deployment failed" -ForegroundColor Red
    exit 1
}

# Deploy stripe-webhook
Write-Host "Deploying stripe-webhook..." -ForegroundColor Cyan
try {
    npx supabase functions deploy stripe-webhook
    Write-Host "✅ stripe-webhook deployed" -ForegroundColor Green
} catch {
    Write-Host "❌ stripe-webhook deployment failed" -ForegroundColor Red
    exit 1
}

# Deploy check-premium
Write-Host "Deploying check-premium..." -ForegroundColor Cyan
try {
    npx supabase functions deploy check-premium
    Write-Host "✅ check-premium deployed" -ForegroundColor Green
} catch {
    Write-Host "❌ check-premium deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 All Edge Functions deployed successfully!" -ForegroundColor Green
Write-Host ""

# Get project info
Write-Host "📊 Project Information:" -ForegroundColor Yellow
$status = npx supabase status
$projectUrl = ($status | Select-String "API URL").Line.Split(":")[1].Trim()
Write-Host "Project URL: $projectUrl" -ForegroundColor Cyan

Write-Host ""
Write-Host "🧪 Next Steps for Testing:" -ForegroundColor Yellow
Write-Host "1. Configure Stripe webhook endpoint:" -ForegroundColor White
Write-Host "   $projectUrl/functions/v1/stripe-webhook" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Test create-checkout:" -ForegroundColor White
Write-Host "   curl -X POST $projectUrl/functions/v1/create-checkout \" -ForegroundColor Cyan
Write-Host "     -H 'Authorization: Bearer YOUR_ANON_KEY' \" -ForegroundColor Cyan
Write-Host "     -H 'apikey: YOUR_ANON_KEY' \" -ForegroundColor Cyan
Write-Host "     -H 'Content-Type: application/json' \" -ForegroundColor Cyan
Write-Host "     -d '{\"userId\":\"test\",\"assessmentId\":\"123\",\"typeNumber\":1}'" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Test check-premium:" -ForegroundColor White
Write-Host "   curl `"$projectUrl/functions/v1/check-premium?userId=test&assessmentId=123`" \" -ForegroundColor Cyan
Write-Host "     -H 'Authorization: Bearer YOUR_ANON_KEY' \" -ForegroundColor Cyan
Write-Host "     -H 'apikey: YOUR_ANON_KEY'" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Complete end-to-end test:" -ForegroundColor White
Write-Host "   - Frontend → create-checkout → Stripe URL" -ForegroundColor Green
Write-Host "   - Complete test payment" -ForegroundColor Green
Write-Host "   - Webhook → premium_access created" -ForegroundColor Green
Write-Host "   - check-premium returns true" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Full testing guide: docs/EDGE_FUNCTIONS_SMOKE_TEST.md" -ForegroundColor Yellow
