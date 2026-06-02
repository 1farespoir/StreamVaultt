import React, { useEffect, useState } from "react";
import { ShoppingCart, Menu, X, Zap } from "lucide-react";
import { useCart } from "../context/CartContext";

const links = [
  { href: "#subscriptions", label: "Subscriptions" },
  { href: "#why", label: "Why Us" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
];

export const Navbar = () => {
  const { count, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/70 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group" data-testid="logo-link">
          <div className="relative">
            <div className="absolute inset-0 bg-[#00FF66] blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-9 h-9 rounded-xl bg-black border border-[#00FF66]/40 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#00FF66]" fill="#00FF66" />
            </div>
          </div>
          <span className="font-extrabold text-xl tracking-tight">
            Stream<span className="text-[#00FF66]">Vault</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-slate-300 hover:text-[#00FF66] transition-colors relative group"
              data-testid={`nav-link-${l.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00FF66] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="relative h-10 w-10 rounded-full border border-white/10 hover:border-[#00FF66]/60 hover:bg-[#00FF66]/10 transition-all flex items-center justify-center group"
            data-testid="cart-button"
            aria-label="Open cart"
          >
            <ShoppingCart className="w-4 h-4 text-white group-hover:text-[#00FF66]" />
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#00FF66] text-black text-[11px] font-bold flex items-center justify-center glow-green"
                data-testid="cart-count-badge"
              >
                {count}
              </span>
            )}
          </button>

          <button
            className="md:hidden h-10 w-10 rounded-full border border-white/10 flex items-center justify-center"
            onClick={() => setMenu((v) => !v)}
            data-testid="mobile-menu-toggle"
            aria-label="Toggle menu"
          >
            {menu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {menu && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/5">
          <div className="px-6 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenu(false)}
                className="text-slate-300 hover:text-[#00FF66] py-2 text-sm"
                data-testid={`mobile-nav-${l.label.toLowerCase()}`}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
