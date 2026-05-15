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
    const geminiKey = Deno.env.get('GEMINI_API_KEY')!
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

    if (action === 'validate-receipt') {
      console.log("[event-security] Starting AI Receipt Validation...");
      
      // Call Gemini to analyze the receipt
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "You are a Nigerian Bank Receipt Validator. Analyze this image. Extract the following JSON: { 'amount': number, 'destination_account': string, 'session_id': string, 'is_authentic': boolean }. Look for common Nigerian bank patterns (GTB, Zenith, Kuda, Access, etc.). If it looks like a fake, edited receipt, or a screenshot of a balance instead of a success receipt, set is_authentic to false. Only return the JSON block." },
              { inline_data: { mime_type: "image/jpeg", data: payload.image } }
            ]
          }]
        })
      });

      const geminiData = await geminiResponse.json();
      const textResponse = geminiData.candidates[0].content.parts[0].text;
      const jsonMatch = textResponse.match(/\{.*\}/s);
      
      if (!jsonMatch) throw new Error("AI could not parse receipt structure.");
      const result = JSON.parse(jsonMatch[0]);

      if (!result.is_authentic) {
        return new Response(JSON.stringify({ error: "Receipt verification failed. Please upload a clear, original success receipt." }), { status: 400, headers: corsHeaders });
      }

      // Verify destination account matches host
      const { data: event } = await supabase.from('events').select('host_id').eq('id', payload.eventId).single();
      const { data: profile } = await supabase.from('profiles').select('account_number').eq('id', event.host_id).single();

      // Clean account numbers for comparison (remove leading zeros if necessary)
      const cleanResultAcc = result.destination_account?.replace(/\D/g, '');
      const cleanHostAcc = profile?.account_number?.replace(/\D/g, '');

      if (cleanResultAcc !== cleanHostAcc) {
        return new Response(JSON.stringify({ error: `This receipt is for account ${result.destination_account}, but the host's account is ${profile?.account_number}.` }), { status: 400, headers: corsHeaders });
      }

      // Check for duplicate session ID
      const { data: existing } = await supabase.from('budget_items').select('id').eq('receipt_session_id', result.session_id).maybeSingle();
      if (existing) {
        return new Response(JSON.stringify({ error: "This receipt has already been used for a spray." }), { status: 400, headers: corsHeaders });
      }

      return new Response(JSON.stringify({ 
        success: true, 
        amount: result.amount, 
        sessionId: result.session_id 
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Invalid Action' }), { status: 400, headers: corsHeaders })
  } catch (error) {
    console.error("[event-security] Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders })
  }
})