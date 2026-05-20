"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ThemeProvider';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import GuestRegistry from './pages/GuestRegistry';
import BudgetTracker from './pages/BudgetTracker';
import EditEvent from './pages/EditEvent';
import Header from './components/Header';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <Router>
          <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/guests/:id" element={<GuestRegistry />} />
                <Route path="/budget/:id" element={<BudgetTracker />} />
                <Route path="/edit-event/:id" element={<EditEvent />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Toaster position="bottom-center" />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;