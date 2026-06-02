import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { products as defaultProducts } from "../data/products";

const ProductsContext = createContext(null);
const STORAGE_KEY = "streamvault_products_v1";

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return defaultProducts;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      // ignore
    }
  }, [products]);

  const updateProduct = useCallback((id, patch) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const updatePlan = useCallback((productId, planId, patch) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              plans: p.plans.map((pl) => (pl.id === planId ? { ...pl, ...patch } : pl)),
            }
          : p
      )
    );
  }, []);

  const resetToDefaults = useCallback(() => {
    setProducts(defaultProducts);
  }, []);

  return (
    <ProductsContext.Provider
      value={{ products, updateProduct, updatePlan, resetToDefaults }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
};
