import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { reviews } from "../data/products";

export const Testimonials = () => {
  return (
    <section id="reviews" className="relative py-24 lg:py-32" data-testid="reviews-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#00FF66]">
            // Real Customer Reviews
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter">
            Loved by <span className="text-gradient-green">streamers worldwide.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative glass rounded-3xl p-8 hover:border-[#00FF66]/30 transition-all"
              data-testid={`review-${r.id}`}
            >
              <Quote
                className="absolute top-6 right-6 w-8 h-8 text-[#00FF66]/20"
                strokeWidth={1.5}
              />

              {/* Rating */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: r.rating }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="w-4 h-4 fill-[#00FF66] text-[#00FF66]"
                  />
                ))}
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-8">
                "{r.text}"
              </p>

              <div className="flex items-center gap-3 pt-5 border-t border-white/5">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#00FF66]/30"
                />
                <div>
                  <div className="text-sm font-semibold text-white">{r.name}</div>
                  <div className="text-xs text-slate-500">{r.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
