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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body = await req.json()
    console.log("[paystack-webhook] Received event:", body.event)

    if (body.event === 'charge.success') {
      const data = body.data
      const metadata = data.metadata || {}
      
      // Paystack can send metadata in different formats. We check all of them.
      let event_id = metadata.event_id
      let payment_type = metadata.payment_type
      let guest_name = metadata.guest_name
      let plan = metadata.plan

      // Fallback: Check inside custom_fields array (standard Paystack format)
      if (!event_id && metadata.custom_fields) {
        const eventField = metadata.custom_fields.find(f => f.variable_name === 'event_id')
        const typeField = metadata.custom_fields.find(f => f.variable_name === 'payment_type')
        const nameField = metadata.custom_fields.find(f => f.variable_name === 'guest_name')
        const planField = metadata.custom_fields.find(f => f.variable_name === 'plan')
        
        event_id = eventField?.value
        payment_type = typeField?.value
        guest_name = nameField?.value
        plan = planField?.value
      }

      const amount = data.amount / 100 
      
      if (payment_type === 'gift' && event_id) {
        console.log(`[paystack-webhook] Recording gift of ₦${amount} for event: ${event_id}`)
        
        const { error: ledgerError } = await supabase
          .from('budget_items')
          .insert({
            event_id: event_id,
            description: `Digital Spray from ${guest_name || 'Anonymous Guest'}`,
            amount: amount,
            type: 'income'
          })

        if (ledgerError) throw ledgerError
        
        return new Response(JSON.stringify({ message: 'Gift recorded successfully' }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        })
      } else if (event_id) {
        console.log(`[paystack-webhook] Activating event: ${event_id} with plan: ${plan}`)
        
        const { error } = await supabase
          .from('events')
          .update({ 
            is_paid: true,
            plan: plan || 'Basic'
          })
          .eq('id', event_id)

        if (error) throw error
        
        return new Response(JSON.stringify({ message: 'Event activated successfully' }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        })
      }
    }

    return new Response(JSON.stringify({ message: 'Event processed but no action taken' }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    })
  } catch (error) {
    console.error("[paystack-webhook] Critical Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400 
    })
  }
})