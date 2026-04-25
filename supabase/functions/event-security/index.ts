// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, payload } = await req.json()
    console.log(`[event-security] Action: ${action}`)

    // 1. Secure Pricing Logic (Hidden from frontend)
    if (action === 'get-price') {
      const prices = {
        'Basic': 25000,
        'Standard': 75000,
        'Pro': 150000
      }
      const amount = prices[payload.plan] || 25000
      return new Response(JSON.stringify({ amount }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // 2. Secure QR Validation (Hidden from frontend)
    if (action === 'validate-ticket') {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseServiceKey)

      const { data: rsvp, error } = await supabase
        .from('rsvps')
        .select('*, events(id, event_name)')
        .eq('id', payload.ticketId)
        .maybeSingle()

      if (!rsvp) throw new Error("Invalid Ticket")
      
      return new Response(JSON.stringify({ rsvp }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid Action' }), { status: 400, headers: corsHeaders })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders })
  }
})