import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Headphones, Award, TrendingDown, RefreshCw } from "lucide-react";

const FEATURES_BG =
  "https://static.prod-images.emergentagent.com/jobs/18baf9a5-9187-4aa2-ab9f-10c428958b00/images/3b0469bfc8f2fb84eeaf846f9daf686546509697ff0fc9daa213659a505781ad.png";

const features = [
  {
    icon: ShieldCheck,
    title: "Bank-Grade Security",
    desc: "256-bit SSL encryption, fraud monitoring, and verified payment processing on every order.",
  },
  {
    icon: Zap,
    title: "Instant Delivery",
    desc: "Credentials land in your inbox within 60 seconds. No waiting, no manual activation.",
  },
  {
    icon: Headphones,
    title: "24/7 Human Support",
    desc: "Real specialists, not bots. Reach our team any time of day, any time of year.",
  },
  {
    icon: TrendingDown,
    title: "Up to 70% Off",
    desc: "Sourced directly from regional partners — you pocket the savings without compromise.",
  },
  {
    icon: RefreshCw,
    title: "Lifetime Warranty",
    desc: "If your plan ever stops working, we replace it free for the full duration. Always.",
  },
  {
    icon: Award,
    title: "100% Authentic",
    desc: "Every subscription is genuine and activated through official channels. Zero ban risk.",
  },
];

export const WhyChooseUs = () => {
  return (
    <section id="why" className="relative py-24 lg:py-32 overflow-hidden" data-testid="why-section">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `url(${FEATURES_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-black/85 to-[#050505]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#00FF66]">
            // Why StreamVault
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter">
            Built for streamers who{" "}
            <span className="text-gradient-green">refuse to overpay.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
              className="group relative glass-dark rounded-2xl p-7 hover:border-[#00FF66]/40 transition-all hover:-translate-y-1"
              data-testid={`feature-${i}`}
            >
              <div className="mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#00FF66]/10 border border-[#00FF66]/20 flex items-center justify-center group-hover:bg-[#00FF66]/20 transition-colors">
                  <f.icon className="w-5 h-5 text-[#00FF66]" strokeWidth={2} />
                </div>
              </div>
              <h3 className="text-lg font-semibold tracking-tight mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          data-testid="stats-strip"
        >
          {[
            ["180k+", "Subscriptions Delivered"],
            ["4.9 / 5", "Avg Rating"],
            ["< 60s", "Avg Delivery Time"],
            ["99.97%", "Order Success Rate"],
          ].map(([num, label]) => (
            <div key={label} className="glass rounded-2xl p-6 text-center">
              <div className="text-2xl lg:text-3xl font-extrabold text-[#00FF66] tracking-tight">{num}</div>
              <div className="text-xs text-slate-500 mt-1 tracking-wide">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
