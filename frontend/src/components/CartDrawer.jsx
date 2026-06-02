import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { useCart } from "../context/CartContext";
import { BrandIcon } from "./BrandIcon";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { CheckoutDialog } from "./CheckoutDialog";

export const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQty, subtotal, savings } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          className="bg-[#0A0A0A]/95 backdrop-blur-2xl border-l border-white/10 text-white w-full sm:max-w-md p-0 flex flex-col"
          data-testid="cart-drawer"
        >
          <SheetHeader className="px-6 py-5 border-b border-white/5">
            <SheetTitle className="text-white text-lg font-bold tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#00FF66]" />
              Your Cart
              {items.length > 0 && (
                <span className="text-xs text-slate-500 font-normal">
                  ({items.reduce((s, i) => s + i.qty, 0)} items)
                </span>
              )}
            </SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center" data-testid="empty-cart">
              <div className="w-16 h-16 rounded-full bg-[#00FF66]/10 border border-[#00FF66]/20 flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-[#00FF66]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-xs">
                Browse our premium subscriptions and unlock streaming for less.
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 h-10 rounded-full bg-[#00FF66] text-black text-sm font-semibold hover:bg-[#00E05A] transition-colors"
                data-testid="continue-shopping-button"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {items.map((it) => (
                  <div
                    key={it.key}
                    className="glass rounded-2xl p-4 flex gap-4"
                    data-testid={`cart-item-${it.key}`}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${it.accent}15` }}
                    >
                      <BrandIcon
                        name={it.icon}
                        className="w-6 h-6"
                        style={{ color: it.accent }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-semibold truncate">{it.name}</div>
                          <div className="text-xs text-slate-500">{it.planLabel}</div>
                        </div>
                        <button
                          onClick={() => removeItem(it.key)}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                          data-testid={`remove-${it.key}`}
                          aria-label="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 border border-white/10 rounded-full">
                          <button
                            onClick={() => updateQty(it.key, it.qty - 1)}
                            className="w-7 h-7 flex items-center justify-center hover:text-[#00FF66] disabled:opacity-30"
                            disabled={it.qty <= 1}
                            data-testid={`decrease-${it.key}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold w-5 text-center" data-testid={`qty-${it.key}`}>
                            {it.qty}
                          </span>
                          <button
                            onClick={() => updateQty(it.key, it.qty + 1)}
                            className="w-7 h-7 flex items-center justify-center hover:text-[#00FF66]"
                            data-testid={`increase-${it.key}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-sm font-bold text-[#00FF66]">
                          ${(it.price * it.qty).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 px-6 py-5 space-y-3">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>You save</span>
                  <span className="text-[#00FF66] font-semibold" data-testid="cart-savings">
                    ${savings.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-base">
                  <span className="font-medium text-slate-300">Subtotal</span>
                  <span className="text-2xl font-extrabold tracking-tight" data-testid="cart-subtotal">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setCheckoutOpen(true);
                  }}
                  className="btn-shine w-full h-12 rounded-full bg-[#00FF66] text-black font-semibold text-sm hover:bg-[#00E05A] transition-all flex items-center justify-center gap-2 glow-green"
                  data-testid="checkout-button"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-center text-slate-600">
                  Secure checkout · SSL encrypted · No account required
                </p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  );
};
