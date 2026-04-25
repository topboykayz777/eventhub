-- Create toasts table for guest messages
CREATE TABLE IF NOT EXISTS public.toasts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_live BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on toasts
ALTER TABLE public.toasts ENABLE ROW LEVEL SECURITY;

-- Policies for toasts
CREATE POLICY "Public can insert toasts" ON public.toasts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view live toasts" ON public.toasts FOR SELECT USING (is_live = true);
CREATE POLICY "Hosts can manage toasts for their events" ON public.toasts 
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = toasts.event_id 
    AND events.host_id = auth.uid()
  )
);

-- Create vendor_inquiries table
CREATE TABLE IF NOT EXISTS public.vendor_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on inquiries
ALTER TABLE public.vendor_inquiries ENABLE ROW LEVEL SECURITY;

-- Policies for inquiries
CREATE POLICY "Hosts can manage their own inquiries" ON public.vendor_inquiries 
FOR ALL TO authenticated USING (auth.uid() = host_id);

CREATE POLICY "Vendors can view inquiries sent to them" ON public.vendor_inquiries 
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.vendors 
    WHERE vendors.id = vendor_inquiries.vendor_id 
    AND vendors.user_id = auth.uid()
  )
);