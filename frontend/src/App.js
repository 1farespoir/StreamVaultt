import React from "react";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Subscriptions } from "@/components/Subscriptions";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

function App() {
  return (
    <CartProvider>
      <div className="App" data-testid="app-root">
        <Navbar />
        <main>
          <Hero />
          <Subscriptions />
          <WhyChooseUs />
          <Testimonials />
          <FAQ />
        </main>
        <Footer />
        <CartDrawer />
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
  );
}

export default App;
