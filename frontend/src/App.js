import React, { Suspense, lazy } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";
import HomePage from "@/pages/HomePage";
import AdminLayout from "@/pages/AdminLayout";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminProductsPage from "@/pages/AdminProductsPage";
import AdminDealsPage from "@/pages/AdminDealsPage";
import AdminTestimonialsPage from "@/pages/AdminTestimonialsPage";
import AdminOrdersPage from "@/pages/AdminOrdersPage";
import AdminSettingsPage from "@/pages/AdminSettingsPage";

function App() {
  return (
    <ProductsProvider>
      <CartProvider>
        <div className="App" data-testid="app-root">
          <BrowserRouter>
            <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="deals" element={<AdminDealsPage />} />
                  <Route path="testimonials" element={<AdminTestimonialsPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "rgba(10, 10, 10, 0.95)",
                border: "1px solid rgba(0, 255, 102, 0.3)",
                color: "#F8FAFC",
              },
            }}
          />
        </div>
      </CartProvider>
    </ProductsProvider>
  );
}

export default App;
