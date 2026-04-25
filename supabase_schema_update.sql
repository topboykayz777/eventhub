-- Update RSVPs table for song requests and plus-ones
ALTER TABLE public.rsvps 
ADD COLUMN IF NOT EXISTS song_request TEXT,
ADD COLUMN IF NOT EXISTS has_plus_one BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS plus_one_name TEXT;

-- Create Toasts table
CREATE TABLE IF NOT EXISTS public.toasts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_live BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.toasts ENABLE ROW LEVEL SECURITY;

-- Policies for Toasts
CREATE POLICY "Public can insert toasts" ON public.toasts
FOR INSERT TO authenticated, anon WITH CHECK (true);

CREATE POLICY "Public can view live toasts" ON public.toasts
FOR SELECT USING (is_live = true);

CREATE POLICY "Hosts can manage toasts for their events" ON public.toasts
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = toasts.event_id AND events.host_id = auth.uid()
  )
);