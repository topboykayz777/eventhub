-- Create toasts table for guest messages
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

-- Policies
CREATE POLICY "Public can insert toasts" ON public.toasts
FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view live toasts" ON public.toasts
FOR SELECT USING (is_live = true);

CREATE POLICY "Hosts can manage toasts" ON public.toasts
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.events
    WHERE events.id = toasts.event_id
    AND events.host_id = auth.uid()
  )
);