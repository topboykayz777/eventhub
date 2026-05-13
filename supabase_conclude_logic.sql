-- Add is_concluded column to events table to track manual event ending
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_concluded BOOLEAN DEFAULT false;

-- Ensure RLS allows hosts to update their own events
-- (This is a safety check for the existing policy)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'events' AND policyname = 'events_update_policy'
    ) THEN
        CREATE POLICY "events_update_policy" ON public.events
        FOR UPDATE TO authenticated USING (auth.uid() = host_id);
    END IF;
END $$;