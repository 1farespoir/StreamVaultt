import React, { Suspense, lazy } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";
import HomePage from "@/pages/HomePage";

const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));

function App() {
  return (
    <ProductsProvider>
      <CartProvider>
        <div className="App" data-testid="app-root">
          <BrowserRouter>
            <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin" element={<AdminDashboard />} />
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
