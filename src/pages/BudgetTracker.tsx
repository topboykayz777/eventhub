"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { ArrowLeft, Plus, Trash2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

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
      showSuccess('Item added!');
      setNewItem({ description: '', amount: '', type: 'expense' });
      fetchBudget();
    }
  };

  const deleteItem = async (itemId: string) => {
    const { error } = await supabase.from('budget_items').delete().eq('id', itemId);
    if (error) showError(error.message);
    else {
      showSuccess('Item removed');
      fetchBudget();
    }
  };

  const totalIncome = items.filter(i => i.type === 'income').reduce((acc, i) => acc + i.amount, 0);
  const totalExpense = items.filter(i => i.type === 'expense').reduce((acc, i) => acc + i.amount, 0);
  const balance = totalIncome - totalExpense;

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-green-500 w-5 h-5" />
              <span className="text-gray-500 text-sm uppercase font-bold">Total Income</span>
            </div>
            <div className="text-2xl font-black text-[#1a1a2e]">₦{totalIncome.toLocaleString()}</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="text-red-500 w-5 h-5" />
              <span className="text-gray-500 text-sm uppercase font-bold">Total Expenses</span>
            </div>
            <div className="text-2xl font-black text-[#1a1a2e]">₦{totalExpense.toLocaleString()}</div>
          </div>
          <div className="bg-[#1a1a2e] p-6 rounded-3xl shadow-lg text-white">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="text-[#e94560] w-5 h-5" />
              <span className="text-gray-400 text-sm uppercase font-bold">Balance</span>
            </div>
            <div className="text-2xl font-black">₦{balance.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-8">
          <h2 className="text-xl font-bold mb-6">Add New Entry</h2>
          <form onSubmit={addItem} className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input 
                placeholder="Description (e.g. Catering Deposit)" 
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              />
            </div>
            <div>
              <Input 
                type="number" 
                placeholder="Amount" 
                value={newItem.amount}
                onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Select onValueChange={(v) => setNewItem({ ...newItem, type: v })} defaultValue="expense">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="bg-[#e94560] hover:bg-[#d43d56]">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 text-sm font-bold text-gray-500 uppercase">Description</th>
                <th className="text-left p-4 text-sm font-bold text-gray-500 uppercase">Type</th>
                <th className="text-right p-4 text-sm font-bold text-gray-500 uppercase">Amount</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium">{item.description}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${item.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className={`p-4 text-right font-bold ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.type === 'income' ? '+' : '-'}₦{item.amount.toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => deleteItem(item.id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-400 italic">No entries yet. Start tracking your budget!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;