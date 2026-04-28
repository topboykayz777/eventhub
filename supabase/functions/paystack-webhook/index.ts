// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import { crypto } from "https://deno.land/std@0.177.0/node/crypto.ts";

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
    const paystackSecret = Deno.env.get('PAYSTACK_SECRET_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Verify Signature (Security)
    const signature = req.headers.get('x-paystack-signature');
    const bodyText = await req.text();
    
    const hash = crypto
      .createHmac('sha512', paystackSecret)
      .update(bodyText)
      .digest('hex');

    if (hash !== signature) {
      console.error("[paystack-webhook] Invalid signature detected.");
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const body = JSON.parse(bodyText);
    console.log("[paystack-webhook] Verified event:", body.event);

    if (body.event === 'charge.success') {
      const data = body.data;
      let metadata = data.metadata || {};
      
      // Handle Paystack's custom fields array if present
      if (metadata.custom_fields) {
        metadata.custom_fields.forEach(field => {
          metadata[field.variable_name] = field.value;
        });
      }

      const event_id = metadata.event_id;
      const payment_type = metadata.payment_type;
      const guest_name = metadata.guest_name;
      const plan = metadata.plan;
      const amount = data.amount / 100;

      if (payment_type === 'gift' && event_id) {
        console.log(`[paystack-webhook] Recording gift: ₦${amount} for event ${event_id}`);
        const { error } = await supabase.from('budget_items').insert({
          event_id,
          description: `Digital Spray from ${guest_name || 'Anonymous Guest'}`,
          amount,
          type: 'income'
        });
        if (error) throw error;
      } else if (event_id) {
        console.log(`[paystack-webhook] Activating event: ${event_id} with plan ${plan}`);
        const { error } = await supabase.from('events').update({ 
          is_paid: true, 
          plan: plan || 'Basic' 
        }).eq('id', event_id);
        if (error) throw error;
      }
    }

    return new Response(JSON.stringify({ status: 'success' }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    });
  } catch (error) {
    console.error("[paystack-webhook] Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400 
    });
  }
})