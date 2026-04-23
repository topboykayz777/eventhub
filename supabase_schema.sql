-- Create the storage bucket for event and profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-photos', 'event-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow authenticated users to upload files to the 'event-photos' bucket
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-photos');

-- Policy: Allow public read access to all files in the 'event-photos' bucket
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'event-photos');

-- Policy: Allow authenticated users to update or delete files in the 'event-photos' bucket
CREATE POLICY "Allow authenticated management"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'event-photos');