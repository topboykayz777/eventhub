-- 1. Create the 'event-photos' storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-photos', 'event-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing policies to prevent "already exists" errors
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;

-- 3. Create secure public policies for the bucket
CREATE POLICY "Public Access" ON storage.objects 
  FOR SELECT USING (bucket_id = 'event-photos');

CREATE POLICY "Authenticated Upload" ON storage.objects 
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'event-photos');

CREATE POLICY "Authenticated Update" ON storage.objects 
  FOR UPDATE TO authenticated USING (bucket_id = 'event-photos');

CREATE POLICY "Authenticated Delete" ON storage.objects 
  FOR DELETE TO authenticated USING (bucket_id = 'event-photos');