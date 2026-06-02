import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Subscriptions } from "@/components/Subscriptions";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

export default function HomePage() {
  return (
    <>
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
    </>
  );
}
