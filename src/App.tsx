import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from "@/components/SessionProvider";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import CreateEvent from "@/pages/CreateEvent";
import EventPage from "@/pages/EventPage";
import EditEvent from "@/pages/EditEvent";
import Payment from "@/pages/Payment";
import VendorDirectory from "@/pages/VendorDirectory";
import VendorProfile from "@/pages/VendorProfile";
import Profile from "@/pages/Profile";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import FAQPage from "@/pages/FAQPage";
import BudgetTracker from "@/pages/BudgetTracker";
import VibeScreen from "@/pages/VibeScreen";
import SprayPage from "@/pages/SprayPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <SessionProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/edit-event/:id" element={<EditEvent />} />
            <Route path="/event/:slug" element={<EventPage />} />
            <Route path="/payment/:id" element={<Payment />} />
            <Route path="/budget/:id" element={<BudgetTracker />} />
            <Route path="/vendors" element={<VendorDirectory />} />
            <Route path="/vendor/:id" element={<VendorProfile />} />
            <Route path="/vibe/:slug" element={<VibeScreen />} />
            <Route path="/spray/:slug" element={<SprayPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SessionProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;