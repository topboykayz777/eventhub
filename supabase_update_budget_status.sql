-- Add status and alert_name to budget_items
ALTER TABLE public.budget_items ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved';
ALTER TABLE public.budget_items ADD COLUMN IF NOT EXISTS alert_name TEXT;
ALTER TABLE public.budget_items ADD COLUMN IF NOT EXISTS rsvp_id UUID REFERENCES public.rsvps(id);

-- Update existing items to be 'approved'
UPDATE public.budget_items SET status = 'approved' WHERE status IS NULL;