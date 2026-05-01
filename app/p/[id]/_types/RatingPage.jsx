"use client";

import { useState } from "react";
import { Star, Send, Check } from "lucide-react";

export default function RatingPage({ page }) {
  const cfg = page.config || {};
  const theme = page.theme || {};
  const primary = theme.primaryColor || "#0F4C81";
  const accent = theme.accentColor || "#F09A23";
  const { businessName, question, coverImage, thankYouMessage } = cfg;

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (rating > 0) {
      // In a real app: POST rating to /api/rating-submission
      setSubmitted(true);
    }
  }

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {coverImage && (
          <div className="h-40 overflow-hidden" style={{ background: primary }}>
            <img src={coverImage} alt={businessName} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="px-6 py-4" style={{ background: primary, color: "#fff" }}>
          <p className="text-base font-bold">{businessName || "How was your experience?"}</p>
        </div>

        <div className="p-6 text-center">
          {!submitted ? (
            <>
              <h1 className="text-xl font-bold text-ink-900 mb-6">
                {question || "How was your experience?"}
              </h1>
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(n)}
                    aria-label={`Rate ${n}`}
                    className="p-1 transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Star
                      className="w-10 h-10"
                      style={{
                        fill: n <= (hover || rating) ? accent : "transparent",
                        color: n <= (hover || rating) ? accent : "#D6DAE2",
                      }}
                    />
                  </button>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                disabled={rating === 0}
                className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-md font-bold text-sm text-white disabled:opacity-50 cursor-pointer transition-opacity hover:opacity-90"
                style={{ background: accent }}
              >
                <Send className="w-4 h-4" />
                Send Rating
              </button>
            </>
          ) : (
            <div className="py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h1 className="text-xl font-bold text-ink-900 mb-2">Thank you!</h1>
              <p className="text-sm text-ink-500">
                {thankYouMessage || "Your feedback helps us improve."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
