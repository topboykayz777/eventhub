-- Add plus_one_name column to rsvps table
ALTER TABLE public.rsvps ADD COLUMN IF NOT EXISTS plus_one_name TEXT;