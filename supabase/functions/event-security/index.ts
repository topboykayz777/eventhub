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

    if (action === 'verify-bank') {
      const response = await fetch(`https://api.paystack.co/bank/resolve?account_number=${payload.accountNumber}&bank_code=${payload.bankCode}`, {
        headers: { 'Authorization': `Bearer ${paystackSecret}` }
      })
      const data = await response.json()
      return new Response(JSON.stringify(data), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    if (action === 'create-subaccount') {
      const response = await fetch('https://api.paystack.co/subaccount', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${paystackSecret}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: payload.accountName,
          settlement_bank: payload.bankCode,
          account_number: payload.accountNumber,
          percentage_charge: 0
        })
      })
      const data = await response.json()
      return new Response(JSON.stringify(data), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    if (action === 'get-spray-config') {
      const { data: event } = await supabase.from('events').select('host_id').eq('id', payload.eventId).single()
      const { data: profile } = await supabase.from('profiles').select('paystack_subaccount_code').eq('id', event.host_id).single()
      return new Response(JSON.stringify({ subaccount: profile?.paystack_subaccount_code || null }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid Action' }), { status: 400, headers: corsHeaders })
  } catch (error) {
    console.error("[event-security] Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders })
  }
})