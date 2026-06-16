import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Produits from "./pages/Produits";
import VendeurDashboard from "./pages/VendeurDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminClients from "./pages/admin/AdminClients";
import AdminInterventions from "./pages/admin/AdminInterventions";
import AdminInvoices from "./pages/admin/AdminInvoices";
import AdminPrints from "./pages/admin/AdminPrints";
import AdminVendeurs from "./pages/admin/AdminVendeurs";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { AdminLayout } from "./components/admin/AdminLayout";

const queryClient = new QueryClient();

const Admin = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute requireRole="admin"><AdminLayout>{children}</AdminLayout></ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/produits" element={<Produits />} />
            <Route path="/auth" element={<Auth />} />

            <Route path="/vendeur" element={<ProtectedRoute requireRole="vendeur"><VendeurDashboard /></ProtectedRoute>} />

            <Route path="/admin" element={<Admin><AdminDashboard /></Admin>} />
            <Route path="/admin/produits" element={<Admin><AdminProducts /></Admin>} />
            <Route path="/admin/clients" element={<Admin><AdminClients /></Admin>} />
            <Route path="/admin/clients/:id" element={<Admin><AdminClients /></Admin>} />
            <Route path="/admin/interventions" element={<Admin><AdminInterventions /></Admin>} />
            <Route path="/admin/factures" element={<Admin><AdminInvoices /></Admin>} />
            <Route path="/admin/impressions" element={<Admin><AdminPrints /></Admin>} />
            <Route path="/admin/vendeurs" element={<Admin><AdminVendeurs /></Admin>} />
            <Route path="/admin/rapports" element={<Admin><AdminReports /></Admin>} />
            <Route path="/admin/parametres" element={<Admin><AdminSettings /></Admin>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
