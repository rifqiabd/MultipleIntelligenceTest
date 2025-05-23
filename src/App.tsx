import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageTitle from "./components/PageTitle";

// Import pages
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminQuestions from "./pages/AdminQuestions";
import TestEntryForm from "./pages/TestEntryForm";
import TestQuestions from "./pages/TestQuestions";
import TestResults from "./pages/TestResults";
import NotFound from "./pages/NotFound";
import MakasihYa from "./pages/MakasihYa";
import KeyboardListener from "./components/KeyboardListener";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageTitle />
        <KeyboardListener />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/questions" element={<AdminQuestions />} />
          <Route path="/test" element={<TestEntryForm />} />
          <Route path="/test/questions" element={<TestQuestions />} />
          <Route path="/test/results" element={<TestResults />} />
          <Route path="/makasihya" element={<MakasihYa />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
