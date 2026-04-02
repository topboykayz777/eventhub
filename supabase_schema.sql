-- Drop the restrictive policy that was hiding unpaid events from guests
DROP POLICY IF EXISTS "Public can view paid events" ON public.events;

-- Allow public to see all events so the page can load and wait for real-time activation
CREATE POLICY "Public can view all events" ON public.events FOR SELECT USING (true);