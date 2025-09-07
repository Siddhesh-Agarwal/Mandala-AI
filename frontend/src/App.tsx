import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import CreatePage from "./pages/Create";
import GalleryPage from "./pages/Gallery";
import HomePage from "./pages/Index";
import NotFound from "./pages/NotFound";

export default function App() {
  // Initialize the QueryClient with default options
  // 10 seconds timeout on queries
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10000,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster richColors />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
