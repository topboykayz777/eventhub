-- Add missing columns to budget_items for the new Digital Spray flow
ALTER TABLE public.budget_items 
ADD COLUMN IF NOT EXISTS alert_name TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved',
ADD COLUMN IF NOT EXISTS rsvp_id UUID REFERENCES public.rsvps(id) ON DELETE SET NULL;

-- Update existing items to be 'approved' so they don't disappear from the dashboard
UPDATE public.budget_items SET status = 'approved' WHERE status IS NULL;