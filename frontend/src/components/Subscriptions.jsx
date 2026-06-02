import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { BrandIcon } from "./BrandIcon";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import { toast } from "sonner";

const ProductCard = ({ product, index }) => {
  const { addItem } = useCart();
  const [selectedPlan, setSelectedPlan] = useState(product.plans[0]);

  const discount = Math.round(((selectedPlan.original - selectedPlan.price) / selectedPlan.original) * 100);

  const handleBuy = () => {
    addItem(product, selectedPlan);
    toast.success(`${product.name} (${selectedPlan.label}) added to cart`, {
      description: "Open the cart to complete your purchase.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group"
      data-testid={`product-card-${product.id}`}
    >
      {/* Hover glow */}
      <div
        className="absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, ${product.accent}40, transparent 70%)` }}
      />

      <div className="relative h-full glass rounded-3xl p-8 hover:border-[#00FF66]/40 transition-all duration-500 group-hover:-translate-y-1">
        {/* Badge */}
        <div className="absolute top-6 right-6">
          <span className="inline-block px-3 py-1 rounded-full bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] text-[10px] font-semibold tracking-wider uppercase">
            {product.badge}
          </span>
        </div>

        {/* Brand icon */}
        <div className="mb-8">
          <div
            className="inline-flex w-16 h-16 rounded-2xl items-center justify-center"
            style={{
              background: `${product.accent}15`,
              boxShadow: `0 0 30px ${product.accent}30`,
            }}
          >
            <BrandIcon
              name={product.icon}
              className="w-9 h-9"
              style={{ color: product.accent }}
            />
          </div>
        </div>

        <h3 className="text-2xl font-bold tracking-tight mb-1">{product.name}</h3>
        <p className="text-sm text-slate-500 mb-6">{product.tagline}</p>

        {/* Plan selector */}
        <div className="flex gap-2 mb-6" data-testid={`plan-selector-${product.id}`}>
          {product.plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                selectedPlan.id === plan.id
                  ? "bg-[#00FF66] text-black border-[#00FF66]"
                  : "bg-transparent text-slate-400 border-white/10 hover:border-white/30"
              }`}
              data-testid={`plan-${product.id}-${plan.id}`}
            >
              {plan.label}
            </button>
          ))}
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-4xl font-extrabold tracking-tighter">
            ${selectedPlan.price}
          </span>
          <span className="text-sm text-slate-500 line-through">${selectedPlan.original}</span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-[#00FF66]/15 text-[#00FF66] font-semibold">
            -{discount}%
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          You save ${(selectedPlan.original - selectedPlan.price).toFixed(2)}
        </p>

        {/* Features */}
        <ul className="space-y-2.5 mb-8">
          {product.features.map((feat) => (
            <li key={feat} className="flex items-start gap-2.5 text-sm text-slate-300">
              <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-[#00FF66]/15 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-[#00FF66]" strokeWidth={3} />
              </div>
              <span>{feat}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={handleBuy}
          className="btn-shine relative w-full h-12 rounded-full bg-[#00FF66] text-black font-semibold text-sm hover:bg-[#00E05A] transition-all flex items-center justify-center gap-2 glow-green hover:glow-green-strong"
          data-testid={`buy-now-${product.id}`}
        >
          Buy Now
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export const Subscriptions = () => {
  const { products } = useProducts();
  return (
    <section id="subscriptions" className="relative py-24 lg:py-32" data-testid="subscriptions-section">
      <div className="absolute inset-0 halo-bg opacity-50" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#00FF66]">
            // Featured Subscriptions
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter">
            Pick a plan.{" "}
            <span className="text-gradient-green">Stream tonight.</span>
          </h2>
          <p className="mt-4 text-slate-400 leading-relaxed">
            Every subscription is genuine, instantly delivered, and backed by our lifetime warranty.
            Choose your duration and we'll handle the rest.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
