"use client";

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Menu, X, UserCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    }
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Directory', path: '/vendors' },
    ...(session ? [{ name: 'Dashboard', path: '/dashboard' }] : []),
  ];

  return (
    <>
      <motion.nav 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0f0f0f]/95 backdrop-blur-md shadow-lg' 
            : 'bg-[#0f0f0f]/90 backdrop-blur-md'
        } text-white border-b border-white/5`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 md:px-6 md:py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2 md:gap-3 group">
            <div className="w-8 h-8 md:w-10 md:h-10 border border-[#D4AF37] flex items-center justify-center rotate-45 group-hover:rotate-0 transition-transform duration-500">
              <span className="text-[#D4AF37] font-serif text-sm md:text-base -rotate-45 group-hover:rotate-0 transition-transform duration-500">E</span>
            </div>
            <span className="text-xs md:text-sm lg:text-lg font-light tracking-[0.15em] md:tracking-[0.2em] lg:tracking-[0.3em] uppercase">
              Event Hub <span className="text-[#D4AF37]">NG</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className="text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] hover:text-[#D4AF37] transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            {session ? (
              <div className="flex items-center gap-4 lg:gap-8">
                <Link to="/profile" className="text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                  <UserCircle size={16} /> Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-[#D4AF37] hover:opacity-70 transition-opacity"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 lg:gap-8">
                <Link to="/login" className="text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] hover:text-[#D4AF37] transition-colors">
                  Sign In
                </Link>
                <Link to="/signup">
                  <Button className="bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 text-[9px] md:text-[10px] lg:text-xs font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            className="md:hidden text-white p-1.5"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={22} />
          </Button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-[#0f0f0f] flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-[#D4AF37] flex items-center justify-center rotate-45">
                  <span className="text-[#D4AF37] font-serif text-sm -rotate-45">E</span>
                </div>
                <span className="text-sm font-light tracking-[0.2em] uppercase">Event Hub <span className="text-[#D4AF37]">NG</span></span>
              </div>
              <Button 
                variant="ghost" 
                className="text-white p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <X size={24} />
              </Button>
            </div>

            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-serif italic text-white hover:text-[#D4AF37] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              
              {session ? (
                <>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-2xl font-serif italic text-white hover:text-[#D4AF37] transition-colors"
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-2xl font-serif italic text-[#D4AF37] text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-6 pt-8 border-t border-white/5">
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-bold uppercase tracking-[0.2em] text-white"
                  >
                    Sign In
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none py-4 text-xs font-bold tracking-[0.2em] uppercase">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-auto text-center pb-4">
              <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em]">© 2026 Event Hub Nigeria</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;