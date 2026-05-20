"use client";

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Sun, Moon, Menu, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { showSuccess } from '@/utils/toast';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = React.useState<any>(null);
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('light', savedTheme === 'light');

    return () => subscription.unsubscribe();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
    showSuccess(`Switched to ${newTheme} mode`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
    showSuccess("Logged out successfully");
  };

  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  if (isAuthPage) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 dark:bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          onClick={() => navigate('/')} 
          className="text-xl font-serif italic text-white cursor-pointer hover:opacity-80 transition-opacity"
        >
          Celebration<span className="text-[#D4AF37]">Concierge</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={toggleTheme}
            className="p-3 bg-white/5 border border-white/10 rounded-2xl text-[#D4AF37] hover:bg-white/10 transition-all"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/profile')}
                className="text-white hover:text-[#D4AF37] hover:bg-white/5 rounded-xl px-4"
              >
                <User size={18} className="mr-2" /> Profile
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-xl px-4"
              >
                <LogOut size={18} className="mr-2" /> Logout
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => navigate('/login')}
              className="bg-[#D4AF37] hover:bg-[#B8962E] text-black font-bold uppercase tracking-widest text-[10px] px-8 rounded-xl"
            >
              Access Portal
            </Button>
          )}
        </div>

        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleTheme} className="text-[#D4AF37]"><Sun size={20} /></button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-b border-white/10 p-6 flex flex-col gap-4">
          {user ? (
            <>
              <Button variant="ghost" onClick={() => { navigate('/profile'); setIsMenuOpen(false); }} className="w-full justify-start text-white"><User size={18} className="mr-3" /> Profile</Button>
              <Button variant="ghost" onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full justify-start text-red-400"><LogOut size={18} className="mr-3" /> Logout</Button>
            </>
          ) : (
            <Button onClick={() => { navigate('/login'); setIsMenuOpen(false); }} className="w-full bg-[#D4AF37] text-black">Access Portal</Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;