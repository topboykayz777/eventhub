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
      <div className="max-w-5xl mx-auto py-24 px-6 print:py-0 print:px-0">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 print:hidden">
          <div className="space-y-2">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-[#D4AF37] p-0 group flex items-center gap-2 mb-4">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </Button>
            <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] block">Financial Suite</span>
            <h1 className="text-4xl md:text-6xl font-serif italic leading-tight">The Ledger</h1>
          </div>
          <Button onClick={exportLedger} variant="outline" className="h-14 bg-card border-border text-foreground rounded-2xl px-8 text-[11px] font-black uppercase tracking-widest hover:bg-muted transition-all">
            <FileText className="w-4 h-4 mr-3" /> Export Ledger
          </Button>
        </div>

        {/* Stats Summary - Simplified Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-16 print:text-black">
          <div className="p-6 md:p-10 bg-card border border-border rounded-2xl md:rounded-[2.5rem] shadow-sm">
            <TrendingUp className="text-green-500 w-5 h-5 mb-4" />
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Total Income</p>
            <div className="text-2xl md:text-3xl font-serif italic">₦{totalIncome.toLocaleString()}</div>
          </div>
          <div className="p-6 md:p-10 bg-card border border-border rounded-2xl md:rounded-[2.5rem] shadow-sm">
            <TrendingDown className="text-red-500 w-5 h-5 mb-4" />
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Total Expenses</p>
            <div className="text-2xl md:text-3xl font-serif italic">₦{totalExpense.toLocaleString()}</div>
          </div>
          <div className="p-6 md:p-10 bg-[#D4AF37] border-none rounded-2xl md:rounded-[2.5rem] shadow-xl text-black col-span-2 md:col-span-1">
            <Coins className="text-black/60 w-5 h-5 mb-4" />
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-black/60 mb-1">Spray Profit</p>
            <div className="text-2xl md:text-3xl font-serif italic">₦{digitalSpray.toLocaleString()}</div>
          </div>
        </div>

        {/* Pending Section - Free list */}
        <AnimatePresence>
          {pendingSprays.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-20 print:hidden">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-amber-500">Awaiting Verification ({pendingSprays.length})</h2>
              </div>
              <div className="space-y-2">
                {pendingSprays.map((spray) => (
                  <div key={spray.id} className="p-6 md:p-8 border border-amber-500/20 bg-amber-500/5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                        <Clock className="text-amber-500 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xl md:text-2xl font-serif italic text-foreground truncate">{spray.description}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-amber-500/60">From: {spray.alert_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 w-full md:w-auto justify-between border-t md:border-t-0 border-amber-500/10 pt-4 md:pt-0">
                      <div className="text-2xl font-serif italic text-foreground">₦{spray.amount.toLocaleString()}</div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleApprove(spray.id)} className="bg-amber-500 hover:bg-amber-600 text-black rounded-xl px-8 h-12 text-[9px] font-black uppercase tracking-widest">Verify</Button>
                        <button onClick={() => handleDecline(spray.id)} className="text-red-500/50 hover:text-red-500 transition-colors px-2">
                          <XCircle size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Record Entry Form - Simplified */}
        <div className="mb-20">
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground mb-8 ml-2">Record New Entry</h2>
          <form onSubmit={addItem} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-5 space-y-2">
              <Input className="h-14 bg-card border-border rounded-xl text-base font-light focus:ring-[#D4AF37]/30" placeholder="Transaction Label" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
            </div>
            <div className="md:col-span-3 space-y-2">
              <Input type="number" className="h-14 bg-card border-border rounded-xl text-base font-light focus:ring-[#D4AF37]/30" placeholder="Amount (₦)" value={newItem.amount} onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Select onValueChange={(v) => setNewItem({ ...newItem, type: v })} defaultValue="expense">
                <SelectTrigger className="h-14 bg-card border-border rounded-xl font-bold text-[9px] uppercase tracking-widest">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border rounded-xl">
                  <SelectItem value="income" className="font-bold text-[9px] uppercase tracking-widest">Income</SelectItem>
                  <SelectItem value="expense" className="font-bold text-[9px] uppercase tracking-widest">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full h-14 bg-[#D4AF37] text-black rounded-xl hover:bg-[#B8860B] shadow-md">
                <Plus size={20} />
              </Button>
            </div>
          </form>
        </div>

        {/* Transaction List - Free standing */}
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 block ml-4 mb-6">Archive</span>
          {approvedItems.map((item) => (
            <div key={item.id} className="group p-6 md:p-8 border-b border-border/40 flex items-center justify-between hover:bg-muted/10 transition-colors">
              <div className="flex items-center gap-6">
                <div className={`w-2.5 h-2.5 rounded-full ${item.type === 'income' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,44,44,0.2)]'}`} />
                <div>
                  <p className="text-lg md:text-xl font-light text-foreground">{item.description}</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">{new Date(item.created_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <div className={`text-xl md:text-2xl font-serif italic ${item.type === 'income' ? 'text-green-500' : 'text-foreground opacity-40'}`}>
                {item.type === 'income' ? '+' : '-'} ₦{item.amount.toLocaleString()}
              </div>
            </div>
          ))}
          
          {approvedItems.length === 0 && (
            <div className="text-center py-40 border border-dashed border-border rounded-[2.5rem]">
               <FileText className="w-10 h-10 text-muted-foreground/10 mx-auto mb-4" />
               <p className="text-muted-foreground text-sm font-light italic">The ledger is currently clear.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;