// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function verifySignature(body: string, signature: string, secret: string) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-512" }, false, ["sign"]);
  const bodyData = encoder.encode(body);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, bodyData);
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('') === signature;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const paystackSecret = Deno.env.get('PAYSTACK_SECRET_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const signature = req.headers.get('x-paystack-signature');
    const bodyText = await req.text();
    const isValid = await verifySignature(bodyText, signature || '', paystackSecret);

    if (!isValid) {
      console.error("[paystack-webhook] Invalid Signature");
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const body = JSON.parse(bodyText);
    console.log(`[paystack-webhook] Event: ${body.event}`);

    if (body.event === 'charge.success') {
      const data = body.data;
      const metadata = data.metadata || {};
      
      // Extract metadata from custom_fields if needed
      const getMeta = (key) => metadata[key] || metadata.custom_fields?.find(f => f.variable_name === key)?.value;

      const event_id = getMeta('event_id');
      const payment_type = getMeta('payment_type');
      const guest_name = getMeta('guest_name');
      const plan = getMeta('plan');
      const amount = data.amount / 100;

      if (payment_type === 'gift' && event_id) {
        console.log(`[paystack-webhook] Recording Spray: ₦${amount} for ${event_id}`);
        const { error } = await supabase.from('budget_items').insert({
          event_id,
          description: `Digital Spray from ${guest_name || 'Anonymous Guest'}`,
          amount,
          type: 'income'
        });
        if (error) console.error("[paystack-webhook] Ledger Error:", error);
      } else if (event_id) {
        console.log(`[paystack-webhook] Activating Event: ${event_id}`);
        await supabase.from('events').update({ is_paid: true, plan: plan || 'Basic' }).eq('id', event_id);
      }
    }

    return new Response(JSON.stringify({ status: 'success' }), { headers: corsHeaders, status: 200 });
  } catch (error) {
    console.error("[paystack-webhook] Critical Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 400 });
  }
})