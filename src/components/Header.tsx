"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ThemeToggle } from './ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const navigate = useNavigate();
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-8 flex h-20 items-center justify-between">
        <Link to="/" className="text-xl md:text-2xl font-serif italic tracking-tighter">
          Vibe<span className="text-[#D4AF37]">Registry</span>
        </Link>

        <nav className="flex items-center gap-4">
          <ThemeToggle />
          
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 border border-black/5 dark:border-white/10">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 rounded-[1.5rem] p-2 bg-white dark:bg-[#1a1a1a] border-black/5 dark:border-white/10 shadow-2xl">
                <DropdownMenuItem onClick={() => navigate('/dashboard')} className="rounded-xl py-3 px-4 cursor-pointer focus:bg-black/5 dark:focus:bg-white/5 font-bold uppercase text-[10px] tracking-widest">
                  Command Center
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')} className="rounded-xl py-3 px-4 cursor-pointer focus:bg-black/5 dark:focus:bg-white/5 font-bold uppercase text-[10px] tracking-widest">
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="rounded-xl py-3 px-4 cursor-pointer focus:bg-red-500/10 text-red-500 font-bold uppercase text-[10px] tracking-widest">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate('/login')} className="bg-black dark:bg-white text-white dark:text-black rounded-full px-8 font-bold uppercase text-[10px] tracking-widest py-6 h-auto">
              Get Started
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;