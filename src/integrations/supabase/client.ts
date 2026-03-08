import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://vfxrgyjmquvbprcessne.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmeHJneWptcXV2YnByY2Vzc25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDg0MDIsImV4cCI6MjA4ODM4NDQwMn0.0-EKDSc2Cz66X1slOjrAjCDwCe453irnxLwH6GiXQM8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);