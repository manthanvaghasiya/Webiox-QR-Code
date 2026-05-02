"use client";

import { useState } from "react";
import { Copy, Check, Tag, Sparkles, Calendar } from "lucide-react";
import WelcomeScreen from "../_components/WelcomeScreen";

export default function CouponPage({ page }) {
  const cfg = page.config || {};
  const theme = page.theme || {};
  const primary = theme.primaryColor || "#E11D67";
  const accent = theme.accentColor || "#3F8FD3";
  const {
    businessName, headline, description, discount, code,
    validUntil, ctaUrl, ctaLabel, terms,
  } = cfg;

  const [showWelcome, setShowWelcome] = useState(true);
  const [copied, setCopied] = useState(false);

  function copyCode() {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (showWelcome && cfg.welcomeScreenEnabled) {
    return <WelcomeScreen config={cfg} onContinue={() => setShowWelcome(false)} />;
  }

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-5 py-4" style={{ background: accent, color: "#fff" }}>
          <p className="text-sm font-bold uppercase tracking-widest">{businessName}</p>
        </div>

        {/* Hero */}
        <div className="relative px-6 py-10 text-center" style={{ background: primary, color: "#fff" }}>
          <Sparkles className="absolute top-4 left-4 w-6 h-6 opacity-40" />
          <Sparkles className="absolute top-4 right-4 w-6 h-6 opacity-40" />
          <Sparkles className="absolute bottom-4 left-1/3 w-4 h-4 opacity-30" />
          <Sparkles className="absolute bottom-4 right-1/3 w-4 h-4 opacity-30" />
          <h1 className="text-3xl font-black tracking-tight mb-1">{headline || "Big Holiday Sale"}</h1>
          {discount && (
            <div className="inline-flex items-center gap-1 mt-2 px-4 py-1 rounded-md bg-white/20 backdrop-blur-sm font-bold text-lg">
              {discount}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-6 text-center bg-white">
          {description && (
            <p className="text-sm text-ink-600 leading-relaxed mb-5">{description}</p>
          )}

          {code && (
            <div
              className="rounded-xl border-2 border-dashed py-4 px-3 mb-5"
              style={{ borderColor: primary }}
            >
              <p className="text-[10px] uppercase tracking-widest font-bold text-ink-400 mb-1">
                Coupon Code
              </p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl font-black font-mono tracking-wider" style={{ color: primary }}>
                  {code}
                </p>
                <button
                  onClick={copyCode}
                  aria-label="Copy code"
                  className="p-1.5 rounded-lg text-ink-400 hover:text-ink-900 hover:bg-ink-100 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {validUntil && (
            <p className="flex items-center justify-center gap-1.5 text-xs text-ink-500 mb-4">
              <Calendar className="w-3.5 h-3.5" />
              Valid until {new Date(validUntil).toLocaleDateString()}
            </p>
          )}

          {ctaUrl && (
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full h-11 rounded-md font-bold text-sm text-white"
              style={{ background: primary }}
            >
              <Tag className="w-4 h-4 mr-1.5" />
              {ctaLabel || "Get Coupon"}
            </a>
          )}

          {terms && (
            <p className="mt-4 text-[11px] text-ink-400 leading-relaxed">{terms}</p>
          )}
        </div>
      </div>
    </div>
  );
}
