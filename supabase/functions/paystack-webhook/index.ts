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
      // Paystack metadata can be flat or nested in custom_fields
      const metadata = body.data.metadata || {}
      
      // Try to find event_id and payment_type in flat metadata or custom_fields
      let event_id = metadata.event_id
      let payment_type = metadata.payment_type
      let guest_name = metadata.guest_name
      let plan = metadata.plan

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

      const amount = body.data.amount / 100 // Convert from kobo to Naira
      
      if (payment_type === 'gift') {
        console.log("[paystack-webhook] Recording gift for event:", event_id)
        
        const { error: ledgerError } = await supabase
          .from('budget_items')
          .insert({
            event_id: event_id,
            description: `Digital Spray from ${guest_name || 'Anonymous Guest'}`,
            amount: amount,
            type: 'income'
          })

        if (ledgerError) throw ledgerError
        
        return new Response(JSON.stringify({ message: 'Gift recorded' }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        })
      } else {
        console.log("[paystack-webhook] Activating event:", event_id)
        
        const { error } = await supabase
          .from('events')
          .update({ 
            is_paid: true,
            plan: plan || 'Basic'
          })
          .eq('id', event_id)

        if (error) throw error
        
        return new Response(JSON.stringify({ message: 'Event activated' }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        })
      }
    }

    return new Response(JSON.stringify({ message: 'Event ignored' }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    })
  } catch (error) {
    console.error("[paystack-webhook] Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400 
    })
  }
})