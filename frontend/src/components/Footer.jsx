import React from "react";
import { Zap, Twitter, Instagram, Github } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative border-t border-white/5 py-16 bg-[#050505]" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-black border border-[#00FF66]/40 flex items-center justify-center glow-green">
                <Zap className="w-5 h-5 text-[#00FF66]" fill="#00FF66" />
              </div>
              <span className="font-extrabold text-xl">
                Stream<span className="text-[#00FF66]">Vault</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Premium streaming subscriptions at a fraction of the cost. Genuine, instant, and
              backed by a lifetime warranty.
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold tracking-wider text-white/60 uppercase mb-4">
              Product
            </div>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#subscriptions" className="hover:text-[#00FF66] transition-colors">Subscriptions</a></li>
              <li><a href="#why" className="hover:text-[#00FF66] transition-colors">Why Us</a></li>
              <li><a href="#faq" className="hover:text-[#00FF66] transition-colors">FAQ</a></li>
              <li><a href="#reviews" className="hover:text-[#00FF66] transition-colors">Reviews</a></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold tracking-wider text-white/60 uppercase mb-4">
              Legal
            </div>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#" className="hover:text-[#00FF66] transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-[#00FF66] transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-[#00FF66] transition-colors">Refund Policy</a></li>
              <li><a href="#" className="hover:text-[#00FF66] transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-8 border-t border-white/5 gap-4">
          <p className="text-xs text-slate-600">
            © 2026 GetSub. All trademarks belong to their respective owners.
          </p>
          <div className="flex items-center gap-3">
            {[Twitter, Instagram, Github].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#00FF66] hover:border-[#00FF66]/50 transition-all"
                data-testid={`social-link-${i}`}
                aria-label="social"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
