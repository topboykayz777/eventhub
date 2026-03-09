import { createClient } from '@supabase/supabase-js';

// These will be pulled from Vercel environment variables in production
// or use the hardcoded fallbacks during local development.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://vfxrgyjmquvbprcessne.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmeHJneWptcXV2YnByY2Vzc25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDg0MDIsImV4cCI6MjA4ODM4NDQwMn0.0-EKDSc2Cz66X1slOjrAjCDwCe453irnxLwH6GiXQM8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);