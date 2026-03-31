"use client";

import React, { useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, Check } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'host' | 'vendor'>('host');

  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Update profile with selected role
        await supabase.from('profiles').update({ role }).eq('id', session.user.id);
        navigate(role === 'host' ? '/dashboard' : '/vendor-dashboard');
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate, role]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <div className="max-w-md mx-auto mt-20 p-10 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif italic mb-4">Join the Elite</h1>
          <p className="text-gray-500 text-sm tracking-wide">Select your account type to begin.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <button 
            onClick={() => setRole('host')}
            className={`relative p-6 border-2 transition-all text-left group ${role === 'host' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/5 hover:border-white/20'}`}
          >
            <User className={`mb-4 ${role === 'host' ? 'text-[#D4AF37]' : 'text-gray-600'}`} />
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Host</p>
            <p className="text-[8px] text-gray-500 uppercase">Plan Events</p>
            {role === 'host' && <div className="absolute top-2 right-2 text-[#D4AF37]"><Check size={12} /></div>}
          </button>

          <button 
            onClick={() => setRole('vendor')}
            className={`relative p-6 border-2 transition-all text-left group ${role === 'vendor' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/5 hover:border-white/20'}`}
          >
            <Briefcase className={`mb-4 ${role === 'vendor' ? 'text-[#D4AF37]' : 'text-gray-600'}`} />
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Vendor</p>
            <p className="text-[8px] text-gray-500 uppercase">List Services</p>
            {role === 'vendor' && <div className="absolute top-2 right-2 text-[#D4AF37]"><Check size={12} /></div>}
          </button>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#D4AF37',
                  brandAccent: '#B8860B',
                  inputBackground: 'transparent',
                  inputText: 'white',
                  inputBorder: 'rgba(255,255,255,0.1)',
                }
              }
            }
          }}
          theme="dark"
          providers={[]}
          view="sign_up"
          redirectTo={window.location.origin + (role === 'host' ? '/dashboard' : '/vendor-dashboard')}
        />
      </div>
    </div>
  );
};

export default Signup;