import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { supabase } from "./integrations/supabase/client";

// One-time database update for The Johnson Family Thanksgiving
supabase
  .from('events')
  .update({ event_date: '2026-06-21T12:00:00+01:00' })
  .ilike('event_name', '%Johnson Family Thanksgiving%')
  .then(({ data, error }) => {
    if (error) console.error("Error updating event date:", error);
    else console.log("Successfully updated The Johnson Family Thanksgiving date to June 21, 2026");
  });

createRoot(document.getElementById("root")!).render(<App />);