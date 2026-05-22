"use client";

import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SessionProvider } from "@/components/SessionProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CreateEvent from "./pages/CreateEvent";
import Payment from "./pages/Payment";
import EventPage from "./pages/EventPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import EditEvent from "./pages/EditEvent";
import BudgetTracker from "./pages/BudgetTracker";
import GuestRegistry from "./pages/GuestRegistry";
import VendorDirectory from "./pages/VendorDirectory";
import VendorProfile from "./pages/VendorProfile";
import VibeScreen from "./pages/VibeScreen";
import SprayPage from "./pages/SprayPage";
import Support from "./pages/Support";
import Guide from "./pages/Guide";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AuthHandler = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // 1. Listen for the specific PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        navigate('/reset-password');
      }
    });

    // 2. Proactive check for recovery hash on landing
    // This catches cases where the user lands on the site from an email link 
    // before the auth state listener has fully initialized.
    const handleInitialRecovery = () => {
      const hash = window.location.hash;
      if (hash && (hash.includes('type=recovery') || hash.includes('access_token='))) {
        // Force immediate redirection if a recovery token is detected in the URL
        navigate('/reset-password');
      }
    };

    handleInitialRecovery();

    return () => subscription.unsubscribe();
  }, [navigate]);

  return null;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/create-event" element={<CreateEvent />} />
      <Route path="/edit-event/:id" element={<EditEvent />} />
      <Route path="/payment/:id" element={<Payment />} />
      <Route path="/event/:slug" element={<EventPage />} />
      <Route path="/vibe/:slug" element={<VibeScreen />} />
      <Route path="/spray/:slug" element={<SprayPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/budget/:id" element={<BudgetTracker />} />
      <Route path="/guests/:id" element={<GuestRegistry />} />
      <Route path="/vendors" element={<VendorDirectory />} />
      <Route path="/vendor/:id" element={<VendorProfile />} />
      <Route path="/support" element={<Support />} />
      <Route path="/guide" element={<Guide />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <SessionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AuthHandler />
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;