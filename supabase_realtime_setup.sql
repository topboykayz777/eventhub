-- Enable Realtime for the budget_items table so the dashboard can 'hear' new sprays
alter publication supabase_realtime add table budget_items;