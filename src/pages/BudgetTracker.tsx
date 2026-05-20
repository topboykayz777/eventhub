"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GlassCard from '@/components/ui/GlassCard';
import { showSuccess, showError } from '@/utils/toast';
import { ArrowLeft, Plus, Trash2, TrendingUp, TrendingDown, Wallet, Loader2, Coins, CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';
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

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f]"><Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" /></div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto py-24 px-6 print:py-0 print:px-0">
        <div className="flex justify-between items-center mb-16 print:hidden">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-[#D4AF37] p-0"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
          <div className="flex items-center gap-8">
            <Button onClick={exportLedger} variant="outline" className="border-white/10 bg-white/5 rounded-xl px-6 py-4 text-[10px] font-black uppercase tracking-widest"><FileText className="w-4 h-4 mr-3 text-[#D4AF37]" /> Export Ledger</Button>
            <div className="text-right">
              <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.4em] block mb-2">Financial Suite</span>
              <h1 className="text-4xl font-serif italic">The Ledger</h1>
            </div>
          </div>
        </div>

        <div className="hidden print:block mb-12 border-b border-black pb-8">
           <h1 className="text-4xl font-serif text-black uppercase tracking-widest"> Celebration Financial Statement</h1>
           <p className="text-gray-500 mt-2">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        <AnimatePresence>
          {pendingSprays.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-16 print:hidden">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500">Pending Approvals ({pendingSprays.length})</h2>
              </div>
              <div className="space-y-4">
                {pendingSprays.map((spray) => (
                  <GlassCard key={spray.id} className="p-8 border-amber-500/20 bg-amber-500/5">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center"><Clock className="text-amber-500 w-6 h-6" /></div>
                        <div>
                          <p className="text-lg font-serif italic text-white">{spray.description}</p>
                          <p className="text-[8px] font-bold uppercase tracking-widest text-amber-500/70">Look for alert from: {spray.alert_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-3xl font-serif italic text-white">₦{spray.amount.toLocaleString()}</div>
                        <div className="flex gap-3">
                          <Button onClick={() => handleApprove(spray.id)} className="bg-green-500 hover:bg-green-600 text-white rounded-none px-6 h-12 text-[8px] font-black uppercase tracking-widest">Approve</Button>
                          <Button onClick={() => handleDecline(spray.id)} variant="ghost" className="text-red-500 hover:bg-red-500/10 rounded-none px-6 h-12 text-[8px] font-black uppercase tracking-widest">Decline</Button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-3 gap-6 mb-16 print:text-black">
          <GlassCard className="p-8 border-white/5 print:border-black" hover={false}>
            <div className="flex items-center gap-4 mb-4"><TrendingUp className="text-green-500 w-4 h-4" /><span className="text-[8px] font-bold uppercase tracking-widest text-gray-500 print:text-gray-800">Total Income</span></div>
            <div className="text-2xl font-serif italic print:text-black">₦{totalIncome.toLocaleString()}</div>
          </GlassCard>
          <GlassCard className="p-8 border-white/5 print:border-black" hover={false}>
            <div className="flex items-center gap-4 mb-4"><TrendingDown className="text-red-500 w-4 h-4" /><span className="text-[8px] font-bold uppercase tracking-widest text-gray-500 print:text-gray-800">Total Expenses</span></div>
            <div className="text-2xl font-serif italic print:text-black">₦{totalExpense.toLocaleString()}</div>
          </GlassCard>
          <GlassCard className="p-8 bg-[#D4AF37] border-none print:border-black print:bg-white" hover={false}>
            <div className="flex items-center gap-4 mb-4"><Coins className="text-black w-4 h-4" /><span className="text-[8px] font-bold uppercase tracking-widest text-black/60">Digital Spray</span></div>
            <div className="text-2xl font-serif italic text-black">₦{digitalSpray.toLocaleString()}</div>
          </GlassCard>
        </div>

        <GlassCard className="p-10 mb-16 border-white/5 print:hidden">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-8">Record New Transaction</h2>
          <form onSubmit={addItem} className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-2"><Input className="h-14 bg-white/5 border-white/10 rounded-none" placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} /></div>
            <div><Input type="number" className="h-14 bg-white/5 border-white/10 rounded-none" placeholder="Amount" value={newItem.amount} onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })} /></div>
            <div className="flex gap-4">
              <Select onValueChange={(v) => setNewItem({ ...newItem, type: v })} defaultValue="expense">
                <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-none"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white"><SelectItem value="income">Income</SelectItem><SelectItem value="expense">Expense</SelectItem></SelectContent>
              </Select>
              <Button type="submit" className="h-14 w-14 bg-[#D4AF37] text-black rounded-none shrink-0"><Plus /></Button>
            </div>
          </form>
        </GlassCard>

        <div className="space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 px-8 block mb-6 print:text-black print:px-0">Transaction History</span>
          {approvedItems.map((item) => (
            <GlassCard key={item.id} className="p-8 border-white/5 group print:border-b print:border-black print:rounded-none">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className={`w-2 h-2 rounded-full ${item.type === 'income' ? 'bg-green-500' : 'bg-red-500'} print:hidden`} />
                  <div>
                    <p className="text-lg font-light text-white print:text-black">{item.description}</p>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-gray-600 print:text-gray-400">{new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={`text-xl font-serif italic ${item.type === 'income' ? 'text-green-500' : 'text-white'} print:text-black`}>
                  {item.type === 'income' ? '+' : '-'} ₦{item.amount.toLocaleString()}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;