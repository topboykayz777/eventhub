"use client";

import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        navigate('/dashboard');
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#1a1a2e]">Create Host Account</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={[]}
          view="sign_up"
          redirectTo={window.location.origin + '/dashboard'}
        />
      </div>
    </div>
  );
};

export default Signup;