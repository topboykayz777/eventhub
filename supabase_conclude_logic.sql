-- Add is_concluded column to events table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_concluded BOOLEAN DEFAULT false;

-- Update RLS to allow hosts to update this column (already covered by events_update_policy)