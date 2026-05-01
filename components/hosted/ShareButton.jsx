"use client";

import { useEffect, useState } from "react";
import { Share2, Check } from "lucide-react";

// Renders nothing during SSR — appears only after hydration so a JS-disabled
// reader never sees a dead button.
export default function ShareButton({ title }) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleShare = async () => {
    const url = window.location.href;
    const shareTitle = title || document.title;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url });
        return;
      } catch {
        // user cancelled or share failed → fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={copied ? "Link copied" : "Share this page"}
      className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/85 backdrop-blur-md shadow-lg flex items-center justify-center text-gray-700 hover:bg-white active:scale-95 transition-all motion-reduce:transition-none motion-reduce:active:scale-100"
    >
      {copied ? (
        <Check className="w-4 h-4 text-emerald-600" />
      ) : (
        <Share2 className="w-4 h-4" />
      )}
    </button>
  );
}
