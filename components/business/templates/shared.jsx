"use client";

import { useState, useCallback } from "react";

// ── Shared Utilities ──────────────────────────────────────────────────────────

export function isOpenNow(businessHours) {
  if (!businessHours?.length) return null;
  const now = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = dayNames[now.getDay()];
  const today = businessHours.find((d) => d.day === todayName);
  if (!today || !today.isOpen) return false;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return today.slots?.some((slot) => {
    const [oh, om] = slot.open.split(":").map(Number);
    const [ch, cm] = slot.close.split(":").map(Number);
    return nowMin >= oh * 60 + om && nowMin <= ch * 60 + cm;
  }) ?? false;
}

export function StarRating({ rating = 5 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i <= rating ? "text-amber-400" : "text-gray-200"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function SocialIcon({ platform }) {
  const icons = {
    instagram: "📸", facebook: "👍", youtube: "▶️", twitter: "𝕏",
    linkedin: "💼", whatsapp: "💬", googlebusiness: "🔍",
    tripadvisor: "🦉", zomato: "🍔", swiggy: "🛵", custom: "🔗",
  };
  return <span>{icons[platform] || "🔗"}</span>;
}

export function ProfilePoweredBy() {
  return (
    <div className="mt-12 py-6 text-center border-t border-gray-100">
      <a
        href="https://webiox.in/business-profile"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        Powered by <strong className="text-brand-600">Webiox</strong> · Create your free business profile →
      </a>
    </div>
  );
}

export function useShareModal(profileUrl) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(profileUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [profileUrl]);

  return { open, setOpen, copied, copy };
}
