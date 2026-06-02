import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Zap,
  ExternalLink,
  Package,
} from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import { BrandIcon } from "@/components/BrandIcon";

const FieldLabel = ({ children }) => (
  <label className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 mb-1.5 block">
    {children}
  </label>
);

const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:border-[#00FF66]/60 focus:outline-none focus:ring-2 focus:ring-[#00FF66]/20 transition-all ${className}`}
  />
);

const ProductEditor = ({ product }) => {
  const { updateProduct, updatePlan } = useProducts();
  const [featuresText, setFeaturesText] = useState(product.features.join("\n"));

  const handleField = (field) => (e) => {
    updateProduct(product.id, { [field]: e.target.value });
  };

  const handleFeaturesBlur = () => {
    const arr = featuresText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    updateProduct(product.id, { features: arr });
    toast.success(`${product.name} features updated`);
  };

  const addFeature = () => {
    setFeaturesText((t) => (t.trim() ? t + "\nNew feature" : "New feature"));
  };

  const handlePlanField = (planId, field) => (e) => {
    const raw = e.target.value;
    const value = field === "price" || field === "original" ? parseFloat(raw) || 0 : raw;
    updatePlan(product.id, planId, { [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 lg:p-7"
      data-testid={`admin-product-${product.id}`}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-6 pb-6 border-b border-white/5">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${product.accent}15` }}
        >
          <BrandIcon
            name={product.icon}
            className="w-7 h-7"
            style={{ color: product.accent }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-slate-500 font-medium">{product.brand}</div>
          <h3 className="text-xl font-bold tracking-tight truncate">{product.name}</h3>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] font-semibold tracking-wider uppercase">
          {product.badge}
        </span>
      </div>

      {/* Core fields */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div>
          <FieldLabel>Product Name</FieldLabel>
          <Input
            value={product.name}
            onChange={handleField("name")}
            data-testid={`admin-name-${product.id}`}
          />
        </div>
        <div>
          <FieldLabel>Tagline</FieldLabel>
          <Input
            value={product.tagline}
            onChange={handleField("tagline")}
            data-testid={`admin-tagline-${product.id}`}
          />
        </div>
        <div>
          <FieldLabel>Badge Text</FieldLabel>
          <Input
            value={product.badge}
            onChange={handleField("badge")}
            data-testid={`admin-badge-${product.id}`}
          />
        </div>
        <div>
          <FieldLabel>Brand</FieldLabel>
          <Input
            value={product.brand}
            onChange={handleField("brand")}
            data-testid={`admin-brand-${product.id}`}
            disabled
          />
        </div>
      </div>

      {/* Plans */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-white tracking-tight">Plans & Pricing</h4>
          <span className="text-[11px] text-slate-500">USD</span>
        </div>
        <div className="space-y-3">
          {product.plans.map((plan) => {
            const discount = plan.original
              ? Math.round(((plan.original - plan.price) / plan.original) * 100)
              : 0;
            return (
              <div
                key={plan.id}
                className="grid grid-cols-12 gap-3 items-end p-3 rounded-xl bg-black/40 border border-white/5"
                data-testid={`admin-plan-${product.id}-${plan.id}`}
              >
                <div className="col-span-12 sm:col-span-4">
                  <FieldLabel>Plan Label</FieldLabel>
                  <Input
                    value={plan.label}
                    onChange={handlePlanField(plan.id, "label")}
                    data-testid={`admin-plan-label-${product.id}-${plan.id}`}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <FieldLabel>Price ($)</FieldLabel>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={plan.price}
                    onChange={handlePlanField(plan.id, "price")}
                    data-testid={`admin-plan-price-${product.id}-${plan.id}`}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <FieldLabel>Original ($)</FieldLabel>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={plan.original}
                    onChange={handlePlanField(plan.id, "original")}
                    data-testid={`admin-plan-original-${product.id}-${plan.id}`}
                  />
                </div>
                <div className="col-span-12 sm:col-span-2 text-center">
                  <div className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Discount</div>
                  <div
                    className={`text-lg font-extrabold tracking-tight ${
                      discount > 0 ? "text-[#00FF66]" : "text-slate-500"
                    }`}
                  >
                    {discount}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <FieldLabel>Features (one per line)</FieldLabel>
          <button
            onClick={addFeature}
            className="text-[11px] text-[#00FF66] hover:underline flex items-center gap-1"
            data-testid={`admin-add-feature-${product.id}`}
          >
            <Plus className="w-3 h-3" /> Add feature
          </button>
        </div>
        <textarea
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          onBlur={handleFeaturesBlur}
          rows={5}
          className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:border-[#00FF66]/60 focus:outline-none focus:ring-2 focus:ring-[#00FF66]/20 transition-all resize-y leading-relaxed"
          data-testid={`admin-features-${product.id}`}
        />
        <p className="text-[11px] text-slate-600 mt-1.5">
          Changes apply when you click outside the textarea.
        </p>
      </div>
    </motion.div>
  );
};

export default function AdminDashboard() {
  const { products, resetToDefaults } = useProducts();

  const handleSave = () => {
    toast.success("All changes saved", {
      description: "Edits are persisted in your browser's localStorage.",
    });
  };

  const handleReset = () => {
    if (window.confirm("Reset all products to defaults? This will discard your edits.")) {
      resetToDefaults();
      toast.success("Products reset to defaults");
    }
  };

  return (
    <div className="min-h-screen halo-bg" data-testid="admin-dashboard">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 group"
              data-testid="admin-home-link"
            >
              <div className="w-9 h-9 rounded-xl bg-black border border-[#00FF66]/40 flex items-center justify-center glow-green">
                <Zap className="w-5 h-5 text-[#00FF66]" fill="#00FF66" />
              </div>
              <span className="font-extrabold tracking-tight">
                Stream<span className="text-[#00FF66]">Vault</span>
                <span className="ml-2 text-[10px] px-2 py-0.5 rounded-md bg-[#00FF66]/15 text-[#00FF66] font-bold tracking-wider uppercase align-middle">
                  Admin
                </span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 h-9 rounded-full border border-white/10 text-xs font-medium text-slate-300 hover:border-[#00FF66]/60 hover:text-[#00FF66] transition-all"
              data-testid="admin-view-store-button"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Store
            </Link>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 h-9 rounded-full border border-white/10 text-xs font-medium text-slate-300 hover:border-red-500/60 hover:text-red-400 transition-all"
              data-testid="admin-reset-button"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={handleSave}
              className="btn-shine inline-flex items-center gap-1.5 px-5 h-9 rounded-full bg-[#00FF66] text-black text-xs font-semibold hover:bg-[#00E05A] transition-all glow-green"
              data-testid="admin-save-button"
            >
              <Save className="w-3.5 h-3.5" />
              Saved
            </button>
          </div>
        </div>
      </header>

      {/* Hero strip */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-12 pb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#00FF66] mb-6 transition-colors"
          data-testid="admin-back-link"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to store
        </Link>

        <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#00FF66]">
              // Product Dashboard
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter">
              Manage your <span className="text-gradient-green">catalog.</span>
            </h1>
            <p className="mt-3 text-sm text-slate-400 max-w-2xl leading-relaxed">
              Edit product names, taglines, badges, pricing, and feature lists below. Changes
              autosave to your browser and reflect instantly on the live store.
            </p>
          </div>

          <div className="glass rounded-xl px-5 py-3 flex items-center gap-3">
            <Package className="w-4 h-4 text-[#00FF66]" />
            <div className="text-xs text-slate-400">
              <span className="text-white font-bold">{products.length}</span> products active
            </div>
          </div>
        </div>
      </div>

      {/* Editors */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-24 space-y-6">
        {products.map((p) => (
          <ProductEditor key={p.id} product={p} />
        ))}
      </div>

      {/* Footer note */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-12">
        <div className="text-[11px] text-center text-slate-600">
          Data is stored locally in this browser only. Clearing site data will revert to
          defaults.
        </div>
      </div>
    </div>
  );
}
