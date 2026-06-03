export const products = [
  {
    id: "spotify-premium",
    name: "Spotify Premium",
    tagline: "Ad-free music, anywhere.",
    brand: "Spotify",
    icon: "spotify",
    accent: "#1DB954",
    price: 4.99,
    originalPrice: 11.99,
    duration: "1 Month",
    badge: "Best Seller",
    features: [
      "Ad-free music listening",
      "Offline downloads",
      "High-quality audio (320 kbps)",
      "Unlimited skips & on-demand",
      "Works on all devices",
    ],
    plans: [
      { id: "1m", label: "1 Month", price: 4.99, original: 11.99 },
      { id: "3m", label: "3 Months", price: 12.99, original: 35.97 },
      { id: "12m", label: "12 Months", price: 39.99, original: 143.88 },
    ],
  },
  {
    id: "netflix-premium",
    name: "Netflix Premium",
    tagline: "4K Ultra HD on 4 screens.",
    brand: "Netflix",
    icon: "netflix",
    accent: "#E50914",
    price: 7.99,
    originalPrice: 22.99,
    duration: "1 Month",
    badge: "Hot Deal",
    features: [
      "4K Ultra HD streaming",
      "Watch on 4 screens at once",
      "Unlimited movies & TV shows",
      "Download on 6 devices",
      "No ads, no interruptions",
    ],
    plans: [
      { id: "1m", label: "1 Month", price: 7.99, original: 22.99 },
      { id: "3m", label: "3 Months", price: 21.99, original: 68.97 },
      { id: "12m", label: "12 Months", price: 69.99, original: 275.88 },
    ],
  },
  {
    id: "youtube-premium",
    name: "YouTube Premium",
    tagline: "Ad-free videos & YouTube Music.",
    brand: "YouTube",
    icon: "youtube",
    accent: "#FF0000",
    price: 3.99,
    originalPrice: 13.99,
    duration: "1 Month",
    badge: "Save 70%",
    features: [
      "Ad-free YouTube videos",
      "Background play on mobile",
      "YouTube Music Premium included",
      "Offline downloads",
      "YouTube Originals access",
    ],
    plans: [
      { id: "1m", label: "1 Month", price: 3.99, original: 13.99 },
      { id: "3m", label: "3 Months", price: 10.99, original: 41.97 },
      { id: "12m", label: "12 Months", price: 34.99, original: 167.88 },
    ],
  },
];

export const reviews = [
  {
    id: 1,
    name: "Marcus Chen",
    role: "Verified Buyer",
    rating: 5,
    text: "Got my Spotify Premium key in less than 2 minutes. Genuinely the smoothest checkout I've ever experienced. Saved $84 a year — no joke.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc4MDI5MjIzMnww&ixlib=rb-4.1.0&q=85",
  },
  {
    id: 2,
    name: "Sofia Reyes",
    role: "Premium Member",
    rating: 5,
    text: "Netflix Premium at a third of the price and it just works. Already gifted two subscriptions to my family. GetSub is the real deal.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc4MDI5MjIzMnww&ixlib=rb-4.1.0&q=85",
  },
  {
    id: 3,
    name: "Daniel Okafor",
    role: "Yearly Subscriber",
    rating: 5,
    text: "I was skeptical at first — prices looked too good. But the support team is sharp, deliveries are instant, and renewals are seamless. 10/10.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc4MDI5MjIzMnww&ixlib=rb-4.1.0&q=85",
  },
];

export const faqs = [
  {
    q: "How does GetSub offer such steep discounts?",
    a: "We source surplus regional & family-plan inventory directly from authorized partners. By passing those savings to you, we cut up to 70% off retail without any compromise on the service quality.",
  },
  {
    q: "How fast is delivery after I pay?",
    a: "Most orders are delivered to your email instantly — usually under 60 seconds. For high-volume periods, delivery can take up to 5 minutes.",
  },
  {
    q: "Is this safe? Will my account get banned?",
    a: "Every subscription we sell is legitimate and activated through official channels. We have a 0% ban rate across hundreds of thousands of activations.",
  },
  {
    q: "What if my subscription stops working?",
    a: "We back every order with a Lifetime Warranty for the duration of your plan. If anything goes wrong, we replace it free — no questions asked.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes. If we can't fulfill your order or fix an issue within 24 hours, you get a 100% refund — automatically.",
  },
  {
    q: "Do I need to create an account?",
    a: "Nope. GetSub is a no-friction shop. Drop your email at checkout and the credentials land in your inbox seconds later.",
  },
];
