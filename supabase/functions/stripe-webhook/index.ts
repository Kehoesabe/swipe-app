import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get Stripe webhook secret
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not configured')
    }

    // Get Stripe secret key
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY not configured')
    }

    // Initialize Stripe
    const stripe = new (await import('https://esm.sh/stripe@14.21.0')).default(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })

    // Get the signature from headers
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      throw new Error('No stripe-signature header found')
    }

    // Get the raw body
    const body = await req.text()

    // Verify webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response(
        JSON.stringify({ error: 'Webhook signature verification failed' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Received webhook event:', event.type)

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        console.log('Processing checkout.session.completed:', session.id)

        // Find the purchase record
        const { data: purchase, error: purchaseError } = await supabaseClient
          .from('purchases')
          .select('*')
          .eq('stripe_checkout_session_id', session.id)
          .single()

        if (purchaseError || !purchase) {
          console.error('Purchase record not found:', purchaseError)
          throw new Error('Purchase record not found')
        }

        // Update purchase status
        const { error: updateError } = await supabaseClient
          .from('purchases')
          .update({
            status: 'succeeded',
            paid_at: new Date().toISOString(),
            customer_email: session.customer_email || '',
          })
          .eq('id', purchase.id)

        if (updateError) {
          console.error('Error updating purchase:', updateError)
          throw new Error('Failed to update purchase status')
        }

        // Grant premium access
        const { error: accessError } = await supabaseClient
          .from('premium_access')
          .insert({
            user_id: purchase.user_id,
            assessment_id: purchase.assessment_id,
            purchase_id: purchase.id,
            granted_at: new Date().toISOString(),
            granted_by: 'payment',
          })

        if (accessError) {
          console.error('Error granting premium access:', accessError)
          throw new Error('Failed to grant premium access')
        }

        console.log('✅ Premium access granted for user:', purchase.user_id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        console.log('Processing payment_intent.payment_failed:', paymentIntent.id)

        // Find and update purchase status
        const { error: updateError } = await supabaseClient
          .from('purchases')
          .update({
            status: 'failed',
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        if (updateError) {
          console.error('Error updating failed purchase:', updateError)
        }

        break
      }

      case 'charge.refunded': {
        const charge = event.data.object
        console.log('Processing charge.refunded:', charge.id)

        // Find the purchase and revoke access
        const { data: purchase, error: purchaseError } = await supabaseClient
          .from('purchases')
          .select('*')
          .eq('stripe_payment_intent_id', charge.payment_intent)
          .single()

        if (purchaseError || !purchase) {
          console.error('Purchase record not found for refund:', purchaseError)
          break
        }

        // Update purchase status
        await supabaseClient
          .from('purchases')
          .update({
            status: 'refunded',
            refunded_at: new Date().toISOString(),
          })
          .eq('id', purchase.id)

        // Revoke premium access
        await supabaseClient
          .from('premium_access')
          .update({
            revoked_at: new Date().toISOString(),
          })
          .eq('purchase_id', purchase.id)

        console.log('✅ Premium access revoked for refunded purchase')
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(
      JSON.stringify({ received: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in stripe-webhook:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Webhook processing failed',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})


