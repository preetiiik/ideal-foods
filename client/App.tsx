import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Enquiry from "./pages/Enquiry";
import ProductCarousel from "@/components/ProductCarousel";
import ProductDetail from "@/pages/ProductDetail";
import { PICKLE_LINE, SYRUP_LINE } from "@/data/products";
import NotFound from "./pages/NotFound";
import { Navigate } from "react-router-dom";
import { SiteNav } from "@/components/SiteChrome";

const queryClient = new QueryClient();

/** Every navigation opens the new page from the very top. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    // Also reset any scrolling ancestor (webview-safe)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // A webview can restore the old offset one tick later — re-assert shortly after.
    const t = window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      document.documentElement.scrollTop = 0;
    }, 60);
    return () => window.clearTimeout(t);
  }, [pathname]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        {/* ONE always-visible nav above every page/section — never overlapped */}
        <SiteNav />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/enquiry" element={<Enquiry />} />
          {/* The syrups showcase is the home page — old link redirects there */}
          <Route path="/syrups" element={<Navigate to="/" replace />} />
          {/* Pickles get the SAME full landing (hero + content sections), just with the pickle carousel */}
          <Route path="/pickles" element={<Landing line={PICKLE_LINE} />} />
          <Route path="/syrup/:slug" element={<ProductDetail line={SYRUP_LINE} />} />
          <Route path="/pickle/:slug" element={<ProductDetail line={PICKLE_LINE} />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
