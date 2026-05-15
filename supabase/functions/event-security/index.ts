// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const { action, payload } = await req.json()
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const paystackSecret = Deno.env.get('PAYSTACK_SECRET_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log(`[event-security] Action: ${action}`)

    if (action === 'get-price') {
      const prices = { 'Basic': 25000, 'Standard': 75000, 'Pro': 150000 }
      return new Response(JSON.stringify({ amount: prices[payload.plan] || 25000 }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    if (action === 'get-spray-config') {
      // 1. Get Event and Host Profile
      const { data: event } = await supabase.from('events').select('host_id').eq('id', payload.eventId).single()
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', event.host_id).single()

      if (!profile?.bank_name || !profile?.account_number) {
        return new Response(JSON.stringify({ subaccount: null, error: "Host has not set up bank details." }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        })
      }

      // 2. Use existing subaccount or create new one
      if (profile.paystack_subaccount_code) {
        return new Response(JSON.stringify({ subaccount: profile.paystack_subaccount_code }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        })
      }

      // 3. Create Subaccount on Paystack
      const response = await fetch('https://api.paystack.co/subaccount', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${paystackSecret}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: profile.full_name || "Event Host",
          settlement_bank: profile.bank_name,
          account_number: profile.account_number,
          percentage_charge: 0 // Platform takes 0%, Paystack takes their standard fee
        })
      })

      const subData = await response.json()
      if (!subData.status) throw new Error(subData.message)

      // 4. Save subaccount code to profile
      await supabase.from('profiles').update({ paystack_subaccount_code: subData.data.subaccount_code }).eq('id', event.host_id)

      return new Response(JSON.stringify({ subaccount: subData.data.subaccount_code }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid Action' }), { status: 400, headers: corsHeaders })
  } catch (error) {
    console.error("[event-security] Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders })
  }
})