# StreamVault — Product Requirements Document

## Original Problem Statement
Create a modern, premium e-commerce website called StreamVault with a dark theme and vibrant green accents (emerald/neon green). The website sells discounted subscriptions for streaming and digital services such as Spotify Premium, Netflix, YouTube Premium, Disney+, Amazon Prime Video, ChatGPT Plus, and Canva Pro. Include hero, subscription cards, why-us, reviews, FAQ, cart, checkout, login/dashboard, WhatsApp button. Smooth animations, glassmorphism, Inter/Poppins typography. Premium tech-startup feel.

## User-Chosen Scope (Iteration 1)
- **No login/auth** — shop-only experience.
- **Mocked checkout** — no real payments processed.
- **Only Spotify, Netflix, YouTube Premium** (not Disney+, Prime, ChatGPT, Canva).
- **No WhatsApp support button.**
- **Currency:** USD.

## Architecture
- **Frontend:** React 19 + Tailwind CSS + shadcn/ui + framer-motion + react-icons (SiSpotify/SiNetflix/SiYoutube) + lucide-react + sonner toasts.
- **State:** Client-side cart via React Context (`CartContext`).
- **Backend:** Original FastAPI boilerplate (not used in this iteration; no DB writes).
- **Single route:** `/` with smooth-scroll anchors.

## User Personas
1. **Cost-conscious streamer** — wants Spotify/Netflix/YouTube at discount with instant delivery.
2. **Gift buyer** — purchases multi-month plans for family.

## Core (Static) Requirements
- Dark theme + neon-green accent (#00FF66).
- Outfit (headings) / Poppins (body).
- Glassmorphism cards, neon glow CTAs, smooth animations.
- Mobile-friendly responsive layout.
- `data-testid` on every interactive element.

## What's Been Implemented (Feb 2026 — Iteration 1)
- ✅ Sticky glassmorphism Navbar with cart badge + mobile menu.
- ✅ Hero with animated headline, dual CTA, trust strip, floating brand logos.
- ✅ Subscriptions section — Spotify/Netflix/YouTube cards with 1m/3m/12m plan selector, dynamic pricing, features list, glowing Buy Now.
- ✅ Why-Us section with 6 features + stats strip (180k+ deliveries / 4.9★ / <60s / 99.97%).
- ✅ Testimonials — 3 reviews with avatars and 5-star ratings.
- ✅ FAQ accordion (6 questions).
- ✅ Footer with logo, links, social icons.
- ✅ Cart drawer (shadcn Sheet) with qty controls, remove, subtotal, savings, empty state.
- ✅ Mock checkout dialog with form validation + simulated 1.6s processing + success screen + cart clear.
- ✅ Sonner toast notifications on add-to-cart.
- ✅ 100% testing-agent pass on all critical flows.

## Prioritized Backlog (Future)
### P1
- [ ] Add remaining catalog: Disney+, Prime Video, ChatGPT Plus, Canva Pro.
- [ ] Real Stripe payment integration.
- [ ] Customer dashboard (orders, replacement requests).
- [ ] Email delivery integration (Resend/SendGrid) for mock-or-real delivery.

### P2
- [ ] Auth (JWT or Emergent Google) to support order history.
- [ ] WhatsApp support button.
- [ ] Coupon / referral codes.
- [ ] Admin panel to manage products & inventory.
- [ ] Analytics (conversion tracking).
- [ ] Multi-currency (USD/EUR/INR auto-detect).

### P3
- [ ] i18n / RTL.
- [ ] Add `data-testid` to individual WhyChooseUs feature cards (minor maintainability).
