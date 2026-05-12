"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';

interface SessionContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const SessionContext = createContext<SessionContextType>({ session: null, user: null, loading: true });

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Automatic redirect for authenticated users on login/signup pages
      if (session && (location.pathname === '/login' || location.pathname === '/signup')) {
        navigate('/dashboard');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_IN') {
        if (location.pathname === '/login' || location.pathname === '/signup') {
          navigate('/dashboard');
        }
      } else if (event === 'SIGNED_OUT') {
        // Only redirect to login if they were on a protected route
        const protectedRoutes = ['/dashboard', '/profile', '/create-event', '/edit-event', '/budget'];
        if (protectedRoutes.some(route => location.pathname.startsWith(route))) {
          navigate('/login');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  return (
    <SessionContext.Provider value={{ session, user, loading }}>
      {children}
    </SessionContext.Provider>
  );
};