import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateCheckoutRequest {
  userId: string;
  assessmentId: string;
  typeNumber: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Parse request body
    const { userId, assessmentId, typeNumber }: CreateCheckoutRequest = await req.json()

    // Validate required parameters
    if (!userId || !assessmentId || !typeNumber) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: userId, assessmentId, and typeNumber are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check for existing premium access (duplicate prevention)
    const { data: existingAccess } = await supabaseClient
      .from('premium_access')
      .select('*')
      .eq('user_id', userId)
      .eq('assessment_id', assessmentId)
      .single()

    if (existingAccess) {
      return new Response(
        JSON.stringify({ error: 'ALREADY_PURCHASED' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get Stripe secret key from environment
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY not configured')
    }

    // Create Stripe checkout session
    const stripe = new (await import('https://esm.sh/stripe@14.21.0')).default(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: Deno.env.get('STRIPE_PRICE_ID') || 'price_1234567890', // Default test price
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${Deno.env.get('APP_BASE_URL') || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${Deno.env.get('APP_BASE_URL') || 'http://localhost:3000'}/payment/cancelled`,
      client_reference_id: `${userId}_${assessmentId}`,
      metadata: {
        user_id: userId,
        assessment_id: assessmentId,
        type_number: typeNumber.toString(),
      },
    })

    // Create purchase record in database
    const { data: purchase, error: purchaseError } = await supabaseClient
      .from('purchases')
      .insert({
        user_id: userId,
        assessment_id: assessmentId,
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_checkout_session_id: session.id,
        amount: 1200, // $12.00 in cents
        currency: 'usd',
        status: 'pending',
        customer_email: '', // Will be filled by webhook
      })
      .select()
      .single()

    if (purchaseError) {
      console.error('Error creating purchase record:', purchaseError)
      throw new Error('Failed to create purchase record')
    }

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
        purchaseId: purchase.id,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in create-checkout:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create checkout session',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})


