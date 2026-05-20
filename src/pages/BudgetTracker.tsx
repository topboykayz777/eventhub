"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { ArrowLeft, Plus, TrendingUp, TrendingDown, Loader2, Coins, Clock, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BudgetTracker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({ description: '', amount: '', type: 'expense' });

  useEffect(() => {
    fetchBudget();
    const channel = supabase.channel(`budget-realtime-${id}`).on('postgres_changes', { event: '*', schema: 'public', table: 'budget_items', filter: `event_id=eq.${id}` }, () => fetchBudget()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id]);

  const fetchBudget = async () => {
    const { data, error } = await supabase.from('budget_items').select('*').eq('event_id', id).order('created_at', { ascending: false });
    if (error) showError(error.message);
    else setItems(data || []);
    setLoading(false);
  };

  const handleApprove = async (itemId: string) => {
    const { error } = await supabase.from('budget_items').update({ status: 'approved' }).eq('id', itemId);
    if (error) showError(error.message);
    else showSuccess("Spray Approved! Vibe Screen Triggered.");
  };

  const handleDecline = async (itemId: string) => {
    if (!confirm("Are you sure you want to decline this spray?")) return;
    const { error } = await supabase.from('budget_items').delete().eq('id', itemId);
    if (error) showError(error.message);
    else showSuccess("Spray removed.");
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.description || !newItem.amount) return;
    const { error } = await supabase.from('budget_items').insert({
      event_id: id,
      description: newItem.description,
      amount: parseFloat(newItem.amount),
      type: newItem.type,
      status: 'approved'
    });
    if (error) showError(error.message);
    else {
      showSuccess('Entry recorded.');
      setNewItem({ description: '', amount: '', type: 'expense' });
    }
  };

  const exportLedger = () => {
    window.print();
    showSuccess("Preparing ledger for export...");
  };

  const pendingSprays = items.filter(i => i.status === 'pending');
  const approvedItems = items.filter(i => i.status === 'approved');
  
  const totalIncome = approvedItems.filter(i => i.type === 'income').reduce((acc, i) => acc + i.amount, 0);
  const totalExpense = approvedItems.filter(i => i.type === 'expense').reduce((acc, i) => acc + i.amount, 0);
  const digitalSpray = approvedItems.filter(i => i.description.includes('Digital Spray')).reduce((acc, i) => acc + i.amount, 0);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-background"><Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" /></div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="max-w-6xl mx-auto py-24 px-6 print:py-0 print:px-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 print:hidden">
          <div className="space-y-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-[#D4AF37] p-0 group flex items-center gap-2">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </Button>
            <div>
              <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] block mb-2">Financial Suite</span>
              <h1 className="text-4xl md:text-6xl font-serif italic leading-tight">The <span className="text-[#D4AF37]">Ledger</span></h1>
            </div>
          </div>
          <Button onClick={exportLedger} className="h-16 bg-card border border-border text-foreground rounded-2xl px-8 text-[11px] font-black uppercase tracking-widest hover:bg-muted transition-all shadow-sm">
            <FileText className="w-4 h-4 mr-3 text-[#D4AF37]" /> Export Ledger
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16 print:text-black">
          <div className="p-10 bg-card border border-border rounded-[2.5rem] shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <TrendingUp className="text-green-500 w-5 h-5" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total Income</span>
            </div>
            <div className="text-3xl font-serif italic">₦{totalIncome.toLocaleString()}</div>
          </div>
          <div className="p-10 bg-card border border-border rounded-[2.5rem] shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <TrendingDown className="text-red-500 w-5 h-5" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total Expenses</span>
            </div>
            <div className="text-3xl font-serif italic">₦{totalExpense.toLocaleString()}</div>
          </div>
          <div className="p-10 bg-[#D4AF37] border-none rounded-[2.5rem] shadow-xl text-black">
            <div className="flex items-center gap-4 mb-4">
              <Coins className="text-black/60 w-5 h-5" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/60">Digital Spray Profit</span>
            </div>
            <div className="text-3xl font-serif italic">₦{digitalSpray.toLocaleString()}</div>
          </div>
        </div>

        <AnimatePresence>
          {pendingSprays.length > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-20 print:hidden">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-amber-500">Verification Pending ({pendingSprays.length})</h2>
              </div>
              <div className="grid gap-4">
                {pendingSprays.map((spray) => (
                  <div key={spray.id} className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-8 w-full md:w-auto">
                      <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
                        <Clock className="text-amber-500 w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-serif italic text-foreground mb-1">{spray.description}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500/70">Verify Transfer from: {spray.alert_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 w-full md:w-auto justify-between border-t md:border-t-0 border-amber-500/10 pt-6 md:pt-0">
                      <div className="text-3xl font-serif italic text-foreground">₦{spray.amount.toLocaleString()}</div>
                      <div className="flex gap-4">
                        <Button onClick={() => handleApprove(spray.id)} className="bg-amber-500 hover:bg-amber-600 text-black rounded-xl px-10 h-14 text-[10px] font-black uppercase tracking-widest shadow-lg">Verify</Button>
                        <Button onClick={() => handleDecline(spray.id)} variant="ghost" className="text-red-500 hover:bg-red-500/10 rounded-xl h-14 px-4"><XCircle size={24} /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-card border border-border rounded-[3rem] overflow-hidden shadow-sm mb-12">
          <div className="p-8 bg-muted/20 border-b border-border">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground">Record New Entry</h2>
          </div>
          <div className="p-10">
            <form onSubmit={addItem} className="grid lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-5 space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Transaction Label</label>
                <Input className="h-16 bg-background border-border rounded-[1.2rem] text-lg font-light focus:ring-[#D4AF37]/30" placeholder="e.g. Venue Deposit, Vendor Fee..." value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
              </div>
              <div className="lg:col-span-3 space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Amount (₦)</label>
                <Input type="number" className="h-16 bg-background border-border rounded-[1.2rem] text-lg font-light focus:ring-[#D4AF37]/30" placeholder="0.00" value={newItem.amount} onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })} />
              </div>
              <div className="lg:col-span-2 space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Cash Flow</label>
                <Select onValueChange={(v) => setNewItem({ ...newItem, type: v })} defaultValue="expense">
                  <SelectTrigger className="h-16 bg-background border-border rounded-[1.2rem] font-bold text-[10px] uppercase tracking-widest">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border rounded-xl">
                    <SelectItem value="income" className="font-bold text-[10px] uppercase tracking-widest">Income</SelectItem>
                    <SelectItem value="expense" className="font-bold text-[10px] uppercase tracking-widest">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="lg:col-span-2">
                <Button type="submit" className="w-full h-16 bg-[#D4AF37] text-black rounded-[1.2rem] hover:bg-[#B8860B] shadow-lg">
                  <Plus size={24} />
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground/50 block ml-8 mb-8">Transaction Archive</span>
          {approvedItems.map((item) => (
            <div key={item.id} className="group p-8 border-b border-border/50 flex flex-col md:flex-row justify-between items-center gap-6 hover:bg-muted/10 transition-colors">
              <div className="flex items-center gap-8 w-full md:w-auto">
                <div className={`w-3 h-3 rounded-full ${item.type === 'income' ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,44,44,0.3)]'}`} />
                <div>
                  <p className="text-xl font-light text-foreground">{item.description}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{new Date(item.created_at).toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <div className={`text-2xl font-serif italic ${item.type === 'income' ? 'text-green-500' : 'text-foreground opacity-60'}`}>
                {item.type === 'income' ? '+' : '-'} ₦{item.amount.toLocaleString()}
              </div>
            </div>
          ))}
          {approvedItems.length === 0 && (
            <div className="text-center py-40 border-2 border-dashed border-border rounded-[3rem]">
               <FileText className="w-12 h-12 text-muted-foreground/20 mx-auto mb-6" />
               <p className="text-muted-foreground font-light italic">The ledger is currently blank.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;