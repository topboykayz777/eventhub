-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_name TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  venue TEXT NOT NULL,
  message TEXT,
  plan TEXT DEFAULT 'Basic',
  theme TEXT DEFAULT 'modern',
  slug TEXT UNIQUE NOT NULL,
  photo_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  is_paid BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Events Policies
CREATE POLICY "Public can view paid events" ON public.events
  FOR SELECT USING (is_paid = true);

CREATE POLICY "Hosts can manage their own events" ON public.events
  FOR ALL TO authenticated USING (auth.uid() = host_id);

-- Create rsvps table
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  checked_in BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for rsvps
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- RSVPs Policies
CREATE POLICY "Public can insert RSVPs" ON public.rsvps
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Hosts can view RSVPs for their events" ON public.rsvps
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = rsvps.event_id AND events.host_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can update RSVPs for their events" ON public.rsvps
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = rsvps.event_id AND events.host_id = auth.uid()
    )
  );

-- Create budget_items table
CREATE TABLE IF NOT EXISTS public.budget_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for budget_items
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;

-- Budget Items Policies
CREATE POLICY "Hosts can manage budget for their events" ON public.budget_items
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = budget_items.event_id AND events.host_id = auth.uid()
    )
  );

-- Function to increment view count
CREATE OR REPLACE FUNCTION public.increment_view_count(event_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.events
  SET view_count = view_count + 1
  WHERE id = event_id;
END;
$$;