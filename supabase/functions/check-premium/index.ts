import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CheckPremiumRequest {
  userId: string;
  assessmentId: string;
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

    // Parse request body or query parameters
    let userId: string
    let assessmentId: string

    if (req.method === 'POST') {
      const { userId: bodyUserId, assessmentId: bodyAssessmentId }: CheckPremiumRequest = await req.json()
      userId = bodyUserId
      assessmentId = bodyAssessmentId
    } else {
      const url = new URL(req.url)
      userId = url.searchParams.get('userId') || ''
      assessmentId = url.searchParams.get('assessmentId') || ''
    }

    // Validate required parameters
    if (!userId || !assessmentId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: userId and assessmentId are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Checking premium access for:', { userId, assessmentId })

    // Query premium access table
    const { data: access, error } = await supabaseClient
      .from('premium_access')
      .select(`
        *,
        purchases (
          id,
          status,
          amount,
          currency,
          paid_at
        )
      `)
      .eq('user_id', userId)
      .eq('assessment_id', assessmentId)
      .is('revoked_at', null) // Only active access
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error querying premium access:', error)
      throw new Error('Failed to check premium access')
    }

    // Check if access exists and is valid
    const hasAccess = access && !access.revoked_at && 
      (!access.expires_at || new Date(access.expires_at) > new Date())

    if (hasAccess) {
      console.log('✅ Premium access found:', {
        grantedAt: access.granted_at,
        expiresAt: access.expires_at,
        purchaseStatus: access.purchases?.status
      })
    } else {
      console.log('❌ No premium access found')
    }

    return new Response(
      JSON.stringify({
        hasAccess,
        grantedAt: hasAccess ? access.granted_at : undefined,
        expiresAt: hasAccess ? access.expires_at : undefined,
        purchaseId: hasAccess ? access.purchase_id : undefined,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in check-premium:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to check premium access',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
