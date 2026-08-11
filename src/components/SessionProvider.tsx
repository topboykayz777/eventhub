"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface SessionContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  session: null,
  loading: true,
});

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user?.id) {
        updateLastSeen(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        const user = session?.user ?? null;
        setUser(user);
        setLoading(false);
        
        // Update last seen when user signs in or session refreshes
        if (user?.id) {
          await updateLastSeen(user.id);
        }
      }
    );

    // Set up heartbeat to update last_seen every 2 minutes while active
    const heartbeat = setInterval(async () => {
      if (user?.id) {
        await updateLastSeen(user.id);
      }
    }, 120000); // 2 minutes

    return () => {
      subscription.unsubscribe();
      clearInterval(heartbeat);
    };
  }, [user]);

  const updateLastSeen = async (userId: string) => {
    try {
      await supabase
        .from('profiles')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      console.warn("Failed to update last_seen:", error);
    }
  };

  return (
    <SessionContext.Provider value={{ user, session, loading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);