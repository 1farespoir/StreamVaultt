import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product, plan) => {
    setItems((prev) => {
      const key = `${product.id}-${plan.id}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          brand: product.brand,
          icon: product.icon,
          accent: product.accent,
          planLabel: plan.label,
          price: plan.price,
          original: plan.original,
          qty: 1,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQty = useCallback((key, qty) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty } : i)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { subtotal, savings, count } = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const savings = items.reduce((s, i) => s + (i.original - i.price) * i.qty, 0);
    const count = items.reduce((s, i) => s + i.qty, 0);
    return { subtotal, savings, count };
  }, [items]);

  const value = {
    items,
    isOpen,
    setIsOpen,
    addItem,
    removeItem,
    updateQty,
    clear,
    subtotal,
    savings,
    count,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
