"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Calendar, LogOut, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

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
    <nav className="bg-[#1a1a2e] text-white py-4 px-6 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Calendar className="text-[#e94560]" />
          <span>Event Hub <span className="text-[#e94560]">Nigeria</span></span>
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" className="text-white hover:text-[#e94560]">Dashboard</Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-[#e94560] text-[#e94560] hover:bg-[#e94560] hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:text-[#e94560]">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#e94560] hover:bg-[#d43d56] text-white">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;