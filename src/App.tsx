import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TaskManager from "./components/projects/TaskManager";
import WeatherApp from "./components/projects/WeatherApp";
import RecipeFinder from "./components/projects/RecipeFinder";
import ExpenseTracker from "./components/projects/ExpenseTracker";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/Portfolio">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/projects/task-manager" element={<TaskManager />} />
            <Route path="/projects/weather-app" element={<WeatherApp />} />
            <Route path="/projects/recipe-finder" element={<RecipeFinder />} />
            <Route path="/projects/expense-tracker" element={<ExpenseTracker />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
