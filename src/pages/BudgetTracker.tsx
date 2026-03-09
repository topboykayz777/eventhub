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
import { ArrowLeft, Plus, Trash2, TrendingUp, TrendingDown, Wallet, PieChart, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const BudgetTracker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({ description: '', amount: '', type: 'expense' });

  useEffect(() => {
    fetchBudget();
  }, [id]);

  const fetchBudget = async () => {
    const { data, error } = await supabase
      .from('budget_items')
      .select('*')
      .eq('event_id', id)
      .order('created_at', { ascending: false });

    if (error) showError(error.message);
    else setItems(data || []);
    setLoading(false);
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.description || !newItem.amount) return;

    const { error } = await supabase.from('budget_items').insert({
      event_id: id,
      description: newItem.description,
      amount: parseFloat(newItem.amount),
      type: newItem.type
    });

    if (error) showError(error.message);
    else {
      showSuccess('Entry recorded in the ledger.');
      setNewItem({ description: '', amount: '', type: 'expense' });
      fetchBudget();
    }
  };

  const deleteItem = async (itemId: string) => {
    const { error } = await supabase.from('budget_items').delete().eq('id', itemId);
    if (error) showError(error.message);
    else {
      showSuccess('Entry removed.');
      fetchBudget();
    }
  };

  const totalIncome = items.filter(i => i.type === 'income').reduce((acc, i) => acc + i.amount, 0);
  const totalExpense = items.filter(i => i.type === 'expense').reduce((acc, i) => acc + i.amount, 0);
  const balance = totalIncome - totalExpense;

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-white">Loading Ledger...</div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4AF37]/5 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto py-24 px-6 relative z-10">
        <div className="flex justify-between items-center mb-16">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')} 
            className="text-gray-400 hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
          <div className="text-right">
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.4em] uppercase block mb-2">Financial Suite</span>
            <h1 className="text-4xl font-serif italic">The Ledger</h1>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <GlassCard className="p-10 border-white/5" hover={false}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="text-green-500 w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Total Income</span>
            </div>
            <div className="text-4xl font-serif italic text-white">₦{totalIncome.toLocaleString()}</div>
          </GlassCard>

          <GlassCard className="p-10 border-white/5" hover={false}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <TrendingDown className="text-red-500 w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Total Expenses</span>
            </div>
            <div className="text-4xl font-serif italic text-white">₦{totalExpense.toLocaleString()}</div>
          </GlassCard>

          <GlassCard className="p-10 bg-[#D4AF37] border-none" hover={false}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center">
                <Wallet className="text-black w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">Current Balance</span>
            </div>
            <div className="text-4xl font-serif italic text-black">₦{balance.toLocaleString()}</div>
          </GlassCard>
        </div>

        {/* Add Entry Form */}
        <GlassCard className="p-10 mb-16 border-white/5">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-8">Record New Transaction</h2>
          <form onSubmit={addItem} className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <Input 
                className="h-14 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50"
                placeholder="Description (e.g. Champagne Supply)" 
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              />
            </div>
            <div>
              <Input 
                type="number" 
                className="h-14 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50"
                placeholder="Amount" 
                value={newItem.amount}
                onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
              />
            </div>
            <div className="flex gap-4">
              <Select onValueChange={(v) => setNewItem({ ...newItem, type: v })} defaultValue="expense">
                <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="h-14 w-14 bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none shrink-0">
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </GlassCard>

        {/* Transactions Table */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-8 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">Recent Transactions</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">{items.length} Entries</span>
          </div>
          
          {items.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              key={item.id}
            >
              <GlassCard className="p-8 border-white/5 group" hover={true}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-6">
                    <div className={`w-2 h-2 rounded-full ${item.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="text-lg font-light tracking-wide text-white mb-1">{item.description}</p>
                      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500">
                        {new Date(item.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className={`text-xl font-serif italic ${item.type === 'income' ? 'text-green-500' : 'text-white'}`}>
                      {item.type === 'income' ? '+' : '-'} ₦{item.amount.toLocaleString()}
                    </div>
                    <button 
                      onClick={() => deleteItem(item.id)}
                      className="text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-32 border border-dashed border-white/10 rounded-[2rem]">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">The ledger is currently empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;