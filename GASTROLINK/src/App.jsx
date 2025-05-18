import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FirebaseProvider } from "./context/FirebaseContext";

// Pages
import Index from "./pages/Index.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ViewQR from "./pages/ViewQR.jsx";
import MenuEditor from "./pages/MenuEditor.jsx";
import ViewMenu from "./pages/ViewMenu.jsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FirebaseProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/create-menu" element={<MenuEditor />} />
            <Route path="/dashboard/edit-menu/:menuId" element={<MenuEditor />} />
            <Route path="/dashboard/view-qr/:menuId" element={<ViewQR />} />
            <Route path="/menu/:menuId" element={<ViewMenu />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </FirebaseProvider>
  </QueryClientProvider>
);

export default App;
