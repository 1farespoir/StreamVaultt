import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useCart } from "../context/CartContext";
import { Mail, CreditCard, Lock, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

export const CheckoutDialog = ({ open, onOpenChange }) => {
  const { items, subtotal, savings, clear } = useCart();
  const [email, setEmail] = useState("");
  const [card, setCard] = useState("");
  const [name, setName] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [status, setStatus] = useState("idle"); // idle | processing | success

  const isValid = email.includes("@") && card.length >= 12 && name && exp && cvc.length >= 3;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    setStatus("processing");
    setTimeout(() => {
      setStatus("success");
    }, 1600);
  };

  const handleClose = () => {
    if (status === "success") {
      clear();
      setEmail("");
      setCard("");
      setName("");
      setExp("");
      setCvc("");
    }
    setStatus("idle");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? handleClose() : onOpenChange(v))}>
      <DialogContent
        className="bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 text-white max-w-2xl p-0 overflow-hidden"
        data-testid="checkout-dialog"
      >
        {status === "success" ? (
          <div className="p-10 text-center" data-testid="checkout-success">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#00FF66]/15 border border-[#00FF66]/40 flex items-center justify-center glow-green">
              <CheckCircle2 className="w-10 h-10 text-[#00FF66]" strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight mb-2">
              Order Confirmed!
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-2">
              Your premium subscriptions will arrive at
            </p>
            <p className="text-[#00FF66] font-semibold mb-8">{email}</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-8">
              Delivery typically takes under 60 seconds. Don't see it? Check your spam folder
              or reach out to our 24/7 support.
            </p>
            <button
              onClick={handleClose}
              className="px-8 h-11 rounded-full bg-[#00FF66] text-black text-sm font-semibold hover:bg-[#00E05A] transition-colors glow-green"
              data-testid="success-close-button"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <DialogHeader className="px-8 pt-8 pb-2">
              <DialogTitle className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#00FF66]" />
                Secure Checkout
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-1">
                No account needed. Credentials delivered to your inbox.
              </p>
            </DialogHeader>

            <div className="grid md:grid-cols-5 gap-0">
              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="md:col-span-3 px-8 py-6 space-y-5"
                data-testid="checkout-form"
              >
                <div>
                  <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-[#00FF66]/60 focus:outline-none focus:ring-2 focus:ring-[#00FF66]/20 transition-all"
                      data-testid="checkout-email"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2 block">
                    Cardholder Name
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-[#00FF66]/60 focus:outline-none focus:ring-2 focus:ring-[#00FF66]/20 transition-all"
                    data-testid="checkout-name"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2 block">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      required
                      value={card}
                      onChange={(e) =>
                        setCard(e.target.value.replace(/[^\d ]/g, "").slice(0, 19))
                      }
                      placeholder="4242 4242 4242 4242"
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-[#00FF66]/60 focus:outline-none focus:ring-2 focus:ring-[#00FF66]/20 transition-all"
                      data-testid="checkout-card"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2 block">
                      Expiry
                    </label>
                    <input
                      required
                      value={exp}
                      onChange={(e) => setExp(e.target.value.slice(0, 5))}
                      placeholder="MM/YY"
                      className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-[#00FF66]/60 focus:outline-none focus:ring-2 focus:ring-[#00FF66]/20 transition-all"
                      data-testid="checkout-exp"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2 block">
                      CVC
                    </label>
                    <input
                      required
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="123"
                      className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-[#00FF66]/60 focus:outline-none focus:ring-2 focus:ring-[#00FF66]/20 transition-all"
                      data-testid="checkout-cvc"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isValid || status === "processing"}
                  className="btn-shine w-full h-12 rounded-full bg-[#00FF66] text-black font-semibold text-sm hover:bg-[#00E05A] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 glow-green"
                  data-testid="complete-purchase-button"
                >
                  {status === "processing" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Complete Purchase · ${subtotal.toFixed(2)}
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3 h-3" />
                  This is a demo checkout. No real payment is processed.
                </div>
              </form>

              {/* Summary */}
              <div className="md:col-span-2 bg-black/40 border-l border-white/5 px-6 py-6">
                <div className="text-xs font-semibold tracking-wider uppercase text-slate-500 mb-4">
                  Order Summary
                </div>
                <div className="space-y-3 mb-5 max-h-60 overflow-y-auto pr-1">
                  {items.map((it) => (
                    <div key={it.key} className="flex items-start justify-between gap-2 text-sm">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{it.name}</div>
                        <div className="text-xs text-slate-500">
                          {it.planLabel} × {it.qty}
                        </div>
                      </div>
                      <div className="font-semibold text-white">
                        ${(it.price * it.qty).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t border-white/5 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Savings</span>
                    <span className="text-[#00FF66] font-medium">-${savings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Tax</span>
                    <span className="text-slate-300">$0.00</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-white/5 text-base">
                    <span className="font-medium">Total</span>
                    <span className="font-extrabold tracking-tight">${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
