"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { LogOut, User, Menu } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    }
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <motion.nav 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#0f0f0f]/90 backdrop-blur-md text-white py-6 px-8 sticky top-0 z-50 border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 border border-[#D4AF37] flex items-center justify-center rotate-45 group-hover:rotate-0 transition-transform duration-500">
            <span className="text-[#D4AF37] font-serif text-xl -rotate-45 group-hover:rotate-0 transition-transform duration-500">E</span>
          </div>
          <span className="text-lg font-light tracking-[0.3em] uppercase">Event Hub <span className="text-[#D4AF37]">NG</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-12">
          <Link to="/vendors" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-[#D4AF37] transition-colors">The Directory</Link>
          {session ? (
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-[#D4AF37] transition-colors">Dashboard</Link>
              <button 
                onClick={handleLogout}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] hover:opacity-70 transition-opacity flex items-center gap-2"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              <Link to="/login" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-[#D4AF37] transition-colors">Sign In</Link>
              <Link to="/signup">
                <Button className="bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none px-8 py-6 text-[10px] font-bold tracking-[0.2em] uppercase">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        <Button variant="ghost" className="md:hidden text-white">
          <Menu size={20} />
        </Button>
      </div>
    </motion.nav>
  );
};

export default Navbar;