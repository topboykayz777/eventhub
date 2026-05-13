-- Add column to track plus one check-in status
ALTER TABLE public.rsvps 
ADD COLUMN IF NOT EXISTS plus_one_checked_in BOOLEAN DEFAULT false;

-- Update RLS policies to ensure hosts can update this new column
-- (Existing policies usually cover all columns, but good to verify)