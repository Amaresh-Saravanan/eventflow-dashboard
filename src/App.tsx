import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Auth from "./pages/Auth";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Endpoints from "./pages/dashboard/Endpoints";
import Events from "./pages/dashboard/Events";
import EventDetail from "./pages/dashboard/EventDetail";
import Logs from "./pages/dashboard/Logs";
import Settings from "./pages/dashboard/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                {/* Backwards-compatible alias */}
                <Route path="/login" element={<Login />} />
                <Route path="/auth" element={<Auth />} />

                {/* Protected Dashboard routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="endpoints" element={<Endpoints />} />
                  <Route path="events" element={<Events />} />
                  <Route path="events/:id" element={<EventDetail />} />
                  <Route path="logs" element={<Logs />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </UserProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

