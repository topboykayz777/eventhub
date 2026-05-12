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
    const initializeSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (error) {
        console.error("Session initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (currentSession?.access_token !== session?.access_token) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN') {
          if (location.pathname === '/login' || location.pathname === '/signup') {
            navigate('/dashboard', { replace: true });
          }
        } else if (event === 'SIGNED_OUT') {
          const protectedRoutes = ['/dashboard', '/profile', '/create-event', '/edit-event', '/budget'];
          if (protectedRoutes.some(route => location.pathname.startsWith(route))) {
            navigate('/login', { replace: true });
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname, session?.access_token]);

  return (
    <SessionContext.Provider value={{ session, user, loading }}>
      {children}
    </SessionContext.Provider>
  );
};