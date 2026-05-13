import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://vilknsbrvakthefsgfwg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpbGtuc2JydmFrdGhlZnNnZndnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4ODk1MTUsImV4cCI6MjA4NzQ2NTUxNX0.kCmNQ43Vcl0Im0yL8mawB5HqhTO63bKfT-RaaivWjvA";

// We initialize the client with specific auth settings to bypass the 5s lock timeout
// that occurs in environments where third-party storage is restricted.
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // This prevents the 'Lock not released' error which causes the 5s delay
    storageKey: 'eventhub-auth-token',
  }
});