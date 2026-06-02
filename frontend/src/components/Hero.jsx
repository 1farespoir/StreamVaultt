import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { SiSpotify, SiNetflix, SiYoutube } from "react-icons/si";

const HERO_BG =
  "https://static.prod-images.emergentagent.com/jobs/18baf9a5-9187-4aa2-ab9f-10c428958b00/images/b68974a853f2f60830595a6905b8548393167730c2c9597a9a6cc2537c47d460.png";

export const Hero = () => {
  return (
    <section
      id="top"
      className="relative pt-32 pb-24 lg:pt-44 lg:pb-32 overflow-hidden"
      data-testid="hero-section"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-[#050505]" />
      <div className="absolute inset-0 grid-pattern" />

      {/* Floating glow orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#00FF66]/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#10B981]/15 rounded-full blur-[140px]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00FF66]/30 bg-[#00FF66]/5 mb-8"
            data-testid="hero-badge"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00FF66]" />
            <span className="text-xs font-medium text-[#00FF66] tracking-wider uppercase">
              Up to 70% off Premium Subscriptions
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter leading-[1.05] mb-6"
            data-testid="hero-headline"
          >
            Unlock <span className="text-gradient-green">Premium Streaming</span>
            <br />
            for Less.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed"
            data-testid="hero-subtitle"
          >
            Genuine Spotify, Netflix & YouTube Premium subscriptions delivered to your inbox
            in under 60 seconds. No catches. No hidden fees. Just instant access at a
            fraction of the price.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mb-14"
          >
            <a
              href="#subscriptions"
              className="btn-shine group relative inline-flex items-center gap-2 px-7 h-12 rounded-full bg-[#00FF66] text-black font-semibold text-sm hover:bg-[#00E05A] transition-all glow-green hover:glow-green-strong hover:-translate-y-0.5"
              data-testid="hero-cta-primary"
            >
              Browse Subscriptions
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#why"
              className="inline-flex items-center gap-2 px-7 h-12 rounded-full border border-white/15 text-white text-sm font-medium hover:border-[#00FF66]/60 hover:text-[#00FF66] transition-all"
              data-testid="hero-cta-secondary"
            >
              How it works
            </a>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-slate-400"
            data-testid="hero-trust"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00FF66]" />
              <span>SSL-Secured Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00FF66]" />
              <span>Instant Email Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#00FF66] font-bold">★★★★★</span>
              <span>12,400+ five-star reviews</span>
            </div>
          </motion.div>
        </div>

        {/* Floating service logos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="hidden lg:flex absolute right-0 top-44 flex-col gap-5"
        >
          {[
            { Icon: SiSpotify, color: "#1DB954", delay: 0 },
            { Icon: SiNetflix, color: "#E50914", delay: 0.4 },
            { Icon: SiYoutube, color: "#FF0000", delay: 0.8 },
          ].map(({ Icon, color, delay }, idx) => (
            <motion.div
              key={idx}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay }}
              className="w-20 h-20 rounded-2xl glass-dark flex items-center justify-center hover:border-[#00FF66]/40 transition-all"
              style={{ marginRight: idx === 1 ? 40 : 0 }}
            >
              <Icon className="w-10 h-10" style={{ color }} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
