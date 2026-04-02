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
      const { event_id } = body.data.metadata
      
      console.log("[paystack-webhook] Updating event status:", event_id)
      
      const { error } = await supabase
        .from('events')
        .update({ 
          is_paid: true,
          status: 'Active' 
        })
        .eq('id', event_id)

      if (error) throw error
      
      return new Response(JSON.stringify({ message: 'Success' }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      })
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