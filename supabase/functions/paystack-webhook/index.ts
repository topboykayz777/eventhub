// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper to verify Paystack signature using native Deno crypto
async function verifySignature(body: string, signature: string, secret: string) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  const bodyData = encoder.encode(body);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, bodyData);
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex === signature;
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

    const signature = req.headers.get('x-paystack-signature');
    const bodyText = await req.text();
    
    console.log("[paystack-webhook] Received event. Verifying signature...");

    const isValid = await verifySignature(bodyText, signature || '', paystackSecret);

    if (!isValid) {
      console.error("[paystack-webhook] Signature mismatch. Check your PAYSTACK_SECRET_KEY.");
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const body = JSON.parse(bodyText);
    console.log("[paystack-webhook] Event Type:", body.event);

    if (body.event === 'charge.success') {
      const data = body.data;
      let metadata = data.metadata || {};
      
      // Paystack often wraps metadata in custom_fields
      if (metadata.custom_fields && Array.isArray(metadata.custom_fields)) {
        metadata.custom_fields.forEach(field => {
          metadata[field.variable_name] = field.value;
        });
      }

      const event_id = metadata.event_id;
      const payment_type = metadata.payment_type;
      const guest_name = metadata.guest_name;
      const plan = metadata.plan;
      const amount = data.amount / 100;

      console.log("[paystack-webhook] Metadata Extracted:", { event_id, payment_type, amount });

      if (payment_type === 'gift' && event_id) {
        console.log(`[paystack-webhook] Recording Digital Spray: ₦${amount} for event ${event_id}`);
        
        // Insert into budget_items
        const { error: insertError } = await supabase.from('budget_items').insert({
          event_id,
          description: `Digital Spray from ${guest_name || 'Anonymous Guest'}`,
          amount,
          type: 'income'
        });

        if (insertError) {
          console.error("[paystack-webhook] Database Insert Error:", insertError);
          throw insertError;
        }
        
        console.log("[paystack-webhook] Digital Spray recorded successfully.");
      } else if (event_id) {
        console.log(`[paystack-webhook] Activating event: ${event_id} with plan ${plan}`);
        const { error: updateError } = await supabase.from('events').update({ 
          is_paid: true, 
          plan: plan || 'Basic' 
        }).eq('id', event_id);
        
        if (updateError) {
          console.error("[paystack-webhook] Event Update Error:", updateError);
          throw updateError;
        }
      }
    }

    return new Response(JSON.stringify({ status: 'success' }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    });
  } catch (error) {
    console.error("[paystack-webhook] CRITICAL ERROR:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400 
    });
  }
})