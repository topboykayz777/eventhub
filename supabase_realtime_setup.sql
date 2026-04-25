-- This ensures the database 'broadcasts' every new spray to the dashboard
alter publication supabase_realtime add table budget_items;