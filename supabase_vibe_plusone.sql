-- Add plus_one_name to rsvps table
ALTER TABLE public.rsvps ADD COLUMN IF NOT EXISTS plus_one_name TEXT;

-- Ensure realtime is enabled for the events table so the Vibe Screen can see host messages
ALTER publication supabase_realtime ADD TABLE public.events;