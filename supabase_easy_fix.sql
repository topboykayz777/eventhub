-- Allow anyone to insert a gift into the ledger
CREATE POLICY "Allow public to insert digital sprays" ON public.budget_items
FOR INSERT WITH CHECK (true);