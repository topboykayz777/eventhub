-- Add is_finished column to events table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_finished BOOLEAN DEFAULT false;

-- Update RLS policies to ensure hosts can update this column
-- (Existing policies usually cover all columns for the owner, but this is a safety check)