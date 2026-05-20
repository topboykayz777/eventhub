"use client";

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Menu, X, UserCircle, LogOut } from 'lucide-react';
import { useSession } from '@/components/SessionProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { showSuccess } from '@/utils/toast';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    showSuccess("Signed out successfully.");
    navigate('/');
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Directory', path: '/vendors' },
    { name: 'FAQ', path: '/faq' },
    ...(session ? [{ name: 'Dashboard', path: '/dashboard' }] : []),
  ];

  return (
    <>
      <motion.nav 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 h-20 md:h-24 flex items-center transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0f0f0f] shadow-2xl' 
            : 'bg-[#0f0f0f]/98 backdrop-blur-xl'
        } text-white border-b border-white/5`}
      >
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center px-4 md:px-6 lg:px-8">
          <Link to="/" onClick={handleHomeClick} className="flex items-center gap-3 md:gap-4 group">
            <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-[#D4AF37] flex items-center justify-center rotate-45 group-hover:rotate-0 transition-transform duration-500">
              <span className="text-[#D4AF37] font-serif text-lg md:text-xl -rotate-45 group-hover:rotate-0 transition-transform duration-500">E</span>
            </div>
            <span className="text-lg md:text-xl font-bold tracking-[0.2em] uppercase whitespace-nowrap">
              Event Hub <span className="text-[#D4AF37]">NG</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            <div className="flex items-center gap-6 mr-4">
              <ThemeToggle />
            </div>
            
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] hover:text-[#D4AF37] transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            {session ? (
              <div className="flex items-center gap-6 lg:gap-10">
                <Link to="/profile" className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                  <UserCircle size={18} /> Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] text-[#D4AF37] hover:opacity-70 transition-opacity flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6 lg:gap-10">
                <Link to="/login" className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] hover:text-[#D4AF37] transition-colors">
                  Sign In
                </Link>
                <Link to="/signup">
                  <Button className="bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none px-6 lg:px-8 py-5 text-[10px] font-black tracking-[0.3em] uppercase">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              className="text-white p-2"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={28} />
            </Button>
          </div>
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
            className="fixed inset-0 z-[60] bg-[#0f0f0f] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-16">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border-2 border-[#D4AF37] flex items-center justify-center rotate-45">
                  <span className="text-[#D4AF37] font-serif text-lg -rotate-45">E</span>
                </div>
                <span className="text-xl font-bold tracking-[0.1em] uppercase">Event Hub <span className="text-[#D4AF37]">NG</span></span>
              </div>
              <Button 
                variant="ghost" 
                className="text-white p-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <X size={36} />
              </Button>
            </div>

            <div className="flex flex-col gap-10">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-4xl font-serif italic text-white hover:text-[#D4AF37] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              
              {session ? (
                <>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-4xl font-serif italic text-white hover:text-[#D4AF37] transition-colors"
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-4xl font-serif italic text-[#D4AF37] text-left flex items-center gap-4"
                  >
                    <LogOut size={32} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-8 pt-10 border-t border-white/5">
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-2xl font-black uppercase tracking-[0.1em] text-white"
                  >
                    Sign In
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none py-8 text-xl font-black tracking-[0.1em] uppercase">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-auto text-center pb-6">
              <p className="text-sm text-gray-600 uppercase tracking-[0.3em]">© 2026 Event Hub Nigeria</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;