"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { Coins, Loader2, ShieldCheck, ArrowLeft, Upload, CheckCircle2, Copy, Landmark, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const SprayPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [hostProfile, setHostProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [receiptBase64, setReceiptBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchEventAndHost = async () => {
      const { data: eventData, error } = await supabase
        .from('events')
        .select('*')
        .ilike('slug', slug?.trim() || '')
        .maybeSingle();

      if (error || !eventData) {
        showError("Event not found.");
        navigate('/');
        return;
      }
      setEvent(eventData);

      const { data: profile } = await supabase
        .from('profiles')
        .select('bank_name, account_number, account_name')
        .eq('id', eventData.host_id)
        .single();
      
      setHostProfile(profile);
      setLoading(false);
    };
    fetchEventAndHost();
  }, [slug, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setReceiptBase64(base64String.split(',')[1]); // Remove data:image/jpeg;base64,
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showSuccess(`${label} copied.`);
  };

  const handleSpray = async () => {
    if (!receiptBase64) {
      showError("Please upload your transfer receipt.");
      fileInputRef.current?.click();
      return;
    }

    setValidating(true);
    try {
      const response = await fetch('https://vilknsbrvakthefsgfwg.supabase.co/functions/v1/event-security', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}`
        },
        body: JSON.stringify({ 
          action: 'validate-receipt', 
          payload: { 
            image: receiptBase64,
            eventId: event.id
          } 
        })
      });

      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || "Validation failed.");

      // If AI validates, record the spray in the ledger
      const { error: ledgerError } = await supabase.from('budget_items').insert({
        event_id: event.id,
        description: `Digital Spray from ${guestName || 'Anonymous Guest'}`,
        amount: result.amount,
        type: 'income',
        receipt_session_id: result.sessionId
      });

      if (ledgerError) throw ledgerError;

      confetti({ 
        particleCount: 200, 
        spread: 100, 
        origin: { y: 0.6 }, 
        colors: ['#D4AF37', '#ffffff', '#F9E4B7'] 
      });
      
      showSuccess(`Verified! ₦${result.amount.toLocaleString()} sprayed.`);
      setReceiptBase64(null);
      setFileName('');
      setGuestName('');
      
      // Small delay before redirecting back
      setTimeout(() => navigate(`/event/${event.slug}`), 3000);

    } catch (err: any) {
      showError(err.message);
    } finally {
      setValidating(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" /></div>;

  const isBankReady = hostProfile?.account_number && hostProfile?.bank_name;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-10">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-8">
            <Coins className="text-[#D4AF37] w-10 h-10" />
          </div>
          <h1 className="text-4xl font-serif italic mb-2">Digital Spray</h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest">For {event.event_name}</p>
        </div>

        {!isBankReady ? (
          <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 text-center space-y-6">
            <AlertCircle className="text-amber-500 w-12 h-12 mx-auto" />
            <h3 className="text-xl font-serif italic">Vault Not Configured</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              The host has not yet linked their bank account for digital spraying.
            </p>
            <Button variant="outline" onClick={() => navigate(`/event/${event.slug}`)} className="w-full border-white/10 text-white rounded-none py-6 text-[10px] font-bold uppercase tracking-widest">
              Go Back
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Step 1: Bank Details */}
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#D4AF37] text-black flex items-center justify-center text-[10px] font-black">1</div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Transfer to Host</span>
              </div>
              
              <div className="space-y-4">
                <div className="p-6 bg-black/40 border border-white/5 rounded-2xl group relative">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mb-1">Bank Name</p>
                  <p className="text-lg font-medium">{hostProfile.bank_name}</p>
                </div>
                
                <div 
                  className="p-6 bg-black/40 border border-white/5 rounded-2xl group relative cursor-pointer hover:border-[#D4AF37]/30 transition-all"
                  onClick={() => handleCopy(hostProfile.account_number, "Account Number")}
                >
                  <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mb-1">Account Number</p>
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-serif italic tracking-widest">{hostProfile.account_number}</p>
                    <Copy size={16} className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mb-1">Account Name</p>
                  <p className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider">{hostProfile.account_name}</p>
                </div>
              </div>
            </div>

            {/* Step 2: Upload & Verify */}
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-[#D4AF37]/20 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#D4AF37] text-black flex items-center justify-center text-[10px] font-black">2</div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">AI Verification</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Your Name (Optional)</Label>
                  <Input 
                    placeholder="e.g. David Adeleke" 
                    className="h-14 bg-white/5 border-white/10 rounded-none text-lg font-light" 
                    value={guestName} 
                    onChange={(e) => setGuestName(e.target.value)} 
                  />
                </div>

                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full h-20 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                      receiptBase64 ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 bg-white/5 hover:border-[#D4AF37]/30'
                    }`}
                  >
                    {receiptBase64 ? (
                      <>
                        <CheckCircle2 className="text-green-500 w-6 h-6" />
                        <span className="text-[8px] font-bold uppercase tracking-widest text-green-500">Receipt Attached</span>
                      </>
                    ) : (
                      <>
                        <Upload className="text-gray-500 w-6 h-6" />
                        <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Upload Success Receipt</span>
                      </>
                    )}
                  </Button>
                  {fileName && <p className="text-[7px] text-center mt-2 text-gray-600 uppercase tracking-widest truncate">{fileName}</p>}
                </div>

                <Button 
                  onClick={handleSpray}
                  disabled={validating}
                  className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all shadow-2xl shadow-[#D4AF37]/10"
                >
                  {validating ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      AI Analyzing Receipt...
                    </div>
                  ) : (
                    'Verify & Trigger Vibe'
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-gray-600 pt-2">
                <ShieldCheck size={14} className="text-[#D4AF37]" />
                <span className="text-[8px] font-bold uppercase tracking-widest">Instant AI Verification</span>
              </div>
            </div>
          </div>
        )}

        <button onClick={() => navigate(`/event/${event.slug}`)} className="w-full text-center text-gray-500 hover:text-[#D4AF37] transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <ArrowLeft size={12} /> Back to Event Page
        </button>
      </div>
    </div>
  );
};

export default SprayPage;