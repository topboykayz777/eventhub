"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Calendar, LogOut, User, Menu } from 'lucide-react';
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
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-[#1a1a2e]/80 backdrop-blur-xl text-white py-4 px-6 sticky top-0 z-50 border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tighter">
          <div className="bg-[#e94560] p-1.5 rounded-lg">
            <Calendar className="text-white w-6 h-6" />
          </div>
          <span>EVENT HUB <span className="text-[#e94560]">NG</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/vendors" className="text-sm font-bold uppercase tracking-widest hover:text-[#e94560] transition-colors">Vendors</Link>
          {session ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" className="text-white hover:text-[#e94560] font-bold">DASHBOARD</Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-[#e94560] text-[#e94560] hover:bg-[#e94560] hover:text-white rounded-xl font-bold"
              >
                <LogOut className="w-4 h-4 mr-2" />
                LOGOUT
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:text-[#e94560] font-bold">LOGIN</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#e94560] hover:bg-[#d43d56] text-white rounded-xl px-6 font-bold shadow-lg shadow-[#e94560]/20">
                  GET STARTED
                </Button>
              </Link>
            </div>
          )}
        </div>

        <Button variant="ghost" className="md:hidden text-white">
          <Menu />
        </Button>
      </div>
    </motion.nav>
  );
};

export default Navbar;