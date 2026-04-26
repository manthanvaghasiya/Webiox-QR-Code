"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, Heart, Building2, Sparkles, ChevronDown, Tag,
} from "lucide-react";

const TIERS = [
  {
    id: "free",
    icon: Sparkles,
    name: "Free",
    tagline: "For absolutely everyone",
    description:
      "All features, unlimited QR codes, all 22+ types, logos, colors, all export formats. No credit card.",
    bullets: [
      "Unlimited QR codes",
      "All 22+ content types",
      "Logos, colors, gradients",
      "PNG, SVG, WebP exports up to 2000px",
      "No watermark, ever",
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    id: "team",
    icon: Heart,
    name: "Free for Teams",
    tagline: "Same as Free, but you can pretend",
    description:
      "Same as Free. We just put \"team\" in the name so it sounds enterprise-y.",
    bullets: [
      "Everything in Free",
      "Same exact features",
      "Same exact price ($0)",
      "Now with the word \"team\"",
      "Tell your boss it's a paid tier",
    ],
    cta: "Get Started Free",
    highlight: true,
  },
  {
    id: "enterprise",
    icon: Building2,
    name: "Free Enterprise",
    tagline: "Yes, also free",
    description:
      "Yes, also free. Contact us for a custom free plan that's the same as the other free plans.",
    bullets: [
      "Everything in Free for Teams",
      "Same exact features (still)",
      "We'll send a fancy PDF if you want",
      "Custom invoice for $0.00",
      "A handshake on a Zoom call",
    ],
    cta: "Get Started Free",
    highlight: false,
  },
];

const FAQS = [
  {
    q: "Is it really free?",
    a: "Yes. Every feature, every QR type, every export format. No paywall, no trial timer, no credit card. We make money elsewhere — eventually maybe through the API and dynamic-QR analytics, but the generator stays free.",
  },
  {
    q: "What's the catch?",
    a: "There isn't one. Generated QRs work forever, have no watermark, and you can use them commercially. The only thing we ever may charge for is dynamic/trackable QR codes (where you want analytics), and that's still on the roadmap.",
  },
  {
    q: "Do QR codes expire?",
    a: "No. A static QR code is just an encoded string — it's a piece of math, not a service. Once you download it, it works as long as the destination URL works. The QR itself never expires.",
  },
  {
    q: "Can I use them commercially?",
    a: "Absolutely. Use them on menus, business cards, packaging, ads, billboards — whatever. There's no licensing fee, no attribution requirement, and no watermark to remove.",
  },
  {
    q: "Do you track scans?",
    a: "Static QR codes can't be tracked by anyone — they encode a destination directly. We do log generation requests on our server (so we can show you a history if you opt in to dynamic mode), but standard generated QRs don't phone home.",
  },
  {
    q: "What's the difference between Simple and Pro mode?",
    a: "Simple has the 10 most-used types in a clean accordion layout. Pro has 12 advanced types (vCard, payments, file uploads, social bundles) in a wizard layout with a card-based picker. Same engine, same features — just different UX.",
  },
];

function FaqItem({ q, a, isOpen, onToggle }) {
  return (
    <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-lg overflow-hidden transition-shadow hover:shadow-xl">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left group"
      >
        <span className="text-base font-bold text-gray-900">{q}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 pt-1 text-sm text-gray-600 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="animate-gradient-mesh flex-grow flex flex-col w-full">
      {/* Hero */}
      <section className="px-4 sm:px-8 pt-16 pb-12 md:pt-24 max-w-5xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-white/40 shadow-sm text-xs font-bold text-blue-700 uppercase tracking-wider mb-6"
        >
          <Tag className="w-3.5 h-3.5" /> Pricing
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-5 leading-[1.05]"
        >
          Everything is{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            FREE.
          </span>{" "}
          Forever.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed"
        >
          Pick a plan. They&apos;re all $0. We promise.
        </motion.p>
      </section>

      {/* Tier cards */}
      <section className="px-4 sm:px-8 pb-16 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`relative rounded-3xl border backdrop-blur-xl shadow-xl p-7 flex flex-col ${
                tier.highlight
                  ? "border-blue-300 bg-white/90 ring-2 ring-blue-500/20 shadow-blue-600/10"
                  : "border-white/30 bg-white/70"
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                  Most popular (jk, they&apos;re identical)
                </span>
              )}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md mb-4">
                <tier.icon className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{tier.name}</h2>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mt-1 mb-4">
                {tier.tagline}
              </p>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-sm text-gray-500 font-medium">/forever</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-5">{tier.description}</p>
              <ul className="space-y-2.5 mb-7 flex-1">
                {tier.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/generator"
                className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all ${
                  tier.highlight
                    ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-blue-600/20"
                    : "bg-gray-900 hover:bg-black text-white"
                }`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-500 mt-8 italic">
          Yes, all three buttons go to the same generator. Yes, all three plans
          are identical. Yes, this entire page is a bit of a joke.
        </p>
      </section>

      {/* FAQ */}
      <section className="px-4 sm:px-8 pb-24 max-w-3xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 font-medium">
            The most common ones we get. The answer is usually &ldquo;yes, it&apos;s really free.&rdquo;
          </p>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <FaqItem
              key={f.q}
              q={f.q}
              a={f.a}
              isOpen={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
