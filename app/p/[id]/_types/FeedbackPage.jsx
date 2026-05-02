"use client";

import { useState } from "react";
import { Star, ChevronRight, Check, ArrowLeft } from "lucide-react";
import WelcomeScreen from "../_components/WelcomeScreen";

export default function FeedbackPage({ page }) {
  const cfg = page.config || {};
  const theme = page.theme || {};
  const primary = theme.primaryColor || "#E5A82A";
  const { businessName, prompt, categories = [], website, thankYouMessage } = cfg;

  const [showWelcome, setShowWelcome] = useState(true);
  const [step, setStep] = useState("category");
  const [category, setCategory] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  function reset() {
    setStep("category");
    setCategory(null);
    setRating(0);
    setComment("");
  }

  if (showWelcome && cfg.welcomeScreenEnabled) {
    return <WelcomeScreen config={cfg} onContinue={() => setShowWelcome(false)} />;
  }

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-5 py-4 flex items-center gap-3" style={{ background: primary, color: "#fff" }}>
          {step !== "category" && step !== "done" && (
            <button onClick={reset} aria-label="Back" className="p-1 -ml-1 hover:bg-white/10 rounded-lg">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <p className="text-sm font-bold tracking-wide uppercase truncate">
            {businessName || "Your feedback"}
          </p>
        </div>

        <div className="p-6 min-h-[320px]">
          {step === "category" && (
            <>
              <h1 className="text-lg font-bold text-ink-900 mb-1">
                {prompt || "Give us your feedback"}
              </h1>
              <p className="text-sm text-ink-500 mb-5">Please select a category to review.</p>
              <div className="space-y-2">
                {categories.length === 0 && (
                  <button
                    onClick={() => { setCategory("General"); setStep("rate"); }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-ink-100 hover:bg-ink-50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-ink-900">General</span>
                    <ChevronRight className="w-4 h-4 text-ink-400" />
                  </button>
                )}
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCategory(c); setStep("rate"); }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-ink-100 hover:bg-ink-50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-ink-900">{c}</span>
                    <ChevronRight className="w-4 h-4 text-ink-400" />
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "rate" && (
            <>
              <p className="text-xs uppercase tracking-wider text-ink-400 font-bold mb-1">{category}</p>
              <h1 className="text-lg font-bold text-ink-900 mb-5">How would you rate this?</h1>
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => { setRating(n); setStep("comment"); }}
                    className="p-1 transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Star
                      className="w-10 h-10"
                      style={{
                        fill: n <= rating ? primary : "transparent",
                        color: n <= rating ? primary : "#D6DAE2",
                      }}
                    />
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "comment" && (
            <>
              <p className="text-xs uppercase tracking-wider text-ink-400 font-bold mb-1">{category} · {rating}★</p>
              <h1 className="text-lg font-bold text-ink-900 mb-3">Anything you'd like to add?</h1>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Optional comments…"
                className="w-full p-3 rounded-xl border border-ink-200 text-sm text-ink-900 placeholder-ink-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
              />
              <button
                onClick={() => setStep("done")}
                className="mt-4 w-full h-11 rounded-md font-bold text-sm text-white"
                style={{ background: primary }}
              >
                Send Feedback
              </button>
            </>
          )}

          {step === "done" && (
            <div className="py-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h1 className="text-lg font-bold text-ink-900 mb-2">Thank you!</h1>
              <p className="text-sm text-ink-500">{thankYouMessage || "Your feedback helps us improve."}</p>
            </div>
          )}
        </div>

        {website && (
          <div className="px-5 py-3 text-center text-xs text-ink-400 border-t border-ink-100">
            <a href={website} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">
              Go to our website
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
