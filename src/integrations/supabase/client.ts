import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://vilknsbrvakthefsgfwg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_GmWt4u9-zd8LN4rJqduaKQ_3BbCKH14";

// We initialize the client with specific auth settings to bypass the 5s lock timeout
// and handle environments where third-party storage is restricted.
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'eventhub-auth-token',
    // Use a custom flow for environments that block standard storage
    flowType: 'pkce',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});