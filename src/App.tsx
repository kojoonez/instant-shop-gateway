import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/consent/CookieBanner";
import Features from "@/pages/Features";
import Business from "@/pages/Business";
import Creators from "@/pages/Creators";
import HowItWorks from "@/pages/HowItWorks";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import Download from "@/pages/Download";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Blog from "@/pages/Blog";
import ApplyCreator from "@/pages/ApplyCreator";
import ApplyBusiness from "@/pages/ApplyBusiness";
import Waitlist from "@/pages/Waitlist";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminGuard } from "./components/admin/AdminGuard";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { MessagingPage } from "./pages/admin/MessagingPage";
import { WaitlistPage } from "./pages/admin/WaitlistPage";
import { ApplicationsPage } from "./pages/admin/ApplicationsPage";
import { UsersPage } from "./pages/admin/UsersPage";
import { AuthProvider } from "./contexts/AuthContext";
import { SecurityProvider } from "./contexts/SecurityContext";
import { SupportButton } from "./components/SupportButton";
import { TranslationTest } from "./components/TranslationTest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SecurityProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Header />
            <Routes>
              {/* Auth Route */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Main App Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/features" element={<Features />} />
              <Route path="/business" element={<Business />} />
              <Route path="/creators" element={<Creators />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/download" element={<Download />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/apply/creator" element={<ApplyCreator />} />
              <Route path="/apply/business" element={<ApplyBusiness />} />
              <Route path="/waitlist" element={<Waitlist />} />
              <Route path="/test/translation" element={<TranslationTest />} />
              
              {/* Admin Routes - require authentication */}
              <Route element={<AdminGuard />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="messages" element={<MessagingPage />} />
                  <Route path="waitlist" element={<WaitlistPage />} />
                  <Route path="applications" element={<ApplicationsPage />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="settings" element={<div className="p-6"><h1 className="text-3xl font-bold">Settings</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                </Route>
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
            <CookieBanner />
            <SupportButton />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </SecurityProvider>
  </QueryClientProvider>
);

export default App;
