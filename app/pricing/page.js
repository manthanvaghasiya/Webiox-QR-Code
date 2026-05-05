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
    tagline: "Perfect to start",
    price: "₹0",
    period: "/month",
    description:
      "Get started with core features. Perfect for individuals and small projects.",
    bullets: [
      "1 business profile",
      "3 QR codes",
      "10 bio-link blocks",
      "Basic analytics",
      "Standard designs",
      "Community support",
    ],
    cta: "Get Started",
    ctaHref: "/auth/signup",
    highlight: false,
  },
  {
    id: "pro",
    icon: Heart,
    name: "Pro",
    tagline: "Most popular",
    price: "₹499",
    period: "/month",
    description:
      "Unlimited profiles and QR codes with AI-powered insights and advanced features.",
    bullets: [
      "Unlimited profiles",
      "Unlimited QR codes (25+ types)",
      "Unlimited bio-link blocks",
      "AI-powered insights",
      "Advanced analytics",
      "Custom designs & themes",
      "Priority support",
      "NFC card ordering",
    ],
    cta: "Start Free Trial",
    ctaHref: "/auth/signup?plan=pro",
    highlight: true,
  },
  {
    id: "business",
    icon: Building2,
    name: "Business",
    tagline: "For enterprises",
    price: "₹1,499",
    period: "/month",
    description:
      "Everything you need for teams. White-label, API access, and dedicated support.",
    bullets: [
      "Everything in Pro",
      "Team collaboration (5+ members)",
      "REST API access",
      "White-label solutions",
      "Custom domain support",
      "Advanced security",
      "Dedicated account manager",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    ctaHref: "mailto:sales@webiox.com",
    highlight: false,
  },
];

const FAQS = [
  {
    q: "Can I try Pro for free?",
    a: "Yes! All Pro plan features come with a 14-day free trial. No credit card required to start.",
  },
  {
    q: "What's the Free plan good for?",
    a: "The Free plan is perfect for trying out Webiox. You get 1 business profile, 3 QR codes, and basic analytics. Upgrade to Pro anytime for unlimited everything.",
  },
  {
    q: "Can I upgrade or downgrade anytime?",
    a: "Absolutely. Change plans anytime and we'll prorate your subscription. Downgrade and your extra profiles stay active until the end of your billing cycle.",
  },
  {
    q: "What are NFC cards?",
    a: "NFC cards are physical tap cards that link directly to your business profile. Customers tap their phone on the card to instantly access your profile, gallery, services, and contact info. Available in PVC, Metal, and Wood with volume discounts.",
  },
  {
    q: "How much do NFC cards cost?",
    a: "NFC cards are available to Pro and Business plan users. Pricing: PVC ₹50/card, Metal ₹150/card, Wood ₹200/card. Volume discounts: 5% at 25+, 10% at 50+, 15% at 100+ cards.",
  },
  {
    q: "Is there a contract or setup fee?",
    a: "No contracts, no setup fees. Pay monthly and cancel anytime. Business plan customers get a dedicated account manager and can negotiate custom pricing.",
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
          <Tag className="w-3.5 h-3.5" /> Transparent Pricing
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-5 leading-[1.05]"
        >
          Simple,{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Transparent
          </span>{" "}
          Pricing
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed"
        >
          Start free, grow with us. No hidden fees, no surprises.
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
                  Most popular
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
                <span className="text-5xl font-bold text-gray-900">{tier.price}</span>
                <span className="text-sm text-gray-500 font-medium">{tier.period}</span>
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
                href={tier.ctaHref}
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
        <p className="text-center text-xs text-gray-500 mt-8">
          All plans include a 14-day free trial. No credit card required.
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
