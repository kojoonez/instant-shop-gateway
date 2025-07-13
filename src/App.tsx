import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Marketplace from "./pages/Marketplace";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Auth from "./pages/Auth";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ProductsPage } from "./pages/admin/ProductsPage";
import { OrdersPage } from "./pages/admin/OrdersPage";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Route */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Main App Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="users" element={<div className="p-6"><h1 className="text-3xl font-bold">Users Management</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
              <Route path="analytics" element={<div className="p-6"><h1 className="text-3xl font-bold">Analytics</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
              <Route path="settings" element={<div className="p-6"><h1 className="text-3xl font-bold">Settings</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
