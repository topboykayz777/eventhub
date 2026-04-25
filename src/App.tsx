"use client";

import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
import VendorDirectory from "./pages/VendorDirectory";
import VendorProfile from "./pages/VendorProfile";
import VendorDashboard from "./pages/VendorDashboard";
import Guide from "./pages/Guide";
import NotFound from "./pages/NotFound";
import SecurityLock from "./components/SecurityLock";
import RouteWatcher from "./components/RouteWatcher";

const queryClient = new QueryClient();

// Separate component to use hooks like useNavigate
const AuthHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        console.log("[Auth] Password recovery detected, redirecting...");
        navigate('/reset-password');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return null;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SecurityLock />
        <Toaster />
        <Sonner />
        <BrowserRouter 
          future={{ 
            v7_startTransition: true, 
            v7_relativeSplatPath: true 
          }}
        >
          <AuthHandler />
          <RouteWatcher>
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/vendor-dashboard" element={<VendorDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/budget/:id" element={<BudgetTracker />} />
              <Route path="/vendors" element={<VendorDirectory />} />
              <Route path="/vendor/:id" element={<VendorProfile />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RouteWatcher>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;