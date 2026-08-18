import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Overview from "./pages/Overview";
import Roadmap from "./pages/Roadmap";
import DeliveryBoard from "./pages/DeliveryBoard";
import FeatureDetail from "./pages/FeatureDetail";
import Architecture from "./pages/Architecture";
import SDD from "./pages/SDD";
import Agents from "./pages/Agents";
import Operations from "./pages/Operations";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/components/theme-provider";
import { ApiConfigProvider } from "@/contexts/ApiConfigContext";
import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ApiConfigProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Áreas Centrais do Agentic PMO Operating System */}
                <Route path="/" element={<Overview />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/dashboard" element={<Overview />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/delivery" element={<DeliveryBoard />} />
                <Route path="/features/:id" element={<FeatureDetail />} />
                <Route path="/architecture" element={<Architecture />} />
                <Route path="/sdd" element={<SDD />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/operations" element={<Operations />} />

                {/* Rotas de Redirecionamento e Fallback */}
                <Route path="/projects" element={<Roadmap />} />
                <Route path="/timeline" element={<Roadmap />} />
                <Route path="/team" element={<Agents />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </ApiConfigProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
