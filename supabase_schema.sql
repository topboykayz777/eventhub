-- 1. PROFILES TABLE SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop any existing conflicting policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_public_read_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;

-- Create clean, explicit policies
CREATE POLICY "profiles_select_all" ON public.profiles 
FOR SELECT USING (true);

CREATE POLICY "profiles_insert_self" ON public.profiles 
FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_self" ON public.profiles 
FOR UPDATE TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);


-- 2. EVENTS TABLE SECURITY
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Hosts can manage their own events" ON public.events;
DROP POLICY IF EXISTS "Public can view paid events" ON public.events;

CREATE POLICY "events_select_all" ON public.events 
FOR SELECT USING (true);

CREATE POLICY "events_insert_host" ON public.events 
FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = host_id);

CREATE POLICY "events_update_host" ON public.events 
FOR UPDATE TO authenticated 
USING (auth.uid() = host_id) 
WITH CHECK (auth.uid() = host_id);

CREATE POLICY "events_delete_host" ON public.events 
FOR DELETE TO authenticated 
USING (auth.uid() = host_id);


-- 3. STORAGE SECURITY (The most common source of this error during uploads)
-- Ensure the bucket exists (this is handled via UI usually, but policies apply to the objects)
-- We target the storage.objects table directly.

DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;

-- Allow any authenticated user to upload to the 'event-photos' bucket
CREATE POLICY "storage_insert_policy" ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'event-photos');

-- Allow public to view images in the 'event-photos' bucket
CREATE POLICY "storage_select_policy" ON storage.objects 
FOR SELECT USING (bucket_id = 'event-photos');

-- Allow users to delete their own uploads (if owner is tracked)
CREATE POLICY "storage_delete_policy" ON storage.objects 
FOR DELETE TO authenticated 
USING (bucket_id = 'event-photos' AND (auth.uid() = owner OR owner IS NULL));


-- 4. BUDGET ITEMS SECURITY
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Hosts can manage budget for their events" ON public.budget_items;

CREATE POLICY "budget_manage_policy" ON public.budget_items
FOR ALL TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = budget_items.event_id 
    AND events.host_id = auth.uid()
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = budget_items.event_id 
    AND events.host_id = auth.uid()
));